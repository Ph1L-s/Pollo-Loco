const level_1 = new Level(
    [
        new Enemy(),
        new Enemy(),
        new Enemy(),
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
        
        new BackgroundObject('assets/images/backgrounds/layers/air.png', 720),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 720),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 720),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 720),

        new BackgroundObject('assets/images/backgrounds/layers/air.png', 1440),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 1440),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 1440),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 1440),

        new BackgroundObject('assets/images/backgrounds/layers/air.png', 2160),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 2160),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 2160),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 2160),
        
    ],
);