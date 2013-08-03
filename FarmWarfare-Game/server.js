var http     = require('http'),
	fs 		 = require('fs'),
	jsdom    = require('jsdom').jsdom,
	myWindow = jsdom().createWindow(),
	$ 	     = require('jquery'),
	jq 	     = require('jquery').create(),
	jQuery   = require('jquery').create(myWindow),
	mysql    = require('mysql'),
	url = require('url');


var DB  	   = require("./js/class/DB");
var Map 	   = require("./js/class/Map");
var Stockages  = require("./js/class/Stockages");
var Plantes    = require("./js/class/Plantes");
var User 	   = require("./js/class/User");
var Tiles 	   = require("./js/class/Tiles");
var Fruits_sp  = require("./js/class/Fruits_spec");
var Fruits 	   = require("./js/class/Fruits");
var Graine     = require("./js/class/Graine");
var Graine_sp  = require("./js/class/Graines_spec");
var Alliance   = require("./js/class/Alliances");
var Alliances_invit  = require("./js/class/Alliances_invit");
var Armes_sp   = require("./js/class/Armes_spec");	
var Armes  	   = require("./js/class/Armes");
var Energies_sp = require("./js/class/Energies_spec");	
var Energies  = require("./js/class/Energies");
var Arrosoirs = require("./js/class/Arrosoirs");
var Pluie = require("./js/class/Pluie");
var Meteor = require("./js/class/Meteor");
var Sauterelles = require("./js/class/Sauterelles");
var Tornades = require("./js/class/Tornades");

var map = new Map();
//map.initialiseMap();

var bdd = new DB();
var connection = bdd.connection();

//Timer
var date = new Date();
var current_hour = date.getHours();


var saveTiles = new Array();
var enemiDefender = new Array();
var lastAttackUser = new Array();

//Creation du serveur http.
var server = http.createServer(function (req, res) { }).listen(1337);

var io = require('socket.io').listen(server);
var connected = {};
var messages = [];
var history = 50;
var timerspend = 0;

var f = new Fruits();
f.updatePourissementFruits();

var t = new Tiles();
t.updateFertiliteAndHumidite();

var sto = new Stockages();

var p = new Plantes();
var interval = setInterval(function(){
	p.updateCropsHealths(function(clb){
	});
},(60000));

var marketPriceGeneration = setInterval(function(){
	marketPrice();
},60000*5);

var pluie = new Pluie();
pluie.isRaining(function(cb){
	if(cb){
		io.sockets.emit('DestroyRain', cb)
	}
});

// one rain every 5 minutes
var TimerRain = setInterval(function(){
	var duree = Math.floor((Math.random()*6)+1);
	var origin = Math.floor((Math.random()*2500)+1);
	var longueur = Math.floor((Math.random()*15)+1);
	var largeur = Math.floor((Math.random()*15)+1);
	console.log(origin);
	map.getCoordTile(origin,function(coord){
		var x = coord.x;
		var y = coord.y;
		pluie.Add_Raining(origin, duree, longueur, largeur, x, y, function(cb){
			io.sockets.emit('valid', 'Il pleut à X = '+x+' et Y ='+y+'!!');
			io.sockets.emit('newRain', cb);
		});
		p.updateCropsHealths(function(clb){});
	});
},65000);

var meteor = new Meteor();
meteor.isMeteor(function(cb){
	if(cb){
		io.sockets.emit('DestroyMeteor', cb)
	}
	sto.cleanComplexBuilding(function(data){
		for(bat in data){
			is.sockets.emit('destroyBuilding', {
				x : bat.x,
				y : bat.y
			});
		}
	});
});

// one METEOR rain every HOURS
var TimerMeteorRain = setInterval(function(){
	var duree = Math.floor((Math.random()*3)+1);
	var origin = Math.floor((Math.random()*2500)+1);
	var longueur = Math.floor((Math.random()*8)+1);
	var largeur = Math.floor((Math.random()*8)+1);
	map.getCoordTile(origin,function(coord){
		var x = coord.x;
		var y = coord.y;
		meteor.Add_Meteor(origin, duree, longueur, largeur, x, y, function(cb){
			io.sockets.emit('valid', 'Pluie de Météore à X = '+x+' et Y ='+y+'!!');
			io.sockets.emit('newMeteorRain', cb);
		});
	});
},3600000);

var sauterelles = new Sauterelles();
sauterelles.isSauterelles(function(cb){
	if(cb){
		if(cb[0].newx)
			io.sockets.emit('moveSauterelles', cb);
		else
			io.sockets.emit('DestroySauterelles', cb);
	}
});

// one Sautrelles every HOURS/2
var TimerSauterelles = setInterval(function(){
	var duree = Math.floor((Math.random()*30)+1);
	var origin = Math.floor((Math.random()*2500)+1);
	var longueur = Math.floor((Math.random()*5)+1);
	var largeur = Math.floor((Math.random()*5)+1);
	var vectorXDir = Math.random() < 0.5 ? -1 : 1;
	var vectorYDir = Math.random() < 0.5 ? -1 : 1;
	var temp1 = Math.floor((Math.random()*3)+1);
	if(temp1 == 1){ temp1 = (-1)*vectorXDir;}
	else if (temp1 == 2){temp1 = 0;}
	else if(temp1 == 3){temp1 = vectorXDir}
	var temp2 = Math.floor((Math.random()*3)+1);
	if(temp2 == 1){ temp2 = (-1)*vectorXDir;}
	else if (temp2 == 2){temp2 = 0;}
	else if(temp2 == 3){temp2 = vectorXDir;}
	map.getCoordTile(origin,function(coord){
		var x = coord.x;
		var y = coord.y;
		sauterelles.Add_Sauterelles(origin, duree, longueur, largeur, x, y, temp1, temp2, function(cb){
			console.log(x+' '+y);
			io.sockets.emit('valid', 'Nuages de Sauterelles à X = '+x+' et Y ='+y+'!!');
			io.sockets.emit('newSauterelles', cb);
		});
	});
},1800000);

var tornade = new Tornades();
tornade.isTornades(function(cb){
	if(cb){
		if(cb[0].newx)
			io.sockets.emit('moveTornades', cb);
		else
			io.sockets.emit('DestroyTornades', cb);
	}
	sto.cleanComplexBuilding(function(data){
		for(bat in data){
			is.sockets.emit('destroyBuilding', {
				x : bat.x,
				y : bat.y
			});
		}
	});
});

