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
          'Best for lunch, dinner, date nights, and casual gatherings.',
          'We will confirm by phone or email after checking availability.',
          'Add notes for allergies, preferred seating, or celebrations.',
        ]}
      />
    </div>
  )
}
