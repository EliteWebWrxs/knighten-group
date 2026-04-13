import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, phone, address, bedrooms, bathrooms, sqft, condition, timeline, message } = body;

  if (!name || !email || !address) {
    return Response.json({ error: 'Name, email, and address are required' }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { error } = await supabase.from('leads').insert({
    source: 'home-value',
    name,
    email,
    phone: phone || null,
    address,
    bedrooms: bedrooms ? parseInt(bedrooms) : null,
    bathrooms: bathrooms ? parseInt(bathrooms) : null,
    sqft: sqft ? parseFloat(sqft) : null,
    property_condition: condition || null,
    timeline: timeline || null,
    message: message || null,
  });

  if (error) {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }

  // TODO: Send email notification to info@theknightengroup.com via Resend
  // if (process.env.RESEND_API_KEY) { ... }

  return Response.json({ ok: true });
}
