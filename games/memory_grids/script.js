// script.js (更新版)

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM 元素獲取 ---
    const pages = {
        start: document.getElementById('start-page'),
        game: document.getElementById('game-page'),
        end: document.getElementById('end-page'),
    };

    const buttons = {
        start: document.getElementById('start-btn'),
        restart: document.getElementById('restart-btn'),
    };

    const displays = {
        level: document.getElementById('level'),
        score: document.getElementById('score'),
        time: document.getElementById('time'),
        finalScore: document.getElementById('final-score'),
        hint: document.getElementById('hint'),
    };

    const gridContainer = document.getElementById('grid-container');

    // --- 遊戲狀態變數 ---
    let level = 1;
    let score = 0;
    let n = 2; // 初始網格維度基數，代表 2x3
    let timeLeft = 60; // 遊戲總時間 (秒)
    let timerInterval = null;
    let currentSequence = []; // 當前回合需要記憶的方格
    let playerSequence = []; // 玩家已點擊的正確方格
    let canClick = false; // 控制玩家是否可以點擊方格

    // --- 頁面切換函式 ---
    /**
     * 顯示指定的頁面，並隱藏其他頁面
     * @param {string} pageName - 'start', 'game', 或 'end'
     */
    const showPage = (pageName) => {
        Object.values(pages).forEach(page => page.classList.remove('active'));
        pages[pageName].classList.add('active');
    };

    // --- 遊戲核心邏輯 ---

    /**
     * 初始化並開始新遊戲
     */
    const startGame = () => {
        // 重設遊戲狀態
        level = 1;
        score = 0;
        n = 2;
        timeLeft = 60;
        
        updateStatsDisplay();
        showPage('game');
        startTimer();
        startNextLevel();
    };

    /**
     * 開始下一關
     */
    const startNextLevel = () => {
        canClick = false;
        currentSequence = [];
        playerSequence = [];
        gridContainer.innerHTML = ''; // 清空舊的方格
        
        displays.hint.textContent = '請記住...';
        displays.level.textContent = level;

        // 延遲一點時間讓玩家準備好
        setTimeout(() => {
            generateGrid();
            generateSequence();
            showSequence();
        }, 1000);
    };

    /**
     * 根據目前的 n 值生成方格
     */
    const generateGrid = () => {
        const rows = n;
        const cols = n + 1;
        const totalCells = rows * cols;
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i; // 為每個方格設置索引
            cell.addEventListener('click', handleCellClick);
            gridContainer.appendChild(cell);
        }
    };
    
    /**
     * 生成本回合需要記憶的方格序列
     */
    const generateSequence = () => {
        const totalCells = n * (n + 1);
        const sequenceLength = n + 1; // 需要記憶的方格數量
        const availableIndices = Array.from(Array(totalCells).keys());

        for (let i = 0; i < sequenceLength; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
            currentSequence.push(selectedIndex);
        }
    };

    /**
     * 將需要記憶的方格以高亮方式顯示給玩家
     */
    const showSequence = () => {
        const cells = gridContainer.querySelectorAll('.grid-cell');
        currentSequence.forEach((index, i) => {
            setTimeout(() => {
                cells[index].classList.add('highlight');
            }, (i + 1) * 400); // 逐個顯示
        });

        // 顯示完畢後，移除高亮並開放點擊
        setTimeout(() => {
            cells.forEach(cell => cell.classList.remove('highlight'));
            canClick = true;
            displays.hint.textContent = `請找出 ${currentSequence.length} 個方塊`;
            updateHint();
        }, (currentSequence.length + 1) * 400 + 500);
    };
    
    /**
     * 處理玩家點擊方格的事件
     * @param {Event} e - 點擊事件對象
     */
    const handleCellClick = (e) => {
        if (!canClick) return;

        const clickedIndex = parseInt(e.target.dataset.index);
        const cell = e.target;

        // 如果點擊過或已經是錯誤的方格，則不處理
        if (playerSequence.includes(clickedIndex) || cell.classList.contains('incorrect')) {
            return;
        }

        if (currentSequence.includes(clickedIndex)) {
            // 點擊正確
            cell.classList.add('correct');
            playerSequence.push(clickedIndex);
            score += 10 * level; // 根據關卡給予分數
            updateStatsDisplay();
            updateHint();

            // 檢查是否完成本回合
            if (playerSequence.length === currentSequence.length) {
                levelSuccess();
            }
        } else {
            // 點擊錯誤
            cell.classList.add('incorrect');
            levelFail();
        }
    };
    
    /**
     * 關卡成功後的處理
     */
    const levelSuccess = () => {
        canClick = false;
        displays.hint.textContent = '正確！準備下一關...';
        score += 50 * n; // 額外獎勵分數
        updateStatsDisplay();
        level++;
        // 【修改處】當關卡低於 8 時，增加難度 (n++)。達到 Level 8 後，n 將不再增加。
        if (level < 8) {
            n++;
        }
        setTimeout(startNextLevel, 1500);
    };

    /**
     * 關卡失敗後的處理
     */
    const levelFail = () => {
        canClick = false;
        displays.hint.textContent = '答錯了！準備新的一局...';
        
        // 顯示所有正確答案
        const cells = gridContainer.querySelectorAll('.grid-cell');
        currentSequence.forEach(index => {
            if (!playerSequence.includes(index)) {
                cells[index].classList.add('highlight');
            }
        });

        if (n > 2) n--; // 降低難度，但保留基礎難度
        
        setTimeout(() => {
            level++;
            startNextLevel();
        }, 2000);
    };


    /**
     * 更新分數和關卡顯示
     */
    const updateStatsDisplay = () => {
        displays.score.textContent = score;
    };
    
    /**
     * 更新下方提示文字 (已點選正確數 / 總目標數)
     */
    const updateHint = () => {
        displays.hint.textContent = `${playerSequence.length} / ${currentSequence.length}`;
    }

    /**
     * 啟動並管理遊戲計時器
     */
    const startTimer = () => {
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const seconds = (timeLeft % 60).toString().padStart(2, '0');
            displays.time.textContent = `${minutes}:${seconds}`;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    };

    /**
     * 結束遊戲
     */
    const endGame = () => {
        clearInterval(timerInterval);
        canClick = false;
        displays.finalScore.textContent = score;
        showPage('end');
    };

    // --- 事件監聽器綁定 ---
    buttons.start.addEventListener('click', startGame);
    buttons.restart.addEventListener('click', startGame);

    const mainpageBtn1 = document.getElementById('mainpage-btn-1');
    const mainpageBtn2 = document.getElementById('mainpage-btn-2');

    // Handle main page URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const mainpageUrl = urlParams.get('mainpage_url');

    if (mainpageUrl) {
        mainpageBtn1.addEventListener('click', () => {
            window.location.href = mainpageUrl;
        });
        mainpageBtn2.addEventListener('click', () => {
            window.location.href = mainpageUrl;
        });
    } else {
        //mainpageBtn1.style.display = 'none';
        //mainpageBtn2.style.display = 'none';
    }
});