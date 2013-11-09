Obstacle = BaseEntity.extend({
    defaults: {
	    'dimensions' : { height: 136, width: 73},
	    'movable': true,
	    'weight': 3,
    },
    initialize: function(){
		var model = this,
			//poly = new Crafty.polygon([[5,0],[-5,136],[58,136],[58,0]]),
			entity = Crafty.e("2D, "+gameContainer.conf.get('renderType')+", obstacle, grnd, Collision, Gravity")
				.attr({x: model.attributes.initialX, 
					  y: model.attributes.initialY,
					  z: model.attributes.initialZ,
					  h: model.get('dimensions').height,
					  w: model.get('dimensions').width,
					  movable: model.get('movable'),
					  weight: model.get('weight'),
					  wasMoved: false
				});
		entity
			.collision(new Crafty.polygon([[0,6],[73,6],[73,126],[0,126]]))
			.onHit('water', function(hit) { 
				this.antigravity();
				this.movable = false,
				this._falling = false,
				this._up = false,
				this.y += Math.ceil(hit[0].normal.y * -hit[0].overlap);
				
				var amianto = sc.player.getEntity();
				amianto.enableControl();
			})
			.onHit('grnd', function(hit) {
				this._falling = false,
				this._up = false,
				this.y += Math.ceil(hit[0].normal.y * -hit[0].overlap);
			})
			.onHit('obstacleBlocker', function(hit) {
				this.x += Math.ceil(hit[0].normal.x * -hit[0].overlap);
				
				var amianto = sc.player.getEntity();
				amianto.x -= sc.player.get('speed');
				amianto.disableControl()
				    .playAnimation("AmiantoStandingStill0", 57*5, -1);
			})
			.bind('EnterFrame',function change_z() {
				if(this._falling && this.wasMoved) {
					this.unbind('EnterFrame', change_z);
					this.z = sc.player.getEntity()._z - 2;
				}
			})
			.gravity();
		model.set({'entity' : entity });
    }
});