// /api/mailchimp-subscribe.js (Vercel Functions)

export default async function handler(req, res) {
  // CORS beállítás
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS kérés kezelése
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Csak POST engedélyezése
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Only POST method allowed'
    });
  }

  try {
    const { email, firstName } = req.body;

    // Validáció
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Érvényes email cím szükséges!'
      });
    }

    // Mailchimp konfiguráció
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    
    if (!API_KEY || !LIST_ID) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Mailchimp API hívás
    const serverPrefix = API_KEY.split('-')[1];
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          ...(firstName && { FNAME: firstName }),
        },
        tags: ['Tőzsdéfórum Weboldal'],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Sikeresen feliratkozott!'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.title === 'Member Exists' 
          ? 'Ez az email már fel van iratkozva!'
          : 'Hiba történt a feliratkozás során.'
      });
    }
  } catch (error) {
    console.error('Mailchimp Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Szerver hiba történt.'
    });
  }
}