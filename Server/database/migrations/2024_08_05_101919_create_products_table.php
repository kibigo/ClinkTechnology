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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description');
            $table->string('price');
            $table->string('quantity');
            $table->tinyInteger('is_delete')->default('0')->comment('0 = not deleted; 1 = deleted');
            $table->tinyInteger('category')
            ->comment('0 = computer_accessories; 1 = development_platform; 2 = aeronautics and robotics; 3 = battery and chargers; 4 = electronic components;
            5 = gyro and accelerometer; 6 = integrated circuits; 7 = lcds and displays; 8 = microcontrollers; 9 = programmers; 10 = prototyping and tools
            ');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
