import os
import re

partials_dir = r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\resources\views\partials'
os.makedirs(partials_dir, exist_ok=True)

landing_path = r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\resources\views\landing.blade.php'
auth_path = r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\resources\views\layouts\auth.blade.php'

with open(landing_path, 'r', encoding='utf-8') as f:
    landing = f.read()
with open(auth_path, 'r', encoding='utf-8') as f:
    auth = f.read()

# 1. Create header_styles.blade.php
header_css = '''<style>
/* ============ SHARED HEADER STYLES ============ */
header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(14, 42, 38, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-gold);
  transition: all 0.3s ease;
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; max-width: 1200px; margin: 0 auto; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.brand-mark { width: 32px; height: 32px; color: var(--accent); }
.brand-text { font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em; font-family: 'Inter', sans-serif; }
.brand-text span { display: block; font-size: 10px; font-weight: 500; letter-spacing: 0.05em; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; }

nav.links { display: flex; gap: 32px; }
nav.links a { font-size: 14px; font-weight: 500; color: var(--text-muted); transition: color 0.2s; text-decoration: none; }
nav.links a:hover { color: var(--accent); }

header .btn-outline { color: #fff; border-color: rgba(255,255,255,0.3); }
header .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
header .btn-primary { background: var(--accent); color: var(--bg-dark); }
header .btn-primary:hover { background: #e0bd6e; }

.mobile-menu-btn { display: none; color: #fff; background: transparent; border: none; padding: 8px; margin-left: 8px; cursor: pointer; }
.mobile-menu {
  position: absolute; top: 100%; left: 0; right: 0;
  background: var(--bg-alt); border-bottom: 1px solid var(--border-light);
  padding: 20px 32px; display: flex; flex-direction: column; gap: 16px;
  transform: translateY(-10px); opacity: 0; pointer-events: none; transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}
.mobile-menu.active { transform: translateY(0); opacity: 1; pointer-events: all; }
.mobile-menu a { font-size: 16px; font-weight: 500; color: #fff; text-decoration: none; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.mobile-menu a:last-child { border-bottom: none; color: var(--primary); }

.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  background: var(--primary); color: var(--bg-dark);
  font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 6px; transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(201, 162, 75, 0.2); text-decoration: none;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 162, 75, 0.3); background: var(--primary-light); }

.btn-outline {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid var(--border-light); background: transparent;
  color: #fff; font-weight: 500; font-size: 14px; padding: 14px 28px; border-radius: 6px; transition: all 0.2s; text-decoration: none;
}
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }

@media(max-width: 920px) {
  nav.links { display: none; }
  header .btn-outline { display: none; }
  .mobile-menu-btn { display: block; }
  .brand-text { font-size: 16px; }
  .brand-text span { font-size: 9px; }
  .nav-inner { padding: 16px 20px; }
  .btn-primary { padding: 12px 20px; font-size: 13px; }
}
</style>'''

with open(os.path.join(partials_dir, 'header_styles.blade.php'), 'w', encoding='utf-8') as f:
    f.write(header_css)

# 2. Create header.blade.php
header_html = '''<header>
  <div class="nav-inner">
    <a href="{{ url('/') }}" class="brand">
      @if(isset($app_logo) && $app_logo)
        <img src="{{ asset($app_logo) }}" alt="Logo" class="brand-mark" style="max-height: 40px; width: auto; max-width: 140px;">
      @else
        <svg class="brand-mark" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 4C20 4 9 13 9 23C9 29 14 33 20 33C26 33 31 29 31 23C31 13 20 4 20 4Z"/>
          <path d="M20 33V37" stroke="currentColor" stroke-width="2"/>
          <path d="M13 37H27" stroke="currentColor" stroke-width="2"/>
        </svg>
      @endif
      <span class="brand-text">Maroof Al Baraka<span>Umrah & Ziyarat Transfers</span></span>
    </a>
    <nav class="links">
      <a href="{{ url('/#services') }}">Services</a>
      <a href="{{ url('/#fleet') }}">Fleet</a>
      <a href="{{ url('/#how') }}">How it Works</a>
      <a href="{{ url('/#reviews') }}">Reviews</a>
      <a href="{{ url('/#contact') }}">Contact</a>
    </nav>
    <div style="display: flex; gap: 16px; align-items: center;">
      <a href="{{ route('login') }}" class="btn-outline">Log In</a>
      <a href="https://wa.me/{{ $whatsapp_number ?? '966503702111' }}" class="btn-primary">Book Now</a>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="{{ url('/#services') }}" class="mobile-link">Services</a>
    <a href="{{ url('/#fleet') }}" class="mobile-link">Fleet</a>
    <a href="{{ url('/#how') }}" class="mobile-link">How it Works</a>
    <a href="{{ url('/#reviews') }}" class="mobile-link">Reviews</a>
    <a href="{{ url('/#contact') }}" class="mobile-link">Contact</a>
    <a href="{{ route('login') }}" class="mobile-link">Log In</a>
  </div>
</header>
'''
with open(os.path.join(partials_dir, 'header.blade.php'), 'w', encoding='utf-8') as f:
    f.write(header_html)

# 3. Clean landing.blade.php
landing = re.sub(r'/\* Header \*/.*?.btn-outline:hover.*?}\n', '@include(\'partials.header_styles\')\n', landing, flags=re.DOTALL)
landing = re.sub(r'  nav\.links { display: none; }\n  header \.btn-outline { display: none; }\n  \.mobile-menu-btn { display: block; }\n  \.brand-text { font-size: 16px; }\n  \.brand-text span { font-size: 9px; }\n  \.nav-inner { padding: 16px 20px; }\n  \.btn-primary { padding: 12px 20px; font-size: 13px; }\n', '', landing)
landing = re.sub(r'<header>.*?</header>', '@include(\'partials.header\')', landing, flags=re.DOTALL)
with open(landing_path, 'w', encoding='utf-8') as f:
    f.write(landing)

# 4. Clean auth.blade.php
auth = re.sub(r'        /\* Header \*/.*?        .btn-outline:hover.*?}\n', '        @include(\'partials.header_styles\')\n', auth, flags=re.DOTALL)
auth = re.sub(r'    <!-- ============ HEADER ============ -->\s*<header>.*?</header>', '    <!-- ============ HEADER ============ -->\n    @include(\'partials.header\')', auth, flags=re.DOTALL)
with open(auth_path, 'w', encoding='utf-8') as f:
    f.write(auth)
print('Success')
