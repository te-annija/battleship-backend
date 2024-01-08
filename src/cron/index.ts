import cron from 'node-cron'
import { User } from '../models'
import { Op } from 'sequelize'

/** Schedule the cron job to run once in a day. */
cron.schedule('0 3 * * *', () => {
  logMessage()
  clearBlockExpiredUsers()
})

/** Log a message when the cron is executed. */
const logMessage = () => {
  console.log('Cron job executed at:', new Date().toLocaleString())
}

/** Find all users that blockExpiresAt is in the past (expired) and set value to null. */
const clearBlockExpiredUsers = async () => {
  try {
    const expiredUsers: User[] = await User.findAll({
      where: {
        blockExpiresAt: {
          [Op.lt]: new Date()
        }
      }
    })

    expiredUsers.forEach(async (user) => {
      user.blockExpiresAt = null
      await user.save()
    })

    console.log('Expired blocks cleared successfully.')
  } catch (error) {
    console.error('Error clearing expired blocks:', error)
  }
}
