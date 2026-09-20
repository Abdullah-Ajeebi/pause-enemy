const pauseEnemy = KeyBind.add("pause-enemy", KeyCode.p, "pause-enemy");
let wavesPaused = false;
let factoriesPaused = false;
let keyWasPressed = false;
let pauseButton = null;

function setEnemyFactoriesPaused(paused){
    if (!Vars.state.isPlaying()) return;

    Groups.build.each(b => {
        if (b.team != Vars.player.team() &&
            (b.block instanceof UnitFactory || b.block instanceof UnitAssembler)) {
            b.enabled = !paused;
        }
    });
}

function togglePause(){
    wavesPaused = !wavesPaused;
    factoriesPaused = !factoriesPaused;

    Vars.state.rules.waves = !wavesPaused;
    setEnemyFactoriesPaused(factoriesPaused);

    if (pauseButton != null) {
        pauseButton.setText(wavesPaused ? "[accent]||" : "[accent]> ");
    }
}

Events.run(Trigger.update, () => {
    let pauseKeyPressed = pauseEnemy.value.key != null && Core.input.keyDown(pauseEnemy.value.key);

    if (factoriesPaused) {
        setEnemyFactoriesPaused(true);
    }

    if (pauseKeyPressed && !keyWasPressed) {
        togglePause();
    }

    keyWasPressed = pauseKeyPressed;
});

if (!Vars.headless) {
    Events.on(ClientLoadEvent, () => {
        let hudButton = new Table();
        let button = hudButton.button("[accent]> ", togglePause).size(42).get();

        button.dragged((deltaX, deltaY) => hudButton.moveBy(deltaX, deltaY));

        Vars.ui.hudGroup.addChild(hudButton);
        hudButton.pack();
        hudButton.setPosition(8, (Core.graphics.getHeight() - hudButton.getHeight()) / 2);
        pauseButton = button;
    });
}
