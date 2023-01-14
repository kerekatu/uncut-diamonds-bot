import { Client, CommandInteraction, GuildMember } from "discord.js"

export default async function kickCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const member = interaction.options.getMember("użytkownik")

  if (!member)
    return await interaction.reply({
      content: "Użytkownik o podanym nicku nie istnieje!",
      ephemeral: true,
    })

  try {
    const action = await (member as GuildMember).send("test")
    console.log(action)
  } catch (error) {
    return await interaction.reply({
      content: "Nie udało się wysłać wiadomości do użytkownika",
      ephemeral: true,
    })
  }

  await (member as GuildMember).kick()

  return await interaction.reply({
    content: "Użytkownik został pomyślnie wyrzucony z serwera.",
    ephemeral: true,
  })
}
