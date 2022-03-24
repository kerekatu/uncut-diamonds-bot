import { CommandData } from '../../typings/index'

export const CONSTANTS = {}

export const COMMANDS: { [key: string]: CommandData } = {
  admin: {
    name: 'admin',
    description: '🧰 Komendy administracyjne',
    permissionRole: 'Keramzyt',
    subCommands: [
      {
        name: 'pytania',
        description: '🧰 Ustawia kanał do pytań dnia',
      },
      {
        name: 'sugestie',
        description: '🧰 Ustawia kanał do sugestii',
      },
    ],
  },
  alko: {
    name: 'alko',
    description: '🍺 Gra w zbieranie trunków',
    options: [],
  },
  pomoc: {
    name: 'pomoc',
    description: 'Wyświetla informacje na temat serwera',
    emoji: '💡',
    options: [
      {
        type: 'STRING',
        name: 'kategoria',
        description: 'Wybierz jedną z dostępnym kategorii',
        required: true,
        choices: [
          { name: 'strona', value: 'strona' },
          { name: 'sklep', value: 'sklep' },
          { name: 'dotacje', value: 'dotacje' },
        ],
      },
    ],
  },
  urodziny: {
    name: 'urodziny',
    description: '🎂 Dodaj swoje urodziny do kalendarza',
    options: [],
  },
}

export const ERROR_REPLIES = {}
