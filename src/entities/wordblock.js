Wordblock = BaseEntity.extend({
	defaults: {
		  'movable': true,
		  'newly_created' : false,
		  'text_size' : 20,
	},
	initialize: function(){
		var model = this,
			//poly = new Crafty.polygon([[5,0],[-5,136],[58,136],[58,0]]),
			entity = Crafty.e("2D, "+gameContainer.conf.get('renderType')+", wordblock, Text, Collision")
				.attr({	
					  x: model.get('initialX'), 
					  y: model.get('initialY'),
					  z: model.get('initialZ'),
					  h: model.get('initialH'),
					  w: model.get('initialW'),
					  movable: model.get('movable'),
					  full_text: model.get('full_text'),
					  newly_created: model.get('newly_created'),
					  text_size: model.get('text_size')
				});
		entity
			.text(model.get('full_text'))
			.textColor("#FFFFFF")
			.textFont({ size: entity.text_size.toString()+"px", family: 'Perfect_dos_vga_437' })
			// Collision with other wordblocks
			.onHit('wordblock', function(hit) {
			})
			// Collision with scenario delimiters
			.onHit('wall', function(hit) {
			})
			.onHit('amianto03', function(hit){
			})
			.onHit('wordplaceholder',function(hit){
			},function(){
			});
			
		model.set({'entity' : entity });
	}
});