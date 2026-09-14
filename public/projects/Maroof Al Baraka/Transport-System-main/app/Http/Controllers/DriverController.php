<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = Driver::with(['user', 'vehicle'])->get();
        $vehicles = \App\Models\Vehicle::all();
        return view(str_replace('-', '_', 'drivers').'.index', compact('drivers', 'vehicles'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'drivers').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'license_number' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|string',
            'vehicle_id' => 'nullable|exists:vehicles,id|unique:drivers,vehicle_id',
            'iqama_number' => 'nullable|string',
            'iqama_expiry' => 'nullable|date',
            'license_expiry' => 'nullable|date',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'vehicle_id.unique' => 'This vehicle is already assigned to another driver. Please select a different vehicle or unlink it first.',
        ]);

        $picturePath = null;
        if ($request->hasFile('picture')) {
            $fileName = time() . '_' . $request->file('picture')->getClientOriginalName();
            $request->file('picture')->move(public_path('uploads/drivers'), $fileName);
            $picturePath = 'uploads/drivers/' . $fileName;
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $picturePath) {
            $user = \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
                'role' => 'driver',
                'approval_status' => 'approved',
            ]);

            Driver::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'license_number' => $validated['license_number'],
                'phone' => $validated['phone'],
                'status' => $validated['status'],
                'vehicle_id' => $validated['vehicle_id'] ?? null,
                'iqama_number' => $validated['iqama_number'] ?? null,
                'iqama_expiry' => $validated['iqama_expiry'] ?? null,
                'license_expiry' => $validated['license_expiry'] ?? null,
                'picture' => $picturePath,
            ]);
        });

        return redirect()->route('drivers.index');
    }

    public function edit(Driver $driver)
    {
        return view(str_replace('-', '_', 'drivers').'.edit', compact('driver'));
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $driver->user_id,
            'password' => 'nullable|min:6',
            'license_number' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|string',
            'vehicle_id' => 'nullable|exists:vehicles,id|unique:drivers,vehicle_id,' . $driver->id,
            'iqama_number' => 'nullable|string',
            'iqama_expiry' => 'nullable|date',
            'license_expiry' => 'nullable|date',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'vehicle_id.unique' => 'This vehicle is already assigned to another driver. Please select a different vehicle or unlink it first.',
        ]);

        $picturePath = $driver->picture;
        if ($request->hasFile('picture')) {
            $fileName = time() . '_' . $request->file('picture')->getClientOriginalName();
            $request->file('picture')->move(public_path('uploads/drivers'), $fileName);
            $picturePath = 'uploads/drivers/' . $fileName;
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $driver, $picturePath) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            
            if (!empty($validated['password'])) {
                $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
            }
            
            if ($driver->user) {
                $driver->user->update($userData);
            }

            $driver->update([
                'name' => $validated['name'],
                'license_number' => $validated['license_number'],
                'phone' => $validated['phone'],
                'status' => $validated['status'],
                'vehicle_id' => $validated['vehicle_id'] ?? null,
                'iqama_number' => $validated['iqama_number'] ?? null,
                'iqama_expiry' => $validated['iqama_expiry'] ?? null,
                'license_expiry' => $validated['license_expiry'] ?? null,
                'picture' => $picturePath,
            ]);
        });

        return redirect()->route('drivers.index');
    }

    public function destroy(Driver $driver)
    {
        try {
            $user = $driver->user;
            $driver->delete();
            if ($user) {
                $user->delete();
            }
            return redirect()->route('drivers.index')->with('success', 'Driver deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this driver because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the driver.']);
        }
    }
}