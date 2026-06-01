<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    protected $fillable = [
        'user_id',
        'external_id',
        'bank_code',
        'account_number',
        'account_holder_name',
        'amount',
        'category',
        'fee',
        'description',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee'    => 'decimal:2',
    ];

    /**
     * Relasi ke User (transfer dilakukan oleh satu user).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
