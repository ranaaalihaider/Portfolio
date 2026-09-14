@php
$whatsapp_number = \App\Models\Setting::where('key', 'whatsapp_number')->value('value') ?: '966503702111';
$hero_image = \App\Models\Setting::where('key', 'hero_image')->value('value');
$app_logo = \App\Models\Setting::where('key', 'app_logo')->value('value');
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
@if(isset($app_logo) && $app_logo)
<link rel="icon" href="{{ asset($app_logo) }}">
@else
<link rel="icon" href="/favicon.ico">
@endif
<title>Maroof Al Baraka — Professional Transport & Transfers</title>
<meta name="description" content="Maroof Al Baraka — Professional airport and city transfers for Umrah & Ziyarat. Book easily via WhatsApp.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg-main: #0A1F1C;
  --bg-alt: #0E2A26;
  --bg-dark: #0A1F1C;
  
  --primary: #C9A24B;
  --primary-light: #E0BD6E;
  --accent: #C9A24B;
  
  --text-main: #FFFFFF;
  --text-muted: #A3B8B2;
  --text-light: #FFFFFF;
  
  --border-light: rgba(255, 255, 255, 0.1);
  --border-gold: rgba(201, 162, 75, 0.3);
  
  --shadow-sm: 0 4px 20px rgba(0,0,0,0.15);
  --shadow-md: 0 10px 30px rgba(0,0,0,0.25);
  --shadow-lg: 0 20px 40px rgba(0,0,0,0.3);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
  background: var(--bg-main);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  width: 100%;
}

