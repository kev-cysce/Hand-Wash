import { useState, useEffect } from 'react';
import './WashStation.css';

const WashStation = () => {
  // Objetivos finales: solo pasos 1 y 3 completos, resto entre 30-40%
  const targetProgress = [100, 35, 100, 32, 38, 34];
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
    const duration = 120000; // 2 minutos en milisegundos
    const updateInterval = 100; // Actualizar cada 100ms
    const totalUpdates = duration / updateInterval;

    const intervals = targetProgress.map((target, index) => {
      let current = 0;
      let updateCount = 0;
      const startDelay = Math.random() * 2000; // Delay aleatorio de inicio
      
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          updateCount++;
          
          // Progreso con variación aleatoria para simular movimiento natural
          const progressPerUpdate = target / totalUpdates;
          const randomVariation = (Math.random() - 0.5) * 2; // ±1% de variación
          
          current += progressPerUpdate + randomVariation;
          
          // Limitar al objetivo
          if (current >= target || updateCount >= totalUpdates) {
            current = target;
            clearInterval(interval);
          }
          
          // No permitir valores negativos
          current = Math.max(0, current);
          
          setCurrentProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = Math.round(current);
            return newProgress;
          });
        }, updateInterval);
        
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
      {/* Logo en esquina superior izquierda - 40% más pequeño */}
      <div className="logo-corner">
        <img src={`${import.meta.env.BASE_URL}images/Logo.jpeg`} alt="CYSCE Logo" className="logo-image" />
      </div>

      {/* Video en esquina superior derecha - 25% más grande */}
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
