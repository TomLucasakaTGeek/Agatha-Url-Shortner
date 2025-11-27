import { useState, useEffect } from 'react';
import { useParams, useNavigate } from './Router';
import { BarChart3, ExternalLink, Copy, ArrowLeft, Calendar, MousePointerClick } from 'lucide-react';
import { getLinkByCode, Link } from '../lib/api';

export function StatsPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  useEffect(() => {
    if (code) {
      loadLink(code);
    }
  }, [code]);

  async function loadLink(linkCode: string) {
    setLoading(true);
    setError('');

    const result = await getLinkByCode(linkCode);

    if (result.error) {
      setError(result.error);
    } else {
      setLink(result.data || null);
    }

    setLoading(false);
  }

  function handleCopyLink() {
    if (link) {
      const url = `${baseUrl}/${link.code}`;
      navigator.clipboard.writeText(url);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <BarChart3 className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Link Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'This link does not exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Link Statistics</h1>
            </div>
            <p className="text-blue-100">Detailed analytics for your short link</p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Short Code</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-lg font-semibold text-slate-900">
                  {link.code}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                  title="Copy short URL"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Short URL: <span className="font-mono text-blue-600">{baseUrl}/{link.code}</span>
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Target URL</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                <a
                  href={link.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-slate-700 hover:text-blue-600 break-all transition-colors"
                >
                  {link.target_url}
                </a>
                <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <MousePointerClick className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Clicks</p>
                  </div>
                </div>
                <p className="text-4xl font-bold text-blue-900 mt-2">{link.total_clicks}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-600 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Last Clicked</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-2">
                  {link.last_clicked_at
                    ? new Date(link.last_clicked_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })
                    : 'Never'}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Link Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Created</span>
                  <span className="font-medium text-slate-900">
                    {new Date(link.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Updated</span>
                  <span className="font-medium text-slate-900">
                    {new Date(link.updated_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Link ID</span>
                  <span className="font-mono text-xs text-slate-900">{link.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
