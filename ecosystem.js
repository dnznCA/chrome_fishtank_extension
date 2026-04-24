// Tab Tank - Ecosystem Logic

class Fish {
    constructor(canvas, ctx, assetName) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assetName = assetName;
        this.width = FISH_WIDTH * SCALE;
        this.height = FISH_HEIGHT * SCALE;
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.frameIdx = 0;
        this.frameTick = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (Math.random() < 0.01) this.vy += (Math.random() - 0.5) * 0.2;
        this.vy *= 0.99;

        if (this.y < 50) this.vy += 0.1;
        if (this.y > window.innerHeight - 50) this.vy -= 0.1;

        if (this.x > window.innerWidth + this.width) this.x = -this.width;
        if (this.x < -this.width) this.x = window.innerWidth + this.width;

        this.frameTick++;
        if (this.frameTick > 10) {
            this.frameTick = 0;
            this.frameIdx = (this.frameIdx + 1) % 3; // 3 frames in fish spritesheets
        }

        // DRAWING WITH IMAGES
        const img = ASSETS[this.assetName];
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        if (this.vx < 0) {
            this.ctx.translate(this.width, 0);
            this.ctx.scale(-1, 1);
        }

        // drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
        this.ctx.drawImage(
            img,
            this.frameIdx * this.width, 0, this.width, this.height,
            0, 0, this.width, this.height
        );
        this.ctx.restore();

        this.canvas.style.left = this.x + 'px';
        this.canvas.style.top = this.y + 'px';
    }
}

class Bubble {
    constructor(container) {
        this.el = document.createElement('div');
        this.el.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            pointer-events: none;
        `;
        container.appendChild(this.el);
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + 10;
        this.speed = 1 + Math.random() * 2;
    }

    update() {
        this.y -= this.speed;
        this.el.style.left = this.x + 'px';
        this.el.style.top = this.y + 'px';
        if (this.y < -10) this.reset();
    }
}

class Seaweed {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 16;
        this.canvas.height = 32;
        this.canvas.style.cssText = `position: absolute; bottom: 0; image-rendering: pixelated;`;
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.x = Math.random() * window.innerWidth;
        this.canvas.style.left = this.x + 'px';
        this.canvas.style.bottom = '0px';
    }

    update() {
        const img = ASSETS['seaweed'];
        this.ctx.clearRect(0, 0, 16, 32);
        this.ctx.drawImage(img, 0, 0);
    }
}

class Rock {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 32;
        this.canvas.height = 16;
        this.canvas.style.cssText = `position: absolute; bottom: 0; image-rendering: pixelated;`;
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.x = Math.random() * window.innerWidth;
        this.canvas.style.left = this.x + 'px';
    }

    update() {
        const img = ASSETS['rock'];
        this.ctx.clearRect(0, 0, 32, 16);
        this.ctx.drawImage(img, 0, 0);
    }
}

class Jellyfish {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = 7 * SCALE;
        this.height = 7 * SCALE;
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + 50;
        this.vy = -0.5 - Math.random() * 0.5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.frameIdx = 0;
        this.frameTick = 0;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.frameTick++;
        if (this.frameTick > 30) {
            this.frameTick = 0;
            this.frameIdx = (this.frameIdx + 1) % 2;
        }

        const img = ASSETS['jellyfish'];
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(
            img,
            this.frameIdx * this.width, 0, this.width, this.height,
            0, 0, this.width, this.height
        );

        this.canvas.style.left = this.x + 'px';
        this.canvas.style.top = this.y + 'px';
        if (this.y < -50) this.reset();
    }
}

const ecosystem = {
    fishes: [],
    bubbles: [],
    decorations: [],
    jellies: [],
    init(container) {
        const fishTypes = ['fish_orange', 'fish_yellow', 'fish_blue', 'fish_red'];
        for (let i = 0; i < 10; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            canvas.style.cssText = `position: absolute; image-rendering: pixelated;`;
            container.appendChild(canvas);
            this.fishes.push(new Fish(canvas, canvas.getContext('2d'), fishTypes[i % fishTypes.length]));
        }

        for (let i = 0; i < 3; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 7 * SCALE;
            canvas.height = 7 * SCALE;
            canvas.style.cssText = `position: absolute; image-rendering: pixelated;`;
            container.appendChild(canvas);
            this.jellies.push(new Jellyfish(canvas, canvas.getContext('2d')));
        }

        for (let i = 0; i < 20; i++) this.bubbles.push(new Bubble(container));
        for (let i = 0; i < 8; i++) this.decorations.push(new Seaweed(container));
        for (let i = 0; i < 4; i++) this.decorations.push(new Rock(container));
    },
    update() {
        this.fishes.forEach(f => f.update());
        this.jellies.forEach(j => j.update());
        this.bubbles.forEach(b => b.update());
        this.decorations.forEach(d => d.update());
    }
};
