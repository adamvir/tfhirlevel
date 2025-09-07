import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto'; // fontos: ne "node:crypto", hanem sima "crypto"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Csak POST-ot engedünk
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST method allowed' });
  }

  try {
    // Body feldolgozás
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email, firstName } = body || {};

    // Validáció
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Érvényes email cím szükséges!',
        error: 'INVALID_EMAIL'
      });
    }

    // Mailchimp config
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    if (!API_KEY || !LIST_ID) {
      console.error('Missing Mailchimp configuration');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
        error: 'MISSING_CONFIG'
      });
    }

    const dc = API_KEY.split('-').pop(); // pl. us10
    const hash = createHash('md5').update(email.toLowerCase()).digest('hex');

    // API hívás Mailchimp felé
    const r = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`, {
      method: 'PUT',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'pending', // double opt-in javasolt (biztonságosabb EU-ban)
        merge_fields: { FNAME: firstName || '' },
        tags: ['Tőzsdefórum Weboldal'],
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(400).json({
        success: false,
        message: data.detail || 'Hiba történt',
        error: data.title || 'MAILCHIMP_ERROR'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Köszönjük! Nézd meg az emailed.',
      status: data.status
    });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Szerver hiba',
      error: 'SERVER_ERROR'
    });
  }
}
