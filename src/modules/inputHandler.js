export class InputHandler {
  constructor(canvas) {
    this.keys = new Set();
    
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });

    // Handle mouse/touch inputs on canvas if needed
    canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
    });
  }

  getMoveDirection() {
    let dx = 0;
    let dy = 0;

    if (this.keys.has('ArrowLeft') || this.keys.has('a')) dx--;
    if (this.keys.has('ArrowRight') || this.keys.has('d')) dx++;
    if (this.keys.has('ArrowUp') || this.keys.has('w')) dy--;
    if (this.keys.has('ArrowDown') || this.keys.has('s')) dy++;

    // Normalize diagonal movement
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx /= length;
      dy /= length;
    }

    return { x: dx, y: dy };
  }

  isActionPressed() {
    return this.keys.has('Enter') || this.keys.has(' ');
  }

  handleCanvasClick(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(`Canvas clicked at: x=${x}, y=${y}`);
    // This can be used for UI interaction on the canvas later
  }
}