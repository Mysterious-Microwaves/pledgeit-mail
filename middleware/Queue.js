'use strict';

var Promise = require('bluebird');

function Queue(red){

  this.Red = red;           // Redis
  this.counter = 'counter'; // string
  this.mail = 'mails';      // hash
  this.queue = 'queue';     // list
};

// returns [ key, data ]
Queue.prototype.get = function(table, key){
  return this.Red.hgetAsync( table, key ).then(function(data){
    return [ key, JSON.parse(data) ];
  });
};
 
Queue.prototype.size = function(){
  // return size of the queue
  return this.Red.llenAsync( this.queue )
  .then( function(size) {
    return size; 
  })
  .catch(function(err){
    console.log("Error getting size of queue", err);
    return err;
  });
};

Queue.prototype.add = function(item){

  var Q = this;

  return Q.size()
  .then(function(size){

    // create keyname with count
    var key = 'm'+size;
    
    // increase counter
    // return Q.Red.incrAsync( Q.counter )
    // .then(function(counter){
      
      // push item to end of Queue
      return Q.Red.rpushAsync( Q.queue, key )
      .then(function(queue_res){

        // console.log("PUSH",key,item);

        // save item in our storage { key: item }
        return Q.Red.hmsetAsync( Q.mail, key, item )
        .then(function(hash_res){

          return {
            key: key,
            saved: hash_res
          }

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
            return { key: key, item: item, sent: sent, deleted: deleted };
          });

        } else {
          // return err array for now,
          // ************************* to-do add to re-attempts queue
          return { key: key, item: item, sent: sent }
        }
      });
    });    
  });
};

Queue.prototype.doGroup = function(amount){

  var Q = this;

  // given amount or all
  return Promise.resolve(amount).then(function(amount){
    
    if ( amount === undefined ){
      amount = Q.size();
    }
    return amount;

  }).then(function(amount){

    return new Promise( function(resolve, reject){

      var error = null;
      while ( amount > 0 && error === null ){

        Q.do().then(function(result){
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
 
// to-do ( use mailGun );
Queue.prototype.sendMail = function(item){

  var Q = this;

  return new Promise(function(resolve, reject){
    // console.log("SENDING MAIL ", item);
    // which calls the mail building function using item
    // that calls the sending function 
    resolve(true);
  });
};

module.exports = Queue;

// Queue.prototype.getRange = function(amount){
  
//   var Q = this;

//   // given amount or all
//   if ( !amount ){
//     amount = Q.size();
//     console.log("getting range of ",amount);
//   }

//   return Q.Red.lrangeAsync( Q.queue, 0, amount ).then(function(range){
//     return eachAsync( range, function(item){
//       return Q.getItem( Q.mail, item );
//     });
//   });
// };


// Queue.prototype.doRange = function(amount){
//   var Q = this;
//   return Q.getRange(amount).then(function(range){
//     // process 
//     return Q.sendGroupMail(range).then(function(groupSent){
//       // delete from db
//       return Q.deleteGroup(range).then(function(deletedGroupDb){
//         // delete from queue

//       });
//     });
//   });
// };

// Queue.prototype.deleteGroup = function(range){
//   return eachAsync( range, function(item){
//     return Q.delete( Q[item[1].type], item[0] );
//   });
// };


// Queue.prototype.sendGroupMail = function(group){

//   return eachAsync( group, Q.sendMail );
// };

// new Promise(function(resolve, reject){
  // do something cool
// });

// QUEUE is a redis-cache,
// save queue snapshot before and after every worker execution
// if it crashes, we don't loose queue ( rebuild from snapshot )
// snapshot === file?

// Redis Hash ( storage )

  //    add | HMSET hashName field1 value1 field2 value2 ( JSON VALUES )
  //    get | HGET hashName field1
  // delete | HDEL hashName field1 

//  Redis Lists ( queue )

  //  RPUSH | add to end 
  //   LPOP | remove and get the first element
  // LRANGE | retrieve a group of elements from x to z
  //  LTRIM | trim a list to the specified range
  //   LLEN | size of a list

// Redis String ( counter )

  // APPEND | appends value to a key
  //   INCR | increase the integer value of a key by 1
  //   DECR | decrements the integer value of a key by 1
  // DECRBY | decrements the integer value of a key by given number
  //    GET | get the value of a key

