<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'payment_method')) {
                $table->enum('payment_method', ['bank_transfer', 'qris', 'gopay', 'ovo', 'dana'])
                    ->nullable()
                    ->after('description');
            }

            if (!Schema::hasColumn('transactions', 'payment_id')) {
                $table->string('payment_id')->nullable()->after('payment_method');
            }

            if (!Schema::hasColumn('transactions', 'payment_url')) {
                $table->string('payment_url')->nullable()->after('payment_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            if (Schema::hasColumn('transactions', 'payment_url')) {
                $table->dropColumn('payment_url');
            }

            if (Schema::hasColumn('transactions', 'payment_id')) {
                $table->dropColumn('payment_id');
            }

            if (Schema::hasColumn('transactions', 'payment_method')) {
                $table->dropColumn('payment_method');
            }
        });
    }
};
