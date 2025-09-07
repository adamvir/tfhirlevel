// /netlify/functions/mailchimp-subscribe.js

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // OPTIONS kérés kezelése (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Csak POST engedélyezése
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Only POST method allowed'
      }),
    };
  }

  try {
    const { email, firstName } = JSON.parse(event.body);

    // Validáció
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Érvényes email cím szükséges!',
        }),
      };
    }

    // Mailchimp konfiguráció
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    
    if (!API_KEY || !LIST_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Server configuration error',
        }),
      };
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Sikeresen feliratkozott!',
        }),
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: data.title === 'Member Exists' 
            ? 'Ez az email már fel van iratkozva!'
            : 'Hiba történt a feliratkozás során.',
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Szerver hiba történt.',
      }),
    };
  }
};