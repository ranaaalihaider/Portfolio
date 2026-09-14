<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $settings['app_name'] ?? 'HajjTransport ERP' }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        :root {
            --primary: {{ $settings['primary_color'] ?? '#10b981' }};
            --primary-hover: {{ $settings['primary_color'] ?? '#10b981' }}e6; /* slight opacity for hover */
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
            <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-chart-pie"></i> Dashboard
            </a>
            <a href="{{ route('bookings.index') }}" class="{{ request()->is('admin/bookings*') ? 'active' : '' }}">
                <i class="fa-solid fa-calendar-check"></i> Bookings
            </a>
            <a href="{{ route('trips.index') }}" class="{{ request()->is('admin/trips*') ? 'active' : '' }}">
                <i class="fa-solid fa-route"></i> Trips
            </a>
            <a href="{{ route('vouchers.index') }}" class="{{ request()->is('admin/vouchers*') ? 'active' : '' }}">
                <i class="fa-solid fa-file-invoice"></i> Vouchers
            </a>
            <a href="{{ route('passengers.index') }}" class="{{ request()->is('admin/passengers*') ? 'active' : '' }}">
                <i class="fa-solid fa-users"></i> Passengers
            </a>
            <a href="{{ route('drivers.index') }}" class="{{ request()->is('admin/drivers*') ? 'active' : '' }}">
                <i class="fa-solid fa-id-card"></i> Drivers
            </a>
            <a href="{{ route('vehicles.index') }}" class="{{ request()->is('admin/vehicles*') ? 'active' : '' }}">
                <i class="fa-solid fa-van-shuttle"></i> Vehicles
            </a>
            <a href="{{ route('vendors.index') }}" class="{{ request()->is('admin/vendors*') ? 'active' : '' }}">
                <i class="fa-solid fa-building"></i> Vendors
            </a>
            <a href="{{ route('routes.index') }}" class="{{ request()->is('admin/routes*') ? 'active' : '' }}">
                <i class="fa-solid fa-map-location-dot"></i> Routes
            </a>
            <a href="{{ route('incomes.index') }}" class="{{ request()->is('admin/incomes*') ? 'active' : '' }}">
                <i class="fa-solid fa-arrow-trend-up"></i> Incomes
            </a>
            <a href="{{ route('expenses.index') }}" class="{{ request()->is('admin/expenses*') ? 'active' : '' }}">
                <i class="fa-solid fa-arrow-trend-down"></i> Expenses
            </a>
            <a href="{{ route('driver-payments.index') }}" class="{{ request()->is('admin/driver-payments*') ? 'active' : '' }}">
                <i class="fa-solid fa-hand-holding-dollar"></i> Driver Payments
            </a>
            <a href="{{ route('activity_logs.index') }}" class="{{ request()->routeIs('activity_logs.*') ? 'active' : '' }}">
                <i class="fa-solid fa-clock-rotate-left"></i> Activity Logs
            </a>

            <a href="{{ route('admin.settings') }}" class="{{ request()->routeIs('admin.settings') ? 'active' : '' }}" style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                <i class="fa-solid fa-gear"></i> Settings
            </a>
            <a href="{{ route('landing-cars.index') }}" class="{{ request()->routeIs('landing-cars.*') ? 'active' : '' }}" style="padding-left: 44px; font-size: 0.9em; opacity: 0.85;">
                <i class="fa-solid fa-car-side" style="width: 20px;"></i> Landing Cars
            </a>
            <a href="{{ route('admin.users.pending') }}" class="{{ request()->routeIs('admin.users.pending') ? 'active' : '' }}" style="margin-top: 8px;">
                <i class="fa-solid fa-user-check" style="color: var(--warning);"></i> Pending Approvals
            </a>
        </nav>
        <div style="padding: 20px; border-top: 1px solid var(--border);">
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
                    @yield('header_title', 'Dashboard')
                </div>
            </div>
            <div class="header-actions">
                <span class="badge badge-secondary"><i class="fa-regular fa-clock"></i> {{ now()->format('d M Y') }}</span>
                <span class="badge badge-primary">SAR</span>
            </div>
        </header>

        <!-- Content Area -->
        <div class="content-wrapper">
            @yield('content')
        </div>
    </main>
    </main>
    @stack('scripts')
    <script>
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
            document.querySelector('.sidebar-overlay').classList.toggle('open');
        }
    </script>
    
    <!-- SweetAlert2 Global Exception Popups -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        @if(session('success'))
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: {!! json_encode(session('success')) !!},
                timer: 3000,
                showConfirmButton: false,
                backdrop: `rgba(0,0,0,0.4)`
            });
        @endif

        @if(session('error'))
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: {!! json_encode(session('error')) !!},
                confirmButtonColor: '#0E2A26',
                backdrop: `rgba(0,0,0,0.6)`
            });
        @endif

        @if(session('warning'))
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: {!! json_encode(session('warning')) !!},
                confirmButtonColor: '#eab308'
            });
        @endif

        @if($errors->any())
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                html: '{!! implode("<br>", $errors->all()) !!}',
                confirmButtonColor: '#0E2A26',
            });
        @endif
    </script>
</body>
</html>
