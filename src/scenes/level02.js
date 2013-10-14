	Crafty.scene("level02", function() {
	
	sc = [];
	
	Crafty.background("#000000");
	
	Crafty.audio.play("theme02", -1);
	
	//var MapBytesArray = stringOfByteArrayToArrayOfBytes(gameContainer.loadedStrings[0]);
	
	//LZMA.decompress(MapBytesArray, function(result) {
        //console.log("Decompressed.");
		var mapObj = JSON.parse(gameContainer.loadedStrings[0]);
		sc['player'] = new Amianto02(),
		sc['diamond'] = new Diamond(),
		sc['mapBuider'] = Crafty.e("TiledLevel"), // create an entity with the "TiledLevel" component.
		sc['tiledMap'] = sc.mapBuider.buildTiledLevel(mapObj, gameContainer.conf.get('renderType')),
		sc['camera'] = Crafty.e("Camera"),
		sc['delays'] = Crafty.e("Delay"),
		sc['delimiters'] = [],
		sc['checkpoints'] = [];
		
		sc.tiledMap.bind("TiledLevelLoaded", function() { // upon loading and creating the tilemap,
			
			// setting collision for tiles
			
			Crafty("upStairs").each(function() { 
				this.collision(new Crafty.polygon([[0,32],[32,0]]))
				    .addComponent("WiredHitBox");
			});
			Crafty("downStairs").each(function() { 
				this.collision(new Crafty.polygon([[0,0],[32,32]]))
				    .addComponent("WiredHitBox");
			});
			
			var playerEnt = sc.player.getEntity();
			
			Crafty.viewport.centerOn(playerEnt, 1);
			sc.camera.camera(playerEnt);
			
			console.log("finished loading and assembling tilemap");
			
			sc.delays.delay(function() {
				playerEnt.bind("AnimationEnd", function stand_up() {
					this.unbind("AnimationEnd", stand_up)
						.collision(this.poly)
						.gravity()
						.enableControl();
				})
				.playAnimation("AmiantoStandingUp", 13*8, 0);
			}, 3000);
			
		});

		//<delimiters>
		var delimitersMap = {
			left: 	{ x: 435, y: 1275, w: 2, h: 180, shape: [[0,0],[1,0],[1,180],[0,180]] }, 
			//right: 	{ x: 425, y: 1275, w: 2, h: 180, shape: [[1,0],[1,150]] }
		};
	
		_.each(delimitersMap, function(obj) {
			var delimiter = Crafty.e("2D, Collision, wall, WiredHitBox")
				.attr({x: obj.x, y: obj.y, w: obj.w, h: obj.h});
			sc.delimiters.push(delimiter);
		});
		//</delimiters>

		//<checkpoints>
		var checkPointsMap = {
			checkpoint1: { x: 3050, y: 1275, w: 2, h: 180, shape: [[0,0],[1,0],[1,180],[0,180]], value: 1 },
			checkpoint2: { x: 6100, y: 1275, w: 2, h: 180, shape: [[0,0],[1,0],[1,180],[0,180]], value: 2 },
			checkpoint3: { x: 9150, y: 1275, w: 2, h: 180, shape: [[0,0],[1,0],[1,180],[0,180]], value: 3 }
		};
	
		_.each(checkPointsMap, function(obj) {
			var checkpoint = Crafty.e("2D, Collision, checkpoint, WiredHitBox")
				.attr({x: obj.x, y: obj.y, w: obj.w, h: obj.h});
			checkpoint['value'] = obj.value;
			sc.checkpoints.push(checkpoint);
		});
		//</delimiters>

    /*}, function(percent) {
        /// Decompressing progress code goes here.
        console.log("Decompressing: " + (percent * 100) + "%");
    });*/
		
}, function(){ 
  
});