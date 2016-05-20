/**
 * Created by oscarXIII on 20/05/2016.
 */
/// <reference path="Phaser/phaser.d.ts"/>


class mainState extends Phaser.State {
    game: Phaser.Game;

    preload():void {
        super.preload();
    }

    create():void {
        super.create();

    }

    update():void {
        super.update();
    }
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 581, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};