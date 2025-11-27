import { useEffect, useState } from 'react';
import { createLink, getLinks, getLinkByCode, deleteLink } from '../lib/api';

interface ApiRouterProps {
  onResponse: (response: Response) => void;
}

export function ApiRouter({ onResponse }: ApiRouterProps) {
  const [requestPath, setRequestPath] = useState<string>('');

  useEffect(() => {
    const handleRequest = async () => {
      const path = window.location.pathname;

      if (path.startsWith('/api/')) {
        const method = 'GET';

        if (path === '/api/links' && method === 'GET') {
          const result = await getLinks();

          if (result.error) {
            onResponse(new Response(JSON.stringify({ error: result.error }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }));
          } else {
            onResponse(new Response(JSON.stringify(result.data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        }
      }
    };

    handleRequest();
  }, [requestPath, onResponse]);

  return null;
}

export async function handleApiRequest(path: string, method: string, body?: unknown): Promise<Response> {
  if (path === '/api/links' && method === 'POST') {
    const result = await createLink(body as { target_url: string; code?: string });

    if (result.error) {
      const status = result.error === 'Code already exists' ? 409 : 400;
      return new Response(JSON.stringify({ error: result.error }), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path === '/api/links' && method === 'GET') {
    const result = await getLinks();

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path.startsWith('/api/links/') && method === 'GET') {
    const code = path.split('/')[3];
    const result = await getLinkByCode(code);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path.startsWith('/api/links/') && method === 'DELETE') {
    const code = path.split('/')[3];
    const result = await deleteLink(code);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, {
      status: 204
    });
  }

  if (path === '/healthz' && method === 'GET') {
    return new Response(JSON.stringify({ ok: true, version: '1.0' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}
