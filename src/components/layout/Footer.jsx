import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Service Client",
      links: [
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Guide des tailles", href: "/guide-tailles" },
        { name: "Livraison et retours", href: "/livraison" },
        { name: "Garantie", href: "/garantie" }
      ]
    },
    {
      title: "À propos d'Odoriz",
      links: [
        { name: "Notre histoire", href: "/notre-histoire" },
        { name: "Nos valeurs", href: "/nos-valeurs" },
        { name: "Carrières", href: "/carrieres" },
        { name: "Presse", href: "/presse" },
        { name: "Partenaires", href: "/partenaires" }
      ]
    },
    {
      title: "Informations légales",
      links: [
        { name: "Conditions générales", href: "/cgv" },
        { name: "Politique de confidentialité", href: "/politique-confidentialite" },
        { name: "Cookies", href: "/cookies" },
        { name: "Mentions légales", href: "/mentions-legales" },
        { name: "Plan du site", href: "/sitemap" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/odoriz" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/odoriz" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/odoriz" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-playfair font-bold text-accent">Odoriz</h2>
              <span className="text-sm">Parfums</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Découvrez l'art de la parfumerie avec notre sélection exclusive de fragrances 
              de luxe. Odoriz vous accompagne dans votre quête du parfum parfait.
            </p>
            
            {/* Informations de contact */}
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <span>contact@odoriz.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>123 Rue de la Paix, 75001 Paris</span>
              </div>
            </div>
          </motion.div>

          {/* Sections de liens */}
          {footerSections.map((section, index) => (
            <motion.div 
              key={section.title}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-playfair font-semibold text-accent">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-primary-foreground/80 hover:text-accent transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div 
          className="mt-12 pt-8 border-t border-primary-foreground/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto text-center space-y-4">
            <h3 className="text-xl font-playfair font-semibold text-accent">
              Newsletter Odoriz
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Recevez en exclusivité nos dernières nouveautés et offres spéciales
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:border-accent"
              />
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors duration-300 font-medium">
                S'abonner
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section bas de page */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-primary-foreground/80 text-sm text-center md:text-left">
              © {currentYear} Odoriz Parfums. Tous droits réservés. 
              <span className="block md:inline md:ml-2">
                Créé avec passion pour les amoureux de parfums.
              </span>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center space-x-4">
              <span className="text-primary-foreground/80 text-sm">Suivez-nous :</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;