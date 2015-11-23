var nodemailer = require('nodemailer');
var config = require('../../config/config');
var templatesDir = config.root + '/app/views/mailer';
var emailTemplates = require('email-templates');
var mg = require('nodemailer-mailgun-transport');
var Promise = require('bluebird');

exports.send = function (req, locals, view) {
  locals.baseUrl = req.protocol + '://' + req.get('host');
    return new Promise(function (resolve, reject) {
        emailTemplates(templatesDir, function (err, template) {
            if (err) {
                reject(err);
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
                        reject(err);
                    } else {
                        transport.sendMail({
                            from: 'Arte Manifiesto <contacto@artemanifiesto.com>',
                            to: locals.to.email,
                            subject: locals.subject,
                            html: html
                        }, function (err, responseStatus) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(responseStatus);
                            }
                        });
                    }
                });
            }
        });
    });
};
