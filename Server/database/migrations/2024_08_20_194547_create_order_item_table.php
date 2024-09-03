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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('orderId')->onDelete('cascade');
            $table->foreignId('productId')->onDelete('cascade');
            $table->string('price');
            $table->string('quantity');
            $table->tinyInteger('isActive')->default('0')->comment('0 = active; 1 = not active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item');
    }
};
