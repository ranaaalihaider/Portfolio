<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use \App\Traits\LogsActivity;

    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;
    protected $guarded = [];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function passengers()
    {
        return $this->hasMany(Passenger::class);
    }
}
