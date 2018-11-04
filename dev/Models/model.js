var redis = require("redis");

let client = redis.createClient("redis-search.yermjr.ng.0001.use1.cache.amazonaws.com:6379");

multi = client.multi();

module.exports = multi;