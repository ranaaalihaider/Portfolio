<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use \App\Traits\LogsActivity;

    /** @use HasFactory<\Database\Factories\VendorFactory> */
    use HasFactory;
    protected $guarded = [];
}
