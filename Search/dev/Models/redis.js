var redis = require("redis");

//Cloud redis
let redis_client = redis.createClient("//redis-search.yermjr.ng.0001.use1.cache.amazonaws.com:6379");

//Connection to cloud redis through local port
//let redis_client = redis.createClient("//localhost:6379");  //localhost tunnel port forwarding

//multi = client.multi();

module.exports = redis_client;