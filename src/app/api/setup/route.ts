import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MetricSource, SiteStatus, PartnerStatus, TestimonialStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') ?? req.headers.get('x-setup-secret');
  if (!process.env.SETUP_SECRET) {
    return NextResponse.json(
      { error: 'SETUP_SECRET no está configurado en env vars' },
      { status: 500 },
    );
  }
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const results: string[] = [];

    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json({
        ok: false,
        message: 'La DB ya tiene usuarios. Setup ya fue ejecutado.',
        users: userCount,
      });
    }

    // ===== Sites =====
    await prisma.site.upsert({
      where: { slug: 'personal' },
      update: {},
      create: {
        slug: 'personal',
        name: 'JuanMa Crypto — Web Personal',
        subdomain: 'manko.blog',
        description: 'Web personal de JuanMa Crypto: biografía, redes, partners, contacto.',
        accentColor: '#00FFA3',
        status: SiteStatus.ACTIVE,
      },
    });
    results.push('site:personal');

    await prisma.site.upsert({
      where: { slug: 'hub' },
      update: {},
      create: {
        slug: 'hub',
        name: 'HUB Admin',
        subdomain: 'hub.manko.blog',
        description: 'Panel de administración de la red de webs.',
        accentColor: '#7B61FF',
        status: SiteStatus.ACTIVE,
      },
    });
    results.push('site:hub');

    // ===== Metrics =====
    const metricsData = [
      {
        source: MetricSource.YOUTUBE_SUBSCRIBERS,
        label: 'Suscriptores YouTube',
        url: 'https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA',
      },
      {
        source: MetricSource.TELEGRAM_CHANNEL_MEMBERS,
        label: 'Canal de Telegram',
        url: 'https://t.me/JuanMaYoutube',
      },
      {
        source: MetricSource.TELEGRAM_GROUP_MEMBERS,
        label: 'Grupo de Telegram',
        url: 'https://t.me/JuanMaCryptoYoutube',
      },
      {
        source: MetricSource.WHATSAPP_MEMBERS,
        label: 'Comunidad WhatsApp',
        url: 'https://chat.whatsapp.com/IIK0cfzMj8qDAv8Zhcko9q',
      },
      {
        source: MetricSource.DISCORD_MEMBERS,
        label: 'Discord',
        url: 'https://discord.gg/juanma.98',
      },
    ];
    for (const m of metricsData) {
      await prisma.metric.upsert({
        where: { source: m.source },
        update: {},
        create: { ...m, value: BigInt(0), displayValue: '—', autoRefresh: true },
      });
    }
    results.push(`metrics:${metricsData.length}`);

    // ===== Partners =====
    await prisma.partner.upsert({
      where: { id: 'seed-sunflowerland' },
      update: {},
      create: {
        id: 'seed-sunflowerland',
        name: 'Sunflower Land',
        logo: '/images/partners/sunflower-land.svg',
        website: 'https://sunflower-land.com',
        telegram: 'https://t.me/sunflowerland',
        status: PartnerStatus.ACTIVE,
        isFeatured: true,
        notes: 'Partnership activo. Juego P2E de farming en Polygon.',
      },
    });
    await prisma.partner.upsert({
      where: { id: 'seed-eldoria' },
      update: {},
      create: {
        id: 'seed-eldoria',
        name: 'Eldoria MMORPG',
        logo: '/images/partners/eldoria.svg',
        website: 'https://eldoria.com',
        telegram: 'https://t.me/eldoria',
        status: PartnerStatus.ACTIVE,
        isFeatured: true,
        notes: 'Partnership activo. MMORPG web3 con play-to-earn.',
      },
    });
    results.push('partners:2');

    // ===== Testimonials =====
    await prisma.testimonial.createMany({
      data: [
        {
          authorName: 'Lorem Ipsum Partner',
          authorRole: 'CEO, Sunflower Land',
          authorPhoto: '/images/testimonials/placeholder-1.svg',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. JuanMa es un creador increíble con una comunidad muy activa. Su trabajo con nuestro proyecto ha sido excepcional.',
          category: 'PARTNER',
          status: TestimonialStatus.PENDING,
          visibleOn: ['personal'],
        },
        {
          authorName: 'Lorem Ipsum Creator',
          authorRole: 'Creador de contenido web3',
          authorPhoto: '/images/testimonials/placeholder-2.svg',
          content:
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. JuanMa siempre comparte contenido de calidad y herramientas útiles para la comunidad.',
          category: 'CREATOR',
          status: TestimonialStatus.PENDING,
          visibleOn: ['personal'],
        },
        {
          authorName: 'Lorem Ipsum Community',
          authorRole: 'Miembro de la comunidad',
          authorPhoto: '/images/testimonials/placeholder-3.svg',
          content:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco. Gracias a JuanMa descubrí varios proyectos web3 y aprendí a generar income extra con ellos.',
          category: 'COMMUNITY',
          status: TestimonialStatus.PENDING,
          visibleOn: ['personal'],
        },
      ],
    });
    results.push('testimonials:3');

    // ===== Achievements =====
    await prisma.achievement.createMany({
      data: [
        {
          title: 'Lorem ipsum achievement #1',
          description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          date: new Date('2025-01-15'),
          category: 'Community',
          featured: true,
          order: 1,
        },
        {
          title: 'Lorem ipsum achievement #2',
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          date: new Date('2025-06-20'),
          category: 'Partnership',
          featured: true,
          order: 2,
        },
        {
          title: 'Lorem ipsum achievement #3',
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
          date: new Date('2025-12-10'),
          category: 'Content',
          featured: true,
          order: 3,
        },
      ],
    });
    results.push('achievements:3');

    // ===== SiteContent =====
    const contentEntries = [
      {
        key: 'personal.hero.tagline',
        value: {
          es: 'Jugamos, nos Divertimos y Facturamos',
          en: 'We Play, Have Fun and Invoice',
        },
      },
      {
        key: 'personal.about.bio',
        value: {
          es: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. JuanMa es un creador de contenido especializado en juegos web3 donde puedes generar dinero de forma gratuita o con baja inversión. Con años de experiencia en el sector, comparte herramientas, tutoriales y análisis honestos de proyectos play-to-earn. Su misión es ayudar a otros a descubrir oportunidades reales en el mundo crypto gaming, siempre con transparencia y diversión como bandera.',
          en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. JuanMa is a content creator specialized in web3 games where you can make money for free or with low investment. With years of experience in the sector, he shares tools, tutorials and honest analyses of play-to-earn projects. His mission is to help others discover real opportunities in the crypto gaming world, always with transparency and fun as his flag.',
        },
      },
      {
        key: 'personal.contact.email',
        value: {
          es: 'hola@manko.blog',
          en: 'hello@manko.blog',
        },
      },
    ];
    for (const c of contentEntries) {
      await prisma.siteContent.upsert({
        where: { key: c.key },
        update: { value: c.value },
        create: c,
      });
    }
    results.push(`siteContent:${contentEntries.length}`);

    return NextResponse.json({
      ok: true,
      message: 'Setup completado. Ahora ve a /hub/login y entra con Google. Después de loguearte, ejecuta el SQL para hacerte OWNER.',
      results,
    });
  } catch (err: any) {
    console.error('[setup]', err);
    return NextResponse.json(
      { error: 'internal', message: err?.message ?? 'unknown' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'POST a este endpoint con ?secret=TU_SETUP_SECRET para sembrar la DB',
  });
}
