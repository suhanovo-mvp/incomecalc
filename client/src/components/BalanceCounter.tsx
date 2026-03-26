import { useEffect, useState } from 'react';
import { TrendingUp, Wind, Zap, Settings } from 'lucide-react';
import DailyBalanceCounter from './DailyBalanceCounter';
import BreathingMode from './BreathingMode';
import WarmupMode from './WarmupMode';
import GoalModal from './GoalModal';

/**
 * Design Philosophy: Modern Financial Dashboard
 * - Kinectic visualization with smooth animations
 * - Emerald-gold color scheme symbolizing financial growth
 * - Pulsing counter with orbital indicators
 * - Real-time balance updates every second
 * - Integrated wellness modes (breathing, warmup)
 * - Customizable monthly goal with localStorage persistence
 */

interface BalanceCounterProps {
  monthlyAmount?: number;
}

export default function BalanceCounter({ monthlyAmount: initialAmount = 32000 }: BalanceCounterProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(initialAmount);
  const [balance, setBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [monthProgress, setMonthProgress] = useState(0);
  const [showBreathingMode, setShowBreathingMode] = useState(false);
  const [showWarmupMode, setShowWarmupMode] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Load goal from localStorage on mount
  useEffect(() => {
    const savedGoal = localStorage.getItem('monthlyGoal');
    if (savedGoal) {
      const parsedGoal = parseFloat(savedGoal);
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        setMonthlyAmount(parsedGoal);
      }
    }
  }, []);

  // Calculate seconds in current month
  const getCurrentMonthSeconds = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get last day of current month
    const lastDay = new Date(year, month + 1, 0).getDate();
    return lastDay * 24 * 60 * 60;
  };

  // Calculate seconds elapsed since start of month
  const getSecondsElapsedInMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return Math.floor((now.getTime() - startOfMonth.getTime()) / 1000);
  };

  // Calculate per-second rate
  const perSecondRate = monthlyAmount / getCurrentMonthSeconds();

  useEffect(() => {
    const updateBalance = () => {
      const secondsElapsed = getSecondsElapsedInMonth();
      const totalSeconds = getCurrentMonthSeconds();
      const newBalance = secondsElapsed * perSecondRate;
      
      setBalance(newBalance);
      setMonthProgress((secondsElapsed / totalSeconds) * 100);
      setIsAnimating(true);
      
      // Reset animation state after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    };

    // Initial update
    updateBalance();

    // Update every second
    const interval = setInterval(updateBalance, 1000);

    return () => clearInterval(interval);
  }, [perSecondRate]);

  const handleGoalChange = (newGoal: number) => {
    setMonthlyAmount(newGoal);
  };

  const totalSeconds = getCurrentMonthSeconds();
  const secondsElapsed = getSecondsElapsedInMonth();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Modals */}
      {showBreathingMode && <BreathingMode onClose={() => setShowBreathingMode(false)} perSecondRate={perSecondRate} />}
      {showWarmupMode && <WarmupMode onClose={() => setShowWarmupMode(false)} perSecondRate={perSecondRate} />}
      <GoalModal 
        isOpen={showGoalModal} 
        onClose={() => setShowGoalModal(false)} 
        currentGoal={monthlyAmount}
        onGoalChange={handleGoalChange}
      />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header with settings button */}
        <div className="text-center mb-12 relative">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-3">
            Balance Counter
          </h1>
          <p className="text-lg text-slate-600 mb-4">
            Ежесекундное пополнение счёта + здоровье
          </p>
          
          {/* Settings button */}
          <button
            onClick={() => setShowGoalModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium transition-colors border border-emerald-300"
          >
            <Settings className="w-4 h-4" />
            Изменить цель
          </button>
        </div>

        {/* Main layout: Counter + Daily sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main counter card - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-12 backdrop-blur-sm border border-emerald-100">
              {/* Balance display */}
              <div className="relative mb-12">
                {/* Pulsing background */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-10 transition-all duration-600 ${isAnimating ? 'scale-110' : 'scale-100'}`}></div>
                
                {/* Main counter */}
                <div className="relative text-center py-8">
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
                    Текущий баланс
                  </div>
                  <div className={`text-6xl md:text-7xl font-bold font-mono text-emerald-600 transition-all duration-600 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
                    ₽ {balance.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500 mt-4">
                    за {currentDay} {getDayWord(currentDay)} месяца
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {/* Per-second rate */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                  <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider mb-2">
                    В секунду
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-600">
                    ₽ {perSecondRate.toFixed(2)}
                  </div>
                </div>

                {/* Per-minute rate */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                  <div className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2">
                    В минуту
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-600">
                    ₽ {(perSecondRate * 60).toFixed(2)}
                  </div>
                </div>

                {/* Per-hour rate */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-2">
                    В час
                  </div>
                  <div className="text-2xl font-bold font-mono text-blue-600">
                    ₽ {(perSecondRate * 3600).toFixed(2)}
                  </div>
                </div>

                {/* Per-day rate */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                  <div className="text-xs font-medium text-teal-700 uppercase tracking-wider mb-2">
                    В день
                  </div>
                  <div className="text-2xl font-bold font-mono text-teal-600">
                    ₽ {(perSecondRate * 86400).toFixed(2)}
                  </div>
                </div>

                {/* Monthly target */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-2">
                    Цель месяца
                  </div>
                  <div className="text-2xl font-bold font-mono text-purple-600">
                    ₽ {monthlyAmount.toFixed(0)}
                  </div>
                </div>

                {/* Progress percentage */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 border border-rose-200">
                  <div className="text-xs font-medium text-rose-700 uppercase tracking-wider mb-2">
                    Прогресс
                  </div>
                  <div className="text-2xl font-bold font-mono text-rose-600">
                    {monthProgress.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-600">Прогресс месяца</span>
                  <span className="text-sm font-mono text-slate-500">{currentDay}/{daysInMonth} дней</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 rounded-full"
                    style={{ width: `${monthProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Time info */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Информация</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-2 text-sm text-slate-600 font-mono">
                  <div className="flex justify-between">
                    <span>Секунд в месяце:</span>
                    <span className="font-bold text-slate-900">{totalSeconds.toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Прошло секунд:</span>
                    <span className="font-bold text-slate-900">{secondsElapsed.toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Осталось секунд:</span>
                    <span className="font-bold text-slate-900">{(totalSeconds - secondsElapsed).toLocaleString('ru-RU')}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setShowBreathingMode(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Wind className="w-5 h-5" />
                  Режим дыхания
                </button>
                <button
                  onClick={() => setShowWarmupMode(true)}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Режим разминки
                </button>
              </div>
            </div>
          </div>

          {/* Daily counter sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <DailyBalanceCounter dailyAmount={monthlyAmount / 31} />
          </div>
        </div>

        {/* Mobile daily counter */}
        <div className="lg:hidden mt-8">
          <DailyBalanceCounter dailyAmount={monthlyAmount / 31} />
        </div>

        {/* Footer info */}
        <div className="text-center text-slate-600 text-sm mt-8">
          <p>Обновляется каждую секунду</p>
          <p className="mt-1 text-xs text-slate-500">
            Месячная сумма: ₽ {monthlyAmount.toLocaleString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function for correct Russian day word
function getDayWord(day: number): string {
  if (day % 10 === 1 && day !== 11) return 'день';
  if ([2, 3, 4].includes(day % 10) && ![12, 13, 14].includes(day)) return 'дня';
  return 'дней';
}
