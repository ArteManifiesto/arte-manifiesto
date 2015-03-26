/*
var nodemailer = require('nodemailer');
var config = require('../../config/config');
var templatesDir = config.root + '/app/views/mailer';
var emailTemplates = require('email-templates');
var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)

exports.send = function (locals, view, callback) {
    emailTemplates(templatesDir, function (err, template) {
        if (err) {
            console.log(err);
        } else {
            var auth = {
                auth: {
                    api_key: 'key-1cf1a621f96cff4fcb4234f93012382a',
                    domain: 'sandbox2d1dd53dd089470e8035bb5a44a89553.mailgun.org'
                }
            };

            var transport = nodemailer.createTransport(mg(auth));

            template(view, locals, function (err, html, text) {
                if (err) {
                    console.log(err);
                } else {
                    transport.sendMail({
                        from: locals.from,
                        to: locals.to,
                        subject: locals.subject,
                        html: html
                    }, function (err, responseStatus) {
                        console.log(err , responseStatus);
                        callback();
                    });
                }
            });
        }
    });
};*/
