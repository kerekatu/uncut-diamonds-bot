import { SlashCommandBuilder } from '@discordjs/builders'
import {
  ApplicationCommandOption,
  Client,
  CommandInteraction,
  EmojiResolvable,
} from 'discord.js'

// exclude 'custom' from activity types
export enum Activities {
  Playing = 0,
  Streaming = 1,
  Listening = 2,
  Watching = 3,
  Competing = 5,
}

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

export interface QuickShotsObj {
  first: string
  second: string
}
