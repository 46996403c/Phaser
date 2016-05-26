/**
 * Created by oscarXIII on 20/05/2016.
 */
/// <reference path="../Phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    return mainState;
}(Phaser.State));
var Objetos;
(function (Objetos) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            _super.apply(this, arguments);
            this.tag = null;
        }
        return Sprite;
    }(Phaser.Sprite));
    var Snake = (function (_super) {
        __extends(Snake, _super);
        function Snake(game, x, y, key, frame) {
            if (frame === void 0) { frame = null; }
            _super.call(this, game, x, y, key, frame);
            this.direccion = 'right';
            this.movimiento = 0;
            this.casillaSerpiente = [];
            this.nuevoObjeto = false;
            this.teclado = this.game.input.keyboard.createCursorKeys();
            for (var i = 0; i < 10; i++) {
                this.casillaSerpiente[i] = this.game.add.sprite(150 + i * 15, 150, 'serpiente');
            }
        }
        //Cabeza de la serpiente
        Snake.prototype.primeraCasilla = function () {
            return this.casillaSerpiente[this.casillaSerpiente.length - 1];
        };
        //cola de la serpiente
        Snake.prototype.ultimaCasilla = function () {
            return this.casillaSerpiente.shift();
        };
        //Direccion de ls serpiente
        Snake.prototype.direccionNueva = function () {
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
        };
        //funcion donde se indica que la serpiente puede chocar con ella misma
        Snake.prototype.colisionSerpiente = function () {
            var cabezaSerpiente = this.primeraCasilla();
            for (var i = 0; i < this.casillaSerpiente.length - 1; i++) {
                if (cabezaSerpiente.x == this.casillaSerpiente[i].x && cabezaSerpiente.y == this.casillaSerpiente[i].y) {
                    return true;
                }
            }
            return false;
        };
        //funcion donde se indica que la serpiente puede chocar con el mudno
        Snake.prototype.colisionMundo = function () {
            var cabezaSerpiente = this.primeraCasilla();
            return (cabezaSerpiente.x >= this.game.width || cabezaSerpiente.x < 0 || cabezaSerpiente.y >= this.game.height || cabezaSerpiente.y < 0);
        };
        //funcion donde se comprueba si la serpiente ha chocado
        Snake.prototype.comprobarColision = function () {
            return (this.colisionSerpiente() || this.colisionMundo());
        };
        //fincion que hace crecer a la serpiente al comerse una manzana
        Snake.prototype.augmentarSerpiente = function (ultimaCasilla) {
            this.casillaSerpiente.unshift(this.game.add.sprite(ultimaCasilla.x, ultimaCasilla.y, 'serpiente'));
        };
        Snake.prototype.update = function () {
            var nuevaDireccion = this.direccionNueva();
            var velocidad = Math.min(10, Math.floor(this.game.score / 5));
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
        };
        return Snake;
    }(Sprite));
    Objetos.Snake = Snake;
    var Pickup = (function (_super) {
        __extends(Pickup, _super);
        function Pickup() {
            _super.apply(this, arguments);
            this.tag = 'recolectable';
        }
        Pickup.prototype.spawn = function () {
            //de esta forma hacemos que aparezca aleaatoriamente la manzana en el mundo y que pueda ser cogida por la serpiente
            this.reset(Math.floor(Math.random() * 40) * 15, Math.floor(Math.random() * 30) * 15);
        };
        return Pickup;
    }(Sprite));
    Objetos.Pickup = Pickup;
})(Objetos || (Objetos = {}));
var Escenas;
(function (Escenas) {
    var Estado = (function (_super) {
        __extends(Estado, _super);
        function Estado(game) {
            _super.call(this);
            this.game = game;
        }
        Estado.prototype.preload = function () {
            this.game.load.image('menu', 'assets/menu.png');
            this.game.load.image('finJuego', 'assets/finJuego.png');
            this.game.load.image('serpiente', 'assets/serpiente.png');
            this.game.load.image('manzana', 'assets/manzana.png');
            this.game.load.image('logo', 'assets/logo.png');
            this.game.load.audio('battery', 'assets/audio/battery.wav');
            this.game.load.spritesheet('animacionSerpiente', 'assets/animSerpiente.png', 78, 65);
        };
        return Estado;
    }(Phaser.State));
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.create = function () {
            this.game.add.button(0, 0, 'menu', this.empezarJuego, this);
            //añado el sonido de cuando se empieza el juego y lo llamo battery, sacado del mismo phaser
            var battery = new Phaser.Sound(this.game, 0, 0, 'battery');
            this.battery = this.game.add.audio('battery');
            //dejo en segundo plano la carga del sonido para no colapsar el juego
            this.game.sound.setDecodedCallback([battery], start, this);
        };
        Menu.prototype.empezarJuego = function () {
            this.game.state.start('Game');
            //cuando empieza el juego suena el sonido, este es solo la primera vez que se ejecuta
            this.battery.play();
        };
        return Menu;
    }(Estado));
    Escenas.Menu = Menu;
})(Escenas || (Escenas = {}));
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 581, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map