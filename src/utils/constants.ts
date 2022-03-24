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
}

export const ERROR_REPLIES = {}
