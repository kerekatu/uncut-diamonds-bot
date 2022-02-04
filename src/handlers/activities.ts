import { ClientUser, Guild } from 'discord.js'
import { presenceData } from '../config'

export default function handleActivities(guild: Guild, user: ClientUser) {
  function formatActivity(text: string) {
    let newText = text

    if (text.includes('{userCount}')) {
      newText = newText.replace(/{userCount}/g, guild?.memberCount.toString())
    }

    return newText
  }

  function setActivity(index: number) {
    const activity = presenceData.activities.map((activity) =>
      Object.assign(activity, { name: formatActivity(activity.name) })
    )
    user.setActivity(`${activity[index].name} | uncutdiamonds.top`, {
      type: activity[index].type,
    })
  }

  setActivity(0)

  let index = 1
  setInterval(() => {
    if (index < presenceData.activities.length) index++
    if (index === presenceData.activities.length) index = 0

    setActivity(index)
  }, presenceData.interval)
}
