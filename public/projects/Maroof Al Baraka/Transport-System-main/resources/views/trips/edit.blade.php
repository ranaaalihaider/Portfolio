@extends('layouts.app')
@section('header_title', 'Edit Trip')
@section('content')
<div class="card">
    <form action="{{ route('trips.update', $trip) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control" value="{{ $trip->date }}">
        </div>
        <div class="form-group">
            <label class="form-label">Booking id</label>
            <input type="number" name="booking_id" class="form-control" value="{{ $trip->booking_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Driver id</label>
            <input type="number" name="driver_id" class="form-control" value="{{ $trip->driver_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Vehicle id</label>
            <input type="number" name="vehicle_id" class="form-control" value="{{ $trip->vehicle_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Scheduled" {{ $trip->status == 'Scheduled' ? 'selected' : '' }}>Scheduled</option>
                <option value="In Progress" {{ $trip->status == 'In Progress' ? 'selected' : '' }}>In Progress</option>
                <option value="Completed" {{ $trip->status == 'Completed' ? 'selected' : '' }}>Completed</option>
                <option value="Cancelled" {{ $trip->status == 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control" value="{{ $trip->details }}">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('trips.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection