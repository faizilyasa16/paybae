<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'reference_id',
        'type',
        'amount',
        'status',
        'description',
        'payment_method',
        'payment_id',
        'payment_url',
        'bank_code',
        'recipient_account',
        'recipient_name',
        'recipient_bank',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
