<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('shipment')->insert([
            [
                'regionName' => 'Nairobi',
                'orderId' => 68,
                'phone' => '254712908471',
                'country' => 'Kenya',
                'city' => 'Nairobi',
                'address' => '4th street',
                'price' => 150,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'regionName' => 'Kisumu',
                'orderId' => 67,
                'phone' => '254775637124',
                'country' => 'Kenya',
                'city' => 'Kisumu',
                'address' => 'Dala City',
                'price' => 300,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);
    }
}


