/**
 * 🐼 PANDA Lounge - Конфигурация приложения
 * 
 * Этот файл позволяет легко менять настройки при переносе на другой хостинг
 * Скопируйте этот файл в config.js и отредактируйте под ваши нужды
 */

module.exports = {
  // Основные URL (автоматически берутся из .env)
  app: {
    name: process.env.APP_NAME || 'PANDA Lounge',
    url: process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
    description: 'Современная кальянная с системой управления',
  },

  // OAuth настройки
  auth: {
    google: {
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // База данных
  database: {
    url: process.env.DATABASE_URL,
  },

  // Функциональность
  features: {
    wheelOfFortune: true,
    musicJukebox: true,
    promotions: true,
    referralProgram: true,
    staffRatings: true,
    qrVisits: true,
  },

  // Лимиты
  limits: {
    wheelSpinCooldown: 24, // часов
    promoCodesPerWeek: 2, // для персонала
    referralBonusAmount: 100, // бонусы за реферала
  },

  // Контактная информация (обновите под себя)
  contact: {
    phone: '+380123456789',
    email: 'info@panda-lounge.com',
    address: 'ул. Примерная, 123, Киев',
    instagram: '@panda_lounge',
  },

  // Google Maps (если используется)
  maps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    center: {
      lat: 50.4501, // Киев
      lng: 30.5234,
    },
  },
}
