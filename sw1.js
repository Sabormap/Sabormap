<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sabormap — Panel de Locales</title>
    <meta name="description" content="Panel privado para dueños de locales: gestiona fichas, cartas, fotos y estadísticas en Sabormap.">
    <meta name="robots" content="noindex, nofollow">
    <!-- [F-3.4] Content Security Policy estricta: previene XSS y cargas no autorizadas -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' https://cfmqwnfimpfuivqmsxju.supabase.co data: blob:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://cfmqwnfimpfuivqmsxju.supabase.co wss://cfmqwnfimpfuivqmsxju.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'">
    <!-- [F-3.4] Otras cabeceras de seguridad via meta -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta name="theme-color" content="#070912" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#7c3aed" media="(prefers-color-scheme: light)">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="SaborMap">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="SaborMap">
    <meta name="msapplication-TileColor" content="#070912">
    <meta name="msapplication-tap-highlight" content="no">
    <!-- [PWA] Manifest -->
    <!-- [v2.0.20] manifest1.json es el manifest dedicado del DASHBOARD.
         El manifest.json raíz queda reservado para index.html (la home pública),
         así cada página tiene su propio start_url, íconos y shortcuts. -->
    <link rel="manifest" href="manifest1.json">
    <link rel="icon" href="icon-192x192.png">
    <link rel="apple-touch-icon" href="icon-192x192.png">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
    <!-- [F-3.5] Font Awesome 6.5.0 con SRI integrity VÁLIDO (mismo hash que index.html) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha384-/o6I2CkkWC//PSjvWC/eYN7l3xM3tJm8ZzVkCOfp//W05QcE3mlGskpoHB6XqI+B" crossorigin="anonymous">
    <style>
        :root {
            /* Superficies: paleta más profunda con tintes coherentes */
            --bg:#070912;
            --surface:#0f1320;
            --surface-2:#141a2e;
            --card:#161b2e;
            --card-2:#1c2238;
            --card-hover:#222a45;
            --border:#262d45;
            --border-soft:#1d2238;

            /* Acentos con glow dedicado */
            --accent:#8b5cf6;
            --accent-2:#a78bfa;
            --accent-glow:rgba(139,92,246,0.35);
            --accent-soft:rgba(139,92,246,0.10);
            --secondary:#06b6d4;
            --secondary-2:#22d3ee;
            --secondary-glow:rgba(6,182,212,0.25);
            --secondary-soft:rgba(6,182,212,0.10);

            /* Texto */
            --cream:#f1f5f9;
            --muted:#9aa6c2;
            --muted-2:#6b7a99;

            /* Estado */
            --pink:#ec4899;
            --pink-glow:rgba(236,72,153,0.3);
            --amber:#f59e0b;
            --amber-glow:rgba(245,158,11,0.3);
            --green:#22c55e;
            --green-glow:rgba(34,197,94,0.3);
            --red:#ef4444;
            --red-glow:rgba(239,68,68,0.3);

            /* Admin */
            --admin:#f59e0b;
            --admin-glow:rgba(245,158,11,0.3);

            /* Tipografía */
            --font-sans:'Space Grotesk','Inter',-apple-system,BlinkMacSystemFont,sans-serif;
            --font-display:'Playfair Display',Georgia,serif;
            --shadow-card:0 1px 0 rgba(255,255,255,0.02) inset, 0 24px 60px -20px rgba(0,0,0,0.6);
            --shadow-hover:0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.15);
            --radius:16px;
            --radius-sm:12px;
            --radius-lg:22px;
        }
        *{margin:0;padding:0;box-sizing:border-box}
        body{
            font-family:var(--font-sans);
            background:
                radial-gradient(ellipse 1200px 800px at 20% -10%, rgba(139,92,246,0.06), transparent 60%),
                radial-gradient(ellipse 1000px 700px at 90% 110%, rgba(6,182,212,0.05), transparent 60%),
                var(--bg);
            color:var(--cream);
            overflow-x:hidden;
            -webkit-font-smoothing:antialiased;
            -moz-osx-font-smoothing:grayscale;
            letter-spacing:-0.005em;
        }
        .font-display{font-family:var(--font-display);letter-spacing:-0.015em}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:var(--border);border-radius:8px;border:2px solid transparent;background-clip:padding-box}
        ::-webkit-scrollbar-thumb:hover{background:var(--muted-2);background-clip:padding-box}

        .bg-blob{position:fixed;border-radius:50%;filter:blur(140px);opacity:0.28;pointer-events:none;z-index:0;animation:blobFloat 26s ease-in-out infinite alternate}
        .blob-1{width:560px;height:560px;background:var(--accent-glow);top:-12%;left:-8%}
        .blob-2{width:440px;height:440px;background:var(--secondary-glow);bottom:-5%;right:-8%;animation-delay:-10s}
        .blob-3{width:380px;height:380px;background:var(--pink-glow);top:45%;left:38%;animation-delay:-16s}
        @keyframes blobFloat{0%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-50px) scale(1.08)}100%{transform:translate(-30px,30px) scale(0.93)}}
        .noise-overlay{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px}

        /* AUTH */
        .auth-screen{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
        .auth-container{display:flex;width:100%;max-width:980px;min-height:600px;border-radius:28px;overflow:hidden;border:1px solid var(--border);box-shadow:0 50px 120px -30px rgba(0,0,0,0.85),0 0 80px rgba(139,92,246,0.18);position:relative;z-index:2}
        .auth-brand{flex:1;background:linear-gradient(155deg,#0d1124 0%,#1a1140 50%,#0a1a30 100%);display:flex;flex-direction:column;justify-content:center;padding:48px 44px;position:relative;overflow:hidden}
        .auth-brand::before{content:'';position:absolute;top:-80px;right:-80px;width:280px;height:280px;background:radial-gradient(circle,var(--accent-glow),transparent 70%);border-radius:50%;filter:blur(70px);pointer-events:none;animation:blobFloat 18s ease-in-out infinite alternate}
        .auth-brand::after{content:'';position:absolute;bottom:-60px;left:-60px;width:220px;height:220px;background:radial-gradient(circle,var(--secondary-glow),transparent 70%);border-radius:50%;filter:blur(70px);pointer-events:none;animation:blobFloat 22s ease-in-out infinite alternate-reverse;animation-delay:-6s}
        .auth-brand-content{position:relative;z-index:2}
        .auth-brand-logo{display:flex;align-items:center;gap:14px;margin-bottom:44px}
        .auth-brand-icon{width:54px;height:54px;background:linear-gradient(135deg,var(--accent),#6d28d9);border-radius:16px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.5rem;color:#fff;box-shadow:0 10px 30px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.15)}
        .auth-brand h2{font-family:'Playfair Display',serif;font-size:2.1rem;font-weight:700;line-height:1.18;margin-bottom:18px;letter-spacing:-0.018em}
        .auth-brand h2 span{background:linear-gradient(135deg,var(--accent-2),var(--secondary-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .auth-brand p{color:var(--muted);font-size:0.95rem;line-height:1.7;max-width:380px}
        .auth-brand-features{margin-top:40px;display:flex;flex-direction:column;gap:18px}
        .auth-feature{display:flex;align-items:center;gap:14px;opacity:0;animation:fadeUp 0.6s ease forwards}
        .auth-feature:nth-child(1){animation-delay:0.1s}
        .auth-feature:nth-child(2){animation-delay:0.2s}
        .auth-feature:nth-child(3){animation-delay:0.3s}
        .auth-feature:nth-child(4){animation-delay:0.4s}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .auth-feature-icon{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:0.95rem;flex-shrink:0;transition:transform 0.3s ease}
        .auth-feature:hover .auth-feature-icon{transform:translateY(-2px) scale(1.05)}
        .auth-feature span{font-size:0.88rem;color:var(--cream);opacity:0.88}
        .auth-form-side{flex:1;background:var(--surface);display:flex;flex-direction:column;justify-content:center;padding:48px 44px;position:relative}
        .auth-form-side h3{font-size:1.55rem;font-weight:700;margin-bottom:6px;letter-spacing:-0.015em}
        .auth-form-side .subtitle{color:var(--muted);font-size:0.9rem;margin-bottom:32px}
        .auth-form{display:flex;flex-direction:column}
        .auth-input-group{margin-bottom:20px;position:relative}
        .auth-input-group label{display:block;font-size:0.82rem;font-weight:600;color:var(--cream);margin-bottom:8px}
        .auth-input-group label .required{color:var(--pink)}
        .auth-input-wrap{position:relative}
        .auth-input-wrap i.field-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:0.85rem;pointer-events:none;transition:color 0.3s}
        .auth-input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:13px;padding:13px 16px 13px 42px;color:var(--cream);font-family:inherit;font-size:0.9rem;outline:none;transition:all 0.25s ease}
        .auth-input:hover{border-color:var(--border-soft);background:var(--card-2)}
        .auth-input:focus{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft);background:var(--card-2)}
        .auth-input:focus+i.field-icon,.auth-input:focus~i.field-icon{color:var(--accent)}
        .auth-input::placeholder{color:var(--muted-2)}
        .toggle-password{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.85rem;padding:4px;transition:color 0.2s}
        .toggle-password:hover{color:var(--cream)}
        .auth-error{font-size:0.76rem;color:var(--red);margin-top:6px;display:none;align-items:center;gap:5px}
        .auth-error.show{display:flex}
        .auth-forgot{text-align:right;margin-bottom:24px}
        .auth-forgot a{color:var(--accent);font-size:0.82rem;text-decoration:none;font-weight:500;transition:color 0.2s}
        .auth-forgot a:hover{color:var(--secondary);text-decoration:underline}
        .auth-submit{width:100%;padding:14px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:#fff;font-family:inherit;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.3s cubic-bezier(0.22,1,0.36,1);box-shadow:0 8px 28px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;gap:10px;position:relative;letter-spacing:-0.005em}
        .auth-submit:hover{transform:translateY(-2px);box-shadow:0 12px 38px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.2)}
        .auth-submit:active{transform:translateY(0)}
        .auth-submit.loading{pointer-events:none;opacity:0.85}
        .auth-submit .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:none}
        .auth-submit.loading .spinner{display:block}
        .auth-submit.loading .btn-text{display:none}
        @keyframes spin{to{transform:rotate(360deg)}}
        .auth-divider{display:flex;align-items:center;gap:14px;margin:24px 0}
        .auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent)}
        .auth-divider span{font-size:0.78rem;color:var(--muted);white-space:nowrap}
        .auth-switch{text-align:center;font-size:0.88rem;color:var(--muted)}
        .auth-switch a{color:var(--accent);font-weight:600;text-decoration:none;cursor:pointer;transition:color 0.2s}
        .auth-switch a:hover{color:var(--secondary)}
        .auth-message{padding:12px 16px;border-radius:12px;font-size:0.84rem;margin-bottom:20px;display:none;align-items:center;gap:10px;line-height:1.5;animation:fadeUp 0.3s ease}
        .auth-message.show{display:flex}
        .auth-message.error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);color:#f87171}
        .auth-message.success{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);color:#4ade80}
        .auth-form-inner{animation:authSlideIn 0.45s cubic-bezier(0.22,1,0.36,1)}
        @keyframes authSlideIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

        /* DASHBOARD */
        .dashboard-wrap{display:none}.dashboard-wrap.visible{display:block}
        .sidebar{position:fixed;left:0;top:0;bottom:0;width:264px;background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%);border-right:1px solid var(--border);z-index:50;display:flex;flex-direction:column;transition:transform 0.45s cubic-bezier(0.22,1,0.36,1)}
        .sidebar-logo{padding:24px 24px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)}
        .sidebar-logo-icon{width:40px;height:40px;background:linear-gradient(135deg,var(--accent),#6d28d9);border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.15rem;color:#fff;box-shadow:0 8px 24px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.18)}
        .sidebar-nav{flex:1;padding:18px 12px;overflow-y:auto;overflow-x:hidden}
        .sidebar-section-label{font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:var(--muted-2);padding:18px 14px 8px;opacity:0.8}
        .sidebar-link{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:11px;color:var(--muted);font-size:0.88rem;font-weight:500;cursor:pointer;transition:all 0.2s ease;text-decoration:none;position:relative;margin-bottom:2px}
        .sidebar-link:hover{color:var(--cream);background:rgba(139,92,246,0.06)}
        .sidebar-link.active{color:#fff;background:linear-gradient(90deg,rgba(139,92,246,0.18),rgba(139,92,246,0.06))}
        .sidebar-link.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:22px;background:linear-gradient(180deg,var(--accent),var(--accent-2));border-radius:0 3px 3px 0;box-shadow:0 0 12px var(--accent-glow)}
        .sidebar-link.admin-link.active::before{background:linear-gradient(180deg,var(--amber),#fbbf24);box-shadow:0 0 12px var(--amber-glow)}
        .sidebar-link.admin-link.active{background:linear-gradient(90deg,rgba(245,158,11,0.16),rgba(245,158,11,0.04));color:var(--amber)}
        .sidebar-link i{width:20px;text-align:center;font-size:0.92rem}
        .sidebar-link .link-badge{margin-left:auto;background:linear-gradient(135deg,var(--accent),#6d28d9);color:#fff;font-size:0.65rem;font-weight:700;padding:2px 9px;border-radius:100px;box-shadow:0 2px 8px var(--accent-glow)}
        .sidebar-user{padding:16px 20px;border-top:1px solid var(--border-soft);display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.15)}
        .sidebar-avatar{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--secondary),#0891b2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.92rem;color:#fff;flex-shrink:0;position:relative;box-shadow:0 4px 16px var(--secondary-glow),inset 0 1px 0 rgba(255,255,255,0.15)}
        .sidebar-avatar.admin-avatar{background:linear-gradient(135deg,var(--amber),#d97706);box-shadow:0 4px 16px var(--amber-glow),inset 0 1px 0 rgba(255,255,255,0.15)}
        .admin-crown{position:absolute;top:-7px;right:-7px;width:20px;height:20px;background:linear-gradient(135deg,var(--amber),#fbbf24);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:#000;box-shadow:0 2px 10px var(--amber-glow),inset 0 1px 0 rgba(255,255,255,0.4);animation:crownPulse 2.5s ease-in-out infinite}
        @keyframes crownPulse{0%,100%{box-shadow:0 2px 10px var(--amber-glow),inset 0 1px 0 rgba(255,255,255,0.4)}50%{box-shadow:0 2px 18px rgba(245,158,11,0.6),inset 0 1px 0 rgba(255,255,255,0.5)}}
        .sidebar-user-info{min-width:0;flex:1}
        .sidebar-user-name{font-size:0.86rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sidebar-user-role{font-size:0.72rem;color:var(--muted)}
        .sidebar-user-role.admin-role{color:var(--amber);font-weight:600}

        .main-content{margin-left:264px;min-height:100vh;position:relative;z-index:2}
        .top-bar{position:sticky;top:0;z-index:40;background:rgba(7,9,18,0.78);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--border-soft);padding:16px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .top-bar-title{font-size:1.18rem;font-weight:700;letter-spacing:-0.012em}
        .top-bar-actions{display:flex;align-items:center;gap:12px}
        .mobile-menu-btn{display:none;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px 12px;color:var(--cream);cursor:pointer;font-size:1rem}

        .btn-primary{padding:11px 22px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:#fff;font-family:inherit;font-size:0.88rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.3s cubic-bezier(0.22,1,0.36,1);box-shadow:0 6px 20px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.15)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 32px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.2)}
        .btn-primary:active{transform:translateY(0)}
        .btn-primary:disabled{opacity:0.6;pointer-events:none}
        .btn-secondary{padding:11px 22px;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--cream);font-family:inherit;font-size:0.88rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.25s ease}
        .btn-secondary:hover{border-color:var(--accent);background:var(--card-hover);box-shadow:0 0 0 4px var(--accent-soft)}
        .btn-danger{padding:10px 18px;border-radius:10px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.08);color:#f87171;font-family:inherit;font-size:0.82rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.25s ease}
        .btn-danger:hover{background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.5);box-shadow:0 0 0 4px rgba(239,68,68,0.1)}
        .btn-admin{padding:10px 18px;border-radius:10px;border:1px solid rgba(245,158,11,0.3);background:rgba(245,158,11,0.08);color:var(--amber);font-family:inherit;font-size:0.82rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.25s ease}
        .btn-admin:hover{background:rgba(245,158,11,0.15);border-color:rgba(245,158,11,0.5);box-shadow:0 0 0 4px rgba(245,158,11,0.1)}
        .btn-success{padding:10px 18px;border-radius:10px;border:1px solid rgba(34,197,94,0.3);background:rgba(34,197,94,0.08);color:var(--green);font-family:inherit;font-size:0.82rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.25s ease}
        .btn-success:hover{background:rgba(34,197,94,0.15);border-color:rgba(34,197,94,0.5);box-shadow:0 0 0 4px rgba(34,197,94,0.1)}
        .btn-sm{padding:8px 14px;font-size:0.8rem;border-radius:9px}
        .btn-icon{width:38px;height:38px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.25s ease;font-size:0.85rem}
        .btn-icon:hover{color:var(--cream);border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft)}

        .stat-card{background:linear-gradient(160deg,var(--card) 0%,var(--card-2) 100%);border:1px solid var(--border);border-radius:var(--radius);padding:24px;transition:all 0.4s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden;box-shadow:var(--shadow-card)}
        .stat-card:hover{border-color:rgba(139,92,246,0.35);transform:translateY(-4px);box-shadow:var(--shadow-hover)}
        .stat-card-glow{position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;filter:blur(45px);opacity:0.5;pointer-events:none}
        .stat-icon{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;margin-bottom:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.06)}
        .stat-value{font-size:2.1rem;font-weight:700;line-height:1;margin-bottom:4px;letter-spacing:-0.02em}
        .stat-label{color:var(--muted);font-size:0.82rem;font-weight:500}

        .form-group{margin-bottom:20px}
        .form-label{display:block;font-size:0.82rem;font-weight:600;color:var(--cream);margin-bottom:8px}
        .form-label .required{color:var(--pink);margin-left:2px}
        .form-hint{font-size:0.72rem;color:var(--muted);margin-top:6px}
        .form-input,.form-textarea,.form-select{width:100%;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--cream);font-family:inherit;font-size:0.88rem;outline:none;transition:all 0.25s ease}
        .form-input:hover,.form-textarea:hover,.form-select:hover{border-color:var(--border-soft);background:var(--card-2)}
        .form-input:focus,.form-textarea:focus,.form-select:focus{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft);background:var(--card-2)}
        .form-input::placeholder,.form-textarea::placeholder{color:var(--muted-2)}
        .form-textarea{resize:vertical;min-height:110px}
        .form-select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa6c2' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
        .form-select option{background:var(--surface);color:var(--cream)}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .form-error{font-size:0.72rem;color:var(--red);margin-top:5px;display:none}
        .form-group.error .form-input,.form-group.error .form-textarea,.form-group.error .form-select{border-color:var(--red);box-shadow:0 0 0 4px rgba(239,68,68,0.1)}
        .form-group.error .form-error{display:block}

        .tag-input-wrapper{display:flex;flex-wrap:wrap;gap:8px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:10px 14px;transition:all 0.25s ease;min-height:46px;align-items:center;cursor:text}
        .tag-input-wrapper:hover{border-color:var(--border-soft);background:var(--card-2)}
        .tag-input-wrapper:focus-within{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft);background:var(--card-2)}
        .tag-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:8px;font-size:0.78rem;font-weight:600;background:linear-gradient(135deg,rgba(139,92,246,0.18),rgba(139,92,246,0.08));color:var(--accent-2);border:1px solid rgba(139,92,246,0.25);animation:tagIn 0.25s ease}
        @keyframes tagIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        .tag-chip button{background:none;border:none;color:inherit;cursor:pointer;font-size:0.72rem;opacity:0.7;transition:opacity 0.2s;padding:0;display:inline-flex;align-items:center}
        .tag-chip button:hover{opacity:1}
        .tag-input-field{border:none;background:transparent;color:var(--cream);font-family:inherit;font-size:0.85rem;outline:none;flex:1;min-width:100px}
        .tag-input-field::placeholder{color:var(--muted-2)}

        .image-upload-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}
        .image-upload-slot{aspect-ratio:1;border:2px dashed var(--border);border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s ease;position:relative;overflow:hidden;background:var(--card)}
        .image-upload-slot:hover{border-color:var(--accent);background:var(--card-hover);box-shadow:0 0 0 4px var(--accent-soft)}
        .image-upload-slot i{font-size:1.4rem;color:var(--muted);margin-bottom:6px;transition:transform 0.3s}
        .image-upload-slot:hover i{transform:scale(1.1);color:var(--accent)}
        .image-upload-slot span{font-size:0.7rem;color:var(--muted)}
        .image-upload-slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease}
        .image-upload-slot:hover img{transform:scale(1.05)}
        .image-upload-slot .img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.7) 100%);display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transition:opacity 0.25s}
        .image-upload-slot:hover .img-overlay{opacity:1}
        .img-overlay button{width:34px;height:34px;border-radius:10px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.85rem;transition:all 0.2s}
        .img-overlay .img-delete{background:rgba(239,68,68,0.85);color:#fff}
        .img-overlay .img-delete:hover{background:var(--red);transform:scale(1.1)}
        .image-upload-slot.has-image{border-style:solid;border-color:var(--border)}

        /* Carta / Menu editor */
        .menu-category{background:var(--card-2);border:1px solid var(--border);border-radius:14px;padding:18px}
        .menu-category-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .menu-category-head input{flex:1;min-width:0}
        .menu-category-head .btn-icon{flex-shrink:0;width:34px;height:34px}
        .menu-items{display:flex;flex-direction:column;gap:10px}
        /* Cada plato = grid de 5 columnas en desktop: nombre | descripción | precio | moneda | borrar */
        .menu-item-row{
            display:grid;
            grid-template-columns:minmax(120px,1fr) minmax(180px,2fr) 90px 110px 50px 34px;
            gap:8px;align-items:center;
        }
        /* ★ v2.0.24: Toggle "Agotado" para platos del menú.
           Reusa la estructura visual de .delivery-toggle pero con color
           ámbar (warning) en vez de verde (success) para diferenciar. */
        .menu-soldout-toggle {
            position: relative;
            display: inline-block;
            width: 38px; height: 22px;
            flex-shrink: 0;
            vertical-align: middle;
            margin: 0 auto;
        }
        .menu-soldout-toggle input {
            position: absolute; opacity: 0;
            width: 100%; height: 100%;
            margin: 0; cursor: pointer;
        }
        .menu-soldout-toggle-slider {
            position: absolute; inset: 0;
            background: var(--border);
            border-radius: 22px;
            transition: background 0.25s ease;
            pointer-events: none;
        }
        .menu-soldout-toggle-slider::before {
            content: '';
            position: absolute;
            left: 3px; top: 3px;
            width: 16px; height: 16px;
            background: #fff;
            border-radius: 50%;
            transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .menu-soldout-toggle input:checked + .menu-soldout-toggle-slider {
            background: linear-gradient(135deg, var(--amber), #d97706);
        }
        .menu-soldout-toggle input:checked + .menu-soldout-toggle-slider::before {
            transform: translateX(16px);
        }
        .menu-soldout-toggle input:focus-visible + .menu-soldout-toggle-slider {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        .menu-soldout-toggle-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }
        .menu-soldout-label {
            font-size: 0.66rem;
            color: var(--muted-2);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .menu-soldout-label.on { color: var(--amber); }
        .menu-item-row input{padding:9px 12px;font-size:0.84rem}
        .menu-item-row select{padding:9px 12px;font-size:0.84rem}
        .menu-item-row .btn-icon{width:34px;height:34px;font-size:0.75rem}
        .menu-add-item-btn{margin-top:6px;background:transparent;border:1px dashed var(--border);color:var(--muted);padding:9px 12px;border-radius:9px;cursor:pointer;font-size:0.8rem;font-family:inherit;transition:all 0.25s;width:100%;text-align:center}
        .menu-add-item-btn:hover{border-color:var(--secondary);color:var(--secondary)}

        /* ★ v2.0.25: Barra de navegación pegajosa de categorías en el editor de carta.
           Aparece cuando hay 2+ categorías. Permite saltar a una categoría con
           un click y resalta la sección visible mientras haces scroll. */
        .menu-cat-nav {
            display: flex;
            gap: 6px;
            padding: 8px 10px;
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: 12px;
            margin-bottom: 16px;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: thin;
            scrollbar-color: var(--border) transparent;
            position: sticky;
            top: 8px;
            z-index: 10;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .menu-cat-nav::-webkit-scrollbar { height: 4px; }
        .menu-cat-nav::-webkit-scrollbar-track { background: transparent; }
        .menu-cat-nav::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
        }
        .menu-cat-nav::-webkit-scrollbar-thumb:hover { background: var(--muted-2); }
        .menu-cat-nav-empty {
            display: none;
        }

        /* ★ v2.0.30: Botones flotantes simples para subir y bajar.
           Sin detección de posición, sin lógica compleja.
           Dos botones fijos: uno baja al final, otro sube al principio. */
        .scroll-btn {
            position: fixed;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 14px;
            border: none;
            background: linear-gradient(135deg, var(--accent), #6d28d9);
            color: #fff;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            z-index: 35;
            box-shadow: 0 8px 28px var(--accent-glow);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .scroll-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 12px 38px var(--accent-glow);
        }
        .scroll-btn:active {
            transform: translateY(0) scale(1);
        }
        .scroll-btn.visible {
            display: flex;
        }
        /* Botón de bajar: esquina inferior derecha */
        .scroll-btn-down {
            bottom: 24px;
        }
        /* Botón de subir: arriba del de bajar */
        .scroll-btn-up {
            bottom: 82px;
            background: linear-gradient(135deg, var(--secondary), #0891b2);
            box-shadow: 0 8px 28px var(--secondary-glow);
        }
        .scroll-btn-up:hover {
            box-shadow: 0 12px 38px var(--secondary-glow);
        }
        /* ★ v2.0.33 FIX MOBILE: los botones flotantes eran demasiado
           grandes (48x48) y pegados al borde (right:24px) en celulares.
           En pantallas <=768px los hacemos 44x44 con right:16px y
           bottom ajustado. En <=480px (celulares pequenos) los
           reducimos a 40x40. */
        @media (max-width: 768px) {
            .scroll-btn {
                right: 16px;
                width: 44px;
                height: 44px;
                border-radius: 12px;
                font-size: 1rem;
            }
            .scroll-btn-down { bottom: 16px; }
            .scroll-btn-up   { bottom: 68px; }
            .scroll-btn:hover {
                transform: translateY(-2px) scale(1.04);
            }
        }
        @media (max-width: 480px) {
            .scroll-btn {
                width: 40px;
                height: 40px;
                font-size: 0.9rem;
                box-shadow: 0 6px 20px var(--accent-glow);
            }
            .scroll-btn-down { bottom: 14px; }
            .scroll-btn-up   { bottom: 62px; }
            /* En mobile no agrandar tanto en hover (dedo gordo) */
            .scroll-btn:hover {
                transform: translateY(-2px) scale(1.02);
            }
        }
        .menu-cat-chip {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            /* ★ v2.0.26: colores provienen de CSS variables seteadas
               inline desde getMenuCatColorVars(ci). Defaults al esquema
               anterior si las variables no están definidas. */
            background: var(--chip-bg, var(--card));
            border: 1px solid var(--chip-border, var(--border));
            border-radius: 100px;
            color: var(--chip-color, var(--muted));
            font-size: 0.78rem;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .menu-cat-chip:hover {
            border-color: var(--chip-color, var(--accent));
            color: var(--cream);
            background: var(--chip-bg-hover, var(--card-hover));
            transform: translateY(-1px);
        }
        .menu-cat-chip.active {
            /* ★ v2.0.26: el estado activo usa el color de la categoría
               con un glow sutil del mismo tono. */
            background: var(--chip-bg-active, linear-gradient(135deg, rgba(139,92,246,0.18), rgba(139,92,246,0.08)));
            border-color: var(--chip-color, var(--accent));
            color: var(--cream);
            box-shadow: 0 0 0 3px var(--chip-glow, rgba(139,92,246,0.1));
        }
        .menu-cat-chip-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            background: var(--chip-count-bg, rgba(255,255,255,0.08));
            border-radius: 9px;
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--chip-count-color, var(--muted));
            transition: all 0.2s ease;
        }
        .menu-cat-chip.active .menu-cat-chip-count {
            background: var(--chip-color, var(--accent));
            color: #fff;
        }
        .menu-cat-chip-empty {
            opacity: 0.6;
            font-style: italic;
        }
        /* ★ v2.0.26: cada categoría tiene un acento de color en el
           borde izquierdo para que sea fácil ver cuál chip corresponde
           a cuál categoría mientras haces scroll. */
        .menu-category {
            scroll-margin-top: 70px;
            border-left: 3px solid var(--cat-color, var(--border));
            position: relative;
        }
        .menu-category::before {
            content: '';
            position: absolute;
            left: -3px;
            top: 0;
            bottom: 0;
            width: 3px;
            background: var(--cat-color, transparent);
            border-radius: 14px 0 0 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        .menu-category.is-visible::before {
            opacity: 1;
            box-shadow: 0 0 12px var(--cat-glow, transparent);
        }
        .menu-category-head h3,
        .menu-category-head input {
            /* No cambiamos el color del input, solo el borde del card. */
        }

        /* ★ FIX MOBILE [v2.0.19]: layout legible para carta/menú en celular.
           En pantallas <720px apilamos los campos con labels visibles y
           precios/moneda en una fila. Antes los campos se comprimían a
           una columna invisible de ~30px y el select se rompía. */
        @media(max-width:720px){
            .menu-category{padding:14px}
            .menu-category-head{gap:8px;margin-bottom:10px}
            .menu-item-row{
                grid-template-columns:1fr 1fr;
                grid-template-areas:
                    "name       name"
                    "desc       desc"
                    "price      currency"
                    "soldout    delete";
                gap:8px 8px;
                background:var(--card);
                border:1px solid var(--border-soft);
                border-radius:12px;
                padding:12px;
            }
            .menu-item-row > .menu-soldout-toggle-cell {
                grid-area: soldout;
                flex-direction: row;
                justify-content: flex-start;
                gap: 10px;
                padding: 6px 4px;
            }
            .menu-item-row > .btn-icon:nth-child(6) {
                grid-area: delete;
            }
            .menu-item-row > input:nth-child(1){grid-area:name}      /* nombre plato  */
            .menu-item-row > input:nth-child(2){grid-area:desc}      /* descripción   */
            .menu-item-row > input:nth-child(3){grid-area:price}     /* precio        */
            .menu-item-row > select:nth-child(4){grid-area:currency} /* moneda        */
            .menu-item-row > .btn-icon:nth-child(5){                 /* borrar        */
                grid-area:delete;
                width:100%;height:34px;
                border-radius:9px;
                background:rgba(239,68,68,0.08);
                border-color:rgba(239,68,68,0.25);
                color:#f87171;
            }
            .menu-item-row > .btn-icon:nth-child(5):hover{
                background:rgba(239,68,68,0.18);
            }
            .menu-item-row input,
            .menu-item-row select{font-size:0.86rem;padding:10px 12px}
            .menu-add-item-btn{padding:11px 12px;font-size:0.84rem}
        }
        /* Móvil muy pequeño: moneda bajo precio en vez de al lado */
        @media(max-width:380px){
            .menu-item-row{
                grid-template-columns:1fr;
                grid-template-areas:
                    "name"
                    "desc"
                    "price"
                    "currency"
                    "soldout"
                    "delete";
            }
            .menu-item-row > .menu-soldout-toggle-cell {
                justify-content: center;
                padding: 8px 4px;
                background: rgba(245,158,11,0.04);
                border: 1px dashed rgba(245,158,11,0.2);
                border-radius: 9px;
            }
        }

        /* Delivery / Links editor */
        .link-row{display:grid;grid-template-columns:160px 1fr 34px;gap:8px;align-items:center}
        .link-row input{padding:9px 12px;font-size:0.84rem}
        .link-row .btn-icon{width:34px;height:34px;font-size:0.75rem}
        .link-row select{padding:9px 12px;font-size:0.84rem}
        @media(max-width:640px){
            .link-row{
                grid-template-columns:1fr 34px;
                grid-template-areas:
                    "platform delete"
                    "url       url";
                gap:8px;
                background:var(--card);
                border:1px solid var(--border-soft);
                border-radius:12px;
                padding:12px;
            }
            .link-row select:nth-child(1){grid-area:platform}
            .link-row input:nth-child(2){grid-area:url}
            .link-row .btn-icon:nth-child(3){grid-area:delete}
        }

        .my-place-card{background:linear-gradient(160deg,var(--card) 0%,var(--card-2) 100%);border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:all 0.4s cubic-bezier(0.22,1,0.36,1);box-shadow:var(--shadow-card)}
        .my-place-card:hover{border-color:rgba(139,92,246,0.35);box-shadow:var(--shadow-hover);transform:translateY(-4px)}
        .my-place-card-img{width:100%;aspect-ratio:16/9;object-fit:cover;transition:transform 0.5s ease}
        .my-place-card:hover .my-place-card-img{transform:scale(1.04)}
        .my-place-card-body{padding:20px}
        .status-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:0.72rem;font-weight:600;backdrop-filter:blur(8px)}
        .status-published{background:rgba(34,197,94,0.12);color:var(--green);border:1px solid rgba(34,197,94,0.25)}
        .status-draft{background:rgba(245,158,11,0.12);color:var(--amber);border:1px solid rgba(245,158,11,0.25)}
        .status-pending{background:rgba(139,92,246,0.12);color:var(--accent-2);border:1px solid rgba(139,92,246,0.25)}
        .cat-indicator{width:8px;height:8px;border-radius:50%;display:inline-block}
        .cat-indicator.bar{background:var(--accent);box-shadow:0 0 10px var(--accent-glow)}
        .cat-indicator.restaurante{background:var(--secondary);box-shadow:0 0 10px var(--secondary-glow)}
        .cat-indicator.heladeria{background:var(--pink);box-shadow:0 0 10px var(--pink-glow)}

        .plan-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em}
        .plan-free{background:rgba(148,163,184,0.1);color:var(--muted);border:1px solid rgba(148,163,184,0.2)}
        .plan-basic{background:rgba(6,182,212,0.12);color:var(--secondary-2);border:1px solid rgba(6,182,212,0.25)}
        .plan-pro{background:rgba(139,92,246,0.12);color:var(--accent-2);border:1px solid rgba(139,92,246,0.25)}
        .plan-enterprise{background:rgba(245,158,11,0.12);color:var(--amber);border:1px solid rgba(245,158,11,0.25)}

        .toast{position:fixed;bottom:30px;right:32px;background:linear-gradient(135deg,var(--card) 0%,var(--card-2) 100%);border:1px solid var(--accent);color:var(--cream);padding:14px 22px;border-radius:14px;font-size:0.88rem;z-index:300;transform:translateY(120px);opacity:0;transition:all 0.45s cubic-bezier(0.22,1,0.36,1);box-shadow:0 14px 50px rgba(0,0,0,0.6),0 0 24px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,0.04);display:flex;align-items:center;gap:10px;max-width:420px}
        .toast.show{transform:translateY(0);opacity:1}
        .toast.toast-error{border-color:var(--red);box-shadow:0 14px 50px rgba(0,0,0,0.6),0 0 24px var(--red-glow),inset 0 1px 0 rgba(255,255,255,0.04)}

        .modal-overlay{position:fixed;inset:0;background:rgba(5,7,15,0.85);backdrop-filter:blur(12px);z-index:100;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.3s ease;padding:20px}
        .modal-overlay.open{opacity:1;pointer-events:all}
        .modal-box{background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%);border:1px solid var(--border);border-radius:22px;max-width:520px;width:100%;padding:32px;transform:scale(0.96) translateY(8px);transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px -20px rgba(0,0,0,0.7),0 0 60px var(--accent-glow)}
        .modal-overlay.open .modal-box{transform:scale(1) translateY(0)}

        .panel{display:none}.panel.active{display:block;animation:panelIn 0.45s cubic-bezier(0.22,1,0.36,1)}
        @keyframes panelIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .animated-line{height:1px;background:linear-gradient(90deg,transparent,var(--accent),var(--secondary),transparent);animation:lineShimmer 5s ease-in-out infinite}
        @keyframes lineShimmer{0%,100%{opacity:0.3;transform:scaleX(0.85)}50%{opacity:1;transform:scaleX(1)}}

        .empty-state{text-align:center;padding:60px 20px;animation:fadeUp 0.4s ease}
        .empty-state i{font-size:3rem;background:linear-gradient(135deg,var(--muted-2),var(--muted));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px;display:block}
        .empty-state h3{font-size:1.2rem;margin-bottom:8px;font-weight:600}
        .empty-state p{color:var(--muted);font-size:0.9rem;margin-bottom:24px}

        .notif-dot{width:8px;height:8px;border-radius:50%;background:var(--red);position:absolute;top:6px;right:6px;border:2px solid var(--surface);animation:dotPulse 1.5s ease-in-out infinite}
        @keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
        .pw-strength{display:flex;gap:4px;margin-top:8px}
        .pw-strength-bar{flex:1;height:4px;border-radius:2px;background:var(--border);transition:background 0.3s}
        .pw-strength-bar.weak{background:var(--red)}.pw-strength-bar.medium{background:var(--amber)}.pw-strength-bar.strong{background:var(--green)}
        .pw-strength-text{font-size:0.72rem;margin-top:6px;color:var(--muted);transition:color 0.3s}

        /* Admin table */
        .admin-table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:16px;background:linear-gradient(160deg,var(--card) 0%,var(--card-2) 100%);box-shadow:var(--shadow-card)}
        .admin-table{width:100%;border-collapse:collapse;font-size:0.85rem}
        .admin-table thead{background:rgba(0,0,0,0.2);border-bottom:1px solid var(--border)}
        .admin-table th{padding:14px 16px;text-align:left;font-weight:600;font-size:0.74rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);white-space:nowrap}
        .admin-table td{padding:14px 16px;border-bottom:1px solid var(--border-soft);vertical-align:middle}
        .admin-table tr:last-child td{border-bottom:none}
        .admin-table tr{transition:background 0.2s}
        .admin-table tr:hover td{background:rgba(139,92,246,0.04)}
        .admin-table .user-cell{display:flex;align-items:center;gap:12px}
        .admin-table .user-mini-avatar{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--accent),#6d28d9);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:#fff;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,0.15)}
        .admin-table .user-mini-name{font-weight:600;font-size:0.88rem}
        .admin-table .user-mini-email{font-size:0.75rem;color:var(--muted)}
        .admin-table .actions-cell{display:flex;gap:6px;flex-wrap:nowrap}

        .admin-filter-bar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:24px}
        .admin-search-wrap{position:relative}
        .admin-search-wrap i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:0.85rem;pointer-events:none}
        .admin-search{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 16px 11px 40px;color:var(--cream);font-family:inherit;font-size:0.85rem;outline:none;width:280px;transition:all 0.25s}
        .admin-search:hover{border-color:var(--border-soft);background:var(--card-2)}
        .admin-search:focus{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft)}
        .admin-filter-select{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 36px 11px 14px;color:var(--cream);font-family:inherit;font-size:0.85rem;outline:none;appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa6c2' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;transition:all 0.25s}
        .admin-filter-select:hover{border-color:var(--border-soft);background-color:var(--card-2)}
        .admin-filter-select:focus{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft)}
        .admin-filter-select option{background:var(--surface);color:var(--cream)}

        .admin-section-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px}
        .admin-section-header h2{font-size:1.55rem;font-weight:700;letter-spacing:-0.015em}
        .admin-section-header p{color:var(--muted);font-size:0.88rem;margin-top:4px}

        .admin-quick-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:28px}
        .admin-quick-stat{background:linear-gradient(160deg,var(--card) 0%,var(--card-2) 100%);border:1px solid var(--border);border-radius:14px;padding:18px;display:flex;align-items:center;gap:14px;transition:all 0.3s;box-shadow:var(--shadow-card)}
        .admin-quick-stat:hover{border-color:rgba(139,92,246,0.3);transform:translateY(-3px);box-shadow:var(--shadow-hover)}
        .admin-quick-stat-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,0.06)}
        .admin-quick-stat-value{font-size:1.5rem;font-weight:700;line-height:1;letter-spacing:-0.015em}
        .admin-quick-stat-label{font-size:0.75rem;color:var(--muted);margin-top:3px}

        .role-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em}
        .role-admin{background:rgba(245,158,11,0.12);color:var(--amber);border:1px solid rgba(245,158,11,0.25)}
        .role-owner{background:rgba(139,92,246,0.1);color:var(--accent-2);border:1px solid rgba(139,92,246,0.2)}

        /* ═══════════════════════════════════════════════════
           [v2.0.13] TOGGLE SWITCH para "Delivery habilitado"
           Switch accesible (role=switch, aria-checked) que el admin
           usa en la tabla de Todos los Locales para activar/desactivar
           los botones de delivery/reserva de cada local en la home.
           ═══════════════════════════════════════════════════ */
        .delivery-toggle {
            position: relative;
            display: inline-block;
            width: 38px; height: 22px;
            flex-shrink: 0;
            vertical-align: middle;
        }
        .delivery-toggle input {
            position: absolute; opacity: 0;
            width: 100%; height: 100%;
            margin: 0; cursor: pointer;
        }
        .delivery-toggle-slider {
            position: absolute; inset: 0;
            background: var(--border);
            border-radius: 22px;
            transition: background 0.25s ease;
            pointer-events: none;
        }
        .delivery-toggle-slider::before {
            content: '';
            position: absolute;
            left: 3px; top: 3px;
            width: 16px; height: 16px;
            background: #fff;
            border-radius: 50%;
            transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .delivery-toggle input:checked + .delivery-toggle-slider {
            background: linear-gradient(135deg, var(--green), #16a34a);
        }
        .delivery-toggle input:checked + .delivery-toggle-slider::before {
            transform: translateX(16px);
        }
        .delivery-toggle input:focus-visible + .delivery-toggle-slider {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        .delivery-toggle.loading { opacity: 0.5; pointer-events: none; }
        .delivery-status-text {
            font-size: 0.7rem;
            color: var(--muted);
            margin-top: 2px;
            font-weight: 500;
        }
        .delivery-status-text.on { color: var(--green); }
        .delivery-toggle-cell {
            display: flex; flex-direction: column; align-items: flex-start;
            gap: 2px;
        }

        @media(max-width:1024px){
            .sidebar{transform:translateX(-100%)}
            .sidebar.open{transform:translateX(0);box-shadow:30px 0 80px rgba(0,0,0,0.6)}
            .main-content{margin-left:0}
            .mobile-menu-btn{display:flex}
            .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);z-index:45;opacity:0;transition:opacity 0.3s}
            .sidebar-overlay.show{display:block;opacity:1}
        }
        @media(max-width:768px){
            .auth-container{flex-direction:column;max-width:480px;min-height:auto}
            .auth-brand{padding:32px 28px}
            .auth-brand-features{display:none}
            .auth-form-side{padding:32px 28px}
            .stats-grid{grid-template-columns:repeat(2,1fr)!important}
            .admin-table{font-size:0.78rem}
            .admin-table th,.admin-table td{padding:10px 12px}
            .admin-filter-bar{flex-direction:column;align-items:stretch}
            .admin-search{width:100%}
            .admin-filter-select{width:100%}
            .top-bar{padding:14px 18px}
            .content-area{padding:24px 18px!important}
        }
        @media(max-width:640px){
            .form-row{grid-template-columns:1fr}
            .top-bar{padding:12px 16px}
            .content-area{padding:20px 16px!important}
            .stats-grid{grid-template-columns:1fr!important}
            .admin-quick-stats{grid-template-columns:1fr}
            .toast{right:16px;left:16px;max-width:none}
            .modal-box{padding:24px 20px}
        }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}

        /* ═══════════════════════════════════════════════════
           [T-THEME] TEMA CLARO — inversión completa de la paleta dark
           Se aplica con data-theme="light" en <html>. Las variables CSS
           se sobrescriben aquí para que todo el dashboard herede.
           ═══════════════════════════════════════════════════ */
        [data-theme="light"] {
            --bg:#f8fafc;
            --surface:#ffffff;
            --surface-2:#f1f5f9;
            --card:#ffffff;
            --card-2:#f8fafc;
            --card-hover:#f1f5f9;
            --border:#e2e8f0;
            --border-soft:#eef2f6;

            --accent:#7c3aed;
            --accent-2:#a78bfa;
            --accent-glow:rgba(124,58,237,0.18);
            --accent-soft:rgba(124,58,237,0.08);
            --secondary:#0891b2;
            --secondary-2:#06b6d4;
            --secondary-glow:rgba(8,145,178,0.18);
            --secondary-soft:rgba(8,145,178,0.08);

            --cream:#1e293b;
            --muted:#64748b;
            --muted-2:#94a3b8;

            --pink:#db2777;
            --pink-glow:rgba(219,39,119,0.18);
            --amber:#d97706;
            --amber-glow:rgba(217,119,6,0.18);
            --green:#059669;
            --green-glow:rgba(5,150,105,0.18);
            --red:#dc2626;
            --red-glow:rgba(220,38,38,0.18);

            --admin:#d97706;
            --admin-glow:rgba(217,119,6,0.18);

            --shadow-card:0 1px 0 rgba(0,0,0,0.02) inset, 0 12px 30px -10px rgba(15,23,42,0.08);
            --shadow-hover:0 18px 40px -12px rgba(15,23,42,0.12), 0 0 0 1px rgba(124,58,237,0.12);
        }
        [data-theme="light"] body {
            background:
                radial-gradient(ellipse 1200px 800px at 20% -10%, rgba(124,58,237,0.04), transparent 60%),
                radial-gradient(ellipse 1000px 700px at 90% 110%, rgba(8,145,178,0.03), transparent 60%),
                var(--bg);
        }
        [data-theme="light"] .bg-blob { opacity: 0.4; }
        [data-theme="light"] .noise-overlay { opacity: 0.015; }
        [data-theme="light"] .auth-container {
            box-shadow: 0 30px 80px -20px rgba(15,23,42,0.18), 0 0 60px rgba(124,58,237,0.12);
        }
        [data-theme="light"] .top-bar {
            background: rgba(248,250,252,0.78);
            backdrop-filter: blur(24px) saturate(180%);
        }
        [data-theme="light"] .modal-overlay { background: rgba(100,116,139,0.45); }
        [data-theme="light"] .modal-box { box-shadow: 0 30px 80px -20px rgba(15,23,42,0.25), 0 0 60px rgba(124,58,237,0.12); }
        [data-theme="light"] .toast { box-shadow: 0 14px 50px rgba(15,23,42,0.15), 0 0 24px var(--accent-glow); }
        [data-theme="light"] .admin-table thead { background: rgba(15,23,42,0.04); }
        [data-theme="light"] .sidebar { box-shadow: 1px 0 0 var(--border); }
        [data-theme="light"] ::-webkit-scrollbar-track { background: transparent; }
        [data-theme="light"] ::-webkit-scrollbar-thumb { background: var(--muted-2); }
        [data-theme="light"] ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

        /* ═══════════════════════════════════════════════════
           [FIX-ICONS] Defensa anti-conflicto con cualquier framework CSS
           (Tailwind, Bootstrap, etc.) que pueda overridear FA6.
           Fuerza font-family y font-weight con !important para que
           los iconos siempre se rendericen.
           ═══════════════════════════════════════════════════ */
        .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands {
            font-family: "Font Awesome 6 Free" !important;
            font-weight: 900 !important;
            -moz-osx-font-smoothing: grayscale !important;
            -webkit-font-smoothing: antialiased !important;
            display: inline-block !important;
            font-style: normal !important;
            font-variant: normal !important;
            line-height: 1 !important;
            text-rendering: auto !important;
        }
        .fab, .fa-brands { font-family: "Font Awesome 6 Brands" !important; }
        .far, .fa-regular { font-family: "Font Awesome 6 Free" !important; font-weight: 400 !important; }

        /* [T-THEME] Botón toggle de tema */
        .theme-toggle {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--card);
            color: var(--cream);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }
        .theme-toggle:hover {
            border-color: var(--accent);
            background: var(--card-hover);
            box-shadow: 0 0 0 4px var(--accent-soft);
            transform: translateY(-1px);
        }
        .theme-toggle:active { transform: translateY(0); }
        .theme-toggle .icon-sun,
        .theme-toggle .icon-moon {
            position: absolute;
            transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        [data-theme="dark"] .theme-toggle .icon-moon { opacity: 1; transform: rotate(0deg) scale(1); }
        [data-theme="dark"] .theme-toggle .icon-sun  { opacity: 0; transform: rotate(180deg) scale(0.5); }
        [data-theme="light"] .theme-toggle .icon-moon { opacity: 0; transform: rotate(-180deg) scale(0.5); }
        [data-theme="light"] .theme-toggle .icon-sun  { opacity: 1; transform: rotate(0deg) scale(1); }
    </style>
</head>
<!-- [T-THEME] Prevenir flash de tema incorrecto: aplicar tema antes del primer render -->
<script>
    (function() {
        try {
            var saved = localStorage.getItem('sabormap-dashboard-theme');
            if (saved === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else if (saved === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        } catch (e) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    })();
</script>
<body>
    <!-- [F-2.3] Skip link accesible: visible solo al recibir foco de teclado -->
    <a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:0;background:var(--accent);color:#fff;padding:12px 20px;border-radius:0 0 8px 0;z-index:9999;font-weight:600;text-decoration:none" onfocus="this.style.left='0'" onblur="this.style.left='-9999px'">Saltar al contenido principal</a>
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
    <div class="noise-overlay"></div>

    <!-- ====== AUTH SCREEN ====== -->
    <div class="auth-screen" id="authScreen">
        <!-- [T-THEME] Toggle de tema en login (esquina superior derecha) -->
        <button class="theme-toggle" aria-label="Cambiar tema claro/oscuro" title="Cambiar tema" onclick="toggleDashboardTheme()" style="position:absolute;top:20px;right:20px;z-index:300;background:var(--card);border:1px solid var(--border)">
            <i aria-hidden="true" class="fas fa-moon icon-moon"></i>
            <i aria-hidden="true" class="fas fa-sun icon-sun"></i>
        </button>
        <div class="auth-container">
            <div class="auth-brand">
                <div class="auth-brand-content">
                    <div class="auth-brand-logo">
                        <div class="auth-brand-icon">S</div>
                        <div>
                            <div style="font-weight:700;font-size:1.2rem">SaborMap</div>
                            <div style="font-size:0.72rem;color:var(--muted);font-weight:500">La Habana — Panel de Locales</div>
                        </div>
                    </div>
                    <h2>Gestiona tus <span>locales</span> desde un solo lugar</h2>
                    <p>Publica, edita y hazle seguimiento a tus restaurantes, bares y heladerias en La Habana.</p>
                    <div class="auth-brand-features">
                        <div class="auth-feature">
                            <div class="auth-feature-icon" style="background:rgba(139,92,246,0.12);color:var(--accent);border:1px solid rgba(139,92,246,0.2)"><i aria-hidden="true" class="fas fa-chart-line"></i></div>
                            <span>Estadísticas en tiempo real</span>
                        </div>
                        <div class="auth-feature">
                            <div class="auth-feature-icon" style="background:rgba(6,182,212,0.12);color:var(--secondary);border:1px solid rgba(6,182,212,0.2)"><i aria-hidden="true" class="fas fa-book-open"></i></div>
                            <span>Cartas y menús editables</span>
                        </div>
                        <div class="auth-feature">
                            <div class="auth-feature-icon" style="background:rgba(245,158,11,0.12);color:var(--amber);border:1px solid rgba(245,158,11,0.2)"><i aria-hidden="true" class="fas fa-crown"></i></div>
                            <span>Planes de suscripción</span>
                        </div>
                        <div class="auth-feature">
                            <div class="auth-feature-icon" style="background:rgba(34,197,94,0.12);color:var(--green);border:1px solid rgba(34,197,94,0.2)"><i aria-hidden="true" class="fas fa-images"></i></div>
                            <span>Galería de fotos con storage</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="auth-form-side">
                <div id="loginView" class="auth-form-inner">
                    <h3>Iniciar Sesión</h3>
                    <p class="subtitle">Accede al panel de gestion de tus locales</p>
                    <div class="auth-message" id="loginMessage"><i aria-hidden="true" class="fas fa-info-circle"></i><span></span></div>
                    <form class="auth-form" id="loginForm" onsubmit="handleLogin(event)">
                        <div class="auth-input-group">
                            <label>Email <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="email" class="auth-input" id="loginEmail" placeholder="tu@email.com" required autocomplete="email">
                                <i aria-hidden="true" class="fas fa-envelope field-icon"></i>
                            </div>
                        </div>
                        <div class="auth-input-group">
                            <label>Contraseña <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="password" class="auth-input" id="loginPassword" placeholder="Tu contraseña" required autocomplete="current-password">
                                <i aria-hidden="true" class="fas fa-lock field-icon"></i>
                                <button type="button" class="toggle-password" onclick="togglePw('loginPassword',this)"><i aria-hidden="true" class="fas fa-eye"></i></button>
                            </div>
                        </div>
                        <div class="auth-forgot"><a href="#" onclick="handleForgotPassword(event)">Olvidé mi contraseña</a></div>
                        <button type="submit" class="auth-submit" id="loginBtn">
                            <span class="btn-text">Ingresar</span>
                            <div class="spinner"></div>
                        </button>
                    </form>
                    <div class="auth-divider"><span>o</span></div>
                    <p class="auth-switch">No tienes cuenta? <a role="button" tabindex="0" onclick="showView('signup')">Crear cuenta</a></p>
                </div>

                <div id="signupView" class="auth-form-inner" style="display:none">
                    <h3>Crear Cuenta</h3>
                    <p class="subtitle">Registra tu local en SaborMap — La Habana</p>
                    <div class="auth-message" id="signupMessage"><i aria-hidden="true" class="fas fa-info-circle"></i><span></span></div>
                    <form class="auth-form" id="signupForm" onsubmit="handleSignup(event)">
                        <div class="auth-input-group">
                            <label>Nombre completo <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="text" class="auth-input" id="signupName" placeholder="Ej: Maria Campos" required autocomplete="name">
                                <i aria-hidden="true" class="fas fa-user field-icon"></i>
                            </div>
                        </div>
                        <div class="auth-input-group">
                            <label>Email <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="email" class="auth-input" id="signupEmail" placeholder="tu@email.com" required autocomplete="email">
                                <i aria-hidden="true" class="fas fa-envelope field-icon"></i>
                            </div>
                        </div>
                        <div class="auth-input-group">
                            <label>Contraseña <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="password" class="auth-input" id="signupPassword" placeholder="Mínimo 6 caracteres" required autocomplete="new-password" oninput="checkPwStrength(this.value)">
                                <i aria-hidden="true" class="fas fa-lock field-icon"></i>
                                <button type="button" class="toggle-password" onclick="togglePw('signupPassword',this)"><i aria-hidden="true" class="fas fa-eye"></i></button>
                            </div>
                            <div class="pw-strength" id="pwStrength">
                                <div class="pw-strength-bar" id="pwBar1"></div>
                                <div class="pw-strength-bar" id="pwBar2"></div>
                                <div class="pw-strength-bar" id="pwBar3"></div>
                                <div class="pw-strength-bar" id="pwBar4"></div>
                            </div>
                            <div class="pw-strength-text" id="pwStrengthText"></div>
                        </div>
                        <div class="auth-input-group">
                            <label>Confirmar contraseña <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="password" class="auth-input" id="signupConfirm" placeholder="Repite tu contraseña" required autocomplete="new-password">
                                <i aria-hidden="true" class="fas fa-lock field-icon"></i>
                                <button type="button" class="toggle-password" onclick="togglePw('signupConfirm',this)"><i aria-hidden="true" class="fas fa-eye"></i></button>
                            </div>
                        </div>
                        <button type="submit" class="auth-submit" id="signupBtn" style="margin-top:8px">
                            <span class="btn-text">Crear Cuenta</span>
                            <div class="spinner"></div>
                        </button>
                    </form>
                    <div class="auth-divider"><span>o</span></div>
                    <p class="auth-switch">Ya tienes cuenta? <a role="button" tabindex="0" onclick="showView('login')">Iniciar sesión</a></p>
                </div>

                <div id="forgotView" class="auth-form-inner" style="display:none">
                    <h3>Recuperar Contraseña</h3>
                    <p class="subtitle">Te enviamos un link para resetear tu contraseña</p>
                    <div class="auth-message" id="forgotMessage"><i aria-hidden="true" class="fas fa-info-circle"></i><span></span></div>
                    <form class="auth-form" id="forgotForm" onsubmit="handleForgotSubmit(event)">
                        <div class="auth-input-group">
                            <label>Email <span class="required">*</span></label>
                            <div class="auth-input-wrap">
                                <input type="email" class="auth-input" id="forgotEmail" placeholder="tu@email.com" required autocomplete="email">
                                <i aria-hidden="true" class="fas fa-envelope field-icon"></i>
                            </div>
                        </div>
                        <button type="submit" class="auth-submit" id="forgotBtn">
                            <span class="btn-text">Enviar Link</span>
                            <div class="spinner"></div>
                        </button>
                    </form>
                    <div class="auth-divider"><span>o</span></div>
                    <p class="auth-switch"><a role="button" tabindex="0" onclick="showView('login')"><i aria-hidden="true" class="fas fa-arrow-left" style="margin-right:6px"></i>Volver a iniciar sesión</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- ====== DASHBOARD ====== -->
    <div class="dashboard-wrap" id="dashboardWrap">
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>
        <aside class="sidebar" id="sidebar" aria-label="Navegación principal">
            <div class="sidebar-logo">
                <div class="sidebar-logo-icon">S</div>
                <div>
                    <div style="font-weight:700;font-size:1.05rem">SaborMap</div>
                    <div style="font-size:0.68rem;color:var(--muted);font-weight:500">La Habana — Panel</div>
                </div>
            </div>
            <nav class="sidebar-nav" id="sidebarNav" aria-label="Secciones del panel">
                <div class="sidebar-section-label">Principal</div>
                <a role="button" tabindex="0" class="sidebar-link active" data-panel="overview" onclick="switchPanel('overview',this)">
                    <i aria-hidden="true" class="fas fa-chart-pie"></i> Resumen
                </a>
                <a role="button" tabindex="0" class="sidebar-link" data-panel="my-places" onclick="switchPanel('my-places',this)">
                    <i aria-hidden="true" class="fas fa-store"></i> Mis Locales
                    <span class="link-badge" id="placesCount">0</span>
                </a>
                <a role="button" tabindex="0" class="sidebar-link" data-panel="add-place" onclick="startNewPlace()">
                    <i aria-hidden="true" class="fas fa-plus-circle"></i> Agregar Local
                </a>

                <div class="sidebar-section-label admin-section" style="display:none">
                    <i aria-hidden="true" class="fas fa-crown" style="color:var(--amber);margin-right:4px"></i> Administración
                </div>
                <a role="button" tabindex="0" class="sidebar-link admin-link admin-section" data-panel="admin-places" onclick="switchPanel('admin-places',this)" style="display:none">
                    <i aria-hidden="true" class="fas fa-globe"></i> Todos los Locales
                </a>
                <a role="button" tabindex="0" class="sidebar-link admin-link admin-section" data-panel="admin-subs" onclick="switchPanel('admin-subs',this)" style="display:none">
                    <i aria-hidden="true" class="fas fa-credit-card"></i> Suscripciones
                </a>
                <a role="button" tabindex="0" class="sidebar-link admin-link admin-section" data-panel="admin-users" onclick="switchPanel('admin-users',this)" style="display:none">
                    <i aria-hidden="true" class="fas fa-users-cog"></i> Usuarios
                </a>
                <a role="button" tabindex="0" class="sidebar-link admin-link admin-section" data-panel="admin-log" onclick="switchPanel('admin-log',this)" style="display:none">
                    <i aria-hidden="true" class="fas fa-receipt"></i> Historial Pagos
                </a>

                                <a role="button" tabindex="0" class="sidebar-link admin-link admin-section" data-panel="admin-collections" onclick="switchPanel('admin-collections',this)" style="display:none">
                    <i aria-hidden="true" class="fas fa-layer-group"></i> Colecciones
                </a>
<div class="sidebar-section-label">Cuenta</div>
                <a role="button" tabindex="0" class="sidebar-link" data-panel="settings" onclick="switchPanel('settings',this)">
                    <i aria-hidden="true" class="fas fa-cog"></i> Configuración
                </a>
                <a role="button" tabindex="0" class="sidebar-link" onclick="handleLogout()">
                    <i aria-hidden="true" class="fas fa-sign-out-alt"></i> Cerrar sesión
                </a>
            </nav>
            <div class="sidebar-user">
                <div class="sidebar-avatar" id="sidebarAvatar">?</div>
                <div class="sidebar-user-info">
                    <div class="sidebar-user-name" id="sidebarUserName">Cargando...</div>
                    <div class="sidebar-user-role" id="sidebarUserRole">Dueño de locales</div>
                </div>
            </div>
        </aside>

        <div class="main-content" id="main-content" role="main">
            <div class="top-bar">
                <div style="display:flex;align-items:center;gap:12px">
                    <button class="mobile-menu-btn" aria-label="Abrir menú lateral" onclick="toggleSidebar()"><i aria-hidden="true" class="fas fa-bars"></i></button>
                    <h1 class="top-bar-title" id="panelTitle">Resumen</h1>
                </div>
                <div class="top-bar-actions">
                    <!-- [F-5.5] Indicador de estado de conexión -->
                    <span id="connectionIndicator" aria-live="polite" aria-atomic="true" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);color:var(--green);font-size:0.74rem;font-weight:600">
                        <i aria-hidden="true" class="fas fa-wifi" style="font-size:0.7rem"></i>
                        <span id="connectionLabel">En línea</span>
                    </span>
                    <!-- [v2.0.20] Botón "Instalar App" — visible solo si la PWA
                         aún no está instalada y el navegador disparó
                         beforeinstallprompt. En iOS no aparece (iOS no soporta
                         ese evento) — el banner inferior sigue activo para iOS. -->
                    <button class="btn-secondary btn-sm" id="installAppBtn"
                            style="display:none"
                            aria-label="Instalar SaborMap como aplicación"
                            title="Instalar como aplicación"
                            onclick="installPwaApp()">
                        <i aria-hidden="true" class="fas fa-download"></i>
                        <span>Instalar App</span>
                    </button>
                    <!-- [T-THEME] Toggle de tema claro/oscuro -->
                    <button class="theme-toggle" id="themeToggleBtn" aria-label="Cambiar tema claro/oscuro" title="Cambiar tema" onclick="toggleDashboardTheme()">
                        <i aria-hidden="true" class="fas fa-moon icon-moon"></i>
                        <i aria-hidden="true" class="fas fa-sun icon-sun"></i>
                    </button>
                    <button class="btn-icon" style="position:relative" aria-label="Notificaciones (no hay nuevas)" onclick="showToast('No hay notificaciones nuevas')"><i aria-hidden="true" class="fas fa-bell"></i><span class="notif-dot"></span></button>
                    <button class="btn-primary btn-sm" onclick="startNewPlace()">
                        <i aria-hidden="true" class="fas fa-plus"></i> Nuevo Local
                    </button>
                </div>
            </div>

            <!-- ===== OVERVIEW ===== -->
            <div class="panel active" id="panel-overview">
                <div class="content-area" style="padding:32px">
                    <div style="margin-bottom:32px">
                        <h2 class="font-display" style="font-size:1.8rem;font-weight:700;margin-bottom:6px" id="welcomeTitle">Bienvenido</h2>
                        <p style="color:var(--muted);font-size:0.95rem" id="welcomeSub">Aca tienes el resumen de tus locales.</p>
                    </div>
                    <div class="stats-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:36px" id="statsGrid"></div>
                    <div class="animated-line" style="margin-bottom:32px"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
                        <h3 style="font-size:1.15rem;font-weight:700">Tus Locales</h3>
                        <button class="btn-secondary btn-sm" onclick="switchPanel('my-places',document.querySelector('[data-panel=my-places]'))">Ver todos <i aria-hidden="true" class="fas fa-arrow-right" style="font-size:0.7rem"></i></button>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px" id="overviewPlaces"></div>
                </div>
            </div>

            <!-- ===== MIS LOCALES ===== -->
            <div class="panel" id="panel-my-places">
                <div class="content-area" style="padding:32px">
                    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px">
                        <div>
                            <h2 style="font-size:1.5rem;font-weight:700">Mis Locales</h2>
                            <p style="color:var(--muted);font-size:0.88rem;margin-top:4px">Gestiona tus restaurantes, bares y heladerias</p>
                        </div>
                        <button class="btn-primary" onclick="startNewPlace()"><i aria-hidden="true" class="fas fa-plus"></i> Agregar Local</button>
                    </div>
                    <div id="myPlacesGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"></div>
                    <div class="empty-state" id="myPlacesEmpty" style="display:none">
                        <i aria-hidden="true" class="fas fa-store-slash"></i>
                        <h3>Aún no tienes locales</h3>
                        <p>Comienza agregando tu primer restaurante, bar o heladeria.</p>
                        <button class="btn-primary" onclick="startNewPlace()"><i aria-hidden="true" class="fas fa-plus"></i> Agregar Local</button>
                    </div>
                </div>
            </div>

            <!-- ===== AGREGAR/EDITAR LOCAL ===== -->
            <div class="panel" id="panel-add-place">
                <div class="content-area" style="padding:32px;max-width:860px">
                    <div style="margin-bottom:28px">
                        <h2 style="font-size:1.5rem;font-weight:700" id="formTitle">Agregar Nuevo Local</h2>
                        <p style="color:var(--muted);font-size:0.88rem;margin-top:4px">Completa los datos de tu local para SaborMap</p>
                    </div>
                    <form id="placeForm" onsubmit="handlePlaceSubmit(event)">
                        <input type="hidden" id="editPlaceId" value="">
                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                            <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-info-circle" style="color:var(--accent)"></i> Informacion Basica</h3>
                            <div class="form-group">
                                <label class="form-label">Nombre del local <span class="required">*</span></label>
                                <input type="text" class="form-input" id="f-name" placeholder="Ej: El Floridita" required>
                                <div class="form-error">El nombre es obligatorio</div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Categoria <span class="required">*</span></label>
                                    <select class="form-select" id="f-category" required>
                                        <option value="">Selecciona</option>
                                        <option value="bar">Bar</option>
                                        <option value="restaurante">Restaurante</option>
                                        <option value="heladeria">Heladeria</option>
                                    </select>
                                    <div class="form-error">Selecciona una categoria</div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Municipio <span class="required">*</span></label>
                                    <select class="form-select" id="f-neighborhood" required>
                                        <option value="">Selecciona</option>
                                        <option>Habana Vieja</option><option>Centro Habana</option><option>Plaza de la Revolucion</option>
                                        <option>Cerro</option><option>Diez de Octubre</option><option>La Lisa</option>
                                        <option>Marianao</option><option>Playa</option><option>Arroyo Naranjo</option>
                                        <option>San Miguel del Padron</option><option>Regla</option><option>Habana del Este</option>
                                        <option>Guanabacoa</option><option>Cotorro</option><option>Boyeros</option>
                                    </select>
                                    <div class="form-error">Selecciona un municipio</div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Direccion</label>
                                <input type="text" class="form-input" id="f-address" placeholder="Ej: Calle Obispo #557">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Teléfono</label>
                                    <input type="tel" class="form-input" id="f-phone" placeholder="+53 5 1234567" pattern="^\+53\s[5-7]\s\d{6,7}$" maxlength="15">
                                    <div class="form-error">Formato inválido. Ej: +53 5 1234567</div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Rango de precio</label>
                                    <select class="form-select" id="f-price_range">
                                        <option value="">Selecciona</option>
                                        <option value="$">$ — Económico</option>
                                        <option value="$$">$$ — Moderado</option>
                                        <option value="$$$">$$$ — Caro</option>
                                        <option value="$$$$">$$$$ — Premium</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- ═══════════════════════════════════════════════════
                             [v2.0.34] UBICACIÓN (GOOGLE MAPS)
                             — Campos OPCIONALES (no required) para que no
                               rompa el flujo de creación de locales sin
                               coordenadas.
                             — Si la columna gmaps_url no existe aún en
                               Supabase, el INSERT la ignora silenciosamente
                               gracias a que el mapDbPlaceToPublic de la home
                               hace || ''.
                             — El "helper link" abre Google Maps con lo que
                               ya cargó el dueño (URL o lat/lng) para que
                               verifique antes de publicar.
                             ═══════════════════════════════════════════════════ -->
                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                            <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-map-location-dot" style="color:var(--accent)"></i> Ubicación (Google Maps) <span style="font-weight:400;color:var(--muted);font-size:0.78rem;margin-left:auto">opcional</span></h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="f-lat">Latitud</label>
                                    <input type="text" class="form-input" id="f-lat" placeholder="Ej: 23.1358" inputmode="decimal" autocomplete="off">
                                    <div class="form-hint">Decimal con punto. Ej: <code>23.1358</code>. Negative para Oeste: <code>-82.3629</code>.</div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="f-lng">Longitud</label>
                                    <input type="text" class="form-input" id="f-lng" placeholder="Ej: -82.3629" inputmode="decimal" autocomplete="off">
                                    <div class="form-hint">Para La Habana siempre es negativo (Oeste).</div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="f-gmaps_url">URL de Google Maps <span style="font-weight:400;color:var(--muted)">(opcional, tiene prioridad sobre lat/lng)</span></label>
                                <input type="url" class="form-input" id="f-gmaps_url" placeholder="https://www.google.com/maps/place/..." autocomplete="off">
                                <div class="form-hint">Si la pegas, se usa esta URL tal cual en el botón "Ubicación" de la home. Útil si el local no tiene coordenadas exactas pero sí un place ID.</div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="f-plus_code">Plus Code <span style="font-weight:400;color:var(--muted)">(opcional)</span></label>
                                    <input type="text" class="form-input" id="f-plus_code" placeholder="Ej: 76MV4JRQ+R6" autocomplete="off">
                                    <div class="form-hint">Código corto visible en la ficha del local.</div>
                                </div>
                                <div class="form-group" style="display:flex;flex-direction:column;justify-content:flex-end">
                                    <label class="form-label" style="margin-bottom:8px">Verificar ubicación</label>
                                    <a id="f-gmaps-helper" href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;width:fit-content">
                                        <i aria-hidden="true" class="fas fa-external-link-alt"></i> Abrir en Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                            <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-align-left" style="color:var(--secondary)"></i> Descripcion</h3>
                            <div class="form-group">
                                <label class="form-label">Descripción del local <span style="font-weight:400;color:var(--muted)">(min. 10, máx. 2000 caracteres)</span></label>
                                <textarea class="form-textarea" id="f-description" placeholder="Cuenta qué hace especial a tu local..." rows="4" minlength="10" maxlength="2000"></textarea>
                                <div class="form-error">La descripción debe tener entre 10 y 2000 caracteres.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Horario</label>
                                <input type="text" class="form-input" id="f-schedule" placeholder="Ej: Lun-Sab 12:00-23:00, Dom cerrado">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Lo que tienes que pedir <span style="font-weight:400;color:var(--muted)">(must-order, opcional)</span></label>
                                <input type="text" class="form-input" id="f-must_order" placeholder="Ej: Copa fiesta de 3 bochas" maxlength="120">
                                <div class="form-hint">Aparece como badge destacado en la ficha del local.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nota del editor <span style="font-weight:400;color:var(--muted)">(opcional)</span></label>
                                <textarea class="form-textarea" id="f-editor_note" placeholder="Una frase corta que capture el espíritu del lugar..." rows="2" maxlength="300"></textarea>
                                <div class="form-hint">Se muestra en italic dentro del drawer del local.</div>
                            </div>
                        </div>

                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                            <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-tags" style="color:var(--pink)"></i> Etiquetas</h3>
                            <div class="form-group">
                                <label class="form-label">Tags <span style="font-weight:400;color:var(--muted)">(presiona Enter o coma para agregar)</span></label>
                                <div class="tag-input-wrapper" id="tagWrapper" onclick="document.getElementById('tagInput').focus()">
                                    <input type="text" class="tag-input-field" id="tagInput" placeholder="Ej: wifi, terraza, musica en vivo...">
                                </div>
                                <div class="form-hint">Maximo 10 etiquetas</div>
                            </div>
                        </div>

                        <!-- ===== CARTA / MENU ===== -->
                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
                                <h3 style="font-size:1rem;font-weight:700;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-book-open" style="color:var(--secondary)"></i> Carta / Menu</h3>
                                <button type="button" class="btn-secondary btn-sm" onclick="addMenuCategory()"><i aria-hidden="true" class="fas fa-plus"></i> Agregar categoria</button>
                            </div>
                            <!-- ★ v2.0.25: barra de navegación pegajosa de categorías.
                                 Se rellena dinámicamente desde renderMenuEditor().
                                 Solo se muestra cuando hay 2+ categorías. -->
                            <div id="menuCatNav" class="menu-cat-nav menu-cat-nav-empty" role="tablist" aria-label="Navegación entre categorías de la carta"></div>
                            <div id="menuContainer" style="display:flex;flex-direction:column;gap:16px"></div>
                            <div class="form-hint" style="margin-top:10px">Agrega categorias (ej: Entradas, Principales) y dentro de cada una los platos con nombre, descripcion y precio.</div>
                        </div>

                        <!-- ===== DELIVERY / LINKS ===== -->
                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
                                <h3 style="font-size:1rem;font-weight:700;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-motorcycle" style="color:var(--amber)"></i> Delivery y Reservas</h3>
                                <button type="button" class="btn-secondary btn-sm" onclick="addLink()"><i aria-hidden="true" class="fas fa-plus"></i> Agregar link</button>
                            </div>
                            <div id="linksContainer" style="display:flex;flex-direction:column;gap:12px"></div>
                            <div class="form-hint" style="margin-top:10px">Ej: PedidosYa, Rappi, Reservar Mesa. Deja el URL vacio si todavia no esta disponible.</div>
                        </div>



                        <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:28px">
                            <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px"><i aria-hidden="true" class="fas fa-camera" style="color:var(--green)"></i> Imagenes</h3>
                            <div class="image-upload-grid" id="imageGrid"></div>
                            <div class="form-hint" style="margin-top:10px">Hasta 5 imagenes. Click en el slot para subir.</div>
                        </div>

                        <div style="display:flex;flex-direction:column;align-items:stretch;gap:10px">
                            <!-- [v2.0.22] Badge visual de modo edición: cuando se está
                                 editando un local existente, este badge aparece arriba
                                 del todo del bloque de botones para que el usuario sepa
                                 claramente que está EDITANDO, no creando. -->
                            <div id="editingBadge" style="display:none;align-items:center;gap:8px;padding:10px 14px;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.25);border-radius:10px;font-size:0.82rem;color:var(--accent-2)">
                                <i aria-hidden="true" class="fas fa-pen-to-square"></i>
                                <span>Editando: <strong id="editingBadgeName" style="color:var(--cream)">—</strong></span>
                                <button type="button" class="btn-icon" style="margin-left:auto;width:28px;height:28px;font-size:0.7rem" onclick="cancelEditing()" aria-label="Cancelar edición y volver a crear local nuevo" title="Cancelar edición y volver a crear">
                                    <i aria-hidden="true" class="fas fa-times"></i>
                                </button>
                            </div>
                            <!-- [v2.0.19] Indicador de draft local: muestra al usuario
                                 cuándo se salvó su borrador por última vez. -->
                            <div id="draftIndicator" style="display:none;align-items:center;gap:6px;font-size:0.78rem;color:var(--muted);justify-content:flex-end;padding:0 4px" aria-live="polite">
                                <i aria-hidden="true" class="fas fa-cloud-arrow-up"></i>
                                <span class="draft-text">Borrador guardado</span>
                            </div>
                            <!-- [v2.0.22] Tres botones separados:
                                 · "Guardar Borrador": solo salva en localStorage/IndexedDB,
                                   sin tocar el servidor. No requiere conexión. No valida
                                   campos obligatorios (deja guardar lo que haya).
                                 · "Cargar Borrador": carga el último draft guardado para
                                   este local (o uno nuevo si no hay editingPlaceId). Útil
                                   cuando el usuario vuelve al formulario y quiere continuar
                                   donde lo dejó sin tener que confirmar el modal de inicio.
                                 · "Publicar": valida campos obligatorios, sube al servidor
                                   con status='published' (si es nuevo) o actualiza el
                                   existente. Si no hay conexión, encola la operación. -->
                            <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap">
                                <button type="button" class="btn-secondary" onclick="switchPanel('my-places',document.querySelector('[data-panel=my-places]'))">Cancelar</button>
                                <button type="button" class="btn-secondary" id="placeLoadDraftBtn" onclick="handleLoadDraft(event)" title="Cargar el último borrador guardado">
                                    <i aria-hidden="true" class="fas fa-folder-open"></i> <span>Cargar Borrador</span>
                                </button>
                                <button type="button" class="btn-success" id="placeDraftBtn" onclick="handlePlaceDraft(event)">
                                    <i aria-hidden="true" class="fas fa-cloud-arrow-up"></i> <span id="placeDraftText">Guardar Borrador</span>
                                </button>
                                <button type="submit" class="btn-primary" id="placeSubmitBtn">
                                    <i aria-hidden="true" class="fas fa-paper-plane"></i> <span id="placeSubmitText">Publicar Local</span>
                                </button>
                            </div>
                            <!-- Tip contextual para que el usuario entienda la diferencia -->
                            <div style="display:flex;align-items:flex-start;gap:6px;font-size:0.72rem;color:var(--muted);justify-content:flex-end;padding:0 4px;line-height:1.4;text-align:right">
                                <i aria-hidden="true" class="fas fa-info-circle" style="margin-top:2px;flex-shrink:0"></i>
                                <span>"Guardar Borrador" deja el local en tu dispositivo (offline). "Cargar Borrador" recupera lo último guardado. "Publicar Local" lo envía al servidor y lo hace visible en SaborMap.</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ===== ADMIN: TODOS LOS LOCALES ===== -->
            <div class="panel" id="panel-admin-places">
                <div class="content-area" style="padding:32px">
                    <div class="admin-section-header">
                        <div>
                            <h2><i aria-hidden="true" class="fas fa-globe" style="color:var(--amber);margin-right:8px"></i>Todos los Locales</h2>
                            <p>Administra todos los locales de la plataforma</p>
                        </div>
                    </div>
                    <div class="admin-quick-stats" id="adminPlacesStats"></div>
                    <div class="admin-filter-bar">
                        <div class="admin-search-wrap">
                            <i aria-hidden="true" class="fas fa-search"></i>
                            <input type="text" class="admin-search" id="adminPlacesSearch" placeholder="Buscar local..." aria-label="Buscar local por nombre o municipio" oninput="debounce(filterAdminPlaces, 250)()">
                        </div>
                        <select class="admin-filter-select" id="adminPlacesCatFilter" onchange="filterAdminPlaces()">
                            <option value="">Todas las categorias</option>
                            <option value="bar">Bar</option>
                            <option value="restaurante">Restaurante</option>
                            <option value="heladeria">Heladeria</option>
                        </select>
                        <select class="admin-filter-select" id="adminPlacesStatusFilter" onchange="filterAdminPlaces()">
                            <option value="">Todos los estados</option>
                            <option value="published">Publicado</option>
                            <option value="draft">Borrador</option>
                            <option value="pending">Pendiente</option>
                        </select>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Local</th>
                                    <th>Categoria</th>
                                    <th>Municipio</th>
                                    <th>Dueño</th>
                                    <th>Estado</th>
                                    <th>Delivery</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="adminPlacesBody"></tbody>
                        </table>
                    </div>
                    <div class="empty-state" id="adminPlacesEmpty" style="display:none">
                        <i aria-hidden="true" class="fas fa-globe"></i>
                        <h3>No se encontraron locales</h3>
                        <p>Intenta cambiar los filtros de busqueda.</p>
                    </div>
                </div>
            </div>

            <!-- ===== ADMIN: SUSCRIPCIONES ===== -->
            <div class="panel" id="panel-admin-subs">
                <div class="content-area" style="padding:32px">
                    <div class="admin-section-header">
                        <div>
                            <h2><i aria-hidden="true" class="fas fa-credit-card" style="color:var(--amber);margin-right:8px"></i>Suscripciones</h2>
                            <p>Gestiona los planes de los usuarios</p>
                        </div>
                    </div>
                    <div class="admin-quick-stats" id="adminSubsStats"></div>
                    <div class="admin-filter-bar">
                        <div class="admin-search-wrap">
                            <i aria-hidden="true" class="fas fa-search"></i>
                            <input type="text" class="admin-search" id="adminSubsSearch" placeholder="Buscar usuario..." aria-label="Buscar suscripción por usuario" oninput="debounce(filterAdminSubs, 250)()">
                        </div>
                        <select class="admin-filter-select" id="adminSubsPlanFilter" onchange="filterAdminSubs()">
                            <option value="">Todos los planes</option>
                            <option value="free">Free</option>
                            <option value="basic">Basic</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                        <select class="admin-filter-select" id="adminSubsStatusFilter" onchange="filterAdminSubs()">
                            <option value="">Todos los estados</option>
                            <option value="active">Activa</option>
                            <option value="inactive">Inactiva</option>
                            <option value="cancelled">Cancelada</option>
                            <option value="expired">Expirada</option>
                        </select>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Plan</th>
                                    <th>Estado</th>
                                    <th>Max Locales</th>
                                    <th>Expira</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="adminSubsBody"></tbody>
                        </table>
                    </div>
                    <div class="empty-state" id="adminSubsEmpty" style="display:none">
                        <i aria-hidden="true" class="fas fa-credit-card"></i>
                        <h3>No se encontraron suscripciones</h3>
                    </div>
                </div>
            </div>

            <!-- ===== ADMIN: USUARIOS ===== -->
            <div class="panel" id="panel-admin-users">
                <div class="content-area" style="padding:32px">
                    <div class="admin-section-header">
                        <div>
                            <h2><i aria-hidden="true" class="fas fa-users-cog" style="color:var(--amber);margin-right:8px"></i>Usuarios</h2>
                            <p>Lista de todos los usuarios registrados</p>
                        </div>
                    </div>
                    <div class="admin-filter-bar">
                        <div class="admin-search-wrap">
                            <i aria-hidden="true" class="fas fa-search"></i>
                            <input type="text" class="admin-search" id="adminUsersSearch" placeholder="Buscar usuario..." aria-label="Buscar usuario por nombre o email" oninput="debounce(filterAdminUsers, 250)()">
                        </div>
                        <select class="admin-filter-select" id="adminUsersRoleFilter" onchange="filterAdminUsers()">
                            <option value="">Todos los roles</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="adminUsersBody"></tbody>
                        </table>
                    </div>
                    <div class="empty-state" id="adminUsersEmpty" style="display:none">
                        <i aria-hidden="true" class="fas fa-users"></i>
                        <h3>No se encontraron usuarios</h3>
                    </div>
                </div>
            </div>

            <!-- ===== ADMIN: HISTORIAL PAGOS ===== -->
            <div class="panel" id="panel-admin-log">
                <div class="content-area" style="padding:32px">
                    <div class="admin-section-header">
                        <div>
                            <h2><i aria-hidden="true" class="fas fa-receipt" style="color:var(--amber);margin-right:8px"></i>Historial de Pagos</h2>
                            <p>Registro de todos los cambios en suscripciones</p>
                        </div>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Usuario</th>
                                    <th>Accion</th>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                    <th>Monto</th>
                                    <th>Metodo</th>
                                </tr>
                            </thead>
                            <tbody id="adminLogBody"></tbody>
                        </table>
                    </div>
                    <div class="empty-state" id="adminLogEmpty" style="display:none">
                        <i aria-hidden="true" class="fas fa-receipt"></i>
                        <h3>No hay registros de pagos</h3>
                    </div>
                </div>
            </div>


            <!-- ===== ADMIN: COLECCIONES ===== -->
            <div class="panel" id="panel-admin-collections">
                <div class="content-area" style="padding:32px">
                    <div class="admin-section-header">
                        <div>
                            <h2><i aria-hidden="true" class="fas fa-layer-group" style="color:var(--amber);margin-right:8px"></i>Colecciones</h2>
                            <p>Administra las colecciones que aparecen en la pagina principal</p>
                        </div>
                        <button class="btn-primary" onclick="openNewCollectionModal()"><i aria-hidden="true" class="fas fa-plus"></i> Nueva Coleccion</button>
                    </div>
                    <div class="admin-quick-stats" id="adminColStats"></div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Coleccion</th>
                                    <th>Color</th>
                                    <th>Lugares</th>
                                    <th>Estado</th>
                                    <th>Orden</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="adminColBody"></tbody>
                        </table>
                    </div>
                    <div class="empty-state" id="adminColEmpty" style="display:none">
                        <i aria-hidden="true" class="fas fa-layer-group"></i>
                        <h3>No hay colecciones</h3>
                        <p>Crea una coleccion para agrupar lugares en la pagina principal.</p>
                    </div>
                </div>
            </div>
            <!-- ===== CONFIGURACION ===== -->
            <div class="panel" id="panel-settings">
                <div class="content-area" style="padding:32px;max-width:640px">
                    <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:6px">Configuración</h2>
                    <p style="color:var(--muted);font-size:0.88rem;margin-bottom:28px">Gestiona tu perfil y suscripción</p>

                    <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                        <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px"><i aria-hidden="true" class="fas fa-user" style="color:var(--accent);margin-right:8px"></i>Mi Perfil</h3>
                        <div class="form-group">
                            <label class="form-label">Nombre completo</label>
                            <input type="text" class="form-input" id="s-name" placeholder="Tu nombre">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="s-email" disabled style="opacity:0.6">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Teléfono</label>
                            <input type="text" class="form-input" id="s-phone" placeholder="+53 5 1234567">
                        </div>
                        <button class="btn-primary" onclick="saveProfile()"><i aria-hidden="true" class="fas fa-save"></i> Guardar Perfil</button>
                    </div>

                    <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:20px">
                        <h3 style="font-size:1rem;font-weight:700;margin-bottom:20px"><i aria-hidden="true" class="fas fa-gem" style="color:var(--amber);margin-right:8px"></i>Mi Suscripción</h3>
                        <div id="settingsSubInfo"></div>
                    </div>

                    <div style="background:var(--card);border:1px solid rgba(239,68,68,0.2);border-radius:18px;padding:24px">
                        <h3 style="font-size:1rem;font-weight:700;margin-bottom:12px;color:#f87171"><i aria-hidden="true" class="fas fa-exclamation-triangle" style="margin-right:8px"></i>Zona de peligro</h3>
                        <p style="color:var(--muted);font-size:0.85rem;margin-bottom:16px">Cambiar la contraseña cierra todas las sesiones activas.</p>
                        <button class="btn-danger" onclick="showChangePwModal()"><i aria-hidden="true" class="fas fa-key"></i> Cambiar Contraseña</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ====== MODAL: CAMBIAR CONTRASEÑA ====== -->
    <div class="modal-overlay" id="changePwModal">
        <div class="modal-box">
            <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:20px">Cambiar Contraseña</h3>
            <div class="form-group">
                <label class="form-label">Nueva contraseña <span class="required">*</span></label>
                <input type="password" class="form-input" id="newPw" placeholder="Mínimo 6 caracteres">
            </div>
            <div class="form-group">
                <label class="form-label">Confirmar contraseña <span class="required">*</span></label>
                <input type="password" class="form-input" id="newPwConfirm" placeholder="Repite la contraseña">
            </div>
            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px">
                <button class="btn-secondary" onclick="closeModal('changePwModal')">Cancelar</button>
                <button class="btn-danger" onclick="changePassword()"><i aria-hidden="true" class="fas fa-key"></i> Cambiar</button>
            </div>
        </div>
    </div>

    <!-- ====== MODAL: EDITAR SUSCRIPCIÓN (ADMIN) ====== -->
    <div class="modal-overlay" id="editSubModal">
        <div class="modal-box">
            <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:20px">Editar Suscripción</h3>
            <input type="hidden" id="editSubId">
            <div class="form-group">
                <label class="form-label">Plan</label>
                <select class="form-select" id="editSubPlan">
                    <option value="free">Free (1 local)</option>
                    <option value="basic">Basic (3 locales)</option>
                    <option value="pro">Pro (10 locales)</option>
                    <option value="enterprise">Enterprise (ilimitados)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-select" id="editSubStatus">
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                    <option value="cancelled">Cancelada</option>
                    <option value="expired">Expirada</option>
                    <option value="trial">Trial</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Maximo de locales</label>
                <input type="number" class="form-input" id="editSubMaxPlaces" min="0" max="999">
            </div>
            <div class="form-group">
                <label class="form-label">Expiracion (dejar vacio = sin expiracion)</label>
                <input type="datetime-local" class="form-input" id="editSubExpires">
            </div>
            <div class="form-group">
                <label class="form-label">Notas</label>
                <textarea class="form-textarea" id="editSubNotes" rows="2" placeholder="Razon del cambio..."></textarea>
            </div>
            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px">
                <button class="btn-secondary" onclick="closeModal('editSubModal')">Cancelar</button>
                <button class="btn-admin" onclick="saveSubEdit()"><i aria-hidden="true" class="fas fa-save"></i> Guardar Cambios</button>
            </div>
        </div>
    </div>

    <!-- ====== MODAL: EDITAR ROL (ADMIN) ====== -->
    <div class="modal-overlay" id="editRoleModal">
        <div class="modal-box">
            <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:8px">Cambiar Rol</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:20px" id="editRoleUserInfo"></p>
            <input type="hidden" id="editRoleUserId">
            <div class="form-group">
                <label class="form-label">Rol</label>
                <select class="form-select" id="editRoleValue">
                    <option value="owner">Owner (Dueño de locales)</option>
                    <option value="admin">Admin (Administrador)</option>
                </select>
            </div>
            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px">
                <button class="btn-secondary" onclick="closeModal('editRoleModal')">Cancelar</button>
                <button class="btn-admin" onclick="saveRoleEdit()"><i aria-hidden="true" class="fas fa-save"></i> Guardar</button>
            </div>
        </div>
    </div>


    <!-- Modal: Crear/Editar Coleccion -->
    <div class="modal-overlay" id="collectionModal">
        <div class="modal-box">
            <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:20px" id="colModalTitle">Nueva Coleccion</h3>
            <input type="hidden" id="colEditId">
            <div style="display:flex;flex-direction:column;gap:14px">
                <div>
                    <label class="form-label">ID (slug)</label>
                    <input type="text" class="form-input" id="colId" placeholder="ej: cena-romantica" style="font-family:monospace;font-size:0.85rem">
                    <p style="font-size:0.72rem;color:var(--muted);margin-top:4px">Identificador unico, solo letras minusculas y guiones. No editar si ya existe.</p>
                </div>
                <div>
                    <label class="form-label">Titulo</label>
                    <input type="text" class="form-input" id="colTitle" placeholder="Cena Romantica">
                </div>
                <div>
                    <label class="form-label">Descripcion</label>
                    <input type="text" class="form-input" id="colDesc" placeholder="Candlelight, vino y esa mesa esquinada">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div>
                        <label class="form-label">Icono (FontAwesome)</label>
                        <input type="text" class="form-input" id="colIcon" placeholder="fa-heart">
                    </div>
                    <div>
                        <label class="form-label">Orden</label>
                        <input type="number" class="form-input" id="colSort" min="0" max="99" value="0">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
                    <div>
                        <label class="form-label">Color principal</label>
                        <input type="color" id="colColor" value="#8b5cf6" style="width:100%;height:40px;border:1px solid var(--border);border-radius:10px;background:var(--card);cursor:pointer;padding:4px">
                    </div>
                    <div>
                        <label class="form-label">Fondo</label>
                        <input type="color" id="colBg" value="#8b5cf6" style="width:100%;height:40px;border:1px solid var(--border);border-radius:10px;background:var(--card);cursor:pointer;padding:4px">
                        <p style="font-size:0.65rem;color:var(--muted);margin-top:2px">Se usa con opacidad 0.12</p>
                    </div>
                    <div>
                        <label class="form-label">Borde</label>
                        <input type="color" id="colBorder" value="#8b5cf6" style="width:100%;height:40px;border:1px solid var(--border);border-radius:10px;background:var(--card);cursor:pointer;padding:4px">
                        <p style="font-size:0.65rem;color:var(--muted);margin-top:2px">Se usa con opacidad 0.2</p>
                    </div>
                </div>
                <div>
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem">
                        <input type="checkbox" id="colActive" checked style="accent-color:var(--accent);width:18px;height:18px">
                        Coleccion activa (visible en la pagina principal)
                    </label>
                </div>
            </div>
            <div style="display:flex;gap:10px;margin-top:24px;justify-content:flex-end">
                <button class="btn-secondary" onclick="closeModal('collectionModal')">Cancelar</button>
                <button class="btn-primary" onclick="saveCollection()"><i aria-hidden="true" class="fas fa-save"></i> Guardar</button>
            </div>
        </div>
    </div>

    <!-- Modal: Gestionar lugares de una coleccion -->
    <div class="modal-overlay" id="colPlacesModal">
        <div class="modal-box" style="max-width:640px">
            <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:4px" id="colPlacesTitle">Lugares en la coleccion</h3>
            <p style="color:var(--muted);font-size:0.82rem;margin-bottom:16px" id="colPlacesSubtitle"></p>
            <input type="hidden" id="colPlacesEditId">

            <!-- Buscador de lugares -->
            <div style="margin-bottom:16px">
                <label class="form-label">Agregar lugar</label>
                <div style="display:flex;gap:8px">
                    <select class="form-select" id="colPlaceSelect" style="flex:1">
                        <option value="">Seleccionar un lugar...</option>
                    </select>
                    <button class="btn-primary btn-sm" onclick="addPlaceToCollection()"><i aria-hidden="true" class="fas fa-plus"></i></button>
                </div>
            </div>

            <!-- Lugares estaticos (IDs numericos) -->
            <div style="margin-bottom:16px">
                <label class="form-label">Lugar estatico (ID numerico de places.js)</label>
                <div style="display:flex;gap:8px">
                    <input type="number" class="form-input" id="colStaticId" placeholder="Ej: 15" min="1" max="300" style="flex:1">
                    <button class="btn-secondary btn-sm" onclick="addStaticPlaceToCollection()"><i aria-hidden="true" class="fas fa-plus"></i></button>
                </div>
            </div>

            <!-- Lista de lugares en la coleccion -->
            <div style="max-height:300px;overflow-y:auto;border:1px solid var(--border);border-radius:12px;padding:8px" id="colPlacesList">
                <p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:20px 0">Cargando...</p>
            </div>

            <div style="display:flex;gap:10px;margin-top:20px;justify-content:flex-end">
                <button class="btn-secondary" onclick="closeModal('colPlacesModal')">Cerrar</button>
            </div>
        </div>
    </div>
    <!-- ====== MODAL: Sesión expirada (F-5.6) ====== -->
    <div class="modal-overlay" id="sessionExpiredModal" role="alertdialog" aria-modal="true" aria-labelledby="sessionExpiredTitle">
        <div class="modal-box" style="max-width:440px">
            <h3 id="sessionExpiredTitle" style="font-size:1.2rem;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:10px">
                <i aria-hidden="true" class="fas fa-clock" style="color:var(--amber)"></i> Sesión expirada
            </h3>
            <p style="color:var(--muted);font-size:0.9rem;line-height:1.5;margin-bottom:20px">
                Tu sesión ha expirado por inactividad o por un corte de conexión. Si estabas completando un formulario, tu progreso se guardó automáticamente como borrador.
            </p>
            <div style="display:flex;gap:12px;justify-content:flex-end">
                <button class="btn-primary" onclick="handleLogout()"><i aria-hidden="true" class="fas fa-sign-in-alt"></i> Volver a iniciar sesión</button>
            </div>
        </div>
    </div>

    <!-- ====== TOAST ====== -->
    <div class="toast" id="appToast" role="alert" aria-live="polite"></div>

    <!-- ====== SUPABASE + JS (UNA SOLA VEZ) ====== -->
    <!-- ★ FIX [v2.0.7] Polyfill Web Locks API -->
    <script>
    (function() {
        if ('locks' in navigator && typeof navigator.locks.request === 'function') return;
        console.warn('[Polyfill] Web Locks API no soportada. Activando fallback.');
        navigator.locks = navigator.locks || {};
        navigator.locks.request = function(name, mode, callback) {
            if (typeof mode === 'function') { callback = mode; mode = 'exclusive'; }
            return Promise.resolve(callback({ name: String(name), mode: mode }));
        };
        navigator.locks.query = function() { return Promise.resolve({ held: [], pending: [] }); };
    })();
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4" integrity="sha384-2zrRDgDHSYB/GN3nFW3fsZXoxEhKIr3N2h63Tc6DEOB9JJdFIu8xMJT2Cph/gBil" crossorigin="anonymous"></script>
    <script>
    (function() {
        'use strict';

        /* ========================================
           PLUS CODE ENCODER (Open Location Code)
           Convierte lat/lng a Plus Code tipo 76MV4JRQ+R6
        ======================================== */
        function encodePlusCode(latitude, longitude, codeLength) {
            codeLength = codeLength || 10;
            var A = '23456789CFGHJMPQRVWX', B = 20;
            var GR = 5, GC = 4, GCL = 5, PCL = 10;
            var GRD = 3125, GCD = 1024, PP = 8000;
            var FLP = 25000000, FLOP = 8192000;
            if (latitude === 90) latitude = 89.9999999;
            if (longitude === 180) longitude = -180;
            var latVal = Math.round((latitude + 90) * FLP);
            var lngVal = Math.round((longitude + 180) * FLOP);
            var code = '';
            if (codeLength > PCL) {
                for (var g = 0; g < 15 - codeLength; g++) {
                    var latD = latVal % GR, lngD = lngVal % GC;
                    code = A[latD * GC + lngD] + code;
                    latVal = Math.floor(latVal / GR);
                    lngVal = Math.floor(lngVal / GC);
                }
            } else {
                latVal = Math.floor(latVal / GRD);
                lngVal = Math.floor(lngVal / GCD);
            }
            for (var i = 0; i < 5; i++) {
                var ld = latVal % B, lg = lngVal % B;
                code = A[lg] + code;
                code = A[ld] + code;
                latVal = Math.floor(latVal / B);
                lngVal = Math.floor(lngVal / B);
            }
            code = code.substring(0, 8) + '+' + code.substring(8);
            if (codeLength >= 8) code = code.substring(0, codeLength + 1);
            return code;
        }
        function getPlusCode(place) {
            if (place.plusCode) return place.plusCode;
            if (place.plus_code) return place.plus_code;
            if (place.lat && place.lng) return encodePlusCode(Number(place.lat), Number(place.lng), 10);
            return '';
        }

        /* ========================================
           CONFIGURACION — Poné tus datos aca
        ======================================== */
        const SUPABASE_URL = 'https://cfmqwnfimpfuivqmsxju.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_xnipCyojiLP0RsDJKc_KpA_WWi7mj3j';

        /* ========================================
           INICIALIZACION — SIN redeclarar
        ======================================== */
        const { createClient } = supabase;
        // ★ FIX [v2.0.23] fetch con AbortController de 20s para TODAS las
        //   requests a Supabase. Antes, cuando el gateway se caía o la red
        //   se degradaba, los fetch quedaban colgados indefinidamente y el
        //   withTimeout del cliente no los cancelaba de verdad (solo
        //   ignoraba el resultado). Resultado: INSERTs "fantasmas" que
        //   completaban minutos después, creando duplicados.
        //   Ahora: fetch aborta a los 20s y lanza AbortError que el
        //   catch del save trata como timeout/network error.
        function _saborMapFetch(url, opts) {
            opts = opts || {};
            if (!opts.signal) {
                const controller = new AbortController();
                opts._sabormapController = controller;
                opts.signal = controller.signal;
                setTimeout(() => controller.abort(), 20000);
            }
            return fetch(url, opts).catch(err => {
                if (err && err.name === 'AbortError') {
                    throw new Error('Timeout (20s): el servidor no respondió.');
                }
                throw err;
            });
        }
        const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: false,
                flowType: 'pkce'
            },
            global: {
                fetch: _saborMapFetch
            }
        });

        /* ========================================
           ESTADO GLOBAL
        ======================================== */
        let currentUser = null;
        let userProfile = null;
        let userSubscription = null;
        let myPlaces = [];
        let allPlaces = [];      // admin
        let allProfiles = [];    // admin
        let allSubs = [];        // admin
        let allLogs = [];        // admin
        let allCollections = [];     // admin
        let allCollectionPlaces = []; // admin
        let editingPlaceId = null;
        let placeTags = [];
        let placeImages = [];    // array de {file, url}

        /* ========================================
           UTILIDADES
        ======================================== */
        function $(id) { return document.getElementById(id); }

        /* ─── [F-3.1] SEGURIDAD: escapeHtml para prevenir XSS ─── */
        function escapeHtml(s) {
            return String(s == null ? '' : s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        window.escapeHtml = escapeHtml;

        /* ─── [F-3.6] SEGURIDAD: verificar rol admin antes de operaciones admin ─── */
        function isAdmin() {
            return !!(userProfile && userProfile.role === 'admin');
        }
        function requireAdmin(action) {
            if (!isAdmin()) {
                showToast('Acceso denegado: esta acción requiere rol administrador', true);
                console.warn('Bloqueo cliente: intento de acción admin por usuario no-admin:', action);
                switchPanel('overview', document.querySelector('[data-panel=overview]'));
                return false;
            }
            return true;
        }
        window.isAdmin = isAdmin;
        window.requireAdmin = requireAdmin;

        /* ─── [F-1.4] debounce para buscadores administrativos ─── */
        function debounce(fn, wait) {
            let t = null;
            return function(...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait || 250);
            };
        }
        window.debounce = debounce;

        /* ─── [F-5.6] Interceptor de errores 401 con refresh de sesión ─── */
        async function handleAuthError(err, retryFn) {
            if (!err) return false;
            const msg = String(err.message || '');
            const isAuthError = msg.includes('JWT') || msg.includes('jwt') ||
                                msg.includes('expired') || msg.includes('401') ||
                                msg.includes('not authenticated') || err.status === 401;
            if (!isAuthError) return false;
            // Intentar refresh
            try {
                const { data, error } = await sb.auth.refreshSession();
                if (error || !data.session) throw error || new Error('refresh failed');
                // Reintento único
                if (typeof retryFn === 'function') {
                    return await retryFn();
                }
                return true;
            } catch (refreshErr) {
                // Sesión realmente perdida: mostrar modal y preservar formulario
                showSessionExpiredModal();
                return false;
            }
        }
        window.handleAuthError = handleAuthError;

        function showSessionExpiredModal() {
            // ★ FIX [v2.0.32] Ocultar botones flotantes de scroll: aunque el
            //   modal de sesion expirada tiene z-index 100 (mayor que los
            //   botones z-index 35), los ocultamos por higiene y para evitar
            //   que reciban foco fuera del modal.
            // ★ FIX [v2.0.33] DESTRUIR los botones para forzar recreate en el
            //   proximo login (mismo motivo que handleLogout).
            if (typeof destroyScrollButtons === 'function') destroyScrollButtons();
            else if (typeof hideScrollButtons === 'function') hideScrollButtons();
            const msg = $('sessionExpiredMsg');
            if (msg) {
                openModal('sessionExpiredModal');
            } else {
                showToast('Tu sesión ha expirado. Por favor, ingresa nuevamente.', true);
                setTimeout(() => handleLogout(), 2000);
            }
        }

        /* ─── [F-5.2 + v2.0.19] DRAFT LOCAL — doble capa de protección ───
           Estrategia pedida por el usuario:
             1) Cada cambio del formulario se salva en localStorage
                (síncrono, instantáneo, sobrevive a recargas y cierres).
             2) Además se guarda una copia más completa en IndexedDB
                (por si localStorage se llena — quota ~5MB).
             3) Al volver la conexión (o al hacer submit), se intenta
                subir al servidor. Si falla, el draft queda guardado y
                se encola la operación en `sabormap_pending_ops`.
           El draft NUNCA se borra hasta que el servidor confirma la
           escritura con `.select()` (RLS silent denial detectado). */
        let _draftDB = null;
        function openDraftDB() {
            return new Promise((resolve, reject) => {
                if (_draftDB) return resolve(_draftDB);
                if (!window.indexedDB) return resolve(null);
                const req = indexedDB.open('sabormap_drafts', 1);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('place_form')) {
                        db.createObjectStore('place_form', { keyPath: 'id' });
                    }
                };
                req.onsuccess = (e) => { _draftDB = e.target.result; resolve(_draftDB); };
                req.onerror = () => resolve(null);
            });
        }

        /* Clave única en localStorage para el draft del formulario activo.
           Incluimos editingPlaceId para distinguir crear vs editar. */
        function draftLSKey() {
            return 'sabormap_draft_place_' + (editingPlaceId || 'new');
        }

        /* Devuelve todos los drafts guardados (para listar/restaurar).
           Utilidad para depuración y para futura UI de "borradores guardados". */
        function listAllPlaceDraftsLS() {
            const out = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.indexOf('sabormap_draft_place_') === 0) {
                    try {
                        const v = JSON.parse(localStorage.getItem(k));
                        if (v && v.savedAt) out.push({ key: k, ...v });
                    } catch (e) {}
                }
            }
            out.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
            return out;
        }

        /* Guarda el draft en localStorage de forma síncrona + en IndexedDB.
           Es seguro llamarlo en cada keystroke (debounced arriba). */
        async function savePlaceDraft() {
            try {
                if (!$('placeForm')) return;
                const data = collectPlaceFormData();
                data.id = editingPlaceId || 'new';
                data.editingPlaceId = editingPlaceId || null;
                data.savedAt = new Date().toISOString();
                /* Las imágenes File no se serializan a JSON; guardamos metadata
                   para recordarle al usuario cuántas imágenes tenía cargadas.
                   Las URLs (strings) sí las preservamos. */
                data.imageMeta = placeImages.map(img => {
                    if (img instanceof File) return { kind: 'file', name: img.name, size: img.size };
                    if (typeof img === 'string') return { kind: 'url', url: img };
                    return null;
                }).filter(Boolean);

                /* ── 1) localStorage (capa primaria, instantánea) ── */
                try {
                    localStorage.setItem(draftLSKey(), JSON.stringify(data));
                } catch (quotaErr) {
                    /* Si localStorage se llenó (raro pero posible), intentamos
                       limpiar drafts viejos y reintentar una vez. */
                    console.warn('[Draft] localStorage lleno, purgando drafts viejos:', quotaErr);
                    purgeOldDraftsLS(7);
                    try { localStorage.setItem(draftLSKey(), JSON.stringify(data)); }
                    catch (e2) { console.warn('[Draft] No se pudo salvar en localStorage:', e2); }
                }

                /* ── 2) IndexedDB (capa secundaria, más capacidad) ── */
                const db = await openDraftDB();
                if (db) {
                    const tx = db.transaction('place_form', 'readwrite');
                    tx.objectStore('place_form').put(data);
                    tx.oncomplete = () => { /* ok silencioso */ };
                }

                /* ── 3) Indicador visual ── */
                updateDraftIndicator('saved');
            } catch (e) {
                console.warn('[Draft] No se pudo salvar:', e);
                updateDraftIndicator('error');
            }
        }

        /* Carga el draft desde localStorage (capa primaria). Si no está,
           cae a IndexedDB. Devuelve null si no hay draft. */
        async function loadPlaceDraft() {
            /* 1) localStorage */
            try {
                const raw = localStorage.getItem(draftLSKey());
                if (raw) {
                    const data = JSON.parse(raw);
                    if (data && data.savedAt) return data;
                }
            } catch (e) {}

            /* 2) IndexedDB */
            try {
                const db = await openDraftDB();
                if (!db) return null;
                return await new Promise((resolve) => {
                    const tx = db.transaction('place_form', 'readonly');
                    const req = tx.objectStore('place_form').get(editingPlaceId || 'new');
                    req.onsuccess = () => resolve(req.result || null);
                    req.onerror = () => resolve(null);
                });
            } catch (e) { return null; }
        }

        /* Borra el draft actual de localStorage e IndexedDB. Se llama
           solo cuando el servidor confirma la escritura. */
        async function clearPlaceDraft() {
            try { localStorage.removeItem(draftLSKey()); } catch (e) {}
            try {
                const db = await openDraftDB();
                if (!db) return;
                const tx = db.transaction('place_form', 'readwrite');
                tx.objectStore('place_form').delete(editingPlaceId || 'new');
            } catch (e) {}
            updateDraftIndicator('cleared');
        }

        /* Purga drafts de localStorage más antiguos que N días.
           Se usa cuando se llena el quota. */
        function purgeOldDraftsLS(daysOld) {
            const cutoff = Date.now() - daysOld * 86400000;
            const toRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (!k || k.indexOf('sabormap_draft_place_') !== 0) continue;
                try {
                    const v = JSON.parse(localStorage.getItem(k));
                    if (v && v.savedAt && new Date(v.savedAt).getTime() < cutoff) {
                        toRemove.push(k);
                    }
                } catch (e) { toRemove.push(k); }  /* corrupto → borrar */
            }
            toRemove.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
            return toRemove.length;
        }

        /* Indicador visual discreto en el botón de guardar:
           - 'saved'   → "Borrador guardado · HH:MM"
           - 'error'   → "No se pudo guardar el borrador"
           - 'cleared' → oculta el indicador
           - 'saving'  → "Guardando borrador..." */
        function updateDraftIndicator(state) {
            const wrap = document.getElementById('draftIndicator');
            if (!wrap) return;
            const txt = wrap.querySelector('.draft-text');
            if (state === 'cleared') {
                wrap.style.display = 'none';
                return;
            }
            wrap.style.display = 'flex';
            if (state === 'saved') {
                const t = new Date().toLocaleTimeString('es-CU', { hour: '2-digit', minute: '2-digit' });
                wrap.style.color = 'var(--green)';
                wrap.querySelector('i').className = 'fas fa-cloud-arrow-up';
                if (txt) txt.textContent = 'Borrador guardado · ' + t;
            } else if (state === 'saving') {
                wrap.style.color = 'var(--muted)';
                wrap.querySelector('i').className = 'fas fa-spinner fa-spin';
                if (txt) txt.textContent = 'Guardando borrador...';
            } else if (state === 'error') {
                wrap.style.color = 'var(--red)';
                wrap.querySelector('i').className = 'fas fa-triangle-exclamation';
                if (txt) txt.textContent = 'No se pudo guardar el borrador local';
            }
        }

        /* ═══════════════════════════════════════════════════
           [F-5.1+] BACKGROUND SYNC — Cola de operaciones offline
           ───────────────────────────────────────────────────
           IndexedDB 'sabormap_pending_ops' con tabla 'ops' (auto-key).
           Cada registro: { id, type, payload, status, created_at, attempts, last_error }

           Tipos soportados:
             · 'place_insert'   → INSERT en tabla places
             · 'place_update'   → UPDATE en places (con editingPlaceId)
             · 'place_delete'   → DELETE en places
             · 'place_publish'   → UPDATE status=published
             · 'place_unpublish' → UPDATE status=draft
             · 'profile_update'  → UPDATE en profiles
           ═══════════════════════════════════════════════════ */
        let _opsDB = null;
        function openOpsDB() {
            return new Promise((resolve, reject) => {
                if (_opsDB) return resolve(_opsDB);
                if (!window.indexedDB) return resolve(null);
                const req = indexedDB.open('sabormap_pending_ops', 1);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('ops')) {
                        const store = db.createObjectStore('ops', { keyPath: 'id', autoIncrement: true });
                        store.createIndex('status', 'status', { unique: false });
                        store.createIndex('type', 'type', { unique: false });
                    }
                };
                req.onsuccess = (e) => { _opsDB = e.target.result; resolve(_opsDB); };
                req.onerror = () => resolve(null);
            });
        }

        async function enqueueOperation(type, payload, metadata) {
            const db = await openOpsDB();
            if (!db) return null;
            return new Promise((resolve, reject) => {
                const tx = db.transaction('ops', 'readwrite');
                const op = {
                    type: type,
                    payload: payload,
                    metadata: metadata || {},
                    // ★ FIX [v2.0.23] user_id para filtrar ops cross-user.
                    //   Sin esto, ops del usuario A podían procesarse cuando
                    //   el usuario B entraba, causando RLS denials silenciosos.
                    user_id: currentUser ? currentUser.id : null,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    attempts: 0,
                    last_error: null
                };
                const req = tx.objectStore('ops').add(op);
                req.onsuccess = () => {
                    updatePendingBadge();
                    // Intentar procesar inmediatamente si hay conexión
                    if (navigator.onLine) {
                        if ('serviceWorker' in navigator && 'SyncManager' in window) {
                            navigator.serviceWorker.ready.then(reg => {
                                return reg.sync.register('sabormap-sync-queue');
                            }).catch(() => processQueueNow());
                        } else {
                            processQueueNow();
                        }
                    }
                    resolve(req.result);
                };
                req.onerror = () => resolve(null);
            });
        }
        window.enqueueOperation = enqueueOperation;

        async function getPendingOps() {
            const db = await openOpsDB();
            if (!db) return [];
            return new Promise((resolve) => {
                const tx = db.transaction('ops', 'readonly');
                const req = tx.objectStore('ops').getAll();
                req.onsuccess = () => {
                    const all = req.result || [];
                    // ★ FIX [v2.0.23] Solo devolver ops del usuario actual.
                    //   Ops de otros usuarios se quedan en la BD pero no se procesan.
                    const uid = currentUser ? currentUser.id : null;
                    resolve(all.filter(o => o.user_id === uid || (!o.user_id && !uid)));
                };
                req.onerror = () => resolve([]);
            });
        }

        /* ★ FIX [v2.0.23] Limpiar ops huérfanas al hacer logout.
           Las ops 'pending'/'retry' de un usuario anterior se quedaban
           en IndexedDB para siempre, consumiendo espacio y confundiendo
           al siguiente usuario que entrara (veía ops ajenas en el badge). */
        async function clearOpsForCurrentUser() {
            const db = await openOpsDB();
            if (!db) return;
            return new Promise((resolve) => {
                const tx = db.transaction('ops', 'readwrite');
                const store = tx.objectStore('ops');
                const req = store.getAll();
                req.onsuccess = () => {
                    const all = req.result || [];
                    const uid = currentUser ? currentUser.id : null;
                    all.forEach(op => {
                        if (op.user_id && op.user_id !== uid) {
                            store.delete(op.id);
                        }
                    });
                };
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            });
        }
        window.clearOpsForCurrentUser = clearOpsForCurrentUser;

        async function deleteOp(id) {
            const db = await openOpsDB();
            if (!db) return;
            const tx = db.transaction('ops', 'readwrite');
            tx.objectStore('ops').delete(id);
            tx.oncomplete = () => updatePendingBadge();
        }

        async function updateOpStatus(id, status, errorMsg) {
            const db = await openOpsDB();
            if (!db) return;
            return new Promise((resolve) => {
                const tx = db.transaction('ops', 'readwrite');
                const store = tx.objectStore('ops');
                const getReq = store.get(id);
                getReq.onsuccess = () => {
                    const op = getReq.result;
                    if (!op) return resolve();
                    op.status = status;
                    op.attempts = (op.attempts || 0) + 1;
                    op.last_error = errorMsg || op.last_error;
                    op.last_attempt_at = new Date().toISOString();
                    store.put(op);
                };
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            });
        }

        /* Indicador visual: badge con conteo de operaciones pendientes */
        async function updatePendingBadge() {
            const ops = await getPendingOps();
            const pending = ops.filter(o => o.status === 'pending' || o.status === 'retry');
            let badge = $('pendingOpsBadge');
            if (!badge) {
                // Crear el badge en el top-bar, junto al toggle de tema
                const actions = document.querySelector('.top-bar-actions');
                if (!actions) return;
                badge = document.createElement('button');
                badge.id = 'pendingOpsBadge';
                badge.className = 'btn-icon';
                badge.style.cssText = 'position:relative;border-color:var(--amber);color:var(--amber);background:rgba(245,158,11,0.06)';
                badge.title = 'Operaciones pendientes de sincronización';
                badge.setAttribute('aria-label', 'Operaciones pendientes de sincronización');
                badge.innerHTML = '<i aria-hidden="true" class="fas fa-cloud-arrow-up"></i><span class="pending-count" style="position:absolute;top:-4px;right:-4px;background:var(--amber);color:#000;font-size:0.65rem;font-weight:700;min-width:16px;height:16px;border-radius:50%;display:none;align-items:center;justify-content:center;padding:0 4px"></span>';
                badge.onclick = showPendingOpsModal;
                actions.insertBefore(badge, actions.firstChild);
            }
            const countEl = badge.querySelector('.pending-count');
            if (pending.length === 0) {
                countEl.style.display = 'none';
                badge.style.display = 'none';
            } else {
                countEl.style.display = 'flex';
                countEl.textContent = pending.length > 9 ? '9+' : pending.length;
                badge.style.display = 'inline-flex';
            }
        }

        function showPendingOpsModal() {
            getPendingOps().then(ops => {
                const pending = ops.filter(o => o.status === 'pending' || o.status === 'retry');
                if (pending.length === 0) {
                    showToast('No hay operaciones pendientes');
                    return;
                }
                const labels = {
                    place_insert: 'Crear local',
                    place_update: 'Editar local',
                    place_delete: 'Eliminar local',
                    place_publish: 'Publicar local',
                    place_unpublish: 'Despublicar local',
                    profile_update: 'Actualizar perfil'
                };
                const lines = pending.map(o => {
                    const label = labels[o.type] || o.type;
                    const name = (o.payload && (o.payload.name || o.metadata && o.metadata.placeName)) || '(sin nombre)';
                    const time = new Date(o.created_at).toLocaleString('es-CU');
                    return '• ' + label + ': ' + name + ' — ' + time;
                }).join('\n');
                alert('Operaciones pendientes de sincronización (' + pending.length + '):\n\n' + lines + '\n\nSe enviarán automáticamente cuando se restaure la conexión.');
            });
        }
        window.showPendingOpsModal = showPendingOpsModal;

        /* ════════════════════════════════════════════════════════════════
           [v2.0.21] CACHE PÚBLICO COMPARTIDO CON LA HOME
           ────────────────────────────────────────────────────────────────
           La home (index.html + app.js) mantiene un cache local de los
           locales publicados en localStorage con la key
           'sabormap_published_places_cache'. Esto permite que se vean
           offline (incluyendo los creados desde este dashboard).

           Cuando el dashboard hace INSERT / UPDATE / DELETE de un local,
           debe también actualizar ese cache compartido, para que:
             · Si el usuario abre la home en otra pestaña, vea el cambio
               instantáneamente (gracias al evento 'storage').
             · Si el usuario abre la home offline más tarde, el cache ya
               tenga la versión más reciente.

           Las funciones siguientes son NO-BLOCKING: si el cache no existe
           o está corrupto, no pasa nada, se ignora silenciosamente. */
        const PUBLIC_PLACES_CACHE_KEY = 'sabormap_published_places_cache';

        /* Lee el cache público actual. Devuelve [] si no existe. */
        function readPublicPlacesCache() {
            try {
                const raw = localStorage.getItem(PUBLIC_PLACES_CACHE_KEY);
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                if (!parsed || !Array.isArray(parsed.places)) return [];
                return parsed.places;
            } catch (e) { return []; }
        }

        /* Escribe el cache público completo. Recibe un array de places
           en formato Supabase (snake_case). */
        function writePublicPlacesCache(places) {
            try {
                localStorage.setItem(PUBLIC_PLACES_CACHE_KEY, JSON.stringify({
                    savedAt: Date.now(),
                    version: 1,
                    places: places
                }));
            } catch (e) { /* no crítico */ }
        }

        /* Agrega o actualiza un local en el cache público.
           Recibe el place en formato Supabase (snake_case). */
        function upsertPublicPlaceInCache(dbPlace) {
            if (!dbPlace || !dbPlace.id) return;
            try {
                const places = readPublicPlacesCache();
                const idx = places.findIndex(p => String(p.id) === String(dbPlace.id));
                if (idx >= 0) places[idx] = dbPlace;
                else places.push(dbPlace);
                writePublicPlacesCache(places);
            } catch (e) { /* no crítico */ }
        }

        /* Elimina un local del cache público por id. */
        function removePublicPlaceFromCache(placeId) {
            if (!placeId) return;
            try {
                const places = readPublicPlacesCache();
                const filtered = places.filter(p => String(p.id) !== String(placeId));
                if (filtered.length !== places.length) {
                    writePublicPlacesCache(filtered);
                }
            } catch (e) { /* no crítico */ }
        }

        /* Convierte el `data` que el dashboard usa (camelCase, con tags/menu/links
           ya como arrays) de vuelta al formato Supabase (snake_case) para que
           la home lo pueda leer con su mapDbPlaceToPublic(). */
        function dashboardDataToSupabaseFormat(data, placeId) {
            return {
                id: placeId || data.id,
                name: data.name,
                category: data.category,
                neighborhood: data.neighborhood,
                address: data.address,
                phone: data.phone,
                description: data.description,
                price_range: data.price_range,
                schedule: data.schedule,
                must_order: data.must_order,
                editor_note: data.editor_note,
                tags: data.tags,
                images: data.images,
                menu: data.menu,
                links: data.links,
                lat: data.lat || null,
                lng: data.lng || null,
                plus_code: data.plus_code || null,
                // ★ [v2.0.34] gmaps_url: si la columna no existe en Supabase,
                //   este campo es ignorado por el INSERT. En el cache público
                //   se conserva para que la home lo use si el local no tiene
                //   lat/lng pero sí URL.
                gmaps_url: data.gmaps_url || null,
                delivery_enabled: !!data.delivery_enabled,
                status: data.status || 'published',
                owner_id: data.owner_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        }

        /* Procesar la cola de operaciones (en cliente o en SW)
           Esta función es referenciada por el SW vía importScripts-like pattern:
           el SW ejecuta su propia versión (ver sw1.js). Esta versión de cliente
           se usa como fallback cuando Background Sync no está soportado. */
        async function processQueueNow() {
            const ops = await getPendingOps();
            const pending = ops.filter(o => o.status === 'pending' || o.status === 'retry');
            if (pending.length === 0) return;

            for (const op of pending) {
                if (!navigator.onLine) break;  // sin conexión, esperar
                try {
                    const result = await executeOp(op);
                    if (result.ok) {
                        await deleteOp(op.id);

                        // ★ FIX [sold_out-sync v2.0.31] Sincronizar el cache
                        //   publico compartido con la home
                        //   (localStorage['sabormap_published_places_cache']) tras
                        //   procesar una op exitosa desde la cola offline. Sin este
                        //   bloque, el badge "Agotado" (y cualquier otro cambio)
                        //   se queda en Supabase pero la home nunca lo ve hasta su
                        //   proximo loadPlacesFromSupabase() exitoso.
                        //   Requiere que executeOp devuelva result.data (ver fix #1).
                        try {
                            if (op.type === 'place_delete' || op.type === 'place_unpublish') {
                                removePublicPlaceFromCache(op.payload.id);
                            } else if (
                                (op.type === 'place_insert' || op.type === 'place_update' || op.type === 'place_publish') &&
                                result.data && Array.isArray(result.data) && result.data[0]
                            ) {
                                upsertPublicPlaceInCache(result.data[0]);
                            }
                        } catch (e) { /* no critico */ }

                        // [v2.0.19] Limpiar el draft de localStorage asociado a
                        // esta op (si tenía metadata.draftLSKey).
                        try {
                            const meta = op.metadata || {};
                            if (meta.draftLSKey) {
                                localStorage.removeItem(meta.draftLSKey);
                            }
                            if (meta.draftId !== undefined) {
                                const db = await openDraftDB();
                                if (db) {
                                    const tx = db.transaction('place_form', 'readwrite');
                                    tx.objectStore('place_form').delete(meta.draftId || 'new');
                                }
                            }
                        } catch (e) { /* no crítico */ }
                    } else if (result.fatal) {
                        // Error no recuperable: marcar como failed y avisar al usuario
                        await updateOpStatus(op.id, 'failed', result.error);
                        showToast('Operación "' + op.type + '" falló permanentemente: ' + result.error, true);
                    } else {
                        // Error recuperable: marcar para reintento
                        await updateOpStatus(op.id, 'retry', result.error);
                    }
                } catch (err) {
                    await updateOpStatus(op.id, 'retry', err.message || String(err));
                }
            }
            updatePendingBadge();
        }
        window.processQueueNow = processQueueNow;

        /* Ejecutar una operación individual contra Supabase */
        async function executeOp(op) {
            const { type, payload } = op;
            // Necesitamos una sesión válida
            const { data: { session } } = await sb.auth.getSession();
            if (!session) {
                return { ok: false, fatal: true, error: 'Sesión expirada' };
            }

            try {
                let result;
                switch (type) {
                    case 'place_insert':
                        // ★ FIX [v2.0.23] .select() para detectar RLS silent denial.
                        //   Sin esto, un INSERT bloqueado por RLS devolvia 0 filas
                        //   pero se interpretaba como exito.
                        result = await sb.from('places').insert(payload).select();
                        break;
                    case 'place_update':
                        result = await sb.from('places').update(payload.data).eq('id', payload.id).select();
                        break;
                    case 'place_delete':
                        result = await sb.from('places').delete().eq('id', payload.id).select();
                        break;
                    case 'place_publish':
                        result = await sb.from('places').update({ status: 'published' }).eq('id', payload.id).select();
                        break;
                    case 'place_unpublish':
                        result = await sb.from('places').update({ status: 'draft' }).eq('id', payload.id).select();
                        break;
                    case 'profile_update':
                        result = await sb.from('profiles').update(payload.data).eq('id', payload.id).select();
                        break;
                    default:
                        return { ok: false, fatal: true, error: 'Tipo de operacion desconocida: ' + type };
                }
                if (result.error) {
                    // Errores de auth → reintentar; errores de validación → fatal
                    const msg = String(result.error.message || '');
                    const isAuth = msg.includes('JWT') || msg.includes('jwt') || msg.includes('401') ||
                                   msg.includes('expired') || msg.includes('not authenticated');
                    return { ok: false, fatal: !isAuth, error: msg };
                }
                // ★ FIX [v2.0.23] Detectar RLS silent denial: si la op afectó 0 filas
                //   y era un UPDATE/DELETE/PUBLISH, significa que el usuario no es
                //   dueño del local (RLS bloqueó silenciosamente). Tratar como fatal
                //   para no reintentar infinitamente.
                if (type !== 'place_insert' && type !== 'profile_update') {
                    const affected = Array.isArray(result.data) ? result.data.length : 0;
                    if (affected === 0) {
                        return {
                            ok: false,
                            fatal: true,
                            error: 'RLS: 0 filas afectadas. El local no te pertenece o fue borrado.'
                        };
                    }
                }
                // ★ FIX [sold_out-sync v2.0.31] Devolver tambien result.data para que
                //   los callers (processQueueNow y el handler execute-op del SW) puedan
                //   llamar upsertPublicPlaceInCache(result.data[0]) y sincronizar el
                //   cache publico compartido con la home (localStorage
                //   'sabormap_published_places_cache'). Sin esto, el camino
                //   offline/encolado NUNCA actualiza el localStorage compartido y el
                //   badge "Agotado" (y cualquier otro cambio) no se refleja en la home
                //   hasta el proximo loadPlacesFromSupabase() exitoso.
                return { ok: true, data: result.data };
            } catch (err) {
                // Errores de red → reintentar
                return { ok: false, fatal: false, error: err.message || String(err) };
            }        }

        /* Helper: ejecutar operación con encolado automático si offline */
        async function runOrQueue(type, payload, metadata) {
            if (navigator.onLine) {
                // Online: ejecutar directamente, encolar solo si falla por red
                const result = await executeOp({ type, payload });
                if (result.ok) return { queued: false, ok: true };
                if (!result.fatal) {
                    // Error recuperable: encolar para reintento
                    const opId = await enqueueOperation(type, payload, metadata);
                    return { queued: true, ok: false, opId, error: result.error };
                }
                return { queued: false, ok: false, error: result.error };
            } else {
                // Offline: encolar inmediatamente
                const opId = await enqueueOperation(type, payload, metadata);
                return { queued: true, ok: false, opId };
            }
        }
        window.runOrQueue = runOrQueue;

        function collectPlaceFormData() {
            // ★ [v2.0.34] Añadidos: lat, lng, gmaps_url, plus_code (todos opcionales).
            const fields = ['name','category','neighborhood','address','phone','description','price_range','schedule','must_order','editor_note','lat','lng','gmaps_url','plus_code'];
            const data = {};
            fields.forEach(f => { data[f] = (($('f-' + f) || {}).value || '').trim(); });
            data.tags = placeTags.slice();
            data.menu = JSON.parse(JSON.stringify(placeMenu));
            data.links = JSON.parse(JSON.stringify(placeLinks));
            return data;
        }
        let _autosaveTimer = null;
        let _hasUnsavedChanges = false;
        /* ★ FIX [v2.0.19]: autosave cada 1.5s en vez de 30s.
           El usuario reportó que perdía datos al editar. Con 30s de debounce,
           cualquier cambio en los últimos 30s se perdía si cerraba la pestaña
           o se iba el internet. Con 1.5s el draft se salva casi en tiempo real. */
        const AUTOSAVE_DEBOUNCE_MS = 1500;
        function scheduleAutosave() {
            _hasUnsavedChanges = true;
            clearTimeout(_autosaveTimer);
            updateDraftIndicator('saving');
            _autosaveTimer = setTimeout(async () => {
                await savePlaceDraft();
                _hasUnsavedChanges = false;
            }, AUTOSAVE_DEBOUNCE_MS);
        }
        /* Guardado síncrono de emergencia antes de cerrar/recargar la pestaña.
           localStorage.setItem es síncrono, así que sobrevive aunque el
           navegador mate la página de golpe. IndexedDB no lo es, así que
           también disparamos savePlaceDraft() (que ya hace localStorage). */
        window.addEventListener('beforeunload', () => {
            if (_hasUnsavedChanges) {
                try { savePlaceDraft(); } catch (e) {}
            }
        });
        /* `pagehide` es más confiable en iOS Safari que beforeunload. */
        window.addEventListener('pagehide', () => {
            if (_hasUnsavedChanges) {
                try { savePlaceDraft(); } catch (e) {}
                _hasUnsavedChanges = false;
            }
        });
        /* Cuando la conexión se cae, salvamos el draft inmediatamente
           para asegurar que todo lo escrito hasta ahora quede en localStorage. */
        window.addEventListener('offline', () => {
            if (_hasUnsavedChanges) {
                try { savePlaceDraft(); } catch (e) {}
            }
        });
        // Detectar cambios en el formulario
        document.addEventListener('DOMContentLoaded', () => {
            const form = $('placeForm');
            if (form) {
                form.addEventListener('input', scheduleAutosave);
                form.addEventListener('change', scheduleAutosave);
            }
        });

        /* ─── [F-2.1] Focus trap para modales ─── */
        const _modalState = { lastFocus: null, currentModal: null, handler: null };
        window.openModal = function(id) {
            const modal = $(id);
            if (!modal) return;
            _modalState.lastFocus = document.activeElement;
            _modalState.currentModal = modal;
            modal.classList.add('open');
            // Mover foco al primer input enfocable del modal
            const focusables = modal.querySelectorAll('input, select, textarea, button:not([disabled]), [tabindex="0"]');
            if (focusables.length) {
                setTimeout(() => focusables[0].focus(), 50);
            }
            // Focus trap + Esc
            _modalState.handler = (e) => {
                if (e.key === 'Escape') {
                    closeModal(id);
                } else if (e.key === 'Tab') {
                    const fs = modal.querySelectorAll('input, select, textarea, button:not([disabled]), [tabindex="0"]');
                    if (fs.length === 0) return;
                    const first = fs[0], last = fs[fs.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            };
            modal.addEventListener('keydown', _modalState.handler);
        };
        window.closeModal = function(id) {
            const modal = $(id);
            if (!modal) return;
            modal.classList.remove('open');
            if (_modalState.handler) {
                modal.removeEventListener('keydown', _modalState.handler);
                _modalState.handler = null;
            }
            // Restaurar foco
            if (_modalState.lastFocus && typeof _modalState.lastFocus.focus === 'function') {
                setTimeout(() => _modalState.lastFocus.focus(), 50);
            }
            _modalState.currentModal = null;
        };

        window.showToast = function(msg, isError) {
            const t = $('appToast');
            t.className = 'toast show' + (isError ? ' toast-error' : '');
            t.innerHTML = '<i aria-hidden="true" class="fas fa-' + (isError ? 'exclamation-circle' : 'check-circle') + '" style="color:' + (isError ? 'var(--red)' : 'var(--accent)') + '"></i> ' + escapeHtml(msg);
            clearTimeout(t._t);
            t._t = setTimeout(() => t.classList.remove('show'), 3500);
        };

        /* ─── [T-THEME] Toggle de tema claro/oscuro ─── */
        window.toggleDashboardTheme = function() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            try { localStorage.setItem('sabormap-dashboard-theme', next); } catch (e) {}
            // [T-11] Actualizar TODAS las meta theme-color
            document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
                m.setAttribute('content', next === 'dark' ? '#070912' : '#7c3aed');
            });
            // Re-renderizar tarjetas y tablas para que los iconos inline actualicen colores
            if (typeof renderOverview === 'function' && $('dashboardWrap') && $('dashboardWrap').classList.contains('visible')) {
                renderOverview();
                if (typeof renderMyPlaces === 'function') renderMyPlaces();
                if (isAdmin()) {
                    if (typeof renderAdminPlaces === 'function') renderAdminPlaces();
                }
            }
            showToast(next === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado');
        };

        function formatDate(d) {
            if (!d) return '—';
            return new Date(d).toLocaleDateString('es-CU', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
        }

        function getInitials(name) {
            return (name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        }

        function statusBadgeHTML(status) {
            const map = {
                published: ['Publicado','status-published'],
                draft: ['Borrador','status-draft'],
                pending: ['Pendiente','status-pending'],
                active: ['Activa','status-published'],
                inactive: ['Inactiva','status-draft'],
                cancelled: ['Cancelada','status-draft'],
                expired: ['Expirada','status-draft'],
                trial: ['Trial','status-pending']
            };
            const [label, cls] = map[status] || [status, 'status-draft'];
            return '<span class="status-badge ' + cls + '">' + label + '</span>';
        }

        function planBadgeHTML(plan) {
            return '<span class="plan-badge plan-' + (plan || 'free') + '">' + (plan || 'free') + '</span>';
        }

        function roleBadgeHTML(role) {
            return '<span class="role-badge role-' + (role || 'owner') + '">' + (role || 'owner') + '</span>';
        }

        /* ========================================
           AUTH: Toggle password
        ======================================== */
        window.togglePw = function(inputId, btn) {
            const input = $(inputId);
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        };

        /* ========================================
           AUTH: Show view (login/signup/forgot)
        ======================================== */
        window.showView = function(view) {
            $('loginView').style.display = 'none';
            $('signupView').style.display = 'none';
            $('forgotView').style.display = 'none';
            ['loginMessage','signupMessage','forgotMessage'].forEach(id => {
                const el = $(id);
                el.classList.remove('show','error','success');
            });
            const target = $(view + 'View');
            if (target) {
                target.style.display = 'block';
                target.style.animation = 'none';
                target.offsetHeight;
                target.style.animation = 'authSlideIn 0.4s cubic-bezier(0.22,1,0.36,1)';
            }
        };

        /* ========================================
           AUTH: Messages
        ======================================== */
        function showAuthMsg(id, type, text) {
            const el = $(id);
            el.className = 'auth-message show ' + type;
            el.querySelector('span').textContent = text;
        }

        /* ========================================
           AUTH: Password strength
        ======================================== */
        window.checkPwStrength = function(val) {
            const bars = [$('pwBar1'), $('pwBar2'), $('pwBar3'), $('pwBar4')];
            const txt = $('pwStrengthText');
            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
            if (/[0-9!@#$%^&*]/.test(val)) score++;
            const levels = ['','weak','medium','medium','strong'];
            const labels = ['','Débil','Regular','Buena','Fuerte'];
            const colors = ['','var(--red)','var(--amber)','var(--amber)','var(--green)'];
            bars.forEach((b, i) => { b.className = 'pw-strength-bar' + (i < score ? ' ' + levels[score] : ''); });
            txt.textContent = val.length > 0 ? (labels[score] || '') : '';
            txt.style.color = colors[score] || 'var(--muted)';
        };

        /* ========================================
           AUTH: Login
        ======================================== */
        window.handleLogin = async function(e) {
            e.preventDefault();
            const btn = $('loginBtn');
            btn.classList.add('loading');
            try {
                const { data, error } = await sb.auth.signInWithPassword({
                    email: $('loginEmail').value.trim(),
                    password: $('loginPassword').value
                });
                if (error) throw error;
                showAuthMsg('loginMessage', 'success', 'Inicio correcto. Redirigiendo...');
                // ★ FIX [v2.0.23] NO llamar enterDashboard() aquí.
                //   onAuthStateChange(SIGNED_IN) ya dispara enterDashboard().
                //   Tener dos llamadas concurrentes causaba que loadMyPlaces() se
                //   ejecutara dos veces y pisara el estado del dashboard justo
                //   cuando el usuario intentaba guardar.
            } catch (err) {
                showAuthMsg('loginMessage', 'error', err.message || 'Error al iniciar sesión');
            } finally { btn.classList.remove('loading'); }
        };

        /* ========================================
           AUTH: Signup
        ======================================== */
        window.handleSignup = async function(e) {
            e.preventDefault();
            const btn = $('signupBtn');
            btn.classList.add('loading');
            const pw = $('signupPassword').value;
            const confirm = $('signupConfirm').value;
            if (pw !== confirm) {
                showAuthMsg('signupMessage', 'error', 'Las contraseñas no coinciden');
                btn.classList.remove('loading');
                return;
            }
            // [F-3.3] Política de contraseñas robusta: mínimo 10 caracteres, 3 de 4 categorías
            if (pw.length < 10) {
                showAuthMsg('signupMessage', 'error', 'La contraseña debe tener al menos 10 caracteres');
                btn.classList.remove('loading');
                return;
            }
            const hasLower = /[a-z]/.test(pw);
            const hasUpper = /[A-Z]/.test(pw);
            const hasNumber = /[0-9]/.test(pw);
            const hasSymbol = /[^A-Za-z0-9]/.test(pw);
            const categories = (hasLower?1:0) + (hasUpper?1:0) + (hasNumber?1:0) + (hasSymbol?1:0);
            if (categories < 3) {
                showAuthMsg('signupMessage', 'error', 'La contraseña debe incluir al menos 3 de 4 categorías: minúsculas, mayúsculas, números y símbolos');
                btn.classList.remove('loading');
                return;
            }
            // [F-3.3] Rechazar contraseñas triviales
            const trivial = ['1234567890','password12','qwerty123','1111111111','0000000000','abcdefghij'];
            if (trivial.includes(pw.toLowerCase())) {
                showAuthMsg('signupMessage', 'error', 'Contraseña demasiado común. Elige una más segura');
                btn.classList.remove('loading');
                return;
            }
            try {
                const { data, error } = await sb.auth.signUp({
                    email: $('signupEmail').value.trim(),
                    password: pw,
                    options: { data: { full_name: $('signupName').value.trim() } }
                });
                if (error) throw error;
                showAuthMsg('signupMessage', 'success', 'Cuenta creada. Revisa tu email o inicia sesión directamente.');
            } catch (err) {
                // [F-5.4] Mensaje traducido y accionable
                const msg = (err.message || '').includes('User already registered')
                    ? 'Este email ya está registrado. Intenta iniciar sesión.'
                    : (err.message || 'Error al crear cuenta');
                showAuthMsg('signupMessage', 'error', msg);
            } finally { btn.classList.remove('loading'); }
        };

        /* ========================================
           AUTH: Forgot password
        ======================================== */
        window.handleForgotPassword = function(e) {
            e.preventDefault();
            showView('forgot');
        };

        window.handleForgotSubmit = async function(e) {
            e.preventDefault();
            const btn = $('forgotBtn');
            btn.classList.add('loading');
            try {
                const { error } = await sb.auth.resetPasswordForEmail($('forgotEmail').value.trim());
                if (error) throw error;
                showAuthMsg('forgotMessage', 'success', 'Si el email existe, enviamos un link de recuperacion.');
            } catch (err) {
                showAuthMsg('forgotMessage', 'error', err.message || 'Error al enviar email');
            } finally { btn.classList.remove('loading'); }
        };

        /* ========================================
           AUTH: Logout
        ======================================== */
        window.handleLogout = async function() {
            // ★ FIX [v2.0.9] — Logout optimista e instantáneo.
            // ★ FIX [v2.0.32] Ocultar botones flotantes de scroll del add-place
            //   para que no se queden flotando sobre la pantalla de login.
            // ★ FIX [v2.0.33] DESTRUIR (no solo ocultar) los botones flotantes
            //   para que se recreen desde cero en el proximo add-place tras
            //   login. Sin esto, tras logout+login los botones podrian no
            //   reaparecer si las variables _scrollDownBtn/_scrollUpBtn se
            //   desincronizaron del DOM.
            if (typeof destroyScrollButtons === 'function') destroyScrollButtons();
            else if (typeof hideScrollButtons === 'function') hideScrollButtons();
            const dashWrap = $('dashboardWrap');
            const authScreen = $('authScreen');
            if (dashWrap) dashWrap.classList.remove('visible');
            if (authScreen) authScreen.style.display = 'flex';
            try { showView('login'); } catch (e) {}
            currentUser = null; userProfile = null; userSubscription = null;
            myPlaces = []; allPlaces = []; allProfiles = []; allSubs = []; allLogs = [];
            // ★ FIX [v2.0.23] Limpiar ops huérfanas de sesiones anteriores.
            try { await clearOpsForCurrentUser(); } catch (e) {}
            const badge = $('pendingOpsBadge');
            if (badge) badge.style.display = 'none';
            const banner = $('pendingBanner');
            if (banner) banner.style.display = 'none';
            if (typeof _processingQueue !== 'undefined') _processingQueue = false;
            try { await sb.auth.signOut({ scope: 'local' }); } catch (e) {}
            (async () => {
                try {
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('signOut timeout')), 5000));
                    await Promise.race([sb.auth.signOut({ scope: 'global' }), timeoutPromise]);
                } catch (err) { console.warn('[Logout] No se pudo revocar token (no crítico):', err.message || err); }
            })();
            try { showToast('Sesión cerrada correctamente'); } catch (e) {}
        };

        /* ========================================
           DASHBOARD: Entrar
        ======================================== */
        async function enterDashboard() {
            const { data: { session } } = await sb.auth.getSession();
            if (!session) return;
            currentUser = session.user;

            // [F-4.2] Paralelizar consultas independientes (profile + subscription) en un único RTT
            const [profileRes, subRes] = await Promise.all([
                sb.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
                sb.from('subscriptions').select('*')
                    .eq('user_id', currentUser.id).in('status', ['active', 'trial'])
                    .order('created_at', { ascending: false }).limit(1).maybeSingle()
            ]);

            if (profileRes.error) console.warn('profile fetch error:', profileRes.error);
            userProfile = profileRes.data || {
                id: currentUser.id,
                full_name: (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email,
                email: currentUser.email,
                role: 'owner',
                phone: ''
            };

            if (subRes.error) console.warn('subscription fetch error:', subRes.error);
            userSubscription = subRes.data || { plan: 'free', status: 'active', max_places: 1 };

            // Sidebar
            const avatar = $('sidebarAvatar');
            const initials = getInitials(userProfile.full_name || currentUser.email);
            avatar.textContent = initials;
            $('sidebarUserName').textContent = userProfile.full_name || currentUser.email;
            $('sidebarUserRole').textContent = 'Dueño de locales';
            $('sidebarUserRole').className = 'sidebar-user-role';
            avatar.className = 'sidebar-avatar';

            if (userProfile.role === 'admin') {
                $('sidebarUserRole').textContent = 'Administrador';
                $('sidebarUserRole').classList.add('admin-role');
                avatar.classList.add('admin-avatar');
                avatar.innerHTML = initials + '<div class="admin-crown"><i aria-hidden="true" class="fas fa-crown"></i></div>';
                document.querySelectorAll('.admin-section').forEach(el => el.style.display = '');
            }

            // Mostrar dashboard
            $('authScreen').style.display = 'none';
            $('dashboardWrap').classList.add('visible');

            // Cargar datos
            await loadMyPlaces();
            renderOverview();

            // Cargar datos admin si corresponde
            if (userProfile.role === 'admin') {
                await loadAdminData();
            }

            // [F-5.1+] Inicializar badge de operaciones pendientes y procesar cola si hay conexión
            if (typeof updatePendingBadge === 'function') {
                updatePendingBadge();
                // Si hay conexión al entrar al dashboard y hay ops pendientes, procesar
                if (navigator.onLine) {
                    getPendingOps().then(ops => {
                        const pending = ops.filter(o => o.status === 'pending' || o.status === 'retry');
                        if (pending.length > 0) {
                            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                                navigator.serviceWorker.ready.then(reg => {
                                    return reg.sync.register('sabormap-sync-queue');
                                }).catch(() => processQueueNow());
                            } else {
                                processQueueNow();
                            }
                        }
                    });
                }
            }
        }

        /* ========================================
           LOCALES: Cargar
        ======================================== */
        async function loadMyPlaces() {
            let query;
            if (userProfile && userProfile.role === 'admin') {
                query = sb.from('places').select('*').order('created_at', { ascending: false });
            } else {
                query = sb.from('places').select('*').eq('owner_id', currentUser.id).order('created_at', { ascending: false });
            }
            const { data, error } = await query;
            if (error) { console.error(error); myPlaces = []; return; }
            myPlaces = data || [];
            $('placesCount').textContent = myPlaces.length;
        }

        /* ========================================
           LOCALES: Card HTML
        ======================================== */
        function placeCardHTML(p) {
            // [F-3.1] XSS: todos los datos del usuario se escapan antes de concatenar
            const img = (p.images && p.images.length > 0) ? p.images[0] : '';
            const statusClass = p.status === 'published' ? 'status-published' : p.status === 'pending' ? 'status-pending' : 'status-draft';
            const statusLabel = p.status === 'published' ? 'Publicado' : p.status === 'pending' ? 'Pendiente' : 'Borrador';
            const safeName = escapeHtml(p.name || 'Sin nombre');
            const safeCategory = escapeHtml(p.category || '');
            const safeNeighborhood = escapeHtml(p.neighborhood || '');
            const safeAddress = escapeHtml(p.address || '');
            const safePlusCode = escapeHtml(getPlusCode(p));
            const safeId = escapeHtml(p.id);
            const safeImg = escapeHtml(img);
            const imgHTML = img
                ? '<img class="my-place-card-img" src="' + safeImg + '" alt="Imagen del local ' + safeName + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'">'
                : '<div class="my-place-card-img" style="background:var(--card-hover);display:flex;align-items:center;justify-content:center"><i aria-hidden="true" class="fas fa-image" style="font-size:2rem;color:var(--border)"></i></div>';
            return '<div class="my-place-card">' +
                imgHTML +
                '<div class="my-place-card-body">' +
                    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' +
                        '<span class="cat-indicator ' + safeCategory + '"></span>' +
                        '<span style="font-size:0.75rem;color:var(--muted);text-transform:capitalize">' + safeCategory + '</span>' +
                        '<span class="status-badge ' + statusClass + '" style="margin-left:auto">' + statusLabel + '</span>' +
                    '</div>' +
                    '<h4 style="font-size:1.05rem;font-weight:700;margin-bottom:6px">' + safeName + '</h4>' +
                    '<p style="font-size:0.82rem;color:var(--muted);margin-bottom:4px">' + safeNeighborhood + (safeAddress ? ' — ' + safeAddress : '') + '</p>' +
                    (safePlusCode ? '<p style="font-size:0.78rem;color:var(--secondary);margin-bottom:14px;font-family:monospace;letter-spacing:0.03em"><i aria-hidden="true" class="fas fa-location-crosshairs" style="margin-right:4px;font-size:0.7rem"></i>' + safePlusCode + ' La Habana</p>' : '<div style="margin-bottom:14px"></div>') +
                    '<div style="display:flex;gap:8px">' +
                        '<button class="btn-secondary btn-sm" aria-label="Editar local ' + safeName + '" onclick="editPlace(\'' + safeId + '\')"><i aria-hidden="true" class="fas fa-edit"></i> Editar</button>' +
                        '<button class="btn-danger btn-sm" aria-label="Eliminar local ' + safeName + '" onclick="deletePlace(\'' + safeId + '\')"><i aria-hidden="true" class="fas fa-trash"></i></button>' +
                        (p.status !== 'published' ? '<button class="btn-success btn-sm" aria-label="Publicar local ' + safeName + '" onclick="publishPlace(\'' + safeId + '\')"><i aria-hidden="true" class="fas fa-eye"></i> Publicar</button>' : '') +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        /* ========================================
           OVERVIEW: Renderizar
        ======================================== */
        function renderOverview() {
            $('welcomeTitle').textContent = 'Bienvenido, ' + (userProfile.full_name || 'Usuario');
            const places = myPlaces;
            const published = places.filter(p => p.status === 'published').length;
            const draft = places.filter(p => p.status !== 'published').length;

            $('statsGrid').innerHTML =
                '<div class="stat-card"><div class="stat-card-glow" style="background:var(--accent-glow)"></div><div class="stat-icon" style="background:rgba(139,92,246,0.12);color:var(--accent)"><i aria-hidden="true" class="fas fa-store"></i></div><div class="stat-value">' + places.length + '</div><div class="stat-label">Total Locales</div></div>' +
                '<div class="stat-card"><div class="stat-card-glow" style="background:rgba(34,197,94,0.2)"></div><div class="stat-icon" style="background:rgba(34,197,94,0.12);color:var(--green)"><i aria-hidden="true" class="fas fa-check-circle"></i></div><div class="stat-value">' + published + '</div><div class="stat-label">Publicados</div></div>' +
                '<div class="stat-card"><div class="stat-card-glow" style="background:rgba(245,158,11,0.2)"></div><div class="stat-icon" style="background:rgba(245,158,11,0.12);color:var(--amber)"><i aria-hidden="true" class="fas fa-pencil-alt"></i></div><div class="stat-value">' + draft + '</div><div class="stat-label">Borradores</div></div>' +
                '<div class="stat-card"><div class="stat-card-glow" style="background:var(--secondary-glow)"></div><div class="stat-icon" style="background:rgba(6,182,212,0.12);color:var(--secondary)"><i aria-hidden="true" class="fas fa-' + (userSubscription.plan === 'free' ? 'box-open' : 'gem') + '"></i></div><div class="stat-value" style="text-transform:capitalize;font-size:1.4rem">' + userSubscription.plan + '</div><div class="stat-label">Plan Actual</div></div>';

            const container = $('overviewPlaces');
            if (places.length === 0) {
                container.innerHTML = '<div class="empty-state"><i aria-hidden="true" class="fas fa-store-slash"></i><h3>Sin locales aun</h3><p>Agrega tu primer local para comenzar.</p></div>';
            } else {
                container.innerHTML = places.slice(0, 4).map(p => placeCardHTML(p)).join('');
            }
        }

        /* ========================================
           MIS LOCALES: Renderizar
        ======================================== */
        function renderMyPlaces() {
            const grid = $('myPlacesGrid');
            const empty = $('myPlacesEmpty');
            if (myPlaces.length === 0) {
                grid.innerHTML = '';
                empty.style.display = 'block';
            } else {
                empty.style.display = 'none';
                grid.innerHTML = myPlaces.map(p => placeCardHTML(p)).join('');
            }
        }

        /* ========================================
           PANELS: Switch
        ======================================== */
        window.switchPanel = function(panelId, linkEl) {
            // [F-CAMBIO-SOLICITADO / F-3.6] Bloquear paneles admin para usuarios no-admin
            if (panelId && panelId.indexOf('admin-') === 0) {
                if (!isAdmin()) {
                    showToast('Acceso denegado: el panel de administración solo está disponible para administradores', true);
                    // Redirigir a overview si el usuario intenta acceder a panel admin
                    return switchPanel('overview', document.querySelector('[data-panel=overview]'));
                }
            }
            /* ★ v2.0.28: Ocultar el botón flotante si salimos del add-place. */
            if (panelId !== 'add-place') {
                if (_scrollDownBtn) _scrollDownBtn.classList.remove('visible');
                if (_scrollUpBtn) _scrollUpBtn.classList.remove('visible');
            }
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            const panel = $('panel-' + panelId);
            if (panel) panel.classList.add('active');
            if (linkEl) {
                linkEl.classList.add('active');
                // [F-2.3] aria-current para el enlace activo
                document.querySelectorAll('.sidebar-link').forEach(l => l.removeAttribute('aria-current'));
                linkEl.setAttribute('aria-current', 'page');
            }

            const titles = {
                'overview':'Resumen','my-places':'Mis Locales','add-place': editingPlaceId ? 'Editar Local' : 'Agregar Local',
                'admin-places':'Todos los Locales','admin-subs':'Suscripciones','admin-users':'Usuarios',
                'admin-log':'Historial de Pagos','admin-collections':'Colecciones','settings':'Configuración'
            };
            $('panelTitle').textContent = titles[panelId] || 'Panel';

            if (panelId === 'my-places') renderMyPlaces();
            if (panelId === 'overview') renderOverview();
            if (panelId === 'add-place' && !editingPlaceId) resetPlaceForm();
            if (panelId === 'add-place') {
                /* ★ v2.0.30: Inicializar los botones flotantes de scroll (↓ final, ↑ inicio). */
                /* ★ v2.0.32 FIX: forzar 'visible' tras crearlos, porque setupScrollButtons
                   ahora los crea ocultos para evitar que se queden en la pantalla de login. */
                setTimeout(function() {
                    if (typeof setupScrollButtons === 'function') setupScrollButtons();
                    if (_scrollDownBtn) _scrollDownBtn.classList.add('visible');
                    if (_scrollUpBtn)   _scrollUpBtn.classList.add('visible');
                }, 100);
            } else {
                /* Si NO estamos en add-place, ocultar los botones flotantes. */
                if (typeof hideScrollButtons === 'function') hideScrollButtons();
            }
            if (panelId === 'admin-places') renderAdminPlaces();
            if (panelId === 'admin-subs') renderAdminSubs();
            if (panelId === 'admin-users') renderAdminUsers();
            if (panelId === 'admin-log') renderAdminLog();
            if (panelId === 'admin-collections') renderAdminCollections();
            if (panelId === 'settings') renderSettings();

            if (window.innerWidth <= 1024) {
                $('sidebar').classList.remove('open');
                $('sidebarOverlay').classList.remove('show');
            }
        };

        window.toggleSidebar = function() {
            $('sidebar').classList.toggle('open');
            $('sidebarOverlay').classList.toggle('show');
        };

        /* ════════════════════════════════════════════════════════════════
           [v2.0.34] UBICACIÓN (Google Maps) — helper link dinámico
           ───────────────────────────────────────────────────────────────
           El anchor `#f-gmaps-helper` se actualiza en vivo cuando el
           dueño escribe en #f-gmaps_url, #f-lat o #f-lng. Así puede
           verificar la ubicación antes de publicar.

           Prioridad para construir el href:
             1) Si #f-gmaps_url no está vacío → usarlo tal cual.
             2) Si #f-lat y #f-lng son numéricos → maps?q=lat,lng
             3) Si hay un name + address cargados en el form → maps?q=name, address
             4) Default → https://www.google.com/maps (buscador vacío)
           
           No llama a Supabase, no rompe el autosave, no es required.
           ════════════════════════════════════════════════════════════════ */
        function updateGmapsHelperHref() {
            const link = $('f-gmaps-helper');
            if (!link) return;
            const url = (($('f-gmaps_url') || {}).value || '').trim();
            const lat = (($('f-lat') || {}).value || '').trim();
            const lng = (($('f-lng') || {}).value || '').trim();
            const name = (($('f-name') || {}).value || '').trim();
            const address = (($('f-address') || {}).value || '').trim();

            let href;
            if (url) {
                // URL completa: la usamos tal cual (validamos que empiece con http).
                href = /^https?:\/\//i.test(url) ? url : 'https://' + url;
            } else if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
                href = 'https://www.google.com/maps?q=' + encodeURIComponent(parseFloat(lat) + ',' + parseFloat(lng));
            } else if (name || address) {
                href = 'https://www.google.com/maps?q=' + encodeURIComponent((name + ' ' + address).trim());
            } else {
                href = 'https://www.google.com/maps';
            }
            link.setAttribute('href', href);
        }
        window.updateGmapsHelperHref = updateGmapsHelperHref;

        function initGmapsHelperListener() {
            // Si el form no está en el DOM todavía (raro), salir.
            const form = $('placeForm');
            if (!form) return;
            // Listener delegado: cualquier input de los 4 campos dispara
            // el refresh del helper link. También escuchamos name/address
            // porque son parte del fallback cuando no hay URL ni coords.
            ['f-gmaps_url','f-lat','f-lng','f-name','f-address'].forEach(id => {
                const el = $(id);
                if (el && !el.dataset.gmapsHelperBound) {
                    el.dataset.gmapsHelperBound = '1';
                    el.addEventListener('input', updateGmapsHelperHref);
                }
            });
        }

        /* ========================================
           PLACE FORM: Tags
        ======================================== */
        function initTags() {
            const input = $('tagInput');
            if (!input) return;
            input.addEventListener('keydown', function(e) {
                if ((e.key === 'Enter' || e.key === ',') && this.value.trim()) {
                    e.preventDefault();
                    addTag(this.value.trim().replace(/,/g, ''));
                    this.value = '';
                }
                if (e.key === 'Backspace' && !this.value && placeTags.length > 0) {
                    placeTags.pop();
                    renderTags();
                }
            });
        }

        function addTag(text) {
            if (placeTags.length >= 10) { showToast('Maximo 10 etiquetas', true); return; }
            if (placeTags.includes(text.toLowerCase())) return;
            placeTags.push(text.toLowerCase());
            renderTags();
        }

        function removeTag(idx) {
            placeTags.splice(idx, 1);
            renderTags();
        }

        function renderTags() {
            const wrapper = $('tagWrapper');
            const input = $('tagInput');
            // Remove existing chips
            wrapper.querySelectorAll('.tag-chip').forEach(c => c.remove());
            placeTags.forEach((tag, i) => {
                const chip = document.createElement('span');
                chip.className = 'tag-chip';
                chip.innerHTML = tag + ' <button type="button" onclick="removeTag(' + i + ')">&times;</button>';
                wrapper.insertBefore(chip, input);
            });
        }
        window.removeTag = removeTag;
        window.getTags = function() { return [...placeTags]; };
        window.renderTags = renderTags;

        /* ========================================
           PLACE FORM: Images
        ======================================== */
        function initImageGrid() {
            const grid = $('imageGrid');
            if (!grid) return;
            grid.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const slot = document.createElement('div');
                slot.className = 'image-upload-slot' + (placeImages[i] ? ' has-image' : '');
                slot.dataset.index = i;
                if (placeImages[i]) {
                    const url = typeof placeImages[i] === 'string' ? placeImages[i] : URL.createObjectURL(placeImages[i]);
                    slot.innerHTML = '<img src="' + url + '" alt="img">' +
                        '<div class="img-overlay"><button class="img-delete" onclick="removeImage(' + i + ')"><i aria-hidden="true" class="fas fa-trash"></i></button></div>';
                } else {
                    slot.innerHTML = '<i aria-hidden="true" class="fas fa-plus"></i><span>Subir</span>';
                    slot.onclick = function() { $('hiddenImageInput').dataset.index = i; $('hiddenImageInput').click(); };
                }
                grid.appendChild(slot);
            }
            // Hidden file input
            let hidden = $('hiddenImageInput');
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'file';
                hidden.id = 'hiddenImageInput';
                hidden.accept = 'image/*';
                hidden.style.display = 'none';
                hidden.addEventListener('change', handleImageSelect);
                document.body.appendChild(hidden);
            }
        }

        function handleImageSelect(e) {
            const file = e.target.files[0];
            if (!file) return;
            const idx = parseInt(e.target.dataset.index);
            placeImages[idx] = file;
            initImageGrid();
            e.target.value = '';
        }

        function removeImage(idx) {
            placeImages[idx] = null;
            initImageGrid();
        }
        window.removeImage = removeImage;

        /* ========================================
           PLACE FORM: Carta / Menu  (jsonb: [{category, items:[{name,desc,price}]}])
        ======================================== */
        let placeMenu = [];   // estado en memoria mientras se edita

        function renderMenuEditor() {
            const container = $('menuContainer');
            if (!container) return;
            if (!placeMenu.length) {
                container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:0.85rem"><i aria-hidden="true" class="fas fa-book-open" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:0.4"></i>Aún no agregaste categorías a la carta.</div>';
                /* ★ v2.0.25: ocultar nav si no hay categorías. */
                renderMenuCatNav();
                return;
            }
            /* ★ v2.0.25: renderizar la barra de navegación de categorías.
               Se llama antes de pintar las categorías para que los chips
               estén listos cuando el usuario empiece a hacer scroll. */
            renderMenuCatNav();
            container.innerHTML = placeMenu.map((cat, ci) => {
                const items = (cat.items || []).map((it, ii) => `
                    <div class="menu-item-row" data-menu-row>
                        <input type="text" class="form-input" placeholder="Nombre del plato" value="${escapeAttr(it.name||'')}" oninput="updateMenuItem(${ci},${ii},'name',this.value)" aria-label="Nombre del plato">
                        <input type="text" class="form-input" placeholder="Descripción" value="${escapeAttr(it.desc||'')}" oninput="updateMenuItem(${ci},${ii},'desc',this.value)" aria-label="Descripción del plato">
                        <input type="text" class="form-input" inputmode="decimal" placeholder="350" value="${escapeAttr(it.price||'')}" oninput="updateMenuItem(${ci},${ii},'price',this.value)" aria-label="Precio">
                        <select class="form-select" onchange="updateMenuItem(${ci},${ii},'currency',this.value)" aria-label="Moneda">
                            <option value="CUP" ${it.currency!=='MLC'&&it.currency!=='USD'&&it.currency!=='EUR'?'selected':''}>CUP</option>
                            <option value="MLC" ${it.currency==='MLC'?'selected':''}>MLC</option>
                            <option value="USD" ${it.currency==='USD'?'selected':''}>USD</option>
                            <option value="EUR" ${it.currency==='EUR'?'selected':''}>EUR</option>
                        </select>
                        <div class="menu-soldout-toggle-cell">
                            <label class="menu-soldout-toggle" title="Marcar como agotado">
                                <input type="checkbox" ${it.sold_out===true?'checked':''} onchange="toggleMenuItemSoldOut(${ci},${ii}, this.checked)" aria-label="Marcar plato como agotado">
                                <span class="menu-soldout-toggle-slider"></span>
                            </label>
                            <span class="menu-soldout-label ${it.sold_out===true?'on':''}">Agotado</span>
                        </div>
                        <button type="button" class="btn-icon" aria-label="Eliminar plato" onclick="removeMenuItem(${ci},${ii})" title="Eliminar plato"><i aria-hidden="true" class="fas fa-trash"></i></button>
                    </div>
                `).join('');
                /* ★ v2.0.25: id único por categoría para que el chip pueda
                   hacer scrollIntoView a ella.
                   ★ v2.0.26: --cat-color y --cat-glow en el style inline
                   para que el borde izquierdo coincida con el color del chip. */
                const _catCv = getMenuCatColorVars(ci);
                return `
                    <div class="menu-category" id="menu-cat-${ci}" data-cat-index="${ci}" style="--cat-color:${_catCv.color};--cat-glow:${_catCv.glow};">
                        <div class="menu-category-head">
                            <input type="text" class="form-input" placeholder="Nombre de la categoría (ej: Entradas)" value="${escapeAttr(cat.category||'')}" oninput="updateMenuCategory(${ci},this.value)" aria-label="Nombre de la categoría">
                            <button type="button" class="btn-icon" aria-label="Eliminar categoría" onclick="removeMenuCategory(${ci})" title="Eliminar categoría"><i aria-hidden="true" class="fas fa-times"></i></button>
                        </div>
                        <div class="menu-items">${items}</div>
                        <button type="button" class="menu-add-item-btn" onclick="addMenuItem(${ci})"><i aria-hidden="true" class="fas fa-plus" style="margin-right:4px"></i> Agregar plato</button>
                    </div>
                `;
            }).join('');
            /* ★ v2.0.25: después de renderizar las categorías, reconectar el
               IntersectionObserver para que resalte el chip activo al hacer
               scroll. Si el observer ya existía, se desconecta y se recrea. */
            setupMenuCatNavObserver();
        }

        /* ════════════════════════════════════════════════════════════════
           [v2.0.25] Barra de navegación de categorías del editor de carta.
           ────────────────────────────────────────────────────────────────
           - renderMenuCatNav(): pinta los chips a partir de placeMenu.
           - setupMenuCatNavObserver(): IntersectionObserver que resalta el
             chip de la categoría visible mientras el usuario hace scroll.
           - scrollToMenuCat(ci): click en chip → scroll suave a la categoría.
           - refreshMenuCatNavLabel(ci): actualiza el texto del chip cuando
             el usuario renombra la categoría (sin re-renderizar todo).
           ════════════════════════════════════════════════════════════════ */
        let _menuCatNavObserver = null;

        /* ★ v2.0.26: Paleta cíclica de colores para categorías.
           Es la MISMA paleta que usa app.js (MENU_SECTION_PALETTE) en la
           home pública. Así, si en la home la sección 0 de la carta es
           violeta, en el dashboard la categoría 0 también es violeta.
           Consistencia visual entre edición y publicación.

           Los 5 colores (violeta, cian, rosa, ámbar, verde) se ciclan
           por índice: cat 0 → violeta, cat 1 → cian, cat 2 → rosa,
           cat 3 → ámbar, cat 4 → verde, cat 5 → violeta otra vez, etc.

           ★ NO se guarda en la BD ni en el draft. Es puramente visual,
             calculado en runtime a partir del índice. */
        const MENU_CAT_PALETTE = [
            { color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)' },   // violeta (accent)
            { color: '#06b6d4', glow: 'rgba(6,182,212,0.25)' },    // cian (secondary)
            { color: '#ec4899', glow: 'rgba(236,72,153,0.25)' },   // rosa (pink)
            { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },   // ámbar (amber)
            { color: '#22c55e', glow: 'rgba(34,197,94,0.25)' }     // verde (green)
        ];
        function getMenuCatColorVars(index) {
            const idx = ((index % MENU_CAT_PALETTE.length) + MENU_CAT_PALETTE.length) % MENU_CAT_PALETTE.length;
            const entry = MENU_CAT_PALETTE[idx];
            /* Convertir color hex a rgba con alpha 0.12 (bg) y 0.35 (border). */
            const r = parseInt(entry.color.slice(1, 3), 16);
            const g = parseInt(entry.color.slice(3, 5), 16);
            const b = parseInt(entry.color.slice(5, 7), 16);
            return {
                color: entry.color,
                glow: entry.glow,
                bg: `rgba(${r},${g},${b},0.10)`,
                bgHover: `rgba(${r},${g},${b},0.18)`,
                bgActive: `linear-gradient(135deg, rgba(${r},${g},${b},0.20), rgba(${r},${g},${b},0.08))`,
                border: `rgba(${r},${g},${b},0.35)`,
                countBg: `rgba(${r},${g},${b},0.15)`,
                countColor: entry.color
            };
        }
        window.getMenuCatColorVars = getMenuCatColorVars;

        function renderMenuCatNav() {
            const nav = document.getElementById('menuCatNav');
            if (!nav) return;
            const cats = placeMenu || [];
            /* Solo mostrar la nav si hay 2+ categorías. Con 1 sola, no
               aporta valor y ocupa espacio vertical. */
            if (cats.length < 2) {
                nav.classList.add('menu-cat-nav-empty');
                nav.innerHTML = '';
                /* Desconectar observer si existía. */
                if (_menuCatNavObserver) {
                    _menuCatNavObserver.disconnect();
                    _menuCatNavObserver = null;
                }
                return;
            }
            nav.classList.remove('menu-cat-nav-empty');
            nav.innerHTML = cats.map((cat, ci) => {
                const name = (cat.category || '').trim();
                const display = name || 'Categoría ' + (ci + 1);
                const count = (cat.items || []).length;
                const emptyClass = name ? '' : 'menu-cat-chip-empty';
                /* ★ v2.0.26: inyectar CSS variables con el color de esta categoría. */
                const cv = getMenuCatColorVars(ci);
                const styleVars = `--chip-color:${cv.color};--chip-bg:${cv.bg};--chip-bg-hover:${cv.bgHover};--chip-bg-active:${cv.bgActive};--chip-border:${cv.border};--chip-glow:${cv.glow};--chip-count-bg:${cv.countBg};--chip-count-color:${cv.countColor};`;
                return `<button type="button"
                        class="menu-cat-chip ${emptyClass}"
                        style="${styleVars}"
                        data-cat-index="${ci}"
                        onclick="scrollToMenuCat(${ci})"
                        role="tab"
                        aria-selected="false"
                        aria-controls="menu-cat-${ci}"
                        title="Ir a: ${escapeAttr(display)}">
                    <span>${escapeHtml(display)}</span>
                    <span class="menu-cat-chip-count">${count}</span>
                </button>`;
            }).join('');
            /* Conectar observer después de que el DOM pinte las categorías. */
            setTimeout(setupMenuCatNavObserver, 0);
        }

        /* ★ v2.0.30: Botones simples para subir y bajar el formulario.
           SIN detección de posición. Dos botones fijos, ambos visibles a la vez:
           - scroll-btn-down (↓): baja al FINAL ABSOLUTO del form (botón Publicar)
           - scroll-btn-up    (↑): sube al PRINCIPIO ABSOLUTO del form (título)
           Se muestran solo cuando el panel 'add-place' está activo.
           No hay listener de scroll, no hay lógica de toggle, no hay umbrales. */
        let _scrollDownBtn = null;
        let _scrollUpBtn = null;

        function setupScrollButtons() {
            /* ★ v2.0.33 FIX: verificar que los botones existen en el DOM,
               no solo que la variable no es null. Si por cualquier motivo
               el boton fue removido del DOM (logout, reload parcial, etc.),
               la variable sigue apuntando a un elemento huerfano y el
               `if (!_scrollDownBtn)` no recreaba. Ahora forzamos recreate. */
            if (_scrollDownBtn && !document.body.contains(_scrollDownBtn)) {
                _scrollDownBtn = null;
            }
            if (_scrollUpBtn && !document.body.contains(_scrollUpBtn)) {
                _scrollUpBtn = null;
            }
            /* Crear botón de bajar si no existe. */
            if (!_scrollDownBtn) {
                _scrollDownBtn = document.createElement('button');
                _scrollDownBtn.type = 'button';
                _scrollDownBtn.className = 'scroll-btn scroll-btn-down'; /* v2.0.32: sin 'visible', se añade solo en add-place */
                _scrollDownBtn.innerHTML = '<i aria-hidden="true" class="fas fa-chevron-down"></i>';
                _scrollDownBtn.title = 'Bajar al final del formulario';
                _scrollDownBtn.setAttribute('aria-label', 'Bajar al final del formulario');
                _scrollDownBtn.addEventListener('click', function() {
                    /* Final ABSOLUTO del formulario: el propio <form> con block:'end'. */
                    var form = document.getElementById('placeForm');
                    if (form) {
                        form.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    } else {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                });
                document.body.appendChild(_scrollDownBtn);
            }
            /* Crear botón de subir si no existe. */
            if (!_scrollUpBtn) {
                _scrollUpBtn = document.createElement('button');
                _scrollUpBtn.type = 'button';
                _scrollUpBtn.className = 'scroll-btn scroll-btn-up'; /* v2.0.32: sin 'visible', se añade solo en add-place */
                _scrollUpBtn.innerHTML = '<i aria-hidden="true" class="fas fa-chevron-up"></i>';
                _scrollUpBtn.title = 'Subir al principio del formulario';
                _scrollUpBtn.setAttribute('aria-label', 'Subir al principio del formulario');
                _scrollUpBtn.addEventListener('click', function() {
                    /* Principio ABSOLUTO del formulario: el propio <form> con block:'start'. */
                    var form = document.getElementById('placeForm');
                    if (form) {
                        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
                document.body.appendChild(_scrollUpBtn);
            }
            /* ★ v2.0.32 FIX: los botones se crean SIN la clase 'visible'.
               Se añaden 'visible' explicitamente desde switchPanel() solo
               cuando panelId === 'add-place'. Asi, si el usuario hace logout
               o la sesion expira mientras esta en add-place, los botones no
               se quedan flotando sobre la pantalla de login.
               No se necesita listener de scroll: se muestran solo en add-place
               y se ocultan en switchPanel() al salir, en handleLogout() y en
               showSessionExpiredModal(). */
        }
        /* Ocultar/mostrar los botones según el panel. Se llama desde switchPanel. */
        function hideScrollButtons() {
            if (_scrollDownBtn) _scrollDownBtn.classList.remove('visible');
            if (_scrollUpBtn)   _scrollUpBtn.classList.remove('visible');
        }
        /* ★ v2.0.33 FIX: destruir los botones del DOM y nullificar las
           variables. Se llama desde handleLogout() y showSessionExpiredModal()
           para forzar que setupScrollButtons() los recree desde cero en el
           proximo ingreso a add-place. Sin esto, tras logout+login los
           botones podrian no reaparecer si las variables se desincronizaron. */
        function destroyScrollButtons() {
            if (_scrollDownBtn) {
                try { _scrollDownBtn.remove(); } catch (e) {}
                _scrollDownBtn = null;
            }
            if (_scrollUpBtn) {
                try { _scrollUpBtn.remove(); } catch (e) {}
                _scrollUpBtn = null;
            }
        }
        window.setupScrollButtons = setupScrollButtons;
        window.hideScrollButtons = hideScrollButtons;
        window.destroyScrollButtons = destroyScrollButtons;
        window.renderMenuCatNav = renderMenuCatNav;

        function scrollToMenuCat(ci) {
            const target = document.getElementById('menu-cat-' + ci);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            /* Resaltar inmediatamente el chip clicado (el observer lo confirmará). */
            setActiveMenuCatChip(ci);
        }
        window.scrollToMenuCat = scrollToMenuCat;

        function setActiveMenuCatChip(ci) {
            const chips = document.querySelectorAll('.menu-cat-chip');
            chips.forEach(c => {
                const idx = parseInt(c.dataset.catIndex, 10);
                const active = idx === ci;
                c.classList.toggle('active', active);
                c.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            /* ★ v2.0.26: añadir clase is-visible a la categoría activa para
               activar el glow del borde izquierdo. Solo una categoría la
               tiene a la vez (la visible). */
            document.querySelectorAll('.menu-category').forEach(c => {
                const idx = parseInt(c.dataset.catIndex, 10);
                c.classList.toggle('is-visible', idx === ci);
            });
            /* Hacer scroll horizontal del chip activo si está fuera de vista. */
            const activeChip = document.querySelector('.menu-cat-chip.active');
            if (activeChip && activeChip.scrollIntoView) {
                activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
        window.setActiveMenuCatChip = setActiveMenuCatChip;

        function setupMenuCatNavObserver() {
            if (_menuCatNavObserver) {
                _menuCatNavObserver.disconnect();
            }
            const cats = document.querySelectorAll('#menuContainer .menu-category');
            if (!cats.length) return;
            if (!('IntersectionObserver' in window)) {
                /* Fallback: si el navegador no soporta IO, no resaltamos
                   automáticamente pero los chips siguen funcionando con click. */
                return;
            }
            _menuCatNavObserver = new IntersectionObserver((entries) => {
                /* Encontrar la entrada más alta que esté intersectando. */
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length === 0) return;
                const target = visible[0].target;
                const idx = parseInt(target.dataset.catIndex, 10);
                if (!isNaN(idx)) setActiveMenuCatChip(idx);
            }, {
                /* root es null (viewport) para que funcione en cualquier
                   contenedor scrollable. El rootMargin hace que el chip se
                   active cuando la categoría pasa los primeros 80px del
                   viewport (donde está la barra pegajosa). */
                root: null,
                rootMargin: '-80px 0px -60% 0px',
                threshold: 0
            });
            cats.forEach(c => _menuCatNavObserver.observe(c));
        }
        window.setupMenuCatNavObserver = setupMenuCatNavObserver;

        /* ★ v2.0.25: actualiza el texto del chip en vivo cuando el usuario
           renombra una categoría, sin re-renderizar todo el editor (lo que
           perdería el foco del input). */
        function refreshMenuCatNavLabel(ci) {
            const chip = document.querySelector('.menu-cat-chip[data-cat-index="' + ci + '"]');
            if (!chip) return;
            const cat = placeMenu[ci];
            if (!cat) return;
            const name = (cat.category || '').trim();
            const display = name || 'Categoría ' + (ci + 1);
            const span = chip.querySelector('span:first-child');
            if (span) span.textContent = display;
            chip.classList.toggle('menu-cat-chip-empty', !name);
            chip.setAttribute('title', 'Ir a: ' + display);
        }
        window.refreshMenuCatNavLabel = refreshMenuCatNavLabel;

        function escapeAttr(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

        window.addMenuCategory = function() {
            placeMenu.push({ category: '', items: [] });
            renderMenuEditor();
        };
        window.removeMenuCategory = function(ci) {
            placeMenu.splice(ci, 1);
            renderMenuEditor();
        };
        window.updateMenuCategory = function(ci, val) {
            if (!placeMenu[ci]) return;
            placeMenu[ci].category = val;
            /* ★ v2.0.25: actualizar el texto del chip en vivo sin
               re-renderizar todo el editor. */
            refreshMenuCatNavLabel(ci);
        };
        window.addMenuItem = function(ci) {
            if (!placeMenu[ci]) return;
            if (!placeMenu[ci].items) placeMenu[ci].items = [];
            placeMenu[ci].items.push({ name:'', desc:'', price:'', currency:'CUP' });
            renderMenuEditor();
        };
        window.updateMenuItem = function(ci, ii, field, val) {
            const cat = placeMenu[ci]; if (!cat || !cat.items[ii]) return;
            cat.items[ii][field] = val;
        };
        /* ★ v2.0.24: Toggle "Agotado" en un plato del menú.
           Cuando está activo, el plato se muestra tachado con badge
           "Agotado" en la home pública. No se borra, solo se marca. */
        window.toggleMenuItemSoldOut = function(ci, ii, soldOut) {
            const cat = placeMenu[ci]; if (!cat || !cat.items[ii]) return;
            cat.items[ii].sold_out = !!soldOut;
            /* Actualizar el label visual sin re-renderizar todo el editor. */
            const row = document.querySelector('.menu-item-row[data-menu-row="' + ci + '-' + ii + '"]');
            /* Como los rows no tienen data-menu-row con valor, buscar por posición. */
            const rows = document.querySelectorAll('#menuContainer .menu-item-row');
            /* No re-renderizamos para no perder el foco del toggle. El label
               se actualiza via CSS: el input:checked cambia el color del slider
               y el label se reestiliza desde JS. */
            const toggleCells = document.querySelectorAll('.menu-soldout-toggle-cell');
            /* Buscar la celda correcta por orden: ci*num_items_por_cat + ii.
               Es más simple recorrer todos y buscar el índice correcto. */
            let idx = 0;
            const cats = document.querySelectorAll('#menuContainer .menu-category');
            cats.forEach((c, cIdx) => {
                if (cIdx < ci) {
                    idx += c.querySelectorAll('.menu-item-row').length;
                }
            });
            idx += ii;
            const cell = toggleCells[idx];
            if (cell) {
                const label = cell.querySelector('.menu-soldout-label');
                if (label) {
                    label.classList.toggle('on', !!soldOut);
                    label.textContent = soldOut ? 'Agotado' : 'Disponible';
                }
            }
            /* Trigger autosave para que el draft se actualice al instante. */
            if (typeof scheduleAutosave === 'function') scheduleAutosave();
        };
        window.removeMenuItem = function(ci, ii) {
            const cat = placeMenu[ci]; if (!cat) return;
            cat.items.splice(ii, 1);
            renderMenuEditor();
        };

        /* ========================================
           PLACE FORM: Delivery / Links  (jsonb: [{platform,url,icon,cssClass}])
        ======================================== */
        let placeLinks = [];

        const LINK_PRESETS = {
            'PedidosYa':      { icon:'fa-motorcycle',     cssClass:'delivery-pedidosya' },
            'Rappi':          { icon:'fa-motorcycle',     cssClass:'delivery-rappi' },
            'Reservar Mesa':  { icon:'fa-calendar-check', cssClass:'delivery-reserva' },
            'WhatsApp':       { icon:'fa-whatsapp',       cssClass:'delivery-whatsapp' },
            'Otro':           { icon:'fa-link',            cssClass:'delivery-other' }
        };

        function renderLinksEditor() {
            const container = $('linksContainer');
            if (!container) return;
            if (!placeLinks.length) {
                container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:0.85rem"><i aria-hidden="true" class="fas fa-motorcycle" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:0.4"></i>Aún no agregaste links de delivery o reservas.</div>';
                return;
            }
            container.innerHTML = placeLinks.map((l, i) => {
                const platform = l.platform || '';
                const url = l.url || '';
                const preset = LINK_PRESETS[platform] || { icon:'fa-link', cssClass:'delivery-other' };
                return `
                    <div class="link-row">
                        <select class="form-select" onchange="updateLink(${i},'platform',this.value)">
                            ${['PedidosYa','Rappi','Reservar Mesa','WhatsApp','Otro'].map(p => `<option value="${p}" ${platform===p?'selected':''}>${p}</option>`).join('')}
                        </select>
                        <input type="url" class="form-input" placeholder="https://..." value="${escapeAttr(url)}" oninput="updateLink(${i},'url',this.value)">
                        <button type="button" class="btn-icon" onclick="removeLink(${i})" title="Eliminar"><i aria-hidden="true" class="fas fa-trash"></i></button>
                    </div>
                `;
            }).join('');
        }

        window.addLink = function() {
            placeLinks.push({ platform:'PedidosYa', url:'', icon:'fa-motorcycle', cssClass:'delivery-pedidosya' });
            renderLinksEditor();
        };
        window.removeLink = function(i) {
            placeLinks.splice(i, 1);
            renderLinksEditor();
        };
        window.updateLink = function(i, field, val) {
            const l = placeLinks[i]; if (!l) return;
            if (field === 'platform') {
                const preset = LINK_PRESETS[val] || { icon:'fa-link', cssClass:'delivery-other' };
                l.platform = val;
                l.icon = preset.icon;
                l.cssClass = preset.cssClass;
            } else {
                l[field] = val;
            }
        };

        /* ========================================
           PLACE FORM: Reset / Edit / Submit
        ======================================== */
        function resetPlaceForm() {
            $('placeForm').reset();
            $('editPlaceId').value = '';
            $('formTitle').textContent = 'Agregar Nuevo Local';
            $('placeSubmitText').textContent = 'Publicar Local';
            editingPlaceId = null;
            placeTags = [];
            placeImages = [];
            placeMenu = [];
            placeLinks = [];
            renderTags();
            initImageGrid();
            renderMenuEditor();
            renderLinksEditor();
            // ★ [v2.0.34] Resetear el helper link de Google Maps a su
            //   href por defecto. form.reset() NO dispara eventos 'input',
            //   así que sin esta llamada el link quedaría apuntando a la
            //   última URL cargada en modo edición.
            if (typeof updateGmapsHelperHref === 'function') updateGmapsHelperHref();
            // [v2.0.19] Ocultar indicador de draft al limpiar el form
            updateDraftIndicator('cleared');
            // [v2.0.22] Ocultar badge "Editando" y restaurar sidebar link
            updateEditingBadge();
            _hasUnsavedChanges = false;
        }

        /* ════════════════════════════════════════════════════════════════
           [v2.0.22] startNewPlace — botón "Agregar Local" / "Nuevo Local"
           ────────────────────────────────────────────────────────────────
           Cuando el usuario hace clic en "Agregar Local" del sidebar, o en
           "Nuevo Local" del top-bar, NO debe continuar editando el local
           que tenía cargado. Esta función:

             1. Si estaba editando un local y tiene cambios sin guardar,
                ofrece guardarlos como draft antes de salir.
             2. Limpia editingPlaceId → vuelve a modo "Agregar Local".
             3. Resetea el form.
             4. Cambia al panel add-place.

           Antes de este fix, el usuario hacía clic en "Agregar Local" y
           el form seguía mostrando los datos del local que estaba editando
           (porque switchPanel NO resetea si editingPlaceId != null). */
        window.startNewPlace = function() {
            if (editingPlaceId) {
                /* Estaba editando — ofrecer guardar como draft antes de salir. */
                if (_hasUnsavedChanges) {
                    const ok = confirm(
                        'Estabas editando un local y tienes cambios sin guardar.\n\n' +
                        '¿Guardar como borrador antes de crear un local nuevo?\n\n' +
                        '(Si dices No, los cambios se pierden)'
                    );
                    if (ok) {
                        try { savePlaceDraft(); } catch (e) {}
                        showToast('Borrador guardado del local anterior');
                    }
                }
                editingPlaceId = null;
                $('editPlaceId').value = '';
            }
            resetPlaceForm();
            switchPanel('add-place', document.querySelector('[data-panel=add-place]'));
        };

        window.editPlace = async function(id) {
            const place = myPlaces.find(p => p.id === id);
            if (!place) return;
            editingPlaceId = id;
            $('editPlaceId').value = id;
            $('formTitle').textContent = 'Editar Local';
            $('placeSubmitText').textContent = place.status === 'published' ? 'Actualizar Publicado' : 'Publicar Local';

            // ★ [v2.0.34] Añadidos: lat, lng, gmaps_url, plus_code.
            //   Como son opcionales, place[f] puede ser undefined; el `|| ''`
            //   los deja vacíos en el input. La columna gmaps_url puede no
            //   existir aún en Supabase; en ese caso place.gmaps_url es
            //   undefined y el input queda vacío (sin error).
            const fields = ['name','category','neighborhood','address','phone','description','price_range','schedule','must_order','editor_note','lat','lng','gmaps_url','plus_code'];
            fields.forEach(f => { const el = $('f-' + f); if (el && place[f] !== undefined) el.value = place[f] || ''; });
            // Forzar refresh del helper link ahora que ya tenemos los datos cargados.
            if (typeof updateGmapsHelperHref === 'function') updateGmapsHelperHref();

            placeTags = place.tags ? [...place.tags] : [];
            placeImages = place.images ? [...place.images] : [];
            // menu y links vienen como arrays desde jsonb
            placeMenu  = Array.isArray(place.menu)  ? JSON.parse(JSON.stringify(place.menu))  : [];
            placeLinks = Array.isArray(place.links) ? JSON.parse(JSON.stringify(place.links)) : [];
            renderTags();
            initImageGrid();
            renderMenuEditor();
            renderLinksEditor();

            /* ★ [v2.0.22] Mostrar el badge "Editando: nombre" y cambiar el
               sidebar link a "Editar Local" para que el usuario sepa
               claramente que está EDITANDO, no creando. */
            updateEditingBadge();

            /* ★ [v2.0.22] ANTES de cambiar al panel add-place, verificar si
               hay un draft guardado MÁS RECIENTE que los datos del servidor
               para este local. Si lo hay, preguntar si restaurarlo (esto
               soluciona el bug de perder cambios al editar: si el usuario
               editó antes y NO publicó, el draft tiene sus cambios no
               guardados y ahora se los respetamos en vez de pisarlos con
               los datos viejos del servidor). */
            try {
                const draft = await loadPlaceDraft();
                if (draft && draft.savedAt) {
                    const draftTime = new Date(draft.savedAt).getTime();
                    const placeTime = place.updated_at
                        ? new Date(place.updated_at).getTime()
                        : (place.created_at ? new Date(place.created_at).getTime() : 0);
                    /* Si el draft es más reciente que el último update del
                       servidor (o el servidor no tiene updated_at), ofrecer
                       restaurar. Una diferencia de 60s evita falsos positivos
                       por clock skew entre cliente y servidor. */
                    if (draftTime > placeTime + 60000) {
                        const draftLocal = new Date(draft.savedAt).toLocaleString('es-CU', {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        });
                        const ok = confirm(
                            'Tienes un borrador guardado de este local MÁS RECIENTE que los datos del servidor\n' +
                            '(guardado el ' + draftLocal + ').\n\n' +
                            '¿Quieres recuperar tu borrador con los cambios no publicados?\n\n' +
                            '(Si dices No, se cargan los datos actuales del servidor.)'
                        );
                        if (ok) {
                            /* Restaurar el draft (igual que handleLoadDraft pero
                               sin preguntar de nuevo). */
                            fields.forEach(f => {
                                const el = $('f-' + f);
                                if (el && draft[f] !== undefined) el.value = draft[f];
                            });
                            placeTags = Array.isArray(draft.tags) ? draft.tags.slice() : [];
                            placeMenu = Array.isArray(draft.menu) ? JSON.parse(JSON.stringify(draft.menu)) : [];
                            placeLinks = Array.isArray(draft.links) ? JSON.parse(JSON.stringify(draft.links)) : [];
                            if (Array.isArray(draft.imageMeta)) {
                                placeImages = draft.imageMeta
                                    .filter(m => m && m.kind === 'url')
                                    .map(m => m.url);
                                const lostFiles = draft.imageMeta.filter(m => m && m.kind === 'file');
                                if (lostFiles.length > 0) {
                                    setTimeout(() => showToast('Se perdieron ' + lostFiles.length + ' imagen(es) no subidas del borrador. Vuelve a subirlas.', true), 1200);
                                }
                            }
                            renderTags();
                            initImageGrid();
                            renderMenuEditor();
                            renderLinksEditor();
                            // ★ [v2.0.34] Refresh del helper link: el draft
                            //   acaba de pisar los datos del servidor, así que
                            //   el href del botón "Abrir en Google Maps" tiene
                            //   que recalcularse con los nuevos valores.
                            if (typeof updateGmapsHelperHref === 'function') updateGmapsHelperHref();
                            _hasUnsavedChanges = false;
                            updateDraftIndicator('saved');
                            showToast('Borrador recuperado (más reciente que el servidor)');
                        } else {
                            /* El usuario eligió NO restaurar. Como los datos
                               del servidor ya están cargados, eliminamos el
                               draft viejo para que no vuelva a molestar. */
                            try {
                                await clearPlaceDraft();
                            } catch (e) {}
                            _hasUnsavedChanges = false;
                        }
                    }
                }
            } catch (draftErr) {
                console.warn('[editPlace] Error verificando draft:', draftErr);
            }

            switchPanel('add-place', document.querySelector('[data-panel=add-place]'));
        };

        window.deletePlace = async function(id) {
            if (!confirm('Seguro que quieres eliminar este local? Esta acción no se puede deshacer.')) return;
            // [F-5.1+] Usar encolador: si offline, se ejecutará cuando vuelva la conexión
            const place = myPlaces.find(p => String(p.id) === String(id));
            const placeName = place ? place.name : '(local)';
            const result = await runOrQueue('place_delete', { id: id }, { placeName: placeName });
            if (result.queued) {
                showToast('Sin conexión. Eliminación encolada — se ejecutará cuando vuelva el internet');
            } else if (result.ok) {
                showToast('Local eliminado correctamente');
            } else {
                showToast('Error al eliminar: ' + result.error, true);
                return;
            }
            // ★ [v2.0.21] Quitar del cache público compartido con la home,
            //   tanto si se eliminó del servidor como si quedó encolado
            //   (en cuyo caso cuando se procese la cola, ya no estará en
            //   Supabase y la próxima carga de la home lo quitará).
            removePublicPlaceFromCache(id);
            // Optimistic UI: quitar del array local
            myPlaces = myPlaces.filter(p => String(p.id) !== String(id));
            renderOverview();
            if (typeof renderMyPlaces === 'function') renderMyPlaces();
            $('placesCount').textContent = myPlaces.length;
            // Recargar datos reales si hay conexión (para confirmar)
            if (navigator.onLine) {
                await loadMyPlaces();
                renderOverview();
            }
        };

        window.publishPlace = async function(id) {
            // [F-5.1+] Usar encolador para publicar local
            const place = myPlaces.find(p => String(p.id) === String(id));
            const placeName = place ? place.name : '(local)';
            const result = await runOrQueue('place_publish', { id: id }, { placeName: placeName });
            if (result.queued) {
                showToast('Sin conexión. Publicación encolada');
            } else if (result.ok) {
                showToast('Local publicado');
            } else {
                showToast('Error al publicar: ' + result.error, true);
                return;
            }
            // Optimistic UI: marcar como publicado en memoria
            const p = myPlaces.find(p => String(p.id) === String(id));
            if (p) p.status = 'published';
            // ★ [v2.0.21] Agregar al cache público compartido con la home.
            //   Como el publishPlace solo cambia status a 'published' (no
            //   reenvía todos los datos), usamos el registro que ya tenemos
            //   en myPlaces y lo convertimos al formato Supabase.
            if (p) {
                try {
                    const dbPlace = dashboardDataToSupabaseFormat(p, p.id);
                    dbPlace.status = 'published';
                    upsertPublicPlaceInCache(dbPlace);
                } catch (e) { /* no crítico */ }
            }
            renderOverview();
            if (typeof renderMyPlaces === 'function') renderMyPlaces();
            if (navigator.onLine) {
                await loadMyPlaces();
                renderOverview();
            }
        };

        /* ════════════════════════════════════════════════════════════════
           [v2.0.20] handlePlaceDraft — botón "Guardar Borrador"
           ────────────────────────────────────────────────────────────────
           Comportamiento:
             · NO valida campos obligatorios (deja guardar lo que haya,
               incluso un local sin nombre — útil para empezar a llenarlo
               y volver después).
             · NO llama al servidor. Solo salva en localStorage + IndexedDB.
             · NO requiere conexión a internet.
             · NO navega fuera del formulario — el usuario se queda en
               el editor y puede seguir editando.
             · Muestra toast verde "Borrador guardado" + indicador visual
               "Borrador guardado · HH:MM" debajo del botón.
             · Si ya hay un draft previo para este local, lo sobrescribe.
           Cuándo se recupera el borrador:
             · Al entrar al panel "Agregar Local" si es < 5 min → auto.
             · Al entrar al panel "Agregar Local" si es > 5 min → pregunta.
             · Al editar un local existente → si hay draft más reciente
               que los datos del servidor, pregunta si restaurar. */
        window.handlePlaceDraft = async function(e) {
            if (e) e.preventDefault();
            const btn = $('placeDraftBtn');
            const btnText = $('placeDraftText');
            const originalText = btnText.textContent;
            btn.disabled = true;
            btnText.textContent = 'Guardando...';
            updateDraftIndicator('saving');
            try {
                await savePlaceDraft();
                _hasUnsavedChanges = false;
                const t = new Date().toLocaleTimeString('es-CU', { hour: '2-digit', minute: '2-digit' });
                showToast('Borrador guardado localmente a las ' + t + '. No se envió al servidor.');
                /* No navegamos fuera: el usuario sigue editando. */
            } catch (err) {
                console.error('[Draft] Error guardando borrador manual:', err);
                showToast('No se pudo guardar el borrador: ' + (err.message || err), true);
                updateDraftIndicator('error');
            } finally {
                btn.disabled = false;
                btnText.textContent = originalText;
            }
        };

        /* ════════════════════════════════════════════════════════════════
           [v2.0.22] handleLoadDraft — botón "Cargar Borrador"
           ────────────────────────────────────────────────────────────────
           Carga explícitamente el último draft guardado para el contexto
           actual (local nuevo o local en edición). A diferencia del auto-
           restore de checkDraftOnPanelSwitch, este botón:
             · NO pregunta confirmación (el usuario ya la dio al clicar).
             · NO importa cuánto tiempo haya pasado (carga igual aunque
               el draft tenga 1 semana).
             · SI hay datos sin guardar en el form actual, SÍ pregunta
               antes de pisarlos (no queremos perder cambios nuevos).
             · SI no hay draft, avisa al usuario con un toast claro. */
        window.handleLoadDraft = async function(e) {
            if (e) e.preventDefault();
            const btn = $('placeLoadDraftBtn');
            if (btn) {
                btn.disabled = true;
                const span = btn.querySelector('span');
                const orig = span ? span.textContent : '';
                if (span) span.textContent = 'Cargando...';
                setTimeout(() => {
                    btn.disabled = false;
                    if (span) span.textContent = orig;
                }, 800);
            }

            /* Si hay cambios sin guardar en el form, preguntar antes de pisar. */
            if (_hasUnsavedChanges) {
                const ok = confirm('Tienes cambios sin guardar en el formulario.\n\n¿Quieres reemplazarlos con el borrador guardado?');
                if (!ok) return;
            }

            const draft = await loadPlaceDraft();
            if (!draft || !draft.savedAt) {
                showToast('No hay borrador guardado para cargar.', true);
                return;
            }

            /* Restaurar el draft en el formulario. */
            // ★ [v2.0.34] Añadidos: lat, lng, gmaps_url, plus_code.
            const fields = ['name','category','neighborhood','address','phone','description','price_range','schedule','must_order','editor_note','lat','lng','gmaps_url','plus_code'];
            fields.forEach(f => {
                const el = $('f-' + f);
                if (el && draft[f] !== undefined) el.value = draft[f];
            });
            // ★ [v2.0.34] Refresh del helper link tras restaurar el draft.
            if (typeof updateGmapsHelperHref === 'function') updateGmapsHelperHref();
            placeTags = Array.isArray(draft.tags) ? draft.tags.slice() : [];
            placeMenu = Array.isArray(draft.menu) ? JSON.parse(JSON.stringify(draft.menu)) : [];
            placeLinks = Array.isArray(draft.links) ? JSON.parse(JSON.stringify(draft.links)) : [];
            /* Recuperar URLs de imágenes (las File no se pueden recuperar). */
            if (Array.isArray(draft.imageMeta)) {
                placeImages = draft.imageMeta
                    .filter(m => m && m.kind === 'url')
                    .map(m => m.url);
                const lostFiles = draft.imageMeta.filter(m => m && m.kind === 'file');
                if (lostFiles.length > 0) {
                    setTimeout(() => showToast('Se perdieron ' + lostFiles.length + ' imagen(es) no subidas del borrador. Vuelve a subirlas.', true), 800);
                }
            }
            renderTags();
            renderMenuEditor();
            renderLinksEditor();
            initImageGrid();
            _hasUnsavedChanges = false;
            updateDraftIndicator('saved');
            const t = new Date(draft.savedAt).toLocaleTimeString('es-CU', { hour: '2-digit', minute: '2-digit' });
            showToast('Borrador cargado (guardado a las ' + t + ')');
        };

        /* ════════════════════════════════════════════════════════════════
           [v2.0.22] cancelEditing — sale del modo edición sin guardar
           ────────────────────────────────────────────────────────────────
           Cuando el usuario está editando un local y quiere salir del
           modo edición (sin Publicar), este botón:
             · Limpia editingPlaceId (vuelve a modo "Agregar Local").
             · Resetea el formulario.
             · NO borra el draft (por si quiere recuperarlo después). */
        window.cancelEditing = function() {
            if (_hasUnsavedChanges) {
                const ok = confirm('Estás editando un local y tienes cambios sin guardar.\n\n¿Salir del modo edición? (los cambios quedan en el borrador local)');
                if (!ok) return;
                /* Asegurar que el draft esté guardado antes de salir. */
                try { savePlaceDraft(); } catch (e) {}
            }
            editingPlaceId = null;
            $('editPlaceId').value = '';
            resetPlaceForm();
            updateEditingBadge();
            showToast('Saliste del modo edición. Ahora estás creando un local nuevo.');
        };

        /* ════════════════════════════════════════════════════════════════
           [v2.0.22] updateEditingBadge — muestra/oculta el badge "Editando"
           ────────────────────────────────────────────────────────────────
           Cuando se está editando un local existente (editingPlaceId != null),
           muestra el badge arriba del bloque de botones con el nombre del
           local. Cuando no, lo oculta.

           También actualiza el texto del sidebar link "Agregar Local"
           para que cambie a "Editar Local" cuando esté en modo edición.
           Esto soluciona la confusión del usuario: "me manda a la pestaña
           agregar local y no a editar local". */
        function updateEditingBadge() {
            const badge = $('editingBadge');
            if (!badge) return;
            if (editingPlaceId) {
                const place = myPlaces.find(p => String(p.id) === String(editingPlaceId));
                const name = place ? (place.name || 'Sin nombre') : 'Local';
                badge.style.display = 'flex';
                const nameEl = $('editingBadgeName');
                if (nameEl) nameEl.textContent = name;
                /* Cambiar el texto del sidebar link a "Editar Local". */
                const sidebarLink = document.querySelector('.sidebar-link[data-panel="add-place"] .link-label-text') ||
                                   document.querySelector('.sidebar-link[data-panel="add-place"]');
                if (sidebarLink) {
                    /* El texto del sidebar link es "Agregar Local" — lo
                       reemplazamos por "Editar Local" mientras editingPlaceId
                       esté seteado. */
                    const linkEl = document.querySelector('.sidebar-link[data-panel="add-place"]');
                    if (linkEl) {
                        const iconHtml = '<i aria-hidden="true" class="fas fa-pen-to-square"></i> ';
                        /* Solo reemplazamos si no fue ya reemplazado. */
                        if (!linkEl.dataset.originalLabel) {
                            linkEl.dataset.originalLabel = linkEl.innerHTML;
                        }
                        linkEl.innerHTML = iconHtml + 'Editar Local';
                    }
                }
            } else {
                badge.style.display = 'none';
                /* Restaurar el texto original del sidebar link. */
                const linkEl = document.querySelector('.sidebar-link[data-panel="add-place"]');
                if (linkEl && linkEl.dataset.originalLabel) {
                    linkEl.innerHTML = linkEl.dataset.originalLabel;
                    delete linkEl.dataset.originalLabel;
                }
            }
        }
        window.updateEditingBadge = updateEditingBadge;

        // ★ FIX [v2.0.23] Guard de reentrancia: si el botón ya está
        //   deshabilitado (save en curso), ignorar submit duplicado. Antes,
        //   un doble clic rápido disparaba dos handles concurrentes que
        //   competían por editingPlaceId y placeImages, corrompiendo estado.
        let _placeSubmitInFlight = false;

        window.handlePlaceSubmit = async function(e) {
            e.preventDefault();
            if (_placeSubmitInFlight) {
                console.warn('[Save] Submit duplicado ignorado (save en curso).');
                return;
            }
            _placeSubmitInFlight = true;
            const btn = $('placeSubmitBtn');
            const btnText = $('placeSubmitText');
            const originalText = btnText.textContent;
            // Deshabilitar de inmediato para bloquear clics adicionales
            // durante la validación y el savePlaceDraft (que son async).
            btn.disabled = true;

            // ★ FIX [v2.0.35] H1: helper para abortar validación sin dejar el
            //   botón clavado. Antes, los `return` tempranos de validación
            //   saltaban el `finally` del try/catch de INSERT/UPDATE y dejaban
            //   _placeSubmitInFlight=true + btn.disabled=true para siempre.
            //   Síntoma: el usuario fallaba una validación (p.ej. nombre vacío),
            //   corregía el campo y volvía a clickear "Publicar Local", pero el
            //   botón no respondía porque el guard de reentrancia bloqueaba el
            //   segundo submit. Recargar la página era la única forma de
            //   rehabilitarlo. Ahora abort() resetea el estado antes de salir.
            const abort = (msg, fieldEl) => {
                if (msg) showToast(msg, true);
                if (fieldEl && fieldEl.focus) fieldEl.focus();
                btn.disabled = false;
                btnText.textContent = originalText;
                _placeSubmitInFlight = false;
            };

            // ── 1. Validación de campos requeridos ───────────────────────
            // ★ FIX [v2.0.35]: lookup defensivo — si el nodo fue reemplazado
            //   (p.ej. por un widget de terceros), $() devuelve null y .value
            //   lanzaría TypeError. Abortamos con mensaje claro en lugar de
            //   dejar el botón clavado por un error no capturado.
            const nameEl = $('f-name');
            const categoryEl = $('f-category');
            const neighborhoodEl = $('f-neighborhood');
            if (!nameEl || !categoryEl || !neighborhoodEl) {
                abort('Error de estructura del formulario. Recarga la página e inténtalo de nuevo.', null);
                return;
            }
            const name = nameEl.value.trim();
            const category = categoryEl.value;
            const neighborhood = neighborhoodEl.value;

            if (!name) { abort('El nombre del local es obligatorio', nameEl); return; }
            if (name.length > 100) { abort('El nombre no puede exceder 100 caracteres', nameEl); return; }
            if (!category) { abort('Selecciona una categoría', categoryEl); return; }
            if (!neighborhood) { abort('Selecciona un municipio', neighborhoodEl); return; }

            // ★ FIX [v2.0.19]: SALVAR EL DRAFT PRIMERO, ANTES DE CUALQUIER COSA.
            //   No importa si hay o no hay conexión: primero garantizamos que
            //   todo lo que el usuario escribió quede en localStorage. Solo
            //   después intentamos subir al servidor. Si el servidor falla,
            //   el draft sigue guardado y el usuario no pierde nada.
            btnText.textContent = 'Guardando borrador...';
            updateDraftIndicator('saving');
            try { await savePlaceDraft(); } catch (draftErr) {
                console.warn('[Save] No se pudo salvar draft antes del submit:', draftErr);
                /* No abortamos: seguimos intentando el servidor. El draft es
                   un safety net, no un bloqueador. */
            }
            btnText.textContent = originalText;

            // [F-1.2] Validación de teléfono cubano si el campo no está vacío
            const phone = (($('f-phone') || {}).value || '').trim();
            if (phone && !/^\+53\s[5-7]\s\d{6,7}$/.test(phone)) {
                abort('Teléfono inválido. Formato esperado: +53 5 1234567', $('f-phone'));
                return;
            }

            // [F-1.2] Validación de longitud de descripción si no está vacía
            // ★ FIX [v2.0.5]: bajado de 50 a 10 caracteres. Antes el save se bloqueaba
            //   silenciosamente cuando el usuario ponía descripciones cortas (muy común
            //   en borradores rápidos). 10 caracteres es suficiente para evitar spam.
            const description = (($('f-description') || {}).value || '').trim();
            if (description && description.length < 10) {
                abort('La descripción debe tener al menos 10 caracteres o dejarla vacía', $('f-description'));
                return;
            }

            // [F-1.5] Pre-validación de límite de locales por plan (solo para nuevo local, no edición)
            if (!editingPlaceId) {
                const maxPlaces = userSubscription && userSubscription.max_places ? userSubscription.max_places : 1;
                // Si el admin está creando un local propio, respeta el max_places; si excede, mostrar upgrade
                if (!isAdmin() && myPlaces.length >= maxPlaces) {
                    abort('Has alcanzado el límite de ' + maxPlaces + ' locales de tu plan ' + (userSubscription.plan || 'free') + '. Considera mejorar tu suscripción.', null);
                    return;
                }
            }

            // ── 2. Construir el payload (tipos compatibles con la tabla places) ──
            const priceRange = ($('f-price_range') || {}).value || '';

            // Limpiar menu: quitar categorias sin nombre y items sin nombre
            const cleanMenu = (Array.isArray(placeMenu) ? placeMenu : [])
                .map(cat => ({
                    category: (cat.category || '').trim(),
                    items: (cat.items || [])
                        .map(it => ({
                            name:  (it.name || '').trim(),
                            desc:  (it.desc || '').trim(),
                            price: (it.price || '').trim(),
                            currency: ['CUP','MLC','USD','EUR'].includes(it.currency) ? it.currency : 'CUP',
                            /* ★ v2.0.24: preservar estado "Agotado". */
                            sold_out: it.sold_out === true
                        }))
                        .filter(it => it.name)   // solo items con nombre
                }))
                .filter(cat => cat.category && cat.items.length > 0);  // solo categorias con nombre y al menos 1 item

            // Limpiar links: solo conservar los que tienen URL
            const cleanLinks = (Array.isArray(placeLinks) ? placeLinks : [])
                .map(l => ({
                    platform: (l.platform || 'Otro').trim(),
                    url:      (l.url || '').trim(),
                    icon:     l.icon || 'fa-link',
                    cssClass: l.cssClass || 'delivery-other'
                }))
                .filter(l => l.url);

            const data = {
                name:           name,
                category:       category,
                neighborhood:   neighborhood,
                address:        (($('f-address') || {}).value || '').trim(),
                phone:          phone,
                description:    description,
                price_range:    priceRange || null,   // NULL permitido por el CHECK
                schedule:       (($('f-schedule') || {}).value || '').trim(),
                must_order:     (($('f-must_order') || {}).value || '').trim(),   // ★ NUEVO: columna must_order
                editor_note:    (($('f-editor_note') || {}).value || '').trim(), // ★ NUEVO: columna editor_note
                tags:           Array.isArray(placeTags) ? placeTags.slice(0, 10) : [],
                images:         [],   // se rellena abajo tras subir las imágenes
                menu:           cleanMenu,
                links:          cleanLinks,
                owner_id:       currentUser.id,
                /* [v2.0.20] Ahora el botón se llama "Publicar Local", así que
                   un local nuevo se crea directamente como published. Para
                   crear como draft, el usuario usa "Guardar Borrador" que
                   no toca el servidor. */
                status:         'published'
            };

            // ════════════════════════════════════════════════════════════════
            // ★ [v2.0.34] UBICACIÓN (Google Maps) — campos opcionales.
            //   Sólo se envían al servidor si el dueño los llenó. Si los 4
            //   quedan vacíos, NO se agregan al payload (así Supabase recibe
            //   el mismo shape que antes y no rompe RLS ni CHECKs).
            //   lat/lng: se convierten a Number o null. Si el input está
            //   vacío o no es numérico, se envían como null (la columna es
            //   double precision y acepta NULL).
            //   gmaps_url / plus_code: strings vacíos se envían como null
            //   para no llenar la BD con ''.
            //   No son required: el flujo de crear un local sin coordenadas
            //   sigue funcionando igual que antes.
            // ════════════════════════════════════════════════════════════════
            const rawLat = (($('f-lat') || {}).value || '').trim();
            const rawLng = (($('f-lng') || {}).value || '').trim();
            const latNum = rawLat ? parseFloat(rawLat) : null;
            const lngNum = rawLng ? parseFloat(rawLng) : null;
            // Validación defensiva: si el usuario escribió "abc", parseFloat
            // devuelve NaN. Lo tratamos como null (no bloqueamos el save).
            data.lat = (latNum !== null && !isNaN(latNum)) ? latNum : null;
            data.lng = (lngNum !== null && !isNaN(lngNum)) ? lngNum : null;
            const gmapsUrlVal = (($('f-gmaps_url') || {}).value || '').trim();
            data.gmaps_url = gmapsUrlVal ? gmapsUrlVal : null;
            const plusCodeVal = (($('f-plus_code') || {}).value || '').trim();
            data.plus_code = plusCodeVal ? plusCodeVal : null;

            // ★ DEBUG: log del payload final para inspección en consola
            console.info('[Sabormap Dashboard] Payload a guardar:', {
                name: data.name,
                category: data.category,
                must_order: data.must_order,
                editor_note: data.editor_note,
                menu_items: cleanMenu.reduce((acc, c) => acc + (c.items ? c.items.length : 0), 0),
                menu_categorias: cleanMenu.length
            });

            // ── 3. Subir imágenes al storage con [F-5.3] reintentos y backoff exponencial ──
            btn.disabled = true;
            btnText.textContent = 'Subiendo imágenes...';

            const imageUrls = [];
            const failedImages = [];
            for (let i = 0; i < placeImages.length; i++) {
                const img = placeImages[i];
                if (!img) continue;
                if (typeof img === 'string') { imageUrls.push(img); continue; }

                btnText.textContent = 'Subiendo imagen ' + (i + 1) + ' de ' + placeImages.length + '...';
                let success = false;
                // [F-5.3] Reintentos con backoff exponencial: 1s, 4s, 16s (max 3 intentos)
                for (let attempt = 1; attempt <= 3 && !success; attempt++) {
                    try {
                        const ext  = (img.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
                        const safe = ext.substring(0, 5) || 'jpg';
                        const path = currentUser.id + '/' + Date.now() + '-' + i + '.' + safe;
                        const { data: upData, error: upErr } = await sb.storage.from('place-images').upload(path, img, { cacheControl: '3600', upsert: false });
                        if (upErr) {
                            // [F-5.6] Si error de auth, intentar refresh
                            if (await handleAuthError(upErr)) {
                                // Reintento inmediato tras refresh
                                const r = await sb.storage.from('place-images').upload(path, img, { cacheControl: '3600', upsert: false });
                                if (r.error) throw r.error;
                                const u2 = sb.storage.from('place-images').getPublicUrl(r.data.path);
                                if (u2 && u2.data && u2.data.publicUrl) imageUrls.push(u2.data.publicUrl);
                                success = true;
                            } else {
                                throw upErr;
                            }
                        } else {
                            const { data: urlData } = sb.storage.from('place-images').getPublicUrl(upData.path);
                            if (urlData && urlData.publicUrl) imageUrls.push(urlData.publicUrl);
                            success = true;
                        }
                    } catch (err) {
                        console.error('Error subiendo imagen (intento ' + attempt + '):', err);
                        if (attempt < 3) {
                            // Backoff exponencial: 1s, 4s
                            const wait = Math.pow(4, attempt - 1) * 1000;
                            await new Promise(r => setTimeout(r, wait));
                        }
                    }
                }
                if (!success) {
                    failedImages.push(i + 1);
                }
            }
            if (failedImages.length > 0) {
                showToast('No se pudieron subir ' + failedImages.length + ' imagen(es) tras 3 intentos. Se guardará el local sin ellas.', true);
            }
            data.images = imageUrls;

            // ── 4. INSERT o UPDATE ────────────────────────────────────────
            btnText.textContent = 'Guardando local...';

            // ★ FIX [v2.0.23] NO forzar refreshSession() antes de cada save.
            //   El fix anterior (v2.0.16) llamaba refreshSession() antes de cada save,
            //   pero chocaba con autoRefreshToken:true del cliente Supabase. Dos refreshes
            //   simultáneos dejan el token en estado inválido mientras el save está en
            //   vuelo → el gateway cuelga y el usuario ve "Guardando local..." eterno.
            //
            //   Fix nuevo: solo refrescar si el token expira en <60s. Si no, usar el
            //   actual y confiar en autoRefreshToken para el resto.
            try {
                const { data: sessionData } = await sb.auth.getSession();
                const sess = sessionData?.session;
                if (sess && sess.expires_at) {
                    const msToExpiry = (sess.expires_at * 1000) - Date.now();
                    if (msToExpiry < 60000) {
                        btnText.textContent = 'Refrescando sesión...';
                        const { error: refreshErr } = await sb.auth.refreshSession();
                        if (refreshErr) {
                            console.warn('[Save] refreshSession falló (token vencía en ' +
                                Math.round(msToExpiry/1000) + 's):', refreshErr.message);
                        } else {
                            console.log('[Save] Token refrescado (vencía en <60s).');
                        }
                    }
                }
            } catch (e) {
                console.warn('[Save] Excepción verificando sesión (no bloqueante):', e);
            }
            btnText.textContent = 'Guardando local...';

            // ★ FIX [v2.0.18]: timeout 15s + 1 solo intento + SIEMPRE encolar tras fallo.
            const withTimeout = (promise, ms, label) => Promise.race([
                promise,
                new Promise((_, reject) => setTimeout(
                    () => reject(new Error('Timeout (' + label + '): el servidor no respondió en ' + (ms/1000) + 's.')),
                    ms
                ))
            ]);
            const SAVE_TIMEOUT = 15000; // 15s

            try {
                let opError = null;
                let saveResult = null;
                if (editingPlaceId) {
                    const update = { ...data };
                    delete update.owner_id;
                    delete update.status;
                    // ★ FIX [v2.0.17]: .select() para detectar RLS silent denial
                    saveResult = await withTimeout(
                        sb.from('places').update(update).eq('id', editingPlaceId).select(),
                        SAVE_TIMEOUT, 'UPDATE'
                    );
                    opError = saveResult.error;
                    if (!opError) {
                        const updatedRows = Array.isArray(saveResult.data) ? saveResult.data.length : 0;
                        if (updatedRows === 0) {
                            console.error('[Save] UPDATE devolvió 0 filas. editingPlaceId:', editingPlaceId, 'currentUser.id:', currentUser?.id);
                            opError = { message: 'No se pudo actualizar: el local no te pertenece o la sesión cambió. Recarga e inténtalo de nuevo.' };
                        } else {
                            console.log('[Save] UPDATE exitoso. Filas:', updatedRows);
                            showToast('Local actualizado correctamente');
                            // ★ [v2.0.21] Actualizar cache público compartido con la home.
                            //   saveResult.data[0] trae el registro tal como quedó en Supabase
                            //   (snake_case), perfecto para inyectar directo en el cache.
                            if (saveResult.data && saveResult.data[0]) {
                                upsertPublicPlaceInCache(saveResult.data[0]);
                            }
                        }
                    }
                } else {
                    saveResult = await withTimeout(
                        sb.from('places').insert(data).select(),
                        SAVE_TIMEOUT, 'INSERT'
                    );
                    opError = saveResult.error;
                    if (!opError) {
                        const insertedRows = Array.isArray(saveResult.data) ? saveResult.data.length : 0;
                        if (insertedRows === 0) {
                            console.error('[Save] INSERT devolvió 0 filas. Posible RLS denial.');
                            opError = { message: 'No se pudo crear el local: permisos insuficientes (RLS).' };
                        } else {
                            console.log('[Save] INSERT exitoso. Nuevo ID:', saveResult.data[0]?.id);
                            showToast('Local creado correctamente');
                            // ★ [v2.0.21] Insertar el nuevo local en el cache público
                            //   compartido con la home. Así, si el usuario abre index.html
                            //   en otra pestaña (o está offline), verá este local de inmediato.
                            if (saveResult.data && saveResult.data[0]) {
                                upsertPublicPlaceInCache(saveResult.data[0]);
                            }
                        }
                    }
                }

                /* ════════════════════════════════════════════════════════════════
                   ★ [v2.0.34] TOLERANCIA: si la columna `gmaps_url` no existe
                   aún en el schema de Supabase, el INSERT/UPDATE devuelve un
                   error tipo "Could not find the 'gmaps_url' column of
                   'places' in the schema cache" o similar. En ese caso
                   removemos `gmaps_url` del payload y reintentamos UNA vez.
                   Esto protege el flujo de save: el resto de los campos
                   (lat, lng, plus_code, name, etc.) se guardan correctamente.
                   El usuario ve un toast avisando que la URL se perdió.

                   IMPORTANTE: si el local está en modo edición (UPDATE),
                   también removemos gmaps_url del objeto `update` ya
                   construido arriba, pero como `data` es la fuente y el
                   `update` se hizo con `{ ...data }`, basta con borrar
                   de `data` y reconstruir.
                   ════════════════════════════════════════════════════════════════ */
                if (opError) {
                    const errMsg = String((opError && opError.message) || (opError.toString && opError.toString()) || '');
                    if (errMsg.indexOf('gmaps_url') !== -1) {
                        console.warn('[Save] Columna gmaps_url no existe en Supabase. Reintentando sin ella. Error original:', errMsg);
                        // Remover el campo del payload para el retry.
                        delete data.gmaps_url;
                        if (editingPlaceId) {
                            const updateRetry = { ...data };
                            delete updateRetry.owner_id;
                            delete updateRetry.status;
                            saveResult = await withTimeout(
                                sb.from('places').update(updateRetry).eq('id', editingPlaceId).select(),
                                SAVE_TIMEOUT, 'UPDATE (retry sin gmaps_url)'
                            );
                        } else {
                            saveResult = await withTimeout(
                                sb.from('places').insert(data).select(),
                                SAVE_TIMEOUT, 'INSERT (retry sin gmaps_url)'
                            );
                        }
                        opError = saveResult.error;
                        if (!opError) {
                            const rows = Array.isArray(saveResult.data) ? saveResult.data.length : 0;
                            if (rows === 0) {
                                opError = { message: 'No se pudo guardar el local tras reintentar. Revisa permisos (RLS).' };
                            } else {
                                console.log('[Save] Retry sin gmaps_url exitoso. Filas:', rows);
                                showToast('Local guardado. La URL de Google Maps no se guardó porque la columna gmaps_url aún no existe en la base de datos. lat/lng y demás campos sí se guardaron. Contacta al admin para agregar la columna.', true);
                                if (saveResult.data && saveResult.data[0]) {
                                    upsertPublicPlaceInCache(saveResult.data[0]);
                                }
                            }
                        }
                    }
                }
                if (opError) throw opError;

                // ★ FIX [v2.0.19]: clearPlaceDraft() usa draftLSKey() que depende
                //   de editingPlaceId. Si hacemos editingPlaceId=null primero,
                //   se borraría la key 'new' en vez de la del local editado.
                //   Por eso limpiamos el draft ANTES de resetear editingPlaceId.
                await clearPlaceDraft();
                editingPlaceId = null;
                resetPlaceForm();
                _hasUnsavedChanges = false;
                // ★ FIX [v2.0.23] NO bloquear el botón esperando loadMyPlaces().
                //   El save ya confirmó éxito. La recarga se hace en background
                //   y renderOverview() se llama cuando termine (sin timeout).
                //   El botón se libera de inmediato (finally más abajo).
                loadMyPlaces().then(() => {
                    renderOverview();
                    if (isAdmin() && typeof loadAdminData === 'function') {
                        loadAdminData().then(() => {
                            if ($('panel-admin-places').classList.contains('active')) {
                                renderAdminPlaces();
                            }
                        });
                    }
                }).catch(err => {
                    console.warn('[Save] Recarga post-save falló (no crítico):', err);
                });
                // Render inmediato con datos optimistas (el nuevo local ya está
                // en myPlaces si vino de saveResult, o se agregará al terminar la recarga)
                renderOverview();
                switchPanel('my-places', document.querySelector('[data-panel=my-places]'));
            } catch (err) {
                console.error('Places insert/update error:', err);
                const rawMsg = (err && err.message) ? err.message : (typeof err === 'string' ? err : 'Error desconocido');
                const isTimeout = rawMsg.includes('Timeout');
                const isNetworkError = rawMsg.includes('network') || rawMsg.includes('Network') ||
                                        rawMsg.includes('fetch') || rawMsg.includes('Failed to fetch') ||
                                        !navigator.onLine;

                // ★ FIX [v2.0.18]: SIEMPRE encolar tras timeout o error de red.
                //   No más reintentos inútiles en foreground. El usuario ya esperó 15s.
                //   Background Sync + interval 30s seguirán probando hasta que el servidor responda.
                if (isTimeout || isNetworkError) {
                    let opId = null;
                    if (editingPlaceId) {
                        const updatePayload = { ...data };
                        delete updatePayload.owner_id;
                        delete updatePayload.status;
                        opId = await enqueueOperation('place_update',
                            { id: editingPlaceId, data: updatePayload },
                            { placeName: name }
                        );
                        console.log('[Save] UPDATE encolado en IndexedDB. opId:', opId, '| placeId:', editingPlaceId);
                    } else {
                        opId = await enqueueOperation('place_insert', data, { placeName: name });
                        console.log('[Save] INSERT encolado en IndexedDB. opId:', opId, '| placeName:', name);
                    }
                    if (opId) {
                        showToast('Cambios guardados localmente. Se sincronizarán automáticamente cuando el servidor responda.');
                        // ★ FIX [v2.0.19]: NO borramos el draft aquí. El servidor
                        //   todavía no confirmó la escritura; si borramos el draft
                        //   y la cola falla permanentemente, los datos se pierden.
                        //   El draft queda como safety net hasta que:
                        //   1) la cola procesa exitosamente (ver handler de
                        //      'queue-processed' / message del SW que llama
                        //      clearPlaceDraftById), o
                        //   2) el usuario sobreescribe el draft editando de nuevo.
                        const draftId = editingPlaceId;  // capturar antes de resetear
                        editingPlaceId = null;
                        resetPlaceForm();
                        _hasUnsavedChanges = false;
                        // Guardar referencia al draftId en la operación, para que
                        // cuando se procese con éxito se sepa qué draft limpiar.
                        try {
                            const db = await openOpsDB();
                            if (db) {
                                const tx = db.transaction('ops', 'readwrite');
                                const store = tx.objectStore('ops');
                                const getReq = store.get(opId);
                                getReq.onsuccess = () => {
                                    const op = getReq.result;
                                    if (op) {
                                        op.metadata = op.metadata || {};
                                        op.metadata.draftId = draftId;  // null si era INSERT
                                        op.metadata.draftLSKey = 'sabormap_draft_place_' + (draftId || 'new');
                                        store.put(op);
                                    }
                                };
                            }
                        } catch (e) { /* no crítico */ }
                        // Forzar procesamiento inmediato de la cola
                        if (typeof processQueueNow === 'function') {
                            setTimeout(() => processQueueNow(), 2000);
                        }
                        switchPanel('my-places', document.querySelector('[data-panel=my-places]'));
                        return;
                    }
                }

                // Mensaje de error genérico para otros casos
                let userMsg;
                if (rawMsg.includes('row-level security') || rawMsg.includes('RLS')) {
                    userMsg = 'No tienes permisos para realizar esta acción. Si crees que es un error, contacta al administrador.';
                } else if (rawMsg.includes('duplicate') || rawMsg.includes('unique')) {
                    userMsg = 'Ya existe un local con estos datos.';
                } else {
                    userMsg = rawMsg;
                }
                showToast('Error al guardar el local: ' + userMsg, true);
            } finally {
                btn.disabled = false;
                btnText.textContent = originalText;
                _placeSubmitInFlight = false;
            }
        };

        /* ========================================
           ADMIN: Cargar datos
        ======================================== */
        async function loadAdminData() {
            // [F-3.6 / F-CAMBIO-SOLICITADO] Verificación defensiva en cliente
            if (!isAdmin()) {
                console.warn('loadAdminData bloqueado: usuario no es admin');
                allPlaces = []; allProfiles = []; allSubs = []; allLogs = []; allCollections = []; allCollectionPlaces = [];
                return;
            }
            const [p1, p2, p3, p4, p5, p6] = await Promise.all([
                sb.from('places').select('*').order('created_at', { ascending: false }),
                sb.from('profiles').select('*').order('created_at', { ascending: false }),
                sb.from('subscriptions').select('*').order('created_at', { ascending: false }),
                sb.from('payment_log').select('*').order('created_at', { ascending: false }),
                sb.from('collections').select('*').order('sort_order', { ascending: true }),
                sb.from('collection_places').select('*')
            ]);
            allPlaces = p1.data || [];
            allProfiles = p2.data || [];
            allSubs = p3.data || [];
            allLogs = p4.data || [];
            allCollections = p5.data || [];
            allCollectionPlaces = p6.data || [];
        }

        /* ========================================
           ADMIN: Todos los locales
        ======================================== */
        /* ═══════════════════════════════════════════════════
           [U-04] ÍNDICES DE BÚSQUEDA — WeakMap memoizado
           ───────────────────────────────────────────────────
           Indexa nombre, municipio, categoría, tags, descripción,
           dirección, teléfono y (para locales) platos de la carta.
           Evita recalcular el blob en cada tecleo del buscador.
           ═══════════════════════════════════════════════════ */
        const placeSearchIndex = new WeakMap();
        function buildPlaceSearchBlob(p) {
            if (placeSearchIndex.has(p)) return placeSearchIndex.get(p);
            const parts = [
                p.name, p.neighborhood, p.category, p.address, p.phone,
                p.description, (p.tags || []).join(' ')
            ];
            // Indexar también platos del menú
            if (Array.isArray(p.menu)) {
                p.menu.forEach(sec => {
                    parts.push(sec.category || '');
                    (sec.items || []).forEach(it => {
                        parts.push(it.name || '');
                        parts.push(it.desc || '');
                    });
                });
            }
            const blob = parts.filter(Boolean).join(' ').toLowerCase();
            placeSearchIndex.set(p, blob);
            return blob;
        }

        const userSearchIndex = new WeakMap();
        function buildUserSearchBlob(p) {
            if (userSearchIndex.has(p)) return userSearchIndex.get(p);
            const blob = [p.full_name, p.email, p.phone, p.role]
                .filter(Boolean).join(' ').toLowerCase();
            userSearchIndex.set(p, blob);
            return blob;
        }

        const subSearchIndex = new WeakMap();
        function buildSubSearchBlob(sub) {
            if (subSearchIndex.has(sub)) return subSearchIndex.get(sub);
            const pr = allProfiles.find(p => p.id === sub.user_id);
            const parts = [
                pr ? pr.full_name : '',
                pr ? pr.email : '',
                sub.plan, sub.status,
                sub.notes
            ];
            const blob = parts.filter(Boolean).join(' ').toLowerCase();
            subSearchIndex.set(sub, blob);
            return blob;
        }

        /* [U-04-highlight] Resaltar coincidencias en texto escapado */
        function highlightMatch(text, query) {
            const safe = escapeHtml(text || '');
            if (!query) return safe;
            const q = query.toLowerCase();
            const lower = (text || '').toLowerCase();
            const idx = lower.indexOf(q);
            if (idx === -1) return safe;
            // Reconstruir con <mark> en la posición correcta del texto escapado
            const before = escapeHtml(text.substring(0, idx));
            const match = escapeHtml(text.substring(idx, idx + query.length));
            const after = escapeHtml(text.substring(idx + query.length));
            return before + '<mark style="background:rgba(245,158,11,0.3);color:inherit;padding:0 2px;border-radius:2px">' + match + '</mark>' + after;
        }

        function getFilteredPlaces() {
            let list = [...allPlaces];
            const search = ($('adminPlacesSearch') || {}).value || '';
            const cat = ($('adminPlacesCatFilter') || {}).value || '';
            const status = ($('adminPlacesStatusFilter') || {}).value || '';
            // [U-04] Usar índice memoizado en lugar de recorrer campos en cada tecleo
            if (search) {
                const s = search.toLowerCase();
                list = list.filter(p => buildPlaceSearchBlob(p).includes(s));
            }
            if (cat) list = list.filter(p => p.category === cat);
            if (status) list = list.filter(p => p.status === status);
            return list;
        }

        function renderAdminPlaces() {
            // Stats
            const total = allPlaces.length;
            const pub = allPlaces.filter(p => p.status === 'published').length;
            const drf = allPlaces.filter(p => p.status === 'draft').length;
            const pen = allPlaces.filter(p => p.status === 'pending').length;
            $('adminPlacesStats').innerHTML =
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(139,92,246,0.12);color:var(--accent)"><i aria-hidden="true" class="fas fa-store"></i></div><div><div class="admin-quick-stat-value">' + total + '</div><div class="admin-quick-stat-label">Total</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(34,197,94,0.12);color:var(--green)"><i aria-hidden="true" class="fas fa-check"></i></div><div><div class="admin-quick-stat-value">' + pub + '</div><div class="admin-quick-stat-label">Publicados</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(245,158,11,0.12);color:var(--amber)"><i aria-hidden="true" class="fas fa-pencil-alt"></i></div><div><div class="admin-quick-stat-value">' + drf + '</div><div class="admin-quick-stat-label">Borradores</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(6,182,212,0.12);color:var(--secondary)"><i aria-hidden="true" class="fas fa-clock"></i></div><div><div class="admin-quick-stat-value">' + pen + '</div><div class="admin-quick-stat-label">Pendientes</div></div></div>';

            const list = getFilteredPlaces();
            const body = $('adminPlacesBody');
            const empty = $('adminPlacesEmpty');

            if (list.length === 0) {
                body.innerHTML = '';
                empty.style.display = 'block';
                return;
            }
            empty.style.display = 'none';

            body.innerHTML = list.map(p => {
                // [F-3.1] XSS: escapar todos los datos del usuario
                const search = ($('adminPlacesSearch') || {}).value || '';
                const owner = allProfiles.find(pr => pr.id === p.owner_id);
                // [U-04] Resaltar coincidencias de búsqueda en nombre y municipio
                const ownerName = owner ? escapeHtml(owner.full_name || owner.email || '?') : escapeHtml((p.owner_id || '?').substring(0, 8) + '...');
                const safeName = highlightMatch(p.name || 'Sin nombre', search);
                const safePlusCode = highlightMatch(getPlusCode(p) || p.address || '', search);
                const safeCategory = escapeHtml(p.category || '');
                const safeNeighborhood = highlightMatch(p.neighborhood || '—', search);
                const safeId = escapeHtml(p.id);
                const safeStatus = escapeHtml(p.status || '');
                // Para los aria-label usamos el nombre SIN <mark> para no romper el HTML
                const safeNamePlain = escapeHtml(p.name || 'Sin nombre');
                const safeNameForToggle = safeNamePlain.replace(/'/g, '&#39;');
                // [v2.0.13] delivery_enabled: puede ser true/false/null/undefined.
                // null/undefined → tratamos como false (no habilitado).
                const deliveryOn = !!(p && p.delivery_enabled);
                const deliveryLabel = deliveryOn ? 'Activo' : 'Inactivo';
                return '<tr>' +
                    '<td><div style="font-weight:600">' + safeName + '</div><div style="font-size:0.75rem;color:var(--secondary);font-family:monospace">' + safePlusCode + '</div></td>' +
                    '<td><span class="cat-indicator ' + safeCategory + '" style="margin-right:6px"></span><span style="text-transform:capitalize">' + safeCategory + '</span></td>' +
                    '<td>' + safeNeighborhood + '</td>' +
                    '<td style="font-size:0.85rem">' + ownerName + '</td>' +
                    '<td>' + statusBadgeHTML(safeStatus) + '</td>' +
                    '<td><div class="delivery-toggle-cell">' +
                        '<label class="delivery-toggle">' +
                            '<input type="checkbox" ' + (deliveryOn ? 'checked' : '') +
                                ' onchange="adminToggleDelivery(\'' + safeId + '\', this.checked, this)"' +
                                ' aria-label="Habilitar delivery para ' + safeNameForToggle + '"' +
                                ' role="switch" aria-checked="' + (deliveryOn ? 'true' : 'false') + '">' +
                            '<span class="delivery-toggle-slider"></span>' +
                        '</label>' +
                        '<span class="delivery-status-text ' + (deliveryOn ? 'on' : '') + '">' + deliveryLabel + '</span>' +
                    '</div></td>' +
                    '<td><div class="actions-cell">' +
                        '<button class="btn-success btn-sm" aria-label="Cambiar estado del local ' + safeNamePlain + '" onclick="adminTogglePlaceStatus(\'' + safeId + '\',\'' + safeStatus + '\')"><i aria-hidden="true" class="fas fa-eye"></i></button>' +
                        '<button class="btn-danger btn-sm" aria-label="Eliminar local ' + safeNamePlain + '" onclick="adminDeletePlace(\'' + safeId + '\')"><i aria-hidden="true" class="fas fa-trash"></i></button>' +
                    '</div></td>' +
                '</tr>';
            }).join('');
        }

        /* [v2.0.13] Toggle del flag `delivery_enabled` de un local.
           - Llama a Supabase para actualizar la columna.
           - Muestra feedback visual mientras guarda (clase .loading).
           - Si falla, revierte el checkbox y avisa al admin.
           - Tras éxito, recarga los datos del admin para que la tabla
             refleje el nuevo estado. */
        window.adminToggleDelivery = async function(id, newValue, checkboxEl) {
            if (!requireAdmin('adminToggleDelivery')) {
                // Revertir si no es admin (defensa en profundidad)
                if (checkboxEl) checkboxEl.checked = !newValue;
                return;
            }
            const toggleWrap = checkboxEl ? checkboxEl.closest('.delivery-toggle') : null;
            if (toggleWrap) toggleWrap.classList.add('loading');
            try {
                const { error } = await sb.from('places')
                    .update({ delivery_enabled: !!newValue })
                    .eq('id', id);
                if (error) {
                    if (checkboxEl) checkboxEl.checked = !newValue;
                    // [F-5.6] Si error de auth, intentar refresh + reintento único
                    const retried = await handleAuthError(error, async () => {
                        const r = await sb.from('places')
                            .update({ delivery_enabled: !!newValue })
                            .eq('id', id);
                        return !r.error;
                    });
                    if (!retried) {
                        showToast('Error al actualizar delivery: ' + error.message, true);
                        return;
                    }
                }
                showToast(newValue ? 'Delivery habilitado' : 'Delivery deshabilitado');
                // Actualizar el aria-checked y el texto del estado en vivo
                if (checkboxEl) {
                    checkboxEl.setAttribute('aria-checked', newValue ? 'true' : 'false');
                    const textEl = toggleWrap ? toggleWrap.parentElement.querySelector('.delivery-status-text') : null;
                    if (textEl) {
                        textEl.textContent = newValue ? 'Activo' : 'Inactivo';
                        textEl.classList.toggle('on', !!newValue);
                    }
                }
                // Recargar datos del admin (en background, sin bloquear UI)
                await loadAdminData();
                // No re-renderizamos la tabla completa para no perder el foco del toggle,
                // pero sí actualizamos el estado interno del objeto en allPlaces
                const place = allPlaces.find(p => String(p.id) === String(id));
                if (place) place.delivery_enabled = !!newValue;
            } catch (err) {
                if (checkboxEl) checkboxEl.checked = !newValue;
                showToast('Error inesperado: ' + (err.message || err), true);
            } finally {
                if (toggleWrap) toggleWrap.classList.remove('loading');
            }
        };

        window.filterAdminPlaces = renderAdminPlaces;

        window.adminTogglePlaceStatus = async function(id, current) {
            const newStatus = current === 'published' ? 'draft' : 'published';
            const { error } = await sb.from('places').update({ status: newStatus }).eq('id', id);
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Estado cambiado a ' + newStatus);
            // ★ [v2.0.21] Sincronizar cache público compartido con la home.
            //   Si pasó a 'published' → agregar al cache. Si pasó a 'draft'
            //   → quitarlo del cache (la home solo muestra published).
            if (newStatus === 'published') {
                const place = allPlaces.find(p => String(p.id) === String(id));
                if (place) {
                    place.status = 'published';
                    upsertPublicPlaceInCache(place);
                }
            } else {
                removePublicPlaceFromCache(id);
            }
            await loadAdminData();
            await loadMyPlaces();
            renderAdminPlaces();
        };

        window.adminDeletePlace = async function(id) {
            if (!confirm('Eliminar este local?')) return;
            const { error } = await sb.from('places').delete().eq('id', id);
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Local eliminado');
            // ★ [v2.0.21] Quitar del cache público compartido con la home.
            removePublicPlaceFromCache(id);
            await loadAdminData();
            await loadMyPlaces();
            renderAdminPlaces();
        };

        /* ========================================
           ADMIN: Suscripciones
        ======================================== */
        function getFilteredSubs() {
            let list = [...allSubs];
            const search = ($('adminSubsSearch') || {}).value || '';
            const plan = ($('adminSubsPlanFilter') || {}).value || '';
            const status = ($('adminSubsStatusFilter') || {}).value || '';
            // [U-04] Índice memoizado: incluye plan, estado y notas, no solo nombre
            if (search) {
                const s = search.toLowerCase();
                list = list.filter(sub => buildSubSearchBlob(sub).includes(s));
            }
            if (plan) list = list.filter(s => s.plan === plan);
            if (status) list = list.filter(s => s.status === status);
            return list;
        }

        function renderAdminSubs() {
            const total = allSubs.length;
            const active = allSubs.filter(s => s.status === 'active').length;
            const free = allSubs.filter(s => s.plan === 'free').length;
            const paid = total - free;
            $('adminSubsStats').innerHTML =
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(139,92,246,0.12);color:var(--accent)"><i aria-hidden="true" class="fas fa-credit-card"></i></div><div><div class="admin-quick-stat-value">' + total + '</div><div class="admin-quick-stat-label">Total</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(34,197,94,0.12);color:var(--green)"><i aria-hidden="true" class="fas fa-check-circle"></i></div><div><div class="admin-quick-stat-value">' + active + '</div><div class="admin-quick-stat-label">Activas</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(148,163,184,0.12);color:var(--muted)"><i aria-hidden="true" class="fas fa-box-open"></i></div><div><div class="admin-quick-stat-value">' + free + '</div><div class="admin-quick-stat-label">Free</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(245,158,11,0.12);color:var(--amber)"><i aria-hidden="true" class="fas fa-gem"></i></div><div><div class="admin-quick-stat-value">' + paid + '</div><div class="admin-quick-stat-label">De pago</div></div></div>';

            const list = getFilteredSubs();
            const body = $('adminSubsBody');
            const empty = $('adminSubsEmpty');
            if (list.length === 0) { body.innerHTML = ''; empty.style.display = 'block'; return; }
            empty.style.display = 'none';

            body.innerHTML = list.map(sub => {
                // [F-3.1] XSS: escapar datos del usuario
                const pr = allProfiles.find(p => p.id === sub.user_id);
                const name = pr ? escapeHtml(pr.full_name || pr.email || '?') : '?';
                const safeEmail = pr ? escapeHtml(pr.email || '') : '';
                const initials = escapeHtml(getInitials(pr ? (pr.full_name || pr.email) : '?'));
                const safeSubId = escapeHtml(sub.id);
                return '<tr>' +
                    '<td><div class="user-cell"><div class="user-mini-avatar">' + initials + '</div><div><div class="user-mini-name">' + name + '</div><div class="user-mini-email">' + safeEmail + '</div></div></div></td>' +
                    '<td>' + planBadgeHTML(sub.plan) + '</td>' +
                    '<td>' + statusBadgeHTML(sub.status) + '</td>' +
                    '<td>' + escapeHtml(sub.max_places || 0) + '</td>' +
                    '<td style="font-size:0.82rem;color:var(--muted)">' + (sub.expires_at ? formatDate(sub.expires_at) : 'Sin limite') + '</td>' +
                    '<td><div class="actions-cell"><button class="btn-admin btn-sm" aria-label="Editar suscripción de ' + name + '" onclick="openEditSub(\'' + safeSubId + '\')"><i aria-hidden="true" class="fas fa-edit"></i></button></div></td>' +
                '</tr>';
            }).join('');
        }

        window.filterAdminSubs = renderAdminSubs;

        window.openEditSub = function(id) {
            const sub = allSubs.find(s => s.id === id);
            if (!sub) return;
            $('editSubId').value = id;
            $('editSubPlan').value = sub.plan || 'free';
            $('editSubStatus').value = sub.status || 'active';
            $('editSubMaxPlaces').value = sub.max_places || 1;
            $('editSubExpires').value = sub.expires_at ? sub.expires_at.substring(0, 16) : '';
            $('editSubNotes').value = sub.notes || '';
            openModal('editSubModal');
        };

        window.saveSubEdit = async function() {
            const id = $('editSubId').value;
            const planMax = { free: 1, basic: 3, pro: 10, enterprise: 999 };
            const data = {
                plan: $('editSubPlan').value,
                status: $('editSubStatus').value,
                max_places: parseInt($('editSubMaxPlaces').value) || planMax[$('editSubPlan').value] || 1,
                expires_at: $('editSubExpires').value || null,
                notes: $('editSubNotes').value
            };
            const { error } = await sb.from('subscriptions').update(data).eq('id', id);
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Suscripción actualizada');
            closeModal('editSubModal');
            await loadAdminData();
            renderAdminSubs();
        };

        /* ========================================
           ADMIN: Usuarios
        ======================================== */
        function getFilteredUsers() {
            let list = [...allProfiles];
            const search = ($('adminUsersSearch') || {}).value || '';
            const role = ($('adminUsersRoleFilter') || {}).value || '';
            // [U-04] Índice memoizado: ahora busca también teléfono y rol
            if (search) {
                const s = search.toLowerCase();
                list = list.filter(p => buildUserSearchBlob(p).includes(s));
            }
            if (role) list = list.filter(p => p.role === role);
            return list;
        }

        function renderAdminUsers() {
            const list = getFilteredUsers();
            const body = $('adminUsersBody');
            const empty = $('adminUsersEmpty');
            if (list.length === 0) { body.innerHTML = ''; empty.style.display = 'block'; return; }
            empty.style.display = 'none';

            body.innerHTML = list.map(p => {
                // [F-3.1] XSS: escapar datos
                const search = ($('adminUsersSearch') || {}).value || '';
                // [U-04] Resaltar coincidencias de búsqueda
                const safeName = highlightMatch(p.full_name || 'Sin nombre', search);
                const safeEmail = highlightMatch(p.email || '', search);
                const safePhone = highlightMatch(p.phone || '—', search);
                const safeId = escapeHtml(p.id);
                const safeRole = escapeHtml(p.role || 'owner');
                const initials = escapeHtml(getInitials(p.full_name || p.email));
                // Para el openEditRole y aria-label usamos el nombre escapado SIN <mark>
                const safeNamePlain = escapeHtml(p.full_name || 'Sin nombre');
                const safeNameForAttr = safeNamePlain.replace(/'/g, '&#39;');
                return '<tr>' +
                    '<td><div class="user-cell"><div class="user-mini-avatar">' + initials + '</div><div><div class="user-mini-name">' + safeName + '</div><div class="user-mini-email">' + safeEmail + '</div></div></div></td>' +
                    '<td style="color:var(--muted)">' + safePhone + '</td>' +
                    '<td>' + roleBadgeHTML(safeRole) + '</td>' +
                    '<td style="font-size:0.82rem;color:var(--muted)">' + formatDate(p.created_at) + '</td>' +
                    '<td><div class="actions-cell"><button class="btn-admin btn-sm" aria-label="Cambiar rol de ' + safeNameForAttr + '" onclick="openEditRole(\'' + safeId + '\',\'' + safeNameForAttr + '\',\'' + safeRole + '\')"><i aria-hidden="true" class="fas fa-user-shield"></i></button></div></td>' +
                '</tr>';
            }).join('');
        }

        window.filterAdminUsers = renderAdminUsers;

        window.openEditRole = function(userId, userName, currentRole) {
            $('editRoleUserId').value = userId;
            $('editRoleUserInfo').textContent = 'Usuario: ' + userName;
            $('editRoleValue').value = currentRole;
            openModal('editRoleModal');
        };

        window.saveRoleEdit = async function() {
            // [F-3.6] Verificar que el llamador sea admin antes de ejecutar UPDATE
            if (!requireAdmin('saveRoleEdit')) return;
            const id = $('editRoleUserId').value;
            const role = $('editRoleValue').value;
            // [F-3.1] Validar valor esperado (defense in depth)
            if (!['admin', 'owner'].includes(role)) {
                showToast('Rol inválido', true);
                return;
            }
            try {
                const { error } = await sb.from('profiles').update({ role: role }).eq('id', id);
                if (error) {
                    // [F-5.6] Si error de auth, intentar refresh + reintento
                    const retried = await handleAuthError(error, async () => {
                        const r = await sb.from('profiles').update({ role: role }).eq('id', id);
                        return !r.error;
                    });
                    if (!retried) { showToast('Error: ' + error.message, true); return; }
                }
                showToast('Rol actualizado a ' + role);
                closeModal('editRoleModal');
                await loadAdminData();
                renderAdminUsers();
            } catch (err) {
                showToast('Error inesperado: ' + (err.message || err), true);
            }
        };

        /* ========================================
           ADMIN: Historial de pagos
        ======================================== */
        function renderAdminLog() {
            const body = $('adminLogBody');
            const empty = $('adminLogEmpty');
            if (allLogs.length === 0) { body.innerHTML = ''; empty.style.display = 'block'; return; }
            empty.style.display = 'none';

            body.innerHTML = allLogs.map(log => {
                // [F-3.1] XSS: escapar datos
                const pr = allProfiles.find(p => p.id === log.user_id);
                const name = pr ? escapeHtml(pr.full_name || pr.email || '?') : '?';
                const actionLabels = {
                    created: 'Creada', upgraded: 'Upgrade', downgraded: 'Downgrade',
                    renewed: 'Renovada', cancelled: 'Cancelada', expired: 'Expirada', manual_change: 'Cambio manual'
                };
                const safeAction = escapeHtml(actionLabels[log.action] || log.action);
                return '<tr>' +
                    '<td style="font-size:0.82rem;color:var(--muted)">' + formatDate(log.created_at) + '</td>' +
                    '<td>' + name + '</td>' +
                    '<td><span style="font-weight:600">' + safeAction + '</span></td>' +
                    '<td>' + planBadgeHTML(log.from_plan) + '</td>' +
                    '<td>' + planBadgeHTML(log.to_plan) + '</td>' +
                    '<td>$' + escapeHtml(log.amount || 0) + '</td>' +
                    '<td style="color:var(--muted)">' + escapeHtml(log.payment_method || '—') + '</td>' +
                '</tr>';
            }).join('');
        }


        /* ========================================
           ADMIN: Colecciones — Renderizar
        ======================================== */
        function getCollectionPlaceCount(colId) {
            return allCollectionPlaces.filter(cp => cp.collection_id === colId).length;
        }

        function renderAdminCollections() {
            const total = allCollections.length;
            const active = allCollections.filter(c => c.is_active).length;
            const totalPlaces = allCollectionPlaces.length;

            $('adminColStats').innerHTML =
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(139,92,246,0.12);color:var(--accent)"><i aria-hidden="true" class="fas fa-layer-group"></i></div><div><div class="admin-quick-stat-value">' + total + '</div><div class="admin-quick-stat-label">Total</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(34,197,94,0.12);color:var(--green)"><i aria-hidden="true" class="fas fa-check"></i></div><div><div class="admin-quick-stat-value">' + active + '</div><div class="admin-quick-stat-label">Activas</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(6,182,212,0.12);color:var(--secondary)"><i aria-hidden="true" class="fas fa-store"></i></div><div><div class="admin-quick-stat-value">' + totalPlaces + '</div><div class="admin-quick-stat-label">Lugares vinculados</div></div></div>' +
                '<div class="admin-quick-stat"><div class="admin-quick-stat-icon" style="background:rgba(245,158,11,0.12);color:var(--amber)"><i aria-hidden="true" class="fas fa-palette"></i></div><div><div class="admin-quick-stat-value" style="display:flex;gap:4px;justify-content:center">' +
                    allCollections.filter(c => c.is_active).slice(0, 5).map(c => '<span style="width:16px;height:16px;border-radius:50%;background:' + c.color + ';display:inline-block"></span>').join('') +
                    (active > 5 ? '<span style="color:var(--muted);font-size:0.7rem">+' + (active-5) + '</span>' : '') +
                '</div><div class="admin-quick-stat-label">Colores</div></div></div>';

            const body = $('adminColBody');
            const empty = $('adminColEmpty');

            if (allCollections.length === 0) {
                body.innerHTML = '';
                empty.style.display = 'block';
                return;
            }
            empty.style.display = 'none';

            body.innerHTML = allCollections.map(c => {
                // [F-3.1] XSS: escapar datos. Validar color hex para evitar CSS injection.
                const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
                const safeColor = hexColorRegex.test(c.color || '') ? c.color : '#8b5cf6';
                const safeIcon = /^[a-z0-9-]+$/i.test(c.icon || '') ? escapeHtml(c.icon) : 'fa-bookmark';
                const safeTitle = escapeHtml(c.title || '');
                const safeDesc = escapeHtml(c.description || '');
                const safeId = escapeHtml(c.id);
                const safeSort = escapeHtml(c.sort_order || 0);
                const count = getCollectionPlaceCount(c.id);
                return '<tr>' +
                    '<td><div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;background:' + safeColor + '22;color:' + safeColor + ';display:flex;align-items:center;justify-content:center;flex-shrink:0"><i aria-hidden="true" class="fas ' + safeIcon + '"></i></div><div><div style="font-weight:600">' + safeTitle + '</div><div style="font-size:0.72rem;color:var(--muted)">' + safeDesc + '</div></div></div></td>' +
                    '<td><div style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:14px;border-radius:50%;background:' + safeColor + ';display:inline-block;box-shadow:0 0 8px ' + safeColor + '66"></span><span style="font-size:0.78rem;color:var(--muted);font-family:monospace">' + safeColor + '</span></div></td>' +
                    '<td><span style="font-weight:600">' + escapeHtml(count) + '</span> <span style="color:var(--muted);font-size:0.78rem">lugares</span></td>' +
                    '<td>' + (c.is_active ? '<span class="status-badge status-published">Activa</span>' : '<span class="status-badge status-draft">Inactiva</span>') + '</td>' +
                    '<td style="font-weight:600">' + safeSort + '</td>' +
                    '<td><div class="actions-cell">' +
                        '<button class="btn-admin btn-sm" aria-label="Editar colección ' + safeTitle + '" onclick="openEditCollectionModal(\'' + safeId + '\')" title="Editar"><i aria-hidden="true" class="fas fa-edit"></i></button>' +
                        '<button class="btn-success btn-sm" aria-label="Gestionar lugares de ' + safeTitle + '" onclick="openColPlacesModal(\'' + safeId + '\')" title="Gestionar lugares"><i aria-hidden="true" class="fas fa-store"></i></button>' +
                        '<button class="btn-danger btn-sm" aria-label="Eliminar colección ' + safeTitle + '" onclick="deleteCollection(\'' + safeId + '\')" title="Eliminar"><i aria-hidden="true" class="fas fa-trash"></i></button>' +
                    '</div></td>' +
                '</tr>';
            }).join('');
        }

        /* ========================================
           ADMIN: Colecciones — Crear / Editar
        ======================================== */
        window.openNewCollectionModal = function() {
            $('colModalTitle').textContent = 'Nueva Coleccion';
            $('colEditId').value = '';
            $('colId').value = '';
            $('colId').disabled = false;
            $('colTitle').value = '';
            $('colDesc').value = '';
            $('colIcon').value = 'fa-bookmark';
            $('colSort').value = allCollections.length + 1;
            $('colColor').value = '#8b5cf6';
            $('colBg').value = '#8b5cf6';
            $('colBorder').value = '#8b5cf6';
            $('colActive').checked = true;
            openModal('collectionModal');
        };

        window.openEditCollectionModal = function(id) {
            const c = allCollections.find(x => x.id === id);
            if (!c) return;
            $('colModalTitle').textContent = 'Editar Coleccion';
            $('colEditId').value = c.id;
            $('colId').value = c.id;
            $('colId').disabled = true;
            $('colTitle').value = c.title;
            $('colDesc').value = c.description || '';
            $('colIcon').value = c.icon || 'fa-bookmark';
            $('colSort').value = c.sort_order || 0;
            $('colColor').value = c.color || '#8b5cf6';
            $('colBg').value = (c.bg || 'rgba(139,92,246,0.12)').replace('rgba(', '').replace(',0.12)', '').replace(/[^#0-9a-fA-F]/g, '') || '#8b5cf6';
            $('colBorder').value = (c.border || 'rgba(139,92,246,0.2)').replace('rgba(', '').replace(',0.2)', '').replace(/[^#0-9a-fA-F]/g, '') || '#8b5cf6';
            $('colActive').checked = c.is_active !== false;
            openModal('collectionModal');
        };

        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1,3), 16);
            const g = parseInt(hex.slice(3,5), 16);
            const b = parseInt(hex.slice(5,7), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        }

        window.saveCollection = async function() {
            const editId = $('colEditId').value;
            const newId = $('colId').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            const title = $('colTitle').value.trim();
            const desc = $('colDesc').value.trim();
            const icon = $('colIcon').value.trim();
            const sortOrder = parseInt($('colSort').value) || 0;
            const color = $('colColor').value;
            const bg = hexToRgba($('colBg').value, 0.12);
            const border = hexToRgba($('colBorder').value, 0.2);
            const isActive = $('colActive').checked;

            if (!newId) { showToast('El ID es obligatorio', true); return; }
            if (!title) { showToast('El titulo es obligatorio', true); return; }

            if (editId) {
                const { error } = await sb.from('collections').update({
                    title: title,
                    description: desc,
                    icon: icon,
                    color: color,
                    bg: bg,
                    border: border,
                    sort_order: sortOrder,
                    is_active: isActive,
                    updated_at: new Date().toISOString()
                }).eq('id', editId);
                if (error) { showToast('Error: ' + error.message, true); return; }
                showToast('Coleccion actualizada');
            } else {
                const { error } = await sb.from('collections').insert({
                    id: newId,
                    title: title,
                    description: desc,
                    icon: icon,
                    color: color,
                    bg: bg,
                    border: border,
                    sort_order: sortOrder,
                    is_active: isActive
                });
                if (error) { showToast('Error: ' + error.message, true); return; }
                showToast('Coleccion creada');
            }
            closeModal('collectionModal');
            await loadAdminData();
            renderAdminCollections();
        };

        window.deleteCollection = async function(id) {
            const c = allCollections.find(x => x.id === id);
            if (!c) return;
            if (!confirm('Eliminar la coleccion "' + c.title + '"? Esto tambien quitara todos los lugares vinculados.')) return;
            const { error } = await sb.from('collections').delete().eq('id', id);
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Coleccion eliminada');
            await loadAdminData();
            renderAdminCollections();
        };

        /* ========================================
           ADMIN: Colecciones — Gestionar lugares
        ======================================== */
        window.openColPlacesModal = function(colId) {
            const c = allCollections.find(x => x.id === colId);
            if (!c) return;
            $('colPlacesEditId').value = colId;
            $('colPlacesTitle').textContent = 'Lugares en: ' + c.title;
            $('colPlacesSubtitle').textContent = c.description || '';

            const sel = $('colPlaceSelect');
            sel.innerHTML = '<option value="">Seleccionar un lugar...</option>';
            allPlaces.forEach(p => {
                sel.innerHTML += '<option value="' + p.id + '">' + p.name + ' (' + (p.category||'') + ')</option>';
            });

            $('colStaticId').value = '';
            renderColPlacesList(colId);
            openModal('colPlacesModal');
        };

        function renderColPlacesList(colId) {
            const rels = allCollectionPlaces.filter(cp => cp.collection_id === colId);
            const container = $('colPlacesList');

            if (rels.length === 0) {
                container.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:20px 0">No hay lugares en esta coleccion.</p>';
                return;
            }

            container.innerHTML = rels.map((cp, idx) => {
                let name = '';
                let typeLabel = '';
                let removeFn = '';

                if (cp.place_id) {
                    const place = allPlaces.find(p => p.id === cp.place_id);
                    name = place ? place.name : cp.place_id.substring(0, 8) + '...';
                    typeLabel = '<span style="font-size:0.7rem;color:var(--secondary)">DB</span>';
                    removeFn = 'removePlaceFromCollection(\'db\',\'' + cp.id + '\')' ;
                } else if (cp.static_place_id) {
                    name = 'Lugar #' + cp.static_place_id + ' (estatico)';
                    typeLabel = '<span style="font-size:0.7rem;color:var(--amber)">Estatico</span>';
                    removeFn = 'removePlaceFromCollection(\'static\',\'' + cp.id + '\')' ;
                }

                return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border-soft);border-radius:10px;margin-bottom:6px;background:var(--card)">' +
                    '<div style="flex:1;display:flex;align-items:center;gap:8px"><span style="font-weight:600;font-size:0.88rem">' + name + '</span>' + typeLabel + '</div>' +
                    '<button class="btn-danger btn-sm" onclick="' + removeFn + '" style="padding:4px 8px"><i aria-hidden="true" class="fas fa-times"></i></button>' +
                '</div>';
            }).join('');
        }

        window.addPlaceToCollection = async function() {
            const colId = $('colPlacesEditId').value;
            const placeId = $('colPlaceSelect').value;
            if (!placeId) { showToast('Selecciona un lugar', true); return; }

            const { error } = await sb.from('collection_places').insert({
                collection_id: colId,
                place_id: placeId
            });
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Lugar agregado');
            $('colPlaceSelect').value = '';
            await loadAdminData();
            renderColPlacesList(colId);
            renderAdminCollections();
        };

        window.addStaticPlaceToCollection = async function() {
            const colId = $('colPlacesEditId').value;
            const staticId = parseInt($('colStaticId').value);
            if (!staticId || staticId < 1) { showToast('Ingresa un ID valido (1-300)', true); return; }

            const { error } = await sb.from('collection_places').insert({
                collection_id: colId,
                static_place_id: staticId
            });
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Lugar estatico agregado');
            $('colStaticId').value = '';
            await loadAdminData();
            renderColPlacesList(colId);
            renderAdminCollections();
        };

        window.removePlaceFromCollection = async function(type, id) {
            if (!confirm('Quitar este lugar de la coleccion?')) return;
            const { error } = await sb.from('collection_places').delete().eq('id', id);
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Lugar removido');
            const colId = $('colPlacesEditId').value;
            await loadAdminData();
            renderColPlacesList(colId);
            renderAdminCollections();
        };
        /* ========================================
           SETTINGS: Renderizar
        ======================================== */
        function renderSettings() {
            $('s-name').value = userProfile.full_name || '';
            $('s-email').value = userProfile.email || currentUser.email;
            $('s-phone').value = userProfile.phone || '';

            const planLabels = { free: 'Gratis — 1 local', basic: 'Basic — 3 locales', pro: 'Pro — 10 locales', enterprise: 'Enterprise — Ilimitados' };
            $('settingsSubInfo').innerHTML =
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">' +
                    planBadgeHTML(userSubscription.plan) +
                    statusBadgeHTML(userSubscription.status) +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem">' +
                    '<div><span style="color:var(--muted)">Plan:</span> <strong>' + (planLabels[userSubscription.plan] || userSubscription.plan) + '</strong></div>' +
                    '<div><span style="color:var(--muted)">Max locales:</span> <strong>' + (userSubscription.max_places || 0) + '</strong></div>' +
                    '<div><span style="color:var(--muted)">Expira:</span> <strong>' + (userSubscription.expires_at ? formatDate(userSubscription.expires_at) : 'Sin limite') + '</strong></div>' +
                    '<div><span style="color:var(--muted)">Inicio:</span> <strong>' + formatDate(userSubscription.starts_at) + '</strong></div>' +
                '</div>';
        }

        window.saveProfile = async function() {
            const { error } = await sb.from('profiles').update({
                full_name: $('s-name').value.trim(),
                phone: $('s-phone').value.trim()
            }).eq('id', currentUser.id);
            if (error) { showToast('Error: ' + error.message, true); return; }
            userProfile.full_name = $('s-name').value.trim();
            userProfile.phone = $('s-phone').value.trim();
            $('sidebarUserName').textContent = userProfile.full_name || currentUser.email;
            const avatar = $('sidebarAvatar');
            if (userProfile.role !== 'admin') avatar.textContent = getInitials(userProfile.full_name);
            showToast('Perfil guardado correctamente');
        };

        window.showChangePwModal = function() {
            $('newPw').value = '';
            $('newPwConfirm').value = '';
            openModal('changePwModal');
        };

        window.changePassword = async function() {
            const pw = $('newPw').value;
            const confirm = $('newPwConfirm').value;
            if (pw.length < 6) { showToast('Mínimo 6 caracteres', true); return; }
            if (pw !== confirm) { showToast('Las contraseñas no coinciden', true); return; }
            const { error } = await sb.auth.updateUser({ password: pw });
            if (error) { showToast('Error: ' + error.message, true); return; }
            showToast('Contraseña cambiada correctamente');
            closeModal('changePwModal');
        };

        /* ========================================
           INIT
        ======================================== */
        (async function init() {
            // Iniciar tags e imagenes
            initTags();
            initImageGrid();
            // ★ [v2.0.34] Listener del helper link de Google Maps: actualiza
            //   el href del botón "Abrir en Google Maps" en vivo mientras el
            //   dueño escribe en lat/lng/gmaps_url/name/address.
            initGmapsHelperListener();

            // ★ FIX [v2.0.23] Reintentar cola con exponential backoff.
            //   Antes, el interval de 30s reintenta ops en 'retry' para siempre,
            //   sin importar cuántas veces fallaron. Si el servidor está caído,
            //   genera tráfico inútil y consume batería (crítico en móviles).
            //   Ahora: cada op tiene su propio backoff basado en `attempts`.
            //   Intervalo por op = 30s × 2^min(attempts, 5) → 30s, 60s, 2m, 4m, 8m, 16m.
            setInterval(() => {
                if (!navigator.onLine) return;
                if (typeof processQueueNow !== 'function') return;
                getPendingOps().then(ops => {
                    const now = Date.now();
                    const pending = ops.filter(o => {
                        if (o.status !== 'pending' && o.status !== 'retry') return false;
                        // Las 'pending' (nunca procesadas) se ejecutan de inmediato.
                        if (o.status === 'pending') return true;
                        // Las 'retry' respetan el backoff.
                        const attempts = o.attempts || 0;
                        const backoffMs = 30000 * Math.pow(2, Math.min(attempts, 5));
                        const lastAttempt = o.last_attempt_at ? new Date(o.last_attempt_at).getTime() : 0;
                        return (now - lastAttempt) >= backoffMs;
                    });
                    if (pending.length > 0) {
                        console.log('[Queue] Reintentando', pending.length, 'ops (backoff aplicado)');
                        processQueueNow();
                    }
                });
            }, 30000);

            // [F-5.5] Listener de estado de conexión online/offline
            function updateConnectionIndicator() {
                const ind = $('connectionIndicator');
                const lbl = $('connectionLabel');
                if (!ind || !lbl) return;
                if (navigator.onLine) {
                    ind.style.background = 'rgba(34,197,94,0.12)';
                    ind.style.borderColor = 'rgba(34,197,94,0.25)';
                    ind.style.color = 'var(--green)';
                    ind.querySelector('i').className = 'fas fa-wifi';
                    lbl.textContent = 'En línea';
                } else {
                    ind.style.background = 'rgba(245,158,11,0.12)';
                    ind.style.borderColor = 'rgba(245,158,11,0.25)';
                    ind.style.color = 'var(--amber)';
                    ind.querySelector('i').className = 'fas fa-wifi-slash';
                    lbl.textContent = 'Sin conexión';
                }
            }
            window.addEventListener('online', () => {
                updateConnectionIndicator();
                showToast('Conexión restaurada', false);
                // [F-5.1+] Procesar cola de operaciones pendientes al volver la conexión
                // Intentar Background Sync primero; si no está soportado, usar fallback en cliente
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    navigator.serviceWorker.ready.then(reg => {
                        return reg.sync.register('sabormap-sync-queue');
                    }).catch(() => {
                        if (typeof processQueueNow === 'function') processQueueNow();
                    });
                } else if (typeof processQueueNow === 'function') {
                    processQueueNow();
                }
                // Reintentar carga de datos si estamos en el dashboard
                if ($('dashboardWrap').classList.contains('visible')) {
                    loadMyPlaces().then(() => {
                        renderOverview();
                        if (isAdmin()) loadAdminData();
                    });
                }
            });
            window.addEventListener('offline', () => {
                updateConnectionIndicator();
                showToast('Sin conexión a internet. Las operaciones se guardarán localmente.', true);
            });
            updateConnectionIndicator();

            // [F-5.2 + v2.0.19] Recuperar borrador al cargar el panel add-place.
            //   Ahora también:
            //   · Recupera las URLs de imágenes (las File no se pueden
            //     serializar, pero las URLs ya subidas sí).
            //   · Muestra el indicador "Borrador guardado · HH:MM" con la
            //     fecha real del draft para que el usuario sepa qué recuperó.
            //   · Auto-restaura sin preguntar si el draft es muy reciente
            //     (< 5 min) — comportamiento tipo "continuar donde lo dejé".
            const checkDraftOnPanelSwitch = (panelId) => {
                if (panelId === 'add-place' && !editingPlaceId) {
                    loadPlaceDraft().then(draft => {
                        if (!draft || !draft.savedAt) return;
                        const savedDate = new Date(draft.savedAt);
                        const minutesAgo = (Date.now() - savedDate.getTime()) / 60000;
                        const hoursAgo = (minutesAgo / 60).toFixed(1);
                        const timeLabel = savedDate.toLocaleTimeString('es-CU', { hour: '2-digit', minute: '2-digit' });

                        /* Si el draft tiene nombre, es muy reciente y no hay
                           nada cargado aún, restauramos sin preguntar. */
                        const hasContentAlready = ($('f-name') || {}).value || placeMenu.length || placeTags.length;
                        const autoRestore = draft.name && minutesAgo < 5 && !hasContentAlready;
                        const shouldRestore = autoRestore || confirm(
                            'Tienes un borrador sin guardar de hace ' + hoursAgo + ' hora(s) (guardado a las ' + timeLabel + ').\n\n¿Quieres recuperarlo?'
                        );

                        if (shouldRestore) {
                            // Restaurar campos
                            // ★ [v2.0.34] Añadidos: lat, lng, gmaps_url, plus_code.
                            const fields = ['name','category','neighborhood','address','phone','description','price_range','schedule','must_order','editor_note','lat','lng','gmaps_url','plus_code'];
                            fields.forEach(f => {
                                const el = $('f-' + f);
                                if (el && draft[f] !== undefined) el.value = draft[f];
                            });
                            placeTags = Array.isArray(draft.tags) ? draft.tags.slice() : [];
                            placeMenu = Array.isArray(draft.menu) ? JSON.parse(JSON.stringify(draft.menu)) : [];
                            placeLinks = Array.isArray(draft.links) ? JSON.parse(JSON.stringify(draft.links)) : [];
                            /* Recuperar las URLs de imágenes que ya estaban subidas.
                               Las File no se pueden recuperar, solo las URLs. */
                            if (Array.isArray(draft.imageMeta)) {
                                placeImages = draft.imageMeta
                                    .filter(m => m && m.kind === 'url')
                                    .map(m => m.url);
                                /* Si tenía File images que se perdieron, avisar. */
                                const lostFiles = draft.imageMeta.filter(m => m && m.kind === 'file');
                                if (lostFiles.length > 0) {
                                    setTimeout(() => showToast('Se perdieron ' + lostFiles.length + ' imagen(es) no subidas del borrador. Vuelve a subirlas.', true), 800);
                                }
                            }
                            renderTags();
                            renderMenuEditor();
                            renderLinksEditor();
                            initImageGrid();
                            // ★ [v2.0.34] Refresh del helper link tras restaurar
                            //   el draft desde el panel switch (auto-restore).
                            if (typeof updateGmapsHelperHref === 'function') updateGmapsHelperHref();
                            _hasUnsavedChanges = false;  // ya restaurado
                            updateDraftIndicator('saved');
                            showToast('Borrador recuperado (guardado a las ' + timeLabel + ')');
                        } else {
                            clearPlaceDraft();
                        }
                    });
                }
            };
            // Hook al switchPanel para detectar cuando se entra al add-place
            const _origSwitchPanel = window.switchPanel;
            window.switchPanel = function(panelId, linkEl) {
                _origSwitchPanel(panelId, linkEl);
                checkDraftOnPanelSwitch(panelId);
            };

            // Verificar sesión
            const { data: { session } } = await sb.auth.getSession();
            if (session) {
                await enterDashboard();
            }

            // Escuchar cambios
            sb.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    await enterDashboard();
                } else if (event === 'SIGNED_OUT') {
                    $('dashboardWrap').classList.remove('visible');
                    $('authScreen').style.display = 'flex';
                    showView('login');
                } else if (event === 'TOKEN_REFRESHED') {
                    // [F-5.6] Token refrescado exitosamente, no hacer nada
                    console.log('Token refrescado');
                } else if (event === 'INITIAL_SESSION') {
                    // Sesión inicial ya manejada arriba
                }
            });
        })();

        /* ═══════════════════════════════════════════════════
           [F-5.1] SERVICE WORKER + OFFLINE
           ───────────────────────────────────────────────────
           Soporte offline del dashboard. En Cuba, donde los cortes de
           internet y electricidad son frecuentes, esto permite que el
           panel cargue (al menos el shell) sin conexión y que las
           visitas recurrentes sean instantáneas.

           [W-02] Sin recarga automática al actualizar el SW: solo se
           avisa al usuario con un toast para que decida cuándo recargar.
           ═══════════════════════════════════════════════════ */
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw1.js', { scope: './' })
                    .then(reg => {
                        console.log('[SW] Registrado con scope:', reg.scope);
                    })
                    .catch(err => {
                        console.error('[SW] Error al registrar:', err);
                    });
            });
            // [W-02] Sin recarga automática (riesgo de bucle): se avisa al usuario
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (typeof showToast === 'function') {
                    showToast('SaborMap se ha actualizado. Recarga para ver los cambios.');
                }
            });
            // [F-5.1+] Listener de mensajes del SW para Background Sync
            // El SW envía 'execute-op' cuando el navegador dispira sync;
            // el cliente ejecuta la op contra Supabase y responde.
            navigator.serviceWorker.addEventListener('message', async (event) => {
                const data = event.data;
                if (!data) return;
                if (data.type === 'execute-op' && data.op) {
                    try {
                        const result = await executeOp(data.op);
                        // Responder al SW
                        if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({
                                type: 'op-result',
                                messageId: data.messageId,
                                result: result
                            });
                        }
                        // Si fue exitosa, recargar datos, actualizar badge y
                        // limpiar el draft asociado a esta operación (si tenía).
                        if (result.ok) {
                            showToast('Operación sincronizada: ' + (data.op.metadata && data.op.metadata.placeName || data.op.type));

                            // ★ FIX [sold_out-sync v2.0.31] Igual que en
                            //   processQueueNow (fix #2), hay que reflejar el cambio
                            //   en el cache publico compartido con la home.
                            //   Background Sync pasa por aqui, no por processQueueNow,
                            //   asi que sin este bloque el path SW-sync quedaria sin
                            //   sincronizar (mismo bug que el que se arregla en
                            //   processQueueNow).
                            try {
                                if (data.op.type === 'place_delete' || data.op.type === 'place_unpublish') {
                                    removePublicPlaceFromCache(data.op.payload.id);
                                } else if (
                                    (data.op.type === 'place_insert' || data.op.type === 'place_update' || data.op.type === 'place_publish') &&
                                    result.data && Array.isArray(result.data) && result.data[0]
                                ) {
                                    upsertPublicPlaceInCache(result.data[0]);
                                }
                            } catch (e) { /* no critico */ }

                            // [v2.0.19] Limpiar el draft de localStorage asociado
                            // a esta op (si existe). Solo operaciones place_insert /
                            // place_update tienen draftId en metadata.
                            try {
                                const meta = data.op.metadata || {};
                                if (meta.draftLSKey) {
                                    localStorage.removeItem(meta.draftLSKey);
                                }
                                if (meta.draftId !== undefined) {
                                    // También limpiar de IndexedDB
                                    const db = await openDraftDB();
                                    if (db) {
                                        const tx = db.transaction('place_form', 'readwrite');
                                        tx.objectStore('place_form').delete(meta.draftId || 'new');
                                    }
                                }
                            } catch (e) { /* no crítico */ }
                            await loadMyPlaces();
                            renderOverview();
                            if (isAdmin() && typeof loadAdminData === 'function') {
                                await loadAdminData();
                            }
                            updatePendingBadge();
                        }
                    } catch (err) {
                        if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({
                                type: 'op-result',
                                messageId: data.messageId,
                                result: { ok: false, fatal: false, error: err.message || String(err) }
                            });
                        }
                    }
                } else if (data.type === 'queue-processed') {
                    // El SW terminó de procesar la cola: actualizar badge
                    updatePendingBadge();
                }
            });
        }

        /* ═══════════════════════════════════════════════════
           [PWA] BANNER DE INSTALACIÓN
           ───────────────────────────────────────────────────
           Detecta si ya está instalada (standalone) y recuerda si el
           usuario lo cerró (localStorage, 7 días). Instalación nativa
           1-clic en Android/Desktop; instrucciones manuales en iOS.
           ═══════════════════════════════════════════════════ */
        (function setupPwaBanner() {
            let deferredPrompt = null;
            const banner = document.createElement('div');
            banner.id = 'pwaInstallBanner';
            banner.setAttribute('inert', '');
            banner.setAttribute('aria-hidden', 'true');
            banner.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(150px);width:calc(100% - 48px);max-width:380px;background:var(--card);border:1px solid var(--accent);border-radius:16px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,0.4);z-index:60;opacity:0;transition:all 0.5s cubic-bezier(0.22,1,0.36,1);display:flex;align-items:center;gap:14px';
            banner.innerHTML =
                '<div style="width:40px;height:40px;background:var(--accent);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;flex-shrink:0">' +
                '<i aria-hidden="true" class="fas fa-mobile-screen"></i></div>' +
                '<div id="pwaBannerContent" style="flex:1;cursor:pointer">' +
                '<p style="font-size:0.85rem;font-weight:700;color:var(--cream);margin-bottom:2px">Instala SaborMap</p>' +
                '<p id="pwaBannerText" style="font-size:0.72rem;color:var(--muted);line-height:1.4">Toca aquí para instalar la app en tu dispositivo.</p>' +
                '</div>' +
                '<button id="pwaBannerCloseBtn" style="background:none;border:none;color:var(--muted);font-size:1rem;cursor:pointer;padding:4px" aria-label="Cerrar banner">' +
                '<i aria-hidden="true" class="fas fa-times"></i></button>';
            document.body.appendChild(banner);

            const DISMISS_KEY = 'pwaDashboardBannerDismissedAt';
            const DISMISS_DAYS = 7;

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                /* [v2.0.20] Mostrar botón "Instalar App" en el top-bar */
                const topBtn = document.getElementById('installAppBtn');
                if (topBtn) topBtn.style.display = 'inline-flex';
            });

            /* [v2.0.20] Cuando se instala la app, ocultar el botón top-bar */
            window.addEventListener('appinstalled', () => {
                const topBtn = document.getElementById('installAppBtn');
                if (topBtn) topBtn.style.display = 'none';
            });

            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
            const isIOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
            const dismissedRecent = dismissedAt && (Date.now() - dismissedAt) < DISMISS_DAYS * 864e5;

            /* [v2.0.20] Exponer función global para el botón top-bar */
            window.installPwaApp = async function() {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        console.log('[PWA] Usuario aceptó instalar');
                        showToast('SaborMap se está instalando…');
                    } else {
                        console.log('[PWA] Usuario canceló instalación');
                    }
                    deferredPrompt = null;
                    const topBtn = document.getElementById('installAppBtn');
                    if (topBtn) topBtn.style.display = 'none';
                    closeBanner(true);
                } else if (isIOS) {
                    showToast('Para instalar: toca el icono Compartir y elige "Agregar a pantalla de inicio"');
                } else {
                    showToast('Instalación no disponible en este navegador. Usa Chrome o Edge.');
                }
            };

            function showBanner() {
                banner.style.opacity = '1';
                banner.style.transform = 'translateX(-50%) translateY(0)';
                banner.removeAttribute('inert');
                banner.setAttribute('aria-hidden', 'false');
            }
            function closeBanner(saveDismissed) {
                banner.style.opacity = '0';
                banner.style.transform = 'translateX(-50%) translateY(150px)';
                banner.setAttribute('inert', '');
                banner.setAttribute('aria-hidden', 'true');
                if (saveDismissed) localStorage.setItem(DISMISS_KEY, String(Date.now()));
            }

            if (!isStandalone && !dismissedRecent) {
                const txt = document.getElementById('pwaBannerText');
                if (isIOS && txt) txt.innerText = 'Toca el icono Compartir y elige "Agregar a pantalla de inicio".';
                setTimeout(showBanner, 5000);
            }

            const content = document.getElementById('pwaBannerContent');
            if (content) content.addEventListener('click', () => {
                if (typeof window.installPwaApp === 'function') window.installPwaApp();
            });

            const closeBtn = document.getElementById('pwaBannerCloseBtn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeBanner(true));

            window.addEventListener('appinstalled', () => closeBanner(false));
        })();

    })();
    </script>
<script>
/* [A-14] Enter/Espacio activa los elementos <a role="button"> sin href */
document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target;
    if (t && t.matches && t.matches('a[role="button"][tabindex="0"]')) {
        e.preventDefault();
        t.click();
    }
});
</script>
</body>
</html>

