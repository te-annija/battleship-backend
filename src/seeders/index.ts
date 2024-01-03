import { Rank } from '../models'
import { UserService } from '../services'

/** Seeds database with initial data. */
const seedDatabase = async () => {
  try {
    // Handle rank seeding
    const ranksData = [
      { title: 'Bronze I', icon: '/img/ranks/default.png', difficulty: 1, minimumPoints: 0 },
      { title: 'Bronze II', icon: '/img/ranks/default.png', difficulty: 1, minimumPoints: 100 },
      { title: 'Bronze III', icon: '/img/ranks/default.png', difficulty: 1, minimumPoints: 200 },
      { title: 'Silver I', icon: '/img/ranks/default.png', difficulty: 2, minimumPoints: 400 },
      { title: 'Silver II', icon: '/img/ranks/default.png', difficulty: 2, minimumPoints: 500 },
      { title: 'Silver III', icon: '/img/ranks/default.png', difficulty: 2, minimumPoints: 600 },
      { title: 'Gold I', icon: '/img/ranks/default.png', difficulty: 3, minimumPoints: 800 },
      { title: 'Gold II', icon: '/img/ranks/default.png', difficulty: 3, minimumPoints: 900 },
      { title: 'Gold III', icon: '/img/ranks/default.png', difficulty: 3, minimumPoints: 1000 },
      { title: 'Crystal I', icon: '/img/ranks/default.png', difficulty: 4, minimumPoints: 1200 },
      { title: 'Crystal II', icon: '/img/ranks/default.png', difficulty: 4, minimumPoints: 1400 },
      { title: 'Crystal III', icon: '/img/ranks/default.png', difficulty: 4, minimumPoints: 1600 },
      { title: 'Champion I', icon: '/img/ranks/default.png', difficulty: 5, minimumPoints: 1900 },
      { title: 'Champion II', icon: '/img/ranks/default.png', difficulty: 5, minimumPoints: 2100 },
      { title: 'Champion III', icon: '/img/ranks/default.png', difficulty: 5, minimumPoints: 2300 },
      { title: 'Titan I', icon: '/img/ranks/default.png', difficulty: 6, minimumPoints: 2600 },
      { title: 'Titan II', icon: '/img/ranks/default.png', difficulty: 6, minimumPoints: 3000 },
      { title: 'Titan III', icon: '/img/ranks/default.png', difficulty: 6, minimumPoints: 3400 },
      { title: 'Legend', icon: '/img/ranks/default.png', difficulty: 7, minimumPoints: 4000 }
    ]

    // Bulk insert the seed data into the Rank table
    await Rank.bulkCreate(ranksData)

    // Handle user seeding
    const userService = new UserService()
    await userService.create({
      username: 'admin',
      password: 'admin',
      email: 'admin@admin.com',
      role: true
    })

    await userService.create({
      username: 'test',
      password: 'test',
      email: 'test@test.com',
      role: false
    })

    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
