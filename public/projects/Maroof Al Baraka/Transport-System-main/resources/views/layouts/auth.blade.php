@php
$whatsapp_number = \App\Models\Setting::where('key', 'whatsapp_number')->value('value') ?: '966503702111';
@endphp
<!DOCTYPE html>
@php
$whatsapp_number = \App\Models\Setting::where('key', 'whatsapp_number')->value('value') ?: '966503702111';
$app_logo = \App\Models\Setting::where('key', 'app_logo')->value('value');
@endphp
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @if(isset($app_logo) && $app_logo)
    <link rel="icon" href="{{ asset($app_logo) }}">
    @else
    <link rel="icon" href="/favicon.ico">
    @endif
    <title>@yield('title') - {{ $settings['app_name'] ?? 'Maroof Al Baraka' }}</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --green-deep: #0E2A26;
            --green-mid: #16413A;
            --green-soft: #2E5C50;
            --sand: #F7F3E9;
            --sand-2: #EFE8D8;
            --gold: #C9A24B;
            --gold-bright: #E0BD6E;
            --ink: #16201D;
            --white: #FFFFFF;
            --line-on-dark: rgba(201,162,75,0.35);
            --line-on-light: rgba(14,42,38,0.14);
            --shadow: 0 12px 34px -8px rgba(0,0,0,0.08);
            
            --primary: var(--gold);
            --primary-hover: var(--gold-bright);
            --bg: var(--sand);
            --surface: var(--white);
            --text-main: var(--ink);
            --text-muted: rgba(22,32,29,0.6);
            --border: var(--line-on-light);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            -webkit-font-smoothing: antialiased;
            padding-top: 74px; /* for fixed header */
        }

        /* ---------- Header CSS ---------- */
        @include('partials.header_styles')

        h1, h2, h3, h4, .auth-title, .auth-logo {
            font-family: 'Fraunces', serif;
        }

        .auth-container {
            display: flex;
            width: 100%;
            min-height: 100vh;
        }

        .auth-image-side {
            display: none;
            flex: 1;
            position: relative;
            background: radial-gradient(ellipse 900px 500px at 50% -10%, rgba(201,162,75,0.16), transparent 60%),
                        linear-gradient(180deg, var(--green-deep) 0%, var(--green-mid) 100%);
            overflow: hidden;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--sand);
        }

        .auth-image-side::after {
            content:'';
            position:absolute;
            inset:0;
            background-image:
              linear-gradient(rgba(201,162,75,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,162,75,0.05) 1px, transparent 1px);
            background-size:64px 64px;
            mask-image:linear-gradient(180deg, black, transparent 70%);
            pointer-events:none;
        }

        .auth-image-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 60px;
            max-width: 500px;
        }

        .auth-image-content svg {
            width: 80px;
            height: 80px;
            margin-bottom: 30px;
        }

        .auth-image-content h1 {
            font-size: 3.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            line-height: 1.1;
        }

        .auth-image-content h1 em {
            font-style: normal;
            color: var(--gold-bright);
        }

        .auth-image-content p {
            font-size: 1.15rem;
            color: rgba(247,243,233,0.72);
            line-height: 1.6;
        }

        .auth-form-side {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background-color: var(--bg);
            position: relative;
        }

        .auth-card {
            width: 100%;
            max-width: 460px;
            background: var(--surface);
            padding: 46px;
            border-radius: 12px;
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
        }

        .auth-logo {
            text-align: center;
            font-size: 1.6rem;
            font-weight: 600;
            color: var(--green-deep);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        .auth-logo svg {
            width: 32px;
            height: 32px;
        }

        .auth-title {
            text-align: center;
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--ink);
            margin-bottom: 8px;
        }

        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.95rem;
            border-left: 4px solid transparent;
        }
        .alert-danger { 
            background: #fef2f2; 
            color: #991b1b;
            border: 1px solid #f87171;
        }
        .alert-success { 
            background: #ecfdf5; 
            color: #065f46;
            border: 1px solid #34d399;
        }

        .form-group {
            margin-bottom: 22px;
            text-align: left;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            color: var(--ink);
        }

        .form-control {
            width: 100%;
            padding: 14px 16px;
            background: var(--sand-2);
            border: 1px solid transparent;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.2s;
            font-family: inherit;
            color: var(--ink);
        }

        .form-control:focus {
            outline: none;
            background: var(--surface);
            border-color: var(--gold);
            box-shadow: 0 0 0 3px rgba(201,162,75,0.15);
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            border: 1px solid transparent;
            padding: 15px 28px;
            font-size: 15px;
            border-radius: 4px;
            transition: all 0.2s ease-in-out;
            font-family: inherit;
            width: 100%;
        }

        .btn-primary {
            background: var(--gold);
            color: var(--green-deep);
            position: relative;
            overflow: hidden;
            isolation: isolate;
        }

        .btn-primary::after {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 40%; height: 100%;
            background: linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent);
            transform: translateX(-120%) skewX(-12deg);
            z-index: 1;
        }

        .btn-primary:hover::after {
            animation: shimmer 1.1s ease forwards;
        }

        .btn-primary:hover {
            background: var(--gold-bright);
            transform: translateY(-2px);
        }

        @keyframes shimmer {
            100% { transform: translateX(250%) skewX(-12deg); }
        }

        .auth-footer {
            margin-top: 32px;
            text-align: center;
            font-size: 0.95rem;
            color: var(--text-muted);
        }

        .auth-footer a {
            color: var(--green-deep);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }

        .auth-footer a:hover {
            color: var(--gold-bright);
        }

        .text-muted {
            color: var(--text-muted);
        }

        @media (min-width: 1024px) {
            .auth-image-side {
                display: flex;
            }
        }
        
        @media (max-width: 600px) {
            .auth-card {
                padding: 30px 20px;
                border: none;
                box-shadow: none;
                background: transparent;
            }
            .auth-form-side {
                padding: 0;
        }
    </style>
</head>
<body>
    <!-- ============ HEADER ============ -->
    @include('partials.header')

    <div class="auth-container">
        <div class="auth-image-side">
            <div class="auth-image-content">
                @if(isset($app_logo) && $app_logo)
                  <img src="{{ asset($app_logo) }}" alt="Logo" style="width: 40px; height: 40px; object-fit: contain; margin-bottom: 24px; filter: brightness(0) invert(1);">
                @else
                  <svg viewBox="0 0 40 40" fill="none" style="width:40px;height:40px;margin-bottom:24px;">
                      <path d="M20 4C20 4 9 13 9 23C9 29 14 33 20 33C26 33 31 29 31 23C31 13 20 4 20 4Z" stroke="#C9A24B" stroke-width="1.6"/>
                      <path d="M20 33V37" stroke="#C9A24B" stroke-width="1.6"/>
                      <path d="M13 37H27" stroke="#C9A24B" stroke-width="1.6"/>
                  </svg>
                @endif
                <h1>Sacred journeys,<br><em>calm arrivals</em>.</h1>
                <p>Manage your transport operations seamlessly with Maroof Al Baraka's dedicated platform.</p>
            </div>
        </div>
        <div class="auth-form-side">
            <div class="auth-card">
                <!-- For mobile only, since desktop has the big logo on the left -->
                <div class="auth-logo" style="display: flex; justify-content: center; margin-bottom: 24px;">
                    @if(isset($app_logo) && $app_logo)
                      <img src="{{ asset($app_logo) }}" alt="Logo" style="width: 28px; height: 28px; object-fit: contain; margin-right: 8px;">
                    @else
                      <svg viewBox="0 0 40 40" fill="none" style="width:28px;height:28px; margin-right:8px;">
                          <path d="M20 4C20 4 9 13 9 23C9 29 14 33 20 33C26 33 31 29 31 23C31 13 20 4 20 4Z" stroke="#0E2A26" stroke-width="2"/>
                          <path d="M20 33V37" stroke="#0E2A26" stroke-width="2"/>
                          <path d="M13 37H27" stroke="#0E2A26" stroke-width="2"/>
                      </svg>
                    @endif
                    <span style="font-size:24px; font-weight:700; color:var(--text-main); letter-spacing:-0.02em;">Maroof Al Baraka</span>
                </div>
                @yield('content')
            </div>
        </div>
    </div>
    <script>
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        if(mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
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
