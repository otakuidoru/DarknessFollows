/**
 * @see http://silentmatt.com/biginteger-docs/files/biginteger-js.html#BigInteger.BigInteger
 * @see https://github.com/growingdever/cocos2d-x-panzoomlayer
 */
var OverworldSector = cc.TMXTiledMap.extend({
    prng:null,
    player:null,

    /**
     * @param x
     * @param y
     */
    ctor:function(x, y) {
        // 1. initialize member variables

        this.prng = new RandomUtils((Dungeon.SEED + "" + num).hashCode());

        this.player = null;

//        var entranceX = 5;//Math.max(Math.min(parseInt(Math.floor(sites[i].x)), Level.SIZE-Level.BUFFER), Level.BUFFER);
//        var entranceY = 5;//Math.max(Math.min(parseInt(Math.floor(sites[i].y)), Level.SIZE-Level.BUFFER), Level.BUFFER);
//        var entranceRoomWidth = this.prng.randomInt(3, 5) * 2 + 1;	// FIXME
//        var entranceRoomHeight = this.prng.randomInt(3, 5) * 2 + 1;	// FIXME
//        cc.log("%s, %s", entranceRoomWidth, entranceRoomHeight);
//        for (var y=entranceY+Math.floor(-entranceRoomHeight/2); y<entranceY+Math.ceil(entranceRoomHeight/2); ++y) {
//            for (var x=entranceX+Math.floor(-entranceRoomWidth/2); x<entranceX+Math.ceil(entranceRoomWidth/2); ++x) {
//                tiles[y * Level.SIZE + x] = zp.TileType.STONE_FLOOR;
//            }
//        }

        // 1. Fill the whole map with solid earth
        var tiles = [];
        for (var x=0; x<Level.SIZE; ++x) {
            tiles[x] = [];
            for (var y=0; y<Level.SIZE; ++y) {
                tiles[x][y] = zp.TileType.EMPTY;
            }
        }

        // 2. Dig out a single room in the center of the map
        var firstRoom = new Room(this.prng.randomInt(5, 9), this.prng.randomInt(5, 9));
        this.rooms.push(firstRoom);
        var start_x = Math.floor(Level.SIZE / 2) - Math.floor(firstRoom.num_tiles_x / 2);
        var start_y = Math.floor(Level.SIZE / 2) - Math.floor(firstRoom.num_tiles_y / 2);
        for (var x=0; x<firstRoom.num_tiles_x; ++x) {
            for (var y=0; y<firstRoom.num_tiles_y; ++y) {
                tiles[start_x+x][start_y+y] = firstRoom.tiles[x][y];
            }
        }

//        var voronoi = new Voronoi();
//        var bbox = {xl: 0, xr: Level.SIZE, yt: 0, yb: Level.SIZE};
//        var sites = [];
//        for (var i=0; i<25; ++i) {
//            sites.push({ x:this.prng.randomInt(Level.SIZE), y:this.prng.randomInt(Level.SIZE) });
//        }
//        var diagram = voronoi.compute(sites, bbox);
//        voronoi.recycle(diagram);

//        while (this.getPercentageRoomsInLevel(tiles) < 0.75) {
//            const MIN_ROOM_SIZE = 5;
//            const MAX_ROOM_SIZE = 11;
//            var room_x = this.prng.randomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
//            var room_y = this.prng.randomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
//            var room = new Room(this.prng.randomInt(Level.SIZE-MAX_ROOM_SIZE-1), this.prng.randomInt(Level.SIZE-MAX_ROOM_SIZE-1));
//            cc.log("%s, %s, %s, %s", room_x, room_y, room.num_tiles_x, room.num_tiles_y);
//            for (var x=0; x<room.num_tiles_x; ++x) {
//                for (var y=0; y<room.num_tiles_y; ++y) {
//                    tiles[room_x+x][room_y+y] = room.tiles[x][y];
//                }
//            }
//        }

        for (var i=0; i<1; ++i) {
            // 3. Pick a wall of any room
            // get a random room
            var room = this.rooms[this.prng.randomInt(this.rooms.length)];
            var wall;
            // get a random wall of that random room
            var direction = this.prng.randomInt(4);
            switch (direction) {
                case 0: wall = room.getNorthernWall(); break;
                case 1: wall = room.getSouthernWall(); break;
                case 2: wall = room.getWesternWall(); break;
                case 3: wall = room.getEasternWall(); break;
            }

            // 4. Decide upon a new feature to build
            var feature;
            switch (this.prng.randomInt(3)) {
                case 0: {
                    if (direction == zp.Direction.NORTH || direction == zp.Direction.SOUTH) {
                        feature = new VerticalCorridor(this.prng.randomInt(3, 6));
                    } else {
                        feature = new HorizontalCorridor(this.prng.randomInt(3, 6));
                    }
                } break;
                case 1: feature = new Room(); break;
            }

            // 5. See if there is room to add the new feature through the chosen wall
            if (feature) {
                
            }
            // 6. If yes, continue. If no, go back to step 3
            // 7. Add the feature through the chosen wall
            // 8. Go back to step 3, until the dungeon is complete

            // 9. Add the up and down staircases at random points in map
            this.stairsUp = new StairsUp();
            this.addObjectAtTilePosition(4, 4, this.stairsUp);
            this.stairsDown = new StairsDown();
            this.addObjectAtTilePosition(5, 5, this.stairsDown);
//        
//            // 10. Finally, sprinkle some monsters and items liberally over dungeon
//            // TODO:
//        }

        // build up the XML data
        var xmlStr =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\""+Level.SIZE+"\" height=\""+Level.SIZE+"\" tilewidth=\"25\" tileheight=\"25\" nextobjectid=\"1\">" +
        " <tileset firstgid=\"1\" name=\"grid\" tilewidth=\"25\" tileheight=\"25\" tilecount=\"16\">" +
        "  <image source=\"tiles_25x25.png\" width=\"100\" height=\"100\"/>" +
        " </tileset>" +
        " <layer name=\"Tile Layer 1\" width=\""+Level.SIZE+"\" height=\""+Level.SIZE+"\">" +
        "  <data>";

        for (var y=0; y<Level.SIZE; ++y) {
            for (var x=0; x<Level.SIZE; ++x) {
                xmlStr += "<tile gid=\""+tiles[x][y]+"\"/>";
            }
        }

        xmlStr +=
        "  </data>" +
        " </layer>" +
        "</map>";

        this._super(xmlStr, "res");
        this.setScale(Level.SCALE);

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
                        if (zp.TileType.isWalkable(gid)) {
//                            var windSpell = new WindSpell();
//                            var tilePos = self.getTileSpriteForLocation(loc).getPosition();
//                            cc.log("%s, %s", tileCoords.x * Level.TILE_SIZE, tileCoords.y * Level.TILE_SIZE);
//                            windSpell.setPosition(tilePos.x, tilePos.y);
//                            self.addChild(windSpell);
//                            windSpell.runAction(new cc.Sequence([
//                                cc.delayTime(3),
//                                cc.callFunc(function(){
//                                    windSpell.removeFromParent();
//                                })
//                            ]));

                            // @see https://github.com/qiao/PathFinding.js/
                            var grid = new Grid(Level.SIZE, Level.SIZE);
                            var pathfinder = new AStarFinder();
                            cc.log("%s, %s", self.player.getPosition().x, self.player.getPosition().y);
                            var fromTileCoords = self.getTileCoordsForLocation(self.player.getPosition());
                            var toTileCoords = self.getTileCoordsForLocation(loc);
                            var path = pathfinder.findPath(fromTileCoords.x, fromTileCoords.y, toTileCoords.x, toTileCoords.y, grid);
                            var actions = [];
                            for (var i=0; i<path.length; ++i) {
                                var tile = self.allLayers()[0].getTileAt(cc.p(path[i][0], path[i][1]));
                                var actionMove = cc.MoveTo.create(Player.MOVE_SPEED, cc.p(tile.getPosition().x+Level.TILE_SIZE/2, tile.getPosition().y+Level.TILE_SIZE/2));
                                actions.push(actionMove);
                            }
                            actions.push(cc.callFunc(function(){
                                self.player.setPosition(
                                    path[path.length-1][0] * Level.TILE_SIZE + Level.TILE_SIZE / 2,
                                    Level.SIZE*Level.TILE_SIZE - (path[path.length-1][1] * Level.TILE_SIZE + Level.TILE_SIZE / 2)
                                );
                            }, this));
                            self.player.runAction(new cc.Sequence(actions));
                        }
                    }

                    self.isSwipeUp = self.isSwipeLeft = self.isSwipeRight = self.isSwipeDown = false;
                }
            }), this);
        } else {
            cc.log("TOUCH_ALL_AT_ONCE is not supported");
        }

        return true;
    },

    /**
     * @param tiles
     */
    getPercentageRoomsInLevel:function(tiles) {
        var numRoomTiles = 0;
        var totalTiles = Level.SIZE * Level.SIZE;
        for (var x=0; x<Level.SIZE; ++x) {
            for (var y=0; y<Level.SIZE; ++y) {
                numRoomTiles += (tiles[x][y] != zp.TileType.EMPTY) ? 1 : 0;
            }
        }
        return numRoomTiles / totalTiles;
    },

    getRandomWall:function(tiles) {
        while (true) {
            // get a random tile
        	var tileCoords =  cc.p(this.prng.randomInt(Level.SIZE), this.prng.randomInt(Level.SIZE));
            if (zp.TileType.isWall(tiles[x][y])) {
                // check north
                if (zp.TileType.isFloor(tiles[tileCoords.x][tileCoords.y+1])		// if the southern tile is a floor
                 && zp.TileType.EMPTY == tiles[tileCoords.x][tileCoords.y-1]) {		// and the northern tile is empty
                    return { x:tileCoords.x, y:tileCoords.y, dir:zp.Direction.NORTH };
                }
                // check south
                if (zp.TileType.isFloor(tiles[tileCoords.x][tileCoords.y-1])		// if the northern tile is a floor
                 && zp.TileType.EMPTY == tiles[tileCoords.x][tileCoords.y+1]) {		// and the southern tile is empty
                    return { x:tileCoords.x, y:tileCoords.y, dir:zp.Direction.SOUTH };
                }
                // check west
                if (zp.TileType.isFloor(tiles[tileCoords.x+1][tileCoords.y])		// if the eastern tile is a floor
                 && zp.TileType.EMPTY == tiles[tileCoords.x-1][tileCoords.y]) {		// and the western tile is empty
                    return { x:tileCoords.x, y:tileCoords.y, dir:zp.Direction.WEST };
                }
                // check east
                if (zp.TileType.isFloor(tiles[tileCoords.x-1][tileCoords.y])		// if the western tile is a floor
                 && zp.TileType.EMPTY == tiles[tileCoords.x+1][tileCoords.y]) {		// and the eastern tile is empty
                    return { x:tileCoords.x, y:tileCoords.y, dir:zp.Direction.EAST };
                }
            }
        }
    },

