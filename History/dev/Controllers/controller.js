var AWS = require("aws-sdk");

let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "",
    "secretAccessKey": ""
};
AWS.config.update(awsConfig);

exports.historyAPI = function (req, res) {
    let uid = parseInt(req.query.uid, 10);
    var params = {
        TableName: "SearchHistory",
        Key: {
            userID: uid
        }
    }

    var docClient = new AWS.DynamoDB.DocumentClient();

    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
            let response = data["Item"]["responses"];
            //Esto hay que cambiar
            res.status(200).json({
                response
            });
        }
    })
}