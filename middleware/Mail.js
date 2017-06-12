'use strict';
var mailgunApiKey = process.env.MAILGUN_API_KEY || require('../config/default.json')['MAILGUN_API_KEY'];
var domain = process.env.MAILGUN_DOMAIN || require('../config/default.json')['MAILGUN_DOMAIN'];
var mailgun = require('mailgun-js')({ apiKey: mailgunApiKey, domain: domain });
var Promise = require('bluebird');

module.exports.sendMail = function( item ) {

  var templates = {
    test: {
      from: 'pay@emailgun.com',
      subject: 'Your eMailgun Account Statement is Overdue!',
      html: `Thank you for using our services Oliver Ullman! \n Your monthly account statement is over $${ item.amount }, please pay at our earliest convenience to the PayPal address kriz@krizcortes.com. We have a $69 late fee charge, so don't be lazy and make your payment today!`
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
    from: templates[item.type].from || 'pledgeit@gmail.com',
    to: 'oliverullman@gmail.com',
    subject: templates[item.type].subject,
    html: templates[item.type].html
  };

  // console.log('COMPOSED', mail );
  // return new Promise(function( resolve, reject ){

    return mailgun.messages().send( mail )

    //   , function( err, mail ){

    //   return new Promise(function( res, rej ))
    //   console.log("MAILGUN FUNCTION", err, mail );

    //   if (err) {

    //     console.log('mailgun error!', err);
    //     // return Promise.resolve(err).then(function(err){
    //       return false;
    //     // });

    //   } else {

    //     console.log('mailgun success!', mail);
    //     // return Promise.resolve(mail).then(function(mail){
    //       return true;
    //     // });
    //   }

    // })

    .then(function( sent ){

      return !!sent.id;
    });

  // });


};
