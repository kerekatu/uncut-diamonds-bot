import { EmojiResolvable } from 'discord.js'

export function addSpaceEvery3rdCharacter(str: string | number) {
  if (!str) return

  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function appendEmoji(emoji: EmojiResolvable, text: string) {
  return `${emoji} ${text}`
}

export function randomId() {
  return Math.floor(Math.random() * 100 + Date.now()).toString()
}
