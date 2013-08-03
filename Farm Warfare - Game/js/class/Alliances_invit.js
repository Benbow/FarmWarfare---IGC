var DB = require('./DB');
//Classe qui enregistre les Alliances_invit de chaque user

var Alliances_invit = (function() {
    var _id;            //id unique d'une alliance INT
    var _from_user_id;  //nom de l'alliances String
    var _to_user_id;    //lien vers le user maitre de l'alliance INT
    var _alliance_id    

    function Alliances_invit(){
        _DB = new DB();
    };

    Alliances_invit.prototype.Add_Alliance_invit = function(from, to, alliance, callback){
        var connection = _DB.connection();
        var query = 'INSERT INTO Alliance_invit (from_user_id, to_user_id, alliance_id) VALUES ('+from+', '+to+', '+alliance+');';
        connection.query(query,function(err, rows, fields) {
            callback(true);
        });
    };

    Alliances_invit.prototype.getInvitList = function(user_id, callback){
        var connection = _DB.connection();
        var query = 'SELECT invit.id, invit.alliance_id, u.pseudo, a.name FROM Alliance_invit as invit INNER JOIN Users as u ON invit.from_user_id=u.id INNER JOIN Alliances as a ON  invit.alliance_id=a.id WHERE invit.to_user_id = '+user_id+';';
        connection.query(query,function(err, rows, fields) {
            if(rows[0] != null){
                callback(rows);
            }else{
                callback(false)
            }
        });
    };

    Alliances_invit.prototype.refus_invit = function(invit_id, callback){
        var connection = _DB.connection();
        var id = this._id;
        var query = 'DELETE FROM Alliance_invit WHERE id='+invit_id+';';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            callback(true);
        });
    };

    //Getters
    Alliances_invit.prototype.getId = function() {
        return _id;
    };

    //Setters
    Alliances_invit.prototype.setId = function(id) {
        _id = id;
    };
    
    return Alliances_invit;
})();

module.exports = Alliances_invit;