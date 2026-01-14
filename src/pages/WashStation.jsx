import { useState } from 'react';
import './WashStation.css';

const WashStation = () => {
  const washSteps = [
    { id: 1, name: 'Palma con palma', progress: 100, icon: '🤲' },
    { id: 2, name: 'Palma sobre dorsos', progress: 100, icon: '✋' },
    { id: 3, name: 'Palma entrelazados', progress: 65, icon: '🙏' },
    { id: 4, name: 'Manos a dedos', progress: 20, icon: '👐' },
    { id: 5, name: 'Rotación pulgar', progress: 10, icon: '👍' },
    { id: 6, name: 'Yemas con palma', progress: 0, icon: '☝️' }
  ];

  return (
    <div className="wash-station-new">
      {/* Video pequeño en esquina superior derecha */}
      <div className="video-corner">
        <div className="video-mini">
          <div className="video-mini-content">
            <span className="video-mini-icon">📹</span>
          </div>
          <div className="video-mini-info">
            <span className="video-time">0:21 / 3:18</span>
          </div>
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
                      strokeDashoffset: `${2 * Math.PI * 70 * (1 - step.progress / 100)}`
                    }}
                  />
                </svg>
                <div className="step-circle-content">
                  <span className="step-icon">{step.icon}</span>
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
