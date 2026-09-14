@extends('layouts.app')
@section('header_title', 'Edit Passenger')
@section('content')
<div class="card">
    <form action="{{ route('passengers.update', $passenger) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Booking id</label>
            <input type="text" name="booking_id" class="form-control" value="{{ $passenger->booking_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" value="{{ $passenger->user->email ?? '' }}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Password (Leave blank to keep current)</label>
            <input type="password" name="password" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control" value="{{ $passenger->name }}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Passport</label>
            <input type="text" name="passport" class="form-control" value="{{ $passenger->passport }}">
        </div>
        <div class="form-group">
            <label class="form-label">Nationality</label>
            <input type="text" name="nationality" class="form-control" value="{{ $passenger->nationality }}">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control" value="{{ $passenger->phone }}">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('passengers.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection