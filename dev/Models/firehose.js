var AWS = require("aws-sdk");

let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "",
    "secretAccessKey": ""
};
AWS.config.update(awsConfig);

AWS.config.apiVersions = {
    firehose: '2015-08-04'
};

var firehose = new AWS.Firehose();
console.log("Connected!");
module.exports = firehose;