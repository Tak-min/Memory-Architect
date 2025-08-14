// ユーザー管理クラス
class UserManager {
    constructor() {
        this.currentUser = null;
        this.isGuest = false;
        this.users = JSON.parse(localStorage.getItem('memoryArchitectUsers') || '{}');
        this.rankings = JSON.parse(localStorage.getItem('memoryArchitectRankings') || '[]');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        document.getElementById('guestBtn').addEventListener('click', () => this.playAsGuest());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        document.getElementById('shopBtn').addEventListener('click', () => this.openShop());
        document.getElementById('rankingBtn').addEventListener('click', () => this.openRanking());
        document.getElementById('closeShopBtn').addEventListener('click', () => this.closeShop());
        document.getElementById('closeRankingBtn').addEventListener('click', () => this.closeRanking());
        document.getElementById('openShopInGame').addEventListener('click', () => this.openShop());
    }
    
    login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('ユーザー名とパスワードを入力してください。');
            return;
        }
        
        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = this.users[username];
            this.isGuest = false;
            this.showMainMenu();
        } else {
            alert('ユーザー名またはパスワードが正しくありません。');
        }
    }
    
    register() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('ユーザー名とパスワードを入力してください。');
            return;
        }
        
        if (this.users[username]) {
            alert('このユーザー名は既に使用されています。');
            return;
        }
        
        this.users[username] = {
            id: Date.now().toString(),
            username: username,
            password: password,
            currency: 0,
            bestScore: 0,
            totalPlayed: 0,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('memoryArchitectUsers', JSON.stringify(this.users));
        
        this.currentUser = this.users[username];
        this.isGuest = false;
        this.showMainMenu();
    }
    
    playAsGuest() {
        this.currentUser = null;
        this.isGuest = true;
        this.showMainMenu();
    }
    
    logout() {
        this.currentUser = null;
        this.isGuest = false;
        document.getElementById('menuOverlay').style.display = 'none';
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('gameScreen').style.display = 'none';
        
        // フィールドをクリア
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
    
    showMainMenu() {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('menuOverlay').style.display = 'flex';
        
        // ウェルカムメッセージの更新
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (this.isGuest) {
            welcomeMsg.textContent = 'ゲストプレイ - 一部機能制限あり';
        } else {
            welcomeMsg.textContent = `ようこそ、${this.currentUser.username}さん！`;
        }
        
        // ボタンの表示/非表示
        const shopBtn = document.getElementById('shopBtn');
        const rankingBtn = document.getElementById('rankingBtn');
        const openShopInGame = document.getElementById('openShopInGame');
        
        if (this.isGuest) {
            shopBtn.style.display = 'none';
            rankingBtn.style.display = 'none';
            openShopInGame.style.display = 'none';
        } else {
            shopBtn.style.display = 'block';
            rankingBtn.style.display = 'block';
            openShopInGame.style.display = 'block';
        }
    }
    
    openShop() {
        if (this.isGuest) return;
        
        document.getElementById('menuOverlay').style.display = 'none';
        document.getElementById('shopOverlay').style.display = 'flex';
        this.updateShopDisplay();
    }
    
    closeShop() {
        document.getElementById('shopOverlay').style.display = 'none';
        document.getElementById('menuOverlay').style.display = 'flex';
    }
    
    openRanking() {
        if (this.isGuest) return;
        
        document.getElementById('menuOverlay').style.display = 'none';
        document.getElementById('rankingOverlay').style.display = 'flex';
        this.updateRankingDisplay();
    }
    
    closeRanking() {
        document.getElementById('rankingOverlay').style.display = 'none';
        document.getElementById('menuOverlay').style.display = 'flex';
    }
    
    updateShopDisplay() {
        if (!this.currentUser) return;
        
        document.getElementById('shopCurrency').textContent = this.currentUser.currency;
        
        // ショップアイテムにクリックイベントを追加
        document.querySelectorAll('.shop-item').forEach(item => {
            item.removeEventListener('click', this.handleShopItemClick);
            item.addEventListener('click', (e) => this.handleShopItemClick(e));
        });
    }
    
    handleShopItemClick = (e) => {
        const itemElement = e.currentTarget;
        const itemType = itemElement.dataset.item;
        const priceText = itemElement.querySelector('.item-price').textContent;
        const price = parseInt(priceText.replace('💰 ', ''));
        
        if (this.currentUser.currency >= price) {
            this.currentUser.currency -= price;
            this.saveUserData();
            this.updateShopDisplay();
            
            // アイテムをゲームに適用
            if (window.memoryGame) {
                window.memoryGame.applyShopItem(itemType);
            }
            
            alert('アイテムを購入しました！');
        } else {
            alert('メモリーコインが不足しています。');
        }
    }
    
    updateRankingDisplay() {
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = '';
        
        // ランキングを降順でソート
        const sortedRankings = [...this.rankings].sort((a, b) => b.score - a.score);
        
        if (sortedRankings.length === 0) {
            rankingList.innerHTML = '<p style="text-align: center; color: #a0a8b0;">まだランキングデータがありません</p>';
            return;
        }
        
        sortedRankings.slice(0, 10).forEach((ranking, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.className = `ranking-item ${index < 3 ? 'top3' : ''}`;
            
            rankingItem.innerHTML = `
                <div class="ranking-position">${index + 1}</div>
                <div class="ranking-player">${ranking.username}</div>
                <div class="ranking-score">${ranking.score}魂</div>
            `;
            
            rankingList.appendChild(rankingItem);
        });
    }
    
    addCurrency(amount) {
        if (!this.isGuest && this.currentUser) {
            this.currentUser.currency += amount;
            this.saveUserData();
        }
    }
    
    updateRanking(score) {
        if (!this.isGuest && this.currentUser) {
            // ベストスコア更新
            if (score > this.currentUser.bestScore) {
                this.currentUser.bestScore = score;
            }
            
            this.currentUser.totalPlayed++;
            this.saveUserData();
            
            // ランキングに追加
            this.rankings.push({
                userId: this.currentUser.id,
                username: this.currentUser.username,
                score: score,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('memoryArchitectRankings', JSON.stringify(this.rankings));
        }
    }
    
    saveUserData() {
        if (this.currentUser) {
            this.users[this.currentUser.username] = this.currentUser;
            localStorage.setItem('memoryArchitectUsers', JSON.stringify(this.users));
        }
    }
}

// チュートリアル管理クラス
class TutorialManager {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: "Memory Architectへようこそ",
                content: `
                    <div class="tutorial-step">
                        <h3>🧠 あなたは記憶アーキテクト</h3>
                        <p>この都市では、記憶が貴重なリソースです。市民は特定の種類の記憶を必要として、満足感と幸福感を得ています。</p>
                    </div>
                `
            },
            {
                title: "記憶の種類を理解する",
                content: `
                    <div class="tutorial-step">
                        <h3>💖 6つの記憶タイプ</h3>
                        <p><strong>愛：</strong> ロマンスや家族の記憶<br>
                        <strong>知識：</strong> 学習と発見<br>
                        <strong>冒険：</strong> 探検と挑戦<br>
                        <strong>平和：</strong> 静穏で安らぎの瞬間<br>
                        <strong>郷愁：</strong> ほろ苦い過去の記憶<br>
                        <strong>勇気：</strong> 勇敢で英雄的な瞬間</p>
                    </div>
                `
            },
            {
                title: "市民の管理",
                content: `
                    <div class="tutorial-step">
                        <h3>👥 市民の行動</h3>
                        <p>市民は都市を移動する色付きの四角形として表示されます。各市民は特定の種類の記憶を必要としています。</p>
                        <p><strong>市民の上に表示される色付きアイコン</strong>は、必要な記憶タイプを示しています。</p>
                        <p><strong>市民の色は満足度を示します：</strong><br>
                        🟢 緑 = とても満足<br>
                        🟡 黄 = 普通の満足<br>
                        🔴 赤 = 注意が必要</p>
                    </div>
                `
            },
            {
                title: "記憶建物の操作",
                content: `
                    <div class="tutorial-step">
                        <h3>🏢 記憶保管建物</h3>
                        <p>建物は異なる種類の記憶を保管・配布します。</p>
                        <p><strong>建物をクリック</strong>して、あなたの在庫から建物の保管庫に記憶を転送します。</p>
                        <p>建物の下部にある<strong>白いバー</strong>は保管レベルを示しています。</p>
                        <p>市民は必要な記憶タイプを持つ建物を自動的に訪問します。</p>
                    </div>
                `
            },
            {
                title: "満足サイクル",
                content: `
                    <div class="tutorial-step">
                        <h3>✨ 魂の充実</h3>
                        <p>市民が必要な記憶を受け取ると、満足感を得て美しい色で光り始めます。</p>
                        <p>30秒間満足した後、充実した市民は火花となって溶け、昇天し、新しい魂のためのスペースを作ります。</p>
                        <p><strong>目標：</strong> できるだけ多くの市民が充実感を得られるよう支援しましょう！</p>
                    </div>
                `
            },
            {
                title: "始める準備ができました！",
                content: `
                    <div class="tutorial-step">
                        <h3>🎮 準備完了！</h3>
                        <p>建物をクリックして記憶を配布することから始めましょう。市民の満足度レベルを監視し、みんなを幸せに保つよう努力してください。</p>
                        <p>新しい記憶は時間の経過と共に自動的に生成されますが、賢く管理してください。</p>
                        <p><strong>覚えておいて：</strong> 建物にマウスを合わせると、役立つ情報が表示されるツールチップを見ることができます！</p>
                    </div>
                `
            }
        ];
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('tutorialBtn').addEventListener('click', () => this.startTutorial());
        document.getElementById('tutorialNext').addEventListener('click', () => this.nextStep());
        document.getElementById('tutorialPrev').addEventListener('click', () => this.previousStep());
        document.getElementById('tutorialSkip').addEventListener('click', () => this.skipTutorial());
    }
    
    startTutorial() {
        this.currentStep = 0;
        document.getElementById('menuOverlay').style.display = 'none';
        document.getElementById('tutorialOverlay').classList.add('active');
        this.showStep();
    }
    
    showStep() {
        const step = this.steps[this.currentStep];
        const content = document.getElementById('tutorialContent');
        content.innerHTML = step.content;
        
        document.querySelector('.tutorial-title').textContent = step.title;
        
        document.getElementById('tutorialPrev').style.display = this.currentStep > 0 ? 'block' : 'none';
        document.getElementById('tutorialNext').textContent = this.currentStep < this.steps.length - 1 ? '次へ' : 'ゲーム開始！';
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep();
        } else {
            this.endTutorial();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
    }
    
    skipTutorial() {
        this.endTutorial();
    }
    
    endTutorial() {
        document.getElementById('tutorialOverlay').classList.remove('active');
        document.getElementById('gameScreen').style.display = 'block';
        if (window.memoryGame) {
            window.memoryGame.startGame();
        }
    }
}

