var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor',
    database : 'farmDB',
});
//Classe qui enregistre les Fruits de chaque user

var Fruits = (function() {
    var _id;                //id unique d'un fruit INT
    var _nb                 //nombre de fruit
    var _user_id;           //lien vers l'user a qui appartient le fruit INT
    var _fruits_spec_id;    //lien vers le bon type de fruit INT

    function Fruits(){
        
    };

    Fruits.prototype.storeFruits = function(user_id, stockage_id, fruit_id, nb_fruits, poids, type, time, callback){
        saveFruits(user_id, stockage_id, fruit_id, nb_fruits, type, time, function(cb){
            var query = 'SELECT * FROM Stockages WHERE id ='+stockage_id+';';
            connection.query(query,function(err, r, fields) {
                if (err) throw err;
                if(typeof(r[0]) != 'undefined'){
                    var nb = r[0].stockage_state - (poids);
                    query = 'UPDATE Stockages SET stockage_state = '+nb+' WHERE id ='+stockage_id+';';
                    connection.query(query,function(err, r, fields) {
                        callback({
                            ok: true,
                            nb: nb_fruits
                        });
                    });
                }
            });
        });
    };

    Fruits.prototype.updatePourissementFruits = function(){
        var upd = setInterval(function(){
            var query = 'UPDATE Fruits SET pourrissement_state = pourrissement_state-2 WHERE pourrissement_state >0 AND (stockage_type = 1 OR stockage_type = 2);';
            connection.query(query, function(err,rows,fields){
                if(err) throw err;
            });
        },(2000));
    };

    Fruits.prototype.SellFruit = function(fruit_id, stockage_id, poids, prix, user_id, callback){
        var query = 'DELETE FROM Fruits WHERE id='+fruit_id+';';
        connection.query(query, function(err,rows,fields){
            if(err) throw err;
            query = 'UPDATE Stockages SET stockage_state = stockage_state+'+poids+' WHERE id = '+stockage_id+';';
            connection.query(query, function(err,rows,fields){
                if(err) throw err;
                query = 'UPDATE Users SET argent = argent+'+prix+' WHERE id ='+user_id+';';
                connection.query(query, function(err,rows,fields){
                    if(err) throw err;
                    callback(true);
                });
            });

        });
    };

    Fruits.prototype.DropFruit = function(fruit_id, stockage_id, poids, callback){
        var query = 'DELETE FROM Fruits WHERE id='+fruit_id+';';
        connection.query(query, function(err,rows,fields){
            if(err) throw err;
            query = 'UPDATE Stockages SET stockage_state = stockage_state+'+poids+' WHERE id = '+stockage_id+';';
            connection.query(query, function(err,rows,fields){
                if(err) throw err;
                callback(true);
            });

        });
    };

    Fruits.prototype.DropAllDeadFruit = function(user_id, stockage_id, callback){
        var query = 'SELECT * FROM Fruits WHERE stockage_id='+stockage_id+' AND user_id ='+user_id+' AND pourrissement_state <= 0;';
        connection.query(query, function(err,rows,fields){
            if(typeof(rows[0]) != 'undefined'){
                if(err) throw err;
                DeleteFruits(rows, function(){
                    callback(true);
                });
            }else{
                callback(false);
            }
        });
    };

    function DeleteFruits(fruits, callback){
        var nb = fruits.length;
        var i = 0;
        while(i < nb){
            DeleteFruit(fruits[i]);
            i++;
        }
        callback(true);
    };

    function DeleteFruit(fruit){
        var query = 'SELECT * FROM Fruits_spec WHERE id = '+fruit.fruits_spec_id+';';
        connection.query(query, function(err, rows, fields){
            if(err) throw err;
            query = 'DELETE FROM Fruits WHERE id ='+fruit.id+';';
            connection.query(query, function(err, row, fieds){
                if(err) throw err;
                query = 'UPDATE Stockages SET stockage_state = stockage_state +'+rows[0].poids+' WHERE id ='+fruit.stockage_id+';';
                connection.query(query, function(err, rows, field){
                    if(err) throw err;
                })
            })
        });
    }

    //Getters
    Fruits.prototype.getId = function() {
        return _id;
    };
    Fruits.prototype.getNb = function() {
        return _nb;
    };
    Fruits.prototype.getUserId = function() {
        return _user_id;
    };
    Fruits.prototype.getFruitsSpecId = function() {
        return _fruits_spec_id;
    };


    //Setters
    Fruits.prototype.setId = function(id) {
        _id = id;
    };
    Fruits.prototype.setNb = function(nb) {
        _nb = nb;
    };
    Fruits.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };
    Fruits.prototype.setFruitsSpecId = function(fruits_spec_id) {
        _fruits_spec_id = fruits_spec_id;
    };

    function saveFruits(user_id, stockage_id, fruit_id, nb_fruits, type, time, callback){
        while(nb_fruits > 0){
            saveFruit(user_id, fruit_id, stockage_id, type, time);
            nb_fruits--;
        }
        callback(true);
    }

    function saveFruit(user_id, fruit_id, stockage_id, type, time){
        //console.log(user_id+" "+fruit_id+" "+stockage_id)
        var query = 'INSERT INTO Fruits (user_id,fruits_spec_id, stockage_id, stockage_type, pourrissement_state) VALUES(' + user_id + ',' + fruit_id + ','+ stockage_id +','+type+','+time+');';
        connection.query(query,function(err, r, fields) {
            if (err) throw err;
        });
    }

    getTimeDb = function(){
        var d = new Date();
        var years   = d.getFullYear(),
            month   = ((d.getMonth() + 1).toString().length > 1) ? (d.getMonth() + 1) : '0'+(d.getMonth() + 1),
            day     = ((d.getDate()).toString().length > 1) ? d.getDate() : '0'+d.getDate(),
            hours   = ((d.getHours()).toString().length > 1) ? d.getHours() : '0'+d.getHours(),
            minute  = ((d.getMinutes()).toString().length > 1) ? d.getMinutes() : '0'+d.getMinutes(),
            seconde = ((d.getSeconds()).toString().length > 1) ? d.getSeconds() : '0'+d.getSeconds();
        var db_date = years+'-'+month+'-'+day+' '+hours+':'+minute+':'+seconde;

        return db_date;
    }

    return Fruits;
})();

module.exports = Fruits;
