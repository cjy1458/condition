import React, { useState, useRef, useEffect } from 'react';
import { Zap, Play, RotateCcw, Activity, Keyboard, Smartphone, ChevronRight, AlertCircle, Trophy } from 'lucide-react';

type TestMode = 'reflex' | 'balance' | 'typing';
type GameState = 'menu' | 'playing' | 'round-result' | 'final-result';

// --- Sub Component: Reflex Game ---
const ReflexGame: React.FC<{ onFinish: (score: number) => void }> = ({ onFinish }) => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'too-early'>('idle');
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setState('waiting');
    const randomDelay = 2000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
        setState('ready');
        startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleAction = () => {
    if (state === 'idle') {
        startGame();
    } else if (state === 'waiting') {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        setState('too-early');
    } else if (state === 'ready') {
        const endTime = Date.now();
        onFinish(endTime - startTimeRef.current);
    } else if (state === 'too-early') {
        startGame();
    }
  };

  let content = { bg: 'bg-[#0b6b45]', text: '터치해서 시작', sub: '화면이 초록색이 되면 누르세요', icon: <Zap className="w-16 h-16 text-[#c3e02e]" /> };
  if (state === 'waiting') content = { bg: 'bg-[#b91c1c]', text: '기다리세요...', sub: '아직입니다', icon: <div className="text-6xl animate-pulse">✋</div> };
  if (state === 'ready') content = { bg: 'bg-[#c3e02e]', text: '지금 터치!', sub: '', icon: <Zap className="w-20 h-20 text-[#0b6b45] animate-ping" /> };
  if (state === 'too-early') content = { bg: 'bg-[#eab308]', text: '너무 빨라요!', sub: '다시 터치해서 재시도', icon: <AlertCircle className="w-16 h-16 text-white" /> };

  return (
    <div onMouseDown={handleAction} onTouchStart={(e) => { e.preventDefault(); handleAction(); }} className={`w-full h-full flex flex-col items-center justify-center cursor-pointer ${content.bg} transition-colors duration-200 p-8 text-center select-none`}>
       <div className="mb-6">{content.icon}</div>
       <h2 className={`text-4xl font-black mb-4 ${state === 'ready' ? 'text-[#0b6b45]' : 'text-white'}`}>{content.text}</h2>
       <p className={`text-lg font-bold ${state === 'ready' ? 'text-[#0b6b45]/70' : 'text-white/70'}`}>{content.sub}</p>
    </div>
  );
};

