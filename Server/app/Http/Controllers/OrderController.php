<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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


    public function viewInvoice($orderId)
    {
        $order = Order::getInvoice($orderId);

        if(!$order)
        {
            return response()->json([
                'message' => 'Order not found'
            ]);
        }

        return view('invoice.generate_invoice', compact('order'));

        // $order = Order::getInvoice($orderId);
        // return response()->json($order);

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


    //get single orderItem
    public function singleItem($id)
    {
        $item = OrderItem::find($id);

        if(!$item)
        {
            return response()->json([
                'message' => 'Product not found'
            ]);
        }

        return response()->json($item);
    }

    public function updateSingleItem(Request $request, $id)
    {
        $validateData = Validator::make($request->all(), [
            'name' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric'
        ]);

        if($validateData->fails())
        {
            return response()->json($validateData->errors());
        }

        $validatedData = $validateData->validated();

        $item = OrderItem::find($id);

        if(!$item)
        {
            return response()->json([
                'message' => 'Product not found'
            ]);
        }

        $item->update($validatedData);


        return response()->json([
            'message' => 'Item updated'
        ]);


    }


    public function deleteOrderItem($id)
    {
        $item = OrderItem::find($id);

        if(!$item)
        {
            return response()->json([
                'message' => 'Product not found'
            ]);
        }

        $item->isActive = 1;
        
        $item->save();


        return response()->json([
            'message' => 'Item deleted'
        ]);
    }


    public function updateOrderStatus($id)
    {
        $order = Order::find($id);

        if(!$order)
        {
            return response()->json([
                'message' => 'Order not found'
            ]);
        }

        $status = $order->orderJourney;

        if($status == 0)
        {
            $order->orderJourney = 1;

            $order->save();

            return response()->json([
                'message' => 'Order Updated'
            ]);

        }

        if($status == 1)
        {
            $order->orderJourney = 2;

            $order->save();

            return response()->json([
                'message' => 'Order Updated'
            ]);

        }


    }
    
}
