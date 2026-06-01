<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        "name",
        "email",
        "no_rekening",
        "tanggal_lahir",
        "password",
        "pin",
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = ["password", "pin", "remember_token"];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Relasi ke Wallet (satu user punya satu wallet).
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Relasi ke TopUp (satu user bisa punya banyak top up).
     */
    public function topUps()
    {
        return $this->hasMany(TopUp::class);
    }

    /**
     * Relasi ke Transfer (satu user bisa punya banyak transfer).
     */
    public function transfers()
    {
        return $this->hasMany(Transfer::class);
    }
}
