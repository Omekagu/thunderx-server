import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // ✅ Hostinger SMTP
    port: 587, // ✅ TLS port
    secure: false, // false for TLS, true for SSL (port 465)
    auth: {
      user: process.env.EMAIL, // e.g. you@example.com
      pass: process.env.EMAIL_PASSWORD // your email password or app password
    }
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    text
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail
