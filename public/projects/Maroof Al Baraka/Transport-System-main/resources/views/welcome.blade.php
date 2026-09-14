@extends('layouts.app')

@section('header_title', 'Dashboard')

@section('content')
<div class="grid-cards">
    <div class="stat-card">
        <div class="stat-icon primary">
            <i class="fa-solid fa-route"></i>
        </div>
        <div class="stat-details">
            <h3>Today's Trips</h3>
            <p>{{ $todayTrips }}</p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon success">
            <i class="fa-solid fa-wallet"></i>
        </div>
        <div class="stat-details">
            <h3>Monthly Income</h3>
            <p>SAR {{ number_format($monthlyIncome, 2) }}</p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon warning">
            <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-details">
            <h3>Active Drivers</h3>
            <p>{{ $activeDrivers }}</p>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <h2 class="card-title">Recent Bookings</h2>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Group Name</th>
                    <th>Route</th>
                    <th>Vendor</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($recentBookings as $booking)
                <tr>
                    <td data-label="Date">{{ $booking->date }}</td>
                    <td data-label="Group Name">{{ $booking->group_name }}</td>
                    <td data-label="Route">{{ $booking->route->route_name ?? $booking->route_id }}</td>
                    <td data-label="Vendor">{{ $booking->vendor->company_name ?? $booking->vendor_id }}</td>
                    <td data-label="Status">
                        <span class="badge badge-{{ $booking->status == 'Completed' ? 'success' : ($booking->status == 'Pending' ? 'warning' : 'primary') }}">
                            {{ $booking->status }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">No recent bookings found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
