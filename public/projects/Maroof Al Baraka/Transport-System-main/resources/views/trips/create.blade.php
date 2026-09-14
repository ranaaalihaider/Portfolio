@extends('layouts.app')
@section('header_title', 'Create Trip')
@section('content')
<div class="card">
    <form action="{{ route('trips.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Booking id</label>
            <input type="number" name="booking_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver id</label>
            <input type="number" name="driver_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Vehicle id</label>
            <input type="number" name="vehicle_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('trips.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection