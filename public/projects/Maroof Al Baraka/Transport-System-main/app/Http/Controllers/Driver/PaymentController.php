<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\DriverPayment;

class PaymentController extends Controller
{
    public function index()
    {
        $driverId = auth()->user()->driver->id;
        $payments = DriverPayment::where('driver_id', $driverId)->orderBy('date', 'desc')->get();
        return view('driver.payments.index', compact('payments'));
    }
}
