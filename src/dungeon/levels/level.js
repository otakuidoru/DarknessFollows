/**
 * @see http://silentmatt.com/biginteger-docs/files/biginteger-js.html#BigInteger.BigInteger
 * @see https://github.com/growingdever/cocos2d-x-panzoomlayer
 */
var Level = cc.TMXTiledMap.extend({
    prng:null,
    levelEnterListeners:[],
    levelExitListeners:[],

    // player variables
    player:null,
    playerTileCoords:null,
    path:[],
    playerWalking:false,

    stairsUp:null,
    stairsUpTileCoords:null,
    stairsDown:null,
    stairsDownTileCoords:null,
    rooms:[],
    doors:[],

    /**
     * @param num
     */
    ctor:function(num) {
        // 1. initialize member variables

        this.prng = new RandomUtils((Dungeon.SEED + "" + num).hashCode());

        this.levelEnterListeners = [];
        this.levelExitListeners = [];

        this.player = null;
        this.playerTileCoords = cc.p(0, 0);
        this.path = [];
        this.playerWalking = false;

        this.stairsUp = null;
        this.stairsUpTileCoords = cc.p(0, 0);
        this.stairsDown = null;
        this.stairsDownTileCoords = cc.p(0, 0);
        this.rooms = [];

        // 1. Fill the whole map with solid earth
        var grid = [];
        for (var i=0; i<Level.SIZE; ++i) {
            grid[i] = [];
            for (var j=0; j<Level.SIZE; ++j) {
                grid[i][j] = zp.DungeonTileType.EMPTY;
            }
        }

        // create rooms
        for (var n=0; n<Level.NUM_ROOMS_ATTEMPTS; ++n) {
            var roomSize = zp.Size.MEDIUM;
            var roomSizeRoll = this.prng.randomInt(100);
            if (roomSizeRoll < 10) { roomSize = zp.Size.TINY; }
            else if (roomSizeRoll < 30) { roomSize = zp.Size.SMALL; }
            else if (roomSizeRoll < 70) { roomSize = zp.Size.MEDIUM; }
            else if (roomSizeRoll < 90) { roomSize = zp.Size.LARGE; }
            else if (roomSizeRoll < 100) { roomSize = zp.Size.HUGE; }

            var roomWidth = 0;
            var roomHeight = 0;
            switch (roomSize) {
                case zp.Size.TINY:   { roomWidth = this.prng.randomInt(5, 9); roomHeight = this.prng.randomInt(5, 9); } break;
                case zp.Size.SMALL:  { roomWidth = this.prng.randomInt(9, 13); roomHeight = this.prng.randomInt(9, 13); } break;
                case zp.Size.MEDIUM: { roomWidth = this.prng.randomInt(13, 17); roomHeight = this.prng.randomInt(13, 17); } break;
                case zp.Size.LARGE:  { roomWidth = this.prng.randomInt(17, 21); roomHeight = this.prng.randomInt(13, 21); } break;
                case zp.Size.HUGE:   { roomWidth = this.prng.randomInt(21, 25); roomHeight = this.prng.randomInt(21, 25); } break;
            }
            var roomX = this.prng.randomInt(1, Level.SIZE-roomWidth-1);
            var roomY = this.prng.randomInt(1, Level.SIZE-roomHeight-1);
            var room = new Room(roomX, roomY, roomWidth, roomHeight);
            if (this.isAreaClearForFeature(room.rect, grid)) {
                this.rooms.push(room);
                for (var i=room.rect.x; i<room.rect.x+room.rect.width; ++i) {
                    for (var j=room.rect.y; j<room.rect.y+room.rect.height; ++j) {
                        grid[i][j] = zp.DungeonTileType.STONE_FLOOR;
                    }
                }
            }
        }

        // 1. Compute the Delaunay triangulation in O(n log n) time and O(n) space.
        // Because the Delaunay triangulation is a planar graph, and there are
        // no more than three times as many edges as vertices in any planar graph,
        // this generates only O(n) edges.
        var vertices = [];
        for (var n=0; n<this.rooms.length; ++n) {
            var r0CenterX = this.rooms[n].rect.x + this.rooms[n].rect.width / 2;
            var r0CenterY = this.rooms[n].rect.y + this.rooms[n].rect.height / 2;
            vertices.push([r0CenterX, r0CenterY]);
        }
        var triangles = Delaunay.triangulate(vertices);

        // 2. Label each edge with its length.
        var graph = new Graph(); // creates a graph
        var map = new Map();
        for (var n=0; n<triangles.length; ++n) {
            map.set(Math.floor(vertices[triangles[n]][0]) + "," + Math.floor(vertices[triangles[n]][1]), new Set());
        }
        for (var n=0; n<triangles.length; n+=3) {
            var vertex0 = cc.p(Math.floor(vertices[triangles[n]][0]),   Math.floor(vertices[triangles[n]][1]));
            var vertex1 = cc.p(Math.floor(vertices[triangles[n+1]][0]), Math.floor(vertices[triangles[n+1]][1]));
            var vertex2 = cc.p(Math.floor(vertices[triangles[n+2]][0]), Math.floor(vertices[triangles[n+2]][1]));
            map.get(vertex0.x + "," + vertex0.y).add(vertex1.x + "," + vertex1.y);
            map.get(vertex0.x + "," + vertex0.y).add(vertex2.x + "," + vertex2.y);
            map.get(vertex1.x + "," + vertex1.y).add(vertex0.x + "," + vertex0.y);
            map.get(vertex1.x + "," + vertex1.y).add(vertex2.x + "," + vertex2.y);
            map.get(vertex2.x + "," + vertex2.y).add(vertex0.x + "," + vertex0.y);
            map.get(vertex2.x + "," + vertex2.y).add(vertex1.x + "," + vertex1.y);
        }
        map.forEach(function(value, key, map) {
            graph.addNode(key); // creates a node
        });
        map.forEach(function(value, key, map) {
            var vertex = graph.getNode(key);	// find the vertex in the graph
            value.forEach(function(value1, value2, set) {
                var adjVertexCoords = cc.p(value1.split(",")[0], value1.split(",")[1]);
                var adjVertex = graph.getNode(value1);
                var dist = cc.pDistance(cc.p(key.split(",")[0], key.split(",")[1]), cc.p(adjVertexCoords.x, adjVertexCoords.y));
                vertex.addEdge(adjVertex, dist);
            });
        });

        // 3. Run a graph minimum spanning tree algorithm on this graph to find a minimum spanning tree. 
        // Since there are O(n) edges, this requires O(n log n) time using any of the standard
        // minimum spanning tree algorithms such as Borůvka's algorithm, Prim's algorithm, or Kruskal's algorithm.
        // This implementation uses Prim's algorithm.
        var msp = new prim(graph);

        for (var n=0; n<msp.Vedge.length; ++n) {
            // connect rooms
        	var pathfinder = new AStarFinder({allowDiagonal:false});
        	var pathfindingGrid = new Grid(Level.SIZE, Level.SIZE);
            // set the rooms interiors as non-walkable
            for (var r=0; r<this.rooms.length; ++r) {
                for (var i=this.rooms[r].x; i<this.rooms[r].x+this.rooms[r].width; ++i) {
                    for (var j=this.rooms[r].y; i<this.rooms[r].y+this.rooms[r].height; ++j) {
                        pathfindingGrid.setWalkableAt(i, j, false);
                    }
                }
            }

            var edge = msp.Vedge[n];
            var v0 = cc.p(Math.floor(edge[0].name.split(",")[0]), Math.floor(edge[0].name.split(",")[1]));
            var v1 = cc.p(Math.floor(edge[1].name.split(",")[0]), Math.floor(edge[1].name.split(",")[1]));

            var room0 = this.getRoomForTileCoord(v0);
            var room1 = this.getRoomForTileCoord(v1);
            var closestTiles = this.getDistanceBetweenRooms(room0, room1);
            var path = pathfinder.findPath(closestTiles.tile0.x, closestTiles.tile0.y, closestTiles.tile1.x, closestTiles.tile1.y, pathfindingGrid);
            for (var i=0; i<path.length; ++i) {
                if (i == 1 || i == path.length-2) {
                    grid[path[i][0]][path[i][1]] = zp.DungeonTileType.DOOR_CLOSED;
//                    this.doors.push(new Door());
                } else {
                    grid[path[i][0]][path[i][1]] = zp.DungeonTileType.STONE_FLOOR;
                }
            }
        }

        // add the walls
        for (var i=0; i<Level.SIZE; ++i) {
            for (var j=0; j<Level.SIZE; ++j) {
                if (grid[i][j] == zp.DungeonTileType.STONE_FLOOR) {
                    if (i > 0 && j > 0 && grid[i-1][j-1] == zp.DungeonTileType.EMPTY) { grid[i-1][j-1] = zp.DungeonTileType.STONE_WALL; }
                    if (j > 0 && grid[i][j-1] == zp.DungeonTileType.EMPTY) { grid[i][j-1] = zp.DungeonTileType.STONE_WALL; }
                    if (i < Level.SIZE-1 && j > 0 && grid[i+1][j-1] == zp.DungeonTileType.EMPTY) { grid[i+1][j-1] = zp.DungeonTileType.STONE_WALL; }
                    if (i > 0 && grid[i-1][j] == zp.DungeonTileType.EMPTY) { grid[i-1][j] = zp.DungeonTileType.STONE_WALL; }
                    if (i < Level.SIZE-1 && grid[i+1][j] == zp.DungeonTileType.EMPTY) { grid[i+1][j] = zp.DungeonTileType.STONE_WALL; }
                    if (i > 0 && j < Level.SIZE-1 && grid[i-1][j+1] == zp.DungeonTileType.EMPTY) { grid[i-1][j+1] = zp.DungeonTileType.STONE_WALL; }
                    if (j < Level.SIZE-1 && grid[i][j+1] == zp.DungeonTileType.EMPTY) { grid[i][j+1] = zp.DungeonTileType.STONE_WALL; }
                    if (i < Level.SIZE-1 && j < Level.SIZE-1 && grid[i+1][j+1] == zp.DungeonTileType.EMPTY) { grid[i+1][j+1] = zp.DungeonTileType.STONE_WALL; }
                }
            }
        }

        // set the level tiles
        var levelTiles = [];
        for (var i=0; i<Level.SIZE; ++i) {
            levelTiles[i] = [];
            for (var j=0; j<Level.SIZE; ++j) {
                levelTiles[i][j] = grid[j][i];
            }
        }

        // build up the XML data
        var tilesImageWidth = 256;
        var tilesImageHeight = 96;
        var tileCount = (tilesImageWidth / Level.TILE_SIZE) * (tilesImageHeight / Level.TILE_SIZE);
        var xmlStr =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\""+Level.SIZE+"\" height=\""+Level.SIZE+"\" tilewidth=\""+Level.TILE_SIZE+"\" tileheight=\""+Level.TILE_SIZE+"\" nextobjectid=\"1\">" +
        " <tileset firstgid=\"1\" name=\"grid\" tilewidth=\""+Level.TILE_SIZE+"\" tileheight=\""+Level.TILE_SIZE+"\" tilecount=\""+tileCount+"\">" +
        "  <image source=\"tiles.png\" width=\""+tilesImageWidth+"\" height=\""+tilesImageHeight+"\"/>" +
        " </tileset>" +
        " <layer name=\"Tile Layer 1\" width=\""+Level.SIZE+"\" height=\""+Level.SIZE+"\">" +
        "  <data>";

        for (var i=0; i<Level.SIZE; ++i) {
            for (var j=0; j<Level.SIZE; ++j) {
                xmlStr += "<tile gid=\""+levelTiles[i][j]+"\"/>";
            }
        }

        xmlStr +=
        "  </data>" +
        " </layer>" +
        "</map>";

        this._super(xmlStr, "res");
        this.setScale(Level.SCALE);

        // stairs up
        this.stairsUp = new StairsUp();
        var stairsUpRoomNum = this.prng.randomInt(this.rooms.length);
        var stairsUpRoom = this.rooms[stairsUpRoomNum];
        var stairsUpX = this.prng.randomInt(stairsUpRoom.rect.x, stairsUpRoom.rect.x + stairsUpRoom.rect.width);
        var stairsUpY = this.prng.randomInt(stairsUpRoom.rect.y, stairsUpRoom.rect.y + stairsUpRoom.rect.height);
        this.addObjectAtTilePosition(stairsUpX, stairsUpY, this.stairsUp);
        this.stairsUpTileCoords = cc.p(stairsUpX, stairsUpY);
        // stairs down
        while (true) {
            var stairsDownRoomNum = this.prng.randomInt(this.rooms.length);
            if (stairsDownRoomNum != stairsUpRoomNum) {
                this.stairsDown = new StairsDown();
                var stairsDownRoom = this.rooms[stairsDownRoomNum];
                this.addObjectAtTilePosition(
                    this.prng.randomInt(stairsDownRoom.rect.x, stairsDownRoom.rect.x + stairsDownRoom.rect.width),
                    this.prng.randomInt(stairsDownRoom.rect.y, stairsDownRoom.rect.y + stairsDownRoom.rect.height),
                    this.stairsDown
                );
//                this.stairsDownTileCoords = cc.p(stairsDownX, stairsDownY);
            	break;
            }
        }

        this.playerTileCoords = cc.p(stairsUpX, stairsUpY);

//        for (var i=0; i<Level.SIZE; ++i) {
//            for (var j=0; j<Level.SIZE; ++j) {
//                var tile = this.allLayers()[0].getTileAt(cc.p(i, j));
//                if (tile) {
//                    if (zp.DungeonTileType.isWalkable(this.allLayers()[0].getTileGIDAt(cc.p(i, j)))) {
//                        tile.setColor(cc.color(0, 255, 0));
//                    } else {
//                        tile.setColor(cc.color(255, 0, 0));
//                    }
//                }
//            }
//        }

        var self = this;
        // add touch recognizer
        if ( true || 'touches' in cc.sys.capabilities ) { // touches work on mac but return false
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan: function(touches, event) {
                    console.log("onTouchesBegan!");

                    var touch = touches[0];
                    var loc = touch.getLocation();

                    self.touchStartPoint = {
                        x: loc.x,
                        y: loc.y
                    };

                    self.touchLastPoint = {
                        x: loc.x,
                        y: loc.y
                    };
                },

                onTouchesMoved: function(touches, event) {
                    var touch = touches[0];
                    var loc = touch.getLocation(),
                        start = self.touchStartPoint;

                    // check for left
                    if ( loc.x < start.x - self.touchThreshold ) {
                        // if direction changed while swiping left, set new base point
                        if ( loc.x > self.touchLastPoint.x ) {
                            start = self.touchStartPoint = {
                                x: loc.x,
                                y: loc.y
                            };
                            self.isSwipeLeft = false;
                        } else {
                            self.isSwipeLeft = true;
                        }
                    }

                    // check for right
                    if ( loc.x > start.x + self.touchThreshold ) {
                        // if direction changed while swiping right, set new base point
                        if ( loc.x < self.touchLastPoint.x ) {
                            self.touchStartPoint = {
                                x: loc.x,
                                y: loc.y
                            };
                            self.isSwipeRight = false;
                        } else {
                            self.isSwipeRight = true;                       
                        }
                    }

                    // check for down
                    if ( loc.y < start.y - self.touchThreshold ) {
                        // if direction changed while swiping down, set new base point
                        if ( loc.y > self.touchLastPoint.y ) {
                            self.touchStartPoint = {
                                x: loc.x,
                                y: loc.y
                            };
                            self.isSwipeDown = false;
                        } else {
                            self.isSwipeDown = true;                        
                        }
                    }

                    // check for up
                    if ( loc.y > start.y + self.touchThreshold ) {
                        // if direction changed while swiping right, set new base point
                        if ( loc.y < self.touchLastPoint.y ) {
                            self.touchStartPoint = {
                                x: loc.x,
                                y: loc.y
                            };
                            self.isSwipeUp = false;
                        } else {
                            self.isSwipeUp = true;                      
                        }
                    }

                    self.touchLastPoint = {
                        x: loc.x,
                        y: loc.y
                    };
                },

                onTouchesEnded: function(touches, event) {
                    console.log("onTouchesEnded!");

                    var touch = touches[0],
                        loc = touch.getLocation();
                        size = cc.winSize;

                    self.touchStartPoint = null;

                    if ( !self.isSwipeUp && !self.isSwipeLeft && !self.isSwipeRight && !self.isSwipeDown ) {
                        if ( loc.y > size.height*0.25 && loc.y < size.height*0.75 ) {
                            (loc.x < size.width*0.50)? self.isTouchLeft = true : self.isTouchRight = true;
                        } else if ( loc.y > size.height*0.75 ) {
                            self.isTouchUp = true;
                        } else {
                            self.isTouchDown = true;
                        }
                    }

                    if (self.isSwipeLeft) {
                        cc.log("swipe left");
                    } else if (self.isSwipeRight) {
                        cc.log("swipe right");
                    } else if (self.isSwipeUp) {
                        cc.log("swipe up");
                        // the animation is contained in the .c3b file
                        var animation = jsb.Animation3D.create("res/chain.c3b");
                        if (animation) {
                            cc.log("animation");
                            var animate = jsb.Animate3D.create(animation);
                            animate.setSpeed(10);
                            chain.runAction(animate);
                            cc.log("here");
                        } else {
                            cc.log("no animation");
                        }
                    } else if (self.isSwipeDown) {
                        cc.log("swipe down");
                    } else {
                        cc.log("just a touch");
                        var loc = self.convertTouchToNodeSpace(touch);
                        var tileCoords = self.getTileCoordsForLocation(loc);
                        var gid = self.getGIDAtPosition(loc);
                        cc.log("Clicked tile [%s, %s] of type [%s]", tileCoords.x, tileCoords.y, gid);
                        if (gid == zp.DungeonTileType.DOOR_CLOSED) {
                            if ((self.playerTileCoords.x == tileCoords.x && self.playerTileCoords.y == tileCoords.y - 1)
                             || (self.playerTileCoords.x == tileCoords.x && self.playerTileCoords.y == tileCoords.y + 1)
                             || (self.playerTileCoords.y == tileCoords.y && self.playerTileCoords.x == tileCoords.x - 1)
                             || (self.playerTileCoords.y == tileCoords.y && self.playerTileCoords.x == tileCoords.x + 1)
                            ) {
                                self.allLayers()[0].removeTileAt(cc.p(tileCoords.x, tileCoords.y));
                                self.allLayers()[0].setTileGID(zp.DungeonTileType.DOOR_OPEN, cc.p(tileCoords.x, tileCoords.y));
                            }
                        }
                        else if (zp.DungeonTileType.isWalkable(gid)) {
//                            var windSpell = new WindSpell();
//                            var tileCoords = self.getTileCoordsForLocation(loc);
//                            self.addObjectAtTilePosition(tileCoords.x, tileCoords.y, windSpell);
//                            windSpell.run();

                            // @see https://github.com/qiao/PathFinding.js/
                        	// TODO: TOO SLOW - reduce the search space! (21 x 13 is big enough)
//                            var pathfinder = new AStarFinder({allowDiagonal:false});
//                            var pathfindingGrid = new Grid(Level.SIZE, Level.SIZE);
//                            for (var i=0; i<Level.SIZE; ++i) {
//                                for (var j=0; j<Level.SIZE; ++j) {
//                                    var tile = self.allLayers()[0].getTileGIDAt(cc.p(i, j));
//                                    pathfindingGrid.setWalkableAt(i, j, zp.DungeonTileType.isWalkable(tile));
//                                }
//                            }
//                            var fromTileCoords = self.playerTileCoords;//self.getTileCoordsForLocation(self.player.getPosition());
//                            var toTileCoords = self.getTileCoordsForLocation(loc);
////                            cc.log("Player at (%s, %s)", fromTileCoords.x, fromTileCoords.y);
////                            cc.log("Going to  (%s, %s)", toTileCoords.x, toTileCoords.y);
//                            self.path = pathfinder.findPath(fromTileCoords.x, fromTileCoords.y, toTileCoords.x, toTileCoords.y, pathfindingGrid);

                            var pathfinder = new AStarFinder({allowDiagonal:false});
                            var pathfindingGrid = new Grid(21, 13);
                            var topLeftTileCoord = cc.p(self.playerTileCoords.x-10, self.playerTileCoords.y-6);
                            for (var i=0; i<21; ++i) {
                                for (var j=0; j<13; ++j) {
                                    var tile = self.allLayers()[0].getTileGIDAt(cc.p(self.playerTileCoords.x-10+i, self.playerTileCoords.y-6+j));
                                    pathfindingGrid.setWalkableAt(i, j, zp.DungeonTileType.isWalkable(tile));
                                }
                            }
                            var fromTileCoords = self.playerTileCoords;
                            var toTileCoords = self.getTileCoordsForLocation(loc);
                            self.path = pathfinder.findPath(10, 6, 10+toTileCoords.x-fromTileCoords.x, 6+toTileCoords.y-fromTileCoords.y, pathfindingGrid);
                            for (var i=0; i<self.path.length; ++i) {
                                self.path[i][0] += fromTileCoords.x-10;
                                self.path[i][1] += fromTileCoords.y-6;
                            }
                        }
                    }

                    self.isSwipeUp = self.isSwipeLeft = self.isSwipeRight = self.isSwipeDown = false;
                }
            }), this);
        } else {
            cc.log("TOUCH_ALL_AT_ONCE is not supported");
        }

        this.scheduleUpdate();

        return true;
    },

    /**
     * @param tileCoord
     * @returns
     */
    getRoomForTileCoord:function(tileCoord) {
        for (var i=0; i<this.rooms.length; ++i) {
            if (cc.rectContainsPoint(this.rooms[i].rect, tileCoord)) {
                return this.rooms[i];
            }
        }
        return null;
    },

    /**
     * @param room0
     * @param room1
     */
    getDistanceBetweenRooms:function(room0, room1) {
        var tile0Coords = null;
        var tile1Coords = null;
        var minDistance = Number.POSITIVE_INFINITY;
        for (var i=room0.rect.x; i<room0.rect.x + room0.rect.width; ++i) {
            for (var j=room0.rect.y; j<room0.rect.y + room0.rect.height; ++j) {
                for (var k=room1.rect.x; k<room1.rect.x + room1.rect.width; ++k) {
                    for (var l=room1.rect.y; l<room1.rect.y + room1.rect.height; ++l) {
                        var sqDist = cc.pDistanceSQ(cc.p(i, j), cc.p(k, l));
                        if (sqDist < minDistance) {
                            minDistance = sqDist;
                            tile0Coords = cc.p(i, j);
                            tile1Coords = cc.p(k, l);
                        }
                    }
                }
            }
        }
        return { tile0:tile0Coords, tile1:tile1Coords };
    },

    /**
     * @param featureRect
     * @param grid
     */
    isAreaClearForFeature:function(featureRect, grid) {
        if (featureRect.x < 0 || featureRect.y < 0 || featureRect.x+featureRect.width >= Level.SIZE || featureRect.y+featureRect.height >= Level.SIZE) {
            return false;
        }
        for (var i=featureRect.x-3; i<featureRect.x+featureRect.width+3; ++i) {
            for (var j=featureRect.y-3; j<featureRect.y+featureRect.height+3; ++j) {
                if ((i < 0 || i >= Level.SIZE || j < 0 || j >= Level.SIZE) || !zp.DungeonTileType.isEmpty(grid[i][j])) {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * @param tile_x
     * @param tile_y
     * @param obj
     * @param z_order
     */
    addObjectAtTilePosition:function(tile_x, tile_y, obj, z_order) {
        this.addChild(obj, (z_order ? z_order : 0));
        obj.setPosition(
            tile_x * Level.TILE_SIZE + (Level.TILE_SIZE / 2),
            (Level.SIZE * Level.TILE_SIZE) - (tile_y * Level.TILE_SIZE + (Level.TILE_SIZE / 2))
        );
    },

    /**
     * @param player
     */
    setPlayer:function(player) {
        this.player = player;
        this.addObjectAtTilePosition(this.stairsUpTileCoords.x, this.stairsUpTileCoords.y, this.player, 100);
    },

    /**
     * 
     */
    fireEnteredLevel:function() {
        for (var i=0; i<this.levelListeners.length; ++i) {
            this.levelEnterListeners[i](this);
        }
    },

    /**
     * 
     */
    fireExitedLevel:function() {
        for (var i=0; i<this.levelListeners.length; ++i) {
            this.levelExitListeners[i](this);
        }
    },

    /**
     * @param loc
     * @returns the tile coordinates at loc in the range [0, Level.TILE_SIZE-1]
     */
    getTileCoordsForLocation:function(loc) {
        var x = Math.floor(loc.x / Level.TILE_SIZE);
        var y = (Level.SIZE - 1) - Math.floor(loc.y / Level.TILE_SIZE);
        return cc.p(x, y);
    },

    /**
     * @param loc
     * @returns {cc.Sprite}
     */
    getTileSpriteForLocation:function(loc) {
        return this.allLayers()[0].getTileAt(this.getTileCoordsForLocation(loc));
    },

    /**
     * @param loc
     * @returns
     */
    getGIDAtPosition:function(loc) {
        return this.allLayers()[0].getTileGIDAt(this.getTileCoordsForLocation(loc));
    },

    /**
     * @param dt
     */
    update:function(dt) {
        if (!this.playerWalking && this.path.length > 0) {
            var actions = [];
            var targetTile = this.path.splice(0, 1)[0];
            var dx = -(targetTile[0] - this.playerTileCoords.x) * Level.TILE_SIZE * this.getScale();
            var dy =  (targetTile[1] - this.playerTileCoords.y) * Level.TILE_SIZE * this.getScale();

            var dir;
            if (dy < 0) { dir = zp.Direction.NORTH; }
            else if (dy > 0) { dir = zp.Direction.SOUTH; }
            else if (dx < 0) { dir = zp.Direction.EAST; }
            else if (dx > 0) { dir = zp.Direction.WEST; }

            actions.push(cc.callFunc(function(obj, data) {
                switch (data.dir) {
                    case zp.Direction.NORTH: { obj.player.walkNorth(); } break;
                    case zp.Direction.SOUTH: { obj.player.walkSouth(); } break;
                    case zp.Direction.WEST:  { obj.player.walkWest();  } break;
                    case zp.Direction.EAST:  { obj.player.walkEast();  } break;
                }
                obj.playerTileCoords.x = data.targetTile[0];
                obj.playerTileCoords.y = data.targetTile[1];
                obj.playerWalking = true;
            }, this, {dir:dir, targetTile:targetTile}));
            actions.push(cc.moveBy(Player.MOVE_SPEED, cc.p(dx, dy)));
            actions.push(cc.callFunc(function(obj, data) {
                obj.player.stopWalking();
                obj.playerWalking = false;
//                obj.setPosition(
//                    path[path.length-1][0] * Level.TILE_SIZE + Level.TILE_SIZE / 2,
//                    Level.SIZE*Level.TILE_SIZE - (path[path.length-1][1] * Level.TILE_SIZE + Level.TILE_SIZE / 2)
//                );
            }, this, targetTile));
            this.runAction(cc.sequence(actions));
        }
    }
});

Level.SIZE = 128;		// Levels are 128 tiles x 128 tiles
Level.NUM_ROOMS_ATTEMPTS = Level.SIZE * 8;

Level.SCALE = 3.0;
Level.TILE_SIZE = 16;
// the effective size of a tile will be 48 x 48 (3.0*16 x 3.0*16) pixels
