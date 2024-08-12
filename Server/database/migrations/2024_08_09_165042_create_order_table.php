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
        Schema::create('order', function (Blueprint $table) {
            $table->id();
            $table->string('totalPrice');
            $table->foreignId('userId')->onDelete('cascade');
            $table->tinyInteger('isDelivered')->default('0')->comment('0 = not delivered; 1 = delivered');
            $table->string('transactionId')->nullable();
            $table->tinyInteger('isPaid')->default('0')->comment('0 = paid; 1 = not paid');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
