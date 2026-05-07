import { MongoClient } from 'mongodb'

export function createMongoClient() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not configured')
  }

  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  })
}

export function getRestaurantDb(client) {
  return client.db('restaurant')
}
