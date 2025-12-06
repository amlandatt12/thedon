
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SEO } from './components/SEO';
import { toolsRegistry, getPopularTools, getToolsByCategory } from './tools/registry';
import { Category, Theme, Tool } from './types';
import { Search, Star, ArrowRight, Clock } from 'lucide-react';
import * as Icons from 'lucide-react';

// --- History Hook ---
const useHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ztools_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (toolID: string) => {
    const newHistory = [toolID, ...history.filter(id => id !== toolID)].slice(0, 8);
    setHistory(newHistory);
    localStorage.setItem('ztools_history', JSON.stringify(newHistory));
  };

  return { history, addToHistory };
};

// --- Home Page Component ---
const HomePage = () => {
  const popularTools = getPopularTools();
  const categories = Object.values(Category);
  const { history } = useHistory();

  // Get tool objects for history IDs
  const recentTools = history.map(id => toolsRegistry.find(t => t.id === id)).filter(Boolean) as Tool[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Z Tools",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/#/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="space-y-12">
      <SEO
        title="Z Tools - 1000+ Free Developer Tools & Converters"
        description="Access 1000+ free online tools: text converters, image editors, developer utilities, and calculators. Secure, client-side, and offline-ready."
        schema={schema}
        keywords={['developer tools', 'online converters', 'json formatter', 'image compressor', 'free web tools']}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            One platform. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">1000+ Developer Tools.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-8">
            The ultimate collection of client-side utilities. No servers, no tracking, just instant functionality for daily tasks.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors">
              Explore Tools
            </button>
          </div>
        </div>
      </div>

      {/* Recent Tools (History) */}
      {recentTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Icons.Clock className="text-slate-400" size={20} />
            <h2 className="text-2xl font-bold dark:text-white">Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentTools.map(tool => <ToolCard key={`hist-${tool.id}`} tool={tool} />)}
          </div>
        </section>
      )}

      {/* Popular Tools Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Star className="text-yellow-500 fill-yellow-500" size={20} />
          <h2 className="text-2xl font-bold dark:text-white">Popular Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {popularTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <a
              href={`#/category/${cat.replace(/\s+/g, '-').toLowerCase()}`}
              key={cat}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 group transition-all"
            >
              <h3 className="font-semibold dark:text-slate-200 group-hover:text-primary-500 transition-colors">{cat}</h3>
              <p className="text-sm text-slate-500 mt-1">100+ Tools</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Category Page Component ---
const CategoryPage = () => {
  const { catSlug } = useParams<{ catSlug: string }>();

  // Reverse lookup slug to Enum
  const categoryEnum = Object.values(Category).find(
    c => c.replace(/\s+/g, '-').toLowerCase() === catSlug
  );

  if (!categoryEnum) {
    return <div className="text-center p-12 text-slate-500">Category not found.</div>;
  }

  const tools = getToolsByCategory(categoryEnum);

  // SEO Logic
  const title = `${categoryEnum} Tools - Free Online Utilities | Z Tools`;
  const description = `Explore the best free ${categoryEnum.toLowerCase()} tools online. Perform tasks quickly, securely, and offline with our optimized collection of utilities.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": window.location.href
  };

  return (
    <div>
      <SEO title={title} description={description} schema={schema} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{categoryEnum}</h1>
        <p className="text-slate-500">Explore our collection of {categoryEnum.toLowerCase()} tools.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.length > 0 ? (
          tools.map(tool => <ToolCard key={tool.id} tool={tool} />)
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-100 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-slate-500">More tools coming to this category soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Single Tool Page Component ---
const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolsRegistry.find(t => t.id === toolId);
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (toolId) addToHistory(toolId);
  }, [toolId]);

  // Error Boundary for missing tool
  if (!tool) {
    return (
      <div className="text-center p-12 text-slate-500">
        <SEO title="Tool Not Found | Z Tools" description="The requested tool could not be found." />
        Tool not found.
      </div>
    );
  }

  const ToolComponent = tool.component;

  // SEO Logic
  // Title limited to ~60 chars: "Name - Category Tool | Z Tools"
  // If name is long, just "Name - Z Tools"
  const baseTitle = `${tool.name} - Free Online Tool | Z Tools`;
  const title = baseTitle.length > 60 ? `${tool.name} | Z Tools` : baseTitle;

  // Description truncated to 160
  const description = tool.description.length > 160
    ? tool.description.substring(0, 157) + '...'
    : tool.description;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": tool.category,
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  class ToolErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
      if (this.state.hasError) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">Something went wrong loading this tool.</div>;
      return this.props.children;
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <SEO title={title} description={description} schema={schema} keywords={[tool.name.toLowerCase(), tool.category.toLowerCase(), 'online tool', 'free utility']} />

      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
          <a href="#/" className="hover:text-primary-500">Home</a>
          <ArrowRight size={14} />
          <a href={`#/category/${tool.category.replace(/\s+/g, '-').toLowerCase()}`} className="hover:text-primary-500">{tool.category}</a>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <tool.icon className="text-primary-500" />
          {tool.name}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-3xl">{tool.description}</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden flex flex-col">
        <ToolErrorBoundary>
          <ToolComponent />
        </ToolErrorBoundary>
      </div>
    </div>
  );
};

// --- Reusable Tool Card ---
const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
  <a
    href={`#/tool/${tool.id}`}
    className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 flex flex-col"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">
        <tool.icon size={24} />
      </div>
      {tool.popular && (
        <span className="px-2 py-1 text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
          HOT
        </span>
      )}
    </div>
    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-500 transition-colors">
      {tool.name}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
      {tool.description}
    </p>
  </a>
);

// --- Main App ---
export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:catSlug" element={<CategoryPage />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