//    /**
//     * 
//     * @param {number} maxFeatures
//     * @returns
//     */
//    generate:function(maxFeatures) {
//        // place the first room in the center
//    	var direction = this.prng.randomInt(4);
//        if (!this.makeRoom(Level.SIZE / 2, Level.SIZE / 2, direction, true)) {
//            cc.log("Unable to place the first room.");
//            return;
//        }
//
//        // we already placed 1 feature (the first room)
//        for (var i=1; i<maxFeatures; ++i) {
//            if (!this.createFeature()) {
//                cc.log("Unable to place more features (placed %s).", i);
//                break;
//            }
//        }
//
//        if (!this.placeObject(stairsUp)) {
//            cc.log("Unable to place up stairs.");
//            return;
//        }
//
//        if (!this.placeObject(stairsDown)) {
//            cc.log("Unable to place down stairs.");
//            return;
//        }
//    },
//
//    /**
//     * @returns
//     */
//    createFeature:function() {
//        for (var i=0; i<1000; ++i) {
//            if (this._exits.size() == 0) {
//                break;
//            }
//
//            // choose a random side of a random room or corridor
//            var r = this.prng.randomInt(this._exits.size());
//            var x = this.prng.randomInt(this._exits[r].x, this._exits[r].x + this._exits[r].width - 1);
//            var y = this.prng.randomInt(this._exits[r].y, this._exits[r].y + this._exits[r].height - 1);
//
//            // north, south, west, east
//            for (var j=0; j<DirectionCount; ++j) {
//                var direction = this.prng.randomInt(j);
//                if (this.createFeature(x, y, direction)) {
//                	this._exits.erase(this._exits.begin() + r);
//   	                return true;
//   	            }
//   	        }
//        }
//
//        return false;
//    },
//
//    /**
//     * @param x
//     * @param y
//     * @param dir
//     * @returns
//     */
//    createFeature:function(x, y, dir) {
//        const roomChance = 50; // corridorChance = 100 - roomChance
//
//        var dx = 0;
//        var dy = 0;
//
//        if (dir == North) {
//            dy = 1;
//        } else if (dir == South) {
//            dy = -1;
//        } else if (dir == West) {
//            dx = 1;
//        } else if (dir == East) {
//            dx = -1;
//        }
//
//        if (this.getTile(x + dx, y + dy) != Floor && this.getTile(x + dx, y + dy) != Corridor) {
//            return false;
//        }
//
//        if (this.prng.randomInt(100) < roomChance) {
//            if (this.makeRoom(x, y, dir)) {
//            	this.setTile(x, y, ClosedDoor);
//
//                return true;
//            }
//        } else {
//            if (this.makeCorridor(x, y, dir)) {
//                if (this.getTile(x + dx, y + dy) == Floor) {
//                	this.setTile(x, y, ClosedDoor);
//                } else {	// don't place a door between corridors
//                	this.setTile(x, y, Corridor);
//                }
//
//                return true;
//            }
//        }
//
//        return false;
//    },
//
//    /**
//     * @param x
//     * @param y
//     * @param dir
//     * @param firstRoom
//     * @returns
//     */
//    makeRoom:function(x, y, dir, firstRoom) {
//        if (typeof firstRoom === "undefined") {
//            firstRoom = false;
//        }
//
//        const minRoomSize = 3;
//        const maxRoomSize = 6;
//
//        var room = cc.rect(0, 0, this.prng.randomInt(minRoomSize, maxRoomSize), this.prng.randomInt(minRoomSize, maxRoomSize));
//
//        if (dir == North) {
//            room.x = x - room.width / 2;
//            room.y = y - room.height;
//        } else if (dir == South) {
//            room.x = x - room.width / 2;
//            room.y = y + 1;
//        } else if (dir == West) {
//            room.x = x - room.width;
//            room.y = y - room.height / 2;
//        } else if (dir == East) {
//            room.x = x + 1;
//            room.y = y - room.height / 2;
//        }
//
//        if (this.placeRect(room, Floor)) {
//        	this._rooms.push(room);
//
//            if (dir != South || firstRoom) { // north side
//            	this._exits.push(cc.rect( room.x, room.y - 1, room.width, 1 ));
//            }
//            if (dir != North || firstRoom) { // south side
//            	this._exits.push(cc.rect( room.x, room.y + room.height, room.width, 1 ));
//            }
//            if (dir != East || firstRoom) { // west side
//            	this._exits.push(cc.rect( room.x - 1, room.y, 1, room.height ));
//            }
//            if (dir != West || firstRoom) { // east side
//            	this._exits.push(cc.rect( room.x + room.width, room.y, 1, room.height ));
//            }
//
//            return true;
//        }
//
//        return false;
//    },
//
//    /**
//     * @param x
//     * @param y
//     * @param dir
//     * @returns
//     */
//    makeCorridor:function(x, y, dir) {
//        const minCorridorLength = 5;
//        const maxCorridorLength = 9;
//
//        var corridor = cc.rect(x, y, 0, 0);
//
//        if (this.prng.randomBool()) {	// horizontal corridor
//            corridor.width = this.prng.randomInt(minCorridorLength, maxCorridorLength);
//            corridor.height = 1;
//
//            if (dir == zp.Direction.NORTH) {
//                corridor.y = y - 1;
//                if (this.prng.randomBool()) {	// west
//                    corridor.x = x - corridor.width + 1;
//                }
//            } else if (dir == zp.Direction.SOUTH) {
//                corridor.y = y + 1;
//                if (this.prng.randomBool()) {	// west
//                    corridor.x = x - corridor.width + 1;
//                }
//            } else if (dir == zp.Direction.WEST) {
//                corridor.x = x - corridor.width;
//            } else if (dir == zp.Direction.EAST) {
//                corridor.x = x + 1;
//            }
//        } else {	// vertical corridor
//            corridor.width = 1;
//            corridor.height = this.prng.randomInt(minCorridorLength, maxCorridorLength);
//
//            if (dir == zp.Direction.NORTH) {
//                corridor.y = y - corridor.height;
//            } else if (dir == zp.Direction.SOUTH) {
//                corridor.y = y + 1;
//            } else if (dir == zp.Direction.WEST) {
//                corridor.x = x - 1;
//                if (this.prng.randomBool()) {	// north
//                    corridor.y = y - corridor.height + 1;
//                }
//            } else if (dir == zp.Direction.EAST) {
//                corridor.x = x + 1;
//                if (this.prng.randomBool()) {	// north
//                    corridor.y = y - corridor.height + 1;
//                }
//            }
//        }
//
//        if (this.placeRect(corridor, Corridor)) {
//            if (dir != South && corridor.width != 1) { // north side
//            	this._exits.push(cc.rect( corridor.x, corridor.y - 1, corridor.width, 1 ));
//            }
//            if (dir != North && corridor.width != 1) { // south side
//            	this._exits.push(cc.rect( corridor.x, corridor.y + corridor.height, corridor.width, 1 ));
//            }
//            if (dir != East && corridor.height != 1) { // west side
//            	this._exits.push(cc.rect( corridor.x - 1, corridor.y, 1, corridor.height ));
//            }
//            if (dir != West && corridor.height != 1) { // east side
//            	this._exits.push(cc.rect( corridor.x + corridor.width, corridor.y, 1, corridor.height ));
//            }
//
//            return true;
//        }
//
//        return false;
//    },
//
//    /**
//     * @param rect
//     * @param tile
//     * @returns
//     */
//    placeRect:function(rect, tile) {
//        if (rect.x < 1 || rect.y < 1 || rect.x + rect.width > Level.SIZE - 1 || rect.y + rect.height > Level.SIZE - 1) {
//            return false;
//        }
//
//        for (var y=rect.y; y<rect.y+rect.height; ++y) {
//            for (var x=rect.x; x<rect.x+rect.width; ++x) {
//                if (this.getTile(x, y) != Unused) {
//                    return false; // the area already used
//                }
//            }
//        }
//
//        for (var y=rect.y-1; y<rect.y+rect.height+1; ++y) {
//            for (var x=rect.x-1; x<rect.x+rect.width+1; ++x) {
//                if (x == rect.x - 1 || y == rect.y - 1 || x == rect.x + rect.width || y == rect.y + rect.height) {
//                	this.setTile(x, y, Wall);
//                } else {
//                	this.setTile(x, y, tile);
//                }
//            }
//        }
//
//        return true;
//    },
//
//    /**
//     * @param tile
//     * @returns
//     */
//    placeObject:function(tile) {
//        if (this._rooms.length == 0) {
//            return false;
//        }
//
//        var r = this.prng.randomInt(this._rooms.length); // choose a random room
//        var x = this.prng.randomInt(this._rooms[r].x + 1, this._rooms[r].x + this._rooms[r].width - 2);
//        var y = this.prng.randomInt(this._rooms[r].y + 1, this._rooms[r].y + this._rooms[r].height - 2);
//
//        if (zp.TileType.isFloor(this.getTile(x, y))) {
//        	this.setTile(x, y, tile);
//
//            // place one object in one room (optional)
////        	this._rooms.erase(this._rooms.begin() + r);
//
//            return true;
//        }
//
//        return false;
//    },

    /**
     * @param x
     * @param y
     * @returns
     */
    getTile:function(x, y) {
//        return this.tiles[y * Level.SIZE + x];
        return getTileGIDAt(x, y);
    },

    /**
     * @param x
     * @param y
     * @param val
     */
    setTile:function(x, y, val) {
//        this.tiles[y * Level.SIZE + x] = val;
        this.setTileGID(val, x, y);
    },

    /**
     * @param tile_x
     * @param tile_y
     * @param obj
     */
    addObjectAtTilePosition:function(tile_x, tile_y, obj) {
        var tile = this.allLayers()[0].getTileAt(tile_x, tile_y);
        obj.attr({
            x:tile.getPosition().x + Level.TILE_SIZE / 2,
            y:tile.getPosition().y + Level.TILE_SIZE / 2
        });
        this.addChild(obj);
    },

    /**
     * @param player
     */
    setPlayer:function(player) {
        this.player = player;
        this.player.attr({
            x:this.stairsUp.x,
            y:this.stairsUp.y
        });
        this.addChild(this.player);
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
     * @returns
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
    }
});

OverworldSector.SIZE = 128;	// Levels are 128 tiles x 128 tiles
OverworldSector.TILE_SIZE = 25;
