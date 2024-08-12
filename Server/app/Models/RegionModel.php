<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegionModel extends Model
{
    use HasFactory;

    protected $table = 'region';


    protected $fillable = ['name'];


    public function destination()
    {
        return $this->hasMany(DestinationModel::class);
    }
}
