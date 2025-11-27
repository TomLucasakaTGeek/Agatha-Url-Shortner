import { Activity } from 'lucide-react';

export function HealthCheck() {
  const startTime = Date.now();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">System Health Check</h1>
              <p className="text-slate-600">Service status and diagnostics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-900">Status</span>
              </div>
              <span className="text-green-700 font-medium">Operational</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Version</p>
                <p className="text-lg font-semibold text-slate-900">1.0</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Uptime</p>
                <p className="text-lg font-semibold text-slate-900">
                  {Math.floor((Date.now() - startTime) / 1000)}s
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Environment</p>
                <p className="text-lg font-semibold text-slate-900">
                  {import.meta.env.MODE}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Timestamp</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date().toISOString()}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-mono text-blue-900">
                {"{ \"ok\": true, \"version\": \"1.0\" }"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
