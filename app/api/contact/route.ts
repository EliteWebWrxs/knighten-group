import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, message, listingKey } = body;

  if (!name || !email || !message) {
    return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { error } = await supabase.from('leads').insert({
    source: listingKey ? 'listing-inquiry' : 'contact',
    listing_key: listingKey || null,
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
