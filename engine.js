// Tab Tank - Animation Engine
// This file is like the "HEART" of the extension. It keeps the time.

/**
 * THE ENGINE
 * This object is responsible for running the simulation over and over.
 */
const engine = {
    running: false, // This tells the computer if the engine is ON or OFF.

    /**
     * start: Flip the switch to ON and start the clock.
     */
    start() {
        if (this.running) return; // If already running, do nothing.
        this.running = true;
        this.loop();
    },

    /**
     * stop: Flip the switch to OFF.
     */
    stop() {
        this.running = false;
    },

    /**
     * THE LOOP
     * This is where the magic happens! 
     * It tells the computer: "Update the fish positions, then wait for the next frame and do it again!"
     * This happens about 60 times every second, which makes the movement look smooth.
     */
    loop() {
        if (!this.running) return;

        // 1. Tell the ecosystem to update everything
        ecosystem.update();

        // 2. Ask the browser: "When you're ready for the next frame, run this loop again!"
        requestAnimationFrame(() => this.loop());
    }
};


