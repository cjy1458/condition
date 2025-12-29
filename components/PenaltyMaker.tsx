import React, { useState, useEffect } from 'react';
import { AlcoholLevel, AlcoholType, LevelOption, PenaltyResult } from '../types';
import { CheckCircle2, RotateCcw, Beer, HelpCircle } from 'lucide-react';

const PenaltyMaker: React.FC = () => {
  const [alcohol, setAlcohol] = useState<AlcoholType | null>(null);
  const [level, setLevel] = useState<AlcoholLevel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PenaltyResult | null>(null);
  const [revealStep, setRevealStep] = useState(0); // 0: Hidden, 1: Who, 2: What, 3: How

  const alcoholOptions: {type: AlcoholType, icon: React.ReactNode}[] = [
    { type: '소주', icon: <div className="font-serif font-black">SOJU</div> },
    { type: '맥주', icon: <Beer className="w-5 h-5" /> },
    { type: '소맥', icon: <div className="flex text-xs font-bold">🍺+🍶</div> },
    { type: '막걸리', icon: <div className="text-xs font-serif">Rice Wine</div> }
  ];
  
  const levelOptions: LevelOption[] = [
    { id: 'baby', label: '알쓰(소주 반 병 미만)', sub: '안주가 주식인 소중한 존재' },
    { id: 'normal', label: '보통(한 병)', sub: '딱 기분 좋게 즐기는 표준' },
    { id: 'pro', label: '주당(2병)', sub: '술자리 텐션을 책임지는 실력자' },
    { id: 'heavy', label: '술고래(3병)', sub: '끊임없이 들어가는 무서운 사람' },
    { id: 'monster', label: '괴물(4병 이상)', sub: '내일이 없는 무적의 전사' }
  ];

  // Handle Sequential Reveal
  useEffect(() => {
    if (result && !isGenerating) {
      setRevealStep(0);
      
      const t1 = setTimeout(() => setRevealStep(1), 600);   // Show 'Who'
      const t2 = setTimeout(() => setRevealStep(2), 1400);  // Show 'What'
      const t3 = setTimeout(() => setRevealStep(3), 2400);  // Show 'How'

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [result, isGenerating]);

  const generatePenalty = () => {
    if (!alcohol || !level) return;

    setIsGenerating(true);
    setResult(null);
    setRevealStep(0);

    setTimeout(() => {
      // Data Pools
      const whoList = [
        '나 (본인 당첨!)', 
        '오른쪽 사람', 
        '나랑 마주 보고 있는 사람', 
        '지목당한 사람 (범인 지목!)', 
        '양 옆 사람 동시에'
      ];
      
      const amountList = [
        '깔끔하게 원샷', 
        '기분 좋게 반 잔', 
        '딱 한 잔 더', 
        '자비로운 물 한 컵 (면제)', 
        '안주 없이 한 잔'
      ];
      
      const howList = [
        '눈 맞추고 러브샷', 
        '정적 속에서 무음으로 마시기', 
        '노래 한 소절 부르고 마시기', 
        '흑기사/흑장미 소환권 (양도 가능)', 
        '배경음악 비트에 맞춰서 마시기'
      ];

      // Logic
      let who = whoList[Math.floor(Math.random() * whoList.length)];
      let amount = amountList[Math.floor(Math.random() * amountList.length)];
      let how = howList[Math.floor(Math.random() * howList.length)];

      const rand = Math.random();

      // Condition Time (Easter Egg) - Rare chance
      if (rand < 0.05) {
         who = '다 같이';
         amount = '컨디션';
         how = '편의점 가서 사오기';
      }

      setResult({
        who: who,
        amount: amount,
        action: how,
        desc: `${amount} ${how}`
      });
      setIsGenerating(false);
    }, 1500);
  };

  const reset = () => {
    setResult(null);
    setRevealStep(0);
    // Keep alcohol/level selection for convenience, or reset if preferred
    // setAlcohol(null); 
    // setLevel(null);
  };

  const renderSlot = (label: string, value: string, step: number, currentStep: number) => {
    const isRevealed = currentStep >= step;
    
    return (
        <div className="flex flex-col items-center gap-1.5 w-full">
            <span className={`text-[#0b6b45] font-black text-sm tracking-wide transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-40'}`}>
                {label}
            </span>
            <div className={`w-full py-4 px-4 rounded-xl text-center shadow-[0_4px_10px_rgba(0,0,0,0.1)] border-2 transition-all duration-500 relative overflow-hidden
                ${isRevealed 
                    ? 'bg-white border-transparent scale-100' 
                    : 'bg-black/10 border-transparent scale-95'
                }
            `}>
                {isRevealed ? (
                    <span className="text-[#1a4a3a] font-bold text-xl word-keep-all leading-tight animate-pop-in block">
                        {value}
                    </span>
                ) : (
                    <div className="flex justify-center items-center h-[28px]">
                        <HelpCircle className="w-6 h-6 text-white/40 animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="relative min-h-[500px]">
      {/* Input Phase */}
      {!result && !isGenerating && (
        <div className="space-y-6 animate-fade-in-up">
           <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-3xl font-black text-white">
                <span className="text-[#c3e02e]">벌칙</span> 생성기
            </h2>
            <p className="text-white/60 text-sm">주량에 맞춰 공정하게 정해드립니다.</p>
          </div>

          {/* Step 1 */}
          <div className="space-y-3">
            <label className="text-white font-bold text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#c3e02e] text-[#0b6b45] flex items-center justify-center text-xs">1</span>
                오늘의 주종
            </label>
            <div className="grid grid-cols-4 gap-2">
              {alcoholOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setAlcohol(opt.type)}
                  className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 p-1 ${
                    alcohol === opt.type
                      ? 'bg-[#c3e02e] text-[#0b6b45] font-bold border-[#c3e02e] shadow-[0_0_15px_rgba(195,224,46,0.5)]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {opt.icon}
                  <span className="text-xs">{opt.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <label className="text-white font-bold text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#c3e02e] text-[#0b6b45] flex items-center justify-center text-xs">2</span>
                나의 주량
            </label>
            <div className="grid grid-cols-1 gap-2">
              {levelOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    level === opt.id
                      ? 'bg-[#c3e02e] text-[#0b6b45] font-bold border-[#c3e02e] shadow-[0_0_15px_rgba(195,224,46,0.5)]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-base font-bold">{opt.label}</span>
                    <span className={`text-xs ${level === opt.id ? 'text-[#0b6b45]/70' : 'text-white/40'}`}>{opt.sub}</span>
                  </div>
                  {level === opt.id && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generatePenalty}
            disabled={!alcohol || !level}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-lg transition-all mt-8 transform active:scale-95 ${
              !alcohol || !level
                ? 'bg-white/10 text-white/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#c3e02e] to-[#aacc00] text-[#0b6b45] hover:shadow-[0_0_20px_rgba(195,224,46,0.3)]'
            }`}
          >
            벌칙 확인하기
          </button>
        </div>
      )}

      {/* Loading Phase */}
      {isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="w-24 h-24 rounded-full border-4 border-[#c3e02e] border-t-transparent animate-spin mb-6" />
            <h3 className="text-3xl font-black text-white animate-pulse">운명 결정 중...</h3>
        </div>
      )}

      {/* Result Phase */}
      {result && (
        <div className="animate-pop-in relative z-10 w-full">
            <div className="bg-[#93d5a7] min-h-[520px] rounded-[32px] p-6 relative overflow-hidden shadow-2xl flex flex-col items-center transition-all duration-500">
                {/* Decorative Elements */}
                <div className="absolute top-8 left-4 text-white/60 text-4xl font-serif">*</div>
                <div className="absolute top-20 right-6 text-white/60 text-3xl font-serif">*</div>
                <div className="absolute bottom-10 left-6 text-white/60 text-2xl font-serif">*</div>
                <div className="absolute bottom-24 right-4 text-white/60 text-xl font-serif">*</div>
                
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#2d7a50] rounded-tr-[40px] opacity-80" />
                <div className="absolute bottom-0 right-0 w-20 h-28 bg-[#1e603a] rounded-tl-[40px] opacity-80" />
                <div className="absolute bottom-0 left-16 w-16 h-16 bg-[#4ca673] rounded-t-full opacity-60" />

                {/* Content Container */}
                <div className="relative z-10 w-full flex flex-col items-center h-full">
                    
                    {/* Header */}
                    <div className="text-center mt-6 mb-8">
                        <div className="text-white font-bold text-sm mb-1 drop-shadow-md tracking-tight">
                            다음 벌칙 딱 정해줄게
                        </div>
                        <h2 className="text-4xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.15)] leading-none"
                            style={{ textShadow: '2px 2px 0px #2d7a50' }}>
                            랜덤 벌칙 생성기
                        </h2>
                    </div>

                    {/* Result Cards - Sequential Reveal */}
                    <div className="w-full max-w-[280px] space-y-5 flex-1">
                        {renderSlot('누구랑', result.who, 1, revealStep)}
                        {renderSlot('무엇을', result.amount, 2, revealStep)}
                        {renderSlot('어떻게?', result.action, 3, revealStep)}
                    </div>

                    {/* Retry Button - Only show when fully revealed */}
                    <div className={`mt-8 mb-4 w-full px-4 transition-all duration-500 ${revealStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <button 
                            onClick={reset}
                            className="w-full bg-[#0b6b45] text-white py-4 rounded-full font-bold shadow-lg hover:bg-[#095738] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            다시 돌리기
                        </button>
                    </div>

                </div>
            </div>
            
            <div className="text-center mt-4">
                 <span className="text-[#c3e02e] text-xs font-medium px-3 py-1 rounded-full border border-[#c3e02e]/30">
                     💡 즐겁고 건강한 술자리를 위해 적당히!
                 </span>
            </div>
        </div>
      )}
    </div>
  );
};

export default PenaltyMaker;