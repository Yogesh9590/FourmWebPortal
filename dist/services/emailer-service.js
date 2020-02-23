"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
exports.sendConfirmationEmail = (userDetails) => {
    const transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
            user: 'yogeshmane',
            pass: 'xxx'
        }
    });
    const mailOptions = {
        to: userDetails.email,
        from: "yogesh9590@gmail.com",
        subject: "Welcome To XXX",
        html: 'XXX'
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log("EmailError");
            console.log(JSON.stringify(err));
        }
    });
};
//# sourceMappingURL=emailer-service.js.map