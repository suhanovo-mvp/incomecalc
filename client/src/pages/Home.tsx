import BalanceCounter from "@/components/BalanceCounter";

/**
 * Home Page - Balance Counter Application
 * 
 * Design Philosophy: Modern Financial Dashboard
 * - Clean, minimal interface with emerald-gold color scheme
 * - Real-time balance visualization with smooth animations
 * - Comprehensive financial metrics display
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <BalanceCounter monthlyAmount={32000} />
      </main>
    </div>
  );
}
