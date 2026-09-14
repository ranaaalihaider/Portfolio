<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Trip;

class DashboardController extends Controller
{
    public function index()
    {
        $driverId = auth()->user()->driver->id;
        $todayTrips = Trip::where('driver_id', $driverId)->whereDate('date', today())->count();
        $upcomingTrips = Trip::with(['booking.route', 'vehicle'])->where('driver_id', $driverId)->whereDate('date', '>=', today())->orderBy('date', 'asc')->take(5)->get();
        return view('driver.dashboard', compact('todayTrips', 'upcomingTrips'));
    }
}
