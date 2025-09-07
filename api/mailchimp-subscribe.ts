// api/mailchimp-subscribe.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, message: 'Only POST method allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, firstName } = body;

    if (!email || !email.includes('@'))
      return res.status(400).json({ success: false, message: 'Érvényes email kell', error: 'INVALID_EMAIL' });

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    if (!API_KEY || !LIST_ID)
      return res.status(500).json({ success: false, message: 'Hiányzó szerver beállítás', error: 'MISSING_CONFIG' });

    const dc = API_KEY.split('-').pop()!; // pl. us10
    const hash = createHash('md5').update(email.toLowerCase()).digest('hex');

    const r = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`, {
      method: 'PUT',
      headers: { 'Authorization': `apikey ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'pending',            // double opt-in (EU/GDPR ajánlott)
        merge_fields: { FNAME: firstName || '' },
        tags: ['Website']
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(400).json({ success: false, message: data.detail || 'Mailchimp error' });

    return res.status(200).json({ success: true, message: 'Köszönjük! Nézd meg az emailed.', status: data.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error', error: 'SERVER_ERROR' });
  }
}
