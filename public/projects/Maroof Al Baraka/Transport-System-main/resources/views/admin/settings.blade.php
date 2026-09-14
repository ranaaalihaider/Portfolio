@extends('layouts.app')
@section('header_title', 'Platform Settings')
@section('content')
<div class="card" style="max-width: 600px;">
    <div class="card-header">
        <h2 class="card-title">Theme & Brand</h2>
    </div>
    @if(session('success'))
        <div class="badge badge-success" style="margin-bottom: 16px; padding: 12px; display: block;">{{ session('success') }}</div>
    @endif
    <form action="{{ route('admin.settings.update') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="form-group">
            <label class="form-label">Platform Name</label>
            <input type="text" name="app_name" class="form-control" value="{{ $settings['app_name'] ?? 'Hajj & Umrah' }}" required>
            <small style="color: var(--text-muted); margin-top: 4px; display: block;">This will appear in the sidebar logo.</small>
        </div>
        
        <div class="form-group">
            <label class="form-label">App Logo</label>
            @if(isset($settings['app_logo']) && $settings['app_logo'])
                <div style="margin-bottom: 12px; background: var(--bg-alt); padding: 12px; border-radius: 8px; display: inline-block;">
                    <img src="{{ asset($settings['app_logo']) }}" alt="App Logo" style="max-height: 60px;">
                </div>
            @endif
            <input type="file" name="app_logo" class="form-control" accept="image/*">
            <small style="color: var(--text-muted); margin-top: 4px; display: block;">Upload your brand logo (PNG with transparent background recommended).</small>
        </div>

        <div class="form-group">
            <label class="form-label">Primary Color (Active States & Buttons)</label>
            <div style="display: flex; gap: 12px; align-items: center;">
                <input type="color" name="primary_color" value="{{ $settings['primary_color'] ?? '#10b981' }}" style="height: 40px; width: 60px; padding: 0; border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
                <span style="font-family: monospace; color: var(--text-muted);">Default: #10b981 (Emerald Green)</span>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Sidebar Background Color</label>
            <div style="display: flex; gap: 12px; align-items: center;">
                <input type="color" name="sidebar_bg" value="{{ $settings['sidebar_bg'] ?? '#0E2A26' }}" style="height: 40px; width: 60px; padding: 0; border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
                <span style="font-family: monospace; color: var(--text-muted);">Default: #0E2A26 (Brand Green)</span>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">WhatsApp Number</label>
            <input type="text" name="whatsapp_number" class="form-control" value="{{ $settings['whatsapp_number'] ?? '966503702111' }}">
            <small style="color: var(--text-muted); margin-top: 4px; display: block;">Enter the number with country code, e.g., 966503702111.</small>
        </div>

        <div class="form-group">
            <label class="form-label">Hero Image</label>
            @if(isset($settings['hero_image']) && $settings['hero_image'])
                <div style="margin-bottom: 12px;">
                    <img src="{{ asset($settings['hero_image']) }}" alt="Hero Image" style="max-height: 120px; border-radius: 8px; border: 1px solid var(--border);">
                </div>
            @endif
            <input type="file" name="hero_image" class="form-control" accept="image/*">
            <small style="color: var(--text-muted); margin-top: 4px; display: block;">Upload a high-quality image for the landing page hero section. Max size: 2MB.</small>
        </div>

        <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
            <button type="submit" class="btn btn-primary" style="width: 100%;">Save Settings</button>
        </div>
    </form>
</div>
@endsection
