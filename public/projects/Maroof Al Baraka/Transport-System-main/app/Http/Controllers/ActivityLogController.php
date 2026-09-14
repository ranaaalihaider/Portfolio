<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $startDate = $request->input('start_date', Carbon::today()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::today()->format('Y-m-d'));

        $query = ActivityLog::query()
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate);

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $logs = $query->orderBy('created_at', 'desc')->get();

        return view('activity_logs.index', compact('logs', 'startDate', 'endDate'));
    }
}
