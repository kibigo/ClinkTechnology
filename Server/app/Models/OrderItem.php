<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'name',
        'productId',
        'orderId',
        'price',
        'quantity'
    ];


    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }


    static public function getOrderItems($id)
    {
        return self::select('order_items.*', 'products.name as product_name')
                    ->join('products', 'products.id', 'order_items.productId')
                    ->where('order_items.orderId', $id)
                    ->where('isActive', 0)
                    ->get();
    }
}
