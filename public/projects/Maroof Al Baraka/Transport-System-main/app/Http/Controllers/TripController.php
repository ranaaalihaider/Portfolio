<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class TripController extends Controller
{
    public function index(Request $request)
    {
        $query = Trip::with(['booking.vendor', 'booking.route', 'booking.passengers', 'driver', 'vehicle']);
        
        if ($request->has('filter') && $request->filter === 'today') {
            $query->whereDate('trips.date', today());
        }
        
        if ($request->has('sort') && $request->sort === 'pickup_time') {
            $query->join('bookings', 'trips.booking_id', '=', 'bookings.id')
                  ->orderBy('bookings.pickup_time', 'asc')
                  ->select('trips.*');
        } else {
            $query->orderBy('trips.date', 'desc'); // Default sort, optional
        }
        
        $trips = $query->get();
        $bookings = Booking::all();
        $drivers = Driver::with('vehicle')->get();
        $vehicles = Vehicle::all();
        return view(str_replace('-', '_', 'trips').'.index', compact('trips', 'bookings', 'drivers', 'vehicles'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'trips').'.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'driver_vehicle' => 'required|string',
            'date' => 'required|date',
            'amount' => 'nullable|numeric',
            'status' => 'required|in:Scheduled,In Progress,Completed,Cancelled',
        ], [
            'driver_vehicle.required' => 'Please select a driver and vehicle.',
        ]);

        $data = $request->all();
        if (!empty($data['driver_vehicle'])) {
            $parts = explode('_', $data['driver_vehicle']);
            if (count($parts) === 2) {
                $data['driver_id'] = $parts[0];
                $data['vehicle_id'] = $parts[1];
            }
        }
        unset($data['driver_vehicle']);
        Trip::create($data);
        return redirect()->route('trips.index');
    }

    public function edit(Trip $trip)
    {
        return view(str_replace('-', '_', 'trips').'.edit', compact('trip'));
    }

    public function update(Request $request, Trip $trip)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'driver_vehicle' => 'required|string',
            'date' => 'required|date',
            'amount' => 'nullable|numeric',
            'status' => 'required|in:Scheduled,In Progress,Completed,Cancelled',
        ], [
            'driver_vehicle.required' => 'Please select a driver and vehicle.',
        ]);

        $data = $request->all();
        if (!empty($data['driver_vehicle'])) {
            $parts = explode('_', $data['driver_vehicle']);
            if (count($parts) === 2) {
                $data['driver_id'] = $parts[0];
                $data['vehicle_id'] = $parts[1];
            }
        }
        unset($data['driver_vehicle']);
        $trip->update($data);
        return redirect()->route('trips.index');
    }

    public function voucher(Trip $trip)
    {
        $trip->load(['booking.route', 'booking.vendor', 'vehicle', 'driver']);
        return view('trips.voucher', compact('trip'));
    }

    public function downloadPdf(Trip $trip)
    {
        // Check for required PHP extensions
        if (!extension_loaded('gd') && !extension_loaded('imagick')) {
            return response()->json([
                'error' => 'PDF generation requires the PHP GD extension. Please enable "gd" in your Hostinger hPanel → PHP Configuration → Extensions.'
            ], 500);
        }

        $trip->load(['booking.route', 'booking.vendor', 'vehicle', 'driver', 'booking.passengers']);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('trips.voucher-pdf', compact('trip'));
        $pdf->setPaper('A4', 'portrait');
        $pdf->set_option('enable_remote', true);
        $pdf->set_option('chroot', public_path());
        $pdf->set_option('isHtml5ParserEnabled', true);
        $pdf->set_option('isRemoteEnabled', true);
        
        $filename = 'Trip_Voucher_' . $trip->id . '_' . \Carbon\Carbon::parse($trip->date)->format('Y_m_d') . '.pdf';
        
        return $pdf->download($filename);
    }

    public function voucher2(Trip $trip)
    {
        $trip->load(['booking.route', 'booking.vendor', 'vehicle', 'driver']);
        return view('trips.voucher2', compact('trip'));
    }

    public function downloadPdf2(Trip $trip)
    {
        // Check for required PHP extensions
        if (!extension_loaded('gd') && !extension_loaded('imagick')) {
            return response()->json([
                'error' => 'PDF generation requires the PHP GD extension. Please enable "gd" in your Hostinger hPanel → PHP Configuration → Extensions.'
            ], 500);
        }

        $trip->load(['booking.route', 'booking.vendor', 'vehicle', 'driver', 'booking.passengers']);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('trips.voucher-pdf2', compact('trip'));
        $pdf->setPaper('A4', 'portrait');
        $pdf->set_option('enable_remote', true);
        $pdf->set_option('chroot', public_path());
        $pdf->set_option('isHtml5ParserEnabled', true);
        $pdf->set_option('isRemoteEnabled', true);
        
        $filename = 'MyCompany_Trip_Voucher_' . $trip->id . '_' . \Carbon\Carbon::parse($trip->date)->format('Y_m_d') . '.pdf';
        
        return $pdf->download($filename);
    }

    public function destroy(Trip $trip)
    {
        try {
            $trip->delete();
            return redirect()->route('trips.index')->with('success', 'Trip deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this trip because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the trip.']);
        }
    }
}