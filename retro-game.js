// ============================================
// The Global Easter Egg & Retro Snake Game
// ============================================

(function() {
  // The Konami Code sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  let konamiIndex = 0;
  
  // Game state variables
  let gameInterval = null;
  let isGameRunning = false;
  let canvas, ctx;
  const gridSize = 20;
  let snake = [];
  let food = {};
  let dx = 0;
  let dy = 0;
  let score = 0;
  let highScore = localStorage.getItem('snakeHighScore') || 0;

  // Listen for keydown events globally
  document.addEventListener('keydown', function(e) {
    // Check if the pressed key matches the current key in the sequence
    if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
      konamiIndex++;
      
      // If the full sequence is entered
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        triggerEasterEgg();
      }
    } else {
      // Reset if wrong key is pressed
      konamiIndex = 0;
      // Allow for immediate retry if the wrong key was actually the start of a new sequence
      if (e.key.toLowerCase() === konamiCode[0].toLowerCase()) {
        konamiIndex = 1;
      }
    }
  });

  // Inject the Game Modal UI into the DOM
  function createGameModal() {
    if (document.getElementById('easter-egg-modal')) return;

    const modalHTML = `
      <div id="easter-egg-modal" style="
        display: none;
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.85); z-index: 9999;
        justify-content: center; align-items: center; flex-direction: column;
        font-family: var(--font-mono, monospace); color: #8FBC8F;
      ">
        <div style="
          background: #1e1e1e; padding: 30px; border: 4px solid #8FBC8F;
          box-shadow: 8px 8px 0px 0px #8FBC8F; text-align: center; max-width: 90%;
        ">
          <h2 style="color: #8FBC8F; font-weight: bold; margin-bottom: 20px;">TERMINAL UNLOCKED</h2>
          <p style="color: #d4d4d4; margin-bottom: 20px;">You found the secret. What would you like to do?</p>
          
          <div style="margin-bottom: 30px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="https://carbform.medium.com/" target="_blank" style="
              display: inline-block; padding: 10px 20px; background: #d96c6c; color: #1e1e1e;
              text-decoration: none; font-weight: bold; text-transform: uppercase;
              border: 2px solid #8FBC8F; box-shadow: 4px 4px 0px 0px #8FBC8F;
              transition: transform 0.15s ease, box-shadow 0.15s ease;
            " class="retro-modal-btn">Access Secret Blog</a>
            
            <button id="start-snake-btn" style="
              padding: 10px 20px; background: #e6b35c; color: #1e1e1e;
              border: 2px solid #8FBC8F; box-shadow: 4px 4px 0px 0px #8FBC8F;
              font-family: inherit; font-weight: bold; text-transform: uppercase; cursor: pointer;
              transition: transform 0.15s ease, box-shadow 0.15s ease;
            " class="retro-modal-btn">Play Snake</button>
            
            <button id="close-modal-btn" style="
              padding: 10px 20px; background: transparent; color: #d4d4d4;
              border: 2px solid #d4d4d4; cursor: pointer; font-family: inherit; font-weight: bold;
              text-transform: uppercase;
            ">Close</button>
          </div>
          
          <div id="game-container" style="display: none;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #8abf7c; font-weight: bold;">
              <span>SCORE: <span id="snake-score">0</span></span>
              <span>HIGH SCORE: <span id="snake-highscore">${highScore}</span></span>
            </div>
            <canvas id="snake-canvas" width="400" height="400" style="
              border: 2px solid #8abf7c; background: #111; max-width: 100%; height: auto;
            "></canvas>
            <p style="margin-top: 10px; font-size: 12px; color: #6b6b6b;">Use Arrow Keys to move.</p>
          </div>
        </div>
      </div>
      
      <style>
        .retro-modal-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px #8FBC8F !important;
        }
        .retro-modal-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px 0px #8FBC8F !important;
        }
        @keyframes screen-shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .shake {
          animation: screen-shake 0.5s;
        }
      </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Bind buttons
    document.getElementById('start-snake-btn').addEventListener('click', initSnakeGame);
    document.getElementById('close-modal-btn').addEventListener('click', () => {
      document.getElementById('easter-egg-modal').style.display = 'none';
      stopGame();
    });
  }

  function triggerEasterEgg() {
    createGameModal();
    const modal = document.getElementById('easter-egg-modal');
    modal.style.display = 'flex';
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
  }

  // --- SNAKE GAME LOGIC ---
  function initSnakeGame() {
    document.getElementById('game-container').style.display = 'block';
    canvas = document.getElementById('snake-canvas');
    ctx = canvas.getContext('2d');
    
    // Setup controls
    document.addEventListener('keydown', changeDirection);
    
    resetGame();
  }

  function resetGame() {
    snake = [
      {x: 200, y: 200},
      {x: 180, y: 200},
      {x: 160, y: 200}
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    updateScore();
    spawnFood();
    
    if (gameInterval) clearInterval(gameInterval);
    isGameRunning = true;
    gameInterval = setInterval(gameLoop, 100);
  }

  function stopGame() {
    isGameRunning = false;
    if (gameInterval) clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
  }

  function gameLoop() {
    if (!isGameRunning) return;
    
    if (hasGameEnded()) {
      alert("GAME OVER! Score: " + score);
      resetGame();
      return;
    }
    
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
  }

  function clearCanvas() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawSnake() {
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? '#8FBC8F' : '#7ebfb2';
      ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2);
    });
  }

  function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      updateScore();
      spawnFood();
    } else {
      snake.pop();
    }
  }

  function drawFood() {
    ctx.fillStyle = '#d96c6c';
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
  }

  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
    // Ensure food doesn't spawn on snake
    snake.forEach(function isFoodOnSnake(part) {
      const has_eaten = part.x == food.x && part.y == food.y;
      if (has_eaten) spawnFood();
    });
  }

  function changeDirection(event) {
    // Prevent default scrolling for arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;
    
    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -gridSize;
      dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -gridSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = gridSize;
      dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = gridSize;
    }
  }

  function hasGameEnded() {
    // Wall collision
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;
    
    if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) return true;
    
    // Self collision
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
  }

  function updateScore() {
    document.getElementById('snake-score').innerText = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      document.getElementById('snake-highscore').innerText = highScore;
    }
  }

})();