// one tornades every 12 minutes
var TimerTornade = setInterval(function(){
	var duree = Math.floor((Math.random()*20)+1);
	var origin = Math.floor((Math.random()*2500)+1);
	var longueur = 1;
	var largeur = 1;
	var vectorXDir = Math.random() < 0.5 ? -1 : 1;
	var vectorYDir = Math.random() < 0.5 ? -1 : 1;
	var temp1 = Math.floor((Math.random()*3)+1);
	if(temp1 == 1){ temp1 = (-1)*vectorXDir;}
	else if (temp1 == 2){temp1 = 0;}
	else if(temp1 == 3){temp1 = vectorXDir}
	var temp2 = Math.floor((Math.random()*3)+1);
	if(temp2 == 1){ temp2 = (-1)*vectorXDir;}
	else if (temp2 == 2){temp2 = 0;}
	else if(temp2 == 3){temp2 = vectorXDir;}
	map.getCoordTile(origin,function(coord){
		var x = coord.x;
		var y = coord.y;
		tornade.Add_Tornade(origin, duree, longueur, largeur, x, y, temp1, temp2, function(cb){
			console.log(x+' '+y);
			io.sockets.emit('valid', 'Nouvelle Tornades à X = '+x+' et Y ='+y+'!!');
			io.sockets.emit('newTornade', cb);
		});
	});
},720000);





