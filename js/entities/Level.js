/**
 * @class Level
 * @summary level data container holding enemies, environment objects, and boundaries
 * @description simple data structure organizing level content for world initialization
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 4000;

    /**
     * @summary initializes level with entity arrays and world boundaries
     * @description creates level instance with organized game objects for world setup
     * @param {Array<Enemy>} enemies - array of enemy entities for level
     * @param {Array<Cloud>} clouds - array of cloud background objects
     * @param {Array<BackgroundObject>} backgroundObjects - array of background layer images
     */
    constructor(enemies, clouds, backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    };
}