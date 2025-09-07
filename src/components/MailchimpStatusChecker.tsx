import React, { useState, useEffect } from 'react';
import { mailchimpService } from './MailchimpService';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

export function MailchimpStatusChecker() {
  const [status, setStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = () => {
    const configStatus = mailchimpService.getConfigStatus();
    setStatus(configStatus);
  };

  const testConnection = async () => {
    setIsChecking(true);
    try {
      const result = await mailchimpService.subscribeUser({
        email: 'test@connection.com'
      });
      console.log('Connection test result:', result);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!status) return null;

  const getStatusIcon = () => {
    switch (status.status) {
      case 'demo':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'configured-no-backend':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'production-ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'demo':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'configured-no-backend':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'production-ready':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return 'bg-red-100 border-red-200 text-red-800';
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          📧 Mailchimp Integráció Státusz
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Frissítés
        </Button>
      </div>

      <Alert className={getStatusColor()}>
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <AlertDescription>
              <div className="font-medium mb-1">
                Állapot: <Badge variant="outline" className="ml-1">
                  {status.status}
                </Badge>
              </div>
              <p>{status.message}</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {status.isConfigured ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span>Mailchimp API konfiguráció</span>
        </div>
        
        <div className="flex items-center gap-2">
          {status.hasBackend ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span>Backend endpoint (/api/mailchimp-subscribe)</span>
        </div>
      </div>

      {status.status !== 'production-ready' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <p className="font-medium text-blue-800 mb-2">📚 Következő lépések:</p>
          <ul className="text-blue-700 space-y-1 list-disc list-inside">
            {status.status === 'demo' && (
              <>
                <li>Állítsd be a valós Mailchimp API kulcsot</li>
                <li>Hozz létre backend endpoint-ot</li>
              </>
            )}
            {status.status === 'configured-no-backend' && (
              <li>Hozz létre a /api/mailchimp-subscribe backend endpoint-ot</li>
            )}
          </ul>
          <p className="mt-2 text-xs text-blue-600">
            Lásd: backend-endpoint-example.js vagy api-examples/ mappa
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={testConnection}
          disabled={isChecking}
          className="gap-2"
        >
          {isChecking ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Kapcsolat Teszt
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('Mailchimp Config:', {
              apiKey: mailchimpService['apiKey']?.substring(0, 10) + '...',
              listId: mailchimpService['listId'],
              serverPrefix: mailchimpService['serverPrefix']
            });
          }}
          className="gap-2"
        >
          🔍 Debug Info
        </Button>
      </div>
    </div>
  );
}