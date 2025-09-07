import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mailchimpService } from './MailchimpService';

export function MailchimpDebugInfo() {
  const status = mailchimpService.getConfigStatus();

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <Alert className="bg-background/95 backdrop-blur border">
        <AlertDescription>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Mailchimp státusz:</span>
              <Badge variant={status.status === 'demo' ? 'secondary' : 'outline'}>
                {status.status}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {status.message}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Mailchimp Config Status:', status)}
                className="text-xs"
              >
                Debug Console
              </Button>
              
              <Button
                variant="outline" 
                size="sm"
                onClick={() => {
                  const element = document.querySelector('[data-debug-info]');
                  if (element) element.remove();
                }}
                className="text-xs"
              >
                ✕
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}