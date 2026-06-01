<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopUp extends Model
{
    /**
     * Nama tabel secara eksplisit karena nama model (TopUp) tidak otomatis
     * di-resolve menjadi 'top_ups' di beberapa versi Laravel.
     */
    protected $table = 'top_ups';

    protected $fillable = [
        'user_id',
        'external_id',
        'virtual_account_number',
        'bank_code',
        'amount',
        'category',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'amount'     => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    /**
     * Relasi ke User (top up dilakukan oleh satu user).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
