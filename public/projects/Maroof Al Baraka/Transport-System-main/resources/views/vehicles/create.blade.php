@extends('layouts.app')
@section('header_title', 'Create Vehicle')
@section('content')
<div class="card">
    <form action="{{ route('vehicles.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Plate number</label>
            <input type="text" name="plate_number" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Model</label>
            <input type="text" name="model" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Capacity</label>
            <input type="number" name="capacity" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Maintenance">Maintenance</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('vehicles.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection