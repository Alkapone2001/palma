import Header from '../../components/Header'
import BookingForm from '../../components/BookingForm'

export default function TableBooking() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative h-24 bg-white">
        <Header />
      </div>
      <BookingForm
        type="table"
        title="Book a table"
        description="Tell us when you would like to dine, how many guests are joining, and anything that helps us prepare the table properly."
        submitLabel="Request table"
        details={[
          'Fast table request for lunch, dinner, or a casual night out.',
          'We will confirm by phone or email after checking availability.',
          'Occasion and notes are optional for table bookings.',
        ]}
      />
    </div>
  )
}
