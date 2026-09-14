<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Driver;
use App\Models\Passenger;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function pending()
    {
        $users = User::where('approval_status', 'pending')->get();
        return view('admin_users.pending', compact('users'));
    }

    public function approve(User $user)
    {
        if ($user->approval_status !== 'pending') {
            return back()->with('error', 'User is not pending approval.');
        }

        $user->update(['approval_status' => 'approved']);

        return back()->with('success', 'User approved successfully.');
    }

    public function reject(User $user)
    {
        if ($user->approval_status !== 'pending') {
            return back()->with('error', 'User is not pending approval.');
        }

        $user->update(['approval_status' => 'rejected']);
        
        return back()->with('success', 'User rejected successfully.');
    }
}
