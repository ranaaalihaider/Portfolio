@extends('layouts.app')
@section('header_title', 'Edit Driver')
@section('content')
<div class="card">
    <form action="{{ route('drivers.update', $driver) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" value="{{ $driver->user->email ?? '' }}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Password (Leave blank to keep current)</label>
            <input type="password" name="password" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control" value="{{ $driver->name }}" required>
        </div>
        <div class="form-group">
            <label class="form-label">License number</label>
            <input type="text" name="license_number" class="form-control" value="{{ $driver->license_number }}">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control" value="{{ $driver->phone }}">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Available" {{ $driver->status == 'Available' ? 'selected' : '' }}>Available</option>
                <option value="On Trip" {{ $driver->status == 'On Trip' ? 'selected' : '' }}>On Trip</option>
                <option value="Inactive" {{ $driver->status == 'Inactive' ? 'selected' : '' }}>Inactive</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('drivers.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection