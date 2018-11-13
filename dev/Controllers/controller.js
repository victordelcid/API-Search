//var express = require('express');
var redis = require('../Models/redis.js');
var firehose = require('../Models/firehose.js');
var https = require('https');

exports.searchAPI = function (req, res) {
    let title = req.query.title;
    let user_id = 1; //req.query.user_id;
    console.log(title);

    if (title == null) {
        console.log("No Title");
        res.status(400).json({
            status: 400,
            message: "No Title in path"
        })
        return;
    }

    if (user_id == null) {
        console.log("No user_id");
        user_id = 0;
    }

    pull(title);

    function pull(title) {
        var response;
        redis.get(title, function (err, reply) {
            if (err) throw err;                     
            if (reply == null) {
                console.log("Key is not in cache");
                goToAPI(title);
            } else {                
                response = JSON.parse(reply);
                res.status(200).json({
                    response
                });
                response = reply.toString();
                console.log("Key is in cache");
                console.log("Redis response: " + response);
                let payloads = {
                    api1: {
                        key: title,
                        response: response
                    }
                }
                console.log("**save(id,payloads)**");
                save(user_id, payloads);
            }            
        });        
    }

    function goToAPI(title) {
        https.get('https://api.publicapis.org/entries?title=' + title, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {                
                var response = JSON.parse(data);
                if (typeof response == "undefined") {
                    res.status(400).json({
                        status: 400,
                        message: "Undefined response"
                    })
                    console.log("Response data undefined");
                    return;
                }                
                redis.set(title, data);
                res.status(200).json({
                    response
                });
                console.log("Get: https://api.publicapis.org/entries?title=" + title);
                console.log("API response: " + data);  
                let payloads = {
                    api1: {
                        key: title,
                        response: response
                    }
                }
                let id = 1;
                console.log("**save(id,payloads)**");
                save(user_id, payloads);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    function save(id,payloads) {
        // Event must come as a json with {timestamp, id, payloads: api1: {key:, response:}, api2: {key:, response:}, api3: {key:, response:}}

        let event = {
            timestamp: 'Example timestamp',
            id: id,
            payloads: payloads
        }

        var params = {
            DeliveryStreamName: 'QueryStream', /* required */
            Record: { /* required */
                Data: new Buffer.alloc(JSON.stringify(event)) /* Strings will be Base-64 encoded on your behalf */ /* required */
            }
        };

        firehose.putRecord(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                console.log("Record uploaded to Firehose: "+data.RecordId);           // successful response
            //res.status(200).json({
              //  RecordId: data.RecordId
            //});
        });
    }
}

exports.historyAPI = function (req, res) {
    // Do some query over the history index in Elasticsearch
}