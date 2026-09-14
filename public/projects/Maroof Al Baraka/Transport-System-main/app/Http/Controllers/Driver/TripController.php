<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\Request;

class TripController extends Controller
{
    public function index()
    {
        $driverId = auth()->user()->driver->id;
        $trips = Trip::with(['booking.route', 'vehicle'])->where('driver_id', $driverId)->orderBy('date', 'desc')->get();
        return view('driver.trips.index', compact('trips'));
    }

    public function updateStatus(Request $request, Trip $trip)
    {
        if ($trip->driver_id !== auth()->user()->driver->id) abort(403);
        $validated = $request->validate(['status' => 'required|in:Scheduled,In Progress,Completed,Cancelled']);
        $trip->update(['status' => $validated['status']]);
        return back()->with('success', 'Trip status updated!');
    }
}
