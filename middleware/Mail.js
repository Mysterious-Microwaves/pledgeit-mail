'use strict';
var mailgunApiKey = process.env.MAILGUN_API_KEY || require('../config/default.json')['MAILGUN_API_KEY'];
var domain = process.env.MAILGUN_DOMAIN || require('../config/default.json')['MAILGUN_DOMAIN'];

var mailgun = require('mailgun-js')({ apiKey: mailgunApiKey, domain: domain });
var Promise = require('bluebird');

module.exports.create_venmo = function(data){
  // link example:
  // https://venmo.com/?txn=pay&audience=private&recipients=userPhoneEmail&amount=500&note=projectName
  var link = {
    url: 'https://venmo.com/?',
    txn: 'pay',
    audience: 'private' 
  }

  link.recipients = data.venmo;
  link.amount = data.amount;
  link.note = data.project;

  var venmolink = Object.keys(link).reduce(function(arr,part,idx){
    
    if ( idx === 0 ){
      arr.push( link[part] );
    } else if ( idx === 1 ){
      arr[0] = arr[0] + part + '=' + link[part];
    } else {
      arr.push( part+'='+link[part] );
    }
    return arr;
  },[]).join('&');

  // console.log("VENMOLINK", venmolink);
  return venmolink;
};

module.exports.composeMail = function(item){

  var templates = {
    test: {
      subject: 'This Email is a Test',
      html: `This is the html of the email!\nThe body should include the passed in data:\nto: ${ item.to }\ntype: ${ item.type }\namount: ${ item.amount }\n`
    },

    thanks_pledge: {
      
      subject: 'Thank You for Pledging!',
      html: `Thank you for pledging $${item.amount} to ${item.project}! \n Once ${item.project} reaches it\'s due date, we\'ll send you a venmo email with the link to transfer your pledged amount to the organization behind this project.\n\n
        Have a nice day!
      `
    },

    goal_reached: {
      subject: `${item.project} reached it's goal!`,
      html: `Thanks to awesome people like you, ${item.project} reached it's goal!\n Thank you for your commitment to help and change the world around us.\n Pleaes follow the link to complete your pledge through the organization's venmo account.\n\n Thank you for making ${item.project} a reality, Keep being awesome!\n\n<h3>${ module.exports.create_venmo(item) }</h3>`
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
  return mailgun.messages().send( mail )
    .then(function( sent ){
      return !!sent.id;
    })
    .catch(function(err){
      console.log("sendMail error: ",err);
      return err;
    });
};
