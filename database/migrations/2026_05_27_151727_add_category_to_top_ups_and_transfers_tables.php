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
        Schema::table('top_ups', function (Blueprint $table) {
            $table->string('category')->nullable()->after('amount');
        });

        Schema::table('transfers', function (Blueprint $table) {
            $table->string('category')->nullable()->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('top_ups', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        Schema::table('transfers', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
