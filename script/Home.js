ENGINE.Home = {

	create: function() {
		//create stuff
		this.homeText = {
			x:0,
			y:0,
			size:12
		}

		

		//Creation functions:
		var createRectangle = function(){
			var boundarySd = new b2BoxDef();
			boundarySd.extents.Set(2, 10);
			boundarySd.restitution = 1;

			var boundaryBd = new b2BodyDef();
			boundaryBd.AddShape(boundarySd);
			boundaryBd.position.Set(100,100);
			boundaryBd.rotation = 0;
			
			return boundaryBd;			
		};

		var createWorld = function(){
			var worldAABB = new b2AABB();
			worldAABB.minVertex.Set(-1000, -1000);
			worldAABB.maxVertex.Set(1000, 1000);
			var gravity = new b2Vec2(0,300);
			var doSleep = true;

			return new b2World(worldAABB, gravity, doSleep);
		};

		//drawing functions

		var drawShape = function(shape, context){
			//console.log('I can get here');

		};


		//The things that I need to create
		this.world = createWorld();
		this.world.CreateBody(createRectangle());
		

		//at the end have draw world?
		this.drawWorld = function(world, context){
			for(var b = world.m_bodyList; b; b = b.m_next){
				for(var s = b.GetShapeList(); s != null; s = s.GetNext()){
					drawShape(s, context);
				}
			}
		};
	},
	step: function(dt){
		/*update game logic*/
		this.drawWorld(this.world, this.app.layer);

	},
	render: function(){
		
		var app = this.app;
		var layer = this.app.layer;
		layer.clear('#222');
		layer.save();
		layer.translate(app.center.x, app.center.y);
		layer.align(0.5, 0.5);
		layer.scale(1,1);
		layer
			.fillStyle('#fff')
			.textAlign('center')
			.font('50px Courier New')
			.fillText('Run The', 0, 0)
			.fillText('Table', 0, 48);
		layer.restore();

	}
};