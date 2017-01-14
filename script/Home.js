ENGINE.Home = {

	create: function() {
		//create stuff

		//Creation functions:
		var createStaticRectangle = function(sizeX, sizeY, x, y, rotation){
			var boundarySd = new b2BoxDef();
			boundarySd.extents.Set(sizeX, sizeY);
			boundarySd.restitution = 0.0;

			var boundaryBd = new b2BodyDef();
			boundaryBd.AddShape(boundarySd);
			boundaryBd.position.Set(x, y);
			boundaryBd.rotation = rotation;
			
			return boundaryBd;			
		};

		var createDynamicRectangle = function(sizeX, sizeY, x, y, restitution, density, friction, rotation, rectText) {
			var boundarySd = new b2BoxDef();
			boundarySd.extents.Set(sizeX, sizeY);
			boundarySd.restitution = restitution;
			boundarySd.density = density;
			boundarySd.friction = friction;

			var boundaryBd = new b2BodyDef();
			boundaryBd.AddShape(boundarySd);
			boundaryBd.position.Set(x, y);
			boundaryBd.rotation = rotation;

			data = {
				text : rectText,
				width : sizeX,
				height : sizeY
			};
			boundaryBd.userData = data;

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

		//printing functions
		var printShapeText = function(shape, context){
			var text = shape.m_body.m_userData.text;
			var x = shape.m_position.x - ((shape.m_body.m_userData.width / text.length) * -1);
			//if its upside down you need to get a different y coordinate
			//var y;
			//if()
			var y = shape.m_position.y - ((shape.m_body.m_userData.height / text.length) * -1);
			context.save();
			context
				.fillStyle('rgba(255,255,255,1)')
				.font('Courier New 10px')
				.textAlign('center')
				.translate(x, y)
				.rotate(shape.m_body.m_rotation)
				.fillText(text, 0, 0);
			context.restore();

			//context.translate(this.app.center.x, this.app.y);
		};

		//drawing functions

		var drawShape = function(shape, context){
			
			context.beginPath();
			//context.fillStyle('rgba(255, 0, 0, 1)');
			switch(shape.m_type) {
				case b2Shape.e_polyShape:{
					//context.fillStyle = "red";
					//console.log('in here');
					if(shape.m_restitution === 0){
						context.fillStyle("rgb(122,82,48)");
					}else{
						context.fillStyle('rgba(255,0,0,.1');
						//rectText
						//printShapeText(shape, context);
						//context.fillStyle("rgb(")
					}
					var poly = shape;
					var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
					context.moveTo(tV.x, tV.y);
					for(var i = 0; i < poly.m_vertexCount; i++) {
						var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
						context.lineTo(v.x, v.y);
					}
					context.lineTo(tV.x, tV.y);
				} break;
			}
			context.fill();
		};


		//The things that I need to create
		this.world = createWorld();
		
		//create the static rectangles
		//  createStaticRectangle(sizeX, sizeY, x, y, rotation);
		this.world.CreateBody(createStaticRectangle(300, 4, 0, 200, 0));
		this.world.CreateBody(createStaticRectangle(250, 12, 0, 212, 0));
		this.world.CreateBody(createStaticRectangle(6, 50, -225, 250, 0));
		this.world.CreateBody(createStaticRectangle(6, 50, 225, 250, 0));

		//create the dynamic rectangles
		//  createDynamicRectanlge(sizeX, sizeY, x, y, restitution, density, friction, rotation, rectText)
		this.world.CreateBody(createDynamicRectangle(120, 50, 0, -300, .5, .75, 0.5, 0, "TABLE"));
		this.world.CreateBody(createDynamicRectangle(100, 50, 0, -380, .5, .75, 0.5, 0, "THE"));
		this.world.CreateBody(createDynamicRectangle(80, 50, 0, -460, .5, .75, 0.5, 0, "RUN"));
		

		//at the end have draw world?
		this.drawWorld = function(world, context){
			for(var b = world.m_bodyList; b; b = b.m_next){
				for(var s = b.GetShapeList(); s != null; s = s.GetNext()){
					drawShape(s, context);
					if(s.m_type === b2Shape.e_polyShape && s.m_restitution !== 0){
						printShapeText(s, context);

					}
				}
			}
		};
	},
	step: function(dt){
		/*update game logic*/
		//this.drawWorld(this.world, this.app.layer);
		var stepping = false;
		var timeStep = 1.0 / 60;
		var iteration = 1;
		this.world.Step(timeStep, iteration);


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
		layer.translate(app.center.x, app.y);
		this.drawWorld(this.world, this.app.layer);
		layer.restore();

	}
};