<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Xendit Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Xendit payment gateway integration.
    | You can find your API keys in your Xendit dashboard.
    |
    */

    'api_key' => env('XENDIT_API_KEY', ''),
    'secret_key' => env('XENDIT_SECRET_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Xendit Environment
    |--------------------------------------------------------------------------
    |
    | Set to 'production' for live transactions or 'sandbox' for testing.
    |
    */
    'environment' => env('XENDIT_ENVIRONMENT', 'sandbox'),

    /*
    |--------------------------------------------------------------------------
    | Xendit Webhook Token
    |--------------------------------------------------------------------------
    |
    | Token for webhook verification. Generate this in your Xendit dashboard.
    |
    */
    'webhook_token' => env('XENDIT_WEBHOOK_TOKEN', ''),

    /*
    |--------------------------------------------------------------------------
    | Payment Methods
    |--------------------------------------------------------------------------
    |
    | Available payment methods for Xendit integration.
    |
    */
    'payment_methods' => [
        'bank_transfer' => [
            'name' => 'Bank Transfer',
            'channels' => ['BCA', 'BNI', 'BRI', 'Mandiri', 'Permata'],
        ],
        'ewallet' => [
            'name' => 'E-Wallet',
            'channels' => ['OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'],
        ],
        'qris' => [
            'name' => 'QRIS',
            'channels' => ['QRIS'],
        ],
        'credit_card' => [
            'name' => 'Credit Card',
            'channels' => ['CREDIT_CARD'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | Default currency for transactions.
    |
    */
    'currency' => env('XENDIT_CURRENCY', 'IDR'),
];