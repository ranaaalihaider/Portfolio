@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Activity Logs</h2>
    </div>

    <!-- Date Range Filter -->
    <div class="card mb-4 shadow-sm">
        <div class="card-body">
            <form method="GET" action="{{ route('activity_logs.index') }}" class="row g-3 align-items-end">
                <div class="col-md-3">
                    <label for="start_date" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="start_date" name="start_date" value="{{ $startDate }}" required>
                </div>
                <div class="col-md-3">
                    <label for="end_date" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="end_date" name="end_date" value="{{ $endDate }}" required>
                </div>
                <div class="col-md-3">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="fa-solid fa-filter me-2"></i> Filter Logs
                    </button>
                </div>
                <div class="col-md-3 text-end">
                    <small class="text-muted d-block">
                        <i class="fa-solid fa-circle-info me-1"></i>
                        Showing {{ $logs->count() }} records
                    </small>
                </div>
            </form>
        </div>
    </div>

    <!-- Logs Table -->
    <div class="card shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Record Type</th>
                            <th>Changes</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($logs as $log)
                        <tr>
                            <td>{{ $log->created_at->format('d M, Y H:i:s') }}</td>
                            <td>
                                <strong>{{ $log->user_name ?? 'System' }}</strong>
                                <br>
                                <span class="badge bg-secondary">{{ ucfirst($log->role ?? 'N/A') }}</span>
                            </td>
                            <td>
                                @if($log->action === 'created')
                                    <span class="badge bg-success">Created</span>
                                @elseif($log->action === 'updated')
                                    <span class="badge bg-primary">Updated</span>
                                @elseif($log->action === 'deleted')
                                    <span class="badge bg-danger">Deleted</span>
                                @else
                                    <span class="badge bg-info">{{ ucfirst($log->action) }}</span>
                                @endif
                            </td>
                            <td>
                                <strong>{{ class_basename($log->model_type) }}</strong> #{{ $log->model_id }}
                            </td>
                            <td>
                                @if($log->changes)
                                    <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#changes-{{ $log->id }}">
                                        View Details
                                    </button>
                                    <div class="collapse mt-2" id="changes-{{ $log->id }}">
                                        <div class="card card-body p-2" style="font-size: 12px; background: #f8fafc;">
                                            @if(isset($log->changes['old']) && isset($log->changes['new']))
                                                @foreach($log->changes['new'] as $key => $newValue)
                                                    @if($key !== 'updated_at')
                                                        <div class="mb-1">
                                                            <strong>{{ $key }}:</strong> 
                                                            <span class="text-danger text-decoration-line-through">{{ $log->changes['old'][$key] ?? 'N/A' }}</span>
                                                            <i class="fa-solid fa-arrow-right mx-1 text-muted"></i>
                                                            <span class="text-success fw-bold">{{ $newValue }}</span>
                                                        </div>
                                                    @endif
                                                @endforeach
                                            @elseif(isset($log->changes['new']))
                                                @foreach($log->changes['new'] as $key => $newValue)
                                                    <div class="mb-1">
                                                        <strong>{{ $key }}:</strong> <span class="text-success">{{ is_array($newValue) ? json_encode($newValue) : $newValue }}</span>
                                                    </div>
                                                @endforeach
                                            @elseif(isset($log->changes['old']))
                                                @foreach($log->changes['old'] as $key => $oldValue)
                                                    <div class="mb-1">
                                                        <strong>{{ $key }}:</strong> <span class="text-danger">{{ is_array($oldValue) ? json_encode($oldValue) : $oldValue }}</span>
                                                    </div>
                                                @endforeach
                                            @endif
                                        </div>
                                    </div>
                                @else
                                    <span class="text-muted">No changes recorded</span>
                                @endif
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-4 text-muted">No activity found for the selected date range.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
