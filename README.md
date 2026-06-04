# JuanMa Crypto — Red de Webs

Web personal + HUB de administración de la red de webs de **JuanMa Crypto**.

> Web3 gaming · Play to earn · "Jugamos, nos Divertimos y Facturamos"

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** style components
- **Prisma** + **PostgreSQL** (Neon en producción, Docker local)
- **NextAuth v5 (Auth.js)** con Google OAuth
- **next-intl** (i18n es/en)
- **Framer Motion** (animaciones)
- **cron-job.org** (auto-refresh diario de métricas)

---

## Requisitos

- Node.js 20+
- npm 10+ (o pnpm)
- Docker (para Postgres local) o una URL de Postgres
- Cuenta de Google Cloud (para OAuth y opcionalmente YouTube Data API)

---

## Setup local paso a paso

### 1. Instalar dependencias

```bash
cd personal_web
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y rellena al menos:

- `DATABASE_URL` — apuntando a tu Postgres local
- `AUTH_SECRET` — genera con `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET` — desde Google Cloud Console
- `CRON_SECRET` — string aleatorio largo

El resto (YouTube, Telegram, Discord, Resend) puede quedarse vacío al inicio.

### 3. Levantar Postgres local

```bash
docker compose up -d
```

Verifica que el contenedor `juanmacrypto-postgres` está corriendo.

### 4. Aplicar el schema y sembrar datos iniciales

```bash
npm run db:migrate    # crea las tablas
npm run db:seed       # inserta sitios, partners, testimonios, logros placeholder
```

### 5. Crear tu usuario admin

El primer login con Google creará tu usuario. Después necesitas hacerlo **OWNER** manualmente:

```bash
npm run db:studio
```

Abre Prisma Studio, ve a la tabla `User`, edita tu usuario y pon `role = OWNER`.

### 6. Arrancar el dev server

```bash
npm run dev
```

Abre:
- Web personal: http://localhost:3000
- HUB admin: http://localhost:3000/hub (te redirige a login)

---

## Configurar Google OAuth

1. Ve a https://console.cloud.google.com/apis/credentials
2. Crea un proyecto (o usa uno existente)
3. **OAuth consent screen**: configura con tu email y scopes `email`, `profile`, `openid`
4. **Credentials** → Create OAuth client ID → Web application
5. Authorized JavaScript origins: `http://localhost:3000`
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copia Client ID y Client Secret a `.env.local` en `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`

---

## Configurar auto-refresh de métricas (opcional)

### YouTube

1. Google Cloud Console → **APIs & Services** → Library → habilita **YouTube Data API v3**
2. Crea una API key
3. Pon `YOUTUBE_API_KEY` y `YOUTUBE_CHANNEL_ID` en `.env.local`

### Telegram

1. Habla con [@BotFather](https://t.me/BotFather) en Telegram
2. Crea un bot: `/newbot` → sigue instrucciones
3. Copia el token a `TELEGRAM_BOT_TOKEN`
4. **Añade el bot como admin** en tu canal (`@JuanMaYoutube`) y grupo (`@JuanMaCryptoYoutube`)
5. Pon los usernames en `TELEGRAM_CHANNEL_USERNAME` y `TELEGRAM_GROUP_USERNAME`

### Discord

1. https://discord.com/developers/applications → New Application
2. Bot → Add Bot → copia el token a `DISCORD_BOT_TOKEN`
3. OAuth2 → URL Generator → scopes `bot` + `applications.commands`
4. Genera invite, agrega el bot a tu servidor

### Configurar cron-job.org

1. Crea cuenta gratis en https://cron-job.org
2. New Cron Job:
   - URL: `https://TU-DOMINIO.vercel.app/api/cron/refresh-metrics?secret=TU_CRON_SECRET`
   - Cada 24 horas (ej. 06:00 UTC)
3. Guarda

El endpoint está protegido por `CRON_SECRET`, solo se ejecuta si coincide.

---

## Estructura del proyecto

```
personal_web/
├── prisma/
│   ├── schema.prisma       # Modelos de DB
│   └── seed.ts             # Datos iniciales
├── messages/                # i18n es/en
├── public/                  # Assets estáticos
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (personal)/ # Web personal
│   │   │   │   ├── page.tsx
│   │   │   │   ├── partners/
│   │   │   │   ├── testimonials/
│   │   │   │   ├── achievements/
│   │   │   │   └── contact/
│   │   │   └── (hub)/      # HUB admin
│   │   │       ├── page.tsx (dashboard)
│   │   │       ├── sites/
│   │   │       ├── analytics/
│   │   │       ├── promos/
│   │   │       ├── partners/
│   │   │       ├── testimonials/
│   │   │       ├── feedback/
│   │   │       ├── content/
│   │   │       ├── settings/
│   │   │       └── login/
│   │   ├── api/            # API routes
│   │   │   ├── auth/
│   │   │   ├── track/
│   │   │   ├── contact/
│   │   │   └── cron/refresh-metrics/
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/             # shadcn-style
│   │   ├── shared/         # Header, Footer, etc
│   │   ├── personal/       # Hero, SloganTriad, etc
│   │   └── hub/            # HubSidebar, etc
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── db.ts           # Prisma client
│   │   ├── i18n.ts
│   │   ├── seo.ts
│   │   ├── navigation.ts
│   │   ├── analytics.ts
│   │   ├── metrics.ts      # Fetchers de YouTube, Telegram, Discord
│   │   └── utils.ts
│   └── middleware.ts       # Subdominios + i18n + auth
├── docker-compose.yml
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## Scripts disponibles

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Build de producción
npm run start        # Run build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier
npm run db:generate  # Prisma generate
npm run db:migrate   # Prisma migrate dev
npm run db:studio    # Prisma Studio (GUI de DB)
npm run db:seed      # Ejecutar seed
npm run db:reset     # Reset DB (BORRA TODO)
```

---

## Desplegar en Vercel

1. Sube el código a GitHub
2. Ve a https://vercel.com → New Project → importa el repo
3. Configura las variables de entorno (copia de `.env.local`)
4. **IMPORTANTE**: en Vercel, añade tu dominio `manko.blog` y configura DNS en Cloudflare
5. Deploy

### Configurar dominios en Vercel

- `manko.blog` (raíz) → apunta al deployment
- `hub.manko.blog` (subdominio) → apunta al mismo deployment; el middleware separa
- `www.manko.blog` → redirect a `manko.blog`

---

## Personalización rápida

- **Bio / textos**: `messages/es.json` y `messages/en.json` (namespace `about`, `contact`, `hero`)
- **Colores / tema**: `tailwind.config.ts` (sección `theme.extend.colors.brand`)
- **Eslogan**: `messages/*.json` (`brand.tagline`) y BD (`SiteContent` con key `personal.hero.tagline`)
- **Partners**: HUB admin → Partners
- **Testimonios**: HUB admin → Testimonials
- **Logros**: HUB admin → Content (o agrega más en seed.ts)

---

## Roadmap próximo

- [ ] CRUD completo de Partners, Testimonials, Promos desde HUB
- [ ] Editor de contenido dinámico desde HUB
- [ ] Búsqueda interna y filtros
- [ ] Tools (calculadoras)
- [ ] SFL_Watcher web
- [ ] Project Tracker
- [ ] Blog semanal
- [ ] Eldoria web

Ver `../GUIA_MAESTRA_RED_WEBS_JUANMA_CRYPTO.md` para la guía completa del proyecto.

---

**Hecho con 💚 por JuanMa Crypto · Web3 gaming · Play to earn**
