import Header from '../../components/Header'
import RoomBookingClient from '../../components/RoomBookingClient'

export default function RoomBooking() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative h-24 bg-white">
        <Header />
      </div>
      <RoomBookingClient />
    </div>
  )
}
