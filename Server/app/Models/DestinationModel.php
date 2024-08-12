<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DestinationModel extends Model
{
    use HasFactory;

    protected $table = 'destination';

    protected $fillable = [
        'region_id',
        'name',
        'price'
    ];


    static public function getDestination()
    {
        return self::select('destination.*', 'region.name as region_name')
                        ->join('region', 'region.id', 'destination.region_id')
                        ->get();
    }


    public function region()
    {
        return $this->belongsTo(RegionModel::class);
    }
}
