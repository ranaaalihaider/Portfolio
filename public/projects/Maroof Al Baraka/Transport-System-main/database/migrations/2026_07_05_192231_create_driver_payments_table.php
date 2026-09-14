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
        Schema::create('driver_payments', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('driver_id')->constrained('drivers')->restrictOnDelete();
            $table->enum('type', ['Advance', 'Salary', 'Trip Bonus', 'Deduction']);
            $table->decimal('amount', 10, 2);
            $table->string('method')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_payments');
    }
};
