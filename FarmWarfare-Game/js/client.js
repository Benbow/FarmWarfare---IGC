(function($){

	var socket = io.connect('http://localhost:1337');
	var ppmap;
	var map = false;
	var stopBlink = false;
	var tileSelect = new Array();
	var User = {
		id : 0,
		pseudo : '',
		isPlanting : false,
		isBuilding : false,
		isAttacking : false,
		isWatering : false,
		isFertilizing : false,
		isHarvesting : false,
		isDestroyCrop:false,
		isDiplayingInfos : false,
		isDestroyBuilding : false,
		own_tile : new Array(),
		enemi_tile : {},
		attack_tile : {},
		allies : {}
	};
	var Batiment = {
		name : '',
		sprite : {
			silo : {
				id : 1,
				decX : 0,
				decY : -150
			},
			grange : {
				id : 2,
				decX : -128,
				decY : -378
			},
			chambre : {
				id : 3,
				decX : -128,
				decY : -292
			}
		}
	}

	var Plantes = {
		name : '',
		sprite : {
			pasteque : {
				id : 1,
				sprite_id : 10
			},
			salade : {
				id : 2,
				sprite_id : 20
			},
			ananas : {
				id : 3,
				sprite_id : 30
			},
			tomate : {
				id : 4,
				sprite_id : 40
			},
			melon : {
				id : 5,
				sprite_id : 50
			},
			carotte : {
				id : 6,
				sprite_id : 60
			}
		}
	}

	var x_tip_show = 0;
	var y_tip_show = 0;
	var sauterelleList = new Array();
	var tornadeList = new Array();
	
	var msgtpl = $('#msgtpl').html();
	$('#msgtpl').remove();


	$("#buttonRegister").click(function(){
		$("#div_login").slideUp('fast');	
		$("#div_register").fadeIn('slow');

		
	});

	$("#backRegister").click(function(){
		$("#div_login").slideUp('fast');	
		$("#div_register").fadeIn('fast');

		
	});

	//Lorsque l'on veut s'enregistrer'
	$('#registerform').submit(function(event)
	{
		event.preventDefault();
		//Envoie de l'action pour s'enregister'
		socket.emit('register', {
			mail : $("#newMail").val(),
			password : $("#newPassword").val(),
			pseudo : $("#newPseudo").val()
		});
		return false;
	});

	// Action lorsque le compte est cree
	socket.on('isRegistered', function(){
		$("#div_register").slideUp('fast');
		$("#div_login").fadeIn('fast');	
		
	});


	// Lorsque l'on submit notre formulaire de connection
	$('#loginform').submit(function(event)
	{
		event.preventDefault();
		//Envoie de l'action pour se connecter
		socket.emit('login', {
			mail : $("#mail").val(),
			password : $("#password").val()
		});
		return false;
	});

	/*
	*	Gestion des erreurs en popup.
	*/
	socket.on('error', function(error){
		$("#error").html(error);
		$("#error").fadeIn('slow');
		var t = setTimeout(function(){
			$("#error").fadeOut('slow');
		}, 3000);
	});

	socket.on('valid', function(valid){
		$("#valid").html(valid);
		$("#valid").fadeIn('slow');
		setTimeout(function(){
			$("#valid").fadeOut('slow');
		}, 3000);
	});

	/*
	*	Envois de message
	*/
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newmsg', {message: $('#message_inbox').val() }); 
		$('#message').val('');
		$('#message').focus();
	});

	socket.on('newmsg', function(message){
		$('#messages').append('<div class="message">'+ message.user +" : "+ Mustache.render(msgtpl, message) + '</div>')	
	});
	
	$('#submitlogin').click(function(){				
		$("#messages").fadeIn('fast');
		$("#form").fadeIn('fast');
		
	});

	// Action lorsque la connection reussie.
	socket.on('connected', function(user){
		$("#menu_username").html(user.pseudo);
		$("#div_login").slideUp('fast');
		$("#div_play").fadeIn('slow');
		$("#div_begin").fadeIn('slow');
		$("#overlay").fadeIn('slow');
	});

	//Action lorsqu'on est admin
	socket.on('isAdmin', function(){
		$("#button_admin").fadeIn('fast');
	});

	//Lorsque l'on souhaite faire une nouvelle partie
	$("#new_game").click(function(){
		$("#liste_difficult").fadeIn('fast');
		$(this).parent().parent().slideUp('fast');
	});

	//Lorsque l'on cree une nouvelle partie
	$("#submit_newgame").click(function(){
		$("#div_begin").fadeOut('slow');
		$("#overlay").fadeOut('slow');
		$("#div_menu").fadeIn('slow');
		$("#user_props").fadeIn('slow');
		socket.emit('newgame', {
			username : $("#menu_username").html(),
			difficulty : $('input[name=newgame_difficult]:checked').val()
		});
	});

	//Lorsque l'on continue notre partie
	$("#continue_game").click(function(){
		$("#div_begin").fadeOut('slow');
		$("#overlay").fadeOut('slow');
		$("#div_menu").fadeIn('slow');
		$("#user_props").fadeIn('slow');
		socket.emit('continue_game', {
			username : $("#menu_username").html()
		});
	});

	socket.on('loadmap', function(map){
		loadmap(map);
		User.own_tile = map.own_tile;
		User.enemi_tile = map.enemi_tile;
		User.allies = map.allies;
		User.id = map.infos_user.id;
		User.pseudo = map.infos_user.pseudo;
		socket.emit('checkGrainesOwned', '');
		socket.emit('checkBatPrice', '');
		socket.emit('GetUserProps', '');
	});

	var loadmap = function(map) {
		ppmap = $('#ppISO').pp3Diso({
	        map: 		 map.map,       // la map
	        mapId: 		 1,         // id de la map
	        tx: 		 256,       // dimension x des tuiles
	        ty: 		 128,       // dimension y des tuiles
	        prefix: 	 '',		// prefix avant les nom d'images
	        auto_size:   false,		// aggrandissement auto de la fenetre
	        mousewheel:  true,		// zoom avec la molette
	        zoom: 		 0.5,		// zoom par default
	        pathfinding: true,		// chemin auto pour le deplacement de l'avatar
	        cursorDelay : 2000,
	        onmoveavatar:function(x, y, mapid) {
	            mouseClick(x, y);// Fonction que l'on fait quand on clique pour bouger le perso
	        },
	        onclicbuilding:function(x, y, mapid){
	        	buildingProps(x, y);
	        },
	        oncursordelay:function(x, y, mapid){
	        	hoverTiles(x, y);
	        }
	    });
	    //ppmap.switchCursorDelay(0);

		//Mise en place des batiments quand tu load la map.
	    $.each(map.storage, function(index, value) {
	    	if(value.origin == null){
	    		if(value.id == 1)
		    		Batiment.name = 'silo';
		    	else if (value.id == 2)
		    		Batiment.name = 'grange';
		    	else if (value.id == 3)
		    		Batiment.name = 'chambre';

		    	ppmap.addBuilding(value.x, value.y, 'images/'+Batiment.name + '.png', Batiment.sprite[Batiment.name].decX, Batiment.sprite[Batiment.name].decY);
	    	}else{
	    		ppmap.addBuilding(value.x, value.y, 'images/empty_tile.png', 0, 0);
	    	}
	    	
		});

		$.each(map.maison, function(index, value) {
	    	ppmap.addBuilding(value.x, value.y, 'images/house.png', 0, -63);
		});

		//Mise en place des batiments quand tu load la map.
	    $.each(map.all_user, function(index, value) {
		    ppmap.addObject(value.x, value.y, 'images/avatar.png', 70, -50, value.pseudo, value.pseudo, 'char_'+value.id);
		});

		ppmap.avatar(map.user.x, map.user.y, 'images/sprite.png', 70, -70, true, 4); //notre avatar
		ppmap.cursor('images/cursor-on.png', 'images/cursor-off.png', 0, 0); //notre curseur
	};

	socket.on('new_user_connected', function(data){
		ppmap.addObject(data.x, data.y, 'images/avatar.png', 50, -50, '', data.pseudo, 'char_'+data.id);
	});

	socket.on('userMoveBroad', function(data){
		ppmap.moveObject('char_'+data.id ,data.x, data.y, true, 500);
	});

	socket.on('userDisconnect', function(data){
		ppmap.killObject('char_'+data.id);
	});

	socket.on('newTileSprite', function(data){
		ppmap.changeOneMap(data.x,data.y,data.sprite_id);
	});

	socket.on('newTileConquer', function(data){
		if(User.id == data.user_id)
			ppmap.changeOneMap(data.x,data.y,2);
		else if(User.allies[data.user_id] != null)
			ppmap.changeOneMap(data.x,data.y,6);
		else
			ppmap.changeOneMap(data.x,data.y,3);
	});

	socket.on('stopBlink', function(data){
		if(User.id == data.user_id || User.allies[data.user_id] != null)
			stopBlink = true;
	});

	socket.on("stopBlinkDef", function(data){
		stopBlink = true;
	});

	socket.on('respawnLose', function(data){
		ppmap.killAvatar();
		ppmap.avatar(data.x, data.y, 'images/sprite.png', 70, -70, true, 4);
	});

	socket.on('resetAttack', function(infos){
		$.each(tileSelect, function(index, value){
			ppmap.changeOneMap(value.x, value.y, '3');
		});
		tileSelect = new Array();
	});

	socket.on('resetAttackAttacker', function(data){
		$.each(data, function(index, value){
			ppmap.changeOneMap(value.x, value.y, '3');
		});
	});

	socket.on('loseTerritory', function(data){
		$.each(data, function(index, value){
			ppmap.changeOneMap(value.x, value.y, '3');
		});
	});

	socket.on('winTerritory', function(data){
		$.each(data, function(index, value){
			ppmap.changeOneMap(value.x, value.y, '2');
		});
	});


	socket.on('resetConquet', function(infos){
		$.each(tileSelect, function(index, value){
			ppmap.changeOneMap(value.x, value.y, '1');
		});
		tileSelect = new Array();
	});

	socket.on('tileBlink', function(data){
		if(User.id == data.infos[0]['user_id']) {
			var check = true;
			var sprite = 2;
			var blinkTileUser = setInterval(function(){
				if(stopBlink) {
					clearInterval(blinkTileUser);
					stopBlink = false;
					$.each(data.infos, function(index,val){
						ppmap.changeOneMap(val.x,val.y,2);
					});
				}
				else {
					sprite = (check) ? 4 : 2;
					check = !check;
					$.each(data.infos, function(index,val){
						User.attack_tile[index] = {
							'x': val.x,
							'y': val.y,
							'user_id': val.user_id
						};
						ppmap.changeOneMap(val.x,val.y,sprite);
					});
				}			
			},500);
		}
		else if(User.allies[data.infos[0]['user_id']] != null){
			var check = true;
			var sprite = 6;
			var blinkTile = setInterval(function(){
				if(stopBlink) {
					clearInterval(blinkTile);
					stopBlink = false;
					$.each(data.infos, function(index,val){
						ppmap.changeOneMap(val.x,val.y,6);
					});
				}
				else {
					sprite = (check) ? 4 : 6;
					check = !check;
					$.each(data.infos, function(index,val){
						User.attack_tile[index] = {
							'x': val.x,
							'y': val.y,
							'user_id': val.user_id
						};
						ppmap.changeOneMap(val.x,val.y,sprite);
					});
				}			
			},500);
		}
	});

	socket.on('newTileAttack', function(data){
		if(User.id == data.user_id)
			ppmap.changeOneMap(data.x,data.y,2);
		else if(User.allies[data.user_id] != null)
			ppmap.changeOneMap(data.x,data.y,6);
		else
			ppmap.changeOneMap(data.x,data.y,3);
	});

	socket.on('newTileOwner', function(infos){
		var index = 1;
		$.each(User.own_tile, function(k,v){
			index++;
		});
		User.own_tile[index] = {
			'x':infos.x,
			'y':infos.y
		};
	});

	var mouseClick = function(x, y) {

		if(User.isPlanting)
		{
			var testTile = false;
			console.log(User.own_tile);
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile)
			{
				//ppmap.addObject(x, y, 'images/'+Plantes.sprite[Plantes.name].sprite_id + '.png', 0, 0);
				socket.emit('newCrops', {
					x: x,
					y: y,
					id: Plantes.sprite[Plantes.name].id
				});
			}
			else
				sendError('Tu ne peux planter que sur ton territoire !');
			
		}
		else if(User.isBuilding)
		{
			if(Batiment.name == 'silo'){
				var testTile = false;
				$.each(User.own_tile, function(index, value){
					if(value.x == x && value.y == y)
						testTile = true;
				});
				if(testTile)
				{
					socket.emit('newstorage', {
						x: x,
						y: y,
						id: Batiment.sprite[Batiment.name].id
					});
				}
				else
					sendError('Tu ne peux construire que sur ton territoire !');
			}else if(Batiment.name == 'grange'){
				var testTile1 = false;
				var testTile2 = false;
				var testTile3 = false;
				var testTile4 = false;

				$.each(User.own_tile, function(index, value){
					if(value.x == x && value.y == y)
						testTile1 = true;
					else if(value.x == x-1 && value.y == y)
						testTile2 = true;
					else if(value.x == x-1 && value.y == y-1)
						testTile3 = true;
					else if(value.x == x && value.y == y-1)
						testTile4 = true;
				});
				if(testTile1 && testTile2 && testTile3 && testTile4){
					socket.emit('newstorage', {
						x: x,
						y: y,
						id: Batiment.sprite[Batiment.name].id
					});
				}
				else
					sendError('Tu ne peux construire que sur ton territoire !');
			}else if(Batiment.name == 'chambre'){
				var testTile1 = false;
				var testTile2 = false;
				var testTile3 = false;
				var testTile4 = false;
				var testTile5 = false;
				var testTile6 = false;

				$.each(User.own_tile, function(index, value){
					if(value.x == x && value.y == y)
						testTile1 = true;
					else if(value.x == x-1 && value.y == y)
						testTile2 = true;
					else if(value.x == x-1 && value.y == y-1)
						testTile3 = true;
					else if(value.x == x && value.y == y-1)
						testTile4 = true;
					else if(value.x == x && value.y == y-2)
						testTile5 = true;
					else if(value.x == x-1 && value.y == y-2)
						testTile6 = true;
				});
				if(testTile1 && testTile2 && testTile3 && testTile4 && testTile5 && testTile6){
					socket.emit('newstorage', {
						x: x,
						y: y,
						id: Batiment.sprite[Batiment.name].id
					});
				}
				else
					sendError('Tu ne peux construire que sur ton territoire !');
			}
			
			
		}
		else if(User.isAttacking)
		{
			var testTile = true;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = false;
			});
			if(testTile)
			{	

				var testEnemi = false;
				var id_enemi = 0;
				$.each(User.enemi_tile, function(i, v){
					if(v.x == x && v.y == y){
						testEnemi = true;
						id_enemi = v.id;
					}
				});
				if(testEnemi)
				{
					if(checkTileIsNear({x : x, y : y})){
						var testTile2 = true;
						$.each(tileSelect, function(index, value){
							if(value.x == x && value.y == y)
								testTile2 = false;
						});
						if(testTile2){
							nb = $("#user_max").attr('class');
							nb = parseInt(nb);

							if(tileSelect.length < nb){
								tileSelect.push({
									'user_id': id_enemi,
									'x': x,
									'y': y
								});
								ppmap.changeOneMap(x, y, '4');
							}else{
								sendError('Nombre Max atteint');
							}
						}else{
							var temp = new Array();
							$.each(tileSelect, function(index, value){
								if(value.x == x && value.y == y){
									ppmap.changeOneMap(x, y, '3');
								}
								else{
									temp.push({
										'user_id': value.user_id,
										'x': value.x,
										'y': value.y
									});
								}	
							});
							tileSelect = temp;
						}
					}else{
						sendError('Tu ne peux conquerir que des tiles a cotés de tiennes');
					}
				}
				else
					sendError('Tu ne peux attaquer que des terrains ennemis.');
			}
			else
				sendError('Tu ne peux pas attaquer un terrain qui t\'appartient.');
		}
		else if(User.isConquering)
		{
			var testTile = true;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = false;
			});
			if(testTile)
			{	
				if(checkTileIsNear({x : x, y : y})){
					var testTile2 = true;
					$.each(tileSelect, function(index, value){
						if(value.x == x && value.y == y)
							testTile2 = false;
					});
					if(testTile2){
						nb = $("#user_max").attr('class');
						nb = parseInt(nb);

						if(tileSelect.length < nb){
							tileSelect.push({
								'x': x,
								'y': y
							});
							ppmap.changeOneMap(x, y, '4');
						}else{
							sendError('Tile Limit Reach !');
						}
					}else{
						var temp = new Array();
						$.each(tileSelect, function(index, value){
							if(value.x == x && value.y == y){
								ppmap.changeOneMap(x, y, '1');
							}
							else{
								temp.push({
									'x': value.x,
									'y': value.y
								});
							}	
						});
						tileSelect = temp;
					}
				}else{
					sendError('Tu ne peux conquerir que des tiles a cotés de tiennes');
				}
			}
			else
				sendError('Tu ne peux pas conquerir un terrain qui t\'appartient.');
		}
		else if(User.isWatering == true){
			var testTile = false;
			var testTile2 = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			$.each(User.allies, function(index, value){
				if(value.x == x && value.y == y)
					testTile2 = true;
			});
			if(testTile || testTile2){
				socket.emit('watering', {
					x: x,
					y: y
				});
			}else{
				sendError('Tu ne peux arroser que ton territoire');
			}
		}
		else if(User.isDefending == true){
			console.log(User.attack_tile);
			var testTile = false;
			$.each(User.attack_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile){
				socket.emit('defendTile', {
					'user_defend' : User.id,
					'user_attacked' : User.attack_tile[0].user_id
				})
			}else{
				sendError('Tu ne peux défendre que ton territoire');
			}
			User.isDefending = false;
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else if(User.isFertilizing == true){
			var testTile = false;
			var testTile2 = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			$.each(User.allies, function(index, value){
				if(value.x == x && value.y == y)
					testTile2 = true;
			});
			if(testTile || testTile2){
				socket.emit('fertilizing', {
					x: x,
					y: y
				});
			}else{
				sendError('Tu ne peux fertiliser que ton territoire');
			}
		}
		else if(User.isHarvesting == true){
			var testTile = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile){
				socket.emit('harvesting', {
					x: x,
					y: y
				});
			}else{
				socket.emit('error', 'Tu ne peux récolter que tes plantes');
			}
		}
		else if(User.isDestroyCrop == true){
			var testTile = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile){
				socket.emit('destroyingCrops', {
					x: x,
					y: y
				});
			}else{
				socket.emit('error', 'Tu ne peux détruire que tes plantes');
			}
		}
		else if(User.isDestroyBuilding == true){
			var testTile = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile){
				socket.emit('destroyingBuilding', {
					x: x,
					y: y
				});
			}else{
				socket.emit('error', 'Tu ne peux détruire que tes bâtiments');
			}
		}
		socket.emit('userMove', {
			x: x,
			y: y
		});
	};
	

	var buildingProps = function(x, y){
		if(!User.isDestroyBuilding){
			var testTile = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile){
				socket.emit('showBuildingProps', {
					x: x,
					y: y
				});
			}else{
				sendError('Ce n\'est pas à toi !');
			}
		}else{
			var testTile = false;
			$.each(User.own_tile, function(index, value){
				if(value.x == x && value.y == y)
					testTile = true;
			});
			if(testTile){
				socket.emit('destroyingBuilding', {
					x: x,
					y: y
				});
			}else{
				socket.emit('error', 'Tu ne peux détruire que tes bâtiments');
			}
		}
	};

	var hoverTiles = function(x, y){
		var testTile = true;
		$.each(User.enemi_tile, function(index, value){
			if(value.x == x && value.y == y)
				testTile = false;
		});
		if(testTile){
			socket.emit('getTileInfos', {
				x: x,
				y: y
			});
		}else{
			sendError('Vous ne pouvez pas connaitre les infos d\'une case ennemie');
		}
	};

	socket.on('showTileInfos', function(data){
		var text = 'X : <span id="tile-coord-x">'+data.tile.x+'</span>, Y: <span id="tile-coord-y">'+data.tile.y+'</span></br>';
		var owner;
		if(data.tile.owner == null)
			owner = 'NEUTRE';
		else if(data.tile.owner == data.user_id)
			owner = 'MOI';
		else
			owner = 'ENNEMI';

		text += 'Owner : <span id="tile-owner">'+owner+'</span><br/>';
		text += 'Humidite : <span id="tile-humidite">'+data.tile.humidite+'</span><br/>';
		text += 'Fertilite : <span id="tile-fertilite">'+data.tile.fertilite+'</span></br>';

		if(data.type == 'plante'){
			text += '</br><b>Plante</b></br>';
			var healthText;
			if(data.plante.health >=0 && data.plante.health < 20)
				healthText = 'Très mauvaise';
			else if(data.plante.health >= 20 && data.plante.health < 40)
				healthText = 'Mauvaise';
			else if(data.plante.health >= 40 && data.plante.health < 60)
				healthText = 'Correct';
			else if(data.plante.health >= 60 && data.plante.health < 80)
				healthText = 'Bonne';
			else if(data.plante.health >= 80 && data.plante.health <= 100)
				healthText = 'Très bonne';
			text += 'Santé : <span id="tile-plante-health">'+data.plante.health+'%</span> <span id="tile-plante-health-text">'+healthText+'</span></br>';

			var CroissanceText;
			if(data.plante.croissance >=0 && data.plante.croissance < 20)
				CroissanceText = 'Semer';
			else if(data.plante.croissance >= 20 && data.plante.croissance < 40)
				CroissanceText = 'Germes';
			else if(data.plante.croissance >= 40 && data.plante.croissance < 60)
				CroissanceText = 'Pousses';
			else if(data.plante.croissance >= 60 && data.plante.croissance < 80)
				CroissanceText = 'Plantes';
			else if(data.plante.croissance >= 80 && data.plante.croissance <= 100)
				CroissanceText = 'Mature';
			text += 'Croissance : <span id="tile-plante-croissance">'+data.plante.croissance+'%</span> <span id="tile-plante-croissance-text">'+CroissanceText+'</span></br>';

		}else if(data.type == 'batiment'){
			text += '</br><b>Bâtiment</b></br>';
			text += 'Capacite Restante : <span id="tile-stockage-etat">'+data.batiment.stockage_state+'</span></br>';
		}
		if(data.tile.x == x_tip_show && data.tile.y == y_tip_show){}
		else
			ppmap.tipShow(text, 0,0,0);
		
		x_tip_show = data.tile.x;
		y_tip_show = data.tile.y;

		var upd = setInterval(function(){
           ppmap.tipHide();
           clearInterval(upd);
        },(1500));
	});

	socket.on('cropsButton', function(data){
		var name = 'undefined';
		for (var i = 0; i < data.length; i++) {
			var value = data[i].split("_");
			var graines_spec_id = value[0];
			var nb = value[1];
			
			switch(graines_spec_id)
			{
				case '1':
					if(nb == '0'){
						$("#menu_select_plantes_pasteque").css('display', 'none');
						break;
					}else{
						$("#menu_select_plantes_pasteque").css('display', 'inline');
				  		$("#menu_select_plantes_pasteque").val('Planter une pasteque ('+nb+')');
						break;
					}
				case '2':
					if(nb == '0'){
						$("#menu_select_plantes_salade").css('display', 'none');
						break;
					}else{
						$("#menu_select_plantes_salade").css('display', 'inline');
						$("#menu_select_plantes_salade").val('Planter des salades ('+nb+')');
						break;
					}
				case '3':
					if(nb == '0'){
						$("#menu_select_plantes_ananas").css('display', 'none');
						break;
					}else{
						$("#menu_select_plantes_ananas").css('display', 'inline');
						$("#menu_select_plantes_ananas").val('Planter un ananas ('+nb+')');
						break;
					}
				case '4':
					if(nb == '0'){
						$("#menu_select_plantes_tomate").css('display', 'none');
						break;
					}else{
						$("#menu_select_plantes_tomate").css('display', 'inline');
						$("#menu_select_plantes_tomate").val('Planter des tomates ('+nb+')');
						break;
					}
				case '5':
					if(nb == '0'){
						$("#menu_select_plantes_melon").css('display', 'none');
						break;
					}else{
						$("#menu_select_plantes_melon").css('display', 'inline');
						$("#menu_select_plantes_melon").val('Planter un melon ('+nb+')');
						break;
					}
				case '6':
					if(nb == '0'){
						$("#menu_select_plantes_carotte").css('display', 'none');
						break;
					}else{
						$("#menu_select_plantes_carotte").css('display', 'inline');
						$("#menu_select_plantes_carotte").val('Planter des carottes ('+nb+')');
						break;
					}
			}
		}
	});

	socket.on ('BatButton', function(data){
		for (var i = 0; i < data.length; i++) {
			if(data[i].id == 1){
				$("#menu_select_batiments_silo").val('Silo '+data[i].prix+'$');
			}else if (data[i].id == 2){
				$("#menu_select_batiments_grange").val('Grange '+data[i].prix+'$');
			}else if(data[i].id == 3){
				$("#menu_select_batiments_chambre").val('Chambre Froide '+data[i].prix+'$');
			}
		}
	});

	socket.on('user_props', function(data){
		$("#user_level").html('Niveau : '+data.level);
		$("#user_water").html('Eau : '+data.water);
		$("#user_fertilisant").html('Fertilisant : '+data.fertilisant);
		$("#user_energie").html('Energies : '+data.energie);
		$("#user_argent").html('Or : '+data.argent);
		$("#user_experience").html('XP : '+data.xp);
		$("#user_next").html('/ '+data.next);
		$("#user_max").html('Max :'+data.max);
		$("#user_max").attr('class', data.max);
		$("#user_alliance").html('Alliance : '+data.alliance);
		$("#user_alliance").attr('class', data.alliance_id);
		$("#user_life").html('Vie : '+data.life);
		$("#user_life").attr('class', data.life);
		$("#user_lifeMax").html(' / '+data.lifeMax);
		$("#user_lifeMax").attr('class', data.lifeMax);
	});

	socket.on('validStorage', function(data){
		ppmap.addBuilding(data.x, data.y, 'images/'+Batiment.name + '.png', Batiment.sprite[Batiment.name].decX, Batiment.sprite[Batiment.name].decY);
	});

	socket.on('validStorageOrigin', function(data){
		ppmap.addBuilding(data.x, data.y, 'images/2.png', 0, 0);
	});

	socket.on('validCrops', function(data){
		ppmap.changeOneMap(data.x, data.y, Plantes.sprite[Plantes.name].sprite_id);
	});

	socket.on('destroyCrops', function(data){
		ppmap.changeOneMap(data.x, data.y, '2');
	});

	socket.on('destroyBuilding', function(data){
		ppmap.killBuilding(data.x, data.y);
		ppmap.changeOneMap(data.x, data.y, '2');
	});

	socket.on('instantSell', function(data){
		$("#instantSell").css('display','block');
		$("#nbFruits").text(data.nb);
		$("#nameFruits").text(data.nom);
		$("#prixFruits").text(data.prix);
		$("#poidsFruits").text(data.poids);
		$("#timeFruits").text(data.pourissement);
		$("#instantSell").addClass(""+data.fruit_id+"");
	});

	socket.on('chooseStorage', function(data){
		var nb = data.data.nb;
		var text = '';
		var name;
		$.each(data.stockages, function(index, value) {

			if(value.stockages_spec_id == 1){
				name = 'Silo';
			}else if (value.stockages_spec_id == 2){
				name = 'Grange';
			}else if (value.stockages_spec_id == 3){
				name = 'Chambre Froide';
			}
			text += '<option value="'+value.id+'_'+value.stockages_spec_id+'">'+name+' '+value.id+' ('+value.stockage_state+')'+'</option>';
		});;
		$("#chooseStorage").css('display','block');
		$("#storageList").html(text);
	});

	socket.on('DisplayBuildingProps', function(data){
		var text = "Name : "+data.stockages_spec.name+" "+data.stockages.id+"</br>";
		text += "Espace libre: "+data.stockages.stockage_state+"</br>";
		text += "<span id='BuildingPropTileId' class='"+data.stockages.tile_id+"' ></span>";
		$("#buildingInfos").html(text);
		text = '';
		$.each(data.fruits, function(index, fruits) {
			text += '<div class ="fruit_property" id="fruit_'+fruits.id+'">';
			var fruit_spec_id = fruits.fruits_spec_id;
			var fruit_sp;
			$.each(data.fruits_spec, function(index, fruits_spec) {
				if(fruits_spec.id == fruit_spec_id){
					fruit_sp = fruits_spec;;
					return false;
				}
			});
			text += '<span class="fruit_name"> Name : '+fruit_sp.name+' '+fruits.id+'</span></br>';
			text += '<span class="fruit_sante"> Health : '+fruits.pourrissement_state+'/'+fruit_sp.stockage_time+'</span></br>';
			var percentage = Math.ceil((fruits.pourrissement_state * 100)/fruit_sp.stockage_time);
			text += '<span class="fruit_per_sante"> Percentage Health : '+percentage+'%</span></br>';
			text += '<span class="fruit_prix"> Prix : '+fruit_sp.prix_vente+'</span></br>';
			if(fruits.pourrissement_state > 0){
				text += '<input class="sell_fruit" id="sell_'+fruits.id+'_'+fruit_sp.poids+'_'+fruit_sp.prix_vente+'_'+data.stockages.id+'" type="button" value="Vendre ce fruit"/>';
			}
			text += '<input class="drop_fruit" id="drop_'+fruits.id+'_'+fruit_sp.poids+'_'+fruit_sp.prix_vente+'_'+data.stockages.id+'" type="button" value="Jeter ce fruit"/>';
			text += '</div>'
		});
		$("#clearDeadFruits").attr('id', 'stockId_'+data.stockages.id);
		$("#fruitsList").html('');
		$("#fruitsList").html(text);
		$("#buildingProps").css('display', 'block');

	});

	socket.on('RefreshBuildingProps', function(data){
		var id = $("#BuildingPropTileId").attr('class');
		id = parseInt(id);
		socket.emit('showBuildingPropswithId', id);
	});

	socket.on('hideBuildingProps', function(data){
		$("#buildingProps").css('display', 'none');
	});

	socket.on('DisplayHouseAction', function(data){
		$("#houseProps").css('display', 'block');
	});


	socket.on('money', function(data){
		var text = "";
		text += '<div>';
		text += 'Argent : '+data;
		text += '</div>';

		$("#money").html(text);
	});

	socket.on('energie', function(data){
		var text = "";
		text += '<div>';
		text += 'Energie : '+data;
		text += '</div>';

		$(".energie_sum").html(text);
	});

	socket.on('newAlliance', function(data){
		sendValid('new Alliance '+data);
	});

	socket.on('displayInvit', function(data){
		var text = "";
		$.each(data, function(index, invit) {
			text += '<div class="invitation" id="alliance_invit_'+invit.id+'_'+invit.alliance_id+'">';
			text += invit.pseudo+' vous a invité a rejoindre son alliance : '+invit.name+' !<br/>';
			text += '<input class="accept_invit" id="alliance_invit_accept_'+invit.id+'_'+invit.alliance_id+'" type="button" value="Accepter"/>';
			text += '<input class="refus_invit" id="alliance_invit_refus_'+invit.id+'_'+invit.alliance_id+'" type="button" value="Refuser"/>';
			text += '</div>';
		});
		$("#invitList").html(text);
		$("#alliance_invit_list").fadeIn('slow');
	});

	socket.on('hideInvit', function(data){
		$("#alliance_invit_list").fadeOut('fast');
	});

	socket.on('refreshInvitList', function(data){
		socket.emit('getInvitList', '');
	});

	socket.on('receiveInvitation', function(data){
		alert('Vous avez reçu une nouvelle invitation');
	});

	socket.on('newRain', function(data){
		$.each(data,function(index,tile){
			ppmap.addObject(tile.x, tile.y, 'images/pluie.gif', 0, -96, '', '', 'pluie_'+tile.x+'_'+tile.y);
		});
	});

	socket.on('DestroyRain', function(data){
		$.each(data,function(index,tile){
			ppmap.killObject('pluie_'+tile.x+'_'+tile.y);
		});
		sendValid('Pluie terminée');
	});

	socket.on('newMeteorRain', function(data){
		$.each(data,function(index,tile){
			ppmap.addObject(tile.x, tile.y, 'images/meteor.gif', +20, -402, '', '', 'meteor_'+tile.x+'_'+tile.y);
			var sprite = '';
			$.each(User.own_tile, function(index, value){
				if(tile.x == value.x && tile.y == value.y)
					sprite = '2';
			});
			if(sprite == ''){
				$.each(User.enemi_tile, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '3';
				});
			}
			if(sprite == ''){
				$.each(User.allies, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '6';
				});
			}
			if(sprite == '')
				sprite = '1'
			ppmap.changeOneMap(tile.x,tile.y,sprite);
			ppmap.killBuilding(tile.x, tile.y);
		});
	});

	socket.on('DestroyMeteor', function(data){
		$.each(data,function(index,tile){
			ppmap.killObject('meteor_'+tile.x+'_'+tile.y);
		});
		sendValid('Pluie de Météore terminée');
	});

	socket.on('newSauterelles', function(data){

		$.each(data,function(index,tile){
			ppmap.addObject(tile.x, tile.y, 'images/Sauterelle.gif', 0, 0, '', '', 'sauterelle_'+tile.x+'_'+tile.y);
			sauterelleList.push('sauterelle_'+tile.x+'_'+tile.y);
			var sprite = '';
			$.each(User.own_tile, function(index, value){
				if(tile.x == value.x && tile.y == value.y)
					sprite = '2';
			});
			if(sprite == ''){
				$.each(User.enemi_tile, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '3';
				});
			}
			if(sprite == ''){
				$.each(User.allies, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '6';
				});
			}
			if(sprite == '')
				sprite = '1'
			ppmap.changeOneMap(tile.x,tile.y,sprite);
		});
	});

	socket.on('moveSauterelles', function(data){
		var count = 0;
		$.each(data,function(index,tile){
			// ppmap.killObject('sauterelle_'+tile.x+'_'+tile.y);
			// ppmap.addObject(tile.newx, tile.newy, 'images/Sauterelle.gif', 0, 0, '', '', 'sauterelle_'+tile.newx+'_'+tile.newy);
			ppmap.moveObject(sauterelleList[count],tile.newx, tile.newy, true, 500);
			count++;

			var sprite = '';
			$.each(User.own_tile, function(index, value){
				if(tile.x == value.x && tile.y == value.y)
					sprite = '2';
			});
			if(sprite == ''){
				$.each(User.enemi_tile, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '3';
				});
			}
			if(sprite == ''){
				$.each(User.allies, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '6';
				});
			}
			if(sprite == '')
				sprite = '1';
			ppmap.changeOneMap(tile.x,tile.y,sprite);
		});
	});

	socket.on('DestroySauterelles', function(data){
		$.each(sauterelleList,function(index,id){
			ppmap.killObject(id);
		});
		sauterelleList = new Array();
		sendValid('Nuage de Sauterelle terminée');
	});

	socket.on('newTornade', function(data){
		$.each(data,function(index,tile){
			ppmap.addObject(tile.x, tile.y, 'images/tornade.gif', 0, -192, '', '', 'tornade_'+tile.x+'_'+tile.y);
			tornadeList.push('tornade_'+tile.x+'_'+tile.y);
			var sprite = '';
			$.each(User.own_tile, function(index, value){
				if(tile.x == value.x && tile.y == value.y)
					sprite = '2';
			});
			if(sprite == ''){
				$.each(User.enemi_tile, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '3';
				});
			}
			if(sprite == ''){
				$.each(User.allies, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '6';
				});
			}
			if(sprite == '')
				sprite = '1'
			ppmap.changeOneMap(tile.x,tile.y,sprite);
			ppmap.killBuilding(tile.x, tile.y);
		});
	});

	socket.on('moveTornades', function(data){
		var count = 0;
		$.each(data,function(index,tile){
			ppmap.moveObject(tornadeList[count],tile.newx, tile.newy, true, 500);
			count++;
			var sprite = '';
			$.each(User.own_tile, function(index, value){
				if(tile.x == value.x && tile.y == value.y)
					sprite = '2';
			});
			if(sprite == ''){
				$.each(User.enemi_tile, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '3';
				});
			}
			if(sprite == ''){
				$.each(User.allies, function(index, value){
					if(tile.x == value.x && tile.y == value.y)
						sprite = '6';
				});
			}
			if(sprite == '')
				sprite = '1'
			ppmap.changeOneMap(tile.x,tile.y,sprite);
			ppmap.killBuilding(tile.x, tile.y);
		});
	});

	socket.on('DestroyTornades', function(data){
		$.each(tornadeList,function(index,id){
			ppmap.killObject(id);
		});
		tornadeList = new Array();
		sendValid('Tornade terminée');
	});

	socket.on('myNewAllies', function(data){
		$.each(data,function(index,value){
			var index = 1;
			$.each(User.allies, function(k,v){
				index++;
			});
			User.allies[index] = {
				'x':value.x,
				'y':value.y
			};
			if(value.isEmpty != 1){
				ppmap.changeOneMap(value.x, value.y, '6');
			}
		});
	});

	socket.on('newAlliesTile', function(data){
		var index = 1;
		$.each(User.allies, function(k,v){
			index++;
		});
		User.allies[index] = {
			'x':value.x,
			'y':value.y
		};
		if(data.empty != 1){
			ppmap.changeOneMap(data.x, data.y, '6');
		}
	});

	socket.on("displayTimerConquete", function(data){
		$('#conquete_timer').css("display", "inline");
	});

	socket.on("hideTimerConquete", function(data){
		$('#conquete_timer').css("display", "none");
	});

	socket.on("timerConquete", function(data){
		$('#conquete_timer').html("Conquete Timer : "+data.value);
	});

	socket.on("displayTimerAttack", function(data){
		$('#attack_timer').css("display", "inline");
	});

	socket.on("hideTimerAttack", function(data){
		$('#attack_timer').css("display", "none");
	});

	socket.on("timerAttack", function(data){
		$('#attack_timer').html("Attaque Timer : "+data.value);
	});

	socket.on("displayTimerDefend", function(data){
		$('#defend_timer').css("display", "inline");
	});

	socket.on("hideTimerDefend", function(data){
		$('#defend_timer').css("display", "none");
	});

	socket.on("timerDefend", function(data){
		$('#defend_timer').html("Defense Timer : "+data.value);
	});

	socket.on("resetSelectTiles", function(data){
		tileSelect = new Array();
	})


	$(".button_menu").click(function(){
		var type = $(this).attr('id').substr(8,$(this).attr('id').length);
		if(type == "plantes")
		{
			$('#gestion_batiments').toggle(0);
			$('#gestion_terrains').toggle(0);
			$('#gestion_alliances').toggle(0);
			$('#menu_market').toggle(0);
			$('#menu_display_tile_infos').toggle(0);
			$("#menu_gestion_"+type+"_type").toggle('fast');
		}
		if(type == 'batiments')
		{
			$('#gestion_plantes').toggle(0);
			$('#gestion_terrains').toggle(0);
			$('#gestion_alliances').toggle(0);
			$('#menu_market').toggle(0);
			$('#menu_display_tile_infos').toggle(0);
			$("#menu_gestion_"+type+"_type").toggle('fast');
		}
		if(type == 'terrains')
		{
			$('#gestion_plantes').toggle(0);
			$('#gestion_batiments').toggle(0);
			$('#gestion_alliances').toggle(0);
			$('#menu_market').toggle(0);
			$('#menu_display_tile_infos').toggle(0);
			$("#menu_gestion_"+type+"_type").toggle('fast');
		}
		if(type == 'alliances')
		{
			$('#gestion_plantes').toggle(0);
			$('#gestion_terrains').toggle(0);
			$('#gestion_batiments').toggle(0);
			$('#menu_market').toggle(0);
			$('#menu_display_tile_infos').toggle(0);
			$("#menu_gestion_"+type+"_type").toggle('fast');
		}
	});

	$("#menu_select_batiments").click(function(){
		$("#menu_select_batiments_type").toggle('fast');
	});

	$("#menu_select_plantes").click(function(){
		$("#menu_select_plantes_type").toggle('fast');
	});

	

	socket.on('liste_graines', function(data){
		  	var html = '<ul style="display:block !important">';
			for (var n in data) 
			{ 
				html += '<li><label>' + data[n].name + " : </label>&nbsp;&nbsp;<input type='number' id='graine_"+ data[n].name + "'" + 'value="1"/> x ' +data[n].prix+' OR '+ "<input id='market_"+data[n].name+"'"+ "class='button_market_graines button_market_"+data[n].name+"'"+ "type='button' value='Acheter graine de "+data[n].name+" ' /></li> ";    
		    }
			html += '</ul>';
			$('#liste_graines').html(html);
	});

	socket.on('liste_armes', function(data){
		   	var html = '<ul style="display:block !important">';
			for (var n in data) 
			{ 
				html += '<li>' + data[n].name + ' -> ' +data[n].prix+' OR '+  "<input id='market_"+data[n].name+"'"+ "class='button_market_"+data[n].name+"'"+ "type='button' value='Acheter "+data[n].name+" ' /></li>";    
		    }
			html += '</ul>';
			$('#liste_armes').html(html);
	});

	socket.on('liste_energies', function(data){
		   var html = '<ul style="display:block !important">';
			for (var n in data) 
			{ 
				html += '<li>' + data[n].name + "<input type='number' id='number_energie' value='1'/> x "  +data[n].prix+' OR '+  "<input id='market_"+data[n].name+"'"+ "class='market_energie'"+ "type='button' value='Acheter "+data[n].name+" ' /></li>";    
		    }
			html += '</ul>';
			$('#energie').html(html);
	});

	$("#menu_select_defendre").click(function(){
		User.isDefending = true;
		User.isConquering = false;
		User.isPlanting = false;
		User.isBuilding = false;
		User.isWatering = false;
		User.isFertilizing = false;
		User.isHarvesting = false;
		User.isAttacking = false;
		ppmap.changeCursor('images/conquer.png','images/empty_tile.png',0,-64);
	});	

	$("#menu_select_conquerir").click(function(){
		if(User.isConquering)
		{
			User.isConquering = false;
			$.each(tileSelect,function(index,val){
				socket.emit('newTileSelectConquet',{
					'x': val.x,
					'y': val.y
				});
			});
			//tileSelect = new Array();
			socket.emit('userConquer',true);
			$(this).val('Conquerir terrain');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else
		{
			User.isConquering = true;
			User.isDefending = false;
			User.isPlanting = false;
			User.isBuilding = false;
			User.isWatering = false;
			User.isFertilizing = false;
			User.isHarvesting = false;
			User.isAttacking = false;
			$(this).val('Conquerir !');
			$(this).css('background','orange');
			ppmap.changeCursor('images/conquer.png','images/empty_tile.png',0,-64);
		}		
	});
	$("#menu_select_attaquer").click(function(){
		if(User.isAttacking)
		{
			User.isAttacking = false;
			var enemi = 0;
			$.each(tileSelect,function(index,val){
				socket.emit('newTileSelectAttack',{
					'x': val.x,
					'y': val.y
				});
				enemi = val.user_id;
			});
			socket.emit('userAttackTileBlink', {
				'infos': tileSelect,
				'user_id': enemi
			});
			tileSelect = new Array();
			socket.emit('userAttack',enemi);
			$(this).val('Attaquer terrain');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else
		{
			User.isAttacking = true;
			User.isDefending = false;
			User.isPlanting = false;
			User.isBuilding = false;
			User.isWatering = false;
			User.isFertilizing = false;
			User.isHarvesting = false;
			User.isConquering = false;
			$(this).val('Attaquer !');
			$(this).css('background','orange');
			ppmap.changeCursor('images/attackTile.png','images/empty_tile.png',0,0);
		}
		
	});
	$("#menu_arrosage_plantes").click(function(){
		if(User.isWatering){
			User.isWatering =false;
			$(this).val('Arroser une plante');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);		
		}else{
			User.isBuilding = false;
			User.isPlanting = false;
			User.isWatering = true;
			User.isFertilizing = false;
			User.isHarvesting = false;
			$(this).val('Arreter d\'arroser');
			$(this).css('background','orange');
			ppmap.changeCursor('images/arrosoir.png','images/cursor-off.png',-40,-40);
		}
	});

	$("#menu_fertilise_plantes").click(function(){

		if(User.isFertilizing){
			User.isFertilizing = false;
			$(this).val('Fertiliser une plante');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else{
			User.isBuilding = false;
			User.isPlanting = false;
			User.isWatering = false;
			User.isFertilizing = true;
			User.isHarvesting = false;
			$(this).val('Arreter de fertiliser');
			$(this).css('background','orange');
			ppmap.changeCursor('images/fertilizing.png','images/cursor-off.png',0,0);
		}

	});

	$("#menu_market").click(function(){
		
		$("#menu_market_panel").fadeIn('slow');
		
	});


	$("#quit_market").click(function(){	
		$("#menu_market_panel").fadeOut('fast');
	});

	$("#content div").hide().eq(0).show(); // show first one
	$("#tabs li").eq(0).addClass('current'); // set active one
	$('#tabs a').click(function(e) {
		e.preventDefault();
		if( $(this).closest("li").hasClass('current') ){ //detection for current tab
			return;      
		}else{             
			$("#content div").hide(); //Hide all content
			$("#tabs li").removeClass('current'); //Reset id's
			$(this).parent().addClass('current'); // Activate this
			$('#' + $(this).attr('name')).fadeIn(); // Show content for current tab
			$('#' + $(this).attr('name')).children().fadeIn(); // Show content for current tab
		}
	});


	$("#menu_recolte_plantes").click(function(){

		if(User.isHarvesting){
			User.isHarvesting = false;
			$(this).val('Récolter une plante');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else{
			User.isBuilding = false;
			User.isPlanting = false;
			User.isWatering = false;
			User.isFertilizing = false;
			User.isHarvesting = true;
			$(this).val('Arreter de Récolter');
			$(this).css('background','orange');
			ppmap.changeCursor('images/harvesting.png','images/cursor-off.png',0,0);
		}

	});

	$("#menu_destroy_plantes").click(function(){

		if(User.isDestroyCrop){
			User.isDestroyCrop = false;
			$(this).val('Détruire une plante');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else{
			User.isBuilding = false;
			User.isPlanting = false;
			User.isWatering = false;
			User.isFertilizing = false;
			User.isHarvesting = false;
			User.isDestroyBuilding = false;
			User.isDestroyCrop = true;
			$(this).val('Arreter de Détruire');
			$(this).css('background','orange');
			ppmap.changeCursor('images/bulldozer.png','images/cursor-off.png',0,-30);
		}

	});

	$("#menu_destroy_stockages").click(function(){

		if(User.isDestroyBuilding){
			User.isDestroyBuilding = false;
			$(this).val('Détruire un batiments');
			$(this).css('background','rgb(15, 138, 204)');
			ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		}
		else{
			User.isBuilding = false;
			User.isPlanting = false;
			User.isWatering = false;
			User.isFertilizing = false;
			User.isHarvesting = false;
			User.isDestroyCrop = false;
			User.isDestroyBuilding = true;
			$(this).val('Arreter de Détruire');
			$(this).css('background','orange');
			ppmap.changeCursor('images/bulldozer.png','images/cursor-off.png',0,-30);
		}
	});

	$("#menu_display_tile_infos").click(function(){
		if(User.isDiplayingInfos){
			User.isDiplayingInfos = false;
			$(this).val('Afficher les infos');
			//ppmap.switchCursorDelay(0);
		}
		else{
			//ppmap.switchCursorDelay(1);
			User.isDiplayingInfos = true;
			$(this).val('Masquer les infos');
		}
	});

	

	$("#liste_graines").delegate(".button_market_pasteque",'click',function(){
		socket.emit('achat_graine', {
			nb : $("#graine_pasteque").val(),
			graines_spec_id : 1
		});

	});

	$("#liste_graines").delegate(".button_market_salade",'click',function(){
		socket.emit('achat_graine', {
			nb : $("#graine_salade").val(),
			graines_spec_id : 2
		});

	});

	$("#liste_graines").delegate(".button_market_ananas",'click',function(){
		socket.emit('achat_graine', {
			nb : $("#graine_ananas").val(),
			graines_spec_id : 3
		});

	});

	$("#liste_graines").delegate(".button_market_tomate",'click',function(){
		socket.emit('achat_graine', {
			nb : $("#graine_tomate").val(),
			graines_spec_id : 4
		});

	});

	$("#liste_graines").delegate(".button_market_melon",'click',function(){
		socket.emit('achat_graine', {
			nb : $("#graine_melon").val(),
			graines_spec_id : 5
		});

	});

	$("#liste_graines").delegate(".button_market_carotte",'click',function(){
		socket.emit('achat_graine', {
			nb : $("#graine_carotte").val(),
			graines_spec_id : 6
		});

	});

	$("#liste_armes").delegate(".button_market_Fork",'click',function(){
		socket.emit('achat_arme', {
			nb : 1,
			armes_spec_id : 1
		});

	});

	$("#liste_armes").delegate(".button_market_BaseBallBat",'click',function(){
		socket.emit('achat_arme', {
			nb : 1,
			armes_spec_id : 2
		});

	});

	$("#liste_armes").delegate(".button_market_Chainsaw",'click',function(){
		socket.emit('achat_arme', {
			nb : 1,
			armes_spec_id : 3
		});

	});

	$("#liste_armes").delegate(".button_market_AK-47",'click',function(){
		socket.emit('achat_arme', {
			nb : 1,
			armes_spec_id : 4
		});

	});

	$("#energie").delegate(".market_energie",'click',function(){
		socket.emit('achat_energie', {
			nb : $("#number_energie").val() ,
			prix : 1
		});

	});

	$("#fertilisant").delegate(".button_market_fertilisant",'click',function(){
		socket.emit('achat_fertilisant', {
			nb : $("#number_fertilisant").val() ,
			prix : 1
		});

	});


	$("#fruitsList").delegate(".drop_fruit", 'click', function(){
		var value = $(this).attr('id');
		var val = value.split("_");

		var fruit_id = val[1];
		var stockage_id = val[4];
		var poids = val[2];

		socket.emit('drop_fruit', {
			fruit_id : parseInt(fruit_id),
			stockage_id : parseInt(stockage_id),
			poids : parseInt(poids)
		});
	});	

	$(".button_market").click(function(data){
		socket.emit('button_market', {
			
		});
	});

	$("#menu_create_alliance").click(function(){
		$("#menu_create_alliance_panel").fadeIn('slow');
	});

	$("#hide_create_alliance_button").click(function(){
		$("#menu_create_alliance_panel").fadeOut('slow');
	});

	$("#create_alliance_button").click(function(){
		var name = $("#input_alliance_name").val();
		if(name.length > 0 && name.length <= 20){
			socket.emit('newAlliances', name);
			$("#menu_create_alliance_panel").fadeOut('fast');
		}else{
			sendError('Nom Invalide');
		}
	});

	$("#menu_quit_alliance").click(function(){
		socket.emit('quitAlliance', '');
	});

	$("#menu_invit_alliance").click(function(){
		$("#menu_invit_alliance_panel").fadeIn('slow');
	});

	$("#hide_invit_alliance_button").click(function(){
		$("#menu_invit_alliance_panel").fadeOut('slow');
	});

	$("#invit_alliance_button").click(function(){
		var name = $("#input_player_name").val();
		var id = $("#user_alliance").attr('class');
		id = parseInt(id);
		if(id != null){
			if(name.length > 0 && name.length <= 20){
				socket.emit('newAlliancesInvite', {name : name, alliance_id : id});
				$("#menu_invit_alliance_panel").fadeOut('fast');
			}else{
				sendError('Nom Invalide');
			}
		}else{
			sendError('Vous n\'avez pas d\'alliance');
			$("#menu_invit_alliance_panel").fadeOut('fast');
		}
	});

	$("#menu_get_invit_alliance").click(function(){
		socket.emit('getInvitList', '');
	});

	$(".HideInvitList").click(function(){
		$("#alliance_invit_list").fadeOut('fast');

	});

	$(".RefreshInvitList").click(function(){
		socket.emit('getInvitList', '');
	});

	$("#invitList").delegate(".accept_invit", 'click', function(){
		var value = $(this).attr('id');
		console.log(value);
		var val = value.split("_");
		var invit_id = val[3];
		var alliance_id = val[4];

		socket.emit('accept_invit', {
			invit_id : parseInt(invit_id),
			alliance_id : parseInt(alliance_id),
		});
	});

	$("#invitList").delegate(".refus_invit", 'click', function(){
		var value = $(this).attr('id');
		console.log(value);
		var val = value.split("_");
		var invit_id = val[3];
		var alliance_id = val[4];

		socket.emit('refus_invit', {
			invit_id : parseInt(invit_id),
			alliance_id : parseInt(alliance_id),
		});
	});

	$(".button_menu_plantes").click(function(){
		User.isPlanting = true;
		User.isBuilding = false;
		User.isAttacking = false;
		User.isWatering = false;
		User.isFertilizing = false;
		User.isHarvesting = false;
		var type = $(this).attr('id').substr(20,$(this).attr('id').length);
		Plantes.name = type;
		ppmap.changeCursor('images/5.png','images/cursor-off.png',0,0);
	});

	$(".button_menu_batiments").click(function(){
		User.isBuilding = true;
		User.isPlanting = false;
		User.isAttacking = false;
		User.isWatering = false;
		User.isFertilizing = false;
		User.isHarvesting = false;
		var type = $(this).attr('id').substr(22,$(this).attr('id').length);
		Batiment.name = type;
		ppmap.changeCursor('images/'+type+'.png','images/cursor-off.png',Batiment.sprite[Batiment.name].decX,Batiment.sprite[Batiment.name].decY);
	});

	$(".end_menu_build").click(function(){
		User.isBuilding = false;
		User.isPlanting = false;
		User.isAttacking = false;
		User.isWatering = false;
		User.isFertilizing = false;
		User.isHarvesting = false;
		User.isDestroyCrop = false;
		ppmap.changeCursor('images/cursor-on.png','images/cursor-off.png',0,0);
		$(this).parent().toggle('fast');
	});

	$("#Sell").click(function(){
		var name = $("#nameFruits").text();
		var n = $("#nbFruits").text();
		var p = $("#prixFruits").text();
		var po = $("#poidsFruits").text();
		$("#instantSell").css('display','none');
		socket.emit('instantSellConfirm', {
			nom : name,
			nb : parseInt(n),
			prix : parseInt(p),
			poids : parseInt(po)
		});
	});

	$("#Stack").click(function(){
		var name = $("#nameFruits").text();
		var n = $("#nbFruits").text();
		var p = $("#prixFruits").text();
		var po = $("#poidsFruits").text();
		$("#instantSell").css('display','none');
		socket.emit('instantSellStack', {
			nom : name,
			nb : parseInt(n),
			prix : parseInt(p),
			poids : parseInt(po)
		});
	});

	sendError = function(error){
		$("#error").html(error);
		$("#error").fadeIn('slow');
		var t = setTimeout(function(){
			$("#error").fadeOut('slow');
		}, 3000);
	};

	sendValid = function(valid){
		$("#valid").html(valid);
		$("#valid").fadeIn('slow');
		var t = setTimeout(function(){
			$("#valid").fadeOut('slow');
		}, 3000);
	};

	$("#choosingStorage").click(function(){
		var val = $("#storageList").val();
		var value = val.split("_");
		var stock_id = value[0];
		var stock_type = value[1];
		var id = $("#instantSell").attr('class');
		var nb = parseInt($("#nbFruits").text());
		var name = $("#nameFruits").text();
		var poids = $("#poidsFruits").text();
		var time = $("#timeFruits").text();
		$("#chooseStorage").css('display', 'none');

		socket.emit('storeCrops', {
			stor_id : parseInt(stock_id),
			stor_type : parseInt(stock_type),
			fruit_id : parseInt(id),
			nb : parseInt(nb),
			name : name,
			poids : parseInt(poids),
			time : parseInt(time)
		});
	});

	//buildingprop
	$(".HideBuildingProps").click(function(){
		$("#buildingProps").css('display', 'none');
	});

	$(".RefreshBuildingProps").click(function(){
		var id = $("#BuildingPropTileId").attr('class');
		id = parseInt(id);
		socket.emit('showBuildingPropswithId', id);
	});

	$("#fruitsList").delegate(".drop_fruit", 'click', function(){
		var value = $(this).attr('id');
		var val = value.split("_");
		var fruit_id = val[1];
		var stockage_id = val[4];
		var poids = val[2];

		socket.emit('drop_fruit', {
			fruit_id : parseInt(fruit_id),
			stockage_id : parseInt(stockage_id),
			poids : parseInt(poids)
		});
	});	

	$("#fruitsList").delegate(".sell_fruit", 'click', function(){
		var value = $(this).attr('id');
		var val = value.split("_");
		var fruit_id = val[1];
		var stockage_id = val[4];
		var poids = val[2];
		var prix = val[3];

		socket.emit('sell_fruit', {
			fruit_id : parseInt(fruit_id),
			stockage_id : parseInt(stockage_id),
			poids : parseInt(poids),
			prix : parseInt(prix)
		});
	});

	$("#clearDeadFruits").click(function(){
		var value = $(this).attr('id');
		var val = value.split("_");
		var stockage_id = val[1];

		socket.emit('drop_all_dead_fruits', {
			stockage_id : stockage_id
		});
	});

	$("#hide_house_props").click(function(){
		$("#houseProps").css('display', 'none');
	});

	$("#fill_arrosoir").click(function(){
		socket.emit('fill_arrosoir', '');
	});

	checkTileIsNear = function(data){
		var testTile = false;
		$.each(User.own_tile, function(index, value){
			if(value.x == data.x-1 && value.y == data.y)
				testTile = true;
			else if(value.x == data.x+1 && value.y == data.y)
				testTile = true;
			else if(value.x == data.x && value.y == data.y-1)
				testTile = true;
			else if(value.x == data.x && value.y == data.y+1)
				testTile = true;
		});
		if(!testTile){
			$.each(tileSelect, function(index, value){
				if(value.x == data.x-1 && value.y == data.y)
					testTile = true;
				else if(value.x == data.x+1 && value.y == data.y)
					testTile = true;
				else if(value.x == data.x && value.y == data.y-1)
					testTile = true;
				else if (value.x == data.x && value.y == data.y+1)
					testTile = true;
			});
		}
		return testTile;
	};

})(jQuery);