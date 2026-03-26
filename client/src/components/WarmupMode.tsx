import { useEffect, useState } from 'react';
import { X, Zap } from 'lucide-react';

/**
 * Warmup Mode Component
 * Design Philosophy: Fitness & Wellness
 * 
 * Provides guided exercises with timers:
 * - Squats: 30 seconds work, 15 seconds rest
 * - Push-ups: 30 seconds work, 15 seconds rest
 * - Jumping Jacks: 30 seconds work, 15 seconds rest
 * - Plank: 30 seconds work, 15 seconds rest
 * 
 * Tracks time and balance earned during workout
 */

interface WarmupModeProps {
  onClose: () => void;
  perSecondRate: number;
}

type ExerciseType = 'squats' | 'pushups' | 'jumping' | 'plank';
type ExercisePhase = 'work' | 'rest' | 'finished';

interface Exercise {
  id: ExerciseType;
  name: string;
  emoji: string;
  description: string;
  workDuration: number;
  restDuration: number;
}

const EXERCISES: Exercise[] = [
  {
    id: 'squats',
    name: 'Приседания',
    emoji: '🦵',
    description: 'Ноги на ширине плеч, приседайте глубоко',
    workDuration: 30,
    restDuration: 15,
  },
  {
    id: 'pushups',
    name: 'Отжимания',
    emoji: '💪',
    description: 'Классические отжимания или от колен',
    workDuration: 30,
    restDuration: 15,
  },
  {
    id: 'jumping',
    name: 'Прыжки',
    emoji: '⬆️',
    description: 'Прыгайте в стороны, как при прыжках со скакалкой',
    workDuration: 30,
    restDuration: 15,
  },
  {
    id: 'plank',
    name: 'Планка',
    emoji: '📏',
    description: 'Держите тело в прямой линии',
    workDuration: 30,
    restDuration: 15,
  },
];

export default function WarmupMode({ onClose, perSecondRate }: WarmupModeProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<ExercisePhase>('work');
  const [timeRemaining, setTimeRemaining] = useState(EXERCISES[0].workDuration);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionBalance, setSessionBalance] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedExercises, setCompletedExercises] = useState(0);

  const currentExercise = EXERCISES[currentExerciseIndex];
  const totalExercises = EXERCISES.length;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;

  useEffect(() => {
    if (!isActive || phase === 'finished') return;

    const interval = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        setSessionBalance(newTime * perSecondRate);
        return newTime;
      });

      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Phase transition
          if (phase === 'work') {
            setPhase('rest');
            return currentExercise.restDuration;
          } else if (phase === 'rest') {
            // Move to next exercise
            if (isLastExercise) {
              setPhase('finished');
              setCompletedExercises(totalExercises);
              return 0;
            } else {
              setCurrentExerciseIndex(prev => prev + 1);
              setPhase('work');
              return EXERCISES[currentExerciseIndex + 1].workDuration;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, currentExerciseIndex, isLastExercise, currentExercise, perSecondRate]);

  const getPhaseColor = () => {
    if (phase === 'finished') return 'from-emerald-400 to-emerald-500';
    return phase === 'work' ? 'from-rose-400 to-rose-500' : 'from-blue-400 to-blue-500';
  };

  const getPhaseLabel = () => {
    if (phase === 'finished') return '✅ Завершено!';
    return phase === 'work' ? '💪 Упражнение' : '😌 Отдых';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = (completedExercises / totalExercises) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-slate-900">Режим разминки</h2>
          </div>
          <p className="text-sm text-slate-600">Быстрая тренировка</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-600">Упражнение {completedExercises + 1}/{totalExercises}</span>
            <span className="text-xs font-mono text-slate-500">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-1000 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current exercise card */}
        {phase !== 'finished' ? (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 mb-6 border border-slate-200">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{currentExercise.emoji}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentExercise.name}</h3>
              <p className="text-sm text-slate-600">{currentExercise.description}</p>
            </div>

            {/* Timer circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={phase === 'work' ? '#f87171' : '#60a5fa'}
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeRemaining / (phase === 'work' ? currentExercise.workDuration : currentExercise.restDuration))}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold font-mono text-slate-900">{timeRemaining}</div>
                  <div className={`text-xs font-medium mt-2 ${phase === 'work' ? 'text-rose-600' : 'text-blue-600'}`}>
                    {phase === 'work' ? 'Работа' : 'Отдых'}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase indicator */}
            <div className={`text-center py-3 rounded-lg bg-gradient-to-r ${getPhaseColor()} text-white font-bold mb-4`}>
              {getPhaseLabel()}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 mb-6 border border-emerald-200 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Отлично!</h3>
            <p className="text-sm text-emerald-800">Вы завершили все упражнения</p>
          </div>
        )}

        {/* Session stats */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 mb-6 border border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Время тренировки</div>
              <div className="text-2xl font-mono font-bold text-slate-900">{formatTime(sessionTime)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Завершено</div>
              <div className="text-2xl font-mono font-bold text-rose-600">{completedExercises}/{totalExercises}</div>
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

        {/* Exercise list */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Упражнения</div>
          <div className="space-y-2">
            {EXERCISES.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  index < completedExercises
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : index === currentExerciseIndex
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span className="mr-2">{exercise.emoji}</span>
                {exercise.name}
                {index < completedExercises && <span className="ml-2">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-3">
          {phase !== 'finished' && (
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              {isActive ? 'Пауза' : 'Продолжить'}
            </button>
          )}
          <button
            onClick={onClose}
            className={`${phase !== 'finished' ? 'flex-1' : 'w-full'} py-2 rounded-lg font-medium bg-slate-200 text-slate-900 hover:bg-slate-300 transition-colors`}
          >
            {phase === 'finished' ? 'Закрыть' : 'Завершить'}
          </button>
        </div>
      </div>
    </div>
  );
}
