<?php

namespace App\Http\Controllers;

use App\Models\DriverPayment;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverPaymentController extends Controller
{
    public function index()
    {
        $driver_payments = DriverPayment::with('driver')->get();
        $drivers = Driver::all();
        return view(str_replace('-', '_', 'driver-payments').'.index', compact('driver_payments', 'drivers'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'driver-payments').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'driver_id' => 'required|exists:drivers,id',
            'type' => 'required|in:Advance,Salary,Trip Bonus,Deduction',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string|max:255',
            'details' => 'nullable|string',
        ]);
        DriverPayment::create($validated);
        return redirect()->route('driver-payments.index');
    }

    public function edit(DriverPayment $driverPayment)
    {
        return view(str_replace('-', '_', 'driver-payments').'.edit', compact('driverPayment'));
    }

    public function update(Request $request, DriverPayment $driverPayment)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'driver_id' => 'required|exists:drivers,id',
            'type' => 'required|in:Advance,Salary,Trip Bonus,Deduction',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string|max:255',
            'details' => 'nullable|string',
        ]);
        $driverPayment->update($validated);
        return redirect()->route('driver-payments.index');
    }

    public function destroy(DriverPayment $driverPayment)
    {
        try {
            $driverPayment->delete();
            return redirect()->route('driver-payments.index')->with('success', 'Driver payment deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this driver payment because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the driver payment.']);
        }
    }
}