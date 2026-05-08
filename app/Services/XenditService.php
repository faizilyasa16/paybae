<?php

namespace App\Services;

use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\PaymentRequest\PaymentMethodParameters;
use Xendit\PaymentRequest\PaymentRequestApi;
use Xendit\PaymentRequest\PaymentRequestParameters;
use Xendit\PaymentRequest\PaymentMethodType;
use Xendit\PaymentRequest\PaymentMethodReusability;
use Xendit\PaymentRequest\PaymentRequestCurrency;
use Xendit\PaymentRequest\EWalletParameters;
use Xendit\PaymentRequest\EWalletChannelProperties;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class XenditService
{
    protected $invoiceApi;
    protected $paymentRequestApi;

    public function __construct()
    {
        Configuration::setXenditKey(config('xendit.secret_key'));

        $this->invoiceApi = new InvoiceApi();
        $this->paymentRequestApi = new PaymentRequestApi();
    }

    // ================= INVOICE =================
    public function createInvoice($data)
    {
        return $this->invoiceApi->createInvoice([
            'external_id' => $data['external_id'],
            'amount' => $data['amount'],
            'description' => $data['description'],
            'currency' => config('xendit.currency'),
        ]);
    }

    // ================= QRIS (FIX TANPA SDK) =================
    public function createQRIS($data)
    {
        $response = Http::withBasicAuth(config('xendit.secret_key'), '')
            ->post('https://api.xendit.co/qr_codes', [
                'reference_id' => $data['external_id'], // WAJIB
                'type' => 'DYNAMIC',
                'currency' => 'IDR',
                'amount' => $data['amount'],
            ]);

        if ($response->failed()) {
            throw new \Exception($response->body());
        }

        return $response->json();
    }

    public function getQRCode($qrId)
    {
        $response = Http::withBasicAuth(config('xendit.secret_key'), '')
            ->get("https://api.xendit.co/qr_codes/{$qrId}");

        if ($response->failed()) {
            throw new \Exception($response->body());
        }

        return $response->json();
    }

    // ================= E-WALLET =================
    public function createEWalletPayment($data)
    {
        $paymentMethod = new PaymentMethodParameters([
            'type' => PaymentMethodType::EWALLET,
            'reusability' => PaymentMethodReusability::ONE_TIME_USE,
            'ewallet' => new EWalletParameters([
                'channel_code' => strtoupper($data['ewallet_type']),
                'channel_properties' => new EWalletChannelProperties([
                    'success_return_url' => $data['success_redirect_url'] ?? null,
                ]),
            ]),
            'reference_id' => $data['external_id'],
        ]);

        $paymentRequest = new PaymentRequestParameters([
            'reference_id' => $data['external_id'],
            'amount' => $data['amount'],
            'currency' => PaymentRequestCurrency::IDR,
            'payment_method' => $paymentMethod,
            'description' => $data['description'] ?? null,
            'customer' => $data['customer'] ?? null,
        ]);

        return $this->paymentRequestApi->createPaymentRequest(
            null,
            null,
            null,
            $paymentRequest
        );
    }

    // ================= BANK TRANSFER (DISBURSEMENT) =================
    public function createBankTransfer($data)
    {
        $response = Http::withBasicAuth(config('xendit.secret_key'), '')
            ->post('https://api.xendit.co/disbursements', [
                'external_id' => $data['external_id'],
                'bank_code' => $data['bank_code'],
                'account_holder_name' => $data['account_holder_name'],
                'account_number' => $data['account_number'],
                'description' => $data['description'],
                'amount' => $data['amount'],
            ]);

        if ($response->failed()) {
            throw new \Exception('Bank transfer failed: ' . $response->body());
        }

        return $response->json();
    }

    // ================= VIRTUAL ACCOUNT =================
    public function createVirtualAccount($data)
    {
        $response = Http::withBasicAuth(config('xendit.secret_key'), '')
            ->post('https://api.xendit.co/callback_virtual_accounts', [
                'external_id' => $data['external_id'],
                'bank_code' => $data['bank_code'],
                'name' => $data['name'],
                'expected_amount' => $data['expected_amount'],
            ]);

        if ($response->failed()) {
            throw new \Exception('Virtual account creation failed: ' . $response->body());
        }

        return $response->json();
    }

    public function getEWalletCharge($chargeId)
    {
        throw new \Exception('Method not implemented yet');
    }
}