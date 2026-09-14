@extends('layouts.app')
@section('header_title', 'Manage Vehicle')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Vehicle List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Plate number</th>
                    <th>Model</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Assigned Driver</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($vehicles as $item)
                <tr>
                    <td data-label="Plate number">{{ $item->plate_number }}</td>
                            <td data-label="Model">{{ $item->model }}</td>
                            <td data-label="Capacity">{{ $item->capacity }}</td>
                            <td data-label="Status">{{ $item->status }}</td>
                            <td data-label="Assigned Driver">{{ $item->driver->name ?? 'Unassigned' }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('vehicles.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('vehicles.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Vehicle</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('vehicles.store') }}" method="POST">
            @csrf
            <div class="modal-body">
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
            <h2>Edit Vehicle</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
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
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</div>

@endsection