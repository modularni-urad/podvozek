import nodemailer from 'nodemailer'
import logger from './logger'

export default async function initSendmail () {

  const transporter = nodemailer.createTransport(process.env.SMTP_CONN)
  
  try {
    await transporter.verify()
  } catch (err) {
    logger.error(`verifying STMP (${process.env.SMTP_CONN}) FAILED :(`)
  }

  return async function sendMail (message) {    
    return transporter.sendMail(message)
  }

}

// (async function () {
//   const sendMail = await initSendmail()
//   const p = sendMail({
//     to: 'vencax77@gmail.com',
//     subject: 'ahoj',
//     body: 'ahojda'
//   })
//   console.log(p);
// })()