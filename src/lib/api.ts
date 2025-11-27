import { supabase, Link } from './supabase';

export interface CreateLinkRequest {
  target_url: string;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export async function createLink(request: CreateLinkRequest): Promise<ApiResponse<Link>> {
  if (!isValidUrl(request.target_url)) {
    return { error: 'Invalid URL format' };
  }

  let code = request.code;

  if (code) {
    if (!isValidCode(code)) {
      return { error: 'Code must be 6-8 alphanumeric characters' };
    }
  } else {
    code = generateRandomCode();

    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('links')
        .select('code')
        .eq('code', code)
        .maybeSingle();

      if (!existing) break;

      code = generateRandomCode();
      attempts++;
    }

    if (attempts === 10) {
      return { error: 'Failed to generate unique code' };
    }
  }

  const { data, error } = await supabase
    .from('links')
    .insert([{ code, target_url: request.target_url }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'Code already exists' };
    }
    return { error: error.message };
  }

  return { data };
}

export async function getLinks(): Promise<ApiResponse<Link[]>> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: data || [] };
}

export async function getLinkByCode(code: string): Promise<ApiResponse<Link>> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: 'Link not found' };
  }

  return { data };
}

export async function deleteLink(code: string): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('code', code);

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function incrementClickCount(code: string): Promise<ApiResponse<void>> {
  const { error } = await supabase.rpc('increment_click_count', { link_code: code });

  if (error) {
    const { data: link } = await supabase
      .from('links')
      .select('total_clicks')
      .eq('code', code)
      .maybeSingle();

    if (link) {
      await supabase
        .from('links')
        .update({
          total_clicks: link.total_clicks + 1,
          last_clicked_at: new Date().toISOString()
        })
        .eq('code', code);
    }
  }

  return {};
}
