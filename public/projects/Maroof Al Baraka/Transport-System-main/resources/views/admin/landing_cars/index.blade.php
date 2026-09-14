@extends('layouts.app')
@section('header_title', 'Manage Landing Cars')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Landing Cars List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New Car</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Route</th>
                    <th>Name</th>
                    <th>Subtitle</th>
                    <th>Label</th>
                    <th>Order</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($landing_cars as $item)
                <tr>
                    <td data-label="Image">
                        @if($item->image_path)
                            <img src="{{ asset($item->image_path) }}" alt="{{ $item->name }}" style="height: 50px; width: auto; border-radius: 4px;">
                        @else
                            <span style="color: #888;">Default SVG</span>
                        @endif
                    </td>
                    <td data-label="Route">{{ $item->route }}</td>
                    <td data-label="Name">{{ $item->name }}</td>
                    <td data-label="Subtitle">{{ $item->subtitle }}</td>
                    <td data-label="Label">{{ $item->label }}</td>
                    <td data-label="Order">{{ $item->sort_order }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('landing-cars.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('landing-cars.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Landing Car</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('landing-cars.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Route (e.g. JED → MAK · GROUP)</label>
                    <input type="text" name="route" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Car Name (e.g. Toyota HI Ace)</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Subtitle (e.g. Seats 12 · families & medium groups)</label>
                    <input type="text" name="subtitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Label / Tag (e.g. Best for groups)</label>
                    <input type="text" name="label" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">Sort Order</label>
                    <input type="number" name="sort_order" class="form-control" value="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Car Image (Optional)</label>
                    <input type="file" name="image" class="form-control" accept="image/*">
                    <small>If not provided, a default illustration will be used.</small>
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
            <h2>Edit Landing Car</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Route</label>
                    <input type="text" name="route" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Car Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Subtitle</label>
                    <input type="text" name="subtitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Label / Tag</label>
                    <input type="text" name="label" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">Sort Order</label>
                    <input type="number" name="sort_order" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">Car Image (Upload new to replace)</label>
                    <input type="file" name="image" class="form-control" accept="image/*">
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
