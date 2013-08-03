
DB  = require('./DB.js');




var User = (function() {
    var _id;
    var _pseudo;

    function User(id){
        connection.query('SELECT * FROM Users WHERE id = ' + id, function(err, rows, fields) {
            if (err) throw err;

            this._id = id;
            this._pseudo = rows[0].pseudo;
        });
    };


   function User(){ };

   User.prototype.getUser =  function (id)
   {

        var  db = new DB();

        db.selectRequest("*","Users","WHERE id = " + id);
        

            console.log(rows[0].pseudo);
       
    };

    User.prototype.getPseudo = function(){
        return this._pseudo;
    };

    return User;
})();

module.exports = User;
