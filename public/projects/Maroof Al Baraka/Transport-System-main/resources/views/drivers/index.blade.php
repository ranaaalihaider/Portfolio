@extends('layouts.app')
@section('header_title', 'Manage Driver')
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
        <h2 class="card-title">Driver List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>License number</th>
                    <th>License Expiry</th>
                    <th>Iqama No</th>
                    <th>Iqama Expiry</th>
                    <th>Picture</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Linked Vehicle</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($drivers as $item)
                <tr>
                    <td data-label="Name">{{ $item->name }}</td>
                            <td data-label="License number">{{ $item->license_number }}</td>
                            <td data-label="License Expiry">{{ $item->license_expiry }}</td>
                            <td data-label="Iqama No">{{ $item->iqama_number }}</td>
                            <td data-label="Iqama Expiry">{{ $item->iqama_expiry }}</td>
                            <td data-label="Picture">
                                @if($item->picture)
                                    <img src="{{ asset($item->picture) }}" alt="Driver Picture" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                                @else
                                    <span class="text-muted">No Picture</span>
                                @endif
                            </td>
                            <td data-label="Phone">{{ $item->phone }}</td>
                            <td data-label="Status">{{ $item->status }}</td>
                            <td data-label="Linked Vehicle">{{ $item->vehicle->plate_number ?? 'Unlinked' }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('drivers.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('drivers.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Driver</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('drivers.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="modal-body">
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
            <label class="form-label">License number</label>
            <input type="text" name="license_number" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">License Expiry</label>
            <input type="date" name="license_expiry" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Iqama No</label>
            <input type="text" name="iqama_number" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Iqama Expiry</label>
            <input type="date" name="iqama_expiry" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver Picture</label>
            <input type="file" name="picture" class="form-control" accept="image/*">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Link to Vehicle</label>
            <select name="vehicle_id" class="form-control">
                <option value="">Unlinked</option>
                @foreach($vehicles as $vehicle)
                    <option value="{{ $vehicle->id }}">{{ $vehicle->plate_number }} ({{ $vehicle->model }})</option>
                @endforeach
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
            <h2>Edit Driver</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="modal-body">
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
            <label class="form-label">License number</label>
            <input type="text" name="license_number" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">License Expiry</label>
            <input type="date" name="license_expiry" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Iqama No</label>
            <input type="text" name="iqama_number" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Iqama Expiry</label>
            <input type="date" name="iqama_expiry" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver Picture (Leave blank to keep current)</label>
            <div id="edit_picture_preview" style="margin-bottom: 8px;"></div>
            <input type="file" name="picture" class="form-control" accept="image/*">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Link to Vehicle</label>
            <select name="vehicle_id" class="form-control">
                <option value="">Unlinked</option>
                @foreach($vehicles as $vehicle)
                    <option value="{{ $vehicle->id }}">{{ $vehicle->plate_number }} ({{ $vehicle->model }})</option>
                @endforeach
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

@push('scripts')
<script>
    document.querySelectorAll('[data-modal-target="editModal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const record = JSON.parse(this.getAttribute('data-record'));
            const previewContainer = document.getElementById('edit_picture_preview');
            if (record.picture) {
                previewContainer.innerHTML = `<img src="/${record.picture}" alt="Driver Picture" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">`;
            } else {
                previewContainer.innerHTML = '<span class="text-muted">No picture uploaded yet.</span>';
            }
        });
    });
</script>
@endpush