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
        Schema::table('drivers', function (Blueprint $table) {
            $table->string('iqama_number')->nullable()->after('name');
            $table->date('iqama_expiry')->nullable()->after('iqama_number');
            $table->date('license_expiry')->nullable()->after('license_number');
            $table->string('picture')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['iqama_number', 'iqama_expiry', 'license_expiry', 'picture']);
        });
    }
};
