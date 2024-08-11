import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendTwoFactorTokenEmail = async (email: any, token: any) => {
  const msg = {
    to: email,
    from: 'Acme <hnoc@discente.ifpe.edu.br>',
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  }

  try {
    await sgMail.send(msg)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Email not sent', error)
  }
}

export const sendPasswordResetEmail = async (email: any, token:any) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`
  const msg = {
    to: email,
    from: 'Acme <hnoc@discente.ifpe.edu.br>', 
    subject: 'Reset your password',
    html: `<html>
        <body>
          <p>Click the button below to reset your password.</p>
          <a href="${resetLink}" style="background-color: #4CAF50 color: white padding: 10px 20px text-align: center text-decoration: none display: inline-block font-size: 16px margin: 4px 2px cursor: pointer border-radius: 8px">Verify Email</a>
        </body>
      </html>`,
  }

  try {
    await sgMail.send(msg)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Email not sent', error)
  }
}

export const sendVerificationEmail = async (email: any, token: any) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`
  const msg = {
    to: email,
    from: 'Acme <hnoc@discente.ifpe.edu.br>', 
    subject: 'Verify your email',
    html: `<html>
        <body>
          <p>Click the button below to verify your email.</p>
          <a href="${confirmLink}" style="background-color: #4CAF50 color: white padding: 10px 20px text-align: center text-decoration: none display: inline-block font-size: 16px margin: 4px 2px cursor: pointer border-radius: 8px">Verify Email</a>
        </body>
      </html>`,
  }

  try {
    const result = await sgMail.send(msg)
    console.log('Email sent successfully', result)
    return result
  } catch (error) {
    console.error('Email not sent', error)
    return error
  }
}
