import React from 'react';
import { WrenchScrewdriverIcon, LightBulbIcon, PaintBrushIcon, HomeIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';


const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Sección de héroe */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold max-w-4xl mx-auto">
            ¡Conecta con los mejores contratistas en cualquier oficio!
          </h1>
          <p className="text-xl mt-4 max-w-2xl mx-auto">
            Soluciones rápidas y profesionales para todos tus problemas: mecánica, albañilería, mantenimiento del hogar y más.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a
              href="/register"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-yellow-300 transition duration-300"
            >
              Regístrate ahora
            </a>
            <a
              href="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-gray-200 transition duration-300"
            >
              Inicia sesión
            </a>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Servicios destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: WrenchScrewdriverIcon, title: 'Plomería', color: 'text-blue-500' },
              { Icon: LightBulbIcon, title: 'Electricidad', color: 'text-yellow-500' },
              { Icon: Cog6ToothIcon, title: 'Mecánica', color: 'text-purple-500' },
              { Icon: HomeIcon, title: 'Albañilería', color: 'text-green-500' },
              { Icon: UserGroupIcon, title: 'Reparaciones generales', color: 'text-indigo-500' },
              { Icon: PaintBrushIcon, title: 'Pintura', color: 'text-pink-500' },
            ].map(({ Icon, title, color }, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                <Icon className={`h-12 w-12 mx-auto ${color} mb-4`} />
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p>Descripción breve del servicio {title.toLowerCase()}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">¿Por qué elegir ManitasFix?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Profesionales certificados</h3>
              <p>Trabajamos solo con expertos verificados para garantizar calidad.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Rápido y seguro</h3>
              <p>Encuentra soluciones en minutos con total confianza.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Precios accesibles</h3>
              <p>Obtén servicios de calidad sin gastar de más.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de estadísticas */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Nuestras estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: '5,000+', desc: 'Clientes satisfechos', color: 'text-blue-600' },
              { stat: '10,000+', desc: 'Servicios realizados', color: 'text-purple-600' },
              { stat: '1,500+', desc: 'Contratistas disponibles', color: 'text-indigo-600' },
            ].map(({ stat, desc, color }, index) => (
              <div
                key={index}
                className="text-center transform transition duration-300 hover:scale-110"
              >
                <h3 className={`text-4xl font-extrabold ${color}`}>{stat}</h3>
                <p className="mt-2 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de preguntas frecuentes */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Preguntas frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: '¿Cómo funciona ManitasFix?',
                answer:
                  'Conéctate con contratistas certificados en minutos. Simplemente selecciona el servicio que necesitas y contacta con el mejor profesional.',
              },
              {
                question: '¿Qué tipos de servicios ofrecen?',
                answer:
                  'Ofrecemos una amplia gama de servicios, incluyendo plomería, electricidad, mecánica, pintura, y mucho más.',
              },
            ].map(({ question, answer }, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold mb-2">{question}</h3>
                <p className="text-gray-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">¡Comienza hoy mismo!</h2>
          <p className="text-lg mb-8">Explora nuestros servicios y encuentra a los mejores contratistas.</p>
          <a
            href="/register"
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-yellow-300 transition duration-300"
          >
            Regístrate ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 ManitasFix. Todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="hover:text-yellow-400">Términos y Condiciones</a>
            <a href="#" className="hover:text-yellow-400">Política de Privacidad</a>
            <a href="#" className="hover:text-yellow-400">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
