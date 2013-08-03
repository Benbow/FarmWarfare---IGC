var DB = require('./DB');

//Classe qui enregistre les bâtiments de stockages de chaque user

var Stockages = (function() {

    //attributs
    var _id;                //id unique d'un bâtiments de stockages INT
    var _stockage_state;    //état actuel de contenance du bâtiments de stockage INT
    var _isConstruct;       //permet de vérifier si le bâtiment est en construction ou non INT
    var _user_id;           //relie un user à son bâtiment INT
    var _stockages_spec_id; //détermine le type du bâtiment INT
    var _tile_id;           //relie le bâtiment à la tile ou il est construit INT 
    var _DB;

    //Constructeurs
    function Stockages(){
        _DB = new DB();
        
    };

    //Methodes
    Stockages.prototype.Add_Stockages = function(isConstruct, user_id, stockages_spec_id, tile_id){
        var connection = _DB.connection();
        var query = 'SELECT * FROM Stockages_spec WHERE id ='+stockages_spec_id+';';
        connection.query(query,function(err, rows, fields) {
             if (err) throw err;
             if(typeof(rows[0]) != 'undefined'){
                query = 'INSERT INTO Stockages (stockage_state, isConstruct, user_id, stockages_spec_id, tile_id) VALUES ('+rows[0].stockage+', '+isConstruct+', '+user_id+', '+stockages_spec_id+', '+tile_id+');';
                connection.query(query,function(err, row, fields) {
                    if (err) throw err;
                    connection.query('UPDATE Tiles SET isEmpty = 2 WHERE id ='+tile_id+';', function(err,row,fields){
                        connection.query('UPDATE Users SET argent = argent - '+rows[0].prix+' WHERE id ='+user_id+';', function(err,row,fields){
                            console.log("Stockages created");
                        })
                    });
                });
             }
        });
    };

    Stockages.prototype.Add_StockagesWithOrigin = function(isConstruct, user_id, stockages_spec_id, tile_id, origin_tile_id){
        var connection = _DB.connection();
        var query = 'INSERT INTO Stockages (stockage_state, isConstruct, user_id, stockages_spec_id, tile_id, origin_tile_id) VALUES (0, '+isConstruct+', '+user_id+', '+stockages_spec_id+', '+tile_id+', '+origin_tile_id+');';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            connection.query('UPDATE Tiles SET isEmpty = 2 WHERE id ='+tile_id+';', function(err,rows,fields){
                console.log("Stockages created");
            });       
        }); 
    };

    Stockages.prototype.Delete_Stockages = function(id){
        var connection = _DB.connection();
        var query = 'DELETE FROM Stockages WHERE id='+id;
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            console.log("Stockages deleted");
        });
    };

    Stockages.prototype.GetMyStockages = function(id, nb, poids, callback){
        var connection = _DB.connection();
        var n = poids;
        var query = 'SELECT * FROM Stockages WHERE user_id='+id+' AND stockage_state >= '+n+';';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;

            if(typeof(rows[0]) != 'undefined'){
                callback({
                    ok : true,
                    stock : rows
                });
            }else{
                callback({
                    ok : false
                });
            }
        });
    };

    Stockages.prototype.GetInfos = function(user_id, tile_id, callback){
        var connection = _DB.connection();
        var query = 'SELECT * FROM Stockages WHERE tile_id='+tile_id+';';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            if(typeof(rows[0]) != 'undefined'){
                if(rows[0].origin_tile_id != null){
                    if (err) throw err;
                    query = 'SELECT * FROM Stockages WHERE tile_id='+rows[0].origin_tile_id+';';
                    connection.query(query,function(err, rows, fields) {
                        query = 'SELECT * FROM Stockages_spec WHERE id='+rows[0].stockages_spec_id+';';
                        connection.query(query,function(err, row, fields) {
                            if (err) throw err;
                            if(typeof(row[0]) != 'undefined'){
                                query = 'SELECT * FROM Fruits WHERE stockage_id ='+rows[0].id+';';
                                connection.query(query,function(err, ro, fields) {
                                     if (err) throw err;
                                     if(typeof(ro[0]) != 'undefined'){
                                        query = 'SELECT * FROM Fruits_spec;';
                                        connection.query(query,function(err, r, fields) {
                                            if (err) throw err;
                                            if(typeof(r[0]) != 'undefined'){
                                                callback({
                                                    type : 'stock',
                                                    stockages : rows[0],
                                                    stockages_spec : row[0],
                                                    fruits : ro,
                                                    fruits_spec : r
                                                });
                                            }else{
                                                callback(false);
                                            }
                                        });
                                     }else{ 
                                        callback(false);
                                     }
                                });
                            }else{
                                callback(false);
                            }
                        });
                    });
                }else{
                    if (err) throw err;     
                    query = 'SELECT * FROM Stockages_spec WHERE id='+rows[0].stockages_spec_id+';';
                    connection.query(query,function(err, row, fields) {
                        if (err) throw err;
                        if(typeof(row[0]) != 'undefined'){
                            query = 'SELECT * FROM Fruits WHERE stockage_id ='+rows[0].id+';';
                            connection.query(query,function(err, ro, fields) {
                                 if (err) throw err;
                                 if(typeof(ro[0]) != 'undefined'){
                                    query = 'SELECT * FROM Fruits_spec;';
                                    connection.query(query,function(err, r, fields) {
                                        if (err) throw err;
                                        if(typeof(r[0]) != 'undefined'){
                                            callback({
                                                type : 'stock',
                                                stockages : rows[0],
                                                stockages_spec : row[0],
                                                fruits : ro,
                                                fruits_spec : r
                                            });
                                        }else{
                                            callback(false);
                                        }
                                    });
                                 }else{ 
                                    callback(false);
                                 }
                            });
                        }else{
                            callback(false);
                        }
                    });
                }
            }else{
                query = 'SELECT * FROM Maisons WHERE tile_id='+tile_id+';';
                connection.query(query,function(err, rows, fields) {
                    if(typeof(rows[0]) != 'undefined'){
                        callback({
                            type : 'maison',
                            maison : rows[0]
                        });
                    }
                });
            }
        });
    };

    Stockages.prototype.getInfosStock = function(tile_id, callback){
        var connection = _DB.connection();
        var query = 'SELECT * FROM Stockages WHERE tile_id = '+tile_id+';';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            if(typeof(rows[0]) != "undefined"){
                if(rows[0].origin_tile_id == null){
                    callback(rows[0]);
                }else{
                    query = 'SELECT * FROM Stockages WHERE tile_id = '+rows[0].origin_tile_id+';';
                    connection.query(query,function(err, row, fields) {
                        if (err) throw err;
                        if(typeof(row[0]) != "undefined"){
                            callback(row[0]);
                        }else{
                            callback(false);
                        }
                    });
                }
            }else{
                callback(false);
            }
        });
    };

    Stockages.prototype.cleanComplexBuilding =function(callback){
        var connection = _DB.connection();
        complex = new Array();
        connection.query('SELECT * FROM Tiles ', function(err, rows, fields){
            for(tile in rows){
                if(tile.origin_tile_id != null){
                    console.log('test');
                    if(rows[tile.origin_tile_id-1].isEmpty == 0){
                        connection.query('UPDATE Tiles SET isEmpty = 0, origin_tile_id = NULL WHERE id='+tile.id, function(err, row, fields){});
                        connection.query('DELETE FROM Stockages WHERE tile_id='+tile.id, function(err, row, fields){});
                        complex.push({
                            x : tile.x,
                            y : tile.y
                        });
                    }
                }
            }
            callback(complex);
        });
    };

    Stockages.prototype.checkBatPrice = function(callback){
        var connection = _DB.connection();
        var query = 'SELECT * FROM Stockages_spec ;';
        connection.query(query, function(err, rows, fields){
            callback(rows);
        });
    };

    
    //Getters
    Stockages.prototype.getId = function() {
        return _id;
    };
    Stockages.prototype.getStockageState = function() {
        return _stockage_state;
    };
    Stockages.prototype.getIsConstruct = function() {
        return _isConstruct;
    };
    Stockages.prototype.getUserId = function() {
        return _user_id;
    };
    Stockages.prototype.getStockageSpecId = function() {
        return _stockages_spec_id;
    };
    Stockages.prototype.getTileId = function() {
        return _tile_id;
    };

    //Setters
    Stockages.prototype.setId = function(id) {
        _id = id;
    };
    Stockages.prototype.setStockageState = function(stockage_state) {
        _stockage_state = stockage_state;
    };
    Stockages.prototype.setIsConstruct = function(isConstruct) {
        _isConstruct = isConstruct;
    };
    Stockages.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };
    Stockages.prototype.setStockageSpecId = function(stockages_spec_id) {
        _stockages_spec_id = stockages_spec_id;
    };
    Stockages.prototype.setTileId = function(tile_id) {
        _tile_id = tile_id;
    };
    
    
    return Stockages;
})();

module.exports = Stockages;
