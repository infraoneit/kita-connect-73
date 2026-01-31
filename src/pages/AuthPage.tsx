import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Baby } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein');
const passwordSchema = z.string().min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein');
const nameSchema = z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein');

export default function AuthPage() {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: err.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      let message = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.';
      if (error.message.includes('Invalid login credentials')) {
        message = 'Ungültige E-Mail oder Passwort.';
      } else if (error.message.includes('Email not confirmed')) {
        message = 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.';
      }
      
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Willkommen!',
        description: 'Sie wurden erfolgreich angemeldet.',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
      nameSchema.parse(signupFirstName);
      nameSchema.parse(signupLastName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: err.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupFirstName, signupLastName);
    setIsLoading(false);

    if (error) {
      let message = 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
      if (error.message.includes('User already registered')) {
        message = 'Diese E-Mail-Adresse ist bereits registriert.';
      }
      
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Konto erstellt!',
        description: 'Ihr Konto wurde erfolgreich erstellt.',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const fillDemoCredentials = () => {
    setLoginEmail('admin@kita-demo.ch');
    setLoginPassword('Demo2026!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <Baby className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">KitaConnect</CardTitle>
          <CardDescription>
            Admin-Management für Ihre Kita
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Credentials Box */}
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary mb-2">🔐 Demo-Zugangsdaten:</p>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">E-Mail:</span> <code className="bg-background px-1.5 py-0.5 rounded font-mono">admin@kita-demo.ch</code></p>
              <p><span className="text-muted-foreground">Passwort:</span> <code className="bg-background px-1.5 py-0.5 rounded font-mono">Demo2026!</code></p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
              onClick={fillDemoCredentials}
            >
              Demo-Daten einfügen
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Anmelden</TabsTrigger>
              <TabsTrigger value="signup">Registrieren</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-Mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Passwort</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird angemeldet...
                    </>
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">Vorname</Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      placeholder="Max"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Nachname</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Mustermann"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-Mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Passwort</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mindestens 6 Zeichen"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird registriert...
                    </>
                  ) : (
                    'Konto erstellen'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
