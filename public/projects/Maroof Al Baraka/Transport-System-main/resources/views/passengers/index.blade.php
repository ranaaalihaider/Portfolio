@extends('layouts.app')
@section('header_title', 'Manage Passenger')
@section('content')
@if ($errors->any())
    <div class="alert alert-danger" style="background: #fef2f2; color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <ul style="margin: 0; padding-left: 20px;">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Passenger List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Booking</th>
                    <th>Name</th>
                    <th>Passport</th>
                    <th>Nationality</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($passengers as $item)
                <tr>
                    <td data-label="Booking">{{ $item->booking->group_name ?? 'N/A' }}</td>
                    <td data-label="Name">{{ $item->name }}</td>
                            <td data-label="Passport">{{ $item->passport }}</td>
                            <td data-label="Nationality">{{ $item->nationality }}</td>
                            <td data-label="Phone">{{ $item->phone }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('passengers.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('passengers.destroy', $item) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

<!-- Create Modal -->
<div id="createModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Add New Passenger</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('passengers.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Booking</label>
            <select name="booking_id" class="form-control">
                <option value="">Select Booking</option>
                @foreach($bookings as $booking)
                    <option value="{{ $booking->id }}">#{{ $booking->id }} - {{ $booking->group_name }} ({{ $booking->date }})</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Passport</label>
            <input type="text" name="passport" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Nationality</label>
            <input type="text" name="nationality" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control">
        </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Edit Passenger</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Booking</label>
            <select name="booking_id" class="form-control">
                <option value="">Select Booking</option>
                @foreach($bookings as $booking)
                    <option value="{{ $booking->id }}">#{{ $booking->id }} - {{ $booking->group_name }} ({{ $booking->date }})</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Password (Leave blank to keep current)</label>
            <input type="password" name="password" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Passport</label>
            <input type="text" name="passport" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Nationality</label>
            <input type="text" name="nationality" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control">
        </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</div>

@endsection