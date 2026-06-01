<?php

namespace App\Http\Controllers;

use App\Models\TopUp;
use App\Models\Transfer;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    /**
     * @dev Process Xendit Virtual Account payment webhook (Top Up)
     */
    public function topUp(Request $request)
    {
        if (!$this->verifyToken($request)) {
            Log::warning("Xendit TopUp Webhook: token tidak valid.", [
                "ip" => $request->ip(),
                "token" => $request->header("x-callback-token"),
            ]);
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $data = $request->all();

        if (empty($data["external_id"])) {
            return response()->json(["message" => "Missing external_id"], 400);
        }

        DB::transaction(function () use ($data) {
            $topUp = TopUp::where("external_id", $data["external_id"])
                ->lockForUpdate()
                ->first();

            if (!$topUp) {
                return;
            }

            if ($topUp->status !== "PENDING") {
                return;
            }

            $topUp->update(["status" => "PAID"]);

            $wallet = Wallet::firstOrCreate(
                ["user_id" => $topUp->user_id],
                ["balance" => 0],
            );
            $wallet->increment("balance", $topUp->amount);

        });

        return response()->json(["message" => "OK"]);
    }

    /**
     * @dev Process Xendit Disbursement Payment webhook (Transfer status)
     */
    public function transfer(Request $request)
    {
        if (!$this->verifyToken($request)) {
            Log::warning("Xendit Transfer Webhook: token tidak valid.", [
                "ip" => $request->ip(),
                "token" => $request->header("x-callback-token"),
            ]);
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $data = $request->all();

        if (empty($data["external_id"]) || empty($data["status"])) {
            return response()->json(
                ["message" => "Missing required fields"],
                400,
            );
        }

        DB::transaction(function () use ($data) {
            $transfer = Transfer::where("external_id", $data["external_id"])
                ->lockForUpdate()
                ->first();

            if (!$transfer) {
                return;
            }

            if ($transfer->status !== "PENDING") {
                return;
            }

            $xenditStatus = strtoupper($data["status"]);

            if ($xenditStatus === "COMPLETED") {
                $transfer->update(["status" => "COMPLETED"]);

            } elseif ($xenditStatus === "FAILED") {
                $refundAmount = $transfer->amount + $transfer->fee;

                $wallet = Wallet::firstOrCreate(
                    ["user_id" => $transfer->user_id],
                    ["balance" => 0],
                );
                $wallet->increment("balance", $refundAmount);

                $transfer->update(["status" => "FAILED"]);
            }
        });

        return response()->json(["message" => "OK"]);
    }

    /**
     * Verifikasi token webhook dari Xendit.
     * Menggunakan hash_equals untuk mencegah timing attack.
     */
    private function verifyToken(Request $request): bool
    {
        $incomingToken = (string) $request->header("x-callback-token");
        $expectedToken = (string) config("xendit.webhook_token");

        if (empty($expectedToken)) {
            // Jika token belum dikonfigurasi, log warning & tolak
            Log::warning(
                "Xendit Webhook: XENDIT_WEBHOOK_TOKEN belum dikonfigurasi di .env!",
            );
            return false;
        }

        return hash_equals($expectedToken, $incomingToken);
    }
}
