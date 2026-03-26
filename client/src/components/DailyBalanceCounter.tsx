import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

/**
 * Daily Balance Counter Component
 * Design Philosophy: Modern Financial Dashboard
 * - Shows balance accumulated for the current day
 * - Displays time elapsed since midnight
 * - Real-time updates every second
 */

interface DailyBalanceCounterProps {
  dailyAmount?: number;
}

export default function DailyBalanceCounter({ dailyAmount = 32000 / 31 }: DailyBalanceCounterProps) {
  const [balance, setBalance] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState('00:00:00');
  const [dayProgress, setDayProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const perSecondRate = dailyAmount / 86400; // 86400 seconds in a day

  useEffect(() => {
    const updateBalance = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const secondsElapsed = Math.floor((now.getTime() - startOfDay.getTime()) / 1000);
      
      const newBalance = secondsElapsed * perSecondRate;
      setBalance(newBalance);
      setDayProgress((secondsElapsed / 86400) * 100);
      setIsAnimating(true);

      // Format time elapsed
      const hours = Math.floor(secondsElapsed / 3600);
      const minutes = Math.floor((secondsElapsed % 3600) / 60);
      const seconds = secondsElapsed % 60;
      setTimeElapsed(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );

      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    };

    updateBalance();
    const interval = setInterval(updateBalance, 1000);

    return () => clearInterval(interval);
  }, [perSecondRate]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-slate-900">Баланс за сегодня</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-500 capitalize">{dateStr}</p>
      </div>

      {/* Balance display */}
      <div className={`text-4xl font-bold font-mono text-emerald-600 mb-4 transition-all duration-600 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        ₽ {balance.toFixed(2)}
      </div>

      {/* Time elapsed */}
      <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-200">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Прошло времени</div>
        <div className="text-2xl font-mono font-bold text-slate-900">{timeElapsed}</div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-600">Прогресс дня</span>
          <span className="text-xs font-mono text-slate-500">{dayProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 rounded-full"
            style={{ width: `${dayProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Rate info */}
      <div className="text-xs text-slate-500 text-center">
        <p>₽ {perSecondRate.toFixed(4)} в секунду</p>
      </div>
    </div>
  );
}
