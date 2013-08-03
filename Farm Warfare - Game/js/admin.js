(function($){

	var socket = io.connect('http://localhost:1337');

	// incoming
	$("#button_admin").click(function(){
		$("#div_play").fadeOut('fast');
		$("#div_menu").fadeOut('fast');
		$("#div_begin").fadeOut('fast');
		$("#overlay").fadeOut('fast');

		$("#div_admin").fadeIn('fast');
		$(".menu_admin").fadeIn('fast');
		$(".menu_user").fadeOut('fast');
		$(".menu_content").fadeOut('fast');
		$(".pre_menu").fadeIn('slow');
		$(".menu_general").fadeIn('slow');

		$(".display_admin").fadeIn('fast');
		$(".display_admin .user").fadeOut('fast');
		$(".display_admin .contenu").fadeOut('fast');
		$(".display_admin .general").css('display', 'block');
		$(".display_admin .general div").css('display', 'none');
		$(".display_admin .general .Userlist").slideDown('slow');

		$(".pre_menu div").removeClass('pre_menu_current');
		$(".bouton_general").addClass("pre_menu_current");
		$(".menu_general div").removeClass('sub_menu_current');
		$(".menu_general .ListUser").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Users'
		});
		//console.log(users);
	});

	//go out
	$("#admin_back").click(function(){
		$("#div_admin").fadeOut('fast');

		$("#div_play").fadeIn('slow');
		$("#div_menu").fadeIn('slow');
		$("#div_begin").fadeIn('slow');
		$("#overlay").fadeIn('slow');
	});

	//pre menu action
	$(".bouton_general").click(function(){

		$(".menu_admin").fadeIn('fast');
		$(".menu_user").fadeOut('fast');
		$(".menu_content").fadeOut('fast');
		$(".pre_menu").fadeIn('slow');
		$(".menu_general").fadeIn('slow');

		$(".display_admin").fadeIn('fast');
		$(".display_admin .user").fadeOut('fast');
		$(".display_admin .contenu").fadeOut('fast');
		$(".display_admin .general").css('display', 'block');
		$(".display_admin .general div").css('display', 'none');
		$(".display_admin .general .Userlist").slideDown('slow');

		$(".bouton_user").removeClass('pre_menu_current');
		$(".bouton_content").removeClass('pre_menu_current');
		$(".bouton_general").addClass("pre_menu_current");
		$(".menu_general div").removeClass('sub_menu_current');
		$(".menu_general .ListUser").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Users'
		});
	});

	$(".bouton_user").click(function(){

		$(".menu_admin").fadeIn('fast');
		$(".menu_general").fadeOut('fast');
		$(".menu_content").fadeOut('fast');
		$(".pre_menu").fadeIn('slow');
		$(".menu_user").fadeIn('slow');

		$(".display_admin").fadeIn('fast');
		$(".display_admin .general").fadeOut('fast');
		$(".display_admin .contenu").fadeOut('fast');
		$(".display_admin .user").css('display', 'block');
		$(".display_admin .user div").css('display', 'none');
		$(".display_admin .user .Alliances").slideDown('slow');

		$(".bouton_user").addClass('pre_menu_current');
		$(".bouton_content").removeClass('pre_menu_current');
		$(".bouton_general").removeClass("pre_menu_current");
		$(".menu_user div").removeClass('sub_menu_current');
		$(".menu_user .AlliancesList").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Alliances'
		});
	});

	$(".bouton_content").click(function(){

		$(".menu_admin").fadeIn('fast');
		$(".menu_general").fadeOut('fast');
		$(".menu_user").fadeOut('fast');
		$(".pre_menu").fadeIn('slow');
		$(".menu_content").fadeIn('slow');

		$(".display_admin").fadeIn('fast');
		$(".display_admin .general").fadeOut('fast');
		$(".display_admin .user").fadeOut('fast');
		$(".display_admin .contenu").css('display', 'block');
		$(".display_admin .contenu div").css('display', 'none');
		$(".display_admin .contenu .ArmesSpec").slideDown('slow');

		$(".bouton_user").removeClass('pre_menu_current');
		$(".bouton_content").addClass('pre_menu_current');
		$(".bouton_general").removeClass("pre_menu_current");
		$(".menu_content div").removeClass('sub_menu_current');
		$(".menu_content .ArmeList").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Armes_spec'
		});
	});

	//General menu action
	$(".menu_general .Userlist").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .Userlist").slideDown('slow');
		$(".menu_general .Userlist").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Users'
		});
	});
	$(".menu_general .UserSpecM").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .UserSpec").slideDown('slow');
		$(".menu_general .UserSpecM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Users_level_spec'
		});
	});
	$(".menu_general .TilesM").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .Tiles").slideDown('slow');
		$(".menu_general .TilesM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Tiles'
		});
	});
	$(".menu_general .PluieM").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .Pluie").slideDown('slow');
		$(".menu_general .PluieM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Pluie'
		});
	});
	$(".menu_general .TornadeM").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .Tornade").slideDown('slow');
		$(".menu_general .TornadeM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Tornade'
		});
	});
	$(".menu_general .SauterelleM").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .Sauterelle").slideDown('slow');
		$(".menu_general .SauterelleM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Sauterelles'
		});
	});
	$(".menu_general .MeteorM").click(function(){
		$(".display_admin .general div").css('display', 'none');
		$(".menu_general div").removeClass('sub_menu_current');
		$(".display_admin .general .Meteor").slideDown('slow');
		$(".menu_general .MeteorM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Meteor'
		});
	});

	//User Content Actions
	$(".menu_user .AlliancesList").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .Alliances").slideDown('slow');
		$(".menu_user .AlliancesList").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Alliances'
		});
	});
	$(".menu_user .ArmesUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .ArmesUser").slideDown('slow');
		$(".menu_user .ArmesUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Armes'
		});
	});
	$(".menu_user .ArrosoirsUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .ArrosoirsUser").slideDown('slow');
		$(".menu_user .ArrosoirsUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Arrosoirs'
		});
	});
	$(".menu_user .EnergiesUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .EnergiesUser").slideDown('slow');
		$(".menu_user .EnergiesUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Energies'
		});
	});
	$(".menu_user .FruitsUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .FruitsUser").slideDown('slow');
		$(".menu_user .FruitsUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Fruits'
		});
	});
	$(".menu_user .GrainesUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .GrainesUser").slideDown('slow');
		$(".menu_user .GrainesUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Graines'
		});
	});
	$(".menu_user .MaisonsUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .MaisonsUser").slideDown('slow');
		$(".menu_user .MaisonsUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Maisons'
		});
	});
	$(".menu_user .PlantesUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .PlantesUser").slideDown('slow');
		$(".menu_user .PlantesUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Plantes'
		});
	});
	$(".menu_user .StockagesUserM").click(function(){
		$(".display_admin .user div").css('display', 'none');
		$(".menu_user div").removeClass('sub_menu_current');
		$(".display_admin .user .StockagesUser").slideDown('slow');
		$(".menu_user .StockagesUserM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Stockages'
		});
	});

	//Content Actions
	$(".menu_content .ArmeList").click(function(){
		$(".display_admin .contenu div").css('display', 'none');
		$(".menu_content div").removeClass('sub_menu_current');
		$(".display_admin .contenu .ArmesSpec").slideDown('slow');
		$(".menu_content .ArmeList").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Armes_spec'
		});
	});
	$(".menu_content .ArrosoirsSpecM").click(function(){
		$(".display_admin .contenu div").css('display', 'none');
		$(".menu_content div").removeClass('sub_menu_current');
		$(".display_admin .contenu .ArrosoirsSpec").slideDown('slow');
		$(".menu_content .ArrosoirsSpecM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Arrosoirs_spec'
		});
	});
	$(".menu_content .EnergiesSpecM").click(function(){
		$(".display_admin .contenu div").css('display', 'none');
		$(".menu_content div").removeClass('sub_menu_current');
		$(".display_admin .contenu .EnergiesSpec").slideDown('slow');
		$(".menu_content .EnergiesSpecM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Energies_spec'
		});
	});
	$(".menu_content .FruitSpecM").click(function(){
		$(".display_admin .contenu div").css('display', 'none');
		$(".menu_content div").removeClass('sub_menu_current');
		$(".display_admin .contenu .FruitSpec").slideDown('slow');
		$(".menu_content .FruitSpecM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Fruits_spec'
		});
	});
	$(".menu_content .GrainesSpecM").click(function(){
		$(".display_admin .contenu div").css('display', 'none');
		$(".menu_content div").removeClass('sub_menu_current');
		$(".display_admin .contenu .GrainesSpec").slideDown('slow');
		$(".menu_content .GrainesSpecM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Graines_spec'
		});
	});
	$(".menu_content .StockagesSpecM").click(function(){
		$(".display_admin .contenu div").css('display', 'none');
		$(".menu_content div").removeClass('sub_menu_current');
		$(".display_admin .contenu .StockagesSpec").slideDown('slow');
		$(".menu_content .StockagesSpecM").addClass('sub_menu_current');

		socket.emit('selectDB', {
			table : 'Stockages_spec'
		});
	});

	$("body").on({
		click:function(){
		    var data = $(this).parent().parent().attr('id');
		    var Id = data.split('-')[1];
		    var Table = data.split('-')[0];
		   	socket.emit('DeleteDB', {
				table : Table,
				id : Id
			});
	    }
	}, ".delete");

	$("body").on({
		click:function(){
			$(this).parent().append('<button class="update">OK</button>');
		    $(this).replaceWith($('<input type=text>').attr({ value: $(this).text(), id: $(this).attr('id') }));
	    }
	}, "span");

	$("body").on({
		click:function(){
			$parent = $(this).parent();
			$val = $parent.children('input').val();
			$id = $parent.children('input').attr('id');

			var data = $id;
		    var Table = data.split('-')[0];
		    var Column = data.split('-')[1];
		    var Id = data.split('-')[2];
		   	socket.emit('UpdateDB', {
				table : Table,
				column : Column,
				id : Id,
				val : $val
			});

			$parent.children('input').replaceWith($('<span>').attr({ id: $id }));
			$(this).remove();
	    }
	}, ".update");
	//réception des bonnes tables
	socket.on('returnDB', function(data){
		var str = '';
		if(data[0] == "Users"){
			str = '<tr><th>Id</th><th>Pseudo</th><th>email</th><th>Password</th><th>Status</th><th>Ip</th><th>Nb Fertilisants</th><th>Energies</th><th>Energies Max</th><th>Niveau</th><th>Alliance Id</th><th>Argent</th><th>Experience</th><th>Action</th></tr>';
			$('#Users').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-pseudo-'+id+'">'+data[1][i]['pseudo']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-mail-'+id+'">'+data[1][i]['mail']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-password-'+id+'">'+data[1][i]['password']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-status-'+id+'">'+data[1][i]['status']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-ip-'+id+'">'+data[1][i]['ip']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-nb_fertilisants-'+id+'">'+data[1][i]['nb_fertilisants']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-energies-'+id+'">'+data[1][i]['energies']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-energies_max-'+id+'">'+data[1][i]['energies_max']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-niveau-'+id+'">'+data[1][i]['niveau']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-alliance_id-'+id+'">'+data[1][i]['alliance_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-argent-'+id+'">'+data[1][i]['argent']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-experience-'+id+'">'+data[1][i]['experience']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Users').append(str);
		}
		else if(data[0] == "Users_level_spec"){
			str = '<tr><th>Id</th><th>Tile next level</th><th>Conquete timer</th><th>Wait conquete timer</th><th>Resistance</th><th>Victory Timer</th><th>Win regen</th><th>Lose Regen</th><th>Action</th></tr>';
			$('#Users_level_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['tile_next_level']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['conquete_timer']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['wait_conquetes_timer']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['resistance']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['victory_timer']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['win_regen']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['lose_regen']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Users_level_spec').append(str);
		}
		else if(data[0] == "Tiles"){
			str = '<tr><th>Id</th><th>Coord X</th><th>Coord Y</th><th>Sprite ID</th><th>Empty</th><th>Humidite</th><th>Fertilite</th><th>Visible</th><th>User ID</th><th>Action</th></tr>';
			$('#Tiles').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['x']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['y']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['sprite_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isEmpty']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['humidite']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['fertilite']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isVisible']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Tiles').append(str);
		}
		else if(data[0] == "Pluie"){
			str = '<tr><th>Id</th><th>Active</th><th>Origin Tile ID</th><th>Longueur</th><th>Largeur</th><th>duree</th><th>Coord X</th><th>Coord Y</th><th>Action</th></tr>';
			$('#Pluie').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isActive']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['origin_tile_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['longueur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['largeur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['duree']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['x']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['y']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Pluie').append(str);
		}
		else if(data[0] == "Tornade"){
			str = '<tr><th>Id</th><th>Active</th><th>Origin Tile ID</th><th>Vector X</th><th>Vector Y</th><th>Longueur</th><th>Largeur</th><th>duree</th><th>Coord X</th><th>Coord Y</th><th>Action</th></tr>';
			$('#Tornade').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isActive']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['origin_tile_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['vectorX']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['vectorY']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['longueur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['largeur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['duree']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['x']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['y']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Tornade').append(str);
		}
		else if(data[0] == "Sauterelles"){
			str = '<tr><th>Id</th><th>Active</th><th>Origin Tile ID</th><th>Vector X</th><th>Vector Y</th><th>Longueur</th><th>Largeur</th><th>duree</th><th>Coord X</th><th>Coord Y</th><th>Action</th></tr>';
			$('#Sauterelles').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isActive']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['origin_tile_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['vectorX']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['vectorY']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['longueur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['largeur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['duree']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['x']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['y']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Sauterelles').append(str);
		}
		else if(data[0] == "Meteor"){
			str = '<tr><th>Id</th><th>Active</th><th>Origin Tile ID</th><th>Longueur</th><th>Largeur</th><th>duree</th><th>Coord X</th><th>Coord Y</th><th>Action</th></tr>';
			$('#Meteor').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isActive']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['origin_tile_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['longueur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['largeur']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['duree']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['x']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['y']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Meteor').append(str);
		}
		else if(data[0] == "Alliances"){
			str = '<tr><th>Id</th><th>Name</th><th>Master User ID</th><th>Action</th></tr>';
			$('#Alliances').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['master_user_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Alliances').append(str);
		}
		else if(data[0] == "Armes"){
			str = '<tr><th>Id</th><th>User ID</th><th>Armes Spec ID</th><th>Action</th></tr>';
			$('#Armes').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['armes_spec_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Armes').append(str);
		}
		else if(data[0] == "Arrosoirs"){
			str = '<tr><th>Id</th><th>User ID</th><th>Arrosoirs Spec ID</th><th>Action</th></tr>';
			$('#Arrosoirs').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['arrosoirs_spec_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Arrosoirs').append(str);
		}
		else if(data[0] == "Energies"){
			str = '<tr><th>Id</th><th>Is Construct</th><th>User ID</th><th>Energies Spec ID</th><th>Tile ID</th><th>Action</th></tr>';
			$('#Energies').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isConstruct']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['energies_spec_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['tile_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Energies').append(str);
		}
		else if(data[0] == "Fruits"){
			str = '<tr><th>Id</th><th>Number</th><th>User ID</th><th>Fruits Spec ID</th><th>Action</th></tr>';
			$('#Fruits').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['nb']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['fruits_spec_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Fruits').append(str);
		}
		else if(data[0] == "Graines"){
			str = '<tr><th>Id</th><th>Number</th><th>User ID</th><th>Graines Spec ID</th><th>Action</th></tr>';
			$('#Graines').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['nb']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['graines_spec_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Graines').append(str);
		}
		else if(data[0] == "Maisons"){
			str = '<tr><th>Id</th><th>Tile ID</th><th>User ID</th><th>Action</th></tr>';
			$('#Maisons').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['tile_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Maisons').append(str);
		}
		else if(data[0] == "Plantes"){
			str = '<tr><th>Id</th><th>Croissance</th><th>Health</th><th>User ID</th><th>Graines Spec ID</th><th>Tile ID</th><th>Action</th></tr>';
			$('#Plantes').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['croissance']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['health']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['graines_spec_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['tile_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Plantes').append(str);
		}
		else if(data[0] == "Stockages"){
			str = '<tr><th>Id</th><th>Stockage State</th><th>Is Construct</th><th>User ID</th><th>Stockages Spec ID</th><th>Tile ID</th><th>Action</th></tr>';
			$('#Stockages').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['stockage_state']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['isConstruct']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['user_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['stockages_spec_id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['tile_id']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Stockages').append(str);
		}
		else if(data[0] == "Armes_spec"){
			str = '<tr><th>Id</th><th>Name</th><th>Puissance</th><th>Precision</th><th>Vitesse</th><th>Prix</th><th>Action</th></tr>';
			$('#Armes_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['puissance']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['precision']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['vitesse']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['prix']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Armes_spec').append(str);
		}
		else if(data[0] == "Arrosoirs_spec"){
			str = '<tr><th>Id</th><th>Name</th><th>Prix</th><th>Stockage</th><th>Action</th></tr>';
			$('#Arrosoirs_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['prix']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['stockage']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Arrosoirs_spec').append(str);
		}
		else if(data[0] == "Energies_spec"){
			str = '<tr><th>Id</th><th>Name</th><th>Prix</th><th>Construction Time</th><th>Production</th><th>Niveau</th><th>Action</th></tr>';
			$('#Energies_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['prix']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['constructionTime']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['production']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['niveau_requis']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Energies_spec').append(str);
		}
		else if(data[0] == "Fruits_spec"){
			str = '<tr><th>Id</th><th>Name</th><th>Prix Vente</th><th>Stockage</th><th>Poids</th><th>Action</th></tr>';
			$('#Fruits_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['prix_vente']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['stockage']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['poids']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Fruits_spec').append(str);
		}
		else if(data[0] == "Graines_spec"){
			str = '<tr><th>Id</th><th>Name</th><th>Maturation</th><th>Pourrissement</th><th>Production</th><th>Stockage</th><th>Croissance</th><th>Poids</th><th>Pirx</th><th>Sante Minimum</th><th>Niveau Requis</th><th>Action</th></tr>';
			$('#Graines_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['maturation']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['pourrissement']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['production']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['stockage']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['croissance']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['poids']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['prix']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['sante_min']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['niveau_requis']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Graines_spec').append(str);
		}
		else if(data[0] == "Stockages_spec"){
			str = '<tr><th>Id</th><th>Name</th><th>Taille</th><th>Prix</th><th>Stockage</th><th>Consommation</th><th>Construction Time</th><th>Niveau requis</th><th>Action</th></tr>';
			$('#Stockages_spec').text('');
			if(data[1] != 'empty'){
				for(var i = 0; i < data[1].length; i++){
					var id = data[1][i]['id'];
					str = str+'<tr id="'+data[0]+'-'+id+'">';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['id']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['name']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['taille']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['prix']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['stockage']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['consommation']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['constructionTime']+'</span></td>';
					str = str+'<td><span id="'+data[0]+'-id-'+id+'">'+data[1][i]['niveau_requis']+'</span></td>';
					str = str+'<td><button class="delete">DELETE</button></td>';
					str = str+'</tr>';
				}
			}
			$('#Stockages_spec').append(str);
		}
	});

	

})(jQuery);