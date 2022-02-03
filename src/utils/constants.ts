export const CONSTANTS = {
  IMAGE_URLS: {
    alco: 'https://sklep-domwhisky.pl',
    beer: 'https://ocen-piwo.pl',
  },
}

export const COMMANDS = {
  admin: {
    name: 'admin',
    description: '🧰 Komendy administracyjne',
    permissionRole: 'Keramzyt',
    subCommands: {
      pytania: {
        name: 'pytania',
        description: '🧰 Ustawia kanał do pytań dnia',
      },
    },
  },
  alko: {
    name: 'alko',
    description: '🍺 Gra w zbieranie trunków',
    permissions: '',
    options: [],
  },
  info: {
    name: 'info',
    description: '🎂 Dodaj swoje urodziny do kalendarza',
    permissions: '',
    options: [],
  },
  urodziny: {
    name: 'urodziny',
    description: '💡 Wyświetla informacje na temat serwera',
    permissions: '',
    options: [],
  },
}

export const ERROR_REPLIES = {}
