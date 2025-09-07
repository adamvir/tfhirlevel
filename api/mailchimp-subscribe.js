// api/mailchimp-subscribe.js  (CommonJS, Vercel Functions)
const { createHash } = require('crypto');

module.exports = async function handler(req, res) {
  // Csak POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST method allowed' });
  }

  try {
    // Body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, firstName } = body;

    // Validáció
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Érvényes email cím szükséges!',
        error: 'INVALID_EMAIL'
      });
    }

    // Env
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    if (!API_KEY || !LIST_ID) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
        error: 'MISSING_CONFIG'
      });
    }

    // DC és hash
    const dc = API_KEY.split('-').pop(); // pl. us10
    const hash = createHash('md5').update(email.toLowerCase()).digest('hex');

    // Upsert: PUT /members/{hash}
    const mcRes = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`, {
      method: 'PUT',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'pending',              // GDPR-barát double opt-in
        merge_fields: { FNAME: firstName || '' },
        tags: ['Tőzsdefórum Weboldal']
      })
    });

    const data = await mcRes.json().catch(() => ({}));

    if (!mcRes.ok) {
      return res.status(mcRes.status || 400).json({
        success: false,
        message: data?.detail || 'Hiba történt a feliratkozás során.',
        error: data?.title || 'MAILCHIMP_ERROR'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Köszönjük! Nézd meg az emailed és erősítsd meg a feliratkozást.',
      status: data?.status || 'pending'
    });
  } catch (err) {
    console.error('Mailchimp subscribe error:', err);
    return res.status(500).json({
      success: false,
      message: 'Szerver hiba. Próbáld újra később.',
      error: 'SERVER_ERROR'
    });
  }
};
