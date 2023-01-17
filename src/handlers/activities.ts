import { ActivityType, ClientUser, Guild } from 'discord.js'
import { presenceData } from '../config'
import { formatActivity } from '../utils/replaceVar'
import { t } from '../utils/exports'

export default function handleActivities(guild: Guild, user: ClientUser) {
  const setActivity = (index: number) => {
    const activities = presenceData.activities.map((activity) =>
      Object.assign(activity, { name: formatActivity(activity.name, guild) })
    )

    user.setActivity(`${activities[index].name} | ${t.global.url}`, {
      type: ActivityType[activities[index].type],
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
