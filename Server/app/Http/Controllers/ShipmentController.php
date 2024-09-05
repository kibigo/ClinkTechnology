<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function getShipment($id)
    {
        $shipment = Shipment::find($id);

        return response()->json($shipment);
    }
}
