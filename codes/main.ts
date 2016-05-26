/**
 * Created by oscarXIII on 20/05/2016.
 */
/// <reference path="../Phaser/phaser.d.ts"/>


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

module Objetos {
    class Sprite extends Phaser.Sprite {
        game: Snake;
        public tag: string = null;
    }
    export class Snake extends Sprite {
        private teclado: Phaser.CursorKeys;
        private direccion: string = 'right';
        private movimiento: any = 0;
        public casillaSerpiente: Array<Phaser.Sprite> = [];
        public nuevoObjeto: boolean = false;
        constructor(game, x, y, key, frame = null) {
            super(game, x, y, key, frame);
            this.teclado = this.game.input.keyboard.createCursorKeys();
            for (var i = 0; i < 10; i++) {
                this.casillaSerpiente[i] = this.game.add.sprite(150 + i * 15, 150, 'serpiente');
            }
        }
        //Cabeza de la serpiente
        public primeraCasilla(): any {
            return this.casillaSerpiente[this.casillaSerpiente.length - 1];
        }
        //cola de la serpiente
        public ultimaCasilla(): any {
            return this.casillaSerpiente.shift();
        }
        //Direccion de ls serpiente
        private direccionNueva() : string {
            if (this.teclado.right.isDown && this.direccion != 'left') {
                return 'right';
            }
            else if (this.teclado.left.isDown && this.direccion != 'right') {
                return 'left';
            }
            else if (this.teclado.up.isDown && this.direccion != 'down') {
                return 'up';
            }
            else if (this.teclado.down.isDown && this.direccion != 'up') {
                return 'down';
            }
            return null;
        }
        //funcion donde se indica que la serpiente puede chocar con ella misma
        private colisionSerpiente() : boolean {
            var cabezaSerpiente: any = this.primeraCasilla();
            for (var i = 0; i < this.casillaSerpiente.length - 1; i++) {
                if (cabezaSerpiente.x == this.casillaSerpiente[i].x && cabezaSerpiente.y == this.casillaSerpiente[i].y) {
                    return true;
                }
            }
            return false;
        }
        //funcion donde se indica que la serpiente puede chocar con el mudno
        private colisionMundo() : boolean {
            var cabezaSerpiente: any = this.primeraCasilla();
            return (cabezaSerpiente.x >= this.game.width || cabezaSerpiente.x < 0 || cabezaSerpiente.y >= this.game.height || cabezaSerpiente.y < 0);
        }
        //funcion donde se comprueba si la serpiente ha chocado
        public comprobarColision() : boolean {
            return (this.colisionSerpiente() || this.colisionMundo());
        }
        //fincion que hace crecer a la serpiente al comerse una manzana
        public augmentarSerpiente(ultimaCasilla) {
            this.casillaSerpiente.unshift(this.game.add.sprite(ultimaCasilla.x, ultimaCasilla.y, 'serpiente'));
        }
        update() {
            var nuevaDireccion: string = this.direccionNueva();
            var velocidad: any = Math.min(10, Math.floor(this.game.score / 5));
            this.movimiento++;
            if (this.movimiento % (10 - velocidad) == 0) {
                var primeraCasilla = this.primeraCasilla();
                var ultimaCasilla = this.ultimaCasilla();
                if (this.nuevoObjeto) {
                    this.augmentarSerpiente(ultimaCasilla);
                    this.nuevoObjeto = false;
                }
                this.direccion = (nuevaDireccion) ? nuevaDireccion : this.direccion;
                switch (this.direccion) {
                    case 'right':
                        ultimaCasilla.x = primeraCasilla.x + 15;
                        ultimaCasilla.y = primeraCasilla.y;
                        break;
                    case 'left':
                        ultimaCasilla.x = primeraCasilla.x - 15;
                        ultimaCasilla.y = primeraCasilla.y;
                        break;
                    case 'up':
                        ultimaCasilla.x = primeraCasilla.x;
                        ultimaCasilla.y = primeraCasilla.y - 15;
                        break;
                    case 'down':
                        ultimaCasilla.x = primeraCasilla.x;
                        ultimaCasilla.y = primeraCasilla.y + 15;
                        break;
                }
                this.casillaSerpiente.push(ultimaCasilla);
            }
            //si se choca se cambia al estado de fin del juego
            if (this.comprobarColision()) {
                this.game.state.start('FinJuego');
            }
        }
    }
    export class Pickup extends Sprite {
        public tag: string = 'recolectable';
        public spawn() {
            //de esta forma hacemos que aparezca aleaatoriamente la manzana en el mundo y que pueda ser cogida por la serpiente
            this.reset(Math.floor(Math.random()*40)*15, Math.floor(Math.random()*30)*15);
        }
    }
}
module Escenas{
    class Estado extends Phaser.State {
        game: Snake;
        constructor(game: Snake) {
            super();
            this.game = game;
        }
        preload() {
            this.game.load.image('menu', 'assets/menu.png');
            this.game.load.image('finJuego', 'assets/finJuego.png');
            this.game.load.image('serpiente', 'assets/serpiente.png');
            this.game.load.image('manzana', 'assets/manzana.png');
            this.game.load.image('logo', 'assets/logo.png');
            this.game.load.audio('battery', 'assets/audio/battery.wav');
            this.game.load.spritesheet('animacionSerpiente', 'assets/animSerpiente.png', 78, 65);
        }
    }
    export class Menu extends Estado {
        private battery: Phaser.Sound;
        create() {
            this.game.add.button(0, 0, 'menu', this.empezarJuego, this);
            //añado el sonido de cuando se empieza el juego y lo llamo battery, sacado del mismo phaser
            var battery = new Phaser.Sound(this.game, 0, 0, 'battery');
            this.battery = this.game.add.audio('battery');
            //dejo en segundo plano la carga del sonido para no colapsar el juego
            this.game.sound.setDecodedCallback([ battery ], start, this);
        }
        empezarJuego() {
            this.game.state.start('Game');
            //cuando empieza el juego suena el sonido, este es solo la primera vez que se ejecuta
            this.battery.play();
        }
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