// メインゲームクラス
class MemoryArchitectGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');
        
        // ゲーム状態
        this.gameTime = 0;
        this.satisfaction = 0; // 0%から開始
        this.memories = { love: 10, knowledge: 8, adventure: 6, peace: 9, nostalgia: 5, courage: 7 };
        this.dissolvedCitizens = 0;
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameSpeed = 1; // 1x, 2x, 3x
        this.currency = 0;
        this.lastSatisfaction = 0;
        
        // アクティブアイテム
        this.activeItems = [];
        
        // ゲームオブジェクト
        this.buildings = [];
        this.citizens = [];
        this.memoryOrbs = [];
        this.dissolveEffects = [];
        this.particles = [];
        
        // マウス状態
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        
        // オフライン進行
        this.offlineProgress = false;
        this.lastActiveTime = Date.now();
        
        this.initializeAssets();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    initializeAssets() {
        // 建物のピクセルアートパターンを作成
        this.buildingPatterns = {};
        this.createBuildingPatterns();
    }
    
    createBuildingPatterns() {
        const memoryTypes = ['love', 'knowledge', 'adventure', 'peace', 'nostalgia', 'courage'];
        memoryTypes.forEach(type => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            this.drawBuildingPattern(ctx, type);
            this.buildingPatterns[type] = canvas;
        });
    }
    
    drawBuildingPattern(ctx, type) {
        const colors = this.getMemoryColorPalette(type);
        
        // 建物のベース
        ctx.fillStyle = colors.primary;
        ctx.fillRect(0, 0, 64, 64);
        
        // 建物の詳細
        ctx.fillStyle = colors.secondary;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillRect(8 + i * 12, 8 + j * 12, 8, 8);
                }
            }
        }
        
        // 建物のアウトライン
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 60, 60);
        
        // 上部の記憶クリスタル
        ctx.fillStyle = colors.accent;
        ctx.fillRect(28, 4, 8, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, 6, 4, 4);
    }
    
    getMemoryColorPalette(type) {
        const palettes = {
            love: { primary: '#ff69b4', secondary: '#ff1493', accent: '#ffffff' },
            knowledge: { primary: '#4169e1', secondary: '#0000cd', accent: '#87ceeb' },
            adventure: { primary: '#ff8c00', secondary: '#ff6347', accent: '#ffd700' },
            peace: { primary: '#98fb98', secondary: '#00ff7f', accent: '#ffffff' },
            nostalgia: { primary: '#dda0dd', secondary: '#9370db', accent: '#ffffff' },
            courage: { primary: '#dc143c', secondary: '#b22222', accent: '#ffd700' }
        };
        return palettes[type] || palettes.love;
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', () => this.mouseDown = false);
        
        document.getElementById('startGameBtn').addEventListener('click', () => {
            document.getElementById('menuOverlay').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            this.startGame();
        });
        
        // 速度制御
        document.getElementById('speed1x').addEventListener('click', () => this.setGameSpeed(1));
        document.getElementById('speed2x').addEventListener('click', () => this.setGameSpeed(2));
        document.getElementById('speed3x').addEventListener('click', () => this.setGameSpeed(3));
        
        // その他のコントロール
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('menuBtn').addEventListener('click', () => this.showMenu());
        
        // タブの切り替え検出
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    startGame() {
        this.gameStarted = true;
        this.initializeGame();
    }
    
    initializeGame() {
        // 拡張されたレイアウトで建物を初期化（画面右半分にも建物を配置）
        const buildingTypes = [
            { type: 'love', capacity: 25 },
            { type: 'knowledge', capacity: 22 },
            { type: 'adventure', capacity: 18 },
            { type: 'peace', capacity: 28 },
            { type: 'nostalgia', capacity: 20 },
            { type: 'courage', capacity: 16 }
        ];
        
        // 6x3のグリッドで18個の建物を配置
        for (let i = 0; i < 18; i++) {
            const x = (i % 6) * 180 + 110;
            const y = Math.floor(i / 6) * 200 + 120;
            const buildingType = buildingTypes[i % 6];
            
            this.buildings.push({
                x, y, width: 64, height: 64,
                type: buildingType.type,
                storedMemories: 0,
                capacity: buildingType.capacity,
                lastDistribution: 0,
                pulseTimer: Math.random() * 120
            });
        }
        
        // 拡張されたAIで市民を初期化
        for (let i = 0; i < 24; i++) {
            this.spawnNewCitizen();
        }
        
        this.assignNewTargets();
    }
    
    setGameSpeed(speed) {
        this.gameSpeed = speed;
        
        // ボタンのアクティブ状態を更新
        document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`speed${speed}x`).classList.add('active');
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? '再開' : '一時停止';
    }
    
    showMenu() {
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('menuOverlay').style.display = 'flex';
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // タブが非アクティブになった
            this.lastActiveTime = Date.now();
        } else {
            // タブがアクティブになった
            if (this.offlineProgress && this.gameStarted) {
                const offlineTime = Math.floor((Date.now() - this.lastActiveTime) / 1000);
                this.processOfflineProgress(offlineTime);
            }
        }
    }
    
    processOfflineProgress(seconds) {
        // オフライン中の進行を処理
        const simulatedFrames = Math.min(seconds * 60, 3600); // 最大1時間分
        
        for (let i = 0; i < simulatedFrames; i++) {
            this.gameTime++;
            
            // 記憶の自動生成
            if (this.gameTime % 360 === 0) {
                const types = ['love', 'knowledge', 'adventure', 'peace', 'nostalgia', 'courage'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                this.memories[randomType] = Math.min(50, this.memories[randomType] + 2);
            }
            
            // 建物の記憶減衰
            if (this.gameTime % 900 === 0) {
                for (const building of this.buildings) {
                    if (building.storedMemories > 0) {
                        building.storedMemories = Math.max(0, building.storedMemories - 1);
                    }
                }
            }
        }
        
        alert(`オフライン中に${Math.floor(seconds / 60)}分進行しました！`);
    }
    
    applyShopItem(itemType) {
        const itemConfig = {
            memory_boost_5: { type: 'boost', duration: 300, effect: 1.5 },
            memory_boost_10: { type: 'boost', duration: 600, effect: 1.5 },
            memory_boost_30: { type: 'boost', duration: 1800, effect: 1.5 },
            assistant_5: { type: 'assistant', duration: 300 },
            assistant_10: { type: 'assistant', duration: 600 },
            assistant_30: { type: 'assistant', duration: 1800 },
            offline_1: { type: 'offline', duration: 3600 },
            offline_3: { type: 'offline', duration: 10800 },
            offline_5: { type: 'offline', duration: 18000 }
        };
        
        const config = itemConfig[itemType];
        if (!config) return;
        
        const activeItem = {
            type: config.type,
            duration: config.duration,
            remainingTime: config.duration,
            effect: config.effect || 1,
            startTime: this.gameTime
        };
        
        // 同じタイプのアイテムがある場合は時間を延長
        const existingItem = this.activeItems.find(item => item.type === config.type);
        if (existingItem) {
            existingItem.remainingTime += config.duration;
        } else {
            this.activeItems.push(activeItem);
        }
        
        // オフライン進行アイテムの場合
        if (config.type === 'offline') {
            this.offlineProgress = true;
            setTimeout(() => {
                this.offlineProgress = false;
            }, config.duration * 1000);
        }
        
        this.updateActiveItemsDisplay();
    }
    
    updateActiveItemsDisplay() {
        const container = document.getElementById('activeItems');
        container.innerHTML = '';
        
        for (const item of this.activeItems) {
            const itemElement = document.createElement('div');
            itemElement.className = 'active-item';
            
            const icon = {
                boost: '🧠',
                assistant: '🤖',
                offline: '⏰'
            };
            
            const name = {
                boost: '記憶ブースト',
                assistant: 'アシスタント',
                offline: 'オフライン進行'
            };
            
            const timeLeft = Math.ceil(item.remainingTime / 60);
            
            itemElement.innerHTML = `
                <div class="active-item-icon">${icon[item.type]}</div>
                <div class="active-item-info">
                    <div>${name[item.type]}</div>
                    <div class="active-item-timer">${timeLeft}秒</div>
                </div>
            `;
            
            container.appendChild(itemElement);
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        this.updateTooltip();
    }
    
    updateTooltip() {
        let tooltipText = '';
        let showTooltip = false;
        
        for (const building of this.buildings) {
            if (this.mouseX >= building.x && this.mouseX <= building.x + building.width &&
                this.mouseY >= building.y && this.mouseY <= building.y + building.height) {
                
                const memoryName = building.type.charAt(0).toUpperCase() + building.type.slice(1);
                tooltipText = `${memoryName} 記憶バンク\n保管: ${building.storedMemories}/${building.capacity}\nクリックで記憶を配布`;
                showTooltip = true;
                break;
            }
        }
        
        if (showTooltip) {
            this.tooltip.textContent = tooltipText;
            this.tooltip.style.display = 'block';
            this.tooltip.style.left = (this.mouseX + 10) + 'px';
            this.tooltip.style.top = (this.mouseY - 30) + 'px';
        } else {
            this.tooltip.style.display = 'none';
        }
    }
    
    handleMouseDown(e) {
        this.mouseDown = true;
        this.handleClick();
    }
    
    handleClick() {
        for (const building of this.buildings) {
            if (this.mouseX >= building.x && this.mouseX <= building.x + building.width &&
                this.mouseY >= building.y && this.mouseY <= building.y + building.height) {
                
                if (this.memories[building.type] > 0) {
                    const distributed = Math.min(3, this.memories[building.type]);
                    building.storedMemories = Math.min(
                        building.capacity, 
                        building.storedMemories + distributed
                    );
                    this.memories[building.type] -= distributed;
                    building.lastDistribution = this.gameTime;
                    
                    this.createDistributionEffect(building);
                }
                break;
            }
        }
    }
    
    createDistributionEffect(building) {
        const colors = this.getMemoryColorPalette(building.type);
        for (let i = 0; i < 8; i++) {
            this.memoryOrbs.push({
                x: building.x + building.width/2,
                y: building.y + building.height/2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: colors.accent,
                life: 45,
                maxLife: 45,
                size: 2 + Math.random() * 2
            });
        }
    }
    
    update() {
        if (!this.gameStarted || this.gamePaused) return;
        
        // ゲーム速度を適用
        for (let i = 0; i < this.gameSpeed; i++) {
            this.gameTime++;
            
            this.updateCitizens();
            this.updateMemoryGeneration();
            this.updateBuildingDecay();
            this.updateActiveItems();
            this.updateSatisfaction();
            this.updateCurrency();
        }
        
        this.updateEffects();
        this.updateUI();
    }
    
    updateActiveItems() {
        this.activeItems = this.activeItems.filter(item => {
            item.remainingTime--;
            
            // アシスタントアイテムの効果
            if (item.type === 'assistant' && this.gameTime % 180 === 0) {
                this.autoDistributeMemories();
            }
            
            return item.remainingTime > 0;
        });
        
        if (this.gameTime % 60 === 0) {
            this.updateActiveItemsDisplay();
        }
    }
    
    autoDistributeMemories() {
        // アシスタントによる自動記憶配布
        for (const building of this.buildings) {
            if (this.memories[building.type] > 0 && building.storedMemories < building.capacity) {
                const distributed = Math.min(2, this.memories[building.type]);
                building.storedMemories = Math.min(
                    building.capacity, 
                    building.storedMemories + distributed
                );
                this.memories[building.type] -= distributed;
                building.lastDistribution = this.gameTime;
            }
        }
    }
    
    updateCitizens() {
        for (let i = this.citizens.length - 1; i >= 0; i--) {
            const citizen = this.citizens[i];
            
            if (this.gameTime < citizen.satisfiedUntil) {
                citizen.glowIntensity = Math.sin(this.gameTime * 0.1) * 0.3 + 0.7;
                continue;
            } else if (citizen.satisfiedUntil > 0 && this.gameTime >= citizen.satisfiedUntil) {
                this.createDissolveEffect(citizen.x + 4, citizen.y + 4, citizen.memoryType);
                this.citizens.splice(i, 1);
                this.dissolvedCitizens++;
                this.spawnNewCitizen();
                continue;
            }
            
            // 移動AI
            const dx = citizen.targetX - citizen.x;
            const dy = citizen.targetY - citizen.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 速度に応じて移動
            const actualSpeed = citizen.speed * this.gameSpeed;
            
            if (distance > 3) {
                citizen.x += (dx / distance) * actualSpeed;
                citizen.y += (dy / distance) * actualSpeed;
                citizen.walkCycle = (citizen.walkCycle || 0) + 0.2 * this.gameSpeed;
            } else {
                const nearBuilding = this.buildings.find(b => 
                    Math.abs(citizen.x - (b.x + b.width/2)) < 40 &&
                    Math.abs(citizen.y - (b.y + b.height/2)) < 40 &&
                    b.type === citizen.memoryType
                );
                
                if (nearBuilding && nearBuilding.storedMemories > 0) {
                    nearBuilding.storedMemories--;
                    citizen.satisfaction = 100;
                    citizen.needsMemory = false;
                    citizen.lastFed = this.gameTime;
                    citizen.satisfiedUntil = this.gameTime + 1800; // 30秒
                    citizen.glowIntensity = 1.0;
                    
                    this.createSatisfactionEffect(citizen, nearBuilding.type);
                } else {
                    this.setNewTarget(citizen);
                }
            }
            
            // 満足度の減衰
            if (citizen.satisfiedUntil === 0 && this.gameTime - citizen.lastFed > 1200) {
                citizen.satisfaction = Math.max(0, citizen.satisfaction - 0.03);
                citizen.needsMemory = citizen.satisfaction < 65;
            }
        }
        
        if (this.gameTime % 450 === 0) {
            this.assignNewTargets();
        }
    }
    
    updateMemoryGeneration() {
        let generationRate = 360;
        let generationAmount = 2;
        
        // ブーストアイテムの効果を適用
        const boostItem = this.activeItems.find(item => item.type === 'boost');
        if (boostItem) {
            generationRate = Math.floor(generationRate / boostItem.effect);
            generationAmount = Math.floor(generationAmount * boostItem.effect);
        }
        
        if (this.gameTime % generationRate === 0) {
            const types = ['love', 'knowledge', 'adventure', 'peace', 'nostalgia', 'courage'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            this.memories[randomType] = Math.min(50, this.memories[randomType] + generationAmount);
        }
    }
    
    updateBuildingDecay() {
        if (this.gameTime % 900 === 0) {
            for (const building of this.buildings) {
                if (building.storedMemories > 0) {
                    building.storedMemories = Math.max(0, building.storedMemories - 1);
                }
            }
        }
        
        for (const building of this.buildings) {
            building.pulseTimer++;
        }
    }
    
    updateCurrency() {
        // 満足度が前回より上昇した場合に通貨を獲得
        if (this.satisfaction > this.lastSatisfaction) {
            const gain = Math.floor((this.satisfaction - this.lastSatisfaction) * 0.5);
            this.currency += gain;
            
            // ユーザーマネージャーに通貨を追加
            if (window.userManager) {
                window.userManager.addCurrency(gain);
            }
        }
        this.lastSatisfaction = this.satisfaction;
    }
    
    updateEffects() {
        // 記憶オーブの更新
        this.memoryOrbs = this.memoryOrbs.filter(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;
            orb.life--;
            orb.vx *= 0.96;
            orb.vy *= 0.96;
            return orb.life > 0;
        });
        
        // パーティクルの更新
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.03;
            particle.life--;
            particle.vx *= 0.98;
            return particle.life > 0;
        });
        
        // 溶解エフェクトの更新
        this.dissolveEffects = this.dissolveEffects.filter(effect => {
            effect.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02;
                p.alpha -= 0.015;
                p.scale *= 0.99;
            });
            effect.life--;
            return effect.life > 0;
        });
    }
    
    createSatisfactionEffect(citizen, memoryType) {
        const colors = this.getMemoryColorPalette(memoryType);
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: citizen.x + 4,
                y: citizen.y + 4,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                color: colors.accent,
                life: 80,
                maxLife: 80,
                size: 1 + Math.random() * 2,
                type: 'satisfaction'
            });
        }
    }
    
    spawnNewCitizen() {
        const memoryTypes = ['love', 'knowledge', 'adventure', 'peace', 'nostalgia', 'courage'];
        const spawnX = Math.random() * (this.canvas.width - 32) + 16;
        const spawnY = Math.random() * (this.canvas.height - 32) + 16;
        
        const newCitizen = {
            x: spawnX,
            y: spawnY,
            targetX: spawnX,
            targetY: spawnY,
            speed: 0.6 + Math.random() * 0.8,
            needsMemory: true,
            memoryType: memoryTypes[Math.floor(Math.random() * memoryTypes.length)],
            satisfaction: 0, // 0%から開始
            lastFed: 0,
            satisfiedUntil: 0,
            glowIntensity: 0,
            walkCycle: 0
        };
        
        this.citizens.push(newCitizen);
        this.setNewTarget(newCitizen);
        
        this.createSpawnEffect(spawnX, spawnY);
    }
    
    createSpawnEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x + 4,
                y: y + 4,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#ffffff',
                life: 30,
                maxLife: 30,
                size: 1,
                type: 'spawn'
            });
        }
    }
    
    createDissolveEffect(x, y, memoryType) {
        const colors = this.getMemoryColorPalette(memoryType);
        const particles = [];
        
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5 - 2,
                alpha: 1.0,
                scale: 1.0,
                color: colors.accent
            });
        }
        
        this.dissolveEffects.push({
            particles: particles,
            life: 150
        });
    }
    
    assignNewTargets() {
        for (const citizen of this.citizens) {
            this.setNewTarget(citizen);
        }
    }
    
    setNewTarget(citizen) {
        if (citizen.needsMemory && citizen.satisfiedUntil === 0) {
            const targetBuildings = this.buildings.filter(b => 
                b.type === citizen.memoryType && b.storedMemories > 0
            );
            
            if (targetBuildings.length > 0) {
                const target = targetBuildings[Math.floor(Math.random() * targetBuildings.length)];
                citizen.targetX = target.x + target.width/2 + (Math.random() - 0.5) * 30;
                citizen.targetY = target.y + target.height/2 + (Math.random() - 0.5) * 30;
            } else {
                citizen.targetX = Math.random() * (this.canvas.width - 32) + 16;
                citizen.targetY = Math.random() * (this.canvas.height - 32) + 16;
            }
        } else {
            citizen.targetX = Math.random() * (this.canvas.width - 32) + 16;
            citizen.targetY = Math.random() * (this.canvas.height - 32) + 16;
        }
    }
    
    updateSatisfaction() {
        if (this.citizens.length > 0) {
            const averageSatisfaction = this.citizens.reduce((sum, c) => sum + c.satisfaction, 0) / this.citizens.length;
            this.satisfaction = Math.round(averageSatisfaction);
        }
    }
    
    render() {
        // アニメーション背景でキャンバスをクリア
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0d2946');
        gradient.addColorStop(1, '#1e3c72');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.gameStarted) return;
        
        this.drawAnimatedGrid();
        this.drawBuildings();
        this.drawCitizens();
        this.drawEffects();
    }
    
    drawAnimatedGrid() {
        this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 + Math.sin(this.gameTime * 0.02) * 0.05})`;
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawBuildings() {
        for (const building of this.buildings) {
            const pattern = this.buildingPatterns[building.type];
            
            // 最近の活動があった建物のパルス効果
            const timeSinceDistribution = this.gameTime - building.lastDistribution;
            let scale = 1.0;
            if (timeSinceDistribution < 30) {
                scale = 1.0 + Math.sin(timeSinceDistribution * 0.3) * 0.05;
            }
            
            // 建物の影を描画
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(building.x + 3, building.y + 3, building.width * scale, building.height * scale);
            
            // 建物を描画
            this.ctx.save();
            this.ctx.translate(building.x + building.width/2, building.y + building.height/2);
            this.ctx.scale(scale, scale);
            this.ctx.drawImage(pattern, -building.width/2, -building.height/2);
            this.ctx.restore();
            
            // 拡張された視覚化でストレージインジケーターを描画
            const fillRatio = building.storedMemories / building.capacity;
            const barWidth = building.width - 8;
            const barHeight = 6;
            const barX = building.x + 4;
            const barY = building.y + building.height + 5;
            
            // ストレージバーの背景
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // グラデーションでストレージバーを塗りつぶし
            if (fillRatio > 0) {
                const colors = this.getMemoryColorPalette(building.type);
                const gradient = this.ctx.createLinearGradient(barX, barY, barX + barWidth * fillRatio, barY);
                gradient.addColorStop(0, colors.primary);
                gradient.addColorStop(1, colors.accent);
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(barX, barY, barWidth * fillRatio, barHeight);
            }
            
            // ストレージバーの輪郭
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
            
            // ホバー効果
            if (this.mouseX >= building.x && this.mouseX <= building.x + building.width &&
                this.mouseY >= building.y && this.mouseY <= building.y + building.height) {
                this.ctx.strokeStyle = '#00d4ff';
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = '#00d4ff';
                this.ctx.shadowBlur = 10;
                this.ctx.strokeRect(building.x - 2, building.y - 2, building.width + 4, building.height + 4);
                this.ctx.shadowBlur = 0;
            }
        }
    }
    
    drawCitizens() {
        for (const citizen of this.citizens) {
            // 歩行アニメーションで拡張された市民レンダリング
            const walkOffset = Math.sin(citizen.walkCycle || 0) * 1;
            
            if (citizen.glowIntensity > 0) {
                // グロー効果を持つ満足した市民
                const colors = this.getMemoryColorPalette(citizen.memoryType);
                this.ctx.shadowColor = colors.accent;
                this.ctx.shadowBlur = 15 * citizen.glowIntensity;
                this.ctx.fillStyle = colors.primary;
            } else {
                // 満足度ベースの着色を持つ通常の市民
                this.ctx.shadowBlur = 0;
                if (citizen.satisfaction > 75) {
                    this.ctx.fillStyle = '#00ff88';
                } else if (citizen.satisfaction > 45) {
                    this.ctx.fillStyle = '#ffdd00';
                } else {
                    this.ctx.fillStyle = '#ff4757';
                }
            }
            
            // 市民の体を描画（拡張されたピクセルアート）
            this.ctx.fillRect(citizen.x, citizen.y + walkOffset, 10, 10);
            
            // 影をリセット
            this.ctx.shadowBlur = 0;
            
            // 市民の輪郭を描画
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(citizen.x, citizen.y + walkOffset, 10, 10);
            
            // 目を描画（かわいい詳細）
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(citizen.x + 2, citizen.y + 2 + walkOffset, 2, 2);
            this.ctx.fillRect(citizen.x + 6, citizen.y + 2 + walkOffset, 2, 2);
            
            // 記憶ニードインジケーターを描画（必要で満足していない場合のみ）
            if (citizen.needsMemory && citizen.satisfiedUntil === 0) {
                const colors = this.getMemoryColorPalette(citizen.memoryType);
                this.ctx.fillStyle = colors.primary;
                this.ctx.fillRect(citizen.x - 1, citizen.y - 8, 6, 6);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(citizen.x - 1, citizen.y - 8, 6, 6);
            }
        }
    }
    
    drawEffects() {
        // 記憶オーブを描画
        for (const orb of this.memoryOrbs) {
            const alpha = orb.life / orb.maxLife;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = orb.color;
            this.ctx.shadowColor = orb.color;
            this.ctx.shadowBlur = 8;
            
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // パーティクルを描画
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            if (particle.type === 'satisfaction') {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 5;
            }
            
            this.ctx.fillRect(
                particle.x - particle.size/2,
                particle.y - particle.size/2,
                particle.size,
                particle.size
            );
            this.ctx.restore();
        }
        
        // 溶解エフェクトを描画
        for (const effect of this.dissolveEffects) {
            for (const particle of effect.particles) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 3;
                
                const size = 4 * particle.scale;
                this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
                this.ctx.restore();
            }
        }
    }
    
    updateUI() {
        document.getElementById('loveCount').textContent = this.memories.love;
        document.getElementById('knowledgeCount').textContent = this.memories.knowledge;
        document.getElementById('adventureCount').textContent = this.memories.adventure;
        document.getElementById('peaceCount').textContent = this.memories.peace;
        document.getElementById('nostalgiaCount').textContent = this.memories.nostalgia;
        document.getElementById('courageCount').textContent = this.memories.courage;
        document.getElementById('satisfaction').textContent = this.satisfaction + '%';
        document.getElementById('gameTime').textContent = Math.floor(this.gameTime / 60) + 's';
        document.getElementById('dissolvedCount').textContent = this.dissolvedCitizens;
        document.getElementById('gameCurrency').textContent = this.currency;
        
        // ユーザーマネージャーがある場合、ランキングを更新
        if (window.userManager && this.dissolvedCitizens > 0 && this.gameTime % 1800 === 0) {
            window.userManager.updateRanking(this.dissolvedCitizens);
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ゲームの初期化
window.addEventListener('load', () => {
    window.userManager = new UserManager();
    window.tutorialManager = new TutorialManager();
    window.memoryGame = new MemoryArchitectGame();
});
