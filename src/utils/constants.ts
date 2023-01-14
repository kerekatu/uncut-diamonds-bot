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
      kick: {
        name: 'kick',
        description: '🧰 Wyrzuca użytkownika z serwera i wysyła wiadomość na PV z zaproszeniem powrotnym'
      }
    },
  },
}

export const ERROR_REPLIES = {}
