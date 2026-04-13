import { createClient } from '@/lib/supabase/server';
import { isIdxEnabled } from '@/lib/compliance/copyright';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isIdxEnabled()) {
    return new Response('IDX data temporarily unavailable', { status: 503 });
  }

  const { id } = await params;

  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_media (
        media_key,
        media_url_original,
        storage_path,
        order_index,
        media_category,
        is_primary
      )
    `)
    .eq('listing_key', id)
    .is('deleted_at', null)
    .single();

  if (error || !listing) {
    return Response.json({ error: 'Listing not found' }, { status: 404 });
  }

  // Fetch related agent and office info
  const [agentResult, officeResult] = await Promise.all([
    listing.list_agent_key
      ? supabase.from('members').select('*').eq('member_key', listing.list_agent_key).single()
      : null,
    listing.list_office_key
      ? supabase.from('offices').select('*').eq('office_key', listing.list_office_key).single()
      : null,
  ]);

  // Fetch open houses
  const { data: openHouses } = await supabase
    .from('open_houses')
    .select('*')
    .eq('listing_key', id)
    .gte('open_house_start_time', new Date().toISOString())
    .order('open_house_start_time', { ascending: true });

  return Response.json({
    listing,
    agent: agentResult?.data || null,
    office: officeResult?.data || null,
    openHouses: openHouses || [],
  });
}
