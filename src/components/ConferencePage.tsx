import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Award,
  Target,
  Zap,
  Building,
  Gift
} from "lucide-react";
import { mockConferences, Conference } from "../data/mockConferences";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedCounter } from "./AnimatedCounter";

export function ConferencePage() {
  const [selectedConference, setSelectedConference] = useState<string | null>(null);
  
  const handleRegister = (conferenceId: string) => {
    // Nyissa meg a regisztrációs űrlapot új ablakban
    window.open('https://forms.office.com/e/jPYmAQiXbj?origin=lprLink', '_blank');
  };

  const handleEventSelect = (conferenceId: string) => {
    setSelectedConference(selectedConference === conferenceId ? null : conferenceId);
  };

  const upcomingConference = mockConferences[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
              <Award className="w-4 h-4" />
              Exkluzív szakmai esemény
            </div>
            <h1 className="text-4xl lg:text-6xl leading-tight text-white">
              <span className="text-yellow-300 dark:text-yellow-400">Jövőbe tekintő</span> - Innovatív megoldások
            </h1>
            <p className="text-lg lg:text-xl text-white/90 dark:text-white/80 max-w-2xl mx-auto">
              Innovatív projektek, exkluzív networking és értékes nyeremények várják.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-white/90 dark:bg-white dark:text-blue-950 dark:hover:bg-white/90 px-8 py-3"
              onClick={() => document.getElementById('featured-event')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Esemény részletek
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <AnimatedCounter 
                end={2} 
                className="text-3xl lg:text-4xl text-blue-600 dark:text-blue-400 font-bold" 
                duration={1500}
              />
              <p className="text-gray-600 dark:text-gray-300">Előadó cég</p>
            </div>
            <div className="space-y-2">
              <AnimatedCounter 
                end={150} 
                className="text-3xl lg:text-4xl text-blue-600 dark:text-blue-400 font-bold" 
                duration={2000}
              />
              <p className="text-gray-600 dark:text-gray-300">Max. résztvevő</p>
            </div>
            <div className="space-y-2">
              <AnimatedCounter 
                end={2} 
                className="text-3xl lg:text-4xl text-blue-600 dark:text-blue-400 font-bold" 
                duration={1500}
              />
              <p className="text-gray-600 dark:text-gray-300">Óra időtartam</p>
            </div>
            <div className="space-y-2">
              <AnimatedCounter 
                end={3} 
                className="text-3xl lg:text-4xl text-blue-600 dark:text-blue-400 font-bold" 
                duration={1800}
              />
              <p className="text-gray-600 dark:text-gray-300">AirPods Pro</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section id="featured-event" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300">Kiemelt események</Badge>
            <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">Következő nagyszerű eseményeink</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kattintson egy eseményre a részletes információkért
            </p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {mockConferences.map((conference) => (
              <Card key={conference.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => handleEventSelect(conference.id)}>
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <ImageWithFallback 
                      src={conference.imageUrl} 
                      alt={conference.title}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-1/2 p-6 lg:p-8 space-y-4">
                    <div>
                      <Badge className="mb-2">{conference.category}</Badge>
                      <h3 className="text-xl lg:text-2xl mb-2">{conference.title}</h3>
                      <p className="text-muted-foreground text-sm">{conference.subtitle}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-foreground">{conference.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-foreground">{conference.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-foreground">{conference.venue}, {conference.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg">
                        {conference.earlyBirdPrice && (
                          <span className="line-through text-muted-foreground text-sm mr-2">
                            {conference.price}
                          </span>
                        )}
                        <span className="text-primary font-medium">
                          {conference.earlyBirdPrice || conference.price}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventSelect(conference.id);
                        }}
                        className="flex items-center gap-2"
                      >
                        {selectedConference === conference.id ? 'Bezárás' : 'Részletek'}
                        <ArrowRight className={`w-4 h-4 transition-transform ${selectedConference === conference.id ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedConference === conference.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="p-6 lg:p-8 space-y-8">
                      {/* Előadó cégek szekció */}
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2 text-foreground">
                          <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Előadó cégek
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {conference.speakers.map((speaker) => (
                            <div key={speaker.id} className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 shadow-sm">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={speaker.imageUrl} alt={speaker.company} />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">{speaker.company.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-foreground">{speaker.company}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(conference.id);
                        }}
                      >
                        Regisztrálok most
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Agenda Section - Only shown when event is selected */}
      {selectedConference && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">Részletes program</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Minden percet hasznosan töltünk el az eseményen
                </p>
              </div>
              
              <div className="space-y-4">
                {mockConferences.find(conf => conf.id === selectedConference)?.agenda.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prize Draw Section - Only shown when event is selected */}
      {selectedConference && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 dark:from-yellow-400/10 dark:to-orange-400/10 rounded-full px-6 py-2 mb-4">
                  <Gift className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Sorsolás</span>
                </div>
                <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">Nyerjen AirPods Pro-t!</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Az esemény végén 3 db AirPods Pro között sorsolunk minden regisztrált résztvevő között
                </p>
              </div>
              
              <Card className="border-2 border-yellow-200 dark:border-yellow-600/30 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <Gift className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h3 className="text-xl text-foreground">3 db AirPods Pro</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        A legújabb Apple AirPods Pro vezeték nélküli fülhallgatók
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl text-foreground">Minden résztvevő</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Minden regisztrált és megjelent résztvevő automatikusan részt vesz
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl text-foreground">18:50-kor</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Az előadások után azonnal megtartjuk a sorsolást
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Only shown when event is selected */}
      {selectedConference && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">Miért érdemes részt vennie?</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Exkluzív betekintés két vezető cég innovatív projektjeibe és networking lehetőség
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl text-foreground">Innovatív projektek</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ismerje meg az Épduferr és Megakrán jövőbe tekintő 
                  projektjeit és technológiai újításait.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl text-foreground">Exkluzív networking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Találkozzon az Épduferr és Megakrán vezető szakértőivel
                  személyes, kötetlen környezetben.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl text-foreground">Értékes nyeremények</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  3 db AirPods Pro nyeremény sorsolása minden 
                  résztvevő között az esemény végén.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Only shown when event is selected */}
      {selectedConference && (
        <section className="py-16 bg-blue-900 dark:bg-blue-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4 text-white">
            <Users className="w-4 h-4" />
            <span className="text-sm">Limitált helyek - maximum 150 fő</span>
          </div>
          <h2 className="text-3xl lg:text-4xl mb-4 text-white">Csatlakozzon hozzánk!</h2>
          <p className="text-lg mb-8 text-white/90 dark:text-white/80 max-w-2xl mx-auto">
            Ne hagyja ki ezt a különleges lehetőséget! Regisztráljon most az ingyenes "Jövőbe tekintő" eseményre.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
            onClick={() => handleRegister(selectedConference || upcomingConference.id)}
          >
            Regisztrálok a konferenciára
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        </section>
      )}
    </div>
  );
}