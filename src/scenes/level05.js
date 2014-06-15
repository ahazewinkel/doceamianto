Crafty.scene("level05",function(){

		
	Crafty.background("#16377A");
	
	//Crafty.audio.play("theme04", -1);
	
	//gameContainer.conf.set({'renderType': 'DOM'});
	
	//var MapBytesArray = stringOfByteArrayToArrayOfBytes(gameContainer.loadedStrings[0]);
	
	//LZMA.decompress(MapBytesArray, function(result) {
        //console.log("Decompressed.");
	var particlesOptions = {
	    maxParticles: 200,
	    size: 5,
	    sizeRandom: 4,
	    speed: .1,
	    speedRandom: .3,
	    lifeSpan: 70,
	    lifeSpanRandom: 10,
	    angle: 225,
	    angleRandom: 35,
	    startColour: [0, 204, 255, 1],
	    startColourRandom: [60, 60, 60, 0],
	    endColour: [0, 255, 255, 0],
	    endColourRandom: [60, 60, 60, 0],
	    sharpness: 20,
	    sharpnessRandom: 10,
	    spread: Crafty.viewport.width,
	    duration: -1,
	    fastMode: false,
	    gravity: { x: -0.05, y: 0.1 },
	    jitter: 3
	};
	
	sc.player = new Amianto05(),
	sc.mm = new MapsManager(),
	sc.delays = Crafty.e("Delay"),
	sc.delimiters = [],
	sc.checkpoints = [],
	sc.teleporters = [],
	sc.floorSet = Crafty.e("FloorSet"),
	sc.particles = Crafty.e("2D, Canvas, Particles").particles(particlesOptions).bind("EnterFrame",function(){ this.attr({ x: Crafty.viewport._x * -1, y: Crafty.viewport._y * -1 }); });
	
	var mapObj = JSON.parse(gameContainer.getSceneTexts()[0]), 
	    playerEnt = sc.player.getEntity();

	sc.mm.prepTileset(mapObj.tilesets[0])
	    .addMap()
	    .one("TiledLevelLoaded", function(o) {
		Crafty.viewport.clampToEntities = false,
		Crafty.viewport.follow(playerEnt, 0, 0);
		
		Crafty("shine").each(function(){ this.addComponent("Shine"); this.z = playerEnt._z + 1; });
		
		sc.floorSet.setFloorsSeries(mapObj.layers[4].objects[0], o, mapObj.tilewidth)
		    .revealNextFloor();
		
		
		// code for setting tiles properties
		/*var i = 0,
		    polylineObj = mapObj.layers[4].objects[0],
		    pl = polylineObj.polyline.length,
		    pX = polylineObj.x,
		    pY = polylineObj.y,
		    layer = 2, 
		    tX, tY;
		for (; i < pl; i++) {
			tX = Math.floor((pX + polylineObj.polyline[i].x)/mapObj.tilewidth),
			tY = Math.floor((pY + polylineObj.polyline[i].y)/mapObj.tileheight);

			var t = o.getTile(tY,tX,layer);
			if (t && t.__c.dance_floor) {
				if(i){
				  
				}
				sc.floorSet
				    .setPolylineObj(polylineObj)
				    .setTiledObj(o)
				    .addTile(t, tX, tY, layer);
				console.log("is DanceFloor",t);
			}else{
			  	console.log("not DanceFloor",t);
			}
			if(layer == 0)
				layer = 2;
			else
				layer--;
		}*/
		/*Crafty("DanceFloor").each(function(){ 
			var floorsIndex = polyline;
			//this.setIndex(i); 
		  
		});*/
		
		playerEnt.gravity();
	    })
	    .buildTiledLevel(mapObj, gameContainer.conf.get('renderType'), false);
	
});