class InputHandler {
  constructor() {
    this.keys = [];
    window.addEventListener('keydown', e => {
      if ((e.key === 'ArrowDown' || 
           e.key === 'ArrowUp' || 
           e.key === 'ArrowLeft' || 
           e.key === 'ArrowRight' ||
           e.key === 'Enter' || // Action key
           e.key === ' ') // Action key
          && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowDown' || 
          e.key === 'ArrowUp' || 
          e.key === 'ArrowLeft' || 
          e.key === 'ArrowRight' ||
          e.key === 'Enter' ||
          e.key === ' ') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}

export default InputHandler;
