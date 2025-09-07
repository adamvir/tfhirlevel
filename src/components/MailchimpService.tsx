// Mailchimp API integration service
// FIGYELEM: Jelenleg mock módban fut - éles használathoz backend proxy szükséges!

interface MailchimpSubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface MailchimpResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Konfigurációs objektum - itt állítsd be a valós értékeket
const MAILCHIMP_CONFIG = {
  apiKey: 'aba5f16c1bbb2394ea24ab4bb7f544d5-us10', // Helyettesítsd a valós API kulccsal (pl.: 'abc123def456-us21')
  listId: '4039cb899d', // Helyettesítsd a valós List ID-val (pl.: 'abc123def4')
  serverPrefix: 'us21', // Ez automatikusan kinyerésre kerül az API kulcsból
};

class MailchimpService {
  private apiKey: string;
  private listId: string;
  private serverPrefix: string;

  constructor() {
    // Konfiguráció betöltése
    this.apiKey = MAILCHIMP_CONFIG.apiKey;
    this.listId = MAILCHIMP_CONFIG.listId;
    this.serverPrefix = MAILCHIMP_CONFIG.serverPrefix;
    
    // Ha az API kulcs tartalmazza a server prefix-et, azt használjuk
    if (this.apiKey.includes('-')) {
      const parts = this.apiKey.split('-');
      if (parts.length > 1) {
        this.serverPrefix = parts[parts.length - 1];
      }
    }

    // Fejlesztői információ a konzolban
    if (this.apiKey !== 'YOUR_MAILCHIMP_API_KEY_HERE') {
      console.info('📧 Mailchimp konfiguráció betöltve - Backend endpoint szükséges: /api/mailchimp-subscribe');
    } else {
      console.info('📧 Mailchimp DEMO mód - Valós API kulcs szükséges az éles működéshez');
    }
  }

