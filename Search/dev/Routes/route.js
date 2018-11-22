'use strict';
module.exports = function(app){
    var searchController = require('../Controllers/controller');
    
    app.route('/history/')
        .get(searchController.historyAPI);
};