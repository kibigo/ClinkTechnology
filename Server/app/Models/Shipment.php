<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $table = 'shipment';


    protected $fillable = [
        'regionName',
        'orderId',
        'phone',
        'country',
        'city',
        'address',
        'price'
    ];


    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }


    static public function getShipment($id)
    {
        return self::select('shipment.*')
                        ->where('orderId', $id)
                        ->first();
    }
}