// Action si un utilisateur arrive sur la page.
io.sockets.on('connection', function(socket){
	var user = new User();
	//user.lvl();

	

	// Action quand un utilisateur essaie de se connecter.
	socket.on('login', function(datalogin){
		//On va chercher en bdd si le mail existe.
		user.loginUser(datalogin.mail,datalogin.password,function(socket_user){
			if(socket_user[1] != null) // true si le mail existe
			{
				if(socket_user[2] == datalogin.password)// On check le password
				{
					connected[(socket_user[3])] = socket.id;
					user.setPseudo(socket_user[0]);
					user.setId(socket_user[3]);
					user.setAlliance(socket_user[5]);
					user.connected();
					socket.emit('valid', 'Connecter !');
					socket.emit('connected', {
						'pseudo': user.getPseudo()
					});
					for (var k in messages){
						socket.emit('newmsg', messages[k]);
					}
					if(socket_user[4]){
						if(socket_user[4] == 2){
							socket.emit('isAdmin');
						}
					}
				}
				else
					socket.emit('error', 'Mauvais password !');
			}
			else
				socket.emit('error', 'Mauvais mail !');
		});
	});

	/*
	*On a recu un message
	*/

	

	socket.on('newmsg', function(message){
	var pseudo =	user.getPseudo()
	message.user = pseudo;
	date = new Date();
	message.h = date.getHours();
	message.m = date.getMinutes();
	messages.push(message);
	if(messages.length > history){
		messages.shift();
	}
	io.sockets.emit('newmsg', message);

	});
		
	socket.on('register', function(dataRegister){
		//var userExist = user.existMail(dataRegister.mail);
		
		user.registerUser(dataRegister.mail,dataRegister.pseudo,dataRegister.password);
		socket.emit('isRegistered');
	});
		
	socket.on('checkGrainesOwned', function(ok){
		graine = new Graine();
		graine.checkGrainesOwned(user.getId(), function(cb){
			if(cb){
				socket.emit('cropsButton', cb);
			}
		});
	});

	socket.on('checkBatPrice', function(ok){
		stock = new Stockages();
		stock.checkBatPrice(function(cb){
			if(cb){
				socket.emit('BatButton', cb);
			}
		})
	});

	socket.on('GetUserProps', function(ok){
		user.GetUserProps(user.getId(), function(cb){
			if(cb){
				socket.emit('user_props', cb);
			}
		});
	})

	socket.on('userMove', function(data){
		user.move(data.x, data.y);
		socket.broadcast.emit('userMoveBroad',{
			'x'  : data.x,
			'y'	 : data.y,
			'id' : user.getId()
		});
	});

	socket.on('newgame', function(data){
		tiless = new Tiles();
		user.updateEnergie(user.getId(), function(pop){
			if(!pop){
				socket.emit('error', "Vous n'avez plus d'énergie !");
			}
			user.GetUserProps(user.getId(), function(cb2){
				if(cb2){
					socket.emit('user_props', cb2);
				}
			});
		});

		tiless.deleteGame(user.getId(), function(delet){
			if(delet){
				tiless.createGame(user.getId(), data.difficulty, function(cb){
					if(cb){
						map.getMap(user,function(socket_map){
							socket.emit('loadmap', socket_map);
						});
						map.getUserTile(user.getId(),function(user_tile){
							socket.broadcast.emit('new_user_connected',{
								'pseudo' : user.getPseudo(),
								'id'     : user.getId(),
								'x'      : user_tile.x,
								'y'		 : user_tile.y
							});
						});
					}else{
						socket.emit('error', 'Server Plein');
					}
				});	
			}
		});
	});

	socket.on('continue_game', function(data){
		user.updateEnergie(user.getId(), function(pop){
			if(!pop){
				socket.emit('error', "Vous n'avez plus d'énergie !");
			}
			user.GetUserProps(user.getId(), function(cb2){
				if(cb2){
					socket.emit('user_props', cb2);
				}
			});	
		});
		map.getMap(user,function(socket_map){
			socket.emit('loadmap', socket_map);
		});
		map.getUserTile(user.getId(),function(user_tile){
			socket.broadcast.emit('new_user_connected',{
				'pseudo' : user.getPseudo(),
				'id'     : user.getId(),
				'x'      : user_tile.x,
				'y'		 : user_tile.y
			});
		});
	});

	socket.on('getTileInfos', function(data){
		tile = new Tiles();
		tile.getTileInfos(data.x, data.y, function(cb){
			if(cb){
				if(cb.isEmpty == 0){
					socket.emit('showTileInfos', {
						type : 'empty',
						user_id : user.getId(),
						tile : cb
					});
				}else if(cb.isEmpty == 1){
					plantes = new Plantes();
					plantes.getInfosPlantes(cb.id, function(plante){
						if(plante){
							socket.emit('showTileInfos', {
								type : 'plante',
								user_id : user.getId(),
								tile : cb,
								plante : plante
							});
						}
					});
				}else if(cb.isEmpty == 2){
					bat = new Stockages();
					bat.getInfosStock(cb.id, function(batiment){
						if(batiment){
							socket.emit('showTileInfos', {
								type : 'batiment',
								user_id : user.getId(),
								tile : cb,
								batiment : batiment
							});
						}
					});
				}
			}
		})
	});

	socket.on('newstorage', function(data){
		stockage = new Stockages();
		tile = new Tiles();
		if(data.id == 1){
			map.getIdTile(data.x,data.y,function(id){
				tile.checkEmpty(id, function(cb){
					if(cb){
						user.checkMoneyForStockages(user.getId(), data.id, function(ok){
							if(ok){
								stockage.Add_Stockages(1,user.getId(),data.id,id);
								socket.emit('validStorage', {
									x : data.x,
									y : data.y
								});
								var upd = setInterval(function(){
									user.GetUserProps(user.getId(), function(cb2){
										if(cb2){
											socket.emit('user_props', cb2);
										}
									});
									clearInterval(upd);
								},(200));
							}else{
								socket.emit('error', "Pas assez d'argent !");
							}
						});
					}else{
						socket.emit('error', 'Case occupée !');
					}
				});
			});
		}else if(data.id == 2){
			map.getIdTile(data.x,data.y,function(id1){
				tile.checkEmpty(id1, function(cb1){
					if(cb1){
						map.getIdTile(data.x-1,data.y,function(id2){
							tile.checkEmpty(id2, function(cb2){
								if(cb2){
									map.getIdTile(data.x,data.y-1,function(id3){
										tile.checkEmpty(id3, function(cb3){
											if(cb3){
												map.getIdTile(data.x-1,data.y-1,function(id4){
													tile.checkEmpty(id4, function(cb4){
														if(cb4){
															user.checkMoneyForStockages(user.getId(), data.id, function(ok){
																if(ok){
																	stockage.Add_Stockages(1,user.getId(),data.id,id1);
																	stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id2, id1);
																	stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id3, id1);
																	stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id4, id1);
																	socket.emit('validStorage', {
																		x : data.x,
																		y : data.y
																	});
																	socket.emit('validStorageOrigin', {
																		x : data.x-1,
																		y : data.y
																	});
																	socket.emit('validStorageOrigin', {
																		x : data.x,
																		y : data.y-1
																	});
																	socket.emit('validStorageOrigin', {
																		x : data.x-1,
																		y : data.y-1
																	});
																	var upd = setInterval(function(){
																		user.GetUserProps(user.getId(), function(cb5){
																			if(cb5){
																				socket.emit('user_props', cb5);
																			}
																		});
																		clearInterval(upd);
																	},(200));
																}else{
																	socket.emit('error', "Pas assez d'argent !");
																}
															});
														}
														else{
															socket.emit('error', 'Case occupée !');
														}
													});
												});
											}else{
												socket.emit('error', 'Case occupée !');
											}
										});
									});
								}else{
									socket.emit('error', 'Case occupée !');
								}
							});
						});
					}else{
						socket.emit('error', 'Case occupée !');
					}
				});
			});
		}else if(data.id == 3){
			map.getIdTile(data.x,data.y,function(id1){
				tile.checkEmpty(id1, function(cb1){
					if(cb1){
						map.getIdTile(data.x-1,data.y,function(id2){
							tile.checkEmpty(id2, function(cb2){
								if(cb2){
									map.getIdTile(data.x,data.y-1,function(id3){
										tile.checkEmpty(id3, function(cb3){
											if(cb3){
												map.getIdTile(data.x-1,data.y-1,function(id4){
													tile.checkEmpty(id4, function(cb4){
														if(cb4){
															map.getIdTile(data.x,data.y-2,function(id5){
																tile.checkEmpty(id5, function(cb5){
																	if(cb5){
																		map.getIdTile(data.x-1,data.y-2,function(id6){
																			tile.checkEmpty(id6, function(cb6){
																				if(cb6){
																					user.checkMoneyForStockages(user.getId(), data.id, function(ok){
																						if(ok){
																							console.log(id1+" "+id2+" "+id3+" "+id4+" "+id5+" "+id6);
																							stockage.Add_Stockages(1,user.getId(),data.id,id1);
																							stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id2, id1);
																							stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id3, id1);
																							stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id4, id1);
																							stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id5, id1);
																							stockage.Add_StockagesWithOrigin(1, user.getId(), data.id, id6, id1);
																							socket.emit('validStorage', {
																								x : data.x,
																								y : data.y
																							});
																							socket.emit('validStorageOrigin', {
																								x : data.x-1,
																								y : data.y
																							});
																							socket.emit('validStorageOrigin', {
																								x : data.x,
																								y : data.y-1
																							});
																							socket.emit('validStorageOrigin', {
																								x : data.x-1,
																								y : data.y-1
																							});
																							socket.emit('validStorageOrigin', {
																								x : data.x,
																								y : data.y-2
																							});
																							socket.emit('validStorageOrigin', {
																								x : data.x-1,
																								y : data.y-2
																							});
																							user.GetUserProps(user.getId(), function(cb7){
																								if(cb7){
																									socket.emit('user_props', cb7);
																								}
																							});
																						}else{
																							socket.emit('error', "Pas assez d'argent !");
																						}
																					});
																				}else{
																					socket.emit('error', 'Case occupée !');
																				}
																			});
																		});
																	}else{
																		socket.emit('error', 'Case occupée !');
																	}
																});
															});
														}else{
															socket.emit('error', 'Case occupée !');
														}
													});
												});
											}else{
												socket.emit('error', 'Case occupée !');
											}
										});
									});
								}else{
									socket.emit('error', 'Case occupée !');
								}
							});
						});
					}else{
						socket.emit('error', 'Case occupée !');
					}
				});
			});
		}
	});

	socket.on('newTileSelectConquet',function(value){
		map.getIdTile(value.x,value.y,function(id){
			saveTiles.push({
				'x': value.x,
				'y': value.y,
				'id': id
			});
		});
	});

	socket.on('newTileSelectAttack',function(value){
		map.getIdTile(value.x,value.y,function(id){
			map.getOwnerTile(id,function(owner){
				saveTiles.push({
					'x': value.x,
					'y': value.y,
					'id': id,
					'owner': owner
				});
			});
		});
	});

	socket.on('userConquer',function(check){
		if(check)
		{
			user.checkResting(user.getId(),function(rest) {
				if(!rest) {
					if(user.getCanConquet()) {
						user.getTimerConquet(function(timer){
							socket.emit("displayTimerConquete", "");
							var timerConq = setInterval(function(){
								timerspend++;
								if(timerspend == timer){
									clearInterval(timerConq);
									timerspend = 0;
								}else{
									socket.emit("timerConquete", {
										value : timer-timerspend
									});
								}
							}, 1000);
							setTimeout(function(){
								$.each(saveTiles,function(index, value){
									user.conquet(value.id,user.getId());
									newOptions = {
										'type': 'conquer',
										'user_id': user.getId()
									};
									updateTile(value.x, value.y, newOptions);
									io.sockets.socket(connected[user.getId()]).emit('newTileOwner', {
										'x':value.x,
										'y':value.y
									});
								});
								socket.emit('valid', 'La conquête s\'est déroulé avec succès !');
								socket.emit("hideTimerConquete", "");
								socket.emit("resetSelectTiles", "");
								user.conquetGraceTime();
								user.updateLevel(saveTiles.length, function(cb){
									if(cb){
										user.checkLevel(function(cb2){
											user.GetUserProps(user.getId(), function(cb){
												if(cb2){
													socket.emit('user_props', cb);
												}
											});
										});
									}
								})
								saveTiles = new Array();
							},timer*1000);
						});
					}
					else {
						socket.emit('error', 'Vous devez attendre avant de conquérir.');
						socket.emit('resetConquet', true);
						saveTiles = new Array();
					}
				}
				else {
					socket.emit('error', 'Vous ne pouvez pas conquérir au repos !');
					socket.emit('resetConquet', true);
					saveTiles = new Array();
				}
			});
		}
	});

	socket.on('userAttackTileBlink',function(data){
		enemiDefender[data.user_id] = 0;
		lastAttackUser[data.user_id] = user.getId();
		io.sockets.socket((connected[data.user_id])).emit('error', 'Vous êtes attaqués !');
		io.sockets.emit('tileBlink', {
			'infos':data.infos
		});
	})

	socket.on('defendTile', function(infos){
		if(enemiDefender[infos.user_attacked] == 0) {
			enemiDefender[infos.user_attacked] = infos.user_defend;
		}
		else {
			io.sockets.socket(connected[infos.user_defend]).emit('error', 'Vous ne pouvez pas défendre ce territoire');
		}
	});

	socket.on('userAttack',function(enemi){
		var checkAttack = true;
		if(lastAttackUser[user.getId()] != enemi) {
			user.checkResting(enemi,function(rest){
				if(rest)
					checkAttack = false;
			});
		}
		
		if(checkAttack) 
		{
			user.isConnected(enemi, function(connect_infos){
				if(connect_infos)
				{
					user.getCanAttack(enemi,function(testAttack){
						if(testAttack) {
							var countAttack = 0;
							var AttackTimer = setInterval(function(){
								if(enemiDefender[enemi] != 0){
									console.log(enemiDefender[enemi]);
									defender = enemiDefender[enemi];
									user.combat(user.getId(),defender,function(result){
										user.changeUserLife(user.getId(), result.life_user);
										user.changeUserLife(defender, result.life_enemi);
										if(result.figth) 
										{
											io.sockets.emit('stopBlink', {
												'user_id': enemi
											});
											io.sockets.socket(connected[enemi]).emit('stopBlinkDef', {
												'user_id': enemi
											});
											$.each(saveTiles,function(index, value){
												map.getIdTile(value.x, value.y,function(id_tile){
													user.attack(id_tile,user.getId());
												});
												newOptions = {
													'type': 'attackWin',
													'user_id': user.getId(),
													'enemi': enemi
												};
												updateTile(value.x, value.y, newOptions);
											});
											user.respawn(defender,function(id_tile){
												map.getCoordTile(id_tile,function(infos_tile){
													io.sockets.socket(connected[defender]).emit('respawnLose', {
														'x': infos_tile.x,
														'y': infos_tile.y
													});
												});									
											});
											user.GetUserProps(user.getId(),function(cb){
												if(cb)
													socket.emit('user_props', cb);
											});
											user.GetUserProps(defender,function(cb){
												if(cb)
													io.sockets.socket(connected[defender]).emit('user_props', cb);
											});
											user.regenTime(user.getId(),function(life,etat){
												if(etat) {
													user.stopResting(user.getId());
												}
												user.changeUserLife(user.getId(),life);
												user.GetUserProps(user.getId(),function(cb){
													if(cb)
														socket.emit('user_props', cb);
												});
											});
											user.regenTime(defender,function(life,etat){
												if(etat) {
													user.stopResting(defender);
												}
												user.changeUserLife(defender,life);
												user.GetUserProps(defender,function(cb){
													if(cb)
														io.sockets.socket(connected[defender]).emit('user_props', cb);
												});
											});
											user.attackGraceTime(enemi,user.getId());
											socket.emit('valid', 'L\'attaque s\'est déroulé avec succès !');
											socket.emit("hideTimerAttack", "");
											io.sockets.socket(connected[defender]).emit("hideTimerDefend", "");
											saveTiles = new Array();
											enemiDefender[enemi] = 0;
											clearInterval(AttackTimer);
											countAttack = 0;
										}
										else
										{
											io.sockets.emit('stopBlink', {
												'user_id': enemi
											});
											io.sockets.socket(connected[enemi]).emit('stopBlinkDef', {
												'user_id': enemi
											});
											user.GetUserProps(user.getId(),function(cb){
												if(cb)
													socket.emit('user_props', cb);
											});
											user.GetUserProps(defender,function(cb){
												if(cb)
													io.sockets.socket(connected[defender]).emit('user_props', cb);
											});
											user.respawn(user.getId(),function(id_tile){
												map.getCoordTile(id_tile,function(infos_tile){
													socket.emit('respawnLose', {
														'x': infos_tile.x,
														'y': infos_tile.y
													});
												});									
											});
											user.regenTime(user.getId(),function(life,etat){
												if(etat) {
													user.stopResting(user.getId());
												}
												user.changeUserLife(user.getId(),life);
												user.GetUserProps(user.getId(),function(cb){
													if(cb)
														socket.emit('user_props', cb);
												});
											});
											user.regenTime(defender,function(life,etat){
												if(etat) {
													user.stopResting(defender);
												}
												user.changeUserLife(defender,life);
												user.GetUserProps(defender,function(cb){
													if(cb)
														io.sockets.socket(connected[defender]).emit('user_props', cb);
												});
											});
											socket.emit('valid', 'Vous avez perdu votre attaque');
											socket.emit("hideTimerAttack", "");
											io.sockets.socket(connected[defender]).emit("hideTimerDefend", "");
											socket.emit('resetAttackAttacker', saveTiles);
											saveTiles = new Array();
											enemiDefender[enemi] = 0;
											clearInterval(AttackTimer);
											countAttack = 0;
										}
									});
								}else{
									countAttack++;
									if(countAttack == 120){
										defender = enemi;
										io.sockets.emit('stopBlink', {
											'user_id': enemi
										});
										io.sockets.socket(connected[enemi]).emit('stopBlinkDef', {
											'user_id': enemi
										});
										$.each(saveTiles,function(index, value){
											map.getIdTile(value.x, value.y,function(id_tile){
												user.attack(id_tile,user.getId());
											});
											newOptions = {
												'type': 'attackWin',
												'user_id': user.getId(),
												'enemi': enemi
											};
											updateTile(value.x, value.y, newOptions);
										});
										user.respawn(defender,function(id_tile){
											map.getCoordTile(id_tile,function(infos_tile){
												io.sockets.socket(connected[defender]).emit('respawnLose', {
													'x': infos_tile.x,
													'y': infos_tile.y
												});
											});									
										});
										user.GetUserProps(user.getId(),function(cb){
											if(cb)
												socket.emit('user_props', cb);
										});
										user.GetUserProps(defender,function(cb){
											if(cb)
												io.sockets.socket(connected[defender]).emit('user_props', cb);
										});
										user.regenTime(user.getId(),function(life,etat){
											if(etat) {
												user.stopResting(user.getId());
											}
											user.changeUserLife(user.getId(),life);
											user.GetUserProps(user.getId(),function(cb){
												if(cb)
													socket.emit('user_props', cb);
											});
										});
										user.regenTime(defender,function(life,etat){
											if(etat) {
												user.stopResting(defender);
											}
											user.changeUserLife(defender,life);
											user.GetUserProps(defender,function(cb){
												if(cb)
													io.sockets.socket(connected[defender]).emit('user_props', cb);
											});
										});
										user.attackGraceTime(enemi,user.getId());
										socket.emit('valid', 'L\'attaque s\'est déroulé avec succès !');
										socket.emit("hideTimerAttack", "");
										io.sockets.socket(connected[defender]).emit("hideTimerDefend", "");
										saveTiles = new Array();
										enemiDefender[enemi] = 0;
										clearInterval(AttackTimer);
										countAttack = 0;
									}else{
										socket.emit("displayTimerAttack", "");
										socket.emit("timerAttack", {
											value :120-countAttack
										});
										io.sockets.socket(connected[enemi]).emit("displayTimerDefend", "");
										io.sockets.socket(connected[enemi]).emit("timerDefend", {
											value : 120-countAttack
										});
									}
								}
							},1000);
						}
						else {
							socket.emit('error', 'Vous ne pouvez pas attaquer cet ennemi tout de suite !');
							socket.emit('resetAttack', true);
							io.sockets.emit('stopBlink', {
								'user_id': enemi
							});
							saveTiles = new Array();
						}
					});
				}
				else {
					socket.emit('error', 'Cet ennemi n\'est pas connecté !');
					socket.emit('resetAttack', true);
					saveTiles = new Array();
				}
			});
		}
		else {
			socket.emit('error', 'Vous ne pouvez pas attaquer au repos');
			socket.emit('resetAttack', true);
			saveTiles = new Array();
		}
	});

	socket.on('newCrops', function(data){
		crops = new Plantes();
		tile = new Tiles();

		user.checkResting(user.getId(),function(rest){
			if(!rest) {
				map.getIdTile(data.x,data.y,function(id){
					tile.checkEmpty(id, function(cb){
						if(cb){
							map.getInfosTile(id,function(infos){
								crops.Add_Plantes(0,user.getId(),data.id,infos.id,infos.humidite,infos.fertilite, function(ok){
									var graine = new Graine();
									graine.checkGrainesOwned(user.getId(), function(cb2){
										if(cb2){
											socket.emit('cropsButton', cb2);
										}
									});
								});
								var options = {
									'status' : 0,
									'graine_id' : data.id,
									'type' : 'update_status'
								}
								updateTile(data.x, data.y, options);
								crops.updatePlante(function(cropdata){
									console.log(cropdata);
									if(cropdata.type == "update"){
										console.log("test");
										var newOptions = {
											'status' : cropdata.status,
											'graine_id' : cropdata.id,
											'type' : 'update_status'
										}
										updateTile(data.x, data.y, newOptions);
									}else if (cropdata.type == "delete"){
										ti = new Tiles();
										map.getIdTile(data.x,data.y,function(id){
											ti.DestroyCrops(user.getId(), id, function(cb){
												if(cb){
													socket.emit('destroyCrops', {
														x: data.x,
														y: data.y
													});
													socket.emit('Error', 'Ta plante est morte');
												}
											});
										});
									}
								});
								
							});
						}else{
							socket.emit('error', 'Case occupée !');
						}
					});
				});
			}
			else {
				socket.emit('error', 'Vous ne pouvez pas planter au repos');
			}
		});
		
	});

	socket.on('watering', function(data){
		tile = new Tiles();
		//TODO generate croissance and health
		map.getIdTile(data.x,data.y,function(id){
			tile.Watering(id, user.getId(), function(cb){
				if(cb){
					crop = new Plantes();
					crop.updateCropsHealths(function(ok){
						socket.emit('valid', 'Arrosage réussit !!');
						user.GetUserProps(user.getId(), function(cb2){
							if(cb2){
								socket.emit('user_props', cb2);
							}
						});
					});
				}else{
					socket.emit('error', 'Arrosoir vide !');
				}
			});
		});
	});

	socket.on('fertilizing', function(data){
		tile = new Tiles();
		//TODO generate croissance and health
		map.getIdTile(data.x,data.y,function(id){
			tile.Fertilizing(id, user.getId(), function(cb){
				if(cb){
					crop = new Plantes();
					crop.updateCropsHealths(function(ok){
						socket.emit('valid', 'Fertilisation réussit!!');
						user.GetUserProps(user.getId(), function(cb2){
							if(cb2){
								socket.emit('user_props', cb2);
							}
						});
					});
				}else{
					socket.emit('error', 'Pas assez de Fertilisant !');
				}
			});
		});
	});

	socket.on('harvesting', function(data){
		tile = new Tiles();

		/*meteor.Add_Meteor(653, 3, 1, 10, 14, 3, function(cb){
			io.sockets.emit('valid', 'Pluie de Météore à X = '+14+' et Y ='+3+'!!');
			io.sockets.emit('newMeteorRain', cb);
		});*/

		/*tornade.Add_Tornade(267, 10, 1, 1, 6, 17, 1, 0, function(cb){
			io.sockets.emit('valid', 'Nouvelle Tornades à X = '+6+' et Y ='+17+'!!');
			io.sockets.emit('newTornade', cb);
		});*/

		/*sauterelles.Add_Sauterelles(908, 15, 2, 3, 19, 8, -1, 1, function(cb){
			io.sockets.emit('valid', 'Nuages de Sauterelles à X = '+19+' et Y ='+8+'!!');
			io.sockets.emit('newSauterelles', cb);
		});*/

		pluie.Add_Raining(706, 3, 4, 4, 15, 6, function(cb){
			io.sockets.emit('valid', 'Il pleut à X = '+15+' et Y ='+6+'!!');
			io.sockets.emit('newRain', cb);
		});

		user.checkResting(user.getId(),function(rest){
			if(!rest) {
				map.getIdTile(data.x,data.y,function(id){
					tile.Harvesting(id, user.getId(), function(cb){
						if(cb.ok){
							socket.emit('valid', 'Récolte réussit!!');
							socket.emit('destroyCrops', {
								x: data.x,
								y: data.y
							});
							fruit_spec = new Fruits_sp;
							fruit_spec.getFruitSpec(cb.fruit, function(c){
								var p = c.fruits_spec.prix_vente * cb.nb;
								var po = c.fruits_spec.poids*cb.nb;
								var d = {
									nom : c.fruits_spec.name,
									nb : cb.nb,
									prix : p, 
									fruit_id : cb.fruit,
									poids : po,
									pourissement : c.fruits_spec.stockage_time
								}
								socket.emit('instantSell', d);
							});
						}else{
							//socket.emit('error', 'Ceci n\'est pas une plante mature !');
						}
					});
				});
			}
			else {
				socket.emit('error', 'Vous ne pouvez pas récolter au repos');
			}
		});
	});

	socket.on('instantSellConfirm', function(data){
		u = new User();
		u.SellCrop(user.getId(), data.prix, function(ok){
			user.GetUserProps(user.getId(), function(cb2){
				if(cb2){
					socket.emit('user_props', cb2);
				}
			});
		});
	});

	socket.on('instantSellStack', function(data){
		s = new Stockages();
		s.GetMyStockages(user.getId(), data.nb, data.poids, function(cb){
			if(cb.ok){
				socket.emit('chooseStorage', {
					data : data,
					stockages : cb.stock
				});
			}else{
				u = new User();
				u.SellCrop(user.getId(), data.prix, function(ok){
					//here, update l'affichage de l'argent du player
					user.GetUserProps(user.getId(), function(cb2){
						if(cb2){
							socket.emit('user_props', cb2);
						}
					});
					socket.emit('error', 'Place insuffisante ! Vous avez vendu');
				});
			}
		});
	});

	socket.on('achat_graine', function(data){
		graine = new Graine;
		u = new User();
		graine.buyGraine(data.nb, user.getId(), data.graines_spec_id, function(cb){
			graine.checkGrainesOwned(user.getId(), function(cb2){	
				u.buy_graines(data.nb, data.graines_spec_id, user.getId(), function(ok){
					if(ok == true){
						if(cb2){
								user.GetUserProps(user.getId(), function(cb){
									if(cb){
										socket.emit('user_props', cb);
									}
								});
								socket.emit('cropsButton', cb2);
								socket.emit('valid', cb.nb+ ' graines acheté');
						}

					}else{
						socket.emit('error', "Pas assez d'argent !")
				
					}
				});
			});
		});

	});

	socket.on('achat_arme', function(data){
		armes = new Armes;
		u = new User();
		armes.buyArme(user.getId(), data.armes_spec_id, function(cb){	
			u.buy_armes(data.nb, data.armes_spec_id, user.getId(), function(ok){
				if(ok == true){
					if(ok == true){
							user.GetUserProps(user.getId(), function(cb){
								if(cb){
									socket.emit('user_props', cb);
								}
							});
							socket.emit('valid', 'arme achete');
					}

				}else{
					socket.emit('error', "Pas assez d'argent !")
			
				}
			});
		});

	});

	socket.on('achat_energie', function(data){
		energies = new Energies;
		u = new User();
		energies.buyEnergie(data.nb, user.getId(), function(cb){	
			u.buy_energie(data.nb, data.prix, user.getId(), function(ok){
				if(ok == true){
					if(ok == true){
							user.GetUserProps(user.getId(), function(cb){
								if(cb){
									socket.emit('user_props', cb);
								}
							});
							socket.emit('valid', 'énergie acheté');
					}

				}else{
					socket.emit('error', "Pas assez d'argent !")
			
				}
			});
		});

	});

	socket.on('achat_fertilisant', function(data){
		u = new User();	
		u.buy_fertilisant(data.nb, data.prix, user.getId(), function(ok){
			if(ok == true){
				if(ok == true){
						user.GetUserProps(user.getId(), function(cb){
							if(cb){
								socket.emit('user_props', cb);
							}
						});
						socket.emit('valid', 'fertilisant acheté');
				}

			}else{
				socket.emit('error', "Pas assez d'argent !")
			
			}
		});
	});

	



	socket.on('button_market', function(data){
		graine_spec = new Graine_sp;
		arme_spec = new Armes_sp;
		energies_spec = new Energies_sp;
		graine_spec.Get_Graines(function(graine){
			if(graine)
				socket.emit('liste_graines', graine);
		});
		arme_spec.Get_Armes(function(armes){
			if(armes)
				socket.emit('liste_armes', armes);
		});
		energies_spec.Get_Energies(function(energies){
			if(energies){
				socket.emit('liste_energies', energies);
			}
		});

	});

	

	socket.on('storeCrops', function(data){
		fruit = new Fruits;
		fruit.storeFruits(user.getId(), data.stor_id, data.fruit_id, data.nb, data.poids, data.stor_type, data.time, function(cb){
			socket.emit('valid', ''+cb.nb+' Fruits stored');
		});
	});

	socket.on('destroyingCrops', function(data){
		tile = new Tiles();
		//TODO generate croissance and health
		map.getIdTile(data.x,data.y,function(id){
			tile.DestroyCrops(user.getId(), id, function(cb){
				if(cb){
					socket.emit('destroyCrops', {
						x: data.x,
						y: data.y
					});
					socket.emit('valid', 'Plantes Détruites');
				}else{
					socket.emit('error', 'Ce n\'est pas une plante');
				}
			});
		});
	});

	
	socket.on('destroyingBuilding', function(data){
		tile = new Tiles();
		//TODO generate croissance and health
		map.getIdTile(data.x,data.y,function(id){
			tile.DestroyBuilding(user.getId(), id, function(cb){
				if(cb.type == 1){
					socket.emit('destroyBuilding', {
						x: data.x,
						y: data.y
					});
					socket.emit('valid', 'Bâtiment détruit');
				}else if(cb.type == 2){

					tile.DestroyBuildingComplex(cb.id, function(ok){
							map.getCoordTile(cb.id,function(coord){
								socket.emit('destroyBuilding', {
								x: coord.x,
								y: coord.y
							});
							socket.emit('destroyBuilding', {
								x: coord.x-1,
								y: coord.y
							});
							socket.emit('destroyBuilding', {
								x: coord.x,
								y: coord.y-1
							});
							socket.emit('destroyBuilding', {
								x: coord.x-1,
								y: coord.y-1
							});
							socket.emit('valid', 'Bâtiment détruit');
						});
					});
				}else if(cb.type == 3){
					tile.DestroyBuildingComplex(cb.id, function(ok){
							map.getCoordTile(cb.id,function(coord){
								socket.emit('destroyBuilding', {
								x: coord.x,
								y: coord.y
							});
							socket.emit('destroyBuilding', {
								x: coord.x-1,
								y: coord.y
							});
							socket.emit('destroyBuilding', {
								x: coord.x,
								y: coord.y-1
							});
							socket.emit('destroyBuilding', {
								x: coord.x-1,
								y: coord.y-1
							});
							socket.emit('destroyBuilding', {
								x: coord.x,
								y: coord.y-2
							});
							socket.emit('destroyBuilding', {
								x: coord.x-1,
								y: coord.y-2
							});
							socket.emit('valid', 'Bâtiment détruit');
						});
					});
				}else{
					socket.emit('error', 'Ce n\'est pas un bâtiment !');
				}
			});
		});
	});

	socket.on('showBuildingProps', function(data){
		stockages = new Stockages();
		map.getIdTile(data.x,data.y,function(id){
			stockages.GetInfos(user.getId(), id, function(cb){
				if(cb){
					if(cb.type == 'stock'){
						socket.emit('DisplayBuildingProps', {
							stockages : cb.stockages,
							stockages_spec : cb.stockages_spec,
							fruits : cb.fruits,
							fruits_spec : cb.fruits_spec
						});
					}else if(cb.type == 'maison'){
						socket.emit('DisplayHouseAction', {
							maison : cb.maison
						});
					}else{
						socket.emit('error', 'Bâtiment Vide !');
						socket.emit('hideBuildingProps', 'ok');
					}
				}else{
					socket.emit('error', 'Bâtiment Vide!');
					socket.emit('hideBuildingProps', 'ok');
				}
			});
		});
	});

	socket.on('fill_arrosoir', function(data){
		arrosoir = new Arrosoirs();
		arrosoir.fill_arrosoir(user.getId(), function(cb){
			user.GetUserProps(user.getId(), function(cb2){
				if(cb2){
					socket.emit('valid', 'Arrosoirs remplis');
					socket.emit('user_props', cb2);
				}
			});
		});
	});

	socket.on('showBuildingPropswithId', function(id){
		stockages = new Stockages();
		stockages.GetInfos(user.getId(), id, function(cb){
			if(cb){
				socket.emit('DisplayBuildingProps', {
					stockages : cb.stockages,
					stockages_spec : cb.stockages_spec,
					fruits : cb.fruits,
					fruits_spec : cb.fruits_spec
				});
			}else{
				socket.emit('error', 'Bâtiment Vide !');
				socket.emit('hideBuildingProps', 'ok');
			}
		});
	});

	socket.on('sell_fruit', function(data){
		var fruit = new Fruits();
		fruit.SellFruit(data.fruit_id, data.stockage_id, data.poids, data.prix, user.getId(), function(cb){
			socket.emit('valid', 'Fruit Sell');
			socket.emit('RefreshBuildingProps', 'ok');
			user.GetUserProps(user.getId(), function(cb2){
				if(cb2){
					socket.emit('user_props', cb2);
				}
			});
		});
	});

	socket.on('drop_fruit', function(data){
		var fruit = new Fruits();
		fruit.DropFruit(data.fruit_id, data.stockage_id, data.poids, function(cb){
			socket.emit('valid', 'Fruit Dropped');
			socket.emit('RefreshBuildingProps', 'ok');
		});
	});

	socket.on('drop_all_dead_fruits', function(data){
		var fruit = new Fruits();
		fruit.DropAllDeadFruit(user.getId(), data.stockage_id, function(ok){
			if(ok){
				socket.emit('valid', 'Fruits Dropped');
				var upd = setInterval(function(){
					socket.emit('RefreshBuildingProps', 'ok');
					clearInterval(upd);
				},(2000));
				
			}else{
				socket.emit('valid', 'Bâtiment nettoyé !');
			}
		});
	});

	socket.on("newAlliances", function(data){
		user.checkAlliance(function(cb){
			if(cb){
				alliance = new Alliance();
				alliance.Add_Alliance(data, user.getId(), function(){
					user.GetUserProps(user.getId(), function(cb2){
						if(cb2){
							socket.emit('user_props', cb2);
							socket.emit('newAlliance', cb2.alliance);
						}
					});
				});
			}else{
				socket.emit('error', 'Vous êtes dèjà dans une alliance');
			}
		});
	});

	socket.on('quitAlliance', function(ok){
		user.checkAlliance(function(cb){
			if(!cb){
				user.quitAlliance(function(back){
					user.GetUserProps(user.getId(), function(cb2){
						if(cb2){
							socket.emit('user_props', cb2);
							socket.emit('valid', 'Vous avez quitté votre alliance');
						}
					});
				});
			}else{
				socket.emit('error', 'Vous n\'avez aucune alliance');
			}
		});
	});

	socket.on('newAlliancesInvite', function(data){
		if(data.alliance_id != null){
			user.checkName(data.name, function(cb){
				if(cb){
					invit = new Alliances_invit();
					invit.Add_Alliance_invit(user.getId(), cb.id, data.alliance_id, function(back){
						if(back)
							io.sockets.socket((connected[cb.id])).emit('receiveInvitation', 'New Invitation !');
							socket.emit('valid', 'Invitation envoyé!');
					});
				}else{
					socket.emit('error', 'Nom Inconnu!');
				}
			});
		}else{
			socket.emit('error', 'Vous n\'avez aucune alliance');
		}
	});

	socket.on('getInvitList', function(data){
		invit = new Alliances_invit();
		invit.getInvitList(user.getId(), function(cb){
			if(cb){
				socket.emit('displayInvit', cb);
			}else{
				socket.emit('error', 'Vous n\'avez aucune invitation');
				socket.emit('hideInvit', '');
			}
		});
	});

	socket.on('accept_invit', function(data){
		user.checkAlliance(function(cb){
			if(cb){
				user.enterAlliance(data.invit_id, data.alliance_id, function(back){
					user.GetUserProps(user.getId(), function(cb2){
						if(cb2){
							socket.emit('user_props', cb2);
							socket.emit('refreshInvitList', '');
							socket.emit('valid', 'Bienvenue dans votre nouvelle alliance!');
						}
					});
					user.getMyNewAllies(user.getId(), data.alliance_id, function(cb2){
						socket.emit('myNewAllies', cb2);
					});
					user.GetNewAllies(user.getId(), function(cb2){
						for(tile in cb2){
							io.sockets.socket(connected[tile.user_id]).emit('newAlliesTile', {
								x : tile.x,
								y : tile.y,
								empty : tile.isEmpty
							});
						}
					});
				});
			}else{
				socket.emit('error', 'Vous êtes dèjà dans une alliance');
			}
		});
	});

	socket.on('refus_invit', function(data){
		invit = new Alliances_invit();
		invit.refus_invit(data.invit_id, function(back){
			socket.emit('refreshInvitList', '');
		});
	});

	socket.on('error', function(msg){
		socket.emit('error', msg);
	});

	socket.on('valid', function(msg){
		socket.emit('valid', msg);
	});

	socket.on('disconnect', function(id){
		if(user.getId() != 0)
		{
			user.disconnect();
			socket.broadcast.emit('userDisconnect',{
				'id' : user.getId()
			});
		}
	});


	//*********************************//
	//************ For Admin **********//
	//*********************************//

	socket.on('isAdmin', function(data){
		
	});

	socket.on('selectDB', function(data){
		connection.query('SELECT * FROM '+data.table, function(err, rows, fields) {
			if (err) throw err;
			if(rows.length > 0){
				var retour = new Array(data.table, rows);
				socket.emit('returnDB', retour);
				
			}else{
				var retour = new Array(data.table, 'empty');
				socket.emit('returnDB', retour);
			}
		});
	});

	socket.on('DeleteDB', function(data){
		connection.query('DELETE FROM '+data.table+' WHERE id='+data.id, function(err, rows, fields) {
			if (err) throw err;
		});

		connection.query('SELECT * FROM '+data.table, function(err, rows, fields) {
			if (err) throw err;
			if(rows.length > 0){
				var retour = new Array(data.table, rows);
				socket.emit('returnDB', retour);
				
			}else{
				var retour = new Array(data.table, 'empty');
				socket.emit('returnDB', retour);
			}
		});
	});

	socket.on('UpdateDB', function(data){
		console.log(data);
		if(typeof data.val == "string"){
			console.log("ok");
			connection.query('UPDATE '+data.table+' SET '+data.column+'="'+data.val+'" WHERE id='+data.id, function(err, rows, fields) {
				if (err) throw err;
			});
		}
		else{
			connection.query('UPDATE '+data.table+' SET '+data.column+'='+data.val+' WHERE id='+data.id, function(err, rows, fields) {
				if (err) throw err;
			});
		}

		connection.query('SELECT * FROM '+data.table, function(err, rows, fields) {
			if (err) throw err;
			if(rows.length > 0){
				var retour = new Array(data.table, rows);
				socket.emit('returnDB', retour);
				
			}else{
				var retour = new Array(data.table, 'empty');
				socket.emit('returnDB', retour);
			}
		});
	});


});

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
};

