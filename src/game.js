/**
 * 飞梁叠韵 - 核心游戏逻辑
 */

import { RESIDENCES, BUFFS } from './constants';

class GameEngine {
  constructor(canvas, onStateChange) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onStateChange = onStateChange;
    
    // Use fixed internal resolution for logic
    this.width = 800;
    this.height = 1066;
    
    this.state = 'MENU'; 
    this.currentLevel = null;
    this.score = 0;
    this.stability = 100;
    this.combo = 0;
    this.activeBuffs = [];
    
    this.fallingObjects = [];
    this.collectedComponents = new Set();
    this.lastSpawnTime = 0;
    this.spawnInterval = 2000;
    
    this.hitZoneY = this.height * 0.55;
    this.hitZoneHeight = 70;
    
    this.bgImage = null;
    this.componentImageCache = {};
    this.particles = [];
    this.floatingTexts = [];
    this.weatherParticles = [];
    this.currentWeather = 'CLEAR'; // CLEAR, RAIN, SNOW, WIND
    this.weatherIntensity = 0;
    this.lastWeatherChange = 0;
    this.lightningFlash = 0;
    this.clouds = [];
    this.screenShake = 0;
    this.usedQuizIndices = [];
    this.endlessMode = false;
    this.missCount = 0;
    
    console.log('营造引擎启动：', { width: this.width, height: this.height });
    
    this.audioCtx = null;
    
    this.setupListeners();
    this.loop();
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playSound(type) {
    if (!this.audioCtx) return;
    
    if (type === 'thunder') {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(10, this.audioCtx.currentTime + 1.5);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.5);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      whiteNoise.start();
      return;
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    if (type === 'hit') {
      // Wood block sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
      // Chime sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } else if (type === 'fail') {
      // Low thud
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    }
  }

  setCanvas(canvas) {
    if (this.canvas === canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hitZoneY = this.height * 0.55;
    this.hitZoneHeight = 40;
    // Reset stateful arrays on canvas change if needed, but usually we want to keep them
    // or they are already initialized in constructor
    this.particles = this.particles || [];
    this.floatingTexts = this.floatingTexts || [];
    this.screenShake = 0;
    this.setupListeners();
  }

  setupListeners() {
    // Use a bound function so we can remove it if needed, 
    // but since we usually remount the canvas, we just need to avoid double-adding on the same element
    if (this.canvas._hasListeners) return;
    
    this.canvas.addEventListener('mousedown', (e) => this.handleInput(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches && e.touches.length > 0) {
        this.handleInput(e.touches[0]);
      }
    });
    this.canvas._hasListeners = true;
  }

  handleInput(e) {
    if (this.state !== 'PLAYING') return;
    
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Find objects in hit zone
    let hit = false;
    const now = Date.now();
    for (let i = 0; i < this.fallingObjects.length; i++) {
      const obj = this.fallingObjects[i];
      if (obj.y > this.hitZoneY - this.hitZoneHeight && obj.y < this.hitZoneY + this.hitZoneHeight) {
        // Check if frozen
        if (obj.frozenUntil && obj.frozenUntil > now) {
          this.floatingTexts.push({
            x: obj.x,
            y: obj.y - 40,
            text: "冰封中！",
            life: 0.5,
            color: '#0066cc'
          });
          continue; // Skip frozen objects
        }
        this.processHit(obj);
        this.fallingObjects.splice(i, 1);
        hit = true;
        break;
      }
    }
    
    if (!hit) {
      this.processMiss();
    }
  }

