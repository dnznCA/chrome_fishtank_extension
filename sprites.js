// Tab Tank - Sprites and Assets
// This file now handles loading IMAGES but keeps our "Paint-by-Numbers" maps as a backup!

/**
 * ASSETS: This object will hold our loaded images.
 * If an image file isn't found, it will use a "Virtual Image" made from our pixel maps.
 */
const ASSETS = {
    fish_orange: null,
    fish_yellow: null,
    fish_blue: null,
    fish_red: null,
    jellyfish: null,
    seaweed: null,
    rock: null
};

/**
 * loadAllAssets: This function tries to load every image file.
 * If a file is missing, it falls back to the old pixel map system.
 */
async function loadAllAssets() {
    const assetNames = Object.keys(ASSETS);

    const loadPromises = assetNames.map(async (name) => {
        try {
            // Try to load the .png file from the assets folder
            const img = new Image();
            // chrome.runtime.getURL helps us find files inside our extension folder
            img.src = chrome.runtime.getURL(`assets/${name}.png`);

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            ASSETS[name] = img;
            console.log(`Tab Tank: Loaded ${name}.png successfully!`);
        } catch (err) {
            console.warn(`Tab Tank: ${name}.png not found, using pixel-map fallback.`);
            // If the image fails, we create a "Virtual Image" from our hardcoded maps
            ASSETS[name] = createFallbackAsset(name);
        }
    });

    return Promise.all(loadPromises);
}

/**
 * createFallbackAsset: If the image file is missing, we draw our 
 * hardcoded pixel maps onto a hidden canvas and use THAT as the image.
 */
function createFallbackAsset(name) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // We determine what to draw based on the asset name
    if (name.startsWith('fish')) {
        canvas.width = W * 3; // 3 frames wide
        canvas.height = H;
        const color = name.includes('orange') ? PALETTE['2'] :
            name.includes('yellow') ? PALETTE['3'] :
                name.includes('blue') ? PALETTE['4'] : PALETTE['6'];

        // Draw all 3 frames side-by-side onto one "spritesheet" canvas
        fishFrames.forEach((frame, i) => {
            drawMapToCtx(ctx, frame, i * W, 0, color, FISH_WIDTH, FISH_HEIGHT, SCALE);
        });
    } else if (name === 'jellyfish') {
        canvas.width = (7 * SCALE) * 2; // 2 frames wide
        canvas.height = (7 * SCALE);
        jellyfishFrames.forEach((frame, i) => {
            drawMapToCtx(ctx, frame, i * (7 * SCALE), 0, null, 7, 7, SCALE);
        });
    } else if (name === 'seaweed') {
        canvas.width = 4 * 4;
        canvas.height = 8 * 4;
        drawMapToCtx(ctx, seaweedFrames[0], 0, 0, null, 4, 8, 4);
    } else if (name === 'rock') {
        canvas.width = 32;
        canvas.height = 16;
        drawMapToCtx(ctx, rockFrame, 0, 0, null, 8, 4, 4);
    }

    return canvas; // The canvas acts just like an Image object!
}

/**
 * drawMapToCtx: This is our old pixel-drawing logic, now used to create fallbacks.
 */
function drawMapToCtx(ctx, frameData, offsetX, offsetY, colorMap, width, height, scale) {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            let char = frameData[row][col];
            let color = PALETTE[char];
            if (char === '2' && colorMap) color = colorMap;
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(offsetX + (col * scale), offsetY + (row * scale), scale, scale);
            }
        }
    }
}

// --- KEEPING THE OLD DATA AS A SAFETY NET (Fallbacks) ---

const PALETTE = {
    '0': null,
    '1': '#1a1a1a',
    '2': '#ff9933',
    '3': '#ffff66',
    '4': '#33ccff',
    '5': '#ffffff',
    '6': '#ff3333',
    '7': '#33cc33',
    '8': '#228b22',
    '9': '#8B4513',
};

const SCALE = 2;
const FISH_WIDTH = 16;
const FISH_HEIGHT = 10;
const W = FISH_WIDTH * SCALE;
const H = FISH_HEIGHT * SCALE;

const fishFrames = [
    ['0000000000000000', '0000111111000000', '0001222222110000', '0112222222221000', '1222222225522100', '1222222222222100', '0112222222221000', '0001222222110000', '0000111111000000', '0000000000000000'],
    ['0000000000000000', '0000111111000000', '0001222222100000', '0112222222211000', '1222222225522100', '1222222222221100', '0112222222211000', '0001222222100000', '0000111111000000', '0000000000000000'],
    ['0000000000000000', '0000111111000000', '0001222222110000', '0112222222221000', '1222222225522100', '1222222222222100', '0112222222221000', '0001222222110000', '0000111111000000', '0000000000000000']
];

const seaweedFrames = [['0000', '0770', '0770', '7777', '7777', '0770', '0770', '0770']];
const rockFrame = ['00011100', '00199910', '01999991', '19999999'];
const jellyfishFrames = [
    ['0044400', '0455540', '4555554', '4555554', '0444440', '0404040', '0404040'],
    ['0044400', '0455540', '4555554', '4555554', '0444440', '4040404', '4040404']
];
