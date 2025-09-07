import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Mail, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  Star,
  ArrowRight,
  Zap,
  Target,
  Shield
} from "lucide-react";
import exampleNewsletter from 'figma:asset/b35ef781a8eb2bed205f8ca5354a12af18245fba.png';

export function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Countdown timer - 12 hours from page load
  const [timeLeft, setTimeLeft] = useState(() => {
    return 12 * 60 * 60; // 12 hours in seconds
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours} óra ${minutes.toString().padStart(2, '0')} perc ${secs.toString().padStart(2, '0')} mp`;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubscribed(true);
    setIsLoading(false);
  };

  const newsletterStats = [
    { label: "Aktív feliratkozó", value: "12,000+", icon: <Users className="w-5 h-5" /> },
    { label: "Átlagos megnyitási arány", value: "68%", icon: <Mail className="w-5 h-5" /> },
    { label: "Éves profit növekedés", value: "+24%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Elégedettségi pont", value: "4.9/5", icon: <Star className="w-5 h-5" /> }
  ];

  const benefits = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Napi piaci összefoglaló",
      description: "Részletes elemzés a magyar és nemzetközi tőzsdékről minden reggel 7 órára"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Nemzetközi trendek",
      description: "A világpiacok legfontosabb mozgásai és azok hatása a magyar gazdaságra"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Devizaárfolyamok",
      description: "EUR/HUF, USD/HUF és egyéb főbb devizapárok alakulása előrejelzésekkel"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Befektetési tanácsok",
      description: "Szakértői ajánlások és piaci kilátások tapasztalt elemzőktől"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Breaking news riasztás",
      description: "Azonnali értesítés a piacmozgató hírekről és eseményekről"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Kockázatelemzés",
      description: "Részletes kockázatértékelés és diverzifikációs stratégiák"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative container mx-auto px-4 pt-8 pb-20 lg:pt-12 lg:pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left space-y-8 text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <Mail className="w-4 h-4" />
                  Magyarország #1 pénzügyi hírlevele
                </div>
                
                <h1 className="text-4xl lg:text-6xl leading-tight">
                  <span className="text-yellow-400">TF Hírlevél</span><br />
                  A napi dozis pénzügyi tudás
                </h1>
                
                <p className="text-lg lg:text-xl text-blue-100 max-w-2xl">
                  Több mint 12,000 szakember indítja a napját a TF Hírlevelünkkel. 
                  Csatlakozzon Ön is és legyen mindig egy lépéssel előrébb a piacokon!
                </p>

                {/* Subscription Form */}
                {!isSubscribed ? (
                  <div className="max-w-md mx-auto lg:mx-0">
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="Add meg az email címed"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20"
                        />
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isLoading}
                          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8"
                        >
                          {isLoading ? (
                            "Feliratkozás..."
                          ) : (
                            <>
                              Feliratkozom
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-blue-200">
                        Ingyenes. Bármikor leiratkozható. Adatai biztonságban vannak.
                      </p>
                    </form>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto lg:mx-0 bg-green-600/20 border border-green-400/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 text-green-100">
                      <CheckCircle className="w-6 h-6" />
                      <div>
                        <h3 className="font-medium">Sikeres feliratkozás!</h3>
                        <p className="text-sm">Hamarosan megkapja az első hírlevelünket.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center lg:text-left">
                  <div>
                    <div className="text-2xl font-medium text-yellow-400">12,000+</div>
                    <div className="text-sm text-blue-200">Feliratkozó</div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium text-yellow-400">68%</div>
                    <div className="text-sm text-blue-200">Megnyitási arány</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Newsletter Preview */}
              <div className="mt-12 lg:mt-0 lg:h-full lg:flex lg:items-start">
                <div className="relative lg:sticky lg:top-8">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-blue-300/20 rounded-2xl blur-xl"></div>
                  <Card className="relative bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
                    <div className="h-96 lg:h-[600px] relative overflow-hidden">
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <img 
                          src={exampleNewsletter} 
                          alt="TF Hírlevél példa"
                          className="w-full object-cover object-top"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <Badge className="mb-2 bg-yellow-400 text-blue-900">
                          Mai szám előnézet
                        </Badge>
                        <h3 className="font-medium">TF Hírlevél - 2025.01.06</h3>
                        <p className="text-sm text-gray-200">Nemzetközi és magyar piaci összefoglaló</p>
                        <p className="text-xs text-gray-300 mt-1">Görgessen a teljes tartalom megtekintéséhez</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Countdown Timer */}
                  <div className="mt-6">
                    <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <Clock className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
                            <span className="text-red-700 dark:text-red-300 font-medium text-lg">
                              ⚡ Korlátozott ajánlat!
                            </span>
                          </div>
                          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
                            Még ennyi ideig tudsz <span className="text-red-800 dark:text-red-200 font-bold">ingyenesen</span> csatlakozni:
                          </p>
                          <div className="text-2xl lg:text-3xl font-mono text-red-800 dark:text-red-200 bg-white/70 dark:bg-black/30 rounded-xl py-3 px-6 inline-block shadow-inner border border-red-200 dark:border-red-700">
                            {formatTime(timeLeft)}
                          </div>
                          <p className="text-xs text-red-500 dark:text-red-400 mt-3 opacity-75">
                            Ezután havonta csak 2.990 Ft
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900 dark:text-white">
                Miért bíznak bennünk ezren?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A számok magukért beszélnek - mi Magyarország legmegbízhatóbb pénzügyi hírlevele vagyunk
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {newsletterStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl mb-4">Mit kap minden nap a TF Hírlevelben?</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Átfogó piaci elemzés, szakértői tanácsok és minden, ami a sikeres befektetéshez szükséges
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl mb-4">Ízelítő a mai hírlevelből</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Minden nap hasonló részletességű és minőségű tartalmat kap
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded text-white">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-blue-900 dark:text-blue-100">Piaci összefoglaló</CardTitle>
                      <p className="text-sm text-blue-600 dark:text-blue-400">2025. január 6. hétfő</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Mai szám</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🇭🇺 Magyar piac</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>BUX index:</span>
                        <span className="text-green-600">+1.2% (72,450)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OTP:</span>
                        <span className="text-green-600">+2.1% (18,920 Ft)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MOL:</span>
                        <span className="text-red-600">-0.8% (2,845 Ft)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🌍 Nemzetközi</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>S&P 500:</span>
                        <span className="text-green-600">+0.9% (5,892)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EUR/HUF:</span>
                        <span className="text-red-600">+0.3% (392.85)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bitcoin:</span>
                        <span className="text-green-600">+2.4% ($98,650)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📊 Mai elemzés</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Az MNB várakozásoknak megfelelően 6.75%-on tartotta az alapkamatot. 
                    A döntés pozitívan hatott a magyar eszközökre, különösen a bankpapírokra...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl">
              Ne maradjon le a piaci lehetőségekről!
            </h2>
            <p className="text-lg text-blue-100">
              Csatlakozzon több mint 12,000 sikeres befektetőhöz, 
              akik minden nap a TF Hírlevelből tájékozódnak.
            </p>
            
            {!isSubscribed && (
              <div className="max-w-md mx-auto">
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Az Ön email címe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                  >
                    {isLoading ? "Feliratkozás..." : "Ingyenes feliratkozás"}
                  </Button>
                </form>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Ingyenes
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Minden reggel 7:00
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Biztonságos
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}