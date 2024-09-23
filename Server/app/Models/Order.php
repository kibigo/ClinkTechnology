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
                    ->orderBy('order.created_at', 'desc')
                    ->get();
    }

    static public function getInvoice($orderId)
    {
        $return = self::select('order.*', 'order_items.id as orderItemId', 'order_items.name as itemName', 'order_items.price as itemPrice', 'order_items.quantity as itemQuantity', 'users.first_name as firstName', 'users.last_name as lastName', 'users.phone_number as phoneNumber', 'users.email as email')
                    ->where('order.id', '=', $orderId)
                    ->join('users', 'users.id', '=', 'order.userId')
                    ->join('order_items', 'order_items.orderId', 'order.id')
                    ->where('order_items.isActive', '=', 0)
                    ->get();

        $formatted = $return->groupBy('id')->map(function($orderGroup){
            $order = $orderGroup->first();


            $order->order_items = $orderGroup->map(function($item){
                return[
                    'id' => $item->orderItemId,
                    'name' => $item->itemName,
                    'price' => $item->itemPrice,
                    'quantity' => $item->itemQuantity
                ];
            })->values();

            unset($order->orderItemId, $order->ItemName);

            return $order;
        });
        return $formatted->values();
    }

}


