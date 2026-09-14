<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::with('driver')->get();
        return view(str_replace('-', '_', 'vehicles').'.index', compact('vehicles'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'vehicles').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|unique:vehicles,plate_number',
            'model' => 'required|string',
            'capacity' => 'required|numeric',
            'status' => 'required|string',
        ], [
            'plate_number.unique' => 'This plate number is already registered to another vehicle.',
        ]);
        Vehicle::create($validated);
        return redirect()->route('vehicles.index');
    }

    public function edit(Vehicle $vehicle)
    {
        return view(str_replace('-', '_', 'vehicles').'.edit', compact('vehicle'));
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|unique:vehicles,plate_number,' . $vehicle->id,
            'model' => 'required|string',
            'capacity' => 'required|numeric',
            'status' => 'required|string',
        ], [
            'plate_number.unique' => 'This plate number is already registered to another vehicle.',
        ]);
        $vehicle->update($validated);
        return redirect()->route('vehicles.index');
    }

    public function destroy(Vehicle $vehicle)
    {
        try {
            $vehicle->delete();
            return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this vehicle because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the vehicle.']);
        }
    }
}