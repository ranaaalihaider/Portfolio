@extends('layouts.app')
@section('header_title', 'Create Booking')
@section('content')
<div class="card">
    <form action="{{ route('bookings.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Pickup time</label>
            <input type="time" name="pickup_time" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Vendor id</label>
            <input type="number" name="vendor_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Route id</label>
            <input type="number" name="route_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Group name</label>
            <input type="text" name="group_name" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Pax count</label>
            <input type="number" name="pax_count" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Price</label>
            <input type="number" step="0.01" name="price" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('bookings.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection