<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RiwayatTransaksi extends Controller
{
    public function index()
    {
        $transactions = Auth::user()->transactions()
            ->latest()
            ->get(['id', 'type', 'amount', 'status', 'description', 'payment_method', 'created_at']);

        return Inertia::render('User/Riwayat', [
            'transactions' => $transactions,
        ]);
    }
}
