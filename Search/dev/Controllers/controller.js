//var express = require('express');
var redis = require('../Models/redis.js');
var firehose = require('../Models/firehose.js');
var https = require('https');

exports.searchAPI = function (req, res) {
    let user_id = parseInt(req.query.uid,10);
    let title = (req.query.title);    
    console.log(title);
    console.log(user_id);

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
                let apiresponses = {
                    api1: reponse,
                    api2: 'response2',
                    api3: 'response3'
                }
                console.log("**save(id,payloads)**");
                save(user_id, apiresponses);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    function save(id,apiresponses) {
        // Event must come as a json with {timestamp, id, payloads: api1: {key:, response:}, api2: {key:, response:}, api3: {key:, response:}}
        let event = "";
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let datetime = date + ' ' + time;
        event = {
            timestamp: datetime.toString(),
            user_id: id,
            key: title,
            responses: apiresponses
        };
        var params = {
            DeliveryStreamName: 'QueryStream', /* required */
            Record: { /* required */
                Data: new Buffer.from(JSON.stringify(event)+'\n') /* Strings will be Base-64 encoded on your behalf */ /* required */
            }
        };

        firehose.putRecord(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                console.log("Record uploaded to Firehose: "+data.RecordId);           // successful response
        });
    }
}

exports.historyAPI = function (req, res) {
    // Do some query over the history index in Elasticsearch
}