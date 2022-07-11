const nodemailer = require('nodemailer');

const SendMail = (email, uniqueString) => {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GOOGLE_CLIENT_ID,
            pass: process.env.GOOGLE_CLIENT_SECRET,
        }
    });

    var mailOptions;
    let sender = "Necmi Gun",
    mailOptions =  {
        from: sender,
        to: email,
        subject: "Email confirmation",
        html: `Click on <a href="https://auth-node-backend.herokuapp.com/verify/${uniqueString}"> to verify your account.`
    };
    Transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error)
        } else {
            console.log("Message sent!")
        }
    });
};

module.exports = SendMail;