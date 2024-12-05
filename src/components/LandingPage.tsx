import React, { useState } from 'react';
import { Bookmark, Link2, Tag, List, Shield, Github } from 'lucide-react';
import { LoginForm } from './LoginForm';

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            <Bookmark className="text-blue-500" size={48} />
            <h1 className="text-5xl font-bold text-white">Me Link</h1>
          </div>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Organiza y gestiona tus enlaces favoritos en un solo lugar. 
            Con vista previa, etiquetas y búsqueda avanzada.
          </p>
          <div className="mt-10">
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Comenzar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Características principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Link2 className="text-blue-500" size={32} />}
              title="Vista previa de enlaces"
              description="Visualiza el contenido de tus enlaces con miniaturas y descripciones automáticas."
            />
            <FeatureCard
              icon={<Tag className="text-blue-500" size={32} />}
              title="Sistema de etiquetas"
              description="Organiza tus enlaces con etiquetas personalizadas y encuentra rápidamente lo que buscas."
            />
            <FeatureCard
              icon={<List className="text-blue-500" size={32} />}
              title="Filtros avanzados"
              description="Filtra por fecha, título, etiquetas y más. Cambia entre vista de cuadrícula y lista."
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">
                Tus enlaces están seguros
              </h2>
              <p className="text-gray-400">
                Utilizamos la última tecnología en seguridad para proteger tus datos. 
                Cada usuario tiene acceso únicamente a sus propios enlaces.
              </p>
            </div>
            <Shield className="text-blue-500" size={64} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bookmark className="text-blue-500" size={24} />
              <span className="text-white font-semibold">Me Link</span>
            </div>
            <a
              href="https://github.com/darwincrack/melink"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
} 