  processHit(obj) {
    this.playSound('hit');
    const multiplier = this.hasBuff('multiplier') ? 2 : 1;
    const points = 100 * multiplier;
    this.score += points;
    this.stability = Math.min(100, this.stability + 2);
    this.combo++;
    
    // Add particles
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: obj.x,
        y: obj.y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: '#8f000d', // Cinnabar red for success
        radius: 2 + Math.random() * 4
      });
    }

    // Add floating text
    this.floatingTexts.push({
      x: obj.x,
      y: obj.y,
      text: `+${points}`,
      life: 1.0,
      color: '#8f000d'
    });

    if (this.currentLevel) {
      this.collectedComponents.add(obj.name);
    }
    
    if (this.combo % 5 === 0) {
      this.triggerComboEffect();
    }
    
    this.onStateChange({ 
      score: this.score, 
      stability: this.stability, 
      combo: this.combo,
      collectedCount: this.collectedComponents.size,
      totalCount: this.currentLevel?.components?.length || 0
    });
  }

  processMiss() {
    if (this.hasBuff('shield')) {
      this.removeBuff('shield');
      return;
    }
    
    this.playSound('fail');
    this.combo = 0;
    this.screenShake = 10; // Trigger screen shake
    
    // Only deduct stability every 3 misses
    this.missCount++;
    if (this.missCount >= 3) {
      this.stability -= 10;
      this.missCount = 0;
      
      // Floating text for warning
      this.floatingTexts.push({
        x: this.width / 2,
        y: this.hitZoneY - 50,
        text: "稳固度下降！",
        life: 1.5,
        color: '#2c2c2c'
      });
    } else {
      // Small warning text
      this.floatingTexts.push({
        x: this.width / 2,
        y: this.hitZoneY - 50,
        text: `失误 ${this.missCount}/3`,
        life: 1.0,
        color: '#2c2c2c'
      });
    }
    
    if (this.stability <= 0) {
      this.gameOver();
    }
    
    this.onStateChange({ stability: this.stability, combo: this.combo });
  }

  triggerComboEffect() {
    this.playSound('success');
    // Select a random quiz from the current level that hasn't been used
    const quizzes = this.currentLevel?.quiz;
    if (!quizzes || quizzes.length === 0) return;

    let availableIndices = quizzes.map((_, i) => i).filter(i => !this.usedQuizIndices.includes(i));
    
    // If all used, reset but keep track of the last one to avoid immediate repeat
    if (availableIndices.length === 0) {
      const lastIndex = this.usedQuizIndices[this.usedQuizIndices.length - 1];
      this.usedQuizIndices = [];
      availableIndices = quizzes.map((_, i) => i);
      
      // If we have more than one question, don't pick the same one again immediately
      if (quizzes.length > 1 && lastIndex !== undefined) {
        availableIndices = availableIndices.filter(i => i !== lastIndex);
      }
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    this.usedQuizIndices.push(randomIndex);
    const randomQuiz = quizzes[randomIndex];
    
    this.state = 'QUIZ';
    this.onStateChange({ 
      state: 'QUIZ',
      activeQuiz: randomQuiz 
    });
  }

  hasBuff(id) {
    return this.activeBuffs.some(b => b.id === id);
  }

  removeBuff(id) {
    this.activeBuffs = this.activeBuffs.filter(b => b.id !== id);
  }

  applyBuff(buff) {
    if (buff.id === 'repair') {
      this.stability = Math.min(100, this.stability + 20);
      this.onStateChange({ stability: this.stability });
    } else {
      this.activeBuffs.push(buff);
    }
  }

  applyPenalty(amount) {
    this.stability = Math.max(0, this.stability - amount);
    this.onStateChange({ stability: this.stability });
    if (this.stability <= 0) {
      this.gameOver();
    }
  }

  startLevel(levelId) {
    const level = RESIDENCES.find(r => r.id === levelId);
    if (!level) {
      console.error('Level not found:', levelId);
      return;
    }
    this.currentLevel = level;
    this.state = 'PLAYING';
    this.score = 0;
    this.stability = 100;
    this.combo = 0;
    this.fallingObjects = [];
    this.collectedComponents = new Set();
    this.activeBuffs = [];
    this.lastSpawnTime = 0; // Trigger immediate spawn
    this.usedQuizIndices = [];
    this.endlessMode = false;
    this.missCount = 0;
    this.currentWeather = 'CLEAR';
    this.weatherParticles = [];
    this.lastWeatherChange = Date.now();
    
    // Load background image
    this.bgImage = new Image();
    this.bgImage.src = this.currentLevel.image;
    
    // Pre-load component images
    this.componentImageCache = {};
    if (this.currentLevel.componentImages) {
      Object.entries(this.currentLevel.componentImages).forEach(([name, url]) => {
        const img = new Image();
        img.src = url;
        this.componentImageCache[name] = img;
      });
    }
    
    this.initAudio();
    this.onStateChange({ 
      state: 'PLAYING', 
      level: this.currentLevel, 
      score: 0, 
      stability: 100, 
      combo: 0,
      collectedCount: 0,
      totalCount: this.currentLevel.components?.length || 0
    });
  }

  continueEndless() {
    this.endlessMode = true;
    this.state = 'PLAYING';
    this.onStateChange({ state: 'PLAYING', endlessMode: true });
  }

  gameOver() {
    this.state = 'RESULT';
    this.onStateChange({ state: 'RESULT', win: false });
  }

  winLevel() {
    this.state = 'RESULT';
    this.onStateChange({ state: 'RESULT', win: true });
  }

  loop() {
    const now = Date.now();
    if (this.state === 'PLAYING') {
      this.update(now);
    }
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  updateWeather(now) {
    // Initialize clouds if empty
    if (this.clouds.length === 0) {
      for (let i = 0; i < 5; i++) {
        this.clouds.push({
          x: Math.random() * this.width,
          y: Math.random() * 100,
          w: 200 + Math.random() * 200,
          h: 60 + Math.random() * 60,
          speed: 0.2 + Math.random() * 0.3,
          opacity: 0.3 + Math.random() * 0.4
        });
      }
    }

    // Randomly change weather every 15-30 seconds
    if (now - this.lastWeatherChange > 15000 + Math.random() * 15000) {
      const weathers = ['CLEAR', 'RAIN', 'SNOW', 'WIND'];
      this.currentWeather = weathers[Math.floor(Math.random() * weathers.length)];
      this.lastWeatherChange = now;
      this.weatherIntensity = 0;
      
      if (this.currentWeather !== 'CLEAR') {
        this.onStateChange({ weather: this.currentWeather });
        this.floatingTexts.push({
          x: this.width / 2,
          y: 200,
          text: `天候突变: ${this.getWeatherName(this.currentWeather)}`,
          life: 2.0,
          color: '#8f000d'
        });
      }
    }

    // Lightning Logic
    if (this.currentWeather === 'RAIN' && Math.random() < 0.005) {
      this.lightningFlash = 1.0;
      this.screenShake = 10;
      this.playSound('thunder');
    }
    if (this.lightningFlash > 0) this.lightningFlash *= 0.8;

    // Fade in intensity
    if (this.currentWeather !== 'CLEAR' && this.weatherIntensity < 1) {
      this.weatherIntensity += 0.005;
    } else if (this.currentWeather === 'CLEAR' && this.weatherIntensity > 0) {
      this.weatherIntensity -= 0.005;
    }

    // Update clouds
    this.clouds.forEach(c => {
      c.x += c.speed * (this.currentWeather === 'WIND' ? 5 : 1);
      if (c.x > this.width + 200) c.x = -200;
    });

    // Spawn weather particles
    if (this.currentWeather === 'RAIN') {
      for (let i = 0; i < 5; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.width,
          y: -20,
          vy: 15 + Math.random() * 10,
          vx: -2,
          length: 20 + Math.random() * 20,
          type: 'RAIN'
        });
      }
    } else if (this.currentWeather === 'SNOW') {
      if (Math.random() > 0.5) {
        this.weatherParticles.push({
          x: Math.random() * this.width,
          y: -20,
          vy: 2 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 2,
          size: 2 + Math.random() * 4,
          type: 'SNOW',
          swing: Math.random() * Math.PI * 2
        });
      }
    } else if (this.currentWeather === 'WIND') {
      if (Math.random() > 0.3) {
        this.weatherParticles.push({
          x: -50,
          y: Math.random() * this.height,
          vx: 10 + Math.random() * 15,
          vy: (Math.random() - 0.5) * 2,
          size: 1 + Math.random() * 2,
          type: 'WIND'
        });
      }
    }

    // Update weather particles
    for (let i = this.weatherParticles.length - 1; i >= 0; i--) {
      const p = this.weatherParticles[i];
      if (p.type === 'SNOW') {
        p.swing += 0.05;
        p.x += Math.sin(p.swing) * 1;
      }
      p.x += p.vx;
      p.y += p.vy;

      if (p.y > this.height || p.x > this.width || p.x < -100) {
        this.weatherParticles.splice(i, 1);
      }
    }
  }

  getWeatherName(type) {
    switch(type) {
      case 'RAIN': return '骤雨倾盆';
      case 'SNOW': return '寒雪纷飞';
      case 'WIND': return '狂风大作';
      default: return '天朗气清';
    }
  }

  update(now) {
    // Screen shake decay
    if (this.screenShake > 0) this.screenShake *= 0.9;

    // Weather Logic
    this.updateWeather(now);

    // Particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Floating text update
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y -= 1;
      t.life -= 0.02;
      if (t.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Spawn
    let interval = this.spawnInterval;
    if (this.hasBuff('speed')) interval *= 1.2;
    
    // Difficulty scaling: interval decreases as score increases
    const scoreFactor = this.endlessMode ? (this.score / 5) : (this.score / 10);
    const scaledInterval = Math.max(this.endlessMode ? 400 : 800, interval - scoreFactor);

    if (now - this.lastSpawnTime > scaledInterval) {
      if (!this.currentLevel || !this.currentLevel.components || this.currentLevel.components.length === 0) return;
      
      const component = this.currentLevel.components[Math.floor(Math.random() * this.currentLevel.components.length)];
      // Randomize X position
      const margin = 80;
      const randomX = margin + Math.random() * (this.width - margin * 2);
      
      // Start slower (base 2) and scale up gradually
      const baseSpeed = 2 + (this.score / 2500) + (this.endlessMode ? 2 : 0);
      const maxSpeed = this.endlessMode ? 15 : 10;
      
      const objSpeed = Math.min(maxSpeed, baseSpeed);
      
      // Weather impact on objects
      let driftX = 0;
      if (this.currentWeather === 'WIND') driftX = 2 * this.weatherIntensity;
      if (this.currentWeather === 'RAIN') driftX = -1 * this.weatherIntensity;

      this.fallingObjects.push({
        id: now,
        name: component,
        x: randomX,
        y: -50,
        speed: objSpeed,
        vx: driftX,
        frozenUntil: (this.currentWeather === 'SNOW' && Math.random() < 0.3) ? now + 3000 : 0
      });
      this.lastSpawnTime = now;
    }
    
    // Move
    for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
      const obj = this.fallingObjects[i];
      obj.y += obj.speed;
      if (obj.vx) obj.x += obj.vx;
      
      // Randomly freeze during snow if not already frozen
      if (this.currentWeather === 'SNOW' && !obj.frozenUntil && Math.random() < 0.005) {
        obj.frozenUntil = now + 3000;
      }
      
      // Keep in bounds
      if (obj.x < 50) obj.x = 50;
      if (obj.x > this.width - 50) obj.x = this.width - 50;
      
      if (obj.y > this.height) {
        this.fallingObjects.splice(i, 1);
        this.processMiss();
      }
    }
    
    // Check win condition
    if (!this.currentLevel || this.state !== 'PLAYING') return;
    
    const totalNeeded = this.currentLevel.components?.length || 0;
    if (!this.endlessMode && this.collectedComponents.size >= totalNeeded && totalNeeded > 0) {
      this.state = 'CHOICE';
      this.onStateChange({ state: 'CHOICE' });
    }
  }

  drawWeather() {
    this.ctx.save();
    
    // Atmospheric darkening
    if (this.currentWeather !== 'CLEAR') {
      const darkAlpha = this.weatherIntensity * 0.4;
      this.ctx.fillStyle = `rgba(0, 0, 20, ${darkAlpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Draw Clouds
    this.clouds.forEach(c => {
      const cloudAlpha = c.opacity * (this.currentWeather === 'CLEAR' ? 0.3 : 0.8) * (this.currentWeather === 'CLEAR' ? 1 : this.weatherIntensity);
      this.ctx.fillStyle = this.currentWeather === 'CLEAR' ? `rgba(255, 255, 255, ${cloudAlpha})` : `rgba(100, 100, 110, ${cloudAlpha})`;
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.w, c.h, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = this.weatherIntensity * 0.8;
    
    this.weatherParticles.forEach(p => {
      if (p.type === 'RAIN') {
        this.ctx.strokeStyle = '#708090';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.vx, p.y + p.length);
        this.ctx.stroke();
      } else if (p.type === 'SNOW') {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'WIND') {
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
        this.ctx.lineWidth = p.size;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + 40, p.y + p.vy);
        this.ctx.stroke();
      }
    });

    // Atmospheric overlays
    if (this.currentWeather === 'RAIN') {
      this.ctx.fillStyle = 'rgba(0, 0, 50, 0.05)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.currentWeather === 'SNOW') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.currentWeather === 'WIND') {
      this.ctx.fillStyle = 'rgba(150, 130, 100, 0.05)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    this.ctx.restore();

    // Lightning Flash
    if (this.lightningFlash > 0.1) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningFlash * 0.5})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    
    this.ctx.save();
    if (this.screenShake > 0.1) {
      this.ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);
    }

    // Clear using the actual canvas dimensions
    this.ctx.fillStyle = '#f4f1ea'; // Rice paper color
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw background image
    if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
      this.ctx.globalAlpha = 0.4; // Slightly more visible
      
      const imgW = this.bgImage.naturalWidth;
      const imgH = this.bgImage.naturalHeight;
      const canvasRatio = this.width / this.height;
      const imgRatio = imgW / imgH;
      
      let sx, sy, sw, sh;
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        sh = imgH;
        sw = imgH * canvasRatio;
        sx = (imgW - sw) / 2;
        sy = 0;
      } else {
        // Image is taller than canvas (crop top/bottom as requested)
        sw = imgW;
        sh = imgW / canvasRatio;
        sx = 0;
        sy = (imgH - sh) / 2;
      }
      
      this.ctx.drawImage(this.bgImage, sx, sy, sw, sh, 0, 0, this.width, this.height);
      this.ctx.globalAlpha = 1.0;
    }
    
    // Draw background/hit zone even if paused or in quiz
    if (this.state === 'PLAYING' || this.state === 'QUIZ' || this.state === 'PAUSED') {
      if (!this.currentLevel) return;

      // Draw Hit Zone (Brush stroke style)
      this.ctx.strokeStyle = 'rgba(44, 44, 44, 0.4)';
      this.ctx.lineWidth = 4;
      this.ctx.setLineDash([20, 15]);
      this.ctx.beginPath();
      this.ctx.moveTo(40, this.hitZoneY);
      this.ctx.lineTo(this.width - 40, this.hitZoneY);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
      
      // Draw Particles (Ink splatters)
      this.particles.forEach(p => {
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        // Irregular ink splatter shape
        const r = p.radius || 3;
        this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1.0;

      // Draw Weather Effects
      this.drawWeather();

      // Draw Floating Texts
      this.ctx.font = 'bold 24px "Ma Shan Zheng"';
      this.floatingTexts.forEach(t => {
        this.ctx.globalAlpha = t.life;
        this.ctx.fillStyle = t.color;
        this.ctx.fillText(t.text, t.x, t.y);
      });
      this.ctx.globalAlpha = 1.0;
      
      // Draw Objects
      this.ctx.font = 'bold 20px "Ma Shan Zheng"';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      this.fallingObjects.forEach(obj => {
        const img = this.componentImageCache[obj.name];
        
        // Ink Shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.05)';
        this.ctx.beginPath();
        this.ctx.roundRect(obj.x - 72, obj.y - 47 + 6, 144, 94, 2);
        this.ctx.fill();
        
        // Box/Container (Parchment style)
        this.ctx.fillStyle = '#fdfcf9';
        this.ctx.strokeStyle = '#2c2c2c';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Slightly irregular box for "hand-drawn" feel
        this.ctx.moveTo(obj.x - 70, obj.y - 45);
        this.ctx.lineTo(obj.x + 70, obj.y - 46);
        this.ctx.lineTo(obj.x + 71, obj.y + 45);
        this.ctx.lineTo(obj.x - 69, obj.y + 46);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Image with ink border
        if (img && img.complete && img.naturalWidth > 0) {
          this.ctx.drawImage(img, obj.x - 60, obj.y - 40, 120, 60);
          this.ctx.strokeStyle = 'rgba(44, 44, 44, 0.2)';
          this.ctx.strokeRect(obj.x - 60, obj.y - 40, 120, 60);
        } else {
          this.ctx.fillStyle = '#ddd9c8';
          this.ctx.fillRect(obj.x - 60, obj.y - 40, 120, 60);
        }
        
        // Text Label (Calligraphy style)
        this.ctx.fillStyle = '#2c2c2c';
        this.ctx.fillText(obj.name, obj.x, obj.y + 32);

        // Frozen Effect
        if (obj.frozenUntil && obj.frozenUntil > Date.now()) {
          this.ctx.save();
          this.ctx.fillStyle = 'rgba(173, 216, 230, 0.4)'; // Light blue ice
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          this.ctx.lineWidth = 3;
          
          // Draw ice block
          this.ctx.beginPath();
          this.ctx.roundRect(obj.x - 75, obj.y - 50, 150, 100, 8);
          this.ctx.fill();
          this.ctx.stroke();
          
          // Ice crystals/shards
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          for (let j = 0; j < 4; j++) {
            const angle = (j / 4) * Math.PI * 2;
            const rx = obj.x + Math.cos(angle) * 60;
            const ry = obj.y + Math.sin(angle) * 40;
            this.ctx.beginPath();
            this.ctx.moveTo(rx, ry);
            this.ctx.lineTo(rx + 10, ry + 10);
            this.ctx.lineTo(rx - 5, ry + 15);
            this.ctx.closePath();
            this.ctx.fill();
          }
          
          // "Frozen" text
          this.ctx.font = 'bold 16px "Ma Shan Zheng"';
          this.ctx.fillStyle = '#0066cc';
          this.ctx.fillText("冰封", obj.x, obj.y - 10);
          
          this.ctx.restore();
        }
      });
      
      // Progress indicator
      if (this.currentLevel?.components) {
        this.ctx.fillStyle = '#8f000d'; // Cinnabar Red for progress
        this.ctx.font = 'bold 22px "Ma Shan Zheng"';
        this.ctx.textAlign = 'left';
        const total = this.currentLevel.components?.length || 0;
        const collected = this.collectedComponents.size;
        this.ctx.fillText(`复原进度: ${collected}/${total}`, 30, 50);
        
        if (this.endlessMode) {
          this.ctx.fillStyle = '#2c2c2c';
          this.ctx.fillText('无尽挑战中...', 30, 85);
        }
      }
    }
    this.ctx.restore();
  }
}

export default GameEngine;
