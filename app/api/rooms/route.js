import { MongoClient, ObjectId } from 'mongodb'

export async function GET() {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('restaurant')
    const rooms = database.collection('rooms')
    const result = await rooms.find({}).toArray()
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request) {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    await client.connect()
    const database = client.db('restaurant')
    const rooms = database.collection('rooms')
    const result = await rooms.insertOne(body)
    return Response.json({ message: 'Room created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create room' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request) {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    const { id, ...updateData } = body
    await client.connect()
    const database = client.db('restaurant')
    const rooms = database.collection('rooms')
    const result = await rooms.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    return Response.json({ message: 'Room updated' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to update room' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request) {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    await client.connect()
    const database = client.db('restaurant')
    const rooms = database.collection('rooms')
    const result = await rooms.deleteOne({ _id: new ObjectId(id) })
    return Response.json({ message: 'Room deleted' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to delete room' }, { status: 500 })
  } finally {
    await client.close()
  }
}