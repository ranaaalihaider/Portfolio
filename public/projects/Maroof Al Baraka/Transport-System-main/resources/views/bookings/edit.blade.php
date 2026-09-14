@extends('layouts.app')
@section('header_title', 'Edit Booking')
@section('content')
<div class="card">
    <form action="{{ route('bookings.update', $booking) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control" value="{{ $booking->date }}">
        </div>
        <div class="form-group">
            <label class="form-label">Pickup time</label>
            <input type="time" name="pickup_time" class="form-control" value="{{ $booking->pickup_time ? \Carbon\Carbon::parse($booking->pickup_time)->format('H:i') : '' }}">
        </div>
        <div class="form-group">
            <label class="form-label">Vendor id</label>
            <input type="number" name="vendor_id" class="form-control" value="{{ $booking->vendor_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Route id</label>
            <input type="number" name="route_id" class="form-control" value="{{ $booking->route_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Group name</label>
            <input type="text" name="group_name" class="form-control" value="{{ $booking->group_name }}">
        </div>
        <div class="form-group">
            <label class="form-label">Pax count</label>
            <input type="number" name="pax_count" class="form-control" value="{{ $booking->pax_count }}">
        </div>
        <div class="form-group">
            <label class="form-label">Price</label>
            <input type="number" step="0.01" name="price" class="form-control" value="{{ $booking->price }}">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Pending" {{ $booking->status == 'Pending' ? 'selected' : '' }}>Pending</option>
                <option value="Confirmed" {{ $booking->status == 'Confirmed' ? 'selected' : '' }}>Confirmed</option>
                <option value="Completed" {{ $booking->status == 'Completed' ? 'selected' : '' }}>Completed</option>
                <option value="Cancelled" {{ $booking->status == 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('bookings.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection