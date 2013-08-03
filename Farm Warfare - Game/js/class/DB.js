var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor',
    database : 'farmDB',
});

var DB = (function() {
    var connect;

    function DB(){
        connect = connection;
    };

    DB.prototype.connection = function(){
        return connect;
    };

    DB.prototype.insert = function(table,colum,data) {
        connection.query('INSERT INTO ' + table + ' ' + colum + ' VALUES ' + data + ';', function(err, rows, fields) {
            if (err) throw err;
            console.log('insert into' + table + ' done');
        });
    };


    DB.prototype.selectRequest = function(champs,table,where){
        if(where == '')
            where = '1=1';
        connection.query('SELECT ' + champs + ' FROM ' + table  + ' WHERE ' +  where, function(err, rows, fields) {
            if (err) throw err;
           
            console.log('SELECT in ' + table + ' ok');
            console.log(rows.length);

            return rows;
        });

    };
    DB.prototype.manag_money = function(id, table, id_object)
    {
        var connection = _DB.connection();
        connection.query('SELECT argent FROM Users WHERE id = '+id,function(err,rows,fields){
            if(err) throw err;
            var money = rows[0].argent;
            connection.query('SELECT prix FROM '+table+' WHERE id = '+id_object,function(err,rows,fields){
                if(err) throw err;
                connection.query('UPDATE Users SET argent = '+(money - rows[0].prix),function(err,rows,fields){
                    if(err) throw err;
                })
            })
        });
    };

    return DB;
})();

module.exports = DB;
