// types
export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  imageUrl: string;
  bio: string;
}

export interface Conference {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: string;
  earlyBirdPrice?: string;
  category: string;
  description: string;
  imageUrl: string;
  speakers: Speaker[];
  agenda: string[];
  capacity: number;
  registered: number;
  highlights: string[];
}

//  figma:asset importok törölve
// import epduferrLogo from "figma:asset/...";
// import conferenceVenueImage from "figma:asset/...";
// import megakranLogo from "figma:asset/...";

//  helyi fájlok a /public/images mappából (nincs import, csak path)
const EPDuFERR_LOGO = "/images/epduferr.png";
const MEGAKRAN_LOGO = "/images/megakran.png";
const VENUE_IMAGE   = "/images/conference-venue.jpg";

export const mockSpeakers: Speaker[] = [
  {
    id: "1",
    name: "Dr. Kovács Péter",
    title: "Vezető elemző",
    company: "Magyar Nemzeti Bank",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "20+ éves tapasztalat a monetáris politika területén",
  },
  {
    id: "2",
    name: "Nagy Katalin",
    title: "CEO",
    company: "FinTech Hungary",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b332c5ab?w=300&h=300&fit=crop&crop=face",
    bio: "A magyar fintech szektor egyik vezető alakja",
  },
  {
    id: "3",
    name: "Szabó András",
    title: "Portfolio Manager",
    company: "OTP Asset Management",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "ESG befektetési stratégiák specialistája",
  },
  {
    id: "4",
    name: "Varga Eszter",
    title: "Blockchain Lead",
    company: "Revolut",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Kriptovaluta és blockchain technológiai szakértő",
  },
  {
    id: "5",
    name: "Épduferr Szakértői Csapat",
    title: "Vezető előadók",
    company: "Épduferr Nyrt.",
    imageUrl: EPDuFERR_LOGO,
    bio: "Építőipari és fejlesztési projektek szakértői",
  },
  {
    id: "6",
    name: "Megakrán Előadói",
    title: "Technológiai vezetők",
    company: "Megakrán.HU",
    imageUrl: MEGAKRAN_LOGO,
    bio: "Innovatív technológiai megoldások specialistái",
  },
];

export const mockConferences: Conference[] = [
  {
    id: "1",
    title: "Jövőbe tekintő",
    subtitle: "Innovatív megoldások a pénzügyi szektorban",
    date: "2025. október 16. - Csütörtök",
    time: "17:00 - 19:00",
    location: "Budapest",
    venue: "Kimptom Bem Budapest",
    price: "Ingyenes",
    category: "Szakmai esemény",
    description:
      "Exkluzív networking esemény vezető cégekkel a pénzügyi szektor jövőjéről. Ismerje meg az Épduferr és Megakrán innovatív megközelítését.",
    imageUrl: VENUE_IMAGE,
    speakers: [mockSpeakers[4], mockSpeakers[5]],
    agenda: [
      "17:00 - 17:30 - Regisztráció és érkezés",
      "17:30 - 18:10 - Épduferr előadás",
      "18:10 - 18:50 - Megakrán előadás",
      "18:50 - 19:00 - Sorsolás: 3 db AirPods Pro",
      "19:00 - Esemény zárása",
    ],
    capacity: 150,
    registered: 47,
    highlights: [
      "Két vezető cég előadása",
      "AirPods Pro sorsolás (3 db)",
      "Prémium networking lehetőség",
      "Professzionális venue",
    ],
  },
  // … a többi konferencia változatlan …
];

export const getConferenceById = (id: string): Conference | undefined =>
  mockConferences.find((conf) => conf.id === id);