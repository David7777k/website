import { prisma } from './prisma'

export type SettingCategory = 'general' | 'wheel' | 'music' | 'referrals' | 'bonuses' | 'limits'

export interface SystemSetting {
  key: string
  value: string
  description?: string
  category: SettingCategory
  is_public: boolean
}

export class SettingsManager {
  // Default settings that will be created if they don't exist
  private static readonly DEFAULT_SETTINGS: SystemSetting[] = [
    // General settings
    { key: 'site_name', value: 'PANDA Hookah', description: 'Название сайта', category: 'general', is_public: true },
    { key: 'site_description', value: 'Лучшая кальянная в городе', description: 'Описание сайта', category: 'general', is_public: true },
    { key: 'contact_phone', value: '+380123456789', description: 'Контактный телефон', category: 'general', is_public: true },
    { key: 'contact_address', value: 'ул. Примерная, 123', description: 'Адрес заведения', category: 'general', is_public: true },
    
    // Wheel settings
    { key: 'wheel_spin_interval_hours', value: '168', description: 'Интервал между прокрутками колеса (часы)', category: 'wheel', is_public: false },
    { key: 'wheel_max_risk_score', value: '10', description: 'Максимальный риск-скор для колеса', category: 'wheel', is_public: false },
    { key: 'wheel_ip_check_enabled', value: 'true', description: 'Проверка IP для колеса', category: 'wheel', is_public: false },
    
    // Music settings
    { key: 'music_min_price', value: '50', description: 'Минимальная цена за трек (грн)', category: 'music', is_public: true },
    { key: 'music_max_queue', value: '10', description: 'Максимум треков в очереди', category: 'music', is_public: true },
    { key: 'music_moderation_enabled', value: 'true', description: 'Включить модерацию музыки', category: 'music', is_public: false },
    
    // Referral settings
    { key: 'referral_code_ttl_hours', value: '72', description: 'TTL реферальных кодов (часы)', category: 'referrals', is_public: false },
    { key: 'referral_bonus_amount', value: '100', description: 'Размер реферального бонуса (грн)', category: 'referrals', is_public: true },
    { key: 'referral_friend_bonus', value: '50', description: 'Бонус для друга (грн)', category: 'referrals', is_public: true },
    
    // Bonus settings
    { key: 'birthday_bonus_amount', value: '200', description: 'Размер ДР бонуса (грн)', category: 'bonuses', is_public: true },
    { key: 'birthday_bonus_days', value: '3', description: 'Дней до/после ДР для бонуса', category: 'bonuses', is_public: false },
    { key: 'coupon_default_ttl_days', value: '7', description: 'TTL купонов по умолчанию (дни)', category: 'bonuses', is_public: false },
    { key: 'instagram_story_discount', value: '10', description: 'Скидка за сторис (%)', category: 'bonuses', is_public: true },
    
    // Limits
    { key: 'max_wheel_spins_per_day', value: '1', description: 'Максимум прокруток колеса в день', category: 'limits', is_public: false },
    { key: 'max_promos_per_staff_week', value: '2', description: 'Максимум промокодов на стафф в неделю', category: 'limits', is_public: false },
    { key: 'risk_score_threshold', value: '15', description: 'Порог риск-скора для блокировки', category: 'limits', is_public: false },
  ]

  static async initializeSettings() {
    for (const setting of this.DEFAULT_SETTINGS) {
      await prisma.systemSettings.upsert({
        where: { key: setting.key },
        update: {}, // Don't update existing settings
        create: {
          key: setting.key,
          value: setting.value,
          description: setting.description,
          category: setting.category,
          is_public: setting.is_public,
        },
      })
    }
  }

  static async getSetting(key: string): Promise<string | null> {
    const setting = await prisma.systemSettings.findUnique({
      where: { key },
    })
    return setting?.value || null
  }

  static async getSettingInt(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.getSetting(key)
    return value ? parseInt(value, 10) : defaultValue
  }

  static async getSettingBool(key: string, defaultValue: boolean = false): Promise<boolean> {
    const value = await this.getSetting(key)
    return value ? value === 'true' : defaultValue
  }

  static async setSetting(key: string, value: string): Promise<void> {
    await prisma.systemSettings.upsert({
      where: { key },
      update: { value, updated_at: new Date() },
      create: {
        key,
        value,
        category: 'general',
        is_public: false,
      },
    })
  }

  static async getSettingsByCategory(category: SettingCategory) {
    return await prisma.systemSettings.findMany({
      where: { category },
      orderBy: { key: 'asc' },
    })
  }

  static async getAllSettings() {
    return await prisma.systemSettings.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })
  }

  static async getPublicSettings() {
    return await prisma.systemSettings.findMany({
      where: { is_public: true },
      select: { key: true, value: true },
    })
  }

  static async updateSettings(settings: Array<{ key: string; value: string }>) {
    const updates = settings.map(({ key, value }) =>
      prisma.systemSettings.update({
        where: { key },
        data: { value, updated_at: new Date() },
      })
    )
    
    await prisma.$transaction(updates)
  }
}

// Helper functions for common settings
export const getWheelSettings = () => SettingsManager.getSettingsByCategory('wheel')
export const getMusicSettings = () => SettingsManager.getSettingsByCategory('music')
export const getReferralSettings = () => SettingsManager.getSettingsByCategory('referrals')
export const getBonusSettings = () => SettingsManager.getSettingsByCategory('bonuses')
export const getLimitSettings = () => SettingsManager.getSettingsByCategory('limits')