updateTile = function(x,y,options){
	if(options.type == 'update_status'){
		var sprite_id = options.graine_id+""+options.status;
		Tiles.changeSprite(x,y,sprite_id);
		io.sockets.emit('newTileSprite', {
			'x':x,
			'y':y,
			'sprite_id': sprite_id
		});
	}
	else if(options.type == 'conquer'){
		io.sockets.emit('newTileConquer', {
			'x':x,
			'y':y,
			'user_id': options.user_id
		});
	}
	else if (options.type == 'attackWin') {
		setTimeout(function(){
			Tiles.changeOwner(x,y,options.user_id);
			io.sockets.emit('newTileAttack', {
				'x':x,
				'y':y,
				'user_id': options.user_id
			});
			
			io.sockets.socket(connected[options.enemi]).emit('error', 'Tu as perdu l\'attaque contre ton territoire.');
		},500);
	}
	else if (options.type == 'attackLose') {
		io.sockets.socket(connected[options.enemi]).emit('error', 'Tu as gagné l\'attaque contre ton territoire.');
	}
};

initialise = function(){
	map.initialiseMap();
	Fruits_sp.initialise();
	Armes_sp.initialise();
	Graines_sp.initialise();
	Stockages_sp.initialise();
	Arrosoirs_sp.initialise();
	Users_level_sp.initialise();
};

marketPrice = function(){
	graine_spec = new Graine_sp;
	graine_spec.marketPriceGraines();
	fruits_spec = new Fruits_sp;
	fruits_spec.marketPriceFruits();
	//io.sockets.socket((connected[data.user_id])).emit('valid', 'Nouveaux prix au marche !');
	io.sockets.emit('valid', 'Nouveaux prix au marché !');
};
