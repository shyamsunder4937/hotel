import getTransporter from '../config/mailer.js';

const sendBookingConfirmation = async ({ to, name, booking, room, viewLink }) => {
  const mailOptions = {
    from: `"Hotel Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmed - ${booking.confirmationCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">🏨 Booking Confirmation</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your booking has been confirmed! Here are your details:</p>
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background:#f4f4f4;">
            <td style="padding:10px; border:1px solid #ddd;"><strong>Confirmation Code</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${booking.confirmationCode}</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Room</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${room.roomNumber} - ${room.type}</td>
          </tr>
          <tr style="background:#f4f4f4;">
            <td style="padding:10px; border:1px solid #ddd;"><strong>Check-In</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${new Date(booking.checkIn).toDateString()}</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Check-Out</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${new Date(booking.checkOut).toDateString()}</td>
          </tr>
          <tr style="background:#f4f4f4;">
            <td style="padding:10px; border:1px solid #ddd;"><strong>Total Amount</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">₹${booking.totalAmount}</td>
          </tr>
        </table>
        <p style="color: #27ae60;"><strong>✅ Payment Successful & Booking Confirmed</strong></p>
        <p>You can view your room and booking details clicking the link below:</p>
        <p><a href="${viewLink || '#'}" style="display:inline-block; padding:10px 20px; color:#fff; background:#3498db; text-decoration:none; border-radius:5px;">View Your Booking</a></p>
        <p>We look forward to welcoming you. If you have any questions, please contact us.</p>
        <hr/>
        <p style="font-size:12px; color:#888;">This is an automated email. Please do not reply.</p>
      </div>
    `,
  };
  await getTransporter().sendMail(mailOptions);
};

const sendWelcomeEmail = async ({ to, name }) => {
  await getTransporter().sendMail({
    from: `"Hotel Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to Our Hotel!',
    html: `<p>Hi <strong>${name}</strong>, welcome! Your account has been created successfully.</p>`,
  });
};

const sendPaymentVerificationEmail = async ({ to, name, verificationLink }) => {
  await getTransporter().sendMail({
    from: `"Hotel Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Action Required: Verify Your Payment & Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #e67e22;">⏳ Verify Your Booking</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have received your payment. To complete and confirm your room booking, please verify your email and payment by clicking the button below:</p>
        <br/>
        <p style="text-align: center;">
          <a href="${verificationLink}" style="display:inline-block; padding:12px 24px; color:#fff; background:#2ecc71; text-decoration:none; font-weight:bold; border-radius:5px;">Verify My Booking</a>
        </p>
        <br/>
        <p>If you did not make this booking, you can safely ignore this email.</p>
        <hr/>
        <p style="font-size:12px; color:#888;">This is an automated email. Please do not reply.</p>
      </div>
    `,
  });
};

export { sendBookingConfirmation, sendWelcomeEmail, sendPaymentVerificationEmail };