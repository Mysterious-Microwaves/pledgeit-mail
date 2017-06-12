'use strict';
var mailgunApiKey = process.env.MAILGUN_API_KEY || require('../config/default.json')['MAILGUN_API_KEY'];
var domain = process.env.MAILGUN_DOMAIN || require('../config/default.json')['MAILGUN_DOMAIN'];

var mailgun = require('mailgun-js')({ apiKey: mailgunApiKey, domain: domain });
var Promise = require('bluebird');

module.exports.composeMail = function(item){

  var templates = {
    test: {
      subject: 'This Email is a Test',
      html: `This is the html of the email!\nThe body should include the passed in data:\nto: ${ item.to }\ntype: ${ item.type }\namount: ${ item.amount }\n`
    },

    thanks_pledge: {
      
      subject: 'Thank You for Pledging!',
      html: `Thank you for donating $${item.amount} to ${item.projectTitle}! \n Once ${item.projectTitle} reaches it\'s due date, we\'ll send you an email with the link to transfer your pledged amount.\n\n
        Have a nice day!
      `
    },

    goal_reached: {

    },

    project_expired: {

    }
  };

  var mail = {
    from: 'pledgeit@gmail.com',
    to: item.to,
    subject: templates[item.type].subject,
    html: templates[item.type].html
  };

  return mail;
};

module.exports.sendMail = function( item ) {

  var mail = module.exports.composeMail( item );
  return mailgun.messages().send( mail ).then(function( sent ){
    return !!sent.id;
  });
};
