<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            
            if ($user->role !== 'admin' && $user->approval_status !== 'approved') {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Your account is pending admin approval. You will be able to log in once an admin approves your account.',
                ])->onlyInput('email');
            }

            if ($user->role === 'admin') {
                return redirect()->intended('/admin/dashboard');
            } elseif ($user->role === 'driver') {
                return redirect()->intended('/driver/dashboard');
            } else {
                return redirect()->intended('/passenger/dashboard');
            }
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showSignup()
    {
        return view('auth.signup');
    }

    public function signup(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'role' => 'required|in:driver,passenger',
        ];

        if ($request->role === 'driver') {
            $rules['license_number'] = 'required|string|max:255';
            $rules['phone'] = 'required|string|max:20';
        } elseif ($request->role === 'passenger') {
            $rules['passport'] = 'required|string|max:255';
            $rules['nationality'] = 'required|string|max:255';
            $rules['phone'] = 'required|string|max:20';
        }

        $validated = $request->validate($rules);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'approval_status' => 'pending',
            ]);

            if ($request->role === 'driver') {
                \App\Models\Driver::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'license_number' => $validated['license_number'],
                    'phone' => $validated['phone'],
                    'status' => 'Available',
                ]);
            } elseif ($request->role === 'passenger') {
                \App\Models\Passenger::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'passport' => $validated['passport'],
                    'nationality' => $validated['nationality'],
                    'phone' => $validated['phone'],
                ]);
            }
        });

        return redirect()->route('login')->with('success', 'Registration successful! Please wait for admin approval before logging in.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
