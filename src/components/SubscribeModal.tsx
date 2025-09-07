import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, CheckCircle, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mailchimpService, MailchimpResponse } from './MailchimpService';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Kérjük, adjon meg egy érvényes email címet!');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const response: MailchimpResponse = await mailchimpService.subscribeUser({
        email: email.trim(),
        firstName: firstName.trim() || undefined,
      });

      if (response.success) {
        setIsSuccess(true);
        toast.success(response.message);
        
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setEmail('');
          setFirstName('');
          setIsSuccess(false);
          setError(null);
          onClose();
        }, 3000);
      } else {
        setError(response.message);
        if (response.error === 'ALREADY_SUBSCRIBED') {
          toast.warning(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      const errorMessage = 'Váratlan hiba történt. Kérjük, próbálja újra később!';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFirstName('');
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2">
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : error ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : (
              <Mail className="w-5 h-5 text-primary" />
            )}
            {isSuccess ? 'Sikeres feliratkozás!' : error ? 'Hiba történt' : 'Hírlevél feliratkozás'}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? 'Köszönjük! Hamarosan megkapja első hírlevelünket és egy megerősítő emailt is küldünk.'
              : error
              ? error
              : 'Iratkozzon fel hírlevelünkre és ne maradjon le a legfrissebb tőzsdei hírekről és konferencia információkról!'
            }
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Keresztnév (opcionális)</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="pl. János"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email cím *</Label>
              <Input
                id="email"
                type="email"
                placeholder="pelda@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${error ? 'border-destructive' : ''}`}
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              * Feliratkozással elfogadja az{' '}
              <button type="button" className="underline hover:no-underline">
                adatkezelési tájékoztatót
              </button>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Mégse
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Feliratkozás...
                  </div>
                ) : (
                  'Feliratkozok'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Ellenőrizze email fiókját a megerősítéshez!
              </p>
              <p className="text-xs text-muted-foreground">
                Az ablak automatikusan bezárul...
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}