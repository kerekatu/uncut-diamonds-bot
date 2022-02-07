import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Prisma, PrismaClient } from '@prisma/client'
import config from '../../config'
import { UserBalance } from '../../../typings'
import fetch from 'isomorphic-fetch'

const prisma = new PrismaClient()

const minBettingValue = 5000
const maxBettingValue = 300000

export const data = new SlashCommandBuilder()
  .setName('zakład')
  .setDescription('💰 Postaw pieniądze na wybranego użytkownika')
  .addStringOption((option) =>
    option
      .setName('event')
      .setDescription('Podaj nazwę eventu')
      .setRequired(true)
  )
  .addUserOption((option) =>
    option
      .setName('użytkownik')
      .setDescription('Wybierz użytkownika')
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName('kwota')
      .setDescription(
        `Wybierz kwotę do postawienia (min. ${minBettingValue} i max. ${maxBettingValue})`
      )
      .setRequired(true)
      .setMinValue(minBettingValue)
      .setMaxValue(maxBettingValue)
  )

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('użytkownik')
  const amount = interaction.options.getNumber('kwota')
  const eventOption = interaction.options.getString('event')

  if (
    !user ||
    !amount ||
    !eventOption ||
    amount < minBettingValue ||
    amount > maxBettingValue
  ) {
    return await interaction.reply({
      content: 'Wymagane pola nie zostały wpisane poprawnie!',
      ephemeral: true,
    })
  }

  try {
    const userBalance = await fetch(
      `https://unbelievaboat.com/api/v1/guilds/${config.GUILD_ID}/users/${interaction.member?.user.id}`,
      {
        headers: {
          Authorization: config.UNBELIEVABOAT_TOKEN,
        },
      }
    )
    const responseUserBalance: UserBalance = await userBalance.json()

    if (responseUserBalance.bank < amount) {
      return await interaction.reply({
        content: `Wybrana kwota jest wyższa od twojego stanu konta! Posiadasz: ${responseUserBalance.bank} diamentów`,
        ephemeral: true,
      })
    }
  } catch (error) {
    return await interaction.reply({
      content: 'Coś poszło nie tak...',
      ephemeral: true,
    })
  }

  if (user.id === interaction.member?.user.id) {
    return await interaction.reply({
      content: 'Nie możesz postawić na samego siebie!',
      ephemeral: true,
    })
  }

  const betExists = await prisma.bets.findUnique({
    where: {
      betId: <Prisma.BetsCreateInput>{
        userId: user.id,
        betterId: interaction.member?.user.id,
      },
    },
  })

  if (betExists) {
    return await interaction.reply({
      content: 'Postawiłeś już na tę osobę!',
      ephemeral: true,
    })
  }

  try {
    const event = await prisma.events.findUnique({
      where: { name: eventOption },
      include: { users: true },
    })

    if (event && event.finished === false) {
      if (!event?.users.find((u) => u.userId === user.id)) {
        return await interaction.reply({
          content: `Użytkownik ${user.username} nie bierze udziału w evencie!`,
          ephemeral: true,
        })
      }
      const userPatch = await fetch(
        `https://unbelievaboat.com/api/v1/guilds/${config.GUILD_ID}/users/${interaction.member?.user.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: config.UNBELIEVABOAT_TOKEN,
          },
          body: JSON.stringify({ bank: -amount }),
        }
      )
      const userPatchResponse: UserBalance = await userPatch.json()

      if (!userPatchResponse?.user_id)
        return await interaction.reply({
          content: 'Coś poszło nie tak...',
          ephemeral: true,
        })

      try {
        const bet = await prisma.bets.create({
          data: <Prisma.BetsCreateInput>{
            betterId: interaction.member?.user.id,
            betterName: interaction.member?.user.username,
            userId: user.id,
            userName: user.username,
            amount: amount.toString(),
          },
        })

        return await interaction.reply(
          `Pomyślnie postawiłeś na <@${bet.userId}> kwotę ${bet.amount} diamentów`
        )
      } catch (error) {
        return await interaction.reply({
          content: 'Coś poszło nie tak...',
          ephemeral: true,
        })
      }
    } else {
      return await interaction.reply({
        content: 'Event nie istnieje!',
        ephemeral: true,
      })
    }
  } catch (error) {
    return await interaction.reply({
      content: 'Coś poszło nie tak...',
      ephemeral: true,
    })
  }
}
