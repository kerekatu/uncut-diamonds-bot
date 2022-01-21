import { ActivitiesOptions, ClientUser, Guild } from 'discord.js'

export default async function initActivityList(guild: Guild, user: ClientUser) {
  const list: { activity: string; type: ActivitiesOptions['type'] }[] = [
    { activity: 'nawalony już jak ściana', type: 'LISTENING' },
    { activity: 'uncutdiamonds.top', type: 'WATCHING' },
    { activity: 'przywołuje demona hybrydę', type: 'STREAMING' },
    { activity: 'twitch.tv/tunczyczka', type: 'WATCHING' },
    { activity: '/alko', type: 'PLAYING' },
    { activity: `wraz z ${guild?.memberCount} diamentami`, type: 'PLAYING' },
  ]

  user.setActivity(list[0].activity, {
    type: list[0].type,
  })

  let index = 1
  setInterval(() => {
    if (index < list.length) index++
    if (index === list.length) index = 0

    user.setActivity(list[index].activity, {
      type: list[index].type,
    })
  }, 1000 * 60 * 10)
}