// --- Sub Component: Balance Game ---
const BalanceGame: React.FC<{ onFinish: (score: number) => void }> = ({ onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [outTime, setOutTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // -50 to 50
  
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Helper to handle orientation
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (!isPlaying) return;
    const x = Math.min(Math.max((e.gamma || 0), -45), 45); // Left/Right tilt
    const y = Math.min(Math.max((e.beta || 0) - 45, -45), 45); // Front/Back tilt (assuming held at 45deg)
    
    // Map to -50 ~ 50 range
    setPos({ x: (x / 45) * 50, y: (y / 45) * 50 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      // Fallback for desktop testing
      if (!isPlaying) return;
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = ((e.clientX - rect.left - centerX) / centerX) * 50;
      const y = ((e.clientY - rect.top - centerY) / centerY) * 50;
      setPos({ x: Math.min(Math.max(x, -50), 50), y: Math.min(Math.max(y, -50), 50) });
  };

  useEffect(() => {
    if (isPlaying) {
        window.addEventListener('deviceorientation', handleOrientation);
        startTimeRef.current = Date.now();
        lastTimeRef.current = Date.now();
        
        const loop = () => {
            const now = Date.now();
            const delta = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            setTimeLeft(prev => {
                const newTime = Math.max(0, prev - delta);
                if (newTime <= 0) {
                    setIsPlaying(false);
                    return 0;
                }
                return newTime;
            });

            // Calculate distance from center (0,0)
            // Center zone radius approx 20 units
            setPos(currentPos => {
                const dist = Math.sqrt(currentPos.x * currentPos.x + currentPos.y * currentPos.y);
                if (dist > 25) { // Threshold
                    setOutTime(prev => prev + delta);
                }
                return currentPos;
            });

            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }
  }, [isPlaying]);

  useEffect(() => {
      if (timeLeft === 0 && !isPlaying) {
          onFinish(outTime);
      }
  }, [timeLeft, isPlaying]);

  const start = async () => {
      // Request permission for iOS 13+
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
              const response = await (DeviceOrientationEvent as any).requestPermission();
              if (response === 'granted') {
                  setIsPlaying(true);
              } else {
                  alert('센서 권한이 필요합니다.');
                  // Still allow playing for fallback
                  setIsPlaying(true);
              }
          } catch (e) {
              setIsPlaying(true);
          }
      } else {
          setIsPlaying(true);
      }
  };

  if (!isPlaying && timeLeft === 5.0) {
      return (
          <div className="w-full h-full bg-[#0b6b45] flex flex-col items-center justify-center p-8 text-center">
              <Smartphone className="w-16 h-16 text-[#c3e02e] mb-6 animate-pulse" />
              <h2 className="text-3xl font-black text-white mb-4">수평 유지하기</h2>
              <p className="text-white/80 mb-8">
                  폰을 평평하게 들고<br/>
                  가운데 원 안에 캐릭터를 가두세요!
              </p>
              <button onClick={start} className="bg-[#c3e02e] text-[#0b6b45] px-8 py-3 rounded-full font-bold text-xl shadow-lg active:scale-95 transition-transform">
                  테스트 시작
              </button>
              <p className="text-white/40 text-xs mt-4">* PC에서는 마우스로 테스트 가능</p>
          </div>
      );
  }

  return (
      <div 
        className="w-full h-full bg-[#1a1a1a] relative overflow-hidden cursor-crosshair touch-none"
        onMouseMove={handleMouseMove}
      >
          {/* Target Zone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-[#c3e02e]/30 bg-[#c3e02e]/10 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#c3e02e]/50 rounded-full" />
          </div>

          {/* User Cursor (Condition Ball) */}
          <div 
            className="absolute top-1/2 left-1/2 w-12 h-12 bg-gradient-to-br from-[#c3e02e] to-[#0b6b45] rounded-full shadow-[0_0_20px_rgba(195,224,46,0.5)] flex items-center justify-center font-bold text-[10px] text-white border-2 border-white transition-transform duration-75"
            style={{
                transform: `translate(calc(-50% + ${pos.x * 2}px), calc(-50% + ${pos.y * 2}px))`
            }}
          >
              나
          </div>

          {/* HUD */}
          <div className="absolute top-6 w-full text-center">
              <div className="text-4xl font-black text-white font-mono">{timeLeft.toFixed(1)}</div>
              <div className="text-sm font-bold text-[#c3e02e]">남은 시간</div>
          </div>
          
          <div className={`absolute bottom-6 w-full text-center transition-colors duration-300 ${outTime > 0 ? 'text-red-500' : 'text-white/50'}`}>
              <div className="text-xl font-bold">이탈 시간: {outTime.toFixed(2)}초</div>
          </div>
      </div>
  );
};

// --- Sub Component: Typing Game ---
const TypingGame: React.FC<{ onFinish: (score: number) => void }> = ({ onFinish }) => {
    const sentences = [
        "간편한 숙취해소 컨디션 스틱 챙겼니?",
        "내일의 나에게 미안하지 않게",
        "음주는 적당히 분위기는 확실하게",
        "확 깬 상태로 즐겁게 시작해볼까",
        "대한민국 숙취해소 컨디션 최고"
    ];
    const [target, setTarget] = useState("");
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(10);
    const [isStarted, setIsStarted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isStarted && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isStarted && timeLeft === 0) {
            handleSubmit();
        }
    }, [isStarted, timeLeft]);

    const start = () => {
        setTarget(sentences[Math.floor(Math.random() * sentences.length)]);
        setIsStarted(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        
        // Calculate Levenshtein distance roughly or just diff count
        let typos = Math.abs(target.length - input.length);
        const len = Math.min(target.length, input.length);
        for(let i=0; i<len; i++) {
            if(target[i] !== input[i]) typos++;
        }
        
        onFinish(typos);
    };

    if (!isStarted) {
        return (
            <div className="w-full h-full bg-[#0b6b45] flex flex-col items-center justify-center p-8 text-center">
                <Keyboard className="w-16 h-16 text-[#c3e02e] mb-6" />
                <h2 className="text-3xl font-black text-white mb-4">오타 제로 챌린지</h2>
                <p className="text-white/80 mb-8">
                    10초 안에 제시어를<br/>
                    정확하게 입력하세요!
                </p>
                <button onClick={start} className="bg-[#c3e02e] text-[#0b6b45] px-8 py-3 rounded-full font-bold text-xl shadow-lg active:scale-95 transition-transform">
                    도전 시작
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#1a1a1a] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-white/60 font-bold">남은 시간</span>
                    <span className={`text-2xl font-black font-mono ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-[#c3e02e]'}`}>
                        {timeLeft}s
                    </span>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
                    <p className="text-white text-lg font-bold text-center break-keep leading-relaxed">
                        {target}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-white text-black text-lg p-4 rounded-xl outline-none border-2 border-[#c3e02e] font-bold text-center placeholder-gray-400"
                        placeholder="여기에 입력하세요"
                        autoComplete="off"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#0b6b45] text-white px-4 rounded-lg font-bold">
                        완료
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Main Component ---
const ReactionTest: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedMode, setSelectedMode] = useState<TestMode>('reflex');
  const [rounds, setRounds] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState<number[]>([]);

  const handleStartGame = () => {
    setScores([]);
    setCurrentRound(1);
    setGameState('playing');
  };

  const handleRoundFinish = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentRound < rounds) {
        setGameState('round-result');
        setTimeout(() => {
            setCurrentRound(prev => prev + 1);
            setGameState('playing');
        }, 1500);
    } else {
        setGameState('final-result');
    }
  };

  const getResultAnalysis = () => {
    let avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (selectedMode === 'reflex') {
        // ms
        if (avg < 250) return { grade: '완벽', desc: '컨디션 최상! 집에 가긴 일러요.', color: 'text-[#c3e02e]' };
        if (avg < 400) return { grade: '정상', desc: '아직은 괜찮아요. 물 한잔?', color: 'text-blue-400' };
        return { grade: '위험', desc: '반응속도 저하... 컨디션 챙기세요!', color: 'text-red-500' };
    } else if (selectedMode === 'balance') {
        // seconds out
        if (avg < 1.0) return { grade: '흔들림 없음', desc: '시몬스 침대급 편안함', color: 'text-[#c3e02e]' };
        if (avg < 3.0) return { grade: '휘청휘청', desc: '중심 잡기가 힘드신가요?', color: 'text-yellow-400' };
        return { grade: '만취', desc: '지구 자전이 느껴지는 상태', color: 'text-red-500' };
    } else {
        // typos
        if (avg < 0.5) return { grade: '명필', desc: '정신력 하나는 인정합니다.', color: 'text-[#c3e02e]' };
        if (avg < 2.5) return { grade: '오타 작렬', desc: '손가락이 꼬이기 시작했어요', color: 'text-yellow-400' };
        return { grade: '외계어', desc: '폰 내려놓고 귀가하세요', color: 'text-red-500' };
    }
  };

  // --- Menu View ---
  if (gameState === 'menu') {
      return (
          <div className="space-y-6 pb-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-white">
                    만취 <span className="text-[#c3e02e]">TEST</span>
                </h2>
                <p className="text-white/60 text-sm">3가지 종목으로 현재 상태를 점검하세요.</p>
              </div>

              {/* Game Selection Cards */}
              <div className="grid grid-cols-1 gap-4">
                  {[
                      { id: 'reflex', title: '순발력 테스트', icon: <Zap className="w-6 h-6" />, desc: '초록 화면에 즉시 반응하기' },
                      { id: 'balance', title: '평형성 테스트', icon: <Activity className="w-6 h-6" />, desc: '원 안에서 중심 잡기' },
                      { id: 'typing', title: '인지력 테스트', icon: <Keyboard className="w-6 h-6" />, desc: '오타 없이 문장 입력하기' }
                  ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setSelectedMode(item.id as TestMode)}
                        className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 relative overflow-hidden group ${
                            selectedMode === item.id 
                            ? 'bg-[#0b6b45] border-[#c3e02e] shadow-[0_0_20px_rgba(195,224,46,0.3)]' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                          <div className={`mb-3 p-3 rounded-xl inline-flex ${selectedMode === item.id ? 'bg-[#c3e02e] text-[#0b6b45]' : 'bg-white/10 text-white'}`}>
                              {item.icon}
                          </div>
                          <div className="flex justify-between items-end">
                              <div>
                                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                  <p className="text-sm text-white/60">{item.desc}</p>
                              </div>
                              {selectedMode === item.id && (
                                  <div className="bg-[#c3e02e] rounded-full p-1">
                                      <ChevronRight className="w-5 h-5 text-[#0b6b45]" />
                                  </div>
                              )}
                          </div>
                      </button>
                  ))}
              </div>

              {/* Round Selector */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                      <span>진행 횟수 설정</span>
                      <span className="text-[#c3e02e] text-sm font-normal">평균값으로 측정됩니다</span>
                  </h3>
                  <div className="flex justify-between gap-2">
                      {[1, 3, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => setRounds(num)}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                rounds === num 
                                ? 'bg-white text-[#0b6b45] shadow-lg scale-105' 
                                : 'bg-black/20 text-white/40 hover:bg-black/40'
                            }`}
                          >
                              {num}회
                          </button>
                      ))}
                  </div>
              </div>

              <button 
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-[#c3e02e] to-[#aacc00] text-[#0b6b45] py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-[0_0_20px_rgba(195,224,46,0.4)] transition-all active:scale-95"
              >
                  테스트 시작하기
              </button>
          </div>
      );
  }

  // --- Playing View ---
  if (gameState === 'playing') {
      return (
          <div className="h-[70vh] flex flex-col rounded-[32px] shadow-2xl overflow-hidden border-4 border-white/10 relative">
              <div className="absolute top-4 right-4 z-50 px-3 py-1 bg-black/40 backdrop-blur rounded-full text-white text-xs font-bold border border-white/10">
                  Round {currentRound} / {rounds}
              </div>
              
              {selectedMode === 'reflex' && <ReflexGame onFinish={handleRoundFinish} />}
              {selectedMode === 'balance' && <BalanceGame onFinish={handleRoundFinish} />}
              {selectedMode === 'typing' && <TypingGame onFinish={handleRoundFinish} />}
          </div>
      );
  }

  // --- Round Result View (Intermission) ---
  if (gameState === 'round-result') {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center bg-[#1a1a1a] rounded-[32px] border-4 border-white/10">
             <h2 className="text-3xl font-black text-white mb-2">Round {currentRound} 종료</h2>
             <div className="w-12 h-12 border-4 border-[#c3e02e] border-t-transparent rounded-full animate-spin" />
             <p className="text-white/60 mt-4 font-bold">다음 라운드 준비중...</p>
        </div>
      );
  }

  // --- Final Result View ---
  if (gameState === 'final-result') {
      const analysis = getResultAnalysis();
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      let displayScore = "";
      
      if (selectedMode === 'reflex') displayScore = `${Math.round(avgScore)}ms`;
      else if (selectedMode === 'balance') displayScore = `${avgScore.toFixed(2)}초 이탈`;
      else displayScore = `평균 오타 ${avgScore.toFixed(1)}개`;

      return (
        <div className="h-[70vh] flex flex-col items-center justify-between bg-gradient-to-b from-[#0b6b45] to-[#074d31] rounded-[32px] border-4 border-white/10 p-8 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="absolute top-0 w-full h-full animate-pulse opacity-20 bg-gradient-to-b from-transparent via-[#c3e02e]/20 to-transparent pointer-events-none" />

             <div className="relative z-10 text-center w-full flex-1 flex flex-col justify-center">
                 <div className="flex justify-center mb-6">
                     <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#c3e02e] shadow-[0_0_30px_rgba(195,224,46,0.3)]">
                        <Trophy className="w-12 h-12 text-[#c3e02e]" />
                     </div>
                 </div>
                 
                 <h2 className="text-lg text-[#c3e02e] font-bold mb-2 uppercase tracking-widest">Test Result</h2>
                 <div className={`text-4xl font-black text-white mb-2`}>{analysis.grade}</div>
                 <div className={`text-xl font-bold text-white/90 mb-8 break-keep`}>"{analysis.desc}"</div>
                 
                 <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                     <div className="text-white/60 text-sm mb-1">최종 기록 (평균)</div>
                     <div className="text-3xl font-mono font-black text-[#c3e02e]">{displayScore}</div>
                 </div>
             </div>

             <button 
                onClick={() => setGameState('menu')}
                className="relative z-10 w-full bg-white text-[#0b6b45] py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
             >
                 <RotateCcw className="w-5 h-5" />
                 메뉴로 돌아가기
             </button>
        </div>
      );
  }

  return null;
};

export default ReactionTest;