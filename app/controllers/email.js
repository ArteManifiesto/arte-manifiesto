var nodemailer = require('nodemailer');
var config = require('../../config/config');
var templatesDir = config.root + '/app/views/mailer';
var emailTemplates = require('email-templates');
var mg = require('nodemailer-mailgun-transport');
var Promise = require('bluebird');

exports.send = function(req, locals, view) {
  locals.baseUrl = req.protocol + '://' + req.get('host');
  return new Promise(function(resolve, reject) {
    emailTemplates(templatesDir, function(err, template) {
      if (err) {
        reject(err);
      } else {
        var auth = {
          auth: {
            api_key: 'key-eacb019dd089815809546b099e8cdb02',
            domain: 'sandbox2c429af59aac41fb9904a3ff98e08294.mailgun.org'
          }
        };
        var transport = nodemailer.createTransport(mg(auth));
        template(view, locals, function(err, html, text) {
          if (err) {
            reject(err);
          } else {
            transport.sendMail({
              from: 'Arte Manifiesto <contacto@artemanifiesto.com>',
              to: locals.to.email,
              subject: locals.subject,
              html: html
            }, function(err, responseStatus) {
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