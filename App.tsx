
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import type { TravelPackage, User, Booking, AITripPlan } from './types';
import { MOCK_PACKAGES, MOCK_USER, MOCK_BOOKINGS, Icons } from './constants';
import { generateTripPlan } from './services/geminiService';

// THEME MANAGEMENT
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      return storedTheme || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// MOCK API SERVICE
const travelService = {
  getPackages: async (): Promise<TravelPackage[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PACKAGES;
  },
  getPackageById: async (id: string): Promise<TravelPackage | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PACKAGES.find(p => p.id === id);
  },
  getUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_USER;
  },
  getBookings: async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_BOOKINGS;
  },
};


// UI COMPONENTS

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#/", label: "Home" },
    { href: "#/packages", label: "Packages" },
    { href: "#/tracking", label: "Track Vehicle" },
    { href: "#/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-light/80 dark:bg-dark/80 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary dark:text-primary-dark">
          <Icons.Logo className="h-8 w-8" />
          <span>Wanderlust AI</span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-secondary">
            {theme === 'light' ? <Icons.Moon className="h-6 w-6" /> : <Icons.Sun className="h-6 w-6" />}
          </button>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-2">
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-dark-secondary text-gray-400 py-8 mt-16">
    <div className="container mx-auto px-6 text-center">
      <p>&copy; {new Date().getFullYear()} Wanderlust AI. All rights reserved.</p>
      <p className="text-sm mt-2">Your journey, reimagined by AI.</p>
    </div>
  </footer>
);

const PackageCard: React.FC<{ pkg: TravelPackage }> = ({ pkg }) => (
  <div className="bg-white dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col animate-fade-in">
    <img src={pkg.image} alt={pkg.name} className="w-full h-56 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold mb-2 text-dark dark:text-light">{pkg.name}</h3>
        <div className="flex items-center gap-1 text-secondary">
          <Icons.Star className="w-5 h-5" />
          <span className="font-bold">{pkg.rating}</span>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{pkg.description.substring(0, 100)}...</p>
      <div className="flex justify-between items-center mt-auto">
        <div>
          <span className="text-2xl font-bold text-primary dark:text-primary-dark">${pkg.price}</span>
          <span className="text-sm text-gray-500"> / person</span>
        </div>
        <Link to={`/package/${pkg.id}`} className="bg-secondary hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
          Details
        </Link>
      </div>
    </div>
  </div>
);

