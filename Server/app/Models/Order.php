<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'order';

    protected $fillable = [
        'totalPrice',
        'userId',
        'isDelivered',
        'transactionId',
        'isPaid'
    ];


    public function orderItem()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }

    public function shipment()
    {
        return $this->hasMany(Shipment::class, 'orderId');
    }


    static public function getOrders()
    {
        return self::select('order.*', 'users.first_name as firstName', 'users.last_name as lastName', 'users.email as email')
                    ->join('users', 'users.id', 'order.userId')
                    ->get();
    }


}
