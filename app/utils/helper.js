const nodemailer = require('nodemailer');

// const Sib = require('sib-api-v3-sdk');
// const client = Sib.ApiClient.instance;


exports.handleResponse = (res, data, status = 200) => res.status(status).json({ data, error: false });

exports.handleError = (error, status = 400, res,) => {
    if (error.details) {
        const data = {};
        error?.details.forEach(v => {
            data[v.context?.key] = [v.message.replace(/"/g, '')];
        })

        return res.status(status).send({ error: data })
    }
    else {
        return res.status(400).send({
            message: error, error: true
        })
    }
}

exports.sendMailer = async (email, subject, message, res) => {

    const transporter = nodemailer.createTransport({
        host: `${process.env.SMPT_EMAIL_HOST}`,
        port: `${process.env.SMPT_EMAIL_PORT}`,
        auth: {
            user: `${process.env.SMPT_EMAIL_USER}`,
            pass: `${process.env.SMPT_EMAIL_PASSWORD}`
        },
        // secure: false
    })

    const data = {
        from: `${process.env.SMPT_EMAIL_FROM}`,
        to: `${email}`,
        subject: `${subject} - Jowry.click`,
        html: `${message}`,
    }

    transporter.sendMail(data, (error, info) => {
        if (error) {
            // console.log('error>>>>>>', error);
            res.status(error.responseCode).send(error)
        }
    })

    return
}

exports.createUUID = () => {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    return uuid
}


// exports.helpDeskMailer = (fromEmail, name, subject, message) => {
//     const apiKey = client.authentications['api-key'];
//     apiKey.apiKey = process.env.API_KEY;

//     const tranEmailApi = new Sib.TransactionalEmailsApi();

//     const sender = { email: fromEmail, name: name, }

//     const receivers = [{ email: `${process.env.TO_EMAIL}`, },]

//     tranEmailApi.sendTransacEmail({
//         sender,
//         to: receivers,
//         subject: subject,
//         textContent: message,
//         params: {
//             role: 'Frontend',
//         },
//     }).then(console.log).catch(console.log)
// }