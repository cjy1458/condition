import React, { useState } from 'react';
import { GameItem } from '../types';
import { Star, Flame, Brain, VolumeX, Activity, Sparkles } from 'lucide-react';

const games: GameItem[] = [
  { id: 1, type: 'brain', title: '베스킨라빈스 31', desc: '숫자를 1~3개씩 부르다 31을 외치면 탈락!', tags: ['국민게임', '심리전'] },
  { id: 2, type: 'active', title: '바니바니', desc: '바니바니 당근당근! 박자에 맞춰 하늘로 찌르기', tags: ['집중력', '동작'] },
  { id: 3, type: 'tension', title: '타이타닉', desc: '맥주잔 위 소주잔, 침몰시키면 마신다.', tags: ['스릴만점', 'Highlight'] },
  { id: 4, type: 'active', title: '더 게임 오브 데스', desc: '신나는 노래와 함께 손가락으로 지목!', tags: ['빠름', '단체'] },
  { id: 5, type: 'quiet', title: '라이어 게임', desc: '스마트폰으로 제시어 확인, 거짓말쟁이를 찾아라', tags: ['심리전', '정적인'] },
  { id: 6, type: 'quiet', title: '이미지 게임', desc: '여기서 제일 ~할 것 같은 사람 지목!', tags: ['대화', '친목'] },
  { id: 7, type: 'brain', title: '딸기 게임', desc: '박자에 맞춰 딸기 숫자를 늘려가며 외치기', tags: ['리듬감', '어려움'] },
  { id: 8, type: 'tension', title: '손병호 게임', desc: '질문에 해당되면 손가락 접기! 5개 다 접으면 벌칙', tags: ['폭로전', '진실'] },
];

const GameGuide: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'brain' | 'tension' | 'quiet' | 'active'>('all');

  const filteredGames = filter === 'all' ? games : games.filter(g => g.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
        case 'brain': return <Brain className="w-5 h-5" />;
        case 'tension': return <Flame className="w-5 h-5" />;
        case 'quiet': return <VolumeX className="w-5 h-5" />;
        case 'active': return <Activity className="w-5 h-5" />;
        default: return <Star className="w-5 h-5" />;
    }
  };

  const getTagColor = (type: string) => {
    switch (type) {
        case 'brain': return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
        case 'tension': return 'bg-red-500/20 text-red-200 border-red-500/30';
        case 'quiet': return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
        case 'active': return 'bg-[#c3e02e]/20 text-[#c3e02e] border-[#c3e02e]/30';
        default: return 'bg-gray-500/20 text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white">
            술게임 <span className="text-[#c3e02e] italic">GUIDE</span>
        </h2>
        <p className="text-white/60 text-sm">분위기에 딱 맞는 게임을 골라보세요.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {[
            { id: 'all', label: '전체' },
            { id: 'brain', label: '🧠 두뇌회전' },
            { id: 'tension', label: '🔥 텐션업' },
            { id: 'quiet', label: '🤫 조용히' },
            { id: 'active', label: '🏃 활동적' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
              filter === tab.id
                ? 'bg-[#c3e02e] text-[#0b6b45] border-[#c3e02e] shadow-[0_0_15px_rgba(195,224,46,0.3)]'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game List */}
      <div className="space-y-4 pb-10">
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-[#c3e02e]/50 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[40px] pointer-events-none" />

            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-xl flex items-center gap-2 mb-1">
                    {game.title}
                    {game.tags.includes('Highlight') && <Sparkles className="w-4 h-4 text-[#c3e02e] animate-pulse" />}
                </h3>
                <div className="flex gap-2 mt-1">
                    {game.tags.map((tag) => (
                        <span key={tag} className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${getTagColor(game.type)}`}>
                        #{tag}
                        </span>
                    ))}
                </div>
              </div>
              <div className={`p-2 rounded-xl bg-white/5 ${game.type === 'tension' ? 'text-red-400' : 'text-[#c3e02e]'}`}>
                {getIcon(game.type)}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
              {game.desc}
            </p>
          </div>
        ))}
      </div>
      
      {filteredGames.length === 0 && (
          <div className="text-center py-20 text-white/30">
              <div className="text-4xl mb-4">🤔</div>
              해당하는 게임이 없습니다.
          </div>
      )}
    </div>
  );
};

export default GameGuide;