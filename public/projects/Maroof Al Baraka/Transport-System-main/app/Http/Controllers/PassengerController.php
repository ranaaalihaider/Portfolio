<?php

namespace App\Http\Controllers;

use App\Models\Passenger;
use App\Models\Booking;
use Illuminate\Http\Request;

class PassengerController extends Controller
{
    public function index()
    {
        $passengers = Passenger::with(['booking', 'user'])->get();
        $bookings = Booking::all();
        return view(str_replace('-', '_', 'passengers').'.index', compact('passengers', 'bookings'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'passengers').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'booking_id' => 'nullable|string',
            'passport' => 'required|string',
            'nationality' => 'required|string',
            'phone' => 'required|string',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            $user = \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
                'role' => 'passenger',
                'approval_status' => 'approved',
            ]);

            Passenger::create([
                'user_id' => $user->id,
                'booking_id' => $validated['booking_id'] ?? null,
                'name' => $validated['name'],
                'passport' => $validated['passport'],
                'nationality' => $validated['nationality'],
                'phone' => $validated['phone'],
            ]);
        });

        return redirect()->route('passengers.index');
    }

    public function edit(Passenger $passenger)
    {
        return view(str_replace('-', '_', 'passengers').'.edit', compact('passenger'));
    }

    public function update(Request $request, Passenger $passenger)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $passenger->user_id,
            'password' => 'nullable|min:6',
            'booking_id' => 'nullable|string',
            'passport' => 'required|string',
            'nationality' => 'required|string',
            'phone' => 'required|string',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $passenger) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            
            if (!empty($validated['password'])) {
                $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
            }
            
            if ($passenger->user) {
                $passenger->user->update($userData);
            }

            $passenger->update([
                'booking_id' => $validated['booking_id'] ?? null,
                'name' => $validated['name'],
                'passport' => $validated['passport'],
                'nationality' => $validated['nationality'],
                'phone' => $validated['phone'],
            ]);
        });

        return redirect()->route('passengers.index');
    }

    public function destroy(Passenger $passenger)
    {
        try {
            $user = $passenger->user;
            $passenger->delete();
            if ($user) {
                $user->delete();
            }
            return redirect()->route('passengers.index')->with('success', 'Passenger deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this passenger because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the passenger.']);
        }
    }
}