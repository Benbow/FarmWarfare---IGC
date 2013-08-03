//Classe qui enregistre les Users_level_spec de chaque user

var Users_level_spec = (function() {
    var _id;                    //id unique d'une arme INT
    var _tile_next_level;       //nombre de tile avant le prochain level *1.7 / lvl
    var _conquete_timer;        //timer pour conquerir une tile temps de base = 5s, *1.7 / lvl
    var _wait_conquete_timer;   //timer d'attente entre deux conquetes
    var _resistance;            //vie du joueur
    var _victory_timer;         //timer d'attente d'attaque si victorieux
    var _win_regen;             //régénération par secondes si victorieux
    var _lose_regen;            //régénération par secondes si perdant

    function Users_level_spec(){
        
    };

    //Getters
    Users_level_spec.prototype.getId = function() {
        return _id;
    };
    Users_level_spec.prototype.getTileNextLevel = function() {
        return _tile_next_level;
    };
    Users_level_spec.prototype.getConqueteTimer = function() {
        return _conquete_timer;
    };
    Users_level_spec.prototype.getWaitConqueteTimer = function() {
        return _wait_conquete_timer;
    };
    Users_level_spec.prototype.getResistance = function() {
        return _resistance;
    };
    Users_level_spec.prototype.getVictoryTimer = function() {
        return _victory_timer;
    };
    Users_level_spec.prototype.getWinRegen = function() {
        return _win_regen;
    };
    Users_level_spec.prototype.getLoseRegen = function() {
        return _lose_regen;
    };
    


    //Setters
    Users_level_spec.prototype.setId = function(id) {
        _id = id;
    };
    Users_level_spec.prototype.setTileNextLevel = function(tile_next_level) {
        _tile_next_level = tile_next_level;
    };
    Users_level_spec.prototype.setConqueteTimer = function(conquete_timer) {
        _conquete_timer = conquete_timer;
    };
    Users_level_spec.prototype.setWaitConqueteTimer = function(wait_conquete_timer) {
        _wait_conquete_timer = wait_conquete_timer;
    };
    Users_level_spec.prototype.setResistance = function(resistance) {
        _resistance = resistance;
    };
    Users_level_spec.prototype.setVictoryTimer = function(victory_timer) {
        _victory_timer = victory_timer;
    };
    Users_level_spec.prototype.setWinRegen = function(win_regen) {
        _win_regen = win_regen;
    };
    Users_level_spec.prototype.setLoseRegen = function(lose_regen) {
        _lose_regen = lose_regen;
    };
    

    return Users_level_spec;
})();

module.exports = Users_level_spec;