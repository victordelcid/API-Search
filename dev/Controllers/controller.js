var express = require('express');
var con = require('../Models/model.js');
var http = require('http');

exports.searchAPI = function (req, res) {
    let title = req.query.title;
    console.log(req.query.category);

    if (title == null) {
        console.log("No Title");
        res.status(400).json({
            status: 400,
            message: "No Title in path"
        })
        return;
    }

    function Match(category) {
        http.get('https://api.publicapis.org/entries?title=' + title, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log("Matching: http://18.212.105.67:3001/?category=" + category);
                console.log("Response: " + data);
                var myjson = JSON.parse(data);
                if (typeof myjson == "undefined") {
                    console.log("Matching error");
                    res.status(400).json({
                        status: 400,
                        message: "Undefined response"
                    })
                    return;
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    //Haciendo un cambio
}
