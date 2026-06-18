import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const client = createMongoClient()
  const url = new URL(request.url)
  const roomId = url.searchParams.get('roomId')

  if (!roomId) {
    return Response.json({ error: 'roomId is required' }, { status: 400 })
  }

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const approvedStays = await reservations
      .find({
        type: 'room',
        roomId,
        status: 'approved',
      })
      .project({
        _id: 0,
        checkIn: 1,
        checkOut: 1,
      })
      .sort({ checkIn: 1 })
      .toArray()

    return Response.json({ bookedRanges: approvedStays })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch availability' }, { status: 500 })
  } finally {
    await client.close()
  }
}
