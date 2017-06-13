'use strict';
var Mail = require('./Mail');
var Promise = require('bluebird');

function Queue(red){

  this.Red = red;           // Redis
  this.counter = 'counter'; // string
  this.mail = 'mails';      // hash
  this.queue = 'queue';     // list
};

// returns [ key, data ]
Queue.prototype.get = function( table, key ){

  return this.Red.hgetAsync( table, key ).then(function(data){

    return [ key, JSON.parse(data) ];
  });
};
 
Queue.prototype.size = function(){

  // return size of the queue
  return this.Red.llenAsync( this.queue ).then( function(size) {

    return size; 

  }).catch(function(err){

    return err;
  });
};

Queue.prototype.add = function( item ){

  var Q = this;

  return Q.size()
  .then(function(size){

    // create keyname based on queue size
    var key = 'm'+size;
      
      // push item to end of Queue
      return Q.Red.rpushAsync( Q.queue, key )
      .then(function(queue_res){

        // save item in storage { key: item }
        return Q.Red.hmsetAsync( Q.mail, key, item )
        .then(function(hash_res){

          return { key: key, saved: hash_res }

      });
    });
  });
};

Queue.prototype.next = function(){

  return this.Red.lpopAsync( this.queue );
};

Queue.prototype.delete = function( table, key ){

  return this.Red.hdelAsync( table, key ).then(function(response){
    return !!response;
  });
};

Queue.prototype.do = function(){

  var Q = this;

  // pop item from queue
  return Q.next().then(function( key ){

    // get data of received key
    return Q.get( Q.mail, key ).then(function( item ){

      // send mail passing data
      return Q.sendMail( item ).then(function( sent ){

        if ( sent ){
          // delete item from db
          return Q.delete( Q.mail, key ).then(function( deleted ){

            var result = { key: key, item: item, sent: sent, deleted: deleted };
            console.log("DONE:",key, JSON.stringify(result));
            return result;
          });

        } else {

          console.log("NOT SENT", key, sent );
          // return err array for now,
          // ************************* to-do add to re-attempts queue
          return { key: key, item: item, sent: sent }
        }
      });
    });    
  });
};

Queue.prototype.doGroup = function( amount ){

  var Q = this;

  // given amount or all
  return Promise.resolve( amount ).then(function( amount ){
    
    return ( amount !== undefined ) ? amount : Q.size();

  }).then(function( amount ){

    return new Promise(function( resolve, reject ){

      var error;
      while ( amount > 0 && error === undefined ){

        Q.do().then(function( result ){
          if ( !result.sent || !result.deleted ){
            error = result;
          }
        });
        amount--;
      }
      (error) ? reject(error) : resolve(true);
    });

  });
};
 
Queue.prototype.sendMail = function( item ){

  return Mail.sendMail( item[1] );
};

module.exports = Queue;
