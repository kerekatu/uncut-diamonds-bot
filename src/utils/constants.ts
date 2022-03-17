export const CONSTANTS = {}

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
      sugestie: {
        name: 'sugestie',
        description: '🧰 Ustawia kanał do sugestii',
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
