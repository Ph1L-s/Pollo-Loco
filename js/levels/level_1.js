/**
 * @summary creates and configures first game level with enemies and background layers
 * @description factory function assembling level 1 with 3 enemies, 1 boss, cloud, and 4-section parallax background
 * @returns {Level} configured level instance ready for world initialization
 */
function createLevel1() {
    return new Level(
        [
            new Enemy(),
            new Enemy(),
            new Enemy(),
            new SmallEnemy(),
            new SmallEnemy(),
            new SmallEnemy(),
            new SmallEnemy(),
            new BossEntity()
        ],
        [
            new Cloud()
        ],
        [
            new BackgroundObject('assets/images/backgrounds/layers/air.png', 0),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 0),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 0),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 0),
            
            new BackgroundObject('assets/images/backgrounds/layers/air.png', 719),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 719),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 719),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 719),

            new BackgroundObject('assets/images/backgrounds/layers/air.png', 1439),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 1439),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 1439),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 1439),

            new BackgroundObject('assets/images/backgrounds/layers/air.png', 2159),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 2159),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 2159),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 2159),

            new BackgroundObject('assets/images/backgrounds/layers/air.png', 2879),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 2879),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 2879),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 2879),

            new BackgroundObject('assets/images/backgrounds/layers/air.png', 3599),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 3599),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 3599),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 3599),

            new BackgroundObject('assets/images/backgrounds/layers/air.png', 4319),
            new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 4319),
            new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 4319),
            new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 4319),
            
        ],
    );
}