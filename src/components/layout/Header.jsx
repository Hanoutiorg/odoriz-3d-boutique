// src/components/layout/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut, UserCircle } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHideHeader(true); // scrolling down
      } else {
        setHideHeader(false); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { totalItems, toggleCart } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { searchProductsByQuery } = useProducts();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProductsByQuery(searchQuery);
      navigate('/catalogue');
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Pour Homme', path: '/catalogue?category=Pour Homme' },
    { name: 'Pour Femme', path: '/catalogue?category=Pour Femme' },
    { name: 'Niche', path: '/catalogue?category=Niche' },
    { name: 'Catalogue', path: '/catalogue' },
  ];
  
  const getUserInitials = (name) => {
      if (!name) return 'U';
      const nameParts = name.split(' ');
      if (nameParts.length > 1) {
          return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.header
      // Premium glassmorphism effect with advanced animated open/close
      className={`sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-[16px] shadow-xl transition-all duration-700 ${hideHeader ? 'pointer-events-none' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.7)',
        WebkitBackdropFilter: 'blur(14px)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        transition: 'all 0.7s cubic-bezier(.4,2,.3,1)',
      }}
      initial={{
        y: -80,
        opacity: 0,
        scale: 0.96,
        filter: 'blur(8px)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)'
      }}
      animate={hideHeader
        ? {
            y: -64,
            opacity: 0,
            scale: 0.96,
            filter: 'blur(12px)',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)'
          }
        : {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)'
          }
      }
      transition={{
        y: { type: 'spring', stiffness: 180, damping: 22, mass: 0.8 },
        opacity: { duration: 0.45, ease: [0.4, 0.8, 0.3, 1] },
        scale: { type: 'spring', stiffness: 180, damping: 22, mass: 0.8 },
        filter: { duration: 0.5, ease: [0.4, 0.8, 0.3, 1] },
        boxShadow: { duration: 0.5, ease: [0.4, 0.8, 0.3, 1] },
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div className="text-2xl font-playfair font-bold text-gradient" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              Odoriz
            </motion.div>
            <span className="text-sm text-muted-foreground hidden sm:block">Parfums</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.name} to={item.path} className="text-foreground hover:text-accent transition-colors duration-300 font-medium">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input type="text" placeholder="Rechercher un parfum..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-full border-border focus:border-accent"/>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto px-4 space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                       <p className="text-sm font-medium">{user?.name}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profil">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Mon Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Administration</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Connexion</span>
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="sm" className="relative flex items-center space-x-2" onClick={toggleCart}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">{totalItems}</Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative" onClick={toggleCart}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (<Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">{totalItems}</Badge>)}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <Input type="text" placeholder="Rechercher un parfum..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-full"/>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden mt-4 pb-4 border-t border-border pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link key={item.name} to={item.path} className="text-foreground hover:text-accent transition-colors duration-300 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-border pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link to="/profil" className="text-foreground hover:text-accent transition-colors duration-300 font-medium py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <UserCircle className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin" className="text-foreground hover:text-accent transition-colors duration-300 font-medium py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Administration
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Connexion / Inscription
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;