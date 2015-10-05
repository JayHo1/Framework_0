

module.exports = function(app, nodemailer) {
    // create reusable transporter object using SMTP transport
    var generator = require('xoauth2').createXOAuth2Generator({
        user: 'jaychau.ho@gmail.com',
        clientId: '1045261929762-hgf76a9q60d48kvv2ga3ijg3ohnbgc7m.apps.googleusercontent.com',
        clientSecret: 'TpGwyLpg6g0Yvko4RPUM8LCb',
        refreshToken: '1/BTNBJhc9DDzSbPWc2Od5XRTQ_gPnoR0re9JCsFK-HrM'
    });

    generator.on('token', function(token){
        console.log('New token for %s: %s', token.user, token.accessToken);
    });

    var transporter = nodemailer.createTransport(({
        service: 'gmail',
        auth: {
            xoauth2: generator
        }
    }));

    app.post('/mailbox', function (req, res){

        var mailOptions = {
            from: 'Jay HO ✔ <jaychau.ho@gmail.com>', // sender address
            to: req.body.mail, // list of receivers
            subject: req.body.subject, // Subject line
            generateTextFromHTML: true,
            text: req.body.message, // plaintext body
            html: '<b>Hello world</b>'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);

            transporter.close()
        });
    })
}