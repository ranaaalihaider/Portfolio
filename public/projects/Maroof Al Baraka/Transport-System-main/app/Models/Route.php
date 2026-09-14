<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use \App\Traits\LogsActivity;

    /** @use HasFactory<\Database\Factories\RouteFactory> */
    use HasFactory;
    protected $guarded = [];
}
