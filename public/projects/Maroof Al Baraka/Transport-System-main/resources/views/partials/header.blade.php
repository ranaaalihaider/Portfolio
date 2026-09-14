<header>
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
