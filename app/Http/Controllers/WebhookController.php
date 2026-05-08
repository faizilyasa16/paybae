<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;
use App\Models\User;
use App\Services\XenditService;

class WebhookController extends Controller
{
    protected $xenditService;

    public function __construct(XenditService $xenditService)
    {
        $this->xenditService = $xenditService;
    }

    /**
     * Handle Xendit webhook
     */
    public function xendit(Request $request)
    {
        try {
            // Log webhook data for debugging
            Log::info('Xendit Webhook Received', [
                'headers' => $request->headers->all(),
                'body' => $request->all(),
            ]);

            // Verify webhook signature if needed
            // $isValid = $this->xenditService->verifyWebhookSignature($request);
            // if (!$isValid) {
            //     Log::warning('Invalid webhook signature');
            //     return response()->json(['message' => 'Invalid signature'], 401);
            // }

            $data = $request->all();

            // Handle different webhook events
            switch ($data['event'] ?? null) {
                case 'invoice.paid':
                    $this->handleInvoicePaid($data);
                    break;
                case 'qr.payment':
                    $this->handleQRPayment($data);
                    break;
                case 'ewallet.payment':
                    $this->handleEWalletPayment($data);
                    break;
                case 'va.payment':
                    $this->handleVirtualAccountPayment($data);
                    break;
                default:
                    Log::info('Unhandled webhook event: ' . ($data['event'] ?? 'unknown'));
            }

            return response()->json(['message' => 'Webhook processed successfully']);

        } catch (\Exception $e) {
            Log::error('Webhook processing error: ' . $e->getMessage(), [
                'data' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Error processing webhook'], 500);
        }
    }

    /**
     * Handle invoice paid event
     */
    private function handleInvoicePaid($data)
    {
        $externalId = $data['external_id'] ?? null;
        $paymentId = $data['id'] ?? null;

        if (!$externalId) {
            Log::warning('Invoice paid webhook missing external_id');
            return;
        }

        $transaction = Transaction::where('reference_id', $externalId)->first();

        if (!$transaction) {
            Log::warning('Transaction not found for external_id: ' . $externalId);
            return;
        }

        if ($transaction->status === 'success') {
            Log::info('Transaction already completed: ' . $externalId);
            return;
        }

        // Update transaction status
        $transaction->update([
            'status' => 'success',
            'payment_id' => $paymentId,
        ]);

        // Update user balance
        $user = User::find($transaction->user_id);
        if ($user) {
            $user->increment('balance', $transaction->amount);
            Log::info('User balance updated', [
                'user_id' => $user->id,
                'amount' => $transaction->amount,
                'new_balance' => $user->balance,
            ]);
        }
    }

    /**
     * Handle QR payment event
     */
    private function handleQRPayment($data)
    {
        $qrId = $data['qr_id'] ?? null;
        $amount = $data['amount'] ?? null;

        if (!$qrId) {
            Log::warning('QR payment webhook missing qr_id');
            return;
        }

        $transaction = Transaction::where('payment_id', $qrId)->first();

        if (!$transaction) {
            Log::warning('Transaction not found for qr_id: ' . $qrId);
            return;
        }

        if ($transaction->status === 'success') {
            Log::info('Transaction already completed: ' . $qrId);
            return;
        }

        // Update transaction status
        $transaction->update([
            'status' => 'success',
        ]);

        // Update user balance
        $user = User::find($transaction->user_id);
        if ($user) {
            $user->increment('balance', $transaction->amount);
            Log::info('User balance updated via QR payment', [
                'user_id' => $user->id,
                'amount' => $transaction->amount,
                'new_balance' => $user->balance,
            ]);
        }
    }

    /**
     * Handle E-wallet payment event
     */
    private function handleEWalletPayment($data)
    {
        $ewalletId = $data['ewallet_id'] ?? null;
        $status = $data['status'] ?? null;

        if (!$ewalletId) {
            Log::warning('E-wallet payment webhook missing ewallet_id');
            return;
        }

        $transaction = Transaction::where('payment_id', $ewalletId)->first();

        if (!$transaction) {
            Log::warning('Transaction not found for ewallet_id: ' . $ewalletId);
            return;
        }

        if ($transaction->status === 'success') {
            Log::info('Transaction already completed: ' . $ewalletId);
            return;
        }

        if ($status === 'COMPLETED' || $status === 'SUCCEEDED') {
            // Update transaction status
            $transaction->update([
                'status' => 'success',
            ]);

            // Update user balance
            $user = User::find($transaction->user_id);
            if ($user) {
                $user->increment('balance', $transaction->amount);
                Log::info('User balance updated via E-wallet payment', [
                    'user_id' => $user->id,
                    'amount' => $transaction->amount,
                    'new_balance' => $user->balance,
                ]);
            }
        } elseif ($status === 'FAILED' || $status === 'CANCELLED') {
            $transaction->update(['status' => 'failed']);
            Log::info('E-wallet payment failed/cancelled: ' . $ewalletId);
        }
    }

    /**
     * Handle Virtual Account payment event
     */
    private function handleVirtualAccountPayment($data)
    {
        $vaId = $data['va_id'] ?? null;
        $amount = $data['amount'] ?? null;

        if (!$vaId) {
            Log::warning('Virtual account payment webhook missing va_id');
            return;
        }

        $transaction = Transaction::where('payment_id', $vaId)->first();

        if (!$transaction) {
            Log::warning('Transaction not found for va_id: ' . $vaId);
            return;
        }

        if ($transaction->status === 'success') {
            Log::info('Transaction already completed: ' . $vaId);
            return;
        }

        // Update transaction status
        $transaction->update([
            'status' => 'success',
        ]);

        // Update user balance
        $user = User::find($transaction->user_id);
        if ($user) {
            $user->increment('balance', $transaction->amount);
            Log::info('User balance updated via Virtual Account payment', [
                'user_id' => $user->id,
                'amount' => $transaction->amount,
                'new_balance' => $user->balance,
            ]);
        }
    }

    /**
     * Test webhook for development (simulate successful payment)
     */
    public function testWebhook($transactionId)
    {
        $transaction = Transaction::find($transactionId);

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        if ($transaction->status === 'success') {
            return response()->json(['message' => 'Transaction already completed']);
        }

        // Update transaction status
        $transaction->update(['status' => 'success']);

        // Update user balance
        $user = User::find($transaction->user_id);
        if ($user) {
            $user->increment('balance', $transaction->amount);
            Log::info('User balance updated via test webhook', [
                'user_id' => $user->id,
                'amount' => $transaction->amount,
                'new_balance' => $user->balance,
            ]);
        }

        return response()->json([
            'message' => 'Test webhook processed successfully',
            'transaction' => $transaction,
            'user_balance' => $user ? $user->balance : null
        ]);
    }

    /**
     * Confirm payment manually (for development/testing)
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|integer|exists:transactions,id',
        ]);

        $transaction = Transaction::find($request->transaction_id);

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        }

        if ($transaction->status === 'success') {
            return response()->json(['success' => false, 'message' => 'Transaction already completed']);
        }

        // Update transaction status
        $transaction->update(['status' => 'success']);

        // Update user balance
        $user = User::find($transaction->user_id);
        if ($user) {
            $user->increment('balance', $transaction->amount);
            Log::info('Payment confirmed via API', [
                'user_id' => $user->id,
                'amount' => $transaction->amount,
                'new_balance' => $user->balance,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmed successfully',
        ]);
    }
}
