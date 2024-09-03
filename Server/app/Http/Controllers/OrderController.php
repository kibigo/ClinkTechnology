<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shipment;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function order()
    {
        $order = Order::getOrders();

        return response()->json($order);
    }


    public function singleOrderItems($orderId)
    {
        $singleOrder = OrderItem::getOrderItems($orderId);

        $shipment = Shipment::getShipment($orderId);

        return response()->json([
            'order' => $singleOrder,
            'shipment' => $shipment
        ]);
    }


    public function addQuantity($itemId)
    {
        $item =OrderItem::find($itemId);

        if(!$item)
        {
            return response()->json([
                'message' => 'Item not found'
            ]);
        }

        $item->quantity += 1;

        $item->save();
        
        return response()->json([
            'message' => 'Item updated'
        ]);
    }

    public function subtractQuantity($itemId)
    {
        $item =OrderItem::find($itemId);

        if(!$item)
        {
            return response()->json([
                'message' => 'Item not found'
            ]);
        }

        $item->quantity -= 1;

        if($item->quantity < 2)
        {
            $item->quantity = 1;

            $item->save();
        }

        $item->save();
        
        return response()->json([
            'message' => 'Item updated'
        ]);
    }


    public function delete($itemId)
    {
        $item =OrderItem::find($itemId);

        if(!$item)
        {
            return response()->json([
                'message' => 'Item not found'
            ]);
        }

        $item->isActive = 1;

        $item->save();

        return response()->json([
            'message' => 'Item removed'
        ]);
    }
    
}
