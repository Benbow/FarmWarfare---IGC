var DB = require('./DB');

var User = (function() {
    // "private" variables 
    var _id;
    var _pseudo;
    var _alliance;
    var _userAlliance = new Array();
    var _DB;
    var canConquet = true;
    var lastAttackId = 0;
    var AttackedBy = 0;


    // constructor
    function User(){
        _DB = new DB();
        this._id = 0;
    };


    User.prototype.loginUser = function(mail,password,callback) {
        var connection = _DB.connection();
        var userInfo = new Array();
       
        var user = connection.query('SELECT * FROM Users WHERE mail = "' + mail + '";',function(err,rows,fields){
            if(err) throw err;
            console.log(rows[0]);
            if(typeof(rows[0]) != "undefined"){
                userInfo[0] = rows[0].pseudo;
                userInfo[1] = rows[0].mail;
                userInfo[2] = rows[0].password;
                userInfo[3] = rows[0].id;
                userInfo[4] = rows[0].status;
                userInfo[5] = rows[0].alliance_id;
               
                callback(userInfo);
            }else{
                callback(false);
            }
        });
    };

   

    User.prototype.combat = function(user_id,enemi, callback) {
        var connection = _DB.connection();
        this.getArmeInfos(user_id,function(infos_user_arme){
            connection.query('SELECT spec.`puissance`, spec.`precision`, spec.`vitesse` FROM `Armes_spec` as spec LEFT JOIN Armes as arme ON spec.id = arme.armes_spec_id WHERE arme.user_id = '+ enemi + ';',function(err,rows,fields){
                if (err) throw err;
                var infos_enemi_arme = rows[0];
                connection.query('SELECT life, id  FROM Users WHERE id = '+ user_id +' OR id = '+enemi+ ';',function(err,rows,fields){
                    if (err) throw err;
                    if (user_id == rows[0].id) {
                        infos_user_arme.life = rows[0].life;
                        infos_enemi_arme.life = rows[1].life;
                    }
                    else {
                        infos_user_arme.life = rows[1].life;
                        infos_enemi_arme.life = rows[0].life;
                    }
                    var end_figth = false;
                    var user_combat = setInterval(function(){
                        if(infos_enemi_arme.life <= 0 || infos_user_arme.life <= 0){
                            clearInterval(user_combat);
                            if(!end_figth) {
                                if(infos_enemi_arme.life <= 0)
                                    callback({'figth' : true, 'life_user': infos_user_arme.life, 'life_enemi': 0});
                                else
                                    callback({'figth' : false, 'life_user': 0, 'life_enemi': infos_enemi_arme.life});
                            }
                            end_figth = true;
                        }
                        else {
                            var random = Math.floor((Math.random()*100)+1);
                            if(random < infos_user_arme.precision) {
                                console.log(user_id+' touche');
                                infos_enemi_arme.life -= infos_user_arme.puissance;
                            }
                        }
                    },infos_user_arme.vitesse*1000);

                    var enemi_combat = setInterval(function(){
                        if(infos_enemi_arme.life <= 0 || infos_user_arme.life <= 0){
                            clearInterval(enemi_combat);
                            if(!end_figth) {
                                if(infos_enemi_arme.life <= 0)
                                    callback({'figth' : true, 'life_user': infos_user_arme.life, 'life_enemi': 0});
                                else
                                    callback({'figth' : false, 'life_user': 0, 'life_enemi': infos_enemi_arme.life});
                            }
                            end_figth = true;
                        }
                        else {
                            var random = Math.floor((Math.random()*100)+1);
                            if(random < infos_enemi_arme.precision) {
                                console.log(enemi+' touche');
                                infos_user_arme.life -= infos_enemi_arme.puissance;  
                            }                          
                        }
                    },infos_enemi_arme.vitesse*1000);
                    
                });
            });
        });
    };

    User.prototype.changeUserLife = function(user_id,life) {
        var connection = _DB.connection();

        connection.query('UPDATE Users SET life = '+life+' WHERE id = ' + user_id, function(err,rows,fields){
            if(err) throw err;
        });
    }

    User.prototype.respawn = function(user_id,callback) {
        var connection = _DB.connection();

        connection.query('UPDATE Tiles SET user_id = NULL WHERE user_id = ' + user_id, function(err,rows,fields){
            if(err) throw err;
        });
        connection.query('UPDATE Users SET resting = 1 WHERE id = ' + user_id, function(err,rows,fields){
            if(err) throw err;
        });
        connection.query('SELECT tile.x, tile.y, tile.id FROM Tiles as tile LEFT JOIN Maisons as maison ON maison.tile_id = tile.id WHERE maison.user_id = '+user_id, function(err,rows,fields){
            if (err) throw err;
            var tile_id = rows[0].id;
            connection.query('UPDATE Tiles SET user_id = ' + user_id + ' WHERE x = ' + rows[0].x + ' AND y = ' + rows[0].y, function(err,rows,fields){
                if(err) throw err;
                callback(tile_id);
            });
        });
    };

    User.prototype.getArmeInfos = function(id,callback) {
        var connection = _DB.connection();
        connection.query('SELECT spec.`puissance`, spec.`precision`, spec.`vitesse` FROM `Armes_spec` as spec LEFT JOIN Armes as arme ON spec.id = arme.armes_spec_id WHERE arme.user_id = '+ id+ ';',function(err,rows,fields){
            if (err) throw err;
            callback(rows[0]);
        });
    };

    User.prototype.setAttackedBy = function(enemi_id) {
        this.attackedBy = enemi_id;
    };

    User.prototype.getAttackedBy = function() {
        return this.attackedBy;
    };

    User.prototype.registerUser = function(mail, pseudo, password, callback) {
        var connection = _DB.connection();

            connection.query('SELECT mail FROM Users WHERE mail = "' + mail + '";',function(err,row,fields){
            if(err) throw err;
            if(typeof (row[0]) == "undefined"){
                        connection.query('SELECT pseudo FROM Users WHERE pseudo = "' + pseudo + '";',function(err,row,fields){
                        if(err) throw err;
                        if(typeof (row[0]) == "undefined"){
                                connection.query('INSERT INTO Users (id,pseudo,password,mail) VALUES ("","' + pseudo + '","' + password + '","' + mail + '");',function(err,row,fields){
                                if(err) throw err;                                 
                                });

                                }else{
                                    console.log("pseudo existe deja");                                  
                                }
                        });  
            }else{
                console.log("email existe deja");              
            }
             
        });

    };


 User.prototype.existMail = function(mail,callback) {
        var connection = _DB.connection();
        var newUserInfo = new Array();
       
        var user = connection.query('SELECT * FROM Users WHERE mail = "' + mail + '";',function(err,rows,fields){
            if(err) throw err;

            newUserInfo[0] = rows[0].pseudo;
            newUserInfo[1] = rows[0].mail;

        });
       
            if(newUserInfo[0] != null)
                return true;
            else 
                return false;
    };
    

    User.prototype.buy_graines = function(nb,graines_spec_id, id, callback) {
        var connection = _DB.connection();
        var prix;
        var sommes
        var query ='SELECT prix  FROM Graines_spec WHERE id ='+graines_spec_id;
        connection.query(query, function(err,row,fields){
            if(err) throw err;
                if(typeof (row[0]) != "undefined"){
                    prix = row[0].prix;
                    sommes =nb*prix;
                    connection.query('SELECT argent FROM Users WHERE id = ' + id + ';',function(err,row,fields){
                    if(err) throw err;
                    if(row[0].argent >= sommes){                                                         
                       var query = 'UPDATE  Users SET argent = argent-'+nb*prix+' WHERE id = ' + id;
                        connection.query(query, function(err,row,fields){
                        if(err) throw err;
                        callback(true);
                     
                        });
                    }else{
                        console.log("t'es un pauvre");
                        callback(false);
                    }
                });
            }                     
        });
    };


    User.prototype.buy_armes = function(nb,armes_spec_id, id, callback) {
        var connection = _DB.connection();
        var prix;
        var query ='SELECT prix  FROM Armes_spec WHERE id ='+armes_spec_id;
        connection.query(query, function(err,row,fields){
            if(err) throw err;
                if(typeof (row[0]) != "undefined"){
                    prix = row[0].prix;
                    connection.query('SELECT argent FROM Users WHERE id = ' + id + ';',function(err,row,fields){
                    if(err) throw err;
                    if(row[0].argent >= prix){                                                         
                       var query = 'UPDATE  Users SET argent = argent-'+prix+' WHERE id = ' + id;
                        connection.query(query, function(err,row,fields){
                        if(err) throw err;
                        callback(true);
                     
                        });
                    }else{
                        console.log("t'es un pauvre");
                        callback(false);
                    }
                });
            }                     
        });
    };

     User.prototype.buy_energie = function(nb, prix, id, callback) {
        var connection = _DB.connection();   
                connection.query('SELECT argent FROM Users WHERE id = ' + id + ';',function(err,row,fields){
                if(err) throw err;
                if(row[0].argent >= prix*nb){                                                         
                   var query = 'UPDATE  Users SET argent = argent-'+prix*nb+' WHERE id = ' + id;
                    connection.query(query, function(err,row,fields){
                    if(err) throw err;
                    callback(true);
                 
                    });
                }else{
                    console.log("t'es un pauvre");
                    callback(false);
                }
            });                    
       
    };


    User.prototype.buy_fertilisant = function(nb, prix, id, callback) {
        var connection = _DB.connection();   
                connection.query('SELECT argent FROM Users WHERE id = ' + id + ';',function(err,row,fields){
                if(err) throw err;
                if(row[0].argent >= prix*nb){                                                         
                   var query = 'UPDATE  Users SET argent = argent-'+prix*nb+' , nb_fertilisants = nb_fertilisants + '+nb+ ' WHERE id = ' + id;
                    connection.query(query, function(err,row,fields){
                    if(err) throw err;
                    callback(true);
                 
                    });
                }else{
                    console.log("t'es un pauvre");
                    callback(false);
                }
            });                    
       
    };


   

    User.prototype.SellCrop = function(id, prix, callback) {
        var connection = _DB.connection();
        var query = 'SELECT * FROM Users WHERE id = ' + id;
        connection.query(query,function(err, rows, fields) {
            if(err) throw err;
            if(typeof (rows[0]) != "undefined"){
                prix = rows[0].argent + prix;
                var query = 'UPDATE Users SET argent = '+prix+' WHERE id = ' + id;
                connection.query(query,function(err, rows, fields) {
                    if(err) throw err;
                    callback(true);
                });
            }else{
                callback(false);
            }
        });
    };

    User.prototype.getPseudo = function(){
        return this._pseudo;
    };

    User.prototype.setPseudo = function(pseudo){
        this._pseudo = pseudo;
    };

    User.prototype.getAlliance = function(){
        return this._alliance;
    };

    User.prototype.setAlliance = function(alliance){
        var connection = _DB.connection();
        if(alliance != null && alliance > 0) {
            this._alliance = alliance;
            connection.query('SELECT * FROM Users WHERE alliance_id = '+alliance, function(err,rows,fields){
                if (err) throw err;
                for(var i = 0; i < rows.length; i++){
                    _userAlliance[rows[i].id] = rows[i].id;
                }
            });
        }
        else {
            _userAlliance = new Array();
        }
        
    };

    User.prototype.getUserAlliance = function(){
        return _userAlliance;
    };

    User.prototype.getUsersFromAlliance = function(){
        return _userAlliance;
    };

    User.prototype.getUserAllianceFromUser = function(user_id,callback){
        var connection = _DB.connection();
        connection.query('SELECT alliance_id FROM Users WHERE id = '+user_id, function(err,rows,fields){
            if(err) throw err;
            var users = new Array();
            connection.query('SELECT * FROM Users WHERE alliance_id = '+rows[0].alliance_id, function(err,row,fields){
                if (err) throw err;
                for(var i = 0; i < row.length; i++){
                    users[row[i].id] = row[i].id;
                }
                callback(users);
            });
        });
    };

    User.prototype.getId = function(){
        return this._id;
    };

    User.prototype.setId = function(id){
        this._id = id;
    };

    User.prototype.move = function(x,y){
        var connection = _DB.connection();

        connection.query('UPDATE Tiles SET user_id = NULL WHERE user_id = ' + this._id, function(err,rows,fields){
            if(err) throw err;
        });
        connection.query('UPDATE Tiles SET user_id = ' + this._id + ' WHERE x = ' + x + ' AND y = ' + y, function(err,rows,fields){
            if(err) throw err;
        });
    };

    User.prototype.getCanConquet = function(){
        return canConquet;
    }

    User.prototype.getCanAttack = function(enemi_id,callback){
        var connection = _DB.connection();
        
        if(lastAttackId > 0) {
            if(lastAttackId == enemi_id) {
                callback(false);
            }
            connection.query('SELECT resting FROM Users WHERE id = '+enemi_id, function(err,rows,fields){
                if(err) throw err;
                if(rows[0].resting == 0) {
                    callback(true);
                }else {
                    callback(false);
                }
            });
        }
        else {
            callback(true);
        }            
    };

    User.prototype.checkResting = function(user_id,callback) {
        var connection = _DB.connection();

        connection.query('SELECT resting FROM Users WHERE id = ' + user_id, function(err,rows,fields){
            if(err) throw err;
            callback(rows[0].resting);
        });
    };

    User.prototype.connected = function(){
        var connection = _DB.connection();

        var d = new Date();
        var datetime = d.getFullYear()+'-'+(d.getMonth() + 1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        var id = this._id;

        connection.query('SELECT * FROM Users_Connected WHERE user_id = '+this._id,function(err,rows,fields){
            if(err) throw err;

            if(rows.length > 0)
            {        
                connection.query('UPDATE Users_Connected SET isConnected = 1 WHERE user_id = '+id, function(err,rows,fields){
                    if(err) throw err;
                });
            }
            else
            {
                connection.query('INSERT INTO Users_Connected VALUE ("",'+ id +',1,0,"'+ datetime +'")', function(err,rows,fields){
                    if(err) throw err;
                });
            }     
        });
    };

    User.prototype.disconnect = function(){
        var connection = _DB.connection();
        connection.query('UPDATE Users_Connected SET isConnected = 0 WHERE user_id = '+this._id, function(err,rows,fields){
            if(err) throw err;
        });
    };

    User.prototype.isConnected = function(enemi_id, callback){
        var connection = _DB.connection();
        connection.query('SELECT isConnected FROM Users_Connected WHERE user_id = '+enemi_id, function(err,rows,fields){
            if(err) throw err;
            callback(rows[0].isConnected);
        });
    };

    User.prototype.conquet = function(tile_id,user_id){
        var connection = _DB.connection();
        connection.query('UPDATE Tiles SET owner = '+ user_id +' WHERE id = '+tile_id+';', function(err,rows,fields){
            if(err) throw err;         
        });
    };

    User.prototype.attack = function(tile_id,user_id){
        var connection = _DB.connection();
        connection.query('UPDATE Tiles SET owner = '+ user_id +' WHERE id = '+tile_id+';', function(err,rows,fields){
            if(err) throw err;         
        });
    };

    User.prototype.conquetGraceTime = function(){
        var connection = _DB.connection();
        var id = this._id;
        canConquet = false;
        connection.query('SELECT uspec.wait_conquetes_timer as timer FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = '+id+';',function(err,rows,fields){
            if(err) throw err;
            setTimeout(function(){
                canConquet = true;
            },rows[0].timer*1000);
        });
    };

    User.prototype.attackGraceTime = function(enemi_id,id){
        var connection = _DB.connection();
        lastAttackId = enemi_id;
        connection.query('SELECT uspec.victory_timer as timer FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = '+id+';',function(err,rows,fields){
            if(err) throw err;
            setTimeout(function(){
                lastAttackId = 0;
            },rows[0].timer*1000);
        });
    };

    User.prototype.regenTime = function(user_id,callback) {
        var connection = _DB.connection();
        var health = 0;
        var regen = 0;
        var life = 0;
        connection.query('SELECT uspec.win_regen as regen, uspec.resistance, u.life FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = '+user_id+';',function(err,rows,fields){
            if(err) throw err;
            health = rows[0].resistance;
            regen = rows[0].regen;
            life = rows[0].life;
            var inter = setInterval(function(){
                if(life == health) {
                    clearInterval(inter);
                    callback(life,true);
                }
                else {
                    life = ((life + regen) >= health) ? health : (life + regen);
                    callback(life,false);
                }
            },10000);
        });
    }

    User.prototype.stopResting = function(user_id) {
        var connection = _DB.connection();
        connection.query('UPDATE Users SET resting = 0 WHERE id = '+user_id,function(err,rows,fields){
            if(err) throw err;
        });
    }

    User.prototype.updateLevel = function(nb, callback){
        var connection = _DB.connection();
        var id = this._id; 
        connection.query('SELECT uspec.tile_next_level, u.niveau, u.experience FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = '+id+';', function(err,rows,fields){
            if(err) throw err;
            connection.query('UPDATE Users SET experience = experience+'+nb+' WHERE id='+id+';', function(err,row,fields){
                if(err) throw err;
            });
            if(rows[0].experience+nb >= rows[0].tile_next_level){
                connection.query('UPDATE Users SET niveau = niveau+1 WHERE id = '+id+';', function(err,row,fields){
                    if(err) throw err;
                    callback(true);
                });
            }else{
                callback(true);
            }
        });
    };

    User.prototype.checkLevel=function(callback){
        var connection = _DB.connection();
        var id = this._id; 
        connection.query('SELECT uspec.tile_next_level, u.niveau, u.experience FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = '+id+';', function(err,rows,fields){
            if(err) throw err;
            if(rows[0].experience >= rows[0].tile_next_level){
                connection.query('UPDATE Users SET niveau = niveau+1 WHERE id = '+id+';', function(err,row,fields){
                    if(err) throw err;
                    callback(true);
                });
            }else{
                callback(true);
            }
        });
    }

    User.prototype.checkNbMaxTile = function(nb, callback){
        var connection = _DB.connection();
        var id = this._id; 
        connection.query('SELECT uspec.tile_max FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = '+id+';', function(err,rows,fields){
             if(err) throw err;
             if(rows[0].tile_max > nb){
                callback(true);
             }else{
                callback(false);
             }
        });
    };

    User.prototype.checkAlliance = function(callback){
        var connection = _DB.connection();
        var id = this._id;
        connection.query('SELECT alliance_id FROM Users WHERE id ='+id+';', function(err, rows, fields){
            if(err) throw err;
            if(rows[0].alliance_id == null){
                callback(true);
            }else{ 
                callback(false);
            }
        });
    };

    User.prototype.enterAlliance = function(invit_id, alliance_id, callback){
        var connection = _DB.connection();
        var id = this._id;
        var query = 'DELETE FROM Alliance_invit WHERE id='+invit_id+';';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            query = 'Update Users SET alliance_id = '+alliance_id+' WHERE id ='+id+';';
            connection.query(query,function(err, rows, fields) {
                if (err) throw err;
                callback(true);
            });
        });
    };

    User.prototype.quitAlliance = function(callback){
        var connection = _DB.connection();
        var id = this._id;
        connection.query('UPDATE Users SET alliance_id = NULL WHERE id='+id+';', function(err, rows, fields){
            callback(true);
        });
    };

    User.prototype.checkName = function(name, callback){
        var connection = _DB.connection();
        var id = this._id;
        connection.query('SELECT * FROM Users WHERE pseudo = "'+name+'";', function(err, rows, fields){
            if(err) throw err;
            if(rows[0] != null){
                callback(rows[0]);
            }else{
                callback(false);
            }
        });
    };

    User.prototype.getTimerConquet = function(callback){
        var connection = _DB.connection();
        connection.query('SELECT uspec.conquete_timer as conquete_timer FROM Users_level_spec as uspec LEFT JOIN Users as u ON u.niveau = uspec.id WHERE u.id='+this._id, function(err,rows,fields){
            if(err) throw err;
            callback(rows[0].conquete_timer);
        });
    };

    User.prototype.checkMoneyForStockages = function(user_id, stockage_spec_id, callback){
        var connection = _DB.connection();
        var query = "SELECT * FROM Users WHERE id ="+user_id+";";
        connection.query(query, function(err, rows, fields){
            if(err) throw err;
            query = 'SELECT * FROM Stockages_spec WHERE id ='+stockage_spec_id+';';
            connection.query(query, function(err, row, fields){
                if(err) throw err;
                if(rows[0].argent >=row[0].prix){
                    callback(true);
                }else{
                    callback(false);
                }
            });
        });
    };

    User.prototype.GetUserProps = function(user_id, callback){
        var connection = _DB.connection();
        console.log('debug getuserprops avec user_id = ' + user_id);
        var query = "SELECT * FROM Users AS u LEFT JOIN Users_level_spec AS uspec ON u.niveau = uspec.id WHERE u.id = "+user_id+";";
        connection.query(query, function(err, rows, fields){
            if(err) throw err;
            query = 'SELECT * FROM Arrosoirs WHERE user_id = '+user_id+' AND isActive = 1;';
            connection.query(query, function(err, row, fields){
                if(err) throw err;
                if(rows[0].alliance_id != null){
                    query = 'SELECT * FROM Alliances WHERE id = '+rows[0].alliance_id+';';
                    connection.query(query, function(err, ro, fields){
                        if(err) throw err;
                        if(typeof(ro[0])!= 'undefined'){
                           callback({
                                level : rows[0].niveau,
                                water : row[0].current,
                                fertilisant : rows[0].nb_fertilisants,
                                energie : rows[0].energies,
                                argent : rows[0].argent,
                                xp : rows[0].experience,
                                next : rows[0].tile_next_level,
                                max : rows[0].tile_max,
                                alliance : ro[0].name,
                                alliance_id : ro[0].id,
                                lifeMax : rows[0].resistance,
                                life : rows[0].life
                            }); 
                       }else{
                            callback({
                                level : rows[0].niveau,
                                water : row[0].current,
                                fertilisant : rows[0].nb_fertilisants,
                                energie : rows[0].energies,
                                argent : rows[0].argent,
                                xp : rows[0].experience,
                                next : rows[0].tile_next_level,
                                max : rows[0].tile_max,
                                alliance : 'Undefined',
                                alliance_id : null,
                                lifeMax : rows[0].resistance,
                                life : rows[0].life
                            });
                       }    
                    });
                }else{
                    callback({
                        level : rows[0].niveau,
                        water : row[0].current,
                        fertilisant : rows[0].nb_fertilisants,
                        energie : rows[0].energies,
                        argent : rows[0].argent,
                        xp : rows[0].experience,
                        next : rows[0].tile_next_level,
                        max : rows[0].tile_max,
                        alliance : 'None',
                        alliance_id : null,
                        lifeMax : rows[0].resistance,
                        life : rows[0].life
                    });
                }
            });
        });
    };

    User.prototype.GetNewAllies = function(user_id, callback){
        var connection = _DB.connection();
        connection.query('SELECT * FROM Tiles WHERE owner = '+user_id, function(err, rows, fields){
            callback(rows);
        });
    };

    User.prototype.getMyNewAllies = function(user_id,alliance_id, callback){
        var connection = _DB.connection();
        connection.query('SELECT * FROM Tiles as t INNER JOIN Users as u ON t.owner = u.id WHERE u.alliance_id = '+alliance_id+' AND u.id != '+user_id, function(err, rows, fields){
            callback(rows);
        });
    };

    User.prototype.updateEnergie = function(user_id, callback){
        var upd = setInterval(function(){
            var connection = _DB.connection();
            connection.query("SELECT * FROM (Stockages) WHERE user_id="+user_id+" AND stockages_spec_id != 3;", function(err, rows, fields){
                if(err) throw err;
                connection.query("SELECT * FROM (Stockages) WHERE user_id="+user_id+" AND stockages_spec_id = 3 AND stockage_state > 0;", function(err, row, fields){
                    if(err) throw err;
                    if(rows[0] || row[0]){
                        var less = rows.length + (row.length*2);
                        connection.query('SELECT * FROM Users WHERE id ='+user_id, function(err, ro, fields){
                            if(err) throw err;
                            if(ro[0].energies - less > 0){
                                connection.query("UPDATE Users SET energies = energies-"+less+" WHERE id="+user_id+" AND Energies > 0;", function(err, row, fields){
                                    if(err) throw err;
                                    callback(true);
                                });
                            }else{
                                connection.query("UPDATE Users SET energies = 0 WHERE id="+user_id+" AND Energies > 0;", function(err, row, fields){
                                    if(err) throw err;
                                    connection.query('UPDATE Fruits SET pourrissement_state = 0 WHERE user_id='+user_id, function(err, rows, fields){
                                        callback(false);
                                    });
                                });
                            }
                        });
                    }else{
                        callback(true);
                    }
                })
            });
        },(30000));
    };

    User.prototype.lvl = function()
    {
        var connection = _DB.connection();
       // var lvl = new Array();
        var i                    = 1;
        var tile_next            = 1;
        var conque_timer         = 5;
        var _wait_conquete_timer = 8;
        var _resistance          = 50;
        var _victory_timer       = 15;
        var _win_regen           = 1;

    
        while (i != 50)
        {
            //connection.query('INSERT INTO Users_level_spec VALUES ('+i+', '+tile_next+', '+conque_timer+', '+_wait_conquete_timer+', '+_resistance+','+_victory_timer+', '+_win_regen+')', function(err, rows, fields){if (err) throw err; });
            var query = 'INSERT INTO Users_level_spec (id, tile_next_level, conquete_timer, wait_conquetes_timer, resistance, victory_timer, win_regen)VALUES ('+i+', '+tile_next+', '+conque_timer+', '+_wait_conquete_timer+', '+_resistance+','+_victory_timer+', '+_win_regen+') ';
            connection.query(query,function(err, rows, fields){if(err) throw err;});
            tile_next            = Math.ceil(tile_next * (1.1));
            conque_timer         = Math.ceil(conque_timer * (1.15));
            _wait_conquete_timer = Math.ceil(_wait_conquete_timer * (1.15));
            _resistance          = Math.ceil(_resistance * (1.2));
            _victory_timer       = Math.ceil(_victory_timer * (1.1));
            _win_regen           = Math.ceil(_win_regen * (1.1));
            i++;           
                console.log ('la ca fonctionne bordel');
        }
        console.log ('la ca fonctionne aussi putin');
    }

    User.prototype.next_lvl = function(id)
    {
        /*var connection = _DB.connection();
        var lvl_now = connection.query('SELECT niveau, experience FROM Users WHERE id = ' + _id);

        var exp = connection.query('SELECT experience, experience FROM Users WHERE id = ' + _id);
        var next_lvl = connection.query('SELECT tile_next_level FROM Users_level_spec WHERE id = ' + _id );
        
    
        if(lvl [lvl_now] ==)
        {
             Math.ceil(coef * 1.7;
        }*/
    }
    return User;
})();

module.exports = User;
    

