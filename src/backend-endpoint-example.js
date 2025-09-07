// EGYSZERŰ BACKEND ENDPOINT PÉLDA
// Ezt használhatod bármilyen Node.js backend keretrendszerrel

// ===== EXPRESS.JS VERZIÓ =====
/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/mailchimp-subscribe', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  // Validáció
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Érvényes email cím szükséges!',
      error: 'INVALID_EMAIL'
    });
  }

  // Mailchimp konfiguráció (környezeti változókból)
  const API_KEY = process.env.MAILCHIMP_API_KEY; // 'aba5f16c1bbb2394ea24ab4bb7f544d5-us10'
  const LIST_ID = process.env.MAILCHIMP_LIST_ID; // '4039cb899d'
  
  if (!API_KEY || !LIST_ID) {
    console.error('Missing Mailchimp configuration');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error',
      error: 'MISSING_CONFIG'
    });
  }

  // Server prefix kinyerése az API kulcsból
  const serverPrefix = API_KEY.split('-')[1]; // 'us10'
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
          ...(lastName && { LNAME: lastName }),
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
});

app.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
*/

// ===== KÖRNYEZETI VÁLTOZÓK (.env fájl) =====
/*
MAILCHIMP_API_KEY=aba5f16c1bbb2394ea24ab4bb7f544d5-us10
MAILCHIMP_LIST_ID=4039cb899d
*/

// ===== TELEPÍTÉSI PARANCSOK =====
/*
npm init -y
npm install express cors dotenv
npm install -g nodemon (opcionális)

# Futtatás:
node backend-endpoint-example.js
# vagy
nodemon backend-endpoint-example.js
*/

// ===== TESZTELÉS CURL-LELL =====
/*
curl -X POST http://localhost:3001/api/mailchimp-subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test"}'
*/

console.log(`
🚀 MAILCHIMP BACKEND ENDPOINT SETUP ÚTMUTATÓ

1️⃣  Hozd létre az Express.js backend-et:
   mkdir mailchimp-backend
   cd mailchimp-backend
   npm init -y
   npm install express cors dotenv

2️⃣  Másold ki a fenti Express.js kódot egy server.js fájlba

3️⃣  Hozz létre egy .env fájlt:
   MAILCHIMP_API_KEY=aba5f16c1bbb2394ea24ab4bb7f544d5-us10
   MAILCHIMP_LIST_ID=4039cb899d

4️⃣  Indítsd el a backend-et:
   node server.js

5️⃣  A frontend automatikusan használni fogja a /api/mailchimp-subscribe endpoint-ot!

💡 ALTERNATÍVA: Használd a Vercel/Netlify functions példákat a projektben!
`);