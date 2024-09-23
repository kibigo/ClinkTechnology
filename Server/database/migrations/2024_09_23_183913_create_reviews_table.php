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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('productId')->onDelete('cascade');
            $table->tinyInteger('isApproved')->default('0')->comment('0 = not approved; 1 = approved');
            $table->tinyInteger('isDelete')->default('0')->comment('0 = not deleted; 1 = deleted');
            $table->tinyInteger('rating')->comment('1 = worst; 2 = bad; 3 = neutral; 4 = good; 5 = excellent');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
