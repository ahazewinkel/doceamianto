gameContainer = {
	env : 'pro',
	gameVersion : '1.0.1',
	conf: {},
	lang: '',
	scene : {},
	scenes : [],
	alreadyLoadedElements : [],
	loadedStrings : {},
	
	setSceneInfo : function(scnInfo) {
		this.scenes[scnInfo.name] = scnInfo.elements;
		return this;
	},
	runScene: function(scn, options) {
		this.scene = scn;
		Crafty.scene("loading", options);
	},
	getSceneElements: function(scn) {
		return this.scenes[this.$scn(scn)];
	},
	setSceneTexts: function(texts,scn) {
		this.loadedStrings[this.$scn(scn)] = texts;
		return this;
	},
	getSceneTexts: function(scn) {
		return this.loadedStrings[this.$scn(scn)];
	},
	removeSceneTexts: function(scn) {
		var alreadyLdd = this.alreadyLoadedElements,
		    scnElements = this.getSceneElements(scn);
		for(var ele in scnElements){
			if(ele.indexOf("text!") === -1){
				continue;
			} else {
				this.alreadyLoadedElements.splice(alreadyLdd.indexOf(ele),1);
				delete this.loadedStrings[this.$scn(scn)];
			}
		}
		return this;
	},
	$scn: function(scn) {
		return _.isUndefined(scn)?this.scene:scn;
	}
},
sc    = {}, // container for scene elements
infc  = {}, // container for interface elements
resources = {}, // container for scenes' resources
utils = {};
window.onload = function() {
	var version = null,
	    today = new Date();
	// Fix for cache
	if(gameContainer.env == 'dev') {
		version = today.getDay()+"_"+ today.getHours() +"_"+today.getSeconds();
	} else {
		version = gameContainer.gameVersion;
	};
	require.config({ waitSeconds: 60 });
	require([
	    "src/resources.js?v="+version,
	    "src/config.js?v="+version,
	    "src/utils.js?v="+version,
	    "src/entities/base/BaseEntity.js?v="+version,
	    "src/components/ProgressBar.js?v="+version,
	    "src/components/CustomControls.js?v="+version,
	    // Crafty parts to be overridden
	    "src/override/HashMap.js?v="+version,
	    "src/override/DebugLayer.js?v="+version,
	    "src/override/controls.js?v="+version,
	    "src/override/time.js?v="+version,
	    "src/override/scene.js?v="+version,
	    "src/override/loader.js?v="+version,
	    "src/override/sound.js?v="+version,
	    "src/override/sprite-animation.js?v="+version,
	    "src/override/viewport.js?v="+version
	], function() {
		// Continue overriding...
		require([
		    "src/override/2D.js?v="+version,
		    "src/override/collision.js?v="+version,
		    "src/override/Twoway.js?v="+version,
		    "src/override/Gravity.js?v="+version
		],function(){
		
			// initializing
			gameContainer.conf = new Config({
				screenRes: { w: window.screen.availWidth, h: window.screen.availHeight }
			}),
			resources  = new Resources(),
			utils = new Utils();
			
			var res = gameContainer.conf.get('maxRes');
			if (Crafty.mobile) {
				var max = gameContainer.conf.get('maxRes');
				res = gameContainer.conf.get('screenRes');
				if (res.h > res.w)
					// invert screen resolution values
					res = { w: res.h, h: res.w };
				if (res.h > max.h)
					res.h = max.h;
				if (res.w > max.w)
					res.w = max.w;
			}
		      
			Crafty.init(res.w, res.h);
			Crafty.canvas.init();
			
			document.getElementsByTagName("canvas")[0].id = "mainCanvas";
			Crafty.support.audio = true;
			//gameContainer.conf.set({ 'renderType': (Crafty.support.webgl? "WebGL" : "Canvas") });
			gameContainer.lang = utils.getLang();
			
			Crafty.paths({ audio: resources.get("audioFolder"), images: resources.get("imagesFolder") });
			
			// stuff for mobile
			if(Crafty.mobile){
				var warning = gameContainer.lang == "pt"? 
				  "Este jogo foi feito para o modo paisagem." : "This game was made for landscape mode.";
				document.getElementById("warning").innerHTML = warning;
				
				Crafty.load(resources.get("interfc_keys"), function(){
					if(Crafty.viewport.height < gameContainer.conf.get('maxRes').h)
						Crafty.e('2D, ' + gameContainer.conf.get('renderType') + 
						    ', Touch, Persist, FULL_SCREEN_button, FULL_SCREEN_up_sprite, interface_button')
						    .bind('EnterFrame', function(){
							this.attr({
							  x: Crafty.viewport.x * -1,
							  y: Crafty.viewport.y * -1,
							  z: 2000
							});
						    })
						    .bind('TouchStart', function(){
							this.trigger("ToogleFullscreen");
						    })
						    .bind('ToogleFullscreen', function(){
							utils.toggleFullScreen('cr-stage');
							var rc, ac;
							if(this.__c.FULL_SCREEN_up_sprite)
								rc = "FULL_SCREEN_up_sprite",
								ac = "FULL_SCREEN_down_sprite";
							else
								rc = "FULL_SCREEN_down_sprite",
								ac = "FULL_SCREEN_up_sprite";
							this.removeComponent(rc)
							    .addComponent(ac);
						    });
				    });
				Crafty.multitouch(true);
			}
			Crafty.pixelart(true);
			// initialized
			
			// set scenes' loading parameters (scene name, scene elements to be loaded)
			gameContainer
			    .setSceneInfo({
				name: "start_screen",
				elements: []
			    }).setSceneInfo({ 
				name: "level01",
				elements: [
				    "src/components/TweenColor.js?v="+version,
				    "src/components/Delimiter.js?v="+version,
				    "src/components/Particle.js?v="+version,
				    "src/entities/amianto01.js?v="+version,
				    "src/entities/heart01.js?v="+version
				]
			    }).setSceneInfo({ 
				name: "level02",
				elements: [
				    "text!src/scenes/tilemaps/level02.json?v="+version, 
				    "src/components/TiledLevelImporter.js?v="+version,
				    "src/components/Delimiter.js?v="+version,
				    "src/entities/diamond.js?v="+version,
				    "src/entities/amianto02.js?v="+version,
				    "src/entities/obstacle.js?v="+version,
				    "src/entities/amiantoToBlanche.js?v="+version,
				    "src/entities/mapsmanager.js?v="+version,
				]
			    }).setSceneInfo({
				name: "level03",
				elements: [
				    "src/components/Delimiter.js?v="+version,
				    "src/entities/amianto03.js?v="+version,
				    "src/entities/wordblock.js?v="+version,
				    "src/entities/wordplaceholder.js?v="+version,
				    "src/effects/glitcheffect.js?v="+version,
				    "text!src/lang/level03-"+gameContainer.lang+".json?v="+version
				]
			    }).setSceneInfo({
				name: "level04",
				elements: [
				    "text!src/scenes/tilemaps/level04.json?v="+version,
				    "src/components/VanillaTimer.js?v="+version,
				    "src/components/TiledLevelImporter.js?v="+version,
				    "src/components/Background.js?v="+version,
				    "src/components/Delimiter.js?v="+version,
				    "src/components/Bullet.js?v="+version,
				    "src/components/Figurant.js?v="+version,
				    "src/components/LilPhantom.js?v="+version,
				    "src/components/BadassPhantom.js?v="+version,
				    "src/components/Policeman.js?v="+version,
				    "src/components/PoliceSpawner.js?v="+version,
				    "src/components/CarlosMock.js?v="+version,
				    "src/entities/carlos.js?v="+version,
				    "src/entities/mapsmanager.js?v="+version
				]
			    }).setSceneInfo({ 
				name: "level05",
				elements: [
				    "text!src/scenes/tilemaps/level05.json?v="+version,
				    "src/components/TiledLevelImporter.js?v="+version,
				    "src/components/Delimiter.js?v="+version,
				    "src/components/DanceFloor.js?v="+version,
				    "src/components/FloorSet.js?v="+version,
				    "src/components/SpriteColor.js?v="+version,
				    "src/components/TweenSpriteColor.js?v="+version,
				    "src/components/Shine.js?v="+version,
				    "src/components/NightclubPhantom.js?v="+version,
				    "src/entities/mapsmanager.js?v="+version,
				    "src/entities/amianto05.js?v="+version
				]
			    }).setSceneInfo({ 
				name: "level06",
				elements: [
				    "src/components/Delimiter.js?v="+version,
				    "src/components/Fireworks.js?v="+version,
				    "src/components/StepsPhantom.js?v="+version,
				    "src/components/SpriteText.js?v="+version,
				    "src/entities/amianto06.js?v="+version,
				    "src/entities/heart06.js?v="+version,
				    "text!src/lang/credits-"+gameContainer.lang+".json?v="+version
				]
			    });
			
			// load all scenes' files
			var scenes = [
			    "src/scenes/loading.js?v="+version,
			    "src/scenes/start_screen.js?v="+version,
			    "src/scenes/level01.js?v="+version,
			    "src/scenes/level02.js?v="+version,
			    "src/scenes/level03.js?v="+version,
			    "src/scenes/level04.js?v="+version,
			    "src/scenes/level05.js?v="+version,
			    "src/scenes/level06.js?v="+version,
			];
			
			require(scenes, function() {
				var sceneArg, options;
				if(gameContainer.env == "dev"){ 
					sceneArg = utils.getUrlVars()['scene'];
				}
				sceneArg = sceneArg?sceneArg:"start_screen";
				if (sceneArg == "start_screen") {
					options = { backgroundColor: "#000000" };
				}
				gameContainer.runScene(sceneArg, options);
			});
		});
	});
};
