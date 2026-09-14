@extends('layouts.app')

@section('header', 'Pending Approvals')

@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Users Awaiting Approval</h2>
    </div>

    @if(session('success'))
        <div class="badge badge-success" style="margin-bottom: 16px; padding: 12px; display: block; border-radius: 8px; font-size: 14px;">{{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="badge badge-danger" style="margin-bottom: 16px; padding: 12px; display: block; border-radius: 8px; font-size: 14px;">{{ session('error') }}</div>
    @endif

    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($users as $user)
                    <tr>
                        <td data-label="Name">{{ $user->name }}</td>
                        <td data-label="Email">{{ $user->email }}</td>
                        <td data-label="Role">
                            <span class="badge {{ $user->role === 'driver' ? 'badge-primary' : 'badge-secondary' }}">
                                {{ ucfirst($user->role) }}
                            </span>
                        </td>
                        <td data-label="Registered At">{{ $user->created_at->format('M d, Y H:i') }}</td>
                        <td data-label="Actions">
                            <div style="display: flex; gap: 8px;">
                                <form action="{{ route('admin.users.approve', $user) }}" method="POST">
                                    @csrf
                                    <button type="submit" class="btn btn-primary btn-sm" style="padding: 6px 12px; font-size: 12px;"><i class="fa-solid fa-check"></i> Approve</button>
                                </form>
                                <form action="{{ route('admin.users.reject', $user) }}" method="POST">
                                    @csrf
                                    <button type="submit" class="btn btn-danger btn-sm" style="padding: 6px 12px; font-size: 12px;"><i class="fa-solid fa-xmark"></i> Reject</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 32px; color: var(--text-muted);">No pending approvals at this time.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
