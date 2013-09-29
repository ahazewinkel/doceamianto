window.onload = function() {
  
    var version = null,
		today = new Date(),
		lang = getUrlVars()['lang'];
		lang = ((lang != 'en')?'pt':'en');
	
	// Fix for cache
    if(gameContainer.env == 'dev') {
		version = today.getDay()+"_"+ today.getHours() +"_"+today.getSeconds();
	} else {
		version = gameContainer.gameVersion;
	};
    
    //start Crafty
    Crafty.init(800, 600);
    Crafty.canvas.init();
    
    require([
	    "src/assets.js?v="+version+"",
	    "src/config.js?v="+version+"",
	    "src/lang/lang-"+lang+".js",
	    "src/entities/base/BaseEntity.js"
    ], function() {
	
	// allow playing MP3 files
	Crafty.support.audio = true;
	
	assets = new Assets();
	
	gameContainer.setNextSceneInfo({ 
	  name: "level01",
	  elements: [
		  "src/components/TweenColor.js",
		  "src/entities/amianto01.js",
		  "src/entities/darkheart.js",
		  "src/entities/redheart.js"
		]
	});
	
	/*gameContainer.setNextSceneInfo({ 
	  name: "level02",
	  elements: [
		  // texts must come first
		  "text!src/scenes/tilemaps/level02.json", 
		  "src/entities/base/BaseEntity.js",
		  "src/components/TiledLevelImporter.js",
		  "src/components/camera.js",
		  "src/entities/amianto02.js",
		  "src/entities/diamond.js"
		],
	});*/
	
	gameContainer['conf'] = new Config({});
		
	// the loading screen - will be displayed while assets are loaded
	Crafty.scene("loading", function(obj) { // obj -> { backgroundColor: 'black', soundToPlay: 'sound', ellipsisColor: 'black' }
	    // clear scene and interface
	    sc = []; infc = [];   
		
		var ellipsisColor = '#000000';
		
		if (typeof obj !== 'undefined'){
			if(obj.backgroundColor)
				Crafty.background(obj.backgroundColor);
			if(obj.soundToPlay)
				Crafty.audio.play(obj.soundToPlay, -1);
			if(obj.ellipsisColor)
				ellipsisColor = obj.ellipsisColor;
		}
		
		// set sprites for next scene
		assets.createSprite(gameContainer.scene);
		// set sounds for next scene
		assets.createSound(gameContainer.scene);
		
	    sc['ellipsis'] = Crafty.e("2D, Canvas, Text");
		sc.ellipsis['nFrames'] = 25, // each nFrames, add a '. '
		sc.ellipsis['eFrames'] = 0; // elapsed frames since last '. ' added
		sc.ellipsis.attr({ x: ((Crafty.viewport.width/2)-39), y: 500, w: 78, h: 50,  z: 1000 })
			.textColor(ellipsisColor)
			.textFont({ weight: 'bold', family: 'Arial', size : '50px' })
			.text(". . . ")
			.bind('EnterFrame', function(){
				this.eFrames++;
				if(this.eFrames === this.nFrames) {
					this.eFrames = 0;
					if(this._text === ". . . ") {
						this.text("");
					} else {
						this.text(this._text + ". ");
					}
				}
			});
		
		// load takes an array of assets and a callback when complete
	    Crafty.load(assets.getPaths(gameContainer.scene), function() {
				// use eval for executing require(), also loading possible texts/maps
				
				var require_str = '', require_args = '', require_args_count = 0;
				// build require_args string, if there are text files to load
				_.each(gameContainer.elementsToLoad, function(ele){ 
					// search for texts, first things to load
					if( ele.lastIndexOf("text!") !== -1 ) {
						require_args_count++;
						if(require_args != '')
							require_args += ', ';
						require_args += 'arg' + require_args_count.toString();
					}
				});
				
				require_str = 
 				// require elements and execute callback
				'require(gameContainer.elementsToLoad, function(' + require_args + ') { ' +
				// if text files were loaded, add them to gameContainer.loadedStrings array
				'if (arguments.length) _.each(arguments, function(a) { gameContainer.loadedStrings.push(a); });' +
				// destroy ellipsis and run the specified scene
				'sc.ellipsis.destroy(); if (gameContainer.scene != undefined) { Crafty.scene(gameContainer.scene); } })';
				
				eval( '(' + require_str + ')' );
			},
			function(e) {
				//progress
			},
			function(e) {
				//error
			}
		);
	});
	    
	// declare all scenes
	var scenes = [
		"src/scenes/level01.js?v="+version+"",
		"src/scenes/level02.js?v="+version+"",
	];
	    
	require(scenes, function(){});

	//automatically play the loading scene
		Crafty.scene("loading");
    });
};