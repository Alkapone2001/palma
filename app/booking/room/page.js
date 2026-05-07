import Header from '../../components/Header'
import BookingForm from '../../components/BookingForm'

export default function RoomBooking() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative h-24 bg-white">
        <Header />
      </div>
      <BookingForm
        type="room"
        title="Reserve a private room"
        description="For private celebrations, hosted dinners, and business gatherings, share the guest count and setup notes so we can match you with the right room."
        submitLabel="Request room"
        details={[
          'Best for birthdays, business dinners, and private events.',
          'Room requests can include layout, privacy, and hosting notes.',
          'The team will follow up before confirming the final room.',
        ]}
      />
    </div>
  )
}
