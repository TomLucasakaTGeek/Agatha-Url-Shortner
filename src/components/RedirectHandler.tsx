import { useEffect, useState } from 'react';
import { getLinkByCode, incrementClickCount } from '../lib/api';
import { ExternalLink } from 'lucide-react';

interface RedirectHandlerProps {
  code: string;
}

export function RedirectHandler({ code }: RedirectHandlerProps) {
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'not_found'>('loading');
  const [targetUrl, setTargetUrl] = useState<string>('');

  useEffect(() => {
    handleRedirect();
  }, [code]);

  async function handleRedirect() {
    const result = await getLinkByCode(code);

    if (result.error || !result.data) {
      setStatus('not_found');
      return;
    }

    setTargetUrl(result.data.target_url);
    setStatus('redirecting');

    await incrementClickCount(code);

    setTimeout(() => {
      window.location.href = result.data!.target_url;
    }, 1000);
  }

  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Link Not Found</h2>
          <p className="text-slate-600 mb-6">This short link does not exist or has been deleted</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Redirecting...</h2>
        {targetUrl && (
          <p className="text-slate-600 text-sm break-all">Taking you to: {targetUrl}</p>
        )}
      </div>
    </div>
  );
}
