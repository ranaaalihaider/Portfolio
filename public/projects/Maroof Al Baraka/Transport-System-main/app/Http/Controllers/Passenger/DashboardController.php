<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Booking;

class DashboardController extends Controller
{
    public function index()
    {
        $passenger = auth()->user()->passenger;
        $booking = null;
        if ($passenger && $passenger->booking_id) {
            $booking = Booking::with('route', 'vendor')->find($passenger->booking_id);
        }
        return view('passenger.dashboard', compact('booking'));
    }
}
