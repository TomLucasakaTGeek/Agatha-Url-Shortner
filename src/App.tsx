import { RouterProvider, useRouter } from './components/Router';
import { Dashboard } from './components/Dashboard';
import { StatsPage } from './components/StatsPage';
import { RedirectHandler } from './components/RedirectHandler';
import { HealthCheck } from './components/HealthCheck';

function AppContent() {
  const { path } = useRouter();

  if (path === '/healthz') {
    return <HealthCheck />;
  }

  if (path === '/') {
    return <Dashboard />;
  }

  const codeStatsMatch = path.match(/^\/code\/([A-Za-z0-9]{6,8})$/);
  if (codeStatsMatch) {
    return <StatsPage />;
  }

  const redirectMatch = path.match(/^\/([A-Za-z0-9]{6,8})$/);
  if (redirectMatch) {
    return <RedirectHandler code={redirectMatch[1]} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">404 - Page Not Found</h2>
        <p className="text-slate-600 mb-6">The page you're looking for doesn't exist</p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
