
/* ============ SHARED HEADER STYLES ============ */
header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(14, 42, 38, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201, 162, 75, 0.3);
  transition: all 0.3s ease;
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; max-width: 1200px; margin: 0 auto; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.brand-mark { width: 32px; height: 32px; color: #C9A24B; }
.brand-text { font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em; font-family: 'Inter', sans-serif; }
.brand-text span { display: block; font-size: 10px; font-weight: 500; letter-spacing: 0.05em; color: #A3B8B2; text-transform: uppercase; margin-top: 2px; }

nav.links { display: flex; gap: 32px; }
nav.links a { font-size: 14px; font-weight: 500; color: #A3B8B2; transition: color 0.2s; text-decoration: none; }
nav.links a:hover { color: #C9A24B; }

header .btn-outline { color: #fff; border-color: rgba(255,255,255,0.3); }
header .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
header .btn-primary { background: #C9A24B; color: #0A1F1C; }
header .btn-primary:hover { background: #e0bd6e; }

.mobile-menu-btn { display: none; color: #fff; background: transparent; border: none; padding: 8px; margin-left: 8px; cursor: pointer; }
.mobile-menu {
  position: absolute; top: 100%; left: 0; right: 0;
  background: #0E2A26; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 32px; display: flex; flex-direction: column; gap: 16px;
  transform: translateY(-10px); opacity: 0; pointer-events: none; transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}
.mobile-menu.active { transform: translateY(0); opacity: 1; pointer-events: all; }
.mobile-menu a { font-size: 16px; font-weight: 500; color: #fff; text-decoration: none; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.mobile-menu a:last-child { border-bottom: none; color: #C9A24B; }

.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  background: #C9A24B; color: #0A1F1C;
  font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 6px; transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(201, 162, 75, 0.2); text-decoration: none;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 162, 75, 0.3); background: #E0BD6E; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1); background: transparent;
  color: #fff; font-weight: 500; font-size: 14px; padding: 14px 28px; border-radius: 6px; transition: all 0.2s; text-decoration: none;
}
.btn-outline:hover { border-color: #C9A24B; color: #C9A24B; }

@media(max-width: 920px) {
  nav.links { display: none; }
  header .btn-outline { display: none; }
  .mobile-menu-btn { display: block; }
  .brand-text { font-size: 16px; }
  .brand-text span { font-size: 9px; }
  .nav-inner { padding: 16px 20px; }
  .btn-primary { padding: 12px 20px; font-size: 13px; }
}
