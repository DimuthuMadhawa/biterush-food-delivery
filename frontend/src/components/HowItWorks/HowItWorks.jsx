import React, { useState, useEffect, useRef } from 'react';

// Generate random positions for particles
const particles = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 15}s`,
  animationDuration: `${10 + Math.random() * 10}s`,
}));

const steps = [
  {
    icon: '📱',
    title: 'Select Dish',
    desc: 'Choose from our wide selection of 32 gourmet meals and desserts.',
    detail: 'Filter by cuisine, dietary preference, or mood. Real-time availability shown.',
  },
  {
    icon: '👨‍🍳',
    title: 'Master Chef Preparation',
    desc: 'Our chefs prepare your order with fresh ingredients and utmost care.',
    detail: 'Every meal is cooked fresh to order. No pre-made batches. Track it live from kitchen to door.',
  },
  {
    icon: '🚚',
    title: 'Express Fast Delivery',
    desc: 'A rider delivers your food in an average of 20 minutes, piping hot and fresh.',
    detail: 'GPS-tracked riders. Insulated bags. Real-time ETA. Arrives exactly as it left the kitchen.',
  }
];

const stats = [
  { icon: '🍽️', value: '32+', label: 'Gourmet Meals', subtext: 'Always fresh, never frozen' },
  { icon: '⏱️', value: '20 min', label: 'Avg Delivery', subtext: 'From kitchen to your door' },
  { icon: '⭐', value: '4.9', label: 'Customer Rating', subtext: 'Loved by 50,000+ people' },
  { icon: '🌍', value: '15', label: 'Cities', subtext: 'And expanding fast' },
];

const HowItWorks = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@800&display=swap');

    .hiw-section {
      background-color: var(--hiw-bg);
      color: var(--text-color);
      font-family: 'DM Sans', sans-serif;
      padding: 80px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hiw-bg-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1000px;
      height: 1000px;
      background: radial-gradient(circle, rgba(255,107,26,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .hiw-particle {
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: #FF6B1A;
      border-radius: 50%;
      opacity: 0.3;
      animation: floatUp 15s infinite linear;
      z-index: 0;
    }

    .hiw-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      transform: translateY(40px);
    }

    .hiw-content.visible {
      animation: fadeSlideUp 0.8s forwards ease-out;
    }

    .hiw-label {
      color: #FF6B1A;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }

    .hiw-heading {
      font-family: 'Syne', sans-serif;
      font-size: 48px;
      font-weight: 800;
      margin: 0 0 16px 0;
      text-align: center;
    }

    .hiw-subtitle {
      color: var(--hiw-text-muted);
      font-size: 18px;
      margin: 0 0 64px 0;
      text-align: center;
    }

    .hiw-steps-container {
      display: flex;
      gap: 32px;
      position: relative;
      margin-bottom: 80px;
      width: 100%;
    }

    .hiw-connector {
      position: absolute;
      top: 50px;
      left: 15%;
      right: 15%;
      height: 2px;
      background-image: var(--hiw-connector);
      background-size: 12px 2px;
      background-repeat: repeat-x;
      z-index: 0;
    }

    .hiw-travel-dot {
      position: absolute;
      top: -4px;
      left: 0;
      width: 10px;
      height: 10px;
      background-color: #FF6B1A;
      border-radius: 50%;
      box-shadow: 0 0 10px #FF6B1A;
      animation: dotTravel 4s infinite linear;
    }

    .hiw-card {
      background-color: var(--hiw-card-bg);
      border: 1px solid var(--hiw-card-border);
      border-radius: 16px;
      padding: 40px 32px;
      flex: 1;
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
      overflow: hidden;
      z-index: 1;
    }

    .hiw-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .hiw-card-border {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 4px;
      height: 100%;
      background-color: #FF6B1A;
      transform: scaleY(0);
      transform-origin: bottom;
      transition: transform 0.4s ease;
    }

    .hiw-card:hover .hiw-card-border {
      transform: scaleY(1);
    }

    .hiw-watermark {
      position: absolute;
      top: -10px;
      right: 10px;
      font-family: 'Syne', sans-serif;
      font-size: 120px;
      font-weight: 800;
      color: rgba(255, 107, 26, 0.05);
      line-height: 1;
      pointer-events: none;
    }

    .hiw-icon {
      font-size: 40px;
      margin-bottom: 24px;
      display: inline-block;
      animation: iconFloat 3s infinite ease-in-out;
    }

    .hiw-card:nth-child(1) .hiw-icon { animation-delay: 0s; }
    .hiw-card:nth-child(2) .hiw-icon { animation-delay: 1s; }
    .hiw-card:nth-child(3) .hiw-icon { animation-delay: 2s; }

    .hiw-card-title {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 12px 0;
    }

    .hiw-card-desc {
      color: var(--hiw-text-muted);
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }

    .hiw-card-detail-panel {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease;
    }

    .hiw-card:hover .hiw-card-detail-panel {
      max-height: 150px;
      opacity: 1;
      margin-top: 20px;
    }

    .hiw-detail-text {
      color: #FF6B1A;
      font-size: 14px;
      line-height: 1.5;
      padding-top: 16px;
      border-top: 1px dashed var(--hiw-card-border);
    }

    .hiw-stats-strip {
      display: flex;
      width: 100%;
      gap: 20px;
      margin-bottom: 64px;
    }

    .hiw-stat-card {
      background-color: var(--hiw-card-bg);
      border: 1px solid var(--hiw-card-border);
      border-radius: 12px;
      padding: 24px;
      flex: 1;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .hiw-stat-card:hover {
      transform: translateY(-4px);
    }

    .hiw-stat-value {
      font-family: 'Syne', sans-serif;
      font-size: 36px;
      font-weight: 800;
      color: #FF6B1A;
      margin-bottom: 8px;
    }
    
    .hiw-stat-icon {
      font-size: 24px;
      margin-right: 8px;
      vertical-align: middle;
    }

    .hiw-stat-label {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 4px;
    }

    .hiw-stat-subtext {
      font-size: 13px;
      color: var(--hiw-text-muted);
    }

    .hiw-cta {
      background-color: #FF6B1A;
      color: #ffffff;
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      font-weight: 700;
      padding: 16px 40px;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: background-color 0.3s ease;
      animation: pulse 2s infinite;
    }

    .hiw-cta:hover {
      background-color: #e55a12;
      animation: none;
      box-shadow: 0 0 20px rgba(255, 107, 26, 0.4);
    }

    @keyframes floatUp {
      0% {
        transform: translateY(100vh) scale(0.8);
        opacity: 0;
      }
      20% {
        opacity: 0.3;
      }
      80% {
        opacity: 0.3;
      }
      100% {
        transform: translateY(-20vh) scale(1.2);
        opacity: 0;
      }
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes fadeSlideUp {
      0% {
        opacity: 0;
        transform: translateY(40px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes dotTravel {
      0% { left: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 107, 26, 0.6); }
      70% { box-shadow: 0 0 0 15px rgba(255, 107, 26, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 107, 26, 0); }
    }

    @media (max-width: 900px) {
      .hiw-steps-container {
        flex-direction: column;
      }
      .hiw-connector {
        display: none;
      }
      .hiw-stats-strip {
        flex-wrap: wrap;
      }
      .hiw-stat-card {
        flex: 1 1 40%;
      }
    }
    
    @media (max-width: 600px) {
      .hiw-stat-card {
        flex: 1 1 100%;
      }
    }
  `;

  return (
    <section className="hiw-section" ref={sectionRef} id="how-it-works">
      <style>{styles}</style>

      <div className="hiw-bg-glow"></div>

      {particles.map(p => (
        <div
          key={p.id}
          className="hiw-particle"
          style={{
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration
          }}
        />
      ))}

      <div className={`hiw-content container ${isVisible ? 'visible' : ''}`}>
        <div className="hiw-label">PROCESS</div>
        <h2 className="hiw-heading">How It Works</h2>
        <p className="hiw-subtitle">Your cravings fulfilled in three simple, delicious steps.</p>

        <div className="hiw-steps-container">
          <div className="hiw-connector">
            <div className="hiw-travel-dot"></div>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`hiw-card ${hoveredCard === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="hiw-card-border"></div>
              <div className="hiw-watermark">0{index + 1}</div>
              <div className="hiw-icon">{step.icon}</div>
              <h3 className="hiw-card-title">{step.title}</h3>
              <p className="hiw-card-desc">{step.desc}</p>

              <div className="hiw-card-detail-panel">
                <div className="hiw-detail-text">
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-stats-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <div className="hiw-label" style={{ marginBottom: '32px' }}>WHY BITERUSH</div>
          <div className="hiw-stats-strip" style={{ marginBottom: 0 }}>
            {stats.map((stat, index) => (
              <div key={index} className="hiw-stat-card">
                <div className="hiw-stat-value">
                  <span className="hiw-stat-icon">{stat.icon}</span>
                  {stat.value}
                </div>
                <div className="hiw-stat-label">{stat.label}</div>
                <div className="hiw-stat-subtext">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="hiw-cta"
          onClick={() => {
            const menuEl = document.getElementById('menu');
            if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Start Your Order <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
