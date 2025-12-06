import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category, Theme } from '../types';
import { toolsRegistry } from '../tools/registry';
import { 
  Menu, 
  X, 
  Search, 
  Moon, 
  Sun, 
  Grid, 
  ChevronRight,
  Zap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  theme: Theme;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, theme, toggleTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const filteredTools = searchQuery 
    ? toolsRegistry.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${theme}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <Zap className="text-primary-500" />
          <span className="font-bold text-lg tracking-tight">Z Tools</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-100 dark:border-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-emerald-600 flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Z Tools
            </span>
          </div>

          <div className="p-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search 1000+ tools..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
             </div>
             {/* Search Dropdown */}
             {searchQuery && (
               <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl max-h-64 overflow-y-auto z-50">
                 {filteredTools.length > 0 ? (
                   filteredTools.map(tool => (
                     <Link 
                        key={tool.id} 
                        to={`/tool/${tool.id}`}
                        onClick={() => { setSearchQuery(''); setSidebarOpen(false); }}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0"
                     >
                       <tool.icon size={16} className="text-primary-500" />
                       <span className="text-sm">{tool.name}</span>
                     </Link>
                   ))
                 ) : (
                   <div className="p-4 text-center text-sm text-slate-500">No tools found</div>
                 )}
               </div>
             )}
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
            <Link 
              to="/" 
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              <Grid size={18} />
              All Categories
            </Link>
            
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Categories
            </div>
            
            {Object.values(Category).map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between group px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <span>{cat}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <button 
               onClick={toggleTheme}
               className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
             >
               {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
               <span className="text-sm font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-slate-50 dark:bg-black overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};