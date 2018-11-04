//var express = require('express');
var client = require('../Models/model.js');
var https = require('https');

exports.searchAPI = function (req, res) {
    let title = req.query.title;
    console.log(title);

    if (title == null) {
        console.log("No Title");
        res.status(400).json({
            status: 400,
            message: "No Title in path"
        })
        return;
    }

    pull(title);

    function pull(title) {
        var response;
        client.get(title, function (err, reply) {
            if (err) throw err;
            response = reply.toString();  
            console.log("Redis response: " + response);
            if (response == null) {
                console.log("Key is not in cache");
                goToAPI(title);
            } else {
                console.log("Key is in cache");
                res.status(200).json({
                    response
                });
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
                console.log("Get: https://api.publicapis.org/entries?title=" + title);
                var response = JSON.parse(data);
                if (typeof response == "undefined") {
                    console.log("Matching error");
                    res.status(400).json({
                        status: 400,
                        message: "Undefined response"
                    })
                    return;
                }
                console.log("API response: " + data);
                client.set(title, data);
                res.status(200).json({
                    response
                });
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    //Haciendo un cambio
}
