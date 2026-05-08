<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Auth;
=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
use Inertia\Inertia;

class RiwayatTransaksi extends Controller
{
    public function index()
    {
<<<<<<< HEAD
        $transactions = Auth::user()->transactions()
            ->latest()
            ->get(['id', 'type', 'amount', 'status', 'description', 'payment_method', 'created_at']);

        return Inertia::render('User/Riwayat', [
            'transactions' => $transactions,
        ]);
=======
        return Inertia::render('User/Riwayat');
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
    }
}
