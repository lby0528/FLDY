import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GameEngine from './game';
import { RESIDENCES, BUFFS } from './constants';

// Using Lucide-React as requested
import { 
  Hammer, 
  BookOpen, 
  Archive, 
  MessageSquare, 
  Settings as SettingsIcon, 
  History as HistoryIcon,
  X,
  Send as SendIcon,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Flame,
  Snowflake,
  Zap,
  Trophy,
  Info,
  ArrowLeft,
  Pause,
  Play,
  CloudRain,
  CloudSnow,
  Wind,
  Home
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('LEVEL_SELECT'); // LEVEL_SELECT, PLAYING, QUIZ, RESULT, CHAT, ACADEMY, ARCHIVES
  const [showLanding, setShowLanding] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [unlockedResidences, setUnlockedResidences] = useState([]); // Start with none unlocked
  const [currentLevel, setCurrentLevel] = useState(null);
  const [score, setScore] = useState(0);
  const [stability, setStability] = useState(100);
  const [combo, setCombo] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (showLanding) {
      const timer = setTimeout(() => setShowButtons(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLanding]);

  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeBuff, setActiveBuff] = useState(null);
  const [weather, setWeather] = useState('CLEAR');
  
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [selectedAcademyResidence, setSelectedAcademyResidence] = useState(RESIDENCES[0]);
  const [selectedAcademyCategory, setSelectedAcademyCategory] = useState('style'); // style, customs, history, heritage, features
  const [showNavMenu, setShowNavMenu] = useState(false);
  
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // If buttons are shown, loop from 6 seconds instead of 0
      if (showButtons && video.currentTime >= video.duration - 0.2) {
        video.currentTime = 6;
        video.play();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [showButtons]);

  useEffect(() => {
    if ((gameState === 'PLAYING' || gameState === 'QUIZ') && canvasRef.current) {
      if (!engineRef.current) {
        engineRef.current = new GameEngine(canvasRef.current, (data) => {
          if (data.state) {
            setGameState(data.state);
            if (data.state === 'RESULT' && data.win) {
              setUnlockedResidences(prev => [...new Set([...prev, engineRef.current.currentLevel.id])]);
            }
          }
          if (data.activeQuiz) setActiveQuiz(data.activeQuiz);
          if (data.score !== undefined) setScore(data.score);
          if (data.stability !== undefined) setStability(data.stability);
          if (data.combo !== undefined) setCombo(data.combo);
          if (data.weather !== undefined) setWeather(data.weather);
          if (data.level) setCurrentLevel(data.level);
        });
        
        // If we just created the engine and we are in PLAYING state, start the level
        if (gameState === 'PLAYING' && currentLevel) {
          engineRef.current.startLevel(currentLevel.id);
        }
      } else {
        engineRef.current.setCanvas(canvasRef.current);
      }
    }
  }, [gameState, currentLevel]);

  useEffect(() => {
    if (engineRef.current) {
      if (gameState !== 'PLAYING' && gameState !== 'QUIZ') {
        engineRef.current.state = 'PAUSED';
      }
    }
  }, [gameState]);

  const startLevel = (level) => {
    setGameState('PLAYING');
    setCurrentLevel(level);
    setScore(0);
    setStability(100);
    setCombo(0);
    setWeather('CLEAR');
    setActiveBuff(null);
    setShowExitConfirm(false);
    
    // If engine is already ready, start immediately with a small delay to ensure canvas is mounted
    if (engineRef.current) {
      setTimeout(() => {
        if (engineRef.current) engineRef.current.startLevel(level.id);
      }, 100);
    }
    // If not ready, the useEffect will handle it once the canvas mounts
  };

  const handleQuizAnswer = (index) => {
    if (!activeQuiz) return;
    
    const isCorrect = index === activeQuiz.correct;
    if (isCorrect) {
      const buff = BUFFS && BUFFS.length > 0 ? BUFFS[Math.floor(Math.random() * BUFFS.length)] : null;
      if (buff) {
        setActiveBuff(buff);
        setQuizResult({ correct: true, message: `回答正确！获得奖励：${buff.name}` });
        if (engineRef.current) {
          engineRef.current.applyBuff(buff);
          if (buff.duration > 0) {
            setTimeout(() => {
              if (engineRef.current) engineRef.current.removeBuff(buff.id);
              setActiveBuff(null);
            }, buff.duration);
          }
        }
      } else {
        setQuizResult({ correct: true, message: `回答正确！` });
      }
    } else {
      const penalty = 15;
      setQuizResult({ correct: false, message: `回答错误！惩罚：稳固度 -${penalty}%` });
      if (engineRef.current) {
        engineRef.current.applyPenalty(penalty);
      }
    }
    
    setTimeout(() => {
      setQuizResult(null);
      setActiveQuiz(null);
      setGameState('PLAYING');
      if (engineRef.current) engineRef.current.state = 'PLAYING';
    }, 2000);
  };

  const handleContinueEndless = () => {
    if (engineRef.current) {
      engineRef.current.continueEndless();
      setGameState('PLAYING');
    }
  };

  const handleFinishLevel = () => {
    if (engineRef.current) {
      engineRef.current.winLevel();
    }
  };

  const handleExitLevel = () => {
    if (engineRef.current) engineRef.current.state = 'MENU';
    setGameState('LEVEL_SELECT');
    setShowExitConfirm(false);
  };

  const PRESET_QUESTIONS = [
    { q: "福建土楼的防御设计有何精妙之处？", a: "福建土楼采用厚实的夯土墙，底层不设窗户，唯一的入口设有防火防撞的厚重木门。内部环形结构便于族人聚居与防御，体现了极强的宗族凝聚力与安全意识。" },
    { q: "北京四合院的‘影壁’起什么作用？", a: "影壁（照壁）位于大门内或外，既能阻挡外界视线，保证私密性，又能起到装饰作用。在风水上，它被认为能阻挡邪气，聚拢财气。" },
    { q: "皖南民居的‘马头墙’除了美观还有什么功能？", a: "马头墙又称防火墙。在聚落密集的皖南地区，当火灾发生时，高出的墙体能有效阻断火势蔓延，保护相邻建筑，是极具智慧的防火设计。" },
    { q: "江南水乡民居为何多采用‘前店后宅’？", a: "这种布局适应了江南发达的水路贸易。临水一侧便于装卸货物作为店铺，后部或上层作为起居空间，充分利用了有限的滨水土地。" },
    { q: "广东陈家祠的‘三雕一塑’指什么？", a: "指木雕、石雕、砖雕和陶塑。这些精美的装饰遍布建筑各处，题材多取自民间传说与历史典故，展现了岭南建筑极高的艺术造诣。" },
    { q: "晋中大院的‘窑洞式’结构有何气候优势？", a: "晋中大院常采用厚墙重檐，部分结构借鉴窑洞。这种设计冬暖夏凉，能有效应对北方剧烈的温差变化，体现了因地制宜的营造智慧。" },
    { q: "川西林盘民居如何体现‘天人合一’？", a: "川西林盘将住宅、林木、农田与水渠有机结合。建筑掩映在茂密的竹木之中，形成了独特的微气候，是人与自然和谐共生的典范。" },
    { q: "云南和顺民居的‘中西合璧’体现在哪？", a: "和顺是著名侨乡，民居在保留传统中式院落结构的同时，巧妙融入了西洋式的铁艺阳台、彩色玻璃等元素，展现了开放包容的文化特色。" }
  ];

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = { role: 'user', parts: [{ text: chatInput }] };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Mocking for now as per instructions, but structured for real API
      if (import.meta.env.VITE_USE_MOCK_AI === 'true' || !import.meta.env.GEMINI_API_KEY) {
        setTimeout(() => {
          const responses = [
            "老夫观汝所问，此乃营造之精要也。北地苦寒，梁木需厚重方能御雪，此乃天人合一之理。",
            "营造之道，存乎一心。木石虽无言，然其纹理脉络皆有定数，不可强求。",
            "汝之好学，老夫甚慰。古法营造，讲究的是‘分寸’二字，多一分则累赘，少一分则倾颓。",
            "若论江南水乡，粉墙黛瓦，灵动清秀，与北地之雄浑截然不同，皆因地制宜之故。"
          ];
          const aiMsg = { role: 'model', parts: [{ text: responses[Math.floor(Math.random() * responses.length)] }] };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsChatLoading(false);
        }, 1000);
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: chatInput, history: chatHistory })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const reader = response.body.getReader();
        let aiText = '';
        const aiMsg = { role: 'model', parts: [{ text: '' }] };
        setChatHistory(prev => [...prev, aiMsg]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                aiText += data.text;
                setChatHistory(prev => {
                  if (prev.length === 0) return prev;
                  const newHistory = [...prev];
                  const lastMsg = newHistory[newHistory.length - 1];
                  if (lastMsg && lastMsg.parts && lastMsg.parts.length > 0) {
                    lastMsg.parts[0].text = aiText;
                  }
                  return newHistory;
                });
              } catch (e) {}
            }
          }
        }
        setIsChatLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-secondary font-sans selection:bg-primary/20">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
          >
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              loop={!showButtons}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'saturate(0.8) brightness(1.1)' }}
              src="/shiping.mp4"
            >
              <source src="/shiping.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

            <AnimatePresence>
              {showButtons && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="relative z-10 flex flex-col gap-10 items-center"
                >
                  <button 
                    onClick={() => setShowLanding(false)}
                    className="group relative w-56 md:w-72 py-4 md:py-6 overflow-hidden rounded-full transition-all duration-700 hover:scale-105 active:scale-95"
                  >
                    {/* Cloud-like background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 animate-pulse" />
                    
                    {/* Golden border with glow */}
                    <div className="absolute inset-0 border-2 border-[#d4af37]/40 rounded-full group-hover:border-[#d4af37]/80 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]" />
                    
                    {/* Text with complex color scheme: 朱红为底，青绿叠晕，金线勾棱 */}
                    <span className="relative z-10 text-2xl md:text-4xl font-headline tracking-[0.3em] ink-bleed"
                      style={{
                        color: '#8f000d', // Cinnabar Red base
                        textShadow: '0 0 1px #d4af37, 0 0 2px #d4af37, 2px 2px 4px rgba(0, 128, 128, 0.6)', // Gold stroke + Cyan-Green halo
                        WebkitTextStroke: '0.5px #d4af37' // Gold outline
                      }}
                    >
                      开启营造
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#d4af37]/40 font-headline tracking-[0.5em] text-sm">
              飞梁叠韵 · 营造之美
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col min-h-screen">
            {/* Top Navigation */}
      {!['PLAYING', 'QUIZ'].includes(gameState) && (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-surface/90 backdrop-blur-md border-b border-secondary/10">
          <div className="font-headline text-3xl font-black text-secondary ink-bleed flex items-center gap-3">
            <div className="seal w-10 h-10 text-lg">匠</div>
            大匠之卷
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-surface-container-high rounded-full overflow-hidden border border-secondary/10">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${stability}%` }}></div>
              </div>
              <span className="font-headline text-sm text-secondary">稳固度</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline text-2xl font-bold text-secondary">{score.toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary/60">匠技值</span>
            </div>
          </nav>
          <div className="flex gap-4 items-center">
            <button className="text-secondary hover:text-primary transition-colors"><HistoryIcon size={20} /></button>
            <button className="text-secondary hover:text-primary transition-colors"><SettingsIcon size={20} /></button>
          </div>
        </header>
      )}

      <div className={`flex flex-1 ${gameState === 'PLAYING' || gameState === 'QUIZ' ? 'pt-0' : 'pt-20'}`}>
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full z-40 w-64 bg-surface/50 backdrop-blur-xl border-r border-secondary/10 py-24 px-6 hidden lg:flex flex-col ${gameState === 'PLAYING' || gameState === 'QUIZ' ? 'lg:hidden' : ''}`}>
          <div className="mb-12 text-center">
            <div className="w-20 h-20 rounded-sm bg-surface-container-high flex items-center justify-center mb-4 shadow-inner mx-auto border border-secondary/10 transform rotate-3">
              <Hammer className="text-secondary" size={36} />
            </div>
            <h3 className="font-headline font-black text-secondary text-2xl">营造司正</h3>
            <p className="font-headline italic text-sm text-tertiary/70">大匠考据使</p>
          </div>
          
          <nav className="flex-1 space-y-4">
            <button onClick={() => setGameState('LEVEL_SELECT')} className={`w-full flex items-center gap-3 p-3 font-headline transition-all ${gameState === 'LEVEL_SELECT' ? 'text-primary font-bold translate-x-2' : 'text-secondary hover:translate-x-1'}`}>
              <div className={`w-2 h-2 rounded-full ${gameState === 'LEVEL_SELECT' ? 'bg-primary' : 'bg-transparent'}`}></div>
              营造坊
            </button>
            <button onClick={() => setGameState('ACADEMY')} className={`w-full flex items-center gap-3 p-3 font-headline transition-all ${gameState === 'ACADEMY' ? 'text-primary font-bold translate-x-2' : 'text-secondary hover:translate-x-1'}`}>
              <div className={`w-2 h-2 rounded-full ${gameState === 'ACADEMY' ? 'bg-primary' : 'bg-transparent'}`}></div>
              书院
            </button>
            <button onClick={() => setGameState('ARCHIVES')} className={`w-full flex items-center gap-3 p-3 font-headline transition-all ${gameState === 'ARCHIVES' ? 'text-primary font-bold translate-x-2' : 'text-secondary hover:translate-x-1'}`}>
              <div className={`w-2 h-2 rounded-full ${gameState === 'ARCHIVES' ? 'bg-primary' : 'bg-transparent'}`}></div>
              档案库
            </button>
            <button onClick={() => setGameState('CHAT')} className={`w-full flex items-center gap-3 p-3 font-headline transition-all ${gameState === 'CHAT' ? 'text-primary font-bold translate-x-2' : 'text-secondary hover:translate-x-1'}`}>
              <div className={`w-2 h-2 rounded-full ${gameState === 'CHAT' ? 'bg-primary' : 'bg-transparent'}`}></div>
              请教大匠
            </button>
          </nav>

          <button onClick={() => setGameState('CHAT')} className="mt-auto btn-primary w-full flex items-center justify-center gap-2">
            <MessageSquare size={20} /> 请教大匠
          </button>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col items-center ${gameState === 'PLAYING' || gameState === 'QUIZ' ? 'p-2 md:p-4' : 'lg:ml-64 p-8'}`}>
          <AnimatePresence initial={false}>
            {(gameState === 'LEVEL_SELECT' || gameState === 'CHAT') && (
              <motion.section 
                key="levels"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
                style={{ 
                  backgroundImage: "url('/china-map.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'brightness(1.2)'
                }}
              >
                {/* Title Overlay - Floating on map */}
                <div className="absolute top-6 left-6 md:top-12 md:left-12 z-10 pointer-events-none">
                  <h2 className="font-headline text-4xl md:text-6xl text-primary ink-bleed tracking-[0.3em]">大匠之卷</h2>
                  <p className="font-headline text-secondary/60 text-base md:text-xl mt-2 tracking-widest italic">地域民居营造志</p>
                </div>

                {/* Back to Home & How to Play Buttons */}
                <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20 flex flex-col md:flex-row gap-2 md:gap-4">
                  <button 
                    onClick={() => { setShowLanding(true); setShowButtons(false); }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full text-secondary transition-all shadow-xl group"
                  >
                    <Home size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="font-headline tracking-[0.2em] font-bold text-sm md:text-base">返回主页</span>
                  </button>
                  <button 
                    onClick={() => setShowHowToPlay(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full text-secondary transition-all shadow-xl group"
                  >
                    <Info size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="font-headline tracking-[0.2em] font-bold text-sm md:text-base">玩法介绍</span>
                  </button>
                </div>

                {/* Map Content / Interactive Markers */}
                <div className="absolute inset-0" onClick={() => showNavMenu && setShowNavMenu(false)}>
                  {RESIDENCES.map((res) => {
                    const isUnlocked = unlockedResidences.includes(res.id);
                    return (
                      <motion.div
                        key={res.id}
                        className="absolute group"
                        style={{ left: `${res.mapPos.x}%`, top: `${res.mapPos.y}%` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ zIndex: 10 }}
                      >
                        <div 
                          onClick={() => startLevel(res)}
                          className="relative cursor-pointer flex flex-col items-center transition-all"
                        >
                          {/* Pulsing Seal Style Marker */}
                          <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center group-hover:scale-125 md:group-hover:scale-150 transition-transform duration-500">
                            {/* Decorative Ring */}
                            <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-[spin_15s_linear_infinite] group-hover:border-primary"></div>
                            
                            {/* Main Icon Container */}
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-surface border-2 border-secondary/40 rounded-full flex items-center justify-center shadow-2xl group-hover:border-primary transition-all duration-500 overflow-hidden">
                              <img 
                                src={res.image} 
                                alt={res.name} 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            
                          {/* Pulse Effect - Always on for better visibility as requested */}
                          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping pointer-events-none"></div>
                          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse pointer-events-none"></div>
                          </div>
                          
                          {/* Floating Name Label - Calligraphy Style */}
                          <div className={`absolute ${res.mapPos.y > 80 ? 'bottom-full mb-2 md:mb-4' : 'top-full mt-1 md:mt-2'} bg-surface/80 backdrop-blur-sm px-2 md:px-4 py-0.5 md:py-1 border-b-2 border-primary/0 group-hover:border-primary transition-all z-20`}>
                            <span className="font-headline text-sm md:text-2xl text-secondary group-hover:text-primary whitespace-nowrap ink-bleed tracking-wider">{res.name}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Navigation Menu System */}
                <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-50 flex flex-col items-end gap-4">
                  <AnimatePresence>
                    {showNavMenu && (
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 md:p-4 flex flex-col gap-2 md:gap-4 shadow-2xl mb-4 w-[120px] md:w-[140px]"
                      >
                        <button 
                          onClick={() => { setGameState('ACADEMY'); setShowNavMenu(false); }}
                          className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 hover:bg-white/20 rounded-xl transition-all group"
                        >
                          <div className="seal w-8 h-8 md:w-10 md:h-10 text-base md:text-xl group-hover:bg-primary group-hover:text-white transition-colors">学</div>
                          <span className="font-headline text-base md:text-xl tracking-widest text-secondary">营造书院</span>
                        </button>
                        <button 
                          onClick={() => { setGameState('ARCHIVES'); setShowNavMenu(false); }}
                          className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 hover:bg-white/20 rounded-xl transition-all group"
                        >
                          <div className="seal w-8 h-8 md:w-10 md:h-10 text-base md:text-xl group-hover:bg-primary group-hover:text-white transition-colors">典</div>
                          <span className="font-headline text-base md:text-xl tracking-widest text-secondary">档案库</span>
                        </button>
                        <button 
                          onClick={() => { setGameState('CHAT'); setShowNavMenu(false); }}
                          className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 hover:bg-white/20 rounded-xl transition-all group"
                        >
                          <div className="seal w-8 h-8 md:w-10 md:h-10 text-base md:text-xl group-hover:bg-primary group-hover:text-white transition-colors">匠</div>
                          <span className="font-headline text-base md:text-xl tracking-widest text-secondary">请教大匠</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-6 items-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowNavMenu(!showNavMenu); }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 border-4 ${showNavMenu ? 'bg-primary border-white/40 rotate-90' : 'bg-white/20 backdrop-blur-md border-secondary/10'}`}
                    >
                      <div className={`seal w-10 h-10 md:w-14 md:h-14 text-2xl md:text-3xl ${showNavMenu ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                        <span className="seal-text">{showNavMenu ? '阖' : '启'}</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 left-12 font-headline text-secondary/20 tracking-[0.5em] text-sm pointer-events-none">
                  匠心营造 · 万家灯火
                </div>
              </motion.section>
            )}

            {(gameState === 'PLAYING' || gameState === 'QUIZ' || gameState === 'PAUSED') && !currentLevel && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-headline text-primary">正在准备营造工具...</p>
              </div>
            )}

            {(gameState === 'PLAYING' || gameState === 'QUIZ' || gameState === 'PAUSED') && currentLevel && (
              <motion.section 
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[60] bg-[#f4f1ea] flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="w-full h-full relative overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={1066} 
                    className="w-full h-full cursor-crosshair object-cover"
                  />

                  {/* Top Controls Overlay */}
                  <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-30 pointer-events-none">
                    <button 
                      onClick={() => {
                        if (engineRef.current) engineRef.current.state = 'PAUSED';
                        setGameState('PAUSED');
                        setShowExitConfirm(true);
                      }}
                      className="pointer-events-auto group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-secondary transition-all"
                    >
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      <span className="font-headline tracking-widest">返回地图</span>
                    </button>

                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full flex items-center gap-8 pointer-events-auto shadow-xl">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary/50 font-bold">稳固度</span>
                          <div className="w-32 h-1.5 bg-black/5 rounded-full overflow-hidden mt-1.5 border border-black/5">
                            <div className={`h-full transition-all duration-500 ${stability < 30 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${stability}%` }}></div>
                          </div>
                        </div>
                        <div className="w-px h-10 bg-black/10"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary/50 font-bold">匠技值</span>
                          <span className="font-headline text-2xl font-black text-secondary tracking-tighter">{score}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                      {gameState === 'PLAYING' ? (
                        <button 
                          onClick={() => {
                            if (engineRef.current) engineRef.current.state = 'PAUSED';
                            setGameState('PAUSED');
                          }}
                          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-secondary shadow-lg transition-all"
                        >
                          <Pause size={28} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (engineRef.current) engineRef.current.state = 'PLAYING';
                            setGameState('PLAYING');
                          }}
                          className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
                        >
                          <Play size={28} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Weather Indicator */}
                  {weather !== 'CLEAR' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
                    >
                      <div className="bg-primary/90 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-3">
                        <div className="animate-pulse">
                          {weather === 'RAIN' && <CloudRain className="text-white" />}
                          {weather === 'SNOW' && <CloudSnow className="text-white" />}
                          {weather === 'WIND' && <Wind className="text-white" />}
                        </div>
                        <span className="font-headline text-xl text-white tracking-widest">
                          {weather === 'RAIN' && '骤雨倾盆'}
                          {weather === 'SNOW' && '寒雪纷飞'}
                          {weather === 'WIND' && '狂风大作'}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Pause Overlay */}
                  {gameState === 'PAUSED' && (
                    <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="font-headline text-6xl text-white mb-12 ink-bleed tracking-widest">营造暂歇</h2>
                        <div className="flex flex-col gap-6 items-center">
                          <button 
                            onClick={() => {
                              if (engineRef.current) engineRef.current.state = 'PLAYING';
                              setGameState('PLAYING');
                            }}
                            className="btn-primary text-2xl px-20 py-5 w-64"
                          >
                            继续营造
                          </button>
                          <button 
                            onClick={() => setShowExitConfirm(true)}
                            className="btn-secondary text-xl px-12 py-4 w-64 border-white/40 text-white hover:bg-white/10"
                          >
                            退出关卡
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exit Confirmation Dialog */}
                  <AnimatePresence>
                    {showExitConfirm && (
                      <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="bg-[#f4f1ea] p-10 rounded-sm shadow-2xl max-w-md w-full border-t-8 border-primary text-center"
                        >
                          <div className="seal w-16 h-16 text-3xl mb-6 mx-auto">警</div>
                          <h3 className="font-headline text-3xl text-secondary mb-4">是否中断营造？</h3>
                          <p className="text-secondary/60 mb-10 leading-relaxed">
                            当前营造进度尚未保存，若此时离开，所有已收集的构件与匠技值将会丢失。
                          </p>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => {
                                setShowExitConfirm(false);
                                if (gameState === 'PAUSED') {
                                  // Stay in pause
                                } else {
                                  // If they clicked back from playing, resume or stay paused
                                  if (engineRef.current) engineRef.current.state = 'PLAYING';
                                  setGameState('PLAYING');
                                }
                              }}
                              className="flex-1 py-4 font-headline text-xl border border-secondary/20 text-secondary hover:bg-secondary/5 transition-colors"
                            >
                              继续
                            </button>
                            <button 
                              onClick={handleExitLevel}
                              className="flex-1 py-4 font-headline text-xl bg-primary text-white hover:bg-primary-dark transition-colors"
                            >
                              确认退出
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Buff Notification */}
                  <AnimatePresence>
                    {activeBuff && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute top-24 right-6 bg-secondary text-white px-4 py-2 rounded-sm shadow-lg flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        <div className="text-xs">
                          <p className="font-bold">{activeBuff.name}</p>
                          <p className="opacity-80">{activeBuff.desc}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Combo Counter */}
                  {combo > 0 && (
                    <motion.div 
                      key={combo}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <span className="font-headline text-8xl font-black text-primary/10 italic">{combo} 连击</span>
                    </motion.div>
                  )}

                  {/* Quiz Overlay */}
                  <AnimatePresence initial={false}>
                    {gameState === 'QUIZ' && activeQuiz && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center bg-secondary/40 backdrop-blur-sm p-6"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, rotate: -1 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="card-ink max-w-md w-full p-10 shadow-2xl border-t-8 border-primary relative overflow-hidden"
                        >
                          <div className="absolute -top-10 -right-10 opacity-5">
                            <BookOpen size={150} />
                          </div>
                          <h3 className="font-headline text-3xl text-primary mb-8 flex items-center gap-3">
                            <div className="seal w-8 h-8 text-sm">问</div>
                            营造线索
                          </h3>
                          <p className="text-2xl font-headline mb-8 leading-relaxed text-secondary">{activeQuiz.q}</p>
                          <div className="grid gap-4">
                            {activeQuiz.a.map((opt, i) => (
                              <button 
                                key={i}
                                onClick={() => handleQuizAnswer(i)}
                                disabled={!!quizResult}
                                className={`w-full text-left p-4 rounded-sm border-2 transition-all font-headline text-xl ${
                                  quizResult 
                                    ? i === activeQuiz.correct 
                                      ? 'bg-green-50 border-green-600 text-green-800' 
                                      : 'bg-stone-50 border-stone-300 text-stone-400'
                                    : 'border-secondary/10 hover:bg-secondary/5 hover:border-secondary'
                                }`}
                              >
                                {String.fromCharCode(65 + i)}. {opt}
                              </button>
                            ))}
                          </div>
                          {quizResult && (
                            <motion.div 
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className={`mt-8 p-4 rounded-sm text-center font-headline text-xl ${
                                quizResult.correct ? 'bg-primary text-surface' : 'bg-secondary text-surface'
                              }`}
                            >
                              {quizResult.message}
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {gameState === 'ARCHIVES' && (
              <motion.section 
                key="archives"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 md:p-4"
              >
                <div className="card-ink max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-6 md:p-12 shadow-2xl border-t-8 border-secondary relative bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] custom-scrollbar">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 border-b-2 border-secondary/10 pb-6 gap-4">
                    <button 
                      onClick={() => setGameState('LEVEL_SELECT')} 
                      className="text-secondary/40 hover:text-primary transition-all flex items-center gap-2 group self-start md:self-auto"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-secondary/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5">
                        <ArrowLeft size={18} />
                      </div>
                      <span className="font-headline text-base md:text-lg tracking-widest">返回营造坊</span>
                    </button>

                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="seal w-10 h-10 md:w-12 md:h-12 text-2xl md:text-3xl">典</div>
                      <h2 className="font-headline text-3xl md:text-4xl text-secondary tracking-widest">营造档案库</h2>
                    </div>

                    <button onClick={() => setGameState('LEVEL_SELECT')} className="absolute top-4 right-4 md:static text-secondary hover:text-primary transition-transform hover:rotate-90">
                      <X className="w-7 h-7 md:w-8 md:h-8" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/40 p-6 rounded-sm border border-secondary/5 text-center">
                      <p className="text-secondary/60 font-headline text-xl mb-2">营造次数</p>
                      <p className="text-primary font-headline text-5xl">{unlockedResidences.length > 0 ? unlockedResidences.length * 3 + 1 : 0}</p>
                    </div>
                    <div className="bg-white/40 p-6 rounded-sm border border-secondary/5 text-center">
                      <p className="text-secondary/60 font-headline text-xl mb-2">解锁地域</p>
                      <p className="text-primary font-headline text-5xl">{unlockedResidences.length} / {RESIDENCES.length}</p>
                    </div>
                    <div className="bg-white/40 p-6 rounded-sm border border-secondary/5 text-center">
                      <p className="text-secondary/60 font-headline text-xl mb-2">最高连击</p>
                      <p className="text-primary font-headline text-5xl">{unlockedResidences.length > 0 ? 30 + unlockedResidences.length * 5 : 0}</p>
                    </div>
                  </div>

                  <div className="mt-12 space-y-6">
                    <h3 className="font-headline text-3xl text-secondary border-l-4 border-primary pl-4">营造记录</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {RESIDENCES.map((res, i) => {
                        const isUnlocked = unlockedResidences.includes(res.id);
                        return (
                          <div key={i} className={`flex items-center justify-between p-4 rounded-sm border ${isUnlocked ? 'bg-white/20 border-secondary/5' : 'bg-black/5 border-transparent opacity-50'}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 grayscale-[0.5]">
                                <img src={res.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-headline text-2xl text-secondary">{res.name}</span>
                                {!isUnlocked && <span className="ml-3 text-xs text-secondary/40 tracking-widest">尚未解锁</span>}
                              </div>
                            </div>
                            {isUnlocked && (
                              <div className="text-right">
                                <p className="text-primary font-bold">完美复原</p>
                                <p className="text-secondary/40 text-sm">已载入史册</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-12">
                    <button 
                      onClick={() => setGameState('LEVEL_SELECT')}
                      className="btn-secondary flex-1 py-4 text-2xl tracking-[0.5em] flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={24} /> 返回上一页
                    </button>
                    <button 
                      onClick={() => setGameState('LEVEL_SELECT')}
                      className="btn-primary flex-1 py-4 text-2xl tracking-[0.5em]"
                    >
                      阖卷退出
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {gameState === 'ACADEMY' && (
              <motion.section 
                key="academy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 md:p-4"
              >
                <div className="relative flex items-center h-[95vh] md:h-[85vh] max-w-7xl w-full justify-center">
                  {/* Left Scroll Roller */}
                  <motion.div 
                    initial={{ x: '450%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute left-0 z-30 h-full w-8 md:w-14 bg-[#3e2a1f] rounded-sm shadow-[15px_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between py-6 border-x-2 md:border-x-4 border-[#5d4037] hidden sm:flex"
                  >
                    <div className="w-full h-12 bg-gradient-to-b from-[#d4af37]/40 to-transparent rounded-t-sm"></div>
                    <div className="w-full h-12 bg-gradient-to-t from-[#d4af37]/40 to-transparent rounded-b-sm"></div>
                  </motion.div>

                  {/* Main Scroll Body */}
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="relative h-full flex flex-col md:flex-row overflow-hidden bg-[#f4f1ea] shadow-2xl border-x-[6px] md:border-x-[12px] border-[#d4af37]/30 origin-center"
                  >
                    {/* Subtle Landscape Background Overlay */}
                    <div 
                      className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply"
                      style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1920&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-50 pointer-events-none" />

                    {/* Left Sidebar - Residence Selection */}
                    <div className="w-full md:w-80 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pr-2 custom-scrollbar p-4 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#d4af37]/20 bg-[#3e2a1f]/5 shrink-0">
                      <div className="flex items-center gap-3 mb-0 md:mb-6 px-2 border-b-0 md:border-b-2 border-[#d4af37]/30 pb-0 md:pb-4 shrink-0">
                        <div className="seal w-8 h-8 md:w-10 md:h-10 text-lg md:text-xl bg-[#8f000d] text-white">
                          <span className="seal-text">匠</span>
                        </div>
                        <h3 className="font-headline text-xl md:text-3xl text-[#3e2a1f] tracking-widest">营造书院</h3>
                      </div>
                      {RESIDENCES.map(res => (
                        <button
                          key={res.id}
                          onClick={() => setSelectedAcademyResidence(res)}
                          className={`group relative flex items-center gap-3 md:gap-4 p-2 md:p-4 rounded-sm transition-all border-l-2 md:border-l-4 shrink-0 ${
                            selectedAcademyResidence.id === res.id 
                              ? 'bg-[#8f000d] text-white border-[#d4af37] shadow-lg translate-x-0 md:translate-x-2' 
                              : 'bg-white/40 text-[#3e2a1f]/60 border-transparent hover:bg-white/60 hover:text-[#3e2a1f]'
                          }`}
                        >
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#d4af37]/20 shrink-0">
                            <img src={res.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="font-headline text-lg md:text-2xl tracking-wider whitespace-nowrap">{res.name}</span>
                        </button>
                      ))}
                    </div>
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                      {/* Academy Header */}
                      <div className="px-6 md:px-12 pt-6 md:pt-12 pb-4 md:pb-8 border-b-2 border-[#d4af37]/30 flex justify-between items-end bg-white/30">
                        <div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <h2 className="font-headline text-3xl md:text-6xl text-[#3e2a1f] tracking-tighter">{selectedAcademyResidence.name}</h2>
                            <div className="px-2 md:px-4 py-1 bg-[#8f000d] text-white font-headline text-sm md:text-xl tracking-widest rounded-sm">营造考据</div>
                          </div>
                          <p className="text-[#3e2a1f]/40 font-headline text-lg md:text-2xl mt-2 md:mt-4 tracking-[0.2em] md:tracking-[0.3em] italic">—— 地域营造志 · 卷{RESIDENCES.indexOf(selectedAcademyResidence) + 1} ——</p>
                        </div>
                        <button onClick={() => setGameState('LEVEL_SELECT')} className="group flex flex-col items-center gap-1 md:gap-2">
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#3e2a1f]/20 flex items-center justify-center group-hover:bg-[#8f000d] group-hover:text-white transition-all">
                            <X className="w-[18px] h-[18px] md:w-6 md:h-6" />
                          </div>
                          <span className="font-headline text-xs md:text-lg text-[#3e2a1f]/60 group-hover:text-[#8f000d]">阖卷</span>
                        </button>
                      </div>

                      {/* Category Tabs */}
                      <div className="flex px-4 md:px-12 bg-[#3e2a1f]/5 border-b-2 border-[#d4af37]/10 overflow-x-auto custom-scrollbar shrink-0">
                        {[
                          { id: 'style', label: '建筑风格' },
                          { id: 'customs', label: '风俗习惯' },
                          { id: 'history', label: '历史背景' },
                          { id: 'heritage', label: '文化底蕴' },
                          { id: 'features', label: '当地特色' }
                        ].map((cat) => (
                          <button 
                            key={cat.id}
                            onClick={() => setSelectedAcademyCategory(cat.id)}
                            className={`px-4 md:px-10 py-4 md:py-6 font-headline text-lg md:text-2xl transition-all relative whitespace-nowrap ${
                              selectedAcademyCategory === cat.id ? 'text-[#8f000d] font-bold' : 'text-[#3e2a1f]/60 hover:text-[#3e2a1f]'
                            }`}
                          >
                            {cat.label}
                            {selectedAcademyCategory === cat.id && (
                              <motion.div layoutId="academy-cat-edge" className="absolute bottom-0 left-0 w-full h-1 md:h-1.5 bg-[#8f000d]" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar bg-white/20">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedAcademyResidence.id + selectedAcademyCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-5xl mx-auto"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                              {/* Left Content - Image and Main Text */}
                              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                <div className="card-ink p-6 md:p-8 border-t-4 border-primary shadow-lg">
                                  <div className="flex flex-col gap-6 md:gap-8">
                                    <div className="w-full h-48 md:h-80 rounded-sm overflow-hidden shadow-md border-4 border-white shrink-0">
                                      <img 
                                        src={selectedAcademyResidence.image} 
                                        alt={selectedAcademyResidence.name} 
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div className="space-y-4 md:space-y-6">
                                      <h4 className="font-headline text-2xl md:text-4xl text-primary border-b-2 border-primary/10 pb-2">
                                        {
                                          selectedAcademyCategory === 'style' ? '营造法式 · 风格' :
                                          selectedAcademyCategory === 'customs' ? '岁时节令 · 风俗' :
                                          selectedAcademyCategory === 'history' ? '往昔峥嵘 · 历史' :
                                          selectedAcademyCategory === 'heritage' ? '文脉传承 · 底蕴' : '一方水土 · 特色'
                                        }
                                      </h4>
                                      <p className="text-secondary text-base md:text-xl font-serif leading-relaxed text-justify indent-8">
                                        {selectedAcademyResidence.details[selectedAcademyCategory]}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Classic Quote Section */}
                                <div className="card-ink p-6 md:p-8 bg-primary/5 border-l-4 border-primary shadow-sm">
                                  <h5 className="text-primary text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                                    <BookOpen className="w-[18px] h-[18px] md:w-5 md:h-5" />
                                    经典语录
                                  </h5>
                                  <p className="text-secondary text-xl md:text-2xl font-headline italic leading-relaxed">
                                    {selectedAcademyResidence.classicQuote}
                                  </p>
                                </div>
                              </div>

                              {/* Right Content - Knowledge Points */}
                              <div className="space-y-6 md:space-y-8">
                                <div className="card-ink p-6 md:p-8 border-t-4 border-secondary shadow-md">
                                  <h5 className="text-secondary text-xl md:text-2xl mb-4 md:mb-6 font-bold flex items-center gap-2">
                                    <Info className="w-5 h-5 md:w-6 md:h-6" />
                                    知识要点
                                  </h5>
                                  <ul className="space-y-6 md:space-y-8">
                                    {selectedAcademyResidence.knowledge.map((k, idx) => (
                                      <li key={idx} className="space-y-1 md:space-y-2">
                                        <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                          <span className="text-primary font-bold text-base md:text-lg">【{k.title}】</span>
                                        </div>
                                        <p className="text-secondary/80 text-sm md:text-base leading-relaxed pl-4 border-l border-secondary/10">
                                          {k.content}
                                        </p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Decorative Seal */}
                                <div className="flex justify-center mt-4">
                                  <div className="seal w-24 h-24 md:w-32 md:h-32 text-4xl md:text-6xl shadow-2xl flex flex-col items-center justify-center leading-[0.8] pt-2 -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-default">
                                    <span className="seal-text">大</span>
                                    <span className="seal-text">匠</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Scroll Roller */}
                  <motion.div 
                    initial={{ x: '-450%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute right-0 z-30 h-full w-8 md:w-14 bg-[#3e2a1f] rounded-sm shadow-[-15px_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between py-6 border-x-2 md:border-x-4 border-[#5d4037] hidden sm:flex"
                  >
                    <div className="w-full h-12 bg-gradient-to-b from-[#d4af37]/40 to-transparent rounded-t-sm"></div>
                    <div className="w-full h-12 bg-gradient-to-t from-[#d4af37]/40 to-transparent rounded-b-sm"></div>
                  </motion.div>
                </div>
              </motion.section>
            )}

            {gameState === 'RESULT' && (
              <motion.section 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
              >
                <div className="card-ink p-12 shadow-2xl border-t-8 border-secondary text-center">
                  <div className="mb-10">
                    <div className="seal w-24 h-24 text-5xl mx-auto mb-8">
                      {stability > 0 ? '成' : '败'}
                    </div>
                    <h2 className="font-headline text-6xl text-secondary mb-4">
                      {stability > 0 ? '营造大成' : '功亏一篑'}
                    </h2>
                    <p className="text-tertiary font-headline text-2xl mb-8">
                      {stability > 0 ? `汝之匠技已臻化境，${currentLevel?.name}复原如初。` : '地基不稳，梁架倾颓，还需勤加练习。'}
                    </p>
                    <div className="flex flex-col items-center py-8 border-y-2 border-secondary/10">
                      <span className="font-headline text-7xl font-bold text-primary mb-2">{score.toLocaleString()}</span>
                      <span className="text-sm uppercase tracking-[0.5em] text-tertiary/60">最终匠技值</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {currentLevel?.knowledge.map((k, i) => (
                      <div key={i} className="card-ink p-6 shadow-sm border-t-4 border-primary/40">
                        <h5 className="font-headline font-bold text-secondary text-xl mb-3">{k.title}</h5>
                        <p className="text-base leading-relaxed text-tertiary/80 font-headline">{k.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-8">
                    <button onClick={() => startLevel(currentLevel)} className="btn-primary px-12">重新开始</button>
                    <button onClick={() => setGameState('LEVEL_SELECT')} className="btn-secondary px-12">返回坊间</button>
                    <button onClick={() => setGameState('CHAT')} className="btn-secondary px-12 flex items-center gap-3">
                      <MessageSquare size={24} /> 请教大匠
                    </button>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* How to Play Modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-secondary/80 backdrop-blur-xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="card-ink max-w-3xl w-full p-12 shadow-2xl border-t-8 border-primary relative"
            >
              <button onClick={() => setShowHowToPlay(false)} className="absolute top-6 right-6 text-secondary hover:text-primary transition-transform hover:rotate-90">
                <X size={32} />
              </button>
              <h3 className="font-headline text-5xl text-primary mb-12 text-center ink-bleed">营造秘籍 · 玩法指要</h3>
              <div className="space-y-12 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex gap-8">
                  <div className="seal w-14 h-14 text-3xl shrink-0">壹</div>
                  <div>
                    <h4 className="font-headline text-2xl font-bold mb-3 text-secondary">节奏点击</h4>
                    <p className="text-tertiary leading-relaxed text-xl font-headline">建筑构件随乐律飘落。当构件进入底部的<span className="text-primary font-bold">虚线判定区</span>时，精准点击。判定分为“完美”、“优秀”与“尚可”，连续精准点击可积累连击倍率。</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="seal w-14 h-14 text-3xl shrink-0">贰</div>
                  <div>
                    <h4 className="font-headline text-2xl font-bold mb-3 text-secondary">榫卯合鸣</h4>
                    <p className="text-tertiary leading-relaxed text-xl font-headline">达成<span className="text-primary font-bold">5连击</span>将触发“榫卯合鸣”，掉落古建知识卷轴。答对题目不仅能增长见闻，更可获得“神工”、“稳固”等秘技增益。</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="seal w-14 h-14 text-3xl shrink-0">叁</div>
                  <div>
                    <h4 className="font-headline text-2xl font-bold mb-3 text-secondary">天时变幻</h4>
                    <p className="text-tertiary leading-relaxed text-xl font-headline">
                      营造之路非一帆风顺，需应对多变天气：<br/>
                      • <span className="text-primary font-bold">狂风</span>：构件下落轨迹将变得飘忽不定。<br/>
                      • <span className="text-primary font-bold">暴雨</span>：视线受阻，构件下落速度加快。<br/>
                      • <span className="text-primary font-bold">大雪</span>：严寒之下，构件可能被<span className="text-primary font-bold">随机冰封</span>，需等待3秒消融后方可操作。
                    </p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="seal w-14 h-14 text-3xl shrink-0">肆</div>
                  <div>
                    <h4 className="font-headline text-2xl font-bold mb-3 text-secondary">终极目标</h4>
                    <p className="text-tertiary leading-relaxed text-xl font-headline">在建筑<span className="text-primary font-bold">稳固度</span>归零前，收集齐所有核心构件。复原成功后，可解锁该地域的详细档案，并挑战更高难度的无尽模式。</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowHowToPlay(false)} className="btn-primary w-full mt-12 py-5 text-3xl tracking-[0.5em]">领悟要领</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Modal */}
      {/* Choice Modal */}
      <AnimatePresence>
        {gameState === 'CHOICE' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-secondary/70 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="card-ink max-w-md w-full p-10 shadow-2xl border-t-8 border-primary text-center"
            >
              <div className="seal w-20 h-20 text-4xl mx-auto mb-8">捷</div>
              <h3 className="font-headline text-4xl text-primary mb-6 ink-bleed">营造大成！</h3>
              <p className="text-secondary font-headline text-xl mb-10 leading-relaxed">
                汝已收集齐所有核心构件，{currentLevel?.name}复原在望。
                是现在就此收工，还是挑战自我，进入<span className="text-primary font-bold">无尽模式</span>继续磨炼匠技？
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    if (engineRef.current) {
                      engineRef.current.continueEndless();
                    }
                  }} 
                  className="btn-primary py-4 flex items-center justify-center gap-2 text-2xl"
                >
                  <Flame size={24} /> 进入无尽挑战
                </button>
                <button 
                  onClick={() => {
                    setGameState('RESULT');
                    if (engineRef.current) {
                      engineRef.current.winLevel();
                    }
                  }} 
                  className="btn-secondary py-4 text-2xl"
                >
                  就此收工
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Overlay */}
      <AnimatePresence>
        {gameState === 'CHAT' && (
          <motion.section 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-0 right-0 z-[100] w-full sm:w-[500px] h-full flex flex-col"
          >
            <div className="card-ink w-full h-full shadow-[-20px_0_50px_rgba(0,0,0,0.3)] border-l-2 border-secondary/20 overflow-hidden flex flex-col p-0 bg-surface/95 backdrop-blur-md">
              <div className="bg-secondary p-6 md:p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="seal w-10 h-10 md:w-14 md:h-14 text-2xl md:text-3xl bg-primary">匠</div>
                  <div>
                    <p className="text-surface font-headline font-bold text-xl md:text-2xl leading-none">营造大匠</p>
                    <p className="text-surface/60 text-xs md:text-sm uppercase tracking-widest mt-2 font-headline">亲传指点</p>
                  </div>
                </div>
                <button onClick={() => setGameState('LEVEL_SELECT')} className="text-surface/60 hover:text-surface transition-transform hover:rotate-90">
                  <X className="w-7 h-7 md:w-8 md:h-8" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] custom-scrollbar pb-24">
                <div className="flex gap-4 max-w-[95%]">
                  <div className="bg-surface-container-high p-4 md:p-6 rounded-sm text-lg md:text-xl font-headline italic leading-relaxed shadow-sm border border-secondary/10">
                    “尔今研习营造之法，若有不明之处，老夫当尽心指点。汝可从下述疑难中择一而问。”
                  </div>
                </div>
                
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-4 max-w-[95%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`p-4 md:p-6 rounded-sm text-lg md:text-xl font-headline leading-relaxed shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-primary text-surface border-primary/20' 
                        : 'bg-surface-container-high italic border-secondary/10'
                    }`}>
                      {msg.parts[0].text}
                    </div>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex gap-4">
                    <div className="bg-surface-container-high p-4 md:p-6 rounded-sm animate-pulse border border-secondary/10">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-secondary/30 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-secondary/30 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preset Questions Grid */}
                {!isChatLoading && (
                  <div className="grid gap-3 mt-6 md:mt-8">
                    <p className="text-secondary/40 text-xs md:text-sm font-headline tracking-widest mb-2">—— 常见营造疑难 ——</p>
                    {PRESET_QUESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const userMsg = { role: 'user', parts: [{ text: item.q }] };
                          setChatHistory(prev => [...prev, userMsg]);
                          setIsChatLoading(true);
                          setTimeout(() => {
                            const aiMsg = { role: 'model', parts: [{ text: item.a }] };
                            setChatHistory(prev => [...prev, aiMsg]);
                            setIsChatLoading(false);
                          }, 1000);
                        }}
                        className="text-left p-3 md:p-4 bg-white/40 hover:bg-primary/5 border border-secondary/10 rounded-sm text-base md:text-lg font-headline text-secondary hover:text-primary hover:border-primary transition-all group flex items-start gap-3"
                      >
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-secondary/20 flex items-center justify-center text-[10px] md:text-xs shrink-0 mt-1 group-hover:border-primary">
                          {idx + 1}
                        </div>
                        {item.q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!['PLAYING', 'QUIZ'].includes(gameState) && (
        <footer className="w-full py-12 flex flex-col items-center gap-6 mt-auto border-t-2 border-secondary/10">
          <nav className="flex gap-16">
            <a href="#" className="font-headline text-lg tracking-widest text-primary underline decoration-wavy underline-offset-8">营造哲学</a>
            <a href="#" className="font-headline text-lg tracking-widest text-secondary/60 hover:text-secondary transition-colors">工艺技法</a>
            <a href="#" className="font-headline text-lg tracking-widest text-secondary/60 hover:text-secondary transition-colors">匠心传承</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-secondary/20"></div>
            <p className="font-headline text-sm tracking-[0.5em] text-secondary/40">
              © 甲辰龙年 - 钦定内廷营造司
            </p>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-secondary/20"></div>
          </div>
        </footer>
      )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
