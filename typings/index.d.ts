import { SlashCommandBuilder } from '@discordjs/builders'
import {
  ApplicationCommandOption,
  Client,
  CommandInteraction,
  EmojiResolvable,
} from 'discord.js'

export interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction, client: Client) => Promise<unknown>
}

export interface CommandData {
  name: string
  description: string
  emoji?: EmojiResolvable
  defaultPermissions?: boolean
  options?: ApplicationCommandOption[]
  subCommands: {
    name: string
    description: string
    options?: ApplicationCommandOption[]
  }[]
}

export interface UserBalance {
  rank: string
  user_id: string
  cash: number
  bank: number
  total: number
}

export interface ShopItem {
  ref: {
    id: string
  }
  ts: number
  data: {
    title: string
    description: string
    price: number
    stock: string
    duration?: number
    image?: string
    author?: {
      id: string
      name: string
      image: string
    }
  }
}
