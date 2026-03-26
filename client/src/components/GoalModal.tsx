import { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';

/**
 * Goal Modal Component
 * Design Philosophy: Modern Financial Dashboard
 * - Allows users to set custom monthly goal
 * - Saves to localStorage for persistence
 * - Triggers recalculation of all metrics
 */

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  onGoalChange: (newGoal: number) => void;
}

export default function GoalModal({ isOpen, onClose, currentGoal, onGoalChange }: GoalModalProps) {
  const [inputValue, setInputValue] = useState(currentGoal.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setInputValue(currentGoal.toString());
    setError('');
  }, [currentGoal, isOpen]);

  const handleSubmit = () => {
    const numValue = parseFloat(inputValue);

    // Validation
    if (!inputValue.trim()) {
      setError('Пожалуйста, введите сумму');
      return;
    }

    if (isNaN(numValue)) {
      setError('Введите корректное число');
      return;
    }

    if (numValue <= 0) {
      setError('Сумма должна быть больше 0');
      return;
    }

    if (numValue > 999999999) {
      setError('Сумма слишком большая');
      return;
    }

    // Save to localStorage
    localStorage.setItem('monthlyGoal', numValue.toString());

    // Trigger callback
    onGoalChange(numValue);

    // Close modal
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  if (!isOpen) return null;

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
            <Edit3 className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Изменить цель</h2>
          </div>
          <p className="text-sm text-slate-600">Установите новую целевую сумму на месяц</p>
        </div>

        {/* Current goal info */}
        <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-200">
          <div className="text-xs text-emerald-700 uppercase tracking-wider mb-1">Текущая цель</div>
          <div className="text-3xl font-bold font-mono text-emerald-600">
            ₽ {currentGoal.toLocaleString('ru-RU')}
          </div>
        </div>

        {/* Input section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Новая целевая сумма (рубли)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold">₽</span>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Введите сумму"
              className={`w-full pl-8 pr-4 py-3 rounded-lg border-2 transition-colors font-mono text-lg ${
                error
                  ? 'border-red-500 bg-red-50 focus:outline-none focus:border-red-600'
                  : 'border-slate-200 bg-white focus:outline-none focus:border-emerald-500'
              }`}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
          )}
        </div>

        {/* Info section */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="text-xs text-blue-900 font-medium">
            <p className="mb-2">💡 После изменения цели:</p>
            <ul className="space-y-1 text-xs">
              <li>• Все расчёты пересчитаются автоматически</li>
              <li>• Данные сохранятся в вашем браузере</li>
              <li>• Счётчик продолжит работу с новой целью</li>
            </ul>
          </div>
        </div>

        {/* Suggested amounts */}
        <div className="mb-6">
          <p className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-medium">Быстрые варианты</p>
          <div className="grid grid-cols-3 gap-2">
            {[10000, 32000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setInputValue(amount.toString())}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-sm transition-colors border border-slate-200"
              >
                ₽ {(amount / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-medium bg-slate-200 text-slate-900 hover:bg-slate-300 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
