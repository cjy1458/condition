import React from 'react';
import { Gamepad2, Skull, Zap, MapPin, ChevronRight, Info } from 'lucide-react';
import { PageView } from '../types';

interface HomeProps {
  onNavigate: (page: PageView) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const logoSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 50'><text x='70' y='12' font-family='sans-serif' font-weight='bold' font-size='9' text-anchor='middle' fill='white'>대한민국 숙취해소</text><text x='70' y='42' font-family='sans-serif' font-weight='900' font-style='italic' font-size='32' text-anchor='middle' fill='white' letter-spacing='-2'>컨디션</text></svg>";

  const menuItems = [
    {
      id: 'games',
      title: '술게임 가이드',
      icon: <Gamepad2 className="w-6 h-6" />,
      desc: '분위기 살리는\n필승 게임 모음',
      color: 'bg-blue-500',
      delay: '0ms'
    },
    {
      id: 'penalty',
      title: '벌칙 생성기',
      icon: <Skull className="w-6 h-6" />,
      desc: '복불복 룰렛\n랜덤 벌칙 수행',
      color: 'bg-red-500',
      delay: '100ms'
    },
    {
      id: 'test',
      title: '만취 테스트',
      icon: <Zap className="w-6 h-6" />,
      desc: '당신의 상태는?\n반응속도 체크',
      color: 'bg-yellow-500',
      delay: '200ms'
    },
    {
      id: 'store',
      title: '편의점 행사',
      icon: <MapPin className="w-6 h-6" />,
      desc: '내 주변 컨디션\n최저가 찾기',
      color: 'bg-purple-500',
      delay: '300ms',
      action: () => alert('🚧 GPS 연동 준비 중입니다!\n주변 편의점 1+1 행사를 곧 만나보세요.')
    }
  ];

  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-4xl font-black text-white leading-[1.15] drop-shadow-lg">
            오늘 술자리,<br />
            <span className="text-[#c3e02e]">확 깬 상태</span>로<br/>
            시작해볼까?
            </h2>
            <img 
                src={logoSrc}
                alt="CONDITION"
                className="w-24 object-contain mt-1 drop-shadow-lg flex-shrink-0 ml-2"
            />
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#c3e02e] animate-pulse"/>
            <span>즐거운 자리엔 텐션, 그 옆엔 컨디션</span>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : onNavigate(item.id as PageView)}
            className="group relative overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-lg border border-white/10 p-5 text-left transition-all duration-300 hover:bg-white/10 hover:border-[#c3e02e]/50 active:scale-95 flex flex-col justify-between h-[180px] hover:shadow-[0_0_20px_rgba(195,224,46,0.1)]"
            style={{ animationDelay: item.delay }}
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c3e02e]/0 to-[#c3e02e]/0 group-hover:from-[#c3e02e]/10 group-hover:to-transparent transition-all duration-500" />
            
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#1a4a3a] text-[#c3e02e] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {item.title}
                </h3>
                <p className="text-gray-300 text-xs font-medium whitespace-pre-line leading-relaxed opacity-80">
                    {item.desc}
                </p>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <div className="w-8 h-8 rounded-full bg-[#c3e02e] flex items-center justify-center text-[#0b6b45]">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tip Banner */}
      <div className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:bg-white/5 transition-colors">
        <div className="shrink-0 w-10 h-10 rounded-full bg-[#0b6b45] border border-[#c3e02e] flex items-center justify-center text-[#c3e02e]">
            <Info className="w-6 h-6" />
        </div>
        <div>
            <h4 className="text-[#c3e02e] font-bold text-sm mb-1">CONDITION TIP</h4>
            <p className="text-white/80 text-sm leading-relaxed">
                음주 전후 30분, 컨디션을 챙기면 다음 날 아침이 달라집니다!
            </p>
        </div>
      </div>
    </div>
  );
};

export default Home;