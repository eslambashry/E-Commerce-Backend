import nodemailer from 'nodemailer'

export async function sendEmailService({
  to,
  subject,
  message,
  attachments = [],
} = {}) {
  // configurations
  const transporter = nodemailer.createTransport({
    host: 'localhost', // stmp.gmail.com
    port: 587, // 587 , 465
    secure: false, // false , true
    service: 'gmail', // optional
    auth: {
      // credentials
      user: 'eslamhussin600@gmail.com',
      pass: 'wjto szao rdra crzy',
    },
  })

  const emailInfo = await transporter.sendMail({
    from: '"3amo samy 👻" <eslamhussin600@gmail.com>',
    to: to ? to : '',
    subject: subject ? subject : 'Hello',
    html: message ? message : '',
    attachments,
  })
  if (emailInfo.accepted.length) {
    return true
  }
  return false
}