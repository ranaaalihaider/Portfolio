@extends('layouts.driver')
@section('header', 'Dashboard')
@section('content')
<div class="grid-cards">
    <div class="stat-card">
        <div class="stat-icon primary"><i class="fa-solid fa-route"></i></div>
        <div class="stat-details">
            <h3>Trips Today</h3>
            <p>{{ $todayTrips }}</p>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <h2 class="card-title">Upcoming Trips</h2>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Route</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($upcomingTrips as $trip)
                <tr>
                    <td data-label="Date">{{ \Carbon\Carbon::parse($trip->date)->format('M d, Y') }}</td>
                    <td data-label="Route">{{ $trip->booking->route->route_name ?? 'N/A' }}</td>
                    <td data-label="Vehicle">{{ $trip->vehicle->plate_number ?? 'Unassigned' }}</td>
                    <td data-label="Status"><span class="badge badge-primary">{{ $trip->status }}</span></td>
                </tr>
                @empty
                <tr><td colspan="4" style="text-align:center; padding: 20px;">No upcoming trips.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