const AITripPlanner: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [duration, setDuration] = useState(7);
    const [interests, setInterests] = useState('');
    const [plan, setPlan] = useState<AITripPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPlan(null);

        try {
            const result = await generateTripPlan(destination, duration, interests);
            setPlan(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="my-16 container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-2xl">
                <Icons.Sparkles className="mx-auto h-12 w-12 text-secondary animate-pulse-fast"/>
                <h2 className="text-3xl font-bold mb-2">AI Trip Planner</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Let our AI craft your perfect getaway.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Destination (e.g., Paris, France)" value={destination} onChange={(e) => setDestination(e.target.value)} required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-primary focus:outline-none"/>
                    <input type="number" placeholder="Duration (days)" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} min="1" max="30" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-primary focus:outline-none"/>
                    <input type="text" placeholder="Interests (e.g., art, hiking, food)" value={interests} onChange={(e) => setInterests(e.target.value)} required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-primary focus:outline-none"/>
                    <button type="submit" disabled={isLoading} className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2">
                         {isLoading ? 'Generating...' : 'Create My Trip'}
                    </button>
                </form>

                {isLoading && <div className="mt-6 text-primary dark:text-primary-dark">Crafting your adventure...</div>}
                {error && <div className="mt-6 text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-lg">{error}</div>}
                {plan && (
                    <div className="mt-8 text-left animate-fade-in">
                        <h3 className="text-2xl font-bold mb-4">Your Custom Itinerary for {plan.destination}</h3>
                        <div className="space-y-4">
                            {plan.itinerary.map((day) => (
                                <div key={day.day} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-bold text-lg text-primary dark:text-primary-dark">Day {day.day}: {day.title}</h4>
                                    <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                                        {day.activities.map((activity, index) => <li key={index}>{activity}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// PAGES

const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    travelService.getPackages().then(data => setPackages(data.slice(0,3)));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/packages');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center text-white text-center px-4 -mt-16">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <img src="https://picsum.photos/seed/hero/1600/900" alt="Breathtaking landscape" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 animate-slide-in">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">Your Journey Begins Here</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Discover unforgettable travel experiences with Wanderlust AI.</p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white/20 backdrop-blur-md p-4 rounded-full flex gap-2">
            <input type="text" placeholder="Search for destinations or packages..." className="w-full bg-transparent text-white placeholder-gray-200 focus:outline-none px-4"/>
            <button type="submit" className="bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2">
              <Icons.Search className="w-5 h-5"/>
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
      
      {/* Featured Packages */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
         <div className="text-center mt-12">
            <Link to="/packages" className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-colors dark:bg-primary-dark dark:hover:bg-cyan-600">
              View All Packages
            </Link>
          </div>
      </div>
      
      {/* AI Trip Planner Section */}
      <AITripPlanner />
    </div>
  );
};

const PackagesPage: React.FC = () => {
    const [packages, setPackages] = useState<TravelPackage[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        travelService.getPackages().then(data => {
            setPackages(data);
            setFilteredPackages(data);
        });
    }, []);

    useEffect(() => {
        const results = packages.filter(pkg => 
            pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPackages(results);
    }, [searchTerm, packages]);

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center mb-4">Explore Our Packages</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Find the perfect adventure tailored for you.</p>
            <div className="mb-8 max-w-lg mx-auto">
                <input 
                    type="text" 
                    placeholder="Search by name, destination, or tag (e.g., 'adventure')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 rounded-full bg-white dark:bg-dark-secondary shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.length > 0 ? (
                    filteredPackages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)
                ) : (
                    <p className="col-span-full text-center text-lg">No packages found for your search.</p>
                )}
            </div>
        </div>
    );
};

const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<TravelPackage | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      travelService.getPackageById(id).then(setPkg);
    }
  }, [id]);

  if (!pkg) return <div className="text-center py-20">Loading package...</div>;

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-2xl overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2">
            <img src={pkg.image} alt={pkg.name} className="w-full h-64 lg:h-full object-cover" />
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Icons.MapPin className="w-5 h-5"/> {pkg.destination}
                </div>
                <div className="flex items-center gap-1">
                   <Icons.Calendar className="w-5 h-5"/> {pkg.duration} Days
                </div>
              </div>
              <p className="text-lg mb-6">{pkg.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {pkg.tags.map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark px-3 py-1 rounded-full text-sm font-semibold capitalize">{tag}</span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-4xl font-bold text-primary dark:text-primary-dark">${pkg.price} <span className="text-lg font-normal text-gray-500">/ person</span></div>
                <button onClick={() => navigate(`/payment`)} className="bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg">
                    Book Now
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2); // Show processing
        setTimeout(() => setStep(3), 3000); // Show confirmation
        setTimeout(() => navigate('/dashboard'), 6000); // Redirect to dashboard
    };

    return (
        <div className="container mx-auto max-w-md px-6 py-12 text-center animate-fade-in">
            <div className="bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-2xl">
                {step === 1 && (
                    <>
                        <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>
                        <form onSubmit={handlePayment} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                                <input type="text" placeholder="**** **** **** 1234" defaultValue="4242 4242 4242 4242" className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"/>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium">Expiry</label>
                                    <input type="text" placeholder="MM/YY" defaultValue="12/28" className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"/>
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium">CVC</label>
                                    <input type="text" placeholder="123" defaultValue="123" className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"/>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Cardholder Name</label>
                                <input type="text" defaultValue="Alex Wanderer" className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"/>
                            </div>
                            <button type="submit" className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors mt-4">
                                Pay Now
                            </button>
                        </form>
                    </>
                )}
                {step === 2 && (
                    <div className="py-12">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary mx-auto"></div>
                        <h2 className="text-2xl font-semibold mt-6">Processing Payment...</h2>
                    </div>
                )}
                {step === 3 && (
                     <div className="py-12">
                        <svg className="w-24 h-24 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold mt-6 text-green-500">Payment Successful!</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Your booking is confirmed. Redirecting to your dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrackingPage: React.FC = () => {
    const [position, setPosition] = useState({ x: 10, y: 50 });
    const [progress, setProgress] = useState(0);

    const path = [
        { x: 10, y: 50 }, { x: 25, y: 40 }, { x: 40, y: 60 },
        { x: 60, y: 55 }, { x: 75, y: 30 }, { x: 90, y: 45 }
    ];

    const moveVehicle = useCallback(() => {
        setProgress(prev => {
            if (prev >= 100) return 0; // Reset
            const newProgress = prev + 1;
            const pathSegment = Math.floor((newProgress / 100) * (path.length - 1));
            const progressInSegment = ((newProgress / 100) * (path.length - 1)) % 1;
            
            if(path[pathSegment + 1]) {
                const start = path[pathSegment];
                const end = path[pathSegment + 1];
                const newX = start.x + (end.x - start.x) * progressInSegment;
                const newY = start.y + (end.y - start.y) * progressInSegment;
                setPosition({ x: newX, y: newY });
            } else {
                 setPosition(path[path.length - 1]);
            }
            return newProgress;
        });
    }, [path]);

    useEffect(() => {
        const interval = setInterval(moveVehicle, 200);
        return () => clearInterval(interval);
    }, [moveVehicle]);
    
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center mb-8">Live Vehicle Tracking</h1>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-xl shadow-2xl">
                <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border-4 border-gray-300 dark:border-gray-600">
                    {/* Fake Map Background */}
                    <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url(https://i.imgur.com/3Z4wE5Y.png)'}}></div>
                    
                    {/* Path */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <path 
                            d={`M ${path[0].x}% ${path[0].y}% ${path.slice(1).map(p => `L ${p.x}% ${p.y}%`).join(' ')}`}
                            stroke="rgba(0, 119, 182, 0.5)" 
                            strokeWidth="5" 
                            fill="none" 
                            strokeDasharray="10 5"
                        />
                    </svg>
                    
                    {/* Vehicle */}
                    <div className="absolute transition-all duration-200 ease-linear" style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}>
                        <Icons.Car className="w-10 h-10 text-secondary drop-shadow-lg"/>
                    </div>
                </div>
                 <div className="mt-6">
                    <p className="text-lg font-semibold">Trip to: Kyoto's Serene Temples</p>
                    <p className="text-gray-600 dark:text-gray-400">Status: En route to your hotel</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                     <p className="text-right mt-1 text-sm">{progress}% Complete</p>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    
    useEffect(() => {
        travelService.getUser().then(setUser);
        travelService.getBookings().then(setBookings);
    }, []);

    if (!user || !bookings) return <div className="text-center py-20">Loading dashboard...</div>;
    
    const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
    const pastBookings = bookings.filter(b => b.status === 'completed');

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}!</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile & Loyalty */}
                <div className="lg:col-span-1 bg-white dark:bg-dark-secondary p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <div className="mt-6 text-center bg-primary/10 dark:bg-primary-dark/20 p-4 rounded-lg">
                        <p className="text-lg font-semibold">Loyalty Points</p>
                        <p className="text-4xl font-bold text-secondary">{user.loyaltyPoints}</p>
                    </div>
                </div>

                {/* Bookings */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Upcoming Trips</h2>
                        <div className="space-y-4">
                            {upcomingBookings.length > 0 ? upcomingBookings.map(b => (
                                <div key={b.id} className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{b.packageName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Trip Date: {b.tripDate}</p>
                                    </div>
                                    <Link to="/tracking" className="text-sm bg-secondary text-white py-1 px-3 rounded-full">Track Vehicle</Link>
                                </div>
                            )) : <p>No upcoming trips. Time to book a new adventure!</p>}
                        </div>
                    </div>
                     <div>
                        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
                        <div className="space-y-4">
                            {pastBookings.map(b => (
                                <div key={b.id} className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-md opacity-70">
                                    <p className="font-bold">{b.packageName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed on: {b.tripDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// MAIN APP COMPONENT
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/package/:id" element={<PackageDetailPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
