var zp = zp || {};

/**
 *
 */
zp.OverworldTileType = {
    EMPTY : 0,
    GRASS_TILE_1  : 1,
    GRASS_TILE_2  : 2,
    GRASS_TILE_3  : 3,
    GRASS_TILE_4  : 4,
    GRASS_TILE_5  : 5,
    GRASS_TILE_6  : 6,
    GRASS_TILE_7  : 7,
    GRASS_TILE_8  : 8,
    GRASS_TILE_9  : 9,
    GRASS_TILE_10 : 10,
    GRASS_TILE_11 : 11,
    GRASS_TILE_12 : 12,
    GRASS_TILE_13 : 13,
    GRASS_TILE_14 : 14,
    GRASS_TILE_15 : 15,
    GRASS_TILE_16 : 16
};

/**
 * @param overworldTileType
 */
zp.OverworldTileType.isWalkable = function(overworldTileType) {
//    switch (tileType) {
//        case zp.TileType.EMPTY: return false;
//        case zp.TileType.STONE_FLOOR: return true;
//        case zp.TileType.STONE_WALL: return false;
//        case zp.TileType.DOOR_CLOSED: return false;
//        case zp.TileType.DOOR_OPEN: return true;
//        case zp.TileType.STAIRS_UP: return true;
//        case zp.TileType.STAIRS_DOWN: return true;
//    }
    return true;
};
