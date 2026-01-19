import { useState, useEffect } from 'react';
import './WashStation.css';

const WashStation = () => {
  const targetProgress = [100, 100, 65, 20, 10, 0];
  const [currentProgress, setCurrentProgress] = useState([0, 0, 0, 0, 0, 0]);

  const washSteps = [
    { id: 1, name: 'Palma con palma', progress: currentProgress[0], image: `${import.meta.env.BASE_URL}images/pasos/Paso 1.png` },
    { id: 2, name: 'Palma sobre dorsos', progress: currentProgress[1], image: `${import.meta.env.BASE_URL}images/pasos/Paso 2.png` },
    { id: 3, name: 'Palma entrelazados', progress: currentProgress[2], image: `${import.meta.env.BASE_URL}images/pasos/Paso 3.png` },
    { id: 4, name: 'Manos a dedos', progress: currentProgress[3], image: `${import.meta.env.BASE_URL}images/pasos/Paso 4.png` },
    { id: 5, name: 'Rotación pulgar', progress: currentProgress[4], image: `${import.meta.env.BASE_URL}images/pasos/Paso 5.png` },
    { id: 6, name: 'Yemas con palma', progress: currentProgress[5], image: `${import.meta.env.BASE_URL}images/pasos/Paso 6.png` }
  ];

  useEffect(() => {
    // Animar cada círculo progresivamente
    const intervals = targetProgress.map((target, index) => {
      let current = 0;
      const startDelay = index * 300;
      
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          current += 2;
          
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          
          setCurrentProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = current;
            return newProgress;
          });
        }, 20);
        
        return interval;
      }, startDelay);
      
      return timeout;
    });

    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, []);

  return (
    <div className="wash-station-new">
      {/* Logo en esquina superior izquierda */}
      <div className="logo-corner">
        <img src={`${import.meta.env.BASE_URL}images/Logo.jpeg`} alt="CYSCE Logo" className="logo-image" />
      </div>

      {/* Video en esquina superior derecha */}
      <div className="video-corner">
        <div className="video-mini">
          <video 
            className="video-player"
            autoPlay 
            loop 
            muted
            playsInline
          >
            <source src={`${import.meta.env.BASE_URL}videos/Video Lavado de manos.mp4`} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      </div>

      {/* Layout de 6 círculos - Minimalista */}
      <div className="circular-layout">
        <div className="title-section">
          <p className="main-subtitle">Supervisión de Lavado - 6 Pasos</p>
        </div>

        <div className="steps-grid">
          {washSteps.map((step, index) => (
            <div 
              key={step.id} 
              className={`step-circle-wrapper ${step.progress === 100 ? 'completed' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="step-circle">
                <svg className="progress-ring" width="160" height="160">
                  <circle
                    className="progress-ring-bg"
                    cx="80"
                    cy="80"
                    r="70"
                  />
                  <circle
                    className={`progress-ring-fill ${step.progress === 100 ? 'completed-ring' : ''}`}
                    cx="80"
                    cy="80"
                    r="70"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 70}`,
                      strokeDashoffset: `${2 * Math.PI * 70 * (1 - step.progress / 100)}`,
                      transition: 'stroke-dashoffset 0.3s ease-out'
                    }}
                  />
                </svg>
                <div className="step-circle-content">
                  <img src={step.image} alt={step.name} className="step-image" />
                  <span className="step-progress">{step.progress}%</span>
                </div>
              </div>
              <div className={`step-label ${step.progress === 100 ? 'completed-label' : ''}`}>
                {step.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WashStation;
