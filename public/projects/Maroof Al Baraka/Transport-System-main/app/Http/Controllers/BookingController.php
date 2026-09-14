<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Vendor;
use App\Models\Route;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['vendor', 'route', 'passengers'])->get();
        $vendors = Vendor::all();
        $routes = Route::all();
        return view(str_replace('-', '_', 'bookings').'.index', compact('bookings', 'vendors', 'routes'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'bookings').'.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'route_id' => 'required|exists:routes,id',
            'pax_count' => 'required|integer|min:1',
            'date' => 'required|date',
            'pickup_time' => 'nullable|date_format:H:i',
            'contact' => 'nullable|string',
            'status' => 'required|in:Pending,Confirmed,Completed,Cancelled',
            'passengers' => 'required|array|min:1',
            'passengers.*.name' => 'required|string',
            'leader_index' => 'required|integer',
        ], [
            'passengers.required' => 'At least one passenger must be added.',
            'passengers.*.name.required' => 'All passengers must have a name.',
        ]);

        $booking = Booking::create($request->except(['passengers', 'leader_index']));
        
        if ($request->has('passengers')) {
            $leaderIndex = $request->input('leader_index', 0);
            foreach ($request->passengers as $index => $passengerData) {
                $booking->passengers()->create([
                    'name' => $passengerData['name'],
                    'nationality' => $passengerData['nationality'] ?? null,
                    'iqama_number' => $passengerData['iqama_number'] ?? null,
                    'phone' => $passengerData['phone'] ?? null,
                    'is_leader' => $index == $leaderIndex,
                ]);
            }
        }

        return redirect()->route('bookings.index');
    }

    public function edit(Booking $booking)
    {
        return view(str_replace('-', '_', 'bookings').'.edit', compact('booking'));
    }

    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'route_id' => 'required|exists:routes,id',
            'pax_count' => 'required|integer|min:1',
            'date' => 'required|date',
            'pickup_time' => 'nullable|date_format:H:i',
            'contact' => 'nullable|string',
            'status' => 'required|in:Pending,Confirmed,Completed,Cancelled',
            'passengers' => 'required|array|min:1',
            'passengers.*.name' => 'required|string',
            'leader_index' => 'required|integer',
        ], [
            'passengers.required' => 'At least one passenger must be added.',
            'passengers.*.name.required' => 'All passengers must have a name.',
        ]);

        $booking->update($request->except(['passengers', 'leader_index']));

        if ($request->has('passengers')) {
            $booking->passengers()->delete(); // Clear old ones or we can sync, but delete/create is easier for simplicity
            $leaderIndex = $request->input('leader_index', 0);
            foreach ($request->passengers as $index => $passengerData) {
                $booking->passengers()->create([
                    'name' => $passengerData['name'],
                    'nationality' => $passengerData['nationality'] ?? null,
                    'iqama_number' => $passengerData['iqama_number'] ?? null,
                    'phone' => $passengerData['phone'] ?? null,
                    'is_leader' => $index == $leaderIndex,
                ]);
            }
        }

        return redirect()->route('bookings.index');
    }

    public function destroy(Booking $booking)
    {
        try {
            $booking->delete();
            return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this booking because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the booking.']);
        }
    }
}