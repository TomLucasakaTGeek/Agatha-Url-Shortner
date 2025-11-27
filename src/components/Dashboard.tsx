import { useState, useEffect } from 'react';
import { Link as LinkIcon, Trash2, Copy, Plus, Search, ExternalLink } from 'lucide-react';
import { getLinks, createLink, deleteLink, Link } from '../lib/api';

export function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    target_url: '',
    code: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);
    setError('');
    const result = await getLinks();

    if (result.error) {
      setError(result.error);
    } else {
      setLinks(result.data || []);
    }

    setLoading(false);
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const result = await createLink({
      target_url: formData.target_url,
      code: formData.code || undefined
    });

    setFormLoading(false);

    if (result.error) {
      setFormError(result.error);
    } else {
      setFormData({ target_url: '', code: '' });
      setShowAddForm(false);
      loadLinks();
    }
  }

  async function handleDeleteLink(code: string) {
    if (!confirm(`Delete link "${code}"?`)) return;

    const result = await deleteLink(code);

    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      loadLinks();
    }
  }

  function handleCopyLink(code: string) {
    const url = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(url);
  }

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.target_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LinkIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">TinyLink</h1>
          </div>
          <p className="text-slate-600">Shorten URLs and track clicks</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Link
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateLink} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={formLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Code (optional)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="mycode (6-8 alphanumeric characters)"
                  pattern="[A-Za-z0-9]{6,8}"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={formLoading}
                />
                <p className="text-xs text-slate-500 mt-1">Leave blank to generate automatically</p>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Creating...' : 'Create Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError('');
                    setFormData({ target_url: '', code: '' });
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading links...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadLinks}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">
                {searchQuery ? 'No links found' : 'No links yet'}
              </p>
              <p className="text-slate-500 text-sm">
                {searchQuery ? 'Try a different search' : 'Create your first short link'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-3 pr-4 text-sm font-semibold text-slate-700">Code</th>
                    <th className="pb-3 px-4 text-sm font-semibold text-slate-700">Target URL</th>
                    <th className="pb-3 px-4 text-sm font-semibold text-slate-700">Clicks</th>
                    <th className="pb-3 px-4 text-sm font-semibold text-slate-700">Last Clicked</th>
                    <th className="pb-3 pl-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 pr-4">
                        <a
                          href={`/code/${link.code}`}
                          className="font-mono text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {link.code}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={link.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 truncate max-w-md flex items-center gap-1"
                            title={link.target_url}
                          >
                            <span className="truncate">{link.target_url}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {link.total_clicks}
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-sm">
                        {link.last_clicked_at
                          ? new Date(link.last_clicked_at).toLocaleString()
                          : 'Never'}
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopyLink(link.code)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Copy short URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.code)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-slate-500">
          <p>
            Total links: {links.length} | Filtered: {filteredLinks.length}
          </p>
        </div>
      </div>
    </div>
  );
}