h1, h2, h3, h4 { font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; color: #fff; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
ul { list-style: none; }
img, svg { display: block; max-width: 100%; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
section { padding: 100px 0; }

.eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.eyebrow::before { content: ''; width: 24px; height: 2px; background: var(--primary); display: block; }
.section-head { max-width: 600px; margin-bottom: 56px; }
.section-head.center { margin: 0 auto 56px; text-align: center; }
.section-head.center .eyebrow { justify-content: center; }
.section-head.center .eyebrow::before { display: none; }
.section-head h2 { font-size: clamp(32px, 4vw, 42px); margin-bottom: 16px; color: #fff; }
.section-head p { color: var(--text-muted); font-size: 17px; }

/* Animations */
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.reveal, .reveal-stagger > * { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal.in-view, .reveal-stagger.in-view > * { opacity: 1; transform: translateY(0); }
.reveal-stagger.in-view > *:nth-child(1) { transition-delay: 0.1s; }
.reveal-stagger.in-view > *:nth-child(2) { transition-delay: 0.2s; }
.reveal-stagger.in-view > *:nth-child(3) { transition-delay: 0.3s; }
.reveal-stagger.in-view > *:nth-child(4) { transition-delay: 0.4s; }

@include('partials.header_styles')

/* Hero */
.hero { padding-top: 160px; padding-bottom: 80px; background: var(--bg-dark); overflow: hidden; color: #fff; }
.hero-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; }
.hero-copy .eyebrow { color: var(--accent); }
.hero-copy .eyebrow::before { background: var(--accent); }
.hero-copy h1 { font-size: clamp(40px, 5vw, 56px); margin-bottom: 24px; color: #fff; animation: slideUp 0.8s ease 0.1s both; }
.hero-copy h1 span { color: var(--accent); }
.hero-copy p { font-size: 18px; color: var(--text-muted); max-width: 500px; margin-bottom: 40px; animation: slideUp 0.8s ease 0.2s both; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; animation: slideUp 0.8s ease 0.3s both; }
.hero-actions .btn-outline { color: #fff; border-color: rgba(255,255,255,0.3); }
.hero-actions .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
.hero-actions .btn-primary { background: var(--accent); color: var(--bg-dark); }
.hero-actions .btn-primary:hover { background: #e0bd6e; }
.hero-stats { display: flex; gap: 40px; animation: slideUp 0.8s ease 0.4s both; }
.hero-stats div b { font-size: 28px; color: #fff; display: block; font-weight: 700; margin-bottom: 4px; }
.hero-stats div span { font-size: 12px; font-weight: 500; text-transform: uppercase; color: var(--text-muted); }

.hero-visual { position: relative; animation: slideUp 1s ease 0.3s both; display: flex; justify-content: center; }
.hero-img-box {
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--border-gold);
  position: relative;
  backdrop-filter: blur(10px);
}
.hero-img-box::before {
  content: ''; position: absolute; top: -15px; left: -15px; right: 15px; bottom: 15px;
  border: 2px dashed var(--border-gold); border-radius: 16px; z-index: -1;
  opacity: 0.5;
}

/* Base card style */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}
.glass-card:hover {
  border-color: var(--border-gold);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-5px);
}

/* Features */
.features { padding: 60px 0; border-bottom: 1px solid var(--border-light); background: var(--bg-alt); }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.feature { display: flex; gap: 16px; align-items: flex-start; }
.feature-icon { width: 48px; height: 48px; background: rgba(201, 162, 75, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; border: 1px solid var(--border-gold); }
.feature h4 { font-size: 18px; margin-bottom: 8px; color: #fff; }
.feature p { font-size: 14px; color: var(--text-muted); }

/* Services */
.services { background: var(--bg-main); }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.service-card { padding: 40px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; transition: transform 0.3s; }
.service-card:hover { border-color: var(--border-gold); transform: translateY(-5px); }
.service-icon { width: 40px; height: 40px; color: var(--primary); margin-bottom: 24px; }
.service-card h3 { font-size: 22px; margin-bottom: 12px; color: #fff; }
.service-card p { font-size: 15px; color: var(--text-muted); }

/* Fleet */
.fleet { background: var(--bg-alt); }
.fleet-grid { 
  display: flex; 
  gap: 30px; 
  overflow-x: auto; 
  padding-bottom: 20px; 
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.fleet-grid::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera */ }
.fleet-grid .ticket {
  /* On large screens, show ~3 cards with the rest overflowing */
  flex: 0 0 calc(33.333% - 20px);
  scroll-snap-align: start;
}
@media(max-width: 1024px) {
  .fleet-grid .ticket {
    /* Show ~2 cards on tablets */
    flex: 0 0 calc(50% - 15px);
  }
}
.carousel-wrapper { position: relative; }
.carousel-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--bg-dark); border: 1px solid var(--accent);
  color: var(--accent); display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.2s;
}
.carousel-btn:hover { background: var(--accent); color: var(--bg-dark); }
.carousel-btn.left { left: -24px; }
.carousel-btn.right { right: -24px; }
.ticket { display: flex; flex-direction: column; overflow: hidden; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; transition: transform 0.3s; }
.ticket:hover { border-color: var(--border-gold); transform: translateY(-5px); }
.ticket-top { padding: 32px 32px 0; text-align: center; }
.ticket-route { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: var(--primary); margin-bottom: 24px; text-transform: uppercase; }
.ticket-illustration { height: 130px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.ticket-info { padding: 0 32px 32px; text-align: center; border-bottom: 1px solid var(--border-light); flex-grow: 1; }
.ticket h4 { font-size: 22px; margin-bottom: 8px; color: #fff; }
.ticket .seats { font-size: 14px; color: var(--text-muted); }
.ticket-bottom { padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
.ticket-bottom .price-label { font-size: 12px; font-weight: 600; color: var(--primary); }
.ticket-cta { font-size: 14px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 4px; transition: color 0.2s; }
.ticket-cta:hover { color: var(--primary); }
.ticket-cta svg { width: 16px; height: 16px; transition: transform 0.2s; }
.ticket-cta:hover svg { transform: translateX(4px); }

/* How it works */
.how { background: var(--bg-main); color: #fff; border-top: 1px solid var(--border-light); }
.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; position: relative; }
.how-step { position: relative; padding: 32px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; }
.how-step-num { font-size: 32px; font-weight: 700; color: var(--primary); margin-bottom: 16px; display: block; opacity: 0.9; }
.how-step h4 { font-size: 20px; margin-bottom: 12px; color: #fff; }
.how-step p { font-size: 15px; color: var(--text-muted); }

/* Reviews */
.reviews { background: var(--bg-alt); }
.reviews-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
.review-card { padding: 40px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; }
.review-quote-mark { font-size: 64px; color: var(--border-gold); line-height: 0.5; margin-bottom: 20px; font-family: serif; }
.review-card p.quote { font-size: 16px; color: #fff; margin-bottom: 30px; line-height: 1.6; }
.review-meta { display: flex; align-items: center; gap: 16px; }
.review-avatar { width: 48px; height: 48px; border-radius: 50%; background: rgba(201, 162, 75, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; border: 1px solid var(--border-gold); }
.review-meta div b { display: block; font-size: 15px; font-weight: 600; color: #fff; }
.review-meta div span { font-size: 12px; color: var(--text-muted); text-transform: uppercase; }

/* Booking Form */
.booking { background: var(--bg-main); }
.booking-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.booking-info h2 { margin-bottom: 24px; color: #fff; }
.booking-info p { margin-bottom: 40px; color: var(--text-muted); }
.booking-info ul { display: flex; flex-direction: column; gap: 20px; }
.booking-info ul li { display: flex; gap: 16px; align-items: center; font-size: 16px; color: #fff; font-weight: 500; }
.booking-info ul li svg { width: 24px; height: 24px; color: var(--primary); }

.booking-form { padding: 40px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.field { margin-bottom: 20px; }
.field label { display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
.field input, .field select { width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); border-radius: 6px; color: #fff; font-family: inherit; font-size: 14px; transition: all 0.2s; }
.field input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(201, 162, 75, 0.15); background: rgba(0,0,0,0.4); }
.vehicle-select { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.vehicle-opt { background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); border-radius: 6px; padding: 14px 8px; text-align: center; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: var(--text-muted); }
.vehicle-opt.active { border-color: var(--primary); background: rgba(201, 162, 75, 0.1); color: var(--primary); }
.form-actions { display: flex; gap: 16px; margin-top: 32px; }
.btn-form-secondary { flex: 1; padding: 14px; border: 1px solid var(--border-light); border-radius: 6px; color: #fff; background: transparent; font-weight: 600; transition: background 0.2s; }
.btn-form-secondary:hover { background: rgba(255,255,255,0.05); border-color: var(--primary); }
.btn-form-primary { flex: 1.5; padding: 14px; border-radius: 6px; background: var(--primary); color: var(--bg-dark); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
.btn-form-primary:hover { background: var(--primary-light); }

/* FAQ */
.faq { background: var(--bg-alt); border-top: 1px solid var(--border-light); }
.faq-list { max-width: 700px; margin: 0 auto; }
.faq-item { border: 1px solid var(--border-light); border-radius: 8px; background: rgba(255,255,255,0.02); margin-bottom: 16px; overflow: hidden; }
.faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 24px; font-size: 16px; font-weight: 600; color: #fff; text-align: left; background: transparent; }
.faq-q .plus { width: 20px; height: 20px; position: relative; color: var(--primary); }
.faq-q .plus::before, .faq-q .plus::after { content: ''; position: absolute; background: currentColor; transition: transform 0.3s; }
.faq-q .plus::before { top: 50%; left: 0; right: 0; height: 2px; transform: translateY(-50%); }
.faq-q .plus::after { left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); }
.faq-item.open .plus::after { transform: translateX(-50%) rotate(90deg); opacity: 0; }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-a p { padding: 0 24px 24px; font-size: 15px; color: var(--text-muted); line-height: 1.6; }
.faq-item.open .faq-a { max-height: 200px; }

/* Final CTA */
.final-cta { text-align: center; padding: 120px 0; background: var(--bg-dark); border-top: 1px solid var(--border-gold); }
.final-cta-inner { max-width: 600px; margin: 0 auto; }
.final-cta .eyebrow { color: var(--primary); }
.final-cta .eyebrow::before { background: var(--primary); }
.final-cta h2 { margin-bottom: 24px; color: #fff; }
.final-cta p { margin-bottom: 40px; color: var(--text-muted); font-size: 18px; }
.btn-light { display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: var(--primary); color: var(--bg-dark); font-weight: 600; font-size: 15px; padding: 16px 32px; border-radius: 6px; transition: transform 0.2s; }
.btn-light:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(201, 162, 75, 0.2); }

/* Footer */
footer { background: var(--bg-main); color: var(--text-muted); padding-top: 80px; border-top: 1px solid var(--border-light); }
.footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 60px; padding-bottom: 60px; border-bottom: 1px solid var(--border-light); }
.footer-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: #fff; }
.footer-brand svg { width: 32px; height: 32px; color: var(--accent); }
.footer-brand span { font-size: 20px; font-weight: 700; }
.footer-col h5 { font-size: 13px; font-weight: 600; text-transform: uppercase; color: #fff; margin-bottom: 24px; }
.footer-col ul { display: flex; flex-direction: column; gap: 16px; }
.footer-col ul li a { font-size: 14px; transition: color 0.2s; }
.footer-col ul li a:hover { color: var(--primary); }
.footer-bottom { padding: 32px 0; display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
.social { display: flex; gap: 16px; }
.social a { width: 36px; height: 36px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; transition: background 0.2s; }
.social a:hover { background: var(--primary); color: var(--bg-dark); }

/* Floating WhatsApp */
.float-wa { position: fixed; bottom: 32px; right: 32px; width: 60px; height: 60px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(37,211,102,0.3); z-index: 90; transition: transform 0.2s; }
.float-wa:hover { transform: scale(1.05); }
.float-wa svg { width: 30px; height: 30px; color: white; }

@media(max-width: 1024px) {
  .hero-inner, .booking-wrap { grid-template-columns: 1fr; text-align: center; }
  .hero-copy p { margin: 0 auto 40px; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .features-grid, .services-grid, .how-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-visual { margin-top: 60px; }
}

@media(max-width: 920px) {
  .hero { padding-top: 120px; padding-bottom: 60px; }
  section { padding: 70px 0; }
  .footer-top { grid-template-columns: 1fr; gap: 40px; text-align: center; }
  .footer-brand { justify-content: center; }
  .footer-col ul { align-items: center; }
}

@media(max-width: 760px) {
  .features-grid, .services-grid, .how-grid { grid-template-columns: 1fr; }
  .fleet-grid .ticket { flex: 0 0 85vw; }
  .reviews-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .hero-copy h1 { font-size: clamp(32px, 8vw, 40px); }
  .hero-stats { flex-direction: column; gap: 20px; align-items: center; }
  .hero-actions { flex-direction: column; width: 100%; max-width: 300px; margin: 0 auto 40px; }
  .hero-actions a { width: 100%; justify-content: center; }
  .section-head h2 { font-size: 28px; }
  .ticket-bottom { flex-direction: column; gap: 16px; align-items: flex-start; text-align: left; }
  .ticket-cta { width: 100%; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; }
  .footer-bottom { flex-direction: column; gap: 24px; text-align: center; }
  .float-wa { width: 50px; height: 50px; bottom: 20px; right: 20px; }
  .float-wa svg { width: 24px; height: 24px; }
  .vehicle-select { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; gap: 12px; }
  .btn-form-secondary, .btn-form-primary { width: 100%; }
  .faq-q { padding: 16px; font-size: 15px; }
  .faq-a p { padding: 0 16px 16px; }
  .final-cta { padding: 80px 0; }
  .feature { flex-direction: column; align-items: center; text-align: center; }
  
  /* Additional tweaks for tiny mobile screens */
  .eyebrow { flex-wrap: wrap; justify-content: center; text-align: center; font-size: 10px; }
  .eyebrow::before { display: none; }
  .nav-inner { padding: 12px 16px; }
  .brand-mark { max-height: 28px !important; }
  .brand-text { font-size: 13px !important; }
  .brand-text span { font-size: 7px !important; }
  .btn-primary { padding: 8px 12px !important; font-size: 11px !important; gap: 6px !important; }
  header .btn-primary { box-shadow: none; }
}

</style>
</head>
<body>

@include('partials.header')

<section class="hero" id="hero">
  <div class="container hero-inner">
    <div class="hero-copy">
      <p class="eyebrow">Professional Transfer Service</p>
      <h1>Sacred journeys deserve a <span>calm arrival</span>.</h1>
      <p>Private airport and city transfers for Umrah & Ziyarat. Flight-tracked pickups, highly professional drivers, and completely transparent pricing.</p>
      <div class="hero-actions">
        <a href="#bookForm" class="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.7-3-2.1-3.5-2.9-.1-.2 0-.4.1-.5.2-.2.4-.5.6-.7.2-.2.2-.4.1-.6-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.2 2.9.2.2 2 3 4.8 4.1 2.4.9 2.9.7 3.4.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.7-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.3C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.9 14.7 3.5 13.4 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20 12 20z"/></svg>
          Book via WhatsApp
        </a>
        <a href="#fleet" class="btn-outline">View Fleet</a>
      </div>
      <div class="hero-stats">
        <div><b>4.9/5</b><span>Pilgrim Rating</span></div>
        <div><b>24/7</b><span>Flight Tracking</span></div>
        <div><b>100%</b><span>Reliability</span></div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-img-box">
        @if(isset($hero_image) && $hero_image)
          <img src="{{ asset($hero_image) }}" alt="Premium Transport" style="width: 100%; height: auto; border-radius: 12px;">
        @else
          <!-- Professional Car Graphic instead of abstract glow -->
          <svg viewBox="0 0 400 250" fill="none" style="width: 100%; height: auto;">
            <rect x="20" y="80" width="360" height="90" rx="20" fill="#0F172A"/>
            <path d="M60 80 L100 30 L260 30 L320 80 Z" fill="#1E293B"/>
            <rect x="120" y="38" width="130" height="42" rx="4" fill="#E2E8F0"/>
            <circle cx="100" cy="170" r="35" fill="#334155" stroke="#FFFFFF" stroke-width="4"/>
            <circle cx="300" cy="170" r="35" fill="#334155" stroke="#FFFFFF" stroke-width="4"/>
            <circle cx="100" cy="170" r="15" fill="#CBD5E1"/>
            <circle cx="300" cy="170" r="15" fill="#CBD5E1"/>
            <rect x="20" y="120" width="360" height="4" fill="#D4AF37"/>
            <path d="M0 205 L400 205" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="8 8"/>
          </svg>
        @endif
      </div>
    </div>
  </div>
</section>

<section class="features">
  <div class="container features-grid reveal-stagger">
    <div class="feature">
      <div class="feature-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16l3-3 5 1 6-6 4 1-3 7-9 3-6-3z"/><path d="M16 4l4 4"/></svg>
      </div>
      <div>
        <h4>Flight Monitoring</h4>
        <p>Real-time flight tracking guarantees we adjust for delays. No waiting, no missed pickups.</p>
      </div>
    </div>
    <div class="feature">
      <div class="feature-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/></svg>
      </div>
      <div>
        <h4>Professional Drivers</h4>
        <p>Our drivers are courteous, strictly vetted, and fluent in multiple languages.</p>
      </div>
    </div>
    <div class="feature">
      <div class="feature-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 14h4"/></svg>
      </div>
      <div>
        <h4>Transparent Pricing</h4>
        <p>Fixed, upfront pricing confirmed before your ride. No hidden fees or meter anxiety.</p>
      </div>
    </div>
  </div>
</section>

<section class="services" id="services">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Our Services</p>
      <h2>Tailored for Pilgrims</h2>
      <p>Every journey is planned around the unique rhythm and requirements of Umrah and Ziyarat.</p>
    </div>
    <div class="services-grid reveal-stagger">
      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 16l4-1 5-6 5 1 6 2-2 4-13 3-3-3z"/><circle cx="7" cy="20" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>
        <h3>Airport Pickup</h3>
        <p>Private pickups from King Abdulaziz Intl. Meet & greet, luggage assistance, straight to your hotel.</p>
      </div>
      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/></svg>
        <h3>Inter-City Transfers</h3>
        <p>Comfortable transfers between Makkah and Madinah, including scheduled rest and prayer stops.</p>
      </div>
      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
        <h3>Hourly Charters</h3>
        <p>Charter a vehicle by the hour for ziyarat sites, personal errands, or customized group itineraries.</p>
      </div>
    </div>
  </div>
</section>

<section class="fleet" id="fleet">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow">The Fleet</p>
      <h2>Premium Vehicles</h2>
      <p>Select the vehicle that best fits your group size and comfort preferences.</p>
    </div>
    <div class="carousel-wrapper">
      <button class="carousel-btn left" id="scrollLeftBtn" aria-label="Scroll left">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      
      <div class="fleet-grid reveal-stagger" id="fleetGrid">
      @foreach($landingCars as $car)
      <div class="ticket">
        <div class="ticket-top">
          <div class="ticket-route">{{ $car->route }}</div>
          <div class="ticket-illustration">
            @if($car->image_path)
              <img src="{{ asset($car->image_path) }}" alt="{{ $car->name }}" style="height: 120px; width: auto; object-fit: contain;">
            @else
              <!-- Corporate Clean Fallback Graphic -->
              <svg viewBox="0 0 160 90" fill="none">
                <rect x="10" y="30" width="140" height="36" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
                <rect x="25" y="16" width="90" height="14" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
                <circle cx="35" cy="66" r="12" fill="#334155"/>
                <circle cx="115" cy="66" r="12" fill="#334155"/>
                <rect x="20" y="45" width="120" height="2" fill="#D4AF37"/>
              </svg>
            @endif
          </div>
        </div>
        <div class="ticket-info">
          <h4>{{ $car->name }}</h4>
          <p class="seats">{{ $car->subtitle }}</p>
        </div>
        <div class="ticket-bottom">
          <span class="price-label">{{ $car->label }}</span>
          <a href="https://wa.me/{{ $whatsapp_number ?? '966503702111' }}?text={{ urlencode('Hi, I\'d like to book the ' . $car->name . '.') }}" class="ticket-cta">Select <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
        </div>
      </div>
      @endforeach
      </div>

      <button class="carousel-btn right" id="scrollRightBtn" aria-label="Scroll right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  </div>
</section>

<section class="how" id="how">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow" style="color: var(--accent);">Simple Process</p>
      <h2>Seamless Booking</h2>
      <p>No app required. The entire booking process happens effortlessly on WhatsApp.</p>
    </div>
    <div class="how-grid reveal-stagger">
      <div class="how-step">
        <span class="how-step-num">01</span>
        <h4>Send Details</h4>
        <p>Provide your pickup location, drop-off destination, travel date, and passenger count.</p>
      </div>
      <div class="how-step">
        <span class="how-step-num">02</span>
        <h4>Receive Confirmation</h4>
        <p>We'll reply promptly with driver details, vehicle confirmation, and pickup timing.</p>
      </div>
      <div class="how-step">
        <span class="how-step-num">03</span>
        <h4>Enjoy the Ride</h4>
        <p>Experience a smooth, comfortable transfer with our professional chauffeurs.</p>
      </div>
    </div>
  </div>
</section>

<section class="reviews" id="reviews">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow">Client Feedback</p>
      <h2>Trusted by Pilgrims</h2>
    </div>
    <div class="reviews-grid reveal-stagger">
      <div class="review-card">
        <div class="review-quote-mark">"</div>
        <p class="quote">The driver arrived early and assisted with all our luggage. The vehicle was spotless. A truly professional service that I will use again for my next Umrah.</p>
        <div class="review-meta">
          <div class="review-avatar">AR</div>
          <div><b>Ayesha R.</b><span>JEDDAH → MAKKAH</span></div>
        </div>
      </div>
      <div class="review-card">
        <div class="review-quote-mark">"</div>
        <p class="quote">Excellent communication from booking to drop-off. The fixed pricing gave us peace of mind. Highly recommended for families.</p>
        <div class="review-meta">
          <div class="review-avatar">BK</div>
          <div><b>Bilal K.</b><span>MADINAH TOUR</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="booking" id="contact">
  <div class="container booking-wrap">
    <div class="booking-info reveal">
      <p class="eyebrow">Instant Booking</p>
      <h2 id="bookForm">Request a transfer instantly.</h2>
      <p>Fill out the form below. We will pre-fill a WhatsApp message for you, allowing you to review and send it in one click.</p>
      <ul>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> No credit card required upfront</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Fast response time</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Flexible cancellation policy</li>
      </ul>
    </div>

    <form class="booking-form reveal" id="bookingForm">
      <div class="form-row">
        <div class="field">
          <label>Pickup Location</label>
          <input type="text" id="pickup" placeholder="e.g. Jeddah Airport">
        </div>
        <div class="field">
          <label>Drop-off Location</label>
          <input type="text" id="dropoff" placeholder="e.g. Makkah Hotel">
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Date</label>
          <input type="date" id="date">
        </div>
        <div class="field">
          <label>Passengers</label>
          <input type="number" id="passengers" min="1" placeholder="e.g. 4">
        </div>
      </div>
      <div class="field">
        <label>Select Vehicle</label>
        <div class="vehicle-select">
          <div class="vehicle-opt active" data-v="Toyota HI Ace">HI Ace</div>
          <div class="vehicle-opt" data-v="Hyundai Staria">Staria</div>
          <div class="vehicle-opt" data-v="Staria X">Staria X</div>
        </div>
      </div>
      <div class="field">
        <label>Your Name</label>
        <input type="text" id="name" placeholder="Full Name">
      </div>
      <div class="form-actions">
        <button type="button" class="btn-form-secondary" id="previewBtn">Preview Details</button>
        <button type="submit" class="btn-form-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.7-3-2.1-3.5-2.9-.1-.2 0-.4.1-.5.2-.2.4-.5.6-.7.2-.2.2-.4.1-.6-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.2 2.9.2.2 2 3 4.8 4.1 2.4.9 2.9.7 3.4.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.7-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.3C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.9 14.7 3.5 13.4 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20 12 20z"/></svg>
          Send via WhatsApp
        </button>
      </div>
      <p id="previewText" style="margin-top:20px;font-size:14px;color:var(--text-main);display:none;font-family:monospace;background:#fff;border:1px solid var(--border-light);padding:16px;border-radius:6px;white-space:pre-wrap;"></p>
    </form>
  </div>
</section>

<section class="faq">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow">Support</p>
      <h2>Frequently Asked Questions</h2>
    </div>
    <div class="faq-list reveal">
      <div class="faq-item open">
        <button class="faq-q"><span>What is your date-change policy?</span><span class="plus"></span></button>
        <div class="faq-a"><p>You can change your pickup time or date free of charge up to 12 hours before the original pickup time. Changes within 12 hours depend on driver availability.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q"><span>Do you offer female drivers?</span><span class="plus"></span></button>
        <div class="faq-a"><p>This service is not available at the moment. However, all our current drivers are trained in respectful, family-friendly service.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q"><span>How do I pay for my trip?</span><span class="plus"></span></button>
        <div class="faq-a"><p>Pricing is confirmed upfront over WhatsApp before your trip begins. Payment is made directly to the driver or via the method agreed upon during booking.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="final-cta reveal">
  <div class="container final-cta-inner">
    <p class="eyebrow" style="justify-content:center;">Book Today</p>
    <h2>Ready to schedule your transfer?</h2>
    <p>Contact our support team directly to secure your vehicle and receive immediate confirmation.</p>
    <a href="https://wa.me/{{ $whatsapp_number }}" class="btn-light">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.7-3-2.1-3.5-2.9-.1-.2 0-.4.1-.5.2-.2.4-.5.6-.7.2-.2.2-.4.1-.6-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.2 2.9.2.2 2 3 4.8 4.1 2.4.9 2.9.7 3.4.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.7-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.3C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.9 14.7 3.5 13.4 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20 12 20z"/></svg>
      Message Support
    </a>
  </div>
</section>

<footer id="footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <div class="footer-brand">
          @if(isset($app_logo) && $app_logo)
            <img src="{{ asset($app_logo) }}" alt="Logo" style="max-height: 40px; width: auto;">
          @else
            <svg viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 4C20 4 9 13 9 23C9 29 14 33 20 33C26 33 31 29 31 23C31 13 20 4 20 4Z"/>
              <path d="M20 33V37" stroke="currentColor" stroke-width="2"/>
              <path d="M13 37H27" stroke="currentColor" stroke-width="2"/>
            </svg>
          @endif
          <span>Maroof Al Baraka</span>
        </div>
        <p>Professional Umrah & Ziyarat transfers across Saudi Arabia. Reliable, transparent, and comfortable.</p>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="#services">Our Services</a></li>

          <li><a href="#fleet">Our Fleet</a></li>

          <li><a href="#how">How it Works</a></li>

          <li><a href="#reviews">Client Reviews</a></li>

        </ul>

      </div>

      <div class="footer-col">

        <h5>Contact</h5>

        <ul>

          <li><a href="https://wa.me/{{ $whatsapp_number }}">WhatsApp Support</a></li>

          <li><a href="mailto:info@maroofalbaraka.com">info@maroofalbaraka.com</a></li>

        </ul>

      </div>

    </div>

    <div class="footer-bottom">

      <span>&copy; 2026 Maroof Al Baraka Transport. All rights reserved.</span>

      <div class="social">

        <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>

        <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V12H8v3h2.5v6h3v-6H16l.5-3h-3V9.5c0-.3.2-.5.5-.5z"/></svg></a>

      </div>

    </div>

  </div>

</footer>



<a href="https://wa.me/{{ $whatsapp_number }}" class="float-wa" aria-label="Chat on WhatsApp">

  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.7-3-2.1-3.5-2.9-.1-.2 0-.4.1-.5.2-.2.4-.5.6-.7.2-.2.2-.4.1-.6-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.2 2.9.2.2 2 3 4.8 4.1 2.4.9 2.9.7 3.4.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.7-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.3C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.9 14.7 3.5 13.4 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20 12 20z"/></svg>

</a>



<script>

// Scroll reveal

const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const io = new IntersectionObserver((entries)=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      entry.target.classList.add('in-view');

      io.unobserve(entry.target);

    }

  });

},{threshold:0.1, rootMargin:'0px 0px -50px 0px'});

revealEls.forEach(el=>io.observe(el));



// FAQ

document.querySelectorAll('.faq-item').forEach(item=>{

  item.querySelector('.faq-q').addEventListener('click',()=>{

    const wasOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));

    if(!wasOpen) item.classList.add('open');

  });

});



// Vehicle select

let selectedVehicle = 'Toyota HI Ace';

document.querySelectorAll('.vehicle-opt').forEach(opt=>{

  opt.addEventListener('click',()=>{

    document.querySelectorAll('.vehicle-opt').forEach(o=>o.classList.remove('active'));

    opt.classList.add('active');

    selectedVehicle = opt.dataset.v;

  });

});



function buildMessage(){

  const pickup = document.getElementById('pickup').value || '(not specified)';

  const dropoff = document.getElementById('dropoff').value || '(not specified)';

  const date = document.getElementById('date').value || '(not specified)';

  const passengers = document.getElementById('passengers').value || '(not specified)';

  const name = document.getElementById('name').value || '(not specified)';

  return `Hello Maroof Al Baraka Transport, I'd like to request a booking.



Name: ${name}

Pickup: ${pickup}

Drop-off: ${dropoff}

Date: ${date}

Passengers: ${passengers}

Vehicle: ${selectedVehicle}`;

}



document.getElementById('previewBtn').addEventListener('click',()=>{

  const el = document.getElementById('previewText');

  el.textContent = buildMessage();

  el.style.display = 'block';

});



document.getElementById('bookingForm').addEventListener('submit',(e)=>{

  e.preventDefault();

  const msg = encodeURIComponent(buildMessage());

  window.open(`https://wa.me/{{ $whatsapp_number }}?text=${msg}`, '_blank');

});



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

const fleetGrid = document.getElementById('fleetGrid');
const scrollLeftBtn = document.getElementById('scrollLeftBtn');
const scrollRightBtn = document.getElementById('scrollRightBtn');
if(scrollLeftBtn && scrollRightBtn && fleetGrid) {
  const scrollAmount = 350;
  scrollLeftBtn.addEventListener('click', () => {
    fleetGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  scrollRightBtn.addEventListener('click', () => {
    fleetGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}


</script>



</body>

</html>

