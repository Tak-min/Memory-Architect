// main.js
import { GameEngine } from './src/modules/gameEngine.js';
import { RumorSystem } from './src/modules/rumorSystem.js';
import { CustomerSystem } from './src/modules/customerSystem.js';
import { UIController } from './src/modules/uiController.js';

const gameEngine = new GameEngine();
const rumorSystem = new RumorSystem();
const customerSystem = new CustomerSystem();
const uiController = new UIController();

uiController.setupDragAndDrop();
