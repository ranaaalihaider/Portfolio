<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Portal - HajjTransport</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        :root {
            --primary: {{ $settings['primary_color'] ?? '#10b981' }};
            --primary-hover: {{ $settings['primary_color'] ?? '#10b981' }}e6;
            --sidebar-bg: {{ $settings['sidebar_bg'] ?? '#111827' }};
        }
    </style>
</head>
<body>
    <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
            @if(isset($settings['app_logo']) && $settings['app_logo'])
                <img src="{{ asset($settings['app_logo']) }}" alt="Logo" style="width: 32px; height: 32px; object-fit: contain;">
            @else
                <i class="fa-solid fa-box" style="color: #f59e0b;"></i>
            @endif
            <div style="display:flex; flex-direction:column; gap:2px;">
                <span>{{ $settings['app_name'] ?? 'Hajj & Umrah' }}</span>
                <span style="font-size: 0.7rem; font-weight: normal; color: rgba(255,255,255,0.5);">Transport ERP</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            <a href="{{ route('driver.dashboard') }}" class="{{ request()->routeIs('driver.dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-chart-pie"></i> Dashboard
            </a>
            <a href="{{ route('driver.trips.index') }}" class="{{ request()->is('driver/trips*') ? 'active' : '' }}">
                <i class="fa-solid fa-route"></i> My Trips
            </a>
            <a href="{{ route('driver.payments.index') }}" class="{{ request()->is('driver/payments*') ? 'active' : '' }}">
                <i class="fa-solid fa-hand-holding-dollar"></i> My Payments
            </a>
        </nav>
        <div style="padding: 20px; border-top: 1px solid var(--border);">
            <div style="margin-bottom: 12px; font-size: 14px; color: var(--text-muted); font-weight: 500;">
                <i class="fa-solid fa-id-card"></i> Driver Profile
            </div>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="btn btn-secondary" style="width: 100%; border: none; background: transparent; color: var(--danger); font-weight: 600; text-align: left; padding: 0;">
                    <i class="fa-solid fa-sign-out-alt" style="margin-right: 12px; width: 20px; text-align: center;"></i> Logout
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <header class="header">
            <div style="display: flex; align-items: center;">
                <button class="mobile-toggle" onclick="toggleSidebar()">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div class="header-title">
                    @yield('header_title', 'Driver Portal')
                </div>
            </div>
            <div class="header-actions">
                <span class="badge badge-primary">Driver Portal: {{ auth()->user()->name }}</span>
            </div>
        </header>

        <div class="content-wrapper">
            @yield('content')
        </div>
    </main>
    <script>
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
            document.querySelector('.sidebar-overlay').classList.toggle('open');
        }
    </script>
    @stack('scripts')
</body>
</html>
