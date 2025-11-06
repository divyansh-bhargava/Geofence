import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Create particle background
    createParticles();
    
    // Smooth scroll for anchor links
    const handleSmoothScroll = (e) => {
      const href = e.target.closest('a')?.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setMobileMenuOpen(false);
        }
      }
    };
    
    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  const createParticles = () => {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      container.appendChild(particle);
    }
  };

  return (
    <div className="scroll-smooth">
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .fade-in {
          animation: fadeIn 1s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .feature-card {
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
        }
        
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: particle-float 20s infinite;
        }
        
        @keyframes particle-float {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(100px, -1000px); opacity: 0; }
        }
      `}</style>

      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// Navigation Component
function Navigation({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <i className="fas fa-shield-alt text-white text-xl"></i>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">IoT Security</span>
              <p className="text-xs text-purple-300">Geo-Fencing Platform</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors font-medium">Home</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors font-medium">Contact</a>
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 text-white hover:text-purple-300 transition-colors font-medium">
              Login
            </Link>
            <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="block text-gray-300 hover:text-white transition-colors py-2">Home</a>
            <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">Features</a>
            <a href="#about" className="block text-gray-300 hover:text-white transition-colors py-2">About</a>
            <a href="#contact" className="block text-gray-300 hover:text-white transition-colors py-2">Contact</a>
            <div className="pt-3 space-y-2">
              <Link to="/login" className="block text-center px-4 py-2 border border-purple-500 text-purple-300 rounded-xl">Login</Link>
              <Link to="/register" className="block text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="particles" id="particles"></div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
            <i className="fas fa-shield-alt text-green-400 mr-2"></i>
            <span className="text-white text-sm font-semibold">🔒 Trusted by 10,000+ Users</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Your Personal
            <span className="block gradient-text">IoT Safety Companion</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Advanced geo-fencing technology with AI-powered anomaly detection. 
            Stay safe with real-time alerts and intelligent monitoring.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
              <i className="fas fa-rocket mr-2"></i>
              Get Started Free
            </Link>
            <a href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all">
              <i className="fas fa-play-circle mr-2"></i>
              Learn More
            </a>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "fa-map-marked-alt", color: "purple", label: "Geo-Fencing" },
              { icon: "fa-bell", color: "yellow", label: "Panic Alerts" },
              { icon: "fa-brain", color: "pink", label: "AI Detection" },
              { icon: "fa-users", color: "blue", label: "Contacts" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <i className={`fas ${feature.icon} text-${feature.color}-400 text-3xl mb-2`}></i>
                <p className="text-white font-semibold">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="floating">
          <i className="fas fa-chevron-down text-white text-2xl opacity-50"></i>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: "fa-draw-polygon",
      gradient: "from-purple-500 to-blue-600",
      shadow: "purple",
      hoverBorder: "purple",
      title: "Smart Geo-Fencing",
      description: "Define virtual boundaries and receive instant alerts when entering or leaving designated safe zones.",
      items: ["Real-time location tracking", "Custom radius settings", "Multiple zones support"]
    },
    {
      icon: "fa-exclamation-triangle",
      gradient: "from-yellow-500 to-orange-600",
      shadow: "yellow",
      hoverBorder: "yellow",
      title: "Emergency Alerts",
      description: "One-tap panic button instantly notifies trusted contacts with your exact location in emergencies.",
      items: ["Instant SMS & email alerts", "GPS coordinates sharing", "24/7 emergency response"]
    },
    {
      icon: "fa-brain",
      gradient: "from-pink-500 to-red-600",
      shadow: "pink",
      hoverBorder: "pink",
      title: "AI Anomaly Detection",
      description: "Machine learning algorithms detect unusual patterns and behaviors to predict potential threats.",
      items: ["Behavioral pattern analysis", "Predictive threat detection", "Smart risk assessment"]
    },
    {
      icon: "fa-user-friends",
      gradient: "from-blue-500 to-cyan-600",
      shadow: "blue",
      hoverBorder: "blue",
      title: "Trusted Contacts",
      description: "Manage emergency contacts who will be notified instantly during critical situations.",
      items: ["Unlimited contact storage", "Multi-channel notifications", "Contact priority levels"]
    },
    {
      icon: "fa-chart-line",
      gradient: "from-green-500 to-emerald-600",
      shadow: "green",
      hoverBorder: "green",
      title: "Live Dashboard",
      description: "Monitor real-time data, location history, and security status from an intuitive dashboard.",
      items: ["Interactive map view", "Activity timeline", "Analytics & insights"]
    },
    {
      icon: "fa-cloud",
      gradient: "from-indigo-500 to-purple-600",
      shadow: "indigo",
      hoverBorder: "indigo",
      title: "Weather Integration",
      description: "Geofencing with weather condition monitoring for enhanced safety awareness.",
      items: ["Real-time weather data", "Temperature tracking", "Weather-based alerts"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Powerful Features for
            <span className="gradient-text"> Complete Safety</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to stay safe and connected, powered by cutting-edge IoT technology
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-${feature.hoverBorder}-400/50 hover:shadow-xl hover:shadow-${feature.shadow}-500/20`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shadow-${feature.shadow}-500/50`}>
                <i className={`fas ${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                {feature.items.map((item, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Section Component
function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Enterprise-Grade
              <span className="gradient-text block">Security You Can Trust</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Built with privacy and security at its core. Your data is encrypted end-to-end and never shared with third parties.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: "fa-lock", color: "green", title: "256-bit SSL Encryption", desc: "Military-grade encryption protects all your data" },
                { icon: "fa-shield-alt", color: "blue", title: "GDPR Compliant", desc: "Full compliance with international data protection regulations" },
                { icon: "fa-cloud", color: "purple", title: "Cloud Backup", desc: "Automatic backups ensure your data is never lost" }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${item.icon} text-${item.color}-400 text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" },
              { value: "50K+", label: "Alerts Sent" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl font-black text-white mb-2">{stat.value}</div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Stay Safe?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who trust IoT Security for their safety
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              <i className="fas fa-rocket mr-2"></i>
              Start Free Trial
            </Link>
            <a href="#contact" className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all">
              <i className="fas fa-envelope mr-2"></i>
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-white">IoT Security</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted companion for personal safety and security. Advanced geo-fencing and AI-powered protection.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'linkedin', 'github', 'facebook'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Features', 'About', 'Dashboard'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2025 IoT Geo-Fencing Security. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <i className="fas fa-shield-alt text-green-400"></i>
            <span className="text-gray-400 text-sm">Secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingPage;
