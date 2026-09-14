<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trip;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        $query = Trip::with(['booking.vendor', 'booking.route', 'booking.passengers', 'driver', 'vehicle']);
        
        // Simple search logic
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            
            // Clean search term for ID search (e.g., if user types "DV-000001" or "000001")
            $searchId = preg_replace('/[^0-9]/', '', $search);

            $query->where(function($q) use ($search, $searchId) {
                $q->whereHas('driver', function($driverQuery) use ($search) {
                    $driverQuery->where('name', 'like', "%{$search}%");
                });
                
                if (!empty($searchId)) {
                    $q->orWhere('id', (int)$searchId);
                } else {
                    $q->orWhere('id', 'like', "%{$search}%");
                }
            });
        }

        $trips = $query->orderBy('created_at', 'desc')->get();
        return view('vouchers.index', compact('trips'));
    }
}
