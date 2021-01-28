const nodemailer = require("nodemailer");

const emailer = async (receiver, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      name: "testing.com",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
      },
    });

    const mail = await transporter.sendMail({
      from: `"Caper" <${process.env.SMTP_HOST_EMAIL}>`,
      to: receiver,
      subject: subject,
      html: htmlContent,
    });

    return mail;
  } catch (error) {
    console.error(error);
  }
};

module.exports = emailer;
