import * as nodemailer from "nodemailer";

export let sendConfirmationEmail = (userDetails: any) => {
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
  		if(err) {
  			console.log("EmailError");
  			console.log(JSON.stringify(err));
  		}
  	});
};