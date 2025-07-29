import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'smtp.hostinger.com', // or 'mailjet' or any SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail
