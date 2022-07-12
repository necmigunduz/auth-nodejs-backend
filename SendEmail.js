const nodemailer = require("nodemailer");
require('dotenv').config();

const user = process.env.USER;
const pass = process.env.PASS;
const service = process.env.SERVICE;

const transport = nodemailer.createTransport({
  service: service,
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmmationEmail = (name, email, confirmationCode) => {
    console.log('Check');
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account!",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(error => console.log(error))
}