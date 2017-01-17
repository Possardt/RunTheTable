ENGINE.Home = {

	create: function() {

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

		this.createDynamicRectangle = function(sizeX, sizeY, x, y, restitution, density, friction, rotation, rectText, rectColor) {
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
				height : sizeY,
				color : rectColor
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

		//printing functions
		var printShapeText = function(shape, context){
			var text = shape.m_body.m_userData.text;
			var x = shape.m_position.x;
			var y = shape.m_position.y;
			var color = shape.m_body.m_userData.color;
			context.save();
			context
				.fillStyle(color)
				.font('Courier New 10px')
				.textAlign('center')
				.translate(x, y)
				.rotate(shape.m_body.m_rotation)
				.fillText(text, 0, 22);
			context.restore();
		};

		//drawing functions

		var drawShape = function(shape, context){
			
			context.beginPath();
			context.fillStyle('rgb(122,82,48)');
			//context.fillStyle('rgba(255, 0, 0, 1)');
			switch(shape.m_type) {
				case b2Shape.e_polyShape:{
					context.fillStyle("rgb(122,82,48)");
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
		this.stepNumber = 0;
		this.rectangleText = ["RUN", "THE", "TABLE"];
		this.rectangleSizes = [42, 42, 72];
		this.textColors = ['rgb(32,55,49)', 'rgb(255,182,18)'];
		
		//create the static rectangles
		//  createStaticRectangle(sizeX, sizeY, x, y, rotation);
		this.world.CreateBody(createStaticRectangle(300, 4, 0, 200, 0));
		this.world.CreateBody(createStaticRectangle(250, 12, 0, 212, 0));
		this.world.CreateBody(createStaticRectangle(6, 50, -225, 250, 0));
		this.world.CreateBody(createStaticRectangle(6, 50, 225, 250, 0));

		
	},
	step: function(dt){
		/*update game logic*/
		//this.drawWorld(this.world, this.app.layer);
		var stepping = false;
		var timeStep = 1.0 / 60;
		var iteration = 1;
		this.world.Step(timeStep, iteration);
		this.stepNumber++;

	},
	render: function(){
		
		var app = this.app;
		var layer = this.app.layer;

		layer.clear('#a9a9a9');
		layer.save();
		layer.translate(app.center.x, app.center.y);
		layer.align(0.5, 0.5);
		layer.scale(1,1);
		layer
			.textAlign('center')
			.font('50px Courier New');
		layer.translate(app.center.x, app.y);

		this.drawWorld(this.world, this.app.layer);

		if(this.stepNumber %20 === 0){
			var index = this.stepNumber % 3;
			var randIndex = Math.random() > .5 ? 1 : 0;
			var x = Math.random() > .5  ? Math.random() * this.app.layer.width : Math.random() * this.app.layer.width * -1;
			var y = (Math.random() * this.app.layer.height * -1) - 200;
			var rectangle = this.createDynamicRectangle(this.rectangleSizes[index], 17, x, y, .5, .75, .5, 0, this.rectangleText[index], this.textColors[randIndex]);
			this.world.CreateBody(rectangle);
		}
		layer.restore();

	},
	pointerdown: function(event) {
		console.log(event.button.x);
	}
};