Crafty.scene("level04", function() {
	
	//Crafty.background("#000000");
	Crafty.background("#FCC6AC");
	
	Crafty.audio.play("theme04", -1);
	
	//gameContainer.conf.set({'renderType': 'DOM'});
	
	//var MapBytesArray = stringOfByteArrayToArrayOfBytes(gameContainer.loadedStrings[0]);
	
	//LZMA.decompress(MapBytesArray, function(result) {
        //console.log("Decompressed.");
	
	sc['player'] = new Carlos(),
	sc['mm'] = new MapsManager(),
	sc['delays'] = Crafty.e("Delay"),
	sc['bgs'] = { bg1: [], bg2: [], bg3: {} },
	sc['delimiters'] = [],
	sc['checkpoints'] = [],
	sc['figurants'] = [],
	sc['pmSpawners'] = [],
	sc['teleporters'] = [],
	sc['playerMock'] = {},
	sc['boss'] = {};
	
	var mapObj1 = JSON.parse(gameContainer.getSceneTexts()[0]), 
	    playerEnt = sc.player.getEntity(),
	    fig_dev_y = 30,
	    functions = {
	      
		backgroundSectionSize: 964,		// original background section images' width: 965px
		mapSectionSize: 1067.2,
		player: playerEnt,
		playerInitPos: sc.player.get("startingPoint"),
	  
		callPolicemen: function() {
			_.each(sc.pmSpawners, function(S) {
				S.spawn();
			});
		},
				
		setBackgrounds: function(arr) {
			var bgs = sc.bgs;
			    bg1 = "bg1", 
			    bg2 = "bg2", 
			    bg3 = "bg3", 
			    s = "-", 
			    l = "level04", 
			    ext = ".png", 
			    bgIndex = 0, 
			    imagesPath = Crafty.paths().images;

			for (var i = 0, len = arr.length; i<len; i++) {
			    if (arr[i].search(bg1) !== -1) {
				bgIndex = parseInt(arr[i].replace(bg1+s+l+s,"").replace(ext,""));
				bgs.bg1[bgIndex] = Crafty.e("Background").attr({ x: bgIndex * this.backgroundSectionSize, z: playerEnt._z - 2 }).image(imagesPath+arr[i]);
				bgs.bg1[bgIndex].placement = bgIndex;
			    } else if (arr[i].search(bg2) !== -1) {
				bgIndex = parseInt(arr[i].replace(bg2+s+l+s,"").replace(ext,""));
				bgs.bg2[bgIndex] = Crafty.e("Background").attr({ x: bgIndex * this.backgroundSectionSize, z: playerEnt._z - 3 }).image(imagesPath+arr[i]);
				bgs.bg2[bgIndex].placement = bgIndex;
			    } else if (arr[i].search(bg3) !== -1) {
				bgs.bg3 = Crafty.e("Background").attr({ x: 0, z: playerEnt._z - 4 , w: this.mapSectionSize * 20, h: 2464,  visible: true }).image(imagesPath+arr[i], "repeat");
			    }
			}
			return this;
		},
		
		startParallax: function() {
			var bg1 = sc.bgs.bg1,
			    bg2 = sc.bgs.bg2,
			    that = this,
			    i,
			    p = 20,
			    bgMoveRate = 15,
			    bgI, shown, XD, YD, rightMargin, leftMargin;
			Crafty.bind("PlayerMoved", function (prevPos) {
				bgI = Math.floor(that.player._x / that.mapSectionSize),
				rightMargin = bgI > 14 ? 2 : 1,
				leftMargin = bgI > 17 ? 2 : 1;
				for (i = 0; i < p; i++) {
					shown = bg1[i].placement >= bgI - leftMargin && bg1[i].placement <= bgI + rightMargin;
					if (shown && !bg1[i]._visible) {
						bg1[i].visible = true,
						bg2[i].visible = true;
					} else if (!shown && bg1[i]._visible) {
						bg1[i].visible = false,
						bg2[i].visible = false;
					}
					if (prevPos._x !== that.player._x) {
						XD = (that.player._x - that.playerInitPos.x) / bgMoveRate;
						bg1[i].x = XD + (that.backgroundSectionSize * bg1[i].placement);
						bg2[i].x = (XD / 0.5) + (that.backgroundSectionSize * bg2[i].placement);
					} else {
						YD = (that.player._y - that.playerInitPos.y) / bgMoveRate;
						bg1[i].y = YD;
						bg2[i].y = YD / 0.5;
					}
				}
			});
			return this;
		}
	  
	};
	
	sc.mm.prepTileset(mapObj1.tilesets[0])
	    .addMap()
	    .one("TiledLevelLoaded", function(o) {
		functions.setBackgrounds(resources.get("level04").images).startParallax();
		
		Crafty.viewport.clampToEntities = false,
		Crafty.viewport.follow(playerEnt, 0, 0),
		
		_.each(this._layerArray[0].tiles, function(t){ t.z = playerEnt._z - 1 }),
		_.each(this._layerArray[1].tiles, function(t){ t.z = playerEnt._z - 1 }),
		_.each(this._layerArray[2].tiles, function(t){ t.z = playerEnt._z + 2 }),
		
		Crafty("upStairs").each(function() {
			this.collision(new Crafty.polygon([[0,31],[31,0]]));
		}),
		Crafty("downStairs").each(function() {
			this.collision(new Crafty.polygon([[0,0],[31,31]]));
		}),
		Crafty("leftWall").each(function() {
			if(this.__c.top)
				this.collision(new Crafty.polygon([[24,4],[24,31]]));
			else
				this.collision(new Crafty.polygon([[24,0],[24,31]]));
		      
		}),
		Crafty("rightWall").each(function() {
			if(this.__c.top)
				this.collision(new Crafty.polygon([[8,4],[8,31]]));
			else
				this.collision(new Crafty.polygon([[8,0],[8,31]]));
		}),
		Crafty("grnd mud").each(function() {
			this.collision(new Crafty.polygon([[0,8],[31,8]]))
			    .z = playerEnt._z + 1;
		}),
		playerEnt.gravity();
	    })
	    .buildTiledLevel(mapObj1, gameContainer.conf.get('renderType'), false);
	
	sc.delimiters = [
		Crafty.e("Delimiter, wall").attr({ x: 388, y: 256, w: 1, h: 320 }), 
		Crafty.e("Delimiter, wall").attr({ x: 20950, y: 1792, w: 1, h: 320 }),
		Crafty.e("Delimiter, bossArea").attr({ x: 18496, y: 1792, w: 1, h: 320 })
	];
	
	sc.checkpoints = [
		Crafty.e("Delimiter, checkpoint").attr({ x: 832, y: 352, h: 224, w: 1 }).identifier = 1,
		Crafty.e("Delimiter, checkpoint").attr({ x: 8960, y: 992, h: 224, w: 1 }).identifier = 2,
		Crafty.e("Delimiter, checkpoint").attr({ x: 13120, y: 896, h: 224, w: 1 }).identifier = 3
	];
	
	sc.teleporters = [
		Crafty.e("Delimiter, teleporter").attr({ x: 10240, y: 2144, h: 1, w: 192 }),
		Crafty.e("Delimiter, teleporter").attr({ x: 11776, y: 2048, h: 1, w: 640 })
	];
	
	sc.figurants = [
		Crafty.e("Figurant").setFace(0).attr({ x: 832, y: 448+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h }).wanderLoop(),
		Crafty.e("Figurant").setFace(1).attr({ x: 4512, y: 576+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h }).wanderLoop(),
		Crafty.e("Figurant").setFace(2).attr({ x: 8864, y: 1088+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h }).wanderLoop(),
		Crafty.e("Figurant").setFace(3).attr({ x: 10944, y: 1472+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h }).wanderLoop(),
		Crafty.e("Figurant").setFace(4).attr({ x: 12064, y: 1184+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h }).wanderLoop(),
		Crafty.e("Figurant").setFace(5).attr({ x: 15328, y: 1248+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h }).wanderLoop()
	];
	
	sc.pmSpawners = [ 
		Crafty.e("PoliceSpawner").attr({ x: 1824, y: 448+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h, w: playerEnt._w }).setTarget(playerEnt), 
		Crafty.e("PoliceSpawner").attr({ x: 7392, y: 1088+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h, w: playerEnt._w }).setTarget(playerEnt),
		Crafty.e("PoliceSpawner").attr({ x: 11168, y: 1472+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h, w: playerEnt._w }).setTarget(playerEnt), 
		Crafty.e("PoliceSpawner").attr({ x: 15488, y: 1248+fig_dev_y, z: playerEnt._z - 1, h: playerEnt._h, w: playerEnt._w }).setTarget(playerEnt)
	];
	
	this.one("PlayerShoot", function() {
		this.trigger("Alert", 1);
	});
	
	this.one("FigurantDied", function() {
		this.trigger("Alert", 2);    
		// call policemen now and each 20 seconds
		functions.callPolicemen();
		sc.delays.delay(functions.callPolicemen, 20000, -1);
	});
	
	this.one("BossFight", function(){
		sc.boss = Crafty.e("BadassPhantom").attr({ x: 19712, y: 1824, z: playerEnt._z });
		
		sc.playerMock = Crafty.e("CarlosMock")
		      .attr({ x: playerEnt._x, y: playerEnt._y, z: playerEnt._z, h: playerEnt._h, w: playerEnt._w });

		playerEnt.disableControl()
		    .alpha = 0;
		
		Crafty.viewport.pan(1200,0,3500);
		if(sc.playerMock._falling)
			sc.playerMock.animate("JumpingFalling");
		
		sc.boss.shaping();
		sc.playerMock
		    .tween({ x: 19426 }, 5000)
		    .one("TweenEnd", function() {
			    this.destroy();
			    playerEnt.alpha = 1;
			    sc.delimiters[2].addComponent("wall");
		    });
		playerEnt.tween({ x: 19426 }, 5000);
		sc.delays.cancelDelay(functions.callPolicemen);
		Crafty("Figurant").each(function(){ this.destroy(); });
	});

	this.one("BadassPhantomFinishedTransforming", function(){
		Crafty.viewport.follow(playerEnt, 0, 0);
		playerEnt.enableControl();
	});

}, function(){ 
	//get rid of unwanted bindings, functions and files
	Crafty.viewport.x = 0,
	Crafty.viewport.y = 0;
	resources.removeAssets("level04");
});