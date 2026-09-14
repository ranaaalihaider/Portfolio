@extends('layouts.passenger')
@section('header', 'Dashboard')
@section('content')
@if($booking)
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Your Upcoming Trip</h2>
    </div>
    <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top:0;">{{ $booking->route->route_name ?? 'Route N/A' }}</h3>
        <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($booking->date)->format('M d, Y') }}</p>
        <p><strong>Vendor:</strong> {{ $booking->vendor->company_name ?? 'N/A' }}</p>
        <p><strong>Group Name:</strong> {{ $booking->group_name }}</p>
        <p><strong>Status:</strong> <span class="badge badge-primary">{{ $booking->status }}</span></p>
    </div>
</div>
@else
<div class="card">
    <div style="text-align:center; padding: 40px;">
        <i class="fa-solid fa-suitcase" style="font-size: 3rem; color: var(--border); margin-bottom: 16px;"></i>
        <h3 style="color: var(--text-muted);">No Bookings Found</h3>
        <p>You have not been assigned to a booking yet. Please contact the administrator.</p>
    </div>
</div>
@endif
@endsection
