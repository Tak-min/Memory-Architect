class GameObject {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update(deltaTime) {
        // To be implemented by child classes
    }

    draw(context) {
        // To be implemented by child classes
    }
}

export default GameObject;
