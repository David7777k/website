export const mockMenuItems = [
  {
    id: '1',
<<<<<<< HEAD
    name: {
      ru: 'Мохито Классический',
      uk: 'Мохіто Класичний'
    },
    description: {
      ru: "Освежающий коктейль с мятой, лаймом и содовой. Идеальный выбор для жаркого дня.",
      uk: "Оcвіжаючий коктейль з м'ятою, лаймом і содовою. Ідеальний вибір для спекотного дня."
    },
=======
    name: 'Мохіто Класік',
    description: 'Освіжаючий коктейль з м\'ятою, лаймом і содовою. Ідеальний вибір для спекотного дня.',
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
    price: 140,
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    badges: ['hit'],
    available: true
  },
  {
    id: '2',
<<<<<<< HEAD
    name: { ru: 'Panda Premium', uk: 'Panda Premium' },
    description: {
      ru: 'Премиальный кальян. Пользователь самостоятельно выбирает вкус при заказе.',
      uk: 'Преміальний кальян. Користувач самостійно обирає смак при замовленні.'
    },
=======
    name: 'Panda Premium',
    description: 'Преміальний кальян з широким вибором смаків. Ви можете обрати будь-який смак за бажанням - від класичного подвійного яблука до екзотичних тропічних міксів.',
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
    price: 300,
    category: 'hookah',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    badges: ['popular', 'hit'],
<<<<<<< HEAD
    available: true,
    flavors: [
      { ru: 'Яблоко', uk: 'Яблуко' },
      { ru: "Мята", uk: "М'ята" },
      { ru: 'Вишня', uk: 'Вишня' },
      { ru: 'Лимон', uk: 'Лимон' },
      { ru: 'Ананас', uk: 'Ананас' },
      { ru: 'Экзотический микс', uk: 'Екзотичний мікс' }
    ]
  },
  {
    id: '3',
    name: { ru: 'Бургер BBQ Бекон', uk: 'Бургер BBQ Бекон' },
    description: { ru: 'Сочное говяжье котлета с беконом, сыром чеддер и соусом BBQ.', uk: 'Соковита яловича котлета з беконом, сиром чеддер і соусом BBQ.' },
=======
    available: true
  },
  {
    id: '3',
    name: 'Бургер BBQ Бекон',
    description: 'Соковита яловича котлета з беконом, сиром чеддер і соусом BBQ.',
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
    price: 210,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    badges: ['new'],
    available: true
  },
  {
    id: '4',
    name: 'Космополітен',
    description: 'Елегантний коктейль з горілкою, журавлинним соком і лаймом.',
    price: 170,
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400',
    badges: [],
    available: true
  },
  {
    id: '5',
    name: 'Курячі Крилця Гострі',
    description: 'Пікантні курячі крильця в гострому соусі з селерою.',
    price: 150,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    badges: ['popular'],
    available: true
  },
  {
    id: '6',
    name: 'Long Island',
    description: 'Міцний коктейль з п\'ятьма видами алкоголю і колою.',
    price: 190,
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    badges: [],
    available: true
  },
  {
    id: '7',
    name: 'Цезар з Куркою',
    description: 'Класичний салат цезар з хрусткою зеленню та куркою гриль.',
    price: 120,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    badges: [],
    available: true
  },
  {
    id: '8',
    name: 'Піна Колада',
    description: 'Тропічний коктейль з кокосом, ананасом і ромом.',
    price: 160,
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    badges: ['hit'],
    available: true
  },
  {
    id: '9',
    name: 'Чізкейк Ягідний',
    description: 'Ніжний чізкейк з свіжими ягодами та ягідним соусом.',
    price: 90,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    badges: ['new'],
    available: true
  },
  {
    id: '10',
    name: 'Тірамісу',
    description: 'Класичний італійський десерт з кавою та маскарпоне.',
    price: 85,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    badges: [],
    available: true
  }
];

export const categoryNames = {
<<<<<<< HEAD
  all: { ru: 'Все', uk: 'Усе' },
  cocktails: { ru: 'Коктейли', uk: 'Коктейлі' },
  hookah: { ru: 'Кальян', uk: 'Кальян' },
  food: { ru: 'Еда', uk: 'Їжа' },
  desserts: { ru: 'Десерты', uk: 'Десерти' }
};

export const mockRestaurantInfo = {
  wifi: { ru: 'Да', uk: 'Є' },
  hours: { ru: 'Пн-Пт: 17:00 - 23:00', uk: 'Пн-Пт: 17:00 - 23:00' },
  address: { ru: 'ул. Центральная, 123', uk: 'вул. Центральна, 123' },
  phone: '+380 (44) 123-45-67',
  instagram: 'https://instagram.com/yourpage'
};

export function getMockMenuItems(lang = 'ru') {
  return mockMenuItems.map(item => ({
    ...item,
    name: typeof item.name === 'object' ? (item.name[lang] || item.name.ru) : item.name,
    description: typeof item.description === 'object' ? (item.description[lang] || item.description.ru) : item.description,
    flavors: item.flavors ? item.flavors.map(f => (typeof f === 'object' ? (f[lang] || f.ru) : f)) : undefined
  }));
}
=======
  all: 'Усе',
  cocktails: 'Коктейлі',
  hookah: 'Кальян', 
  food: 'Їжа',
  desserts: 'Десерти'
};
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
