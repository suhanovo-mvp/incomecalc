import { useEffect, useState } from 'react';
import { X, Wind } from 'lucide-react';

/**
 * Breathing Mode Component
 * Design Philosophy: Mindfulness & Wellness
 * 
 * Implements diaphragmatic breathing (4-7-8 technique):
 * - 4 seconds: Inhale (breathing in)
 * - 7 seconds: Hold (breath retention)
 * - 8 seconds: Exhale (breathing out)
 * 
 * Visual representation:
 * - Circle expands during inhale
 * - Holds steady during retention
 * - Contracts during exhale
 * - Calming gradient colors
 */

interface BreathingModeProps {
  onClose: () => void;
  perSecondRate: number;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function BreathingMode({ onClose, perSecondRate }: BreathingModeProps) {
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionBalance, setSessionBalance] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Breathing cycle: 4s inhale + 7s hold + 8s exhale = 19s per cycle
  const INHALE_DURATION = 4;
  const HOLD_DURATION = 7;
  const EXHALE_DURATION = 8;
  const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        setSessionBalance(newTime * perSecondRate);
        
        // Calculate breathing phase
        const timeInCycle = newTime % CYCLE_DURATION;
        
        if (timeInCycle < INHALE_DURATION) {
          setPhase('inhale');
          setPhaseProgress((timeInCycle / INHALE_DURATION) * 100);
        } else if (timeInCycle < INHALE_DURATION + HOLD_DURATION) {
          setPhase('hold');
          const holdProgress = (timeInCycle - INHALE_DURATION) / HOLD_DURATION;
          setPhaseProgress(100 - holdProgress * 5); // Slight pulsing during hold
        } else {
          setPhase('exhale');
          const exhaleProgress = (timeInCycle - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION;
          setPhaseProgress(100 - (exhaleProgress * 100));
        }

        // Update cycle count
        setCycles(Math.floor(newTime / CYCLE_DURATION));

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, perSecondRate]);

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale':
        return 'Вдыхайте...';
      case 'hold':
        return 'Задержите дыхание...';
      case 'exhale':
        return 'Выдыхайте...';
      default:
        return 'Дышите';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-blue-500';
      case 'hold':
        return 'from-purple-400 to-purple-500';
      case 'exhale':
        return 'from-emerald-400 to-emerald-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wind className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900">Режим дыхания</h2>
          </div>
          <p className="text-sm text-slate-600">Диафрагмальное дыхание 4-7-8</p>
        </div>

        {/* Breathing circle animation */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            {/* Outer circle (static) */}
            <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
            
            {/* Animated breathing circle */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ease-in-out opacity-70`}
              style={{
                transform: `scale(${0.3 + (phaseProgress / 100) * 0.7})`,
              }}
            ></div>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-slate-900">{Math.ceil(phaseProgress)}%</div>
              <div className="text-xs text-slate-600 mt-2 capitalize text-center font-medium">
                {getPhaseLabel()}
              </div>
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className={`p-3 rounded-lg text-center transition-all ${phase === 'inhale' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-slate-100 border-2 border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-700">Вдох</div>
            <div className="text-lg font-mono font-bold text-blue-600">{INHALE_DURATION}s</div>
          </div>
          <div className={`p-3 rounded-lg text-center transition-all ${phase === 'hold' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-slate-100 border-2 border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-700">Задержка</div>
            <div className="text-lg font-mono font-bold text-purple-600">{HOLD_DURATION}s</div>
          </div>
          <div className={`p-3 rounded-lg text-center transition-all ${phase === 'exhale' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-slate-100 border-2 border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-700">Выдох</div>
            <div className="text-lg font-mono font-bold text-emerald-600">{EXHALE_DURATION}s</div>
          </div>
        </div>

        {/* Session stats */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 mb-6 border border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Время сессии</div>
              <div className="text-2xl font-mono font-bold text-slate-900">{formatTime(sessionTime)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Циклов</div>
              <div className="text-2xl font-mono font-bold text-emerald-600">{cycles}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Накоплено</div>
              <div className="text-2xl font-mono font-bold text-emerald-600">₽ {sessionBalance.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Цена сек</div>
              <div className="text-2xl font-mono font-bold text-slate-700">₽ {perSecondRate.toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* Benefits info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="text-xs text-blue-900 font-medium">
            <p className="mb-2">💡 Техника 4-7-8 помогает:</p>
            <ul className="space-y-1 text-xs">
              <li>• Снизить уровень стресса</li>
              <li>• Улучшить концентрацию</li>
              <li>• Нормализовать дыхание</li>
            </ul>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
            }`}
          >
            {isActive ? 'Пауза' : 'Продолжить'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg font-medium bg-slate-200 text-slate-900 hover:bg-slate-300 transition-colors"
          >
            Завершить
          </button>
        </div>
      </div>
    </div>
  );
}
