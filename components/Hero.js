"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [rotation, setRotation] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const maxScroll = windowHeight * 0.5;
      const newRotation = Math.max(0, 25 - (scrollPosition / maxScroll) * 25);
      setRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const demoFeatures = [
    "Acesso completo ao sistema",
    "Suporte personalizado",
    "Treinamento da equipe",
    "Migração de dados",
    "Configuração inicial"
  ];

  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      {/* Navbar */}
      <nav className="w-full flex justify-center mt-8">
        <div className="w-[80%] bg-white shadow-lg rounded-full px-4">
          <div className="flex items-center h-20 relative">
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8 ml-4">
              <Link href="#Planos"className="text-gray-700 hover:text-[#009ee3]">
                Planos
              </Link>
              <Link href="/sobre" className="text-gray-700 hover:text-[#009ee3]">
                Sobre nós
              </Link>
              <Link href="#footer" className="text-gray-700 hover:text-[#009ee3]">
                Contato
              </Link>
            </div>

            {/* Logo - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={200}
                  priority
                />
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center ml-auto">
              <a href="https://app.liveplus.pro/login"> 
              <button className="bg-[#009ee3] text-white px-6 py-2 rounded-full hover:bg-sky-600 transition-colors">
                Login
              </button> 
              </a>
            </div> 

            {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-[#009ee3] focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden pb-4 mt-4 bg-white shadow-lg rounded-xl">
              <div className="flex flex-col space-y-4 p-4">
                <Link href="#Planos" className="text-gray-700 hover:text-[#009ee3] text-center">
                  Planos
                </Link>
                <Link href="/sobre" className="text-gray-700 hover:text-[#009ee3] text-center">
                  Sobre Nós
                </Link>
                <Link href="#footer"  className="text-gray-700 hover:text-[#009ee3] text-center">
                  Contato
                </Link>

                <a href="https://app.liveplus.pro/login">
                <button
                  className="bg-[#009ee3] text-white px-6 py-2 rounded-full hover:bg-sky-600 transition-colors text-center">
                  Login
                </button>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col items-center px-4 pt-12 pb-16">
        {/* Grid Animation Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50" style={{ perspective: "200px" }}>
          <div className="absolute inset-0" style={{ transform: "rotateX(65deg)" }}>
            <div 
              className="absolute inset-0 w-[600vw] h-[300vh] -ml-[50%]"
              style={{
                transformOrigin: "100% 0 0",
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.3) 1px, transparent 0),
                  linear-gradient(to bottom, rgba(0,0,0,0.3) 1px, transparent 0)
                `,
                backgroundSize: "60px 60px",
                backgroundRepeat: "repeat",
                animation: "moveGrid 20s linear infinite"
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90%" />
        </div>

        {/* Content */}
        <div className="container mx-auto flex flex-col items-center relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Tecnologia que conecta e transforma a gestão da saúde!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
            A solução completa de gestão  para Clínicas, Hospitais e Profissionais da Saúde independentes, tudo em um único lugar.
            </p>
            <a href="#Planos">
            <button 
              className="bg-[#009ee3] text-white py-3 px-8 rounded-lg text-lg hover:bg-[#008cc7] transition-colors duration-300"
            >
              Experimente Agora
            </button>
            </a>
            
          </div>
          
          {/* Video Section with 3D Effect */}
          <div className="[perspective:2000px] w-full max-w-5xl mx-auto" id='Video-demo'>
            <div 
              className={`relative transition-transform duration-300 ease-out
                ${isVideoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{
                transform: `rotateX(${rotation}deg)`
              }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 z-10">
                <svg 
                  className="absolute left-0 top-0 h-full w-full [&_path]:stroke-white [&_path]:[strokeOpacity:0.2] [&_path]:[stroke-dasharray:1] [&_path]:[stroke-dashoffset:1]" 
                  width="100%" 
                  viewBox="0 0 1499 778" 
                  fill="none"
                >
                  <path pathLength="1" d="M1500 72L220 72"></path>
                  <path pathLength="1" d="M1500 128L220 128"></path>
                  <path pathLength="1" d="M1500 189L220 189"></path>
                  <path pathLength="1" d="M220 777L220 1"></path>
                  <path pathLength="1" d="M538 777L538 128"></path>
                </svg>
              </div>

              {/* Glowing effect */}
              <div className="absolute inset-0 before:absolute before:inset-0 before:bg-hero-glow before:opacity-0 before:[filter:blur(120px)]" />

              {/* Video container */}
              <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onLoadedData={() => setIsVideoLoaded(true)}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/video-demo.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes moveGrid {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .bg-hero-glow {
          background: linear-gradient(
            to bottom right,
            rgba(0, 158, 227, 0.2),
            rgba(0, 158, 227, 0.1)
          );
        }
      `}</style>
    </section>
  );
};

export default Hero;
