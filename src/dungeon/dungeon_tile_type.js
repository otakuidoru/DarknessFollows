var zp = zp || {};

/**
 *
 */
zp.DungeonTileType = {
    EMPTY : 0,
    STONE_FLOOR  : 1,
    STONE_WALL : 2,
    DOOR_CLOSED : 3,
    DOOR_OPEN : 4,
    STAIRS_UP : 17,
    STAIRS_DOWN : 6
};

/**
 * @param dungeonTileType
 */
zp.DungeonTileType.isEmpty = function(dungeonTileType) {
    return dungeonTileType == zp.DungeonTileType.EMPTY;
};

/**
 * @param dungeonTileType
 */
zp.DungeonTileType.isWalkable = function(dungeonTileType) {
    switch (dungeonTileType) {
        case zp.DungeonTileType.EMPTY: return false;
        case zp.DungeonTileType.STONE_FLOOR: return true;
        case zp.DungeonTileType.STONE_WALL: return false;
        case zp.DungeonTileType.DOOR_CLOSED: return false;
        case zp.DungeonTileType.DOOR_OPEN: return true;
        case zp.DungeonTileType.STAIRS_UP: return true;
        case zp.DungeonTileType.STAIRS_DOWN: return true;
    }
    return false;
};

/**
 * @param dungeonTileType
 */
zp.DungeonTileType.isFloor = function(dungeonTileType) {
    switch (dungeonTileType) {
        case zp.DungeonTileType.STONE_FLOOR: return true;
    }
    return false;
};

/**
 * @param dungeonTileType
 */
zp.DungeonTileType.isStairs = function(dungeonTileType) {
    switch (dungeonTileType) {
        case zp.DungeonTileType.STAIRS_UP: return true;
        case zp.DungeonTileType.STAIRS_DOWN: return true;
    }
    return false;
};
