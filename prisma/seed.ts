import { PrismaClient, MetricSource, SiteStatus, PartnerStatus } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================
  // SITES
  // ============================================================
  const personalSite = await prisma.site.upsert({
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

  console.log(`✅ Sites: ${personalSite.slug}`);

  // ============================================================
  // METRICS — initial placeholders
  // ============================================================
  const metricsData = [
    {
      source: MetricSource.YOUTUBE_SUBSCRIBERS,
      label: 'Suscriptores YouTube',
      url: 'https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA',
      iconUrl: '/images/icons/youtube.svg',
    },
    {
      source: MetricSource.TELEGRAM_CHANNEL_MEMBERS,
      label: 'Canal de Telegram',
      url: 'https://t.me/JuanMaYoutube',
      iconUrl: '/images/icons/telegram.svg',
    },
    {
      source: MetricSource.TELEGRAM_GROUP_MEMBERS,
      label: 'Grupo de Telegram',
      url: 'https://t.me/JuanMaCryptoYoutube',
      iconUrl: '/images/icons/telegram.svg',
    },
    {
      source: MetricSource.WHATSAPP_MEMBERS,
      label: 'Comunidad WhatsApp',
      url: 'https://chat.whatsapp.com/IIK0cfzMj8qDAv8Zhcko9q',
      iconUrl: '/images/icons/whatsapp.svg',
    },
    {
      source: MetricSource.DISCORD_MEMBERS,
      label: 'Discord',
      url: 'https://discord.gg/juanma.98',
      iconUrl: '/images/icons/discord.svg',
    },
  ];

  for (const m of metricsData) {
    await prisma.metric.upsert({
      where: { source: m.source },
      update: {},
      create: {
        ...m,
        value: BigInt(0),
        displayValue: '—',
        autoRefresh: true,
      },
    });
  }

  console.log(`✅ Metrics: ${metricsData.length} entries`);

  // ============================================================
  // PARTNERS — actuales
  // ============================================================
  await prisma.partner.upsert({
    where: { id: 'seed-sunflowerland' },
    update: {},
    create: {
      id: 'seed-sunflowerland',
      name: 'Sunflower Land',
      logo: '/images/partners/sunflower-land.png',
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
      logo: '/images/partners/eldoria.png',
      website: 'https://eldoria.com',
      telegram: 'https://t.me/eldoria',
      status: PartnerStatus.ACTIVE,
      isFeatured: true,
      notes: 'Partnership activo. MMORPG web3 con play-to-earn.',
    },
  });

  console.log('✅ Partners: 2');

  // ============================================================
  // TESTIMONIALS — placeholders
  // ============================================================
  await prisma.testimonial.create({
    data: {
      authorName: 'Lorem Ipsum Partner',
      authorRole: 'CEO, Sunflower Land',
      authorPhoto: '/images/testimonials/placeholder-1.svg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. JuanMa es un creador increíble con una comunidad muy activa. Su trabajo con nuestro proyecto ha sido excepcional.',
      category: 'PARTNER',
      status: 'PENDING',
      visibleOn: ['personal'],
    },
  });

  await prisma.testimonial.create({
    data: {
      authorName: 'Lorem Ipsum Creator',
      authorRole: 'Creador de contenido web3',
      authorPhoto: '/images/testimonials/placeholder-2.svg',
      content:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. JuanMa siempre comparte contenido de calidad y herramientas útiles para la comunidad.',
      category: 'CREATOR',
      status: 'PENDING',
      visibleOn: ['personal'],
    },
  });

  await prisma.testimonial.create({
    data: {
      authorName: 'Lorem Ipsum Community',
      authorRole: 'Miembro de la comunidad',
      authorPhoto: '/images/testimonials/placeholder-3.svg',
      content:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco. Gracias a JuanMa descubrí varios proyectos web3 y aprendí a generar income extra con ellos.',
      category: 'COMMUNITY',
      status: 'PENDING',
      visibleOn: ['personal'],
    },
  });

  console.log('✅ Testimonials: 3 placeholders');

  // ============================================================
  // ACHIEVEMENTS — placeholders
  // ============================================================
  const achievements = [
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
  ];

  for (const a of achievements) {
    await prisma.achievement.create({ data: a });
  }

  console.log(`✅ Achievements: ${achievements.length} placeholders`);

  // ============================================================
  // SITE CONTENT — dynamic text
  // ============================================================
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

  console.log(`✅ Site content: ${contentEntries.length} entries`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
