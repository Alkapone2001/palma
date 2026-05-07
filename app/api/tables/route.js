import { ObjectId } from 'mongodb'
import { isAdminRequest, unauthorized } from '../../lib/adminAuth'
import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const tables = database.collection('tables')
    const result = await tables.find({}).toArray()
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch tables' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    const body = await request.json()
    await client.connect()
    const database = getRestaurantDb(client)
    const tables = database.collection('tables')
    const result = await tables.insertOne(body)
    return Response.json({ message: 'Table created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create table' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    const body = await request.json()
    const { id, ...updateData } = body
    await client.connect()
    const database = getRestaurantDb(client)
    const tables = database.collection('tables')
    const result = await tables.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    return Response.json({ message: 'Table updated' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to update table' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const tables = database.collection('tables')
    const result = await tables.deleteOne({ _id: new ObjectId(id) })
    return Response.json({ message: 'Table deleted' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to delete table' }, { status: 500 })
  } finally {
    await client.close()
  }
}
