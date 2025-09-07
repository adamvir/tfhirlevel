// /pages/api/mailchimp-subscribe.js vagy /app/api/mailchimp-subscribe/route.js (App Router)

export default async function handler(req, res) {
  // Csak POST kéréseket engedélyezünk
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Only POST method allowed' 
    });
  }

  const { email, firstName } = req.body;

  // Validáció
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Érvényes email cím szükséges!',
      error: 'INVALID_EMAIL'
    });
  }

  // Mailchimp konfiguráció (környezeti változókból)
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

  // Server prefix kinyerése az API kulcsból
  const serverPrefix = API_KEY.split('-')[1];
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed', // Vagy 'pending' double opt-in-hez
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
        message: 'Sikeresen feliratkozott a hírlevelünkre!',
      });
    } else {
      // Mailchimp specifikus hibakezelés
      if (data.title === 'Member Exists') {
        return res.status(400).json({
          success: false,
          message: 'Ez az email cím már fel van iratkozva!',
          error: 'ALREADY_SUBSCRIBED',
        });
      }

      if (data.title === 'Invalid Resource') {
        return res.status(400).json({
          success: false,
          message: 'Érvénytelen email cím formátum!',
          error: 'INVALID_EMAIL',
        });
      }

      console.error('Mailchimp API Error:', data);
      return res.status(400).json({
        success: false,
        message: 'Hiba történt a feliratkozás során.',
        error: data.detail || 'UNKNOWN_ERROR',
      });
    }
  } catch (error) {
    console.error('Network/Server Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Szerver hiba történt. Próbálja újra később!',
      error: 'SERVER_ERROR',
    });
  }
}

// App Router verzió (Next.js 13+)
// export async function POST(request) {
//   const body = await request.json();
//   // ... ugyanaz a logika mint fent
// }