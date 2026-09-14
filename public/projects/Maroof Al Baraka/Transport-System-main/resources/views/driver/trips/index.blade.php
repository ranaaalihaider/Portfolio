@extends('layouts.driver')
@section('header', 'My Trips')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">All Trips</h2>
    </div>
    @if(session('success'))
        <div class="badge badge-success" style="margin-bottom: 16px; padding: 12px; display: block;">{{ session('success') }}</div>
    @endif
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Pickup Time</th>
                    <th>Route</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Update Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($trips as $trip)
                <tr>
                    <td data-label="Date">{{ \Carbon\Carbon::parse($trip->date)->format('M d, Y') }}</td>
                    <td data-label="Pickup Time">{{ $trip->booking && $trip->booking->pickup_time ? \Carbon\Carbon::parse($trip->booking->pickup_time)->format('h:i A') : 'N/A' }}</td>
                    <td data-label="Route">{{ $trip->booking->route->route_name ?? 'N/A' }}</td>
                    <td data-label="Vehicle">{{ $trip->vehicle->plate_number ?? 'Unassigned' }}</td>
                    <td data-label="Status">
                        <span class="badge {{ $trip->status === 'Completed' ? 'badge-success' : ($trip->status === 'In Progress' ? 'badge-warning' : 'badge-primary') }}">
                            {{ $trip->status }}
                        </span>
                    </td>
                    <td data-label="Update Status">
                        <form action="{{ route('driver.trips.update', $trip) }}" method="POST" style="display:flex; gap:8px;">
                            @csrf
                            <select name="status" class="form-control" style="width: auto; padding: 6px 12px;">
                                <option value="Scheduled" {{ $trip->status === 'Scheduled' ? 'selected' : '' }}>Scheduled</option>
                                <option value="In Progress" {{ $trip->status === 'In Progress' ? 'selected' : '' }}>In Progress</option>
                                <option value="Completed" {{ $trip->status === 'Completed' ? 'selected' : '' }}>Completed</option>
                            </select>
                            <button type="submit" class="btn btn-primary btn-sm" style="padding: 6px 12px;">Save</button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="5" style="text-align:center; padding: 20px;">No trips found.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
