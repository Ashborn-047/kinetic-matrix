interface NavigationProps {
  currentView: 'home' | 'experiments';
  onSwitchView: (view: 'home' | 'experiments') => void;
  isAuthenticated: boolean;
}

export default function Navigation({ currentView, onSwitchView, isAuthenticated }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 w-full p-3 sm:p-4 md:p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
      {currentView === 'home' ? (
        <>
          <div className="font-mono text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest opacity-0 nav-item text-green-400">
            System.Init()
          </div>
          <div className="font-mono text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest opacity-0 nav-item text-green-400">
            V.3.1 (Grid_Input)
          </div>
        </>
      ) : (
        <>
          <div 
            className="font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#00ff41] hover:text-white transition-colors cursor-pointer"
            onClick={() => onSwitchView('home')}
          >
            &lt; ./Return_Root
          </div>
          <div className="font-mono text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest text-[#00ff41]">
            Exp_Log // v.0.9
          </div>
        </>
      )}
    </nav>
  );
}