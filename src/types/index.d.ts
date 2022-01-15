import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, CommandInteraction } from 'discord.js'

export interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction, client: Client) => Promise<unknown>
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
