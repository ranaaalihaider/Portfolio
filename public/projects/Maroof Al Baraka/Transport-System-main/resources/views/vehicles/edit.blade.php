@extends('layouts.app')
@section('header_title', 'Edit Vehicle')
@section('content')
<div class="card">
    <form action="{{ route('vehicles.update', $vehicle) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Plate number</label>
            <input type="text" name="plate_number" class="form-control" value="{{ $vehicle->plate_number }}">
        </div>
        <div class="form-group">
            <label class="form-label">Model</label>
            <input type="text" name="model" class="form-control" value="{{ $vehicle->model }}">
        </div>
        <div class="form-group">
            <label class="form-label">Capacity</label>
            <input type="number" name="capacity" class="form-control" value="{{ $vehicle->capacity }}">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Available" {{ $vehicle->status == 'Available' ? 'selected' : '' }}>Available</option>
                <option value="On Trip" {{ $vehicle->status == 'On Trip' ? 'selected' : '' }}>On Trip</option>
                <option value="Maintenance" {{ $vehicle->status == 'Maintenance' ? 'selected' : '' }}>Maintenance</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('vehicles.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection