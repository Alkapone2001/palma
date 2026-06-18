const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS,
)

export async function sendReservationCreatedEmail(reservation) {
  if (!process.env.RESERVATION_EMAIL_TO) {
    console.info('Admin reservation email skipped. Configure RESERVATION_EMAIL_TO.')
    return { sent: false, skipped: true }
  }

  const subject = reservation.type === 'room'
    ? `New room request: ${reservation.roomName}`
    : `New table request: ${reservation.date} ${reservation.time}`

  return sendEmail({
    to: process.env.RESERVATION_EMAIL_TO,
    subject,
    text: buildAdminReservationText(reservation),
  })
}

export async function sendReservationReceivedEmail(reservation) {
  if (!reservation.email) {
    return { sent: false, skipped: true }
  }

  return sendEmail({
    to: reservation.email,
    subject: 'Palma 5 received your reservation request',
    text: buildGuestReceivedText(reservation),
  })
}

export async function sendReservationStatusEmail(reservation, status) {
  if (!reservation.email) {
    return { sent: false, skipped: true }
  }

  const statusMessage = getGuestStatusMessage(status)

  if (!statusMessage) {
    return { sent: false, skipped: true }
  }

  return sendEmail({
    to: reservation.email,
    subject: statusMessage.subject,
    text: buildGuestStatusText(reservation, statusMessage),
  })
}

async function sendEmail({ to, subject, text }) {
  if (!smtpConfigured) {
    console.info('Email skipped. Configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.')
    return { sent: false, skipped: true }
  }

  const nodemailerModule = await import('nodemailer')
  const nodemailer = nodemailerModule.default || nodemailerModule
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.RESERVATION_EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  })

  return { sent: true }
}

function buildAdminReservationText(reservation) {
  const lines = [
    'New Palma 5 reservation request',
    '',
    `Type: ${reservation.type}`,
    `Name: ${reservation.name}`,
    `Email: ${reservation.email}`,
    `Phone: ${reservation.phone}`,
    `Guests: ${reservation.guests}`,
  ]

  if (reservation.type === 'room') {
    lines.push(
      `Room: ${reservation.roomName}`,
      `Check-in: ${reservation.checkIn}`,
      `Check-out: ${reservation.checkOut}`,
      `Nights: ${reservation.nights || 'Not calculated'}`,
      `Estimated total: ${reservation.estimatedTotal ? `EUR ${reservation.estimatedTotal}` : 'Not calculated'}`,
    )
  } else {
    lines.push(`Date: ${reservation.date}`, `Time: ${reservation.time}`)
  }

  if (reservation.notes) {
    lines.push('', `Notes: ${reservation.notes}`)
  }

  lines.push('', 'Open the admin dashboard to approve or decline this request.')
  return lines.join('\n')
}

function buildGuestReceivedText(reservation) {
  const lines = [
    `Hello ${reservation.name},`,
    '',
    'Thank you. Palma 5 received your reservation request.',
    'We will check availability and confirm with you soon.',
    '',
  ]

  appendReservationDetails(lines, reservation)

  lines.push('', 'Palma 5', 'Spadici 54, 52440, Porec, Croatia')
  return lines.join('\n')
}

function buildGuestStatusText(reservation, statusMessage) {
  const lines = [
    `Hello ${reservation.name},`,
    '',
    statusMessage.body,
    '',
  ]

  appendReservationDetails(lines, reservation)

  lines.push('', 'Palma 5', 'Spadici 54, 52440, Porec, Croatia')
  return lines.join('\n')
}

function appendReservationDetails(lines, reservation) {
  if (reservation.type === 'room') {
    lines.push(
      `Room: ${reservation.roomName}`,
      `Check-in: ${reservation.checkIn}`,
      `Check-out: ${reservation.checkOut}`,
    )
  } else {
    lines.push(`Table date: ${reservation.date}`, `Time: ${reservation.time}`)
  }
}

function getGuestStatusMessage(status) {
  if (status === 'approved') {
    return {
      subject: 'Your Palma 5 reservation is confirmed',
      body: 'Your Palma 5 reservation has been confirmed.',
    }
  }

  if (status === 'declined') {
    return {
      subject: 'Your Palma 5 reservation request',
      body: 'Thank you for your request. We are sorry, but this reservation could not be confirmed.',
    }
  }

  if (status === 'cancelled') {
    return {
      subject: 'Your Palma 5 reservation was cancelled',
      body: 'Your Palma 5 reservation has been cancelled.',
    }
  }

  return null
}
