@extends('layouts.passenger')
@section('header', 'My Bookings')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Booking Details</h2>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Pickup Time</th>
                    <th>Route</th>
                    <th>Vendor</th>
                    <th>Group</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @if($booking)
                <tr>
                    <td data-label="Date">{{ \Carbon\Carbon::parse($booking->date)->format('M d, Y') }}</td>
                    <td data-label="Pickup Time">{{ $booking->pickup_time ? \Carbon\Carbon::parse($booking->pickup_time)->format('h:i A') : 'N/A' }}</td>
                    <td data-label="Route">{{ $booking->route->route_name ?? 'N/A' }}</td>
                    <td data-label="Vendor">{{ $booking->vendor->company_name ?? 'N/A' }}</td>
                    <td data-label="Group">{{ $booking->group_name }}</td>
                    <td data-label="Status"><span class="badge badge-primary">{{ $booking->status }}</span></td>
                </tr>
                @else
                <tr><td colspan="5" style="text-align:center; padding: 20px;">No booking history found.</td></tr>
                @endif
            </tbody>
        </table>
    </div>
</div>
@endsection
