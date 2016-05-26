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
})(Objetos || (Objetos = {}));
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