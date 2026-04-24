// Tab Tank - Entry Point

(async function () {
  if (document.getElementById('tab-tank-container')) return;

  // 1. Create the Tank Container
  const container = document.createElement('div');
  container.id = 'tab-tank-container';
  container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 2147483647;
        overflow: hidden;
        background: radial-gradient(circle at 50% 50%, rgba(80, 150, 255, 0.05) 0%, rgba(0, 50, 150, 0.1) 100%);
        transition: background 2s ease;
    `;
  document.body.appendChild(container);

  // 2. Load Assets (Images/Spritesheets)
  // This is new! We wait for everything to be ready before starting.
  console.log("Tab Tank: Loading assets...");
  await loadAllAssets();
  console.log("Tab Tank: Assets ready, starting ecosystem.");

  // 3. Set up the Ecosystem
  ecosystem.init(container);

  // 4. Start the Engine
  engine.start();

  // 5. Handle Resize
  window.addEventListener('resize', () => {
    // Elements automatically adjust
  });
})();
