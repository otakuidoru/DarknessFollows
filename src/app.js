var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        if (!zp.globals.isPreviouslyLaunched()) {	// if this is the first launch
            zp.globals.setPreviouslyLaunched(true);

            // setup first time run variables
            zp.globals.setCompletedInstaDeath(false);
        }

//        var worldBuilder = new zp.WorldBuilder(42);
//        worldBuilder.build();

//        cc.director.runScene(new MainMenuScene());

//        // 1. Compute the Delaunay triangulation in O(n log n) time and O(n) space.
//        // Because the Delaunay triangulation is a planar graph, and there are
//        // no more than three times as many edges as vertices in any planar graph,
//        // this generates only O(n) edges.
//        var vertices = [];
//        for (var n=0; n<level.rooms.length; ++n) {
//            var r0CenterX = level.rooms[n].rect.x + level.rooms[n].rect.width / 2;
//            var r0CenterY = level.rooms[n].rect.y + level.rooms[n].rect.height / 2;
//            vertices.push([r0CenterX, r0CenterY]);
//        }
//        var triangles = Delaunay.triangulate(vertices);
//
//        // 2. Label each edge with its length.
//        var graph = new Graph(); // creates a graph
//        var map = new Map();
//        for (var n=0; n<triangles.length; ++n) {
//            map.set(Math.floor(vertices[triangles[n]][0]) + "," + Math.floor(vertices[triangles[n]][1]), new Set());
//        }
//        for (var n=0; n<triangles.length; n+=3) {
//            var vertex0 = cc.p(Math.floor(vertices[triangles[n]][0]),   Math.floor(vertices[triangles[n]][1]));
//            var vertex1 = cc.p(Math.floor(vertices[triangles[n+1]][0]), Math.floor(vertices[triangles[n+1]][1]));
//            var vertex2 = cc.p(Math.floor(vertices[triangles[n+2]][0]), Math.floor(vertices[triangles[n+2]][1]));
//            map.get(vertex0.x + "," + vertex0.y).add(vertex1.x + "," + vertex1.y);
//            map.get(vertex0.x + "," + vertex0.y).add(vertex2.x + "," + vertex2.y);
//            map.get(vertex1.x + "," + vertex1.y).add(vertex0.x + "," + vertex0.y);
//            map.get(vertex1.x + "," + vertex1.y).add(vertex2.x + "," + vertex2.y);
//            map.get(vertex2.x + "," + vertex2.y).add(vertex0.x + "," + vertex0.y);
//            map.get(vertex2.x + "," + vertex2.y).add(vertex1.x + "," + vertex1.y);
//        }
//        map.forEach(function(value, key, map) {
//            graph.addNode(key); // creates a node
//        });
//        map.forEach(function(value, key, map) {
//            var vertex = graph.getNode(key);	// find the vertex in the graph
//            value.forEach(function(value1, value2, set) {
//                var adjVertexCoords = cc.p(value1.split(",")[0], value1.split(",")[1]);
//                var adjVertex = graph.getNode(value1);
//                var dist = cc.pDistance(cc.p(key.split(",")[0], key.split(",")[1]), cc.p(adjVertexCoords.x, adjVertexCoords.y));
//                vertex.addEdge(adjVertex, dist);
//            });
//        });
//
//        // 3. Run a graph minimum spanning tree algorithm on this graph to find a minimum spanning tree. 
//        // Since there are O(n) edges, this requires O(n log n) time using any of the standard
//        // minimum spanning tree algorithms such as Borůvka's algorithm, Prim's algorithm, or Kruskal's algorithm.
//        // This implementation uses Prim's algorithm.
//        var msp = new prim(graph);
//        console.log(msp);
//
//        var pathfindingGrid = new Grid(Level.SIZE, Level.SIZE);
//        // set the rooms interiors as non-walkable
//        for (var n=0; n<level.rooms.length; ++n) {
//            for (var i=level.rooms[n].x+1; i<level.rooms[n].x+level.rooms[n].width-2; ++i) {
//                for (var j=level.rooms[n].y+1; i<level.rooms[n].y+level.rooms[n].height-2; ++j) {
//                    pathfindingGrid.setWalkableAt(i, j, false);
//                }
//            }
//        }
//
//        for (var n=0; n<msp.Vedge.length; ++n) {
//            var edge = msp.Vedge[n];
//            var v0 = cc.p(Math.floor(edge[0].name.split(",")[0]), Math.floor(edge[0].name.split(",")[1]));
//            var v1 = cc.p(Math.floor(edge[1].name.split(",")[0]), Math.floor(edge[1].name.split(",")[1]));
//            var tileSprite0 = level.allLayers()[0].getTileAt(v0);
//            var tileSprite1 = level.allLayers()[0].getTileAt(v1);
//            var dn = new cc.DrawNode();
//            dn.drawSegment(
//                cc.p(tileSprite0.getPositionX()*Level.SCALE, tileSprite0.getPositionY()*Level.SCALE),
//                cc.p(tileSprite1.getPositionX()*Level.SCALE, tileSprite1.getPositionY()*Level.SCALE),
//                1.0, cc.color(255, 0, 0));
//            this.addChild(dn);
//            tileSprite0.setColor(cc.color(0, 255, 0));
//            tileSprite1.setColor(cc.color(0, 255, 0));
//
//            // connect rooms
//            var room0 = level.getRoomForTileCoord(v0);
//            var room1 = level.getRoomForTileCoord(v1);
//            var closestTiles = level.getDistanceBetweenRooms(room0, room1);
//            cc.log("%s, %s, %s, %s", closestTiles.tile0.x, closestTiles.tile0.y, closestTiles.tile1.x, closestTiles.tile1.y);
//            var pathfinder = new AStarFinder();
//            var path = pathfinder.findPath(closestTiles.tile0.x, closestTiles.tile0.y, closestTiles.tile1.x, closestTiles.tile1.y, pathfindingGrid);
//            for (var i=0; i<path.length; ++i) {
//                //path[i][0], path[i][1]
//            }
//        }

//        var bat = new VampireBat();
//        bat.attr({x:8, y:24});
//        this.addChild(bat);

//        var cube = new GelatinousCube();
//        cube.attr({x:150, y:50});
//        sector.addChild(cube);

//        var torch = new Torch();
//        torch.attr({x:24, y:24});
//        level.addChild(torch);

//        var campfire = new Campfire();
//        campfire.attr({x:200, y:50});
//        level.addChild(campfire);

//        var treasureChest = new TreasureChest();
//        level.addObjectAtTilePosition(1, 1, treasureChest);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