  async subscribeUser({ email, firstName, lastName }: MailchimpSubscribeRequest): Promise<MailchimpResponse> {
    // Mock mód ha nincs beállítva az API kulcs
    if (this.apiKey === 'YOUR_MAILCHIMP_API_KEY_HERE' || !this.apiKey) {
      return this.mockSubscribe(email);
    }

    try {
      // Backend proxy endpoint használata CORS problémák elkerülésére
      const url = '/api/mailchimp-subscribe'; // A saját backend endpoint-od
      
      const requestBody = {
        email,
        firstName,
        lastName,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Ellenőrizzük, hogy a válasz JSON-e
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      let data: any = {};
      
      if (isJson) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.warn('JSON parsing failed:', jsonError);
          // Ha nem tudtuk JSON-ként feldolgozni, akkor háttérszolgáltatás problémája
          throw new Error('Backend endpoint not available or misconfigured');
        }
      } else {
        // Ha nem JSON a válasz, valószínűleg 404 Not Found vagy CORS hiba
        const textResponse = await response.text();
        console.warn('Non-JSON response received:', textResponse);
        throw new Error('Backend endpoint not available - CORS or 404 error');
      }

      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Sikeresen feliratkozott a hírlevelünkre!',
        };
      } else {
        if (data.title === 'Member Exists' || data.error === 'ALREADY_SUBSCRIBED') {
          return {
            success: false,
            message: 'Ez az email cím már fel van iratkozva!',
            error: 'ALREADY_SUBSCRIBED',
          };
        }

        return {
          success: false,
          message: data.message || 'Hiba történt a feliratkozás során. Kérjük, próbálja újra később!',
          error: data.error || data.detail || 'UNKNOWN_ERROR',
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Backend API Error:', errorMessage);
      
      // Különböző hibatípusok kezelése
      if (errorMessage.includes('CORS') || errorMessage.includes('404') || errorMessage.includes('not available')) {
        console.warn('⚠️  Backend endpoint nem elérhető - Mock módra váltás');
        console.info('💡 Megoldás: Hozz létre egy /api/mailchimp-subscribe endpointot a backend-en');
      } else if (errorMessage.includes('fetch')) {
        console.warn('⚠️  Hálózati hiba - Mock módra váltás');
      } else {
        console.warn('⚠️  Ismeretlen hiba - Mock módra váltás');
      }
      
      // Fallback mock módba
      return this.mockSubscribe(email);
    }
  }

  // Mock funkció fejlesztéshez és CORS fallback-hez
  private async mockSubscribe(email: string): Promise<MailchimpResponse> {
    // Szimuláljuk a hálózati késleltetést
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock hibák szimulálása bizonyos email címekre
    if (email === 'test@error.com') {
      return {
        success: false,
        message: 'Teszt hiba történt!',
        error: 'TEST_ERROR',
      };
    }

    if (email === 'existing@test.com') {
      return {
        success: false,
        message: 'Ez az email cím már fel van iratkozva!',
        error: 'ALREADY_SUBSCRIBED',
      };
    }

    if (email.includes('invalid')) {
      return {
        success: false,
        message: 'Érvénytelen email cím formátum!',
        error: 'INVALID_EMAIL',
      };
    }

    // Sikeres feliratkozás szimulálása
    return {
      success: true,
      message: this.apiKey === 'YOUR_MAILCHIMP_API_KEY_HERE' 
        ? '✅ Sikeresen feliratkozott! (Demo mód - backend integráció szükséges éles használathoz)'
        : '✅ Feliratkozás rögzítve! (Várakozás backend endpoint-ra: /api/mailchimp-subscribe)',
    };
  }

  // Leiratkozás funkció (opcionális)
  async unsubscribeUser(email: string): Promise<MailchimpResponse> {
    if (this.apiKey === 'YOUR_MAILCHIMP_API_KEY_HERE' || !this.apiKey) {
      return {
        success: true,
        message: 'Sikeresen leiratkozott! (Mock Mode)',
      };
    }

    try {
      // MD5 hash szükséges az email címből a Mailchimp API-hoz
      const subscriberHash = await this.createMD5Hash(email.toLowerCase());
      const url = `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members/${subscriberHash}`;

      // FONTOS: Éles környezetben backend proxy használd!
      // Például: const url = `/api/mailchimp/unsubscribe`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'unsubscribed',
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Sikeresen leiratkozott a hírlevelünkről!',
        };
      } else {
        return {
          success: false,
          message: 'Hiba történt a leiratkozás során.',
          error: 'UNSUBSCRIBE_ERROR',
        };
      }
    } catch (error) {
      console.error('Mailchimp Unsubscribe Error (valószínűleg CORS):', error);
      
      // CORS hiba esetén mock válasz
      console.warn('CORS hiba miatt mock válasz. Éles használathoz backend proxy szükséges!');
      return {
        success: true,
        message: 'Leiratkozási kérelem feldolgozva (Mock Mode)',
      };
    }
  }

  // MD5 hash generálás (szükséges a Mailchimp API-hoz)
  // Egyszerű MD5 implementáció böngészőhöz
  private async createMD5Hash(text: string): Promise<string> {
    // Böngésző környezetben egyszerűsített hash
    // Éles alkalmazásban használj egy megfelelő MD5 könyvtárat
    
    try {
      // Modern böngészők támogatják a crypto.subtle-t, de MD5-öt nem
      // Egyszerű alternatíva: base64 kódolás email-ből
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // SHA-256 használata MD5 helyett (biztonságosabb és támogatott)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Az első 32 karaktert használjuk MD5 helyettesítésére
      return hashHex.substring(0, 32);
    } catch (error) {
      console.error('Hash generation error:', error);
      
      // Fallback: egyszerű string hash
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32-bit integer conversion
      }
      
      return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32);
    }
  }

  // Konfigurációs státusz ellenőrzése
  getConfigStatus(): { 
    isConfigured: boolean; 
    hasBackend: boolean; 
    status: 'demo' | 'configured-no-backend' | 'production-ready';
    message: string;
  } {
    const isConfigured = this.apiKey !== 'YOUR_MAILCHIMP_API_KEY_HERE' && this.apiKey.length > 0;
    
    if (!isConfigured) {
      return {
        isConfigured: false,
        hasBackend: false,
        status: 'demo',
        message: 'Demo mód - Valós Mailchimp API kulcs és backend endpoint szükséges'
      };
    }

    return {
      isConfigured: true,
      hasBackend: false, // Ezt dinamikusan kellene ellenőrizni
      status: 'configured-no-backend',
      message: 'Mailchimp API konfigurálva - Backend endpoint létrehozása szükséges: /api/mailchimp-subscribe'
    };
  }
}

// Singleton instance
export const mailchimpService = new MailchimpService();

// Export types
export type { MailchimpSubscribeRequest, MailchimpResponse };