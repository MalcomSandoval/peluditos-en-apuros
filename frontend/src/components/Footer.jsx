import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white mt-auto py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Heart color="var(--color-secondary)" fill="var(--color-secondary)" />
              Peluditos en Apuros
            </h3>
            <p className="opacity-80 text-sm">
              Nuestra misión es rescatar, rehabilitar y encontrar el mejor hogar para animales en situación de calle.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <ul className="flex flex-col gap-3 text-sm opacity-80">
              <li className="flex items-center gap-2"><MapPin size={16} /> Calle Corazón 123, Bogotá</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +57 300 123 4567</li>
              <li className="flex items-center gap-2"><Mail size={16} /> contacto@peluditosenapuros.org</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Horarios</h4>
            <ul className="flex flex-col gap-3 text-sm opacity-80">
              <li>Lunes - Viernes: 9:00 AM - 6:00 PM</li>
              <li>Sábados: 10:00 AM - 4:00 PM</li>
              <li>Domingos: Cerrado (Solo urgencias)</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} Fundación Peluditos en Apuros. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
