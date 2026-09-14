<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingCar extends Model
{
    use \App\Traits\LogsActivity;

    protected $fillable = ['route', 'name', 'subtitle', 'label', 'image_path', 'sort_order'];
}
