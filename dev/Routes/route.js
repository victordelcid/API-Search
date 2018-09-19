'use strict';
module.exports = function(app){
    var searchController = require('../Controllers/controller');
    
    app.route('/search/')
        .get(searchController.searchAPI);
};