import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import './StepMetrics.css';

// Generar datos por paso con promedio y desviación estándar
const generateStepData = (stepId, days = 30) => {
  const data = [];
  const today = new Date();
  
  // Promedios y desviaciones base por paso
  const stepStats = {
    1: { avg: 95, std: 3.5, name: 'Palma con palma' },
    2: { avg: 72, std: 8.2, name: 'Palma sobre dorsos' },
    3: { avg: 88, std: 5.1, name: 'Palma entrelazados' },
    4: { avg: 65, std: 9.3, name: 'Manos a dedos' },
    5: { avg: 70, std: 7.8, name: 'Rotación pulgar' },
    6: { avg: 68, std: 8.5, name: 'Yemas con palma' }
  };
  
  const stats = stepStats[stepId];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generar cumplimiento con distribución normal
    const randomFactor = (Math.random() - 0.5) * 2; // -1 a 1
    const cumplimiento = Math.max(0, Math.min(100, 
      stats.avg + (randomFactor * stats.std)
    ));
    
    const intentos = Math.floor(Math.random() * 30) + 50; // 50-80 intentos
    const exitosos = Math.floor((cumplimiento / 100) * intentos);
    
    data.push({
      fecha: date.toISOString().split('T')[0],
      fechaLabel: `${date.getDate()}/${date.getMonth() + 1}`,
      cumplimiento: parseFloat(cumplimiento.toFixed(1)),
      intentos,
      exitosos,
      promedio: stats.avg,
      desviacionSup: stats.avg + stats.std,
      desviacionInf: stats.avg - stats.std
    });
  }
  
  return { data, stats };
};

const StepMetrics = () => {
  const [selectedStep, setSelectedStep] = useState(1);
  const [dateRange, setDateRange] = useState('30');
  
  const steps = [
    { id: 1, name: 'Palma con palma', icon: '🤝', image: '/Hand-Wash/images/pasos/Paso 1.png' },
    { id: 2, name: 'Palma sobre dorsos', icon: '✋', image: '/Hand-Wash/images/pasos/Paso 2.png' },
    { id: 3, name: 'Palma entrelazados', icon: '🙏', image: '/Hand-Wash/images/pasos/Paso 3.png' },
    { id: 4, name: 'Manos a dedos', icon: '👌', image: '/Hand-Wash/images/pasos/Paso 4.png' },
    { id: 5, name: 'Rotación pulgar', icon: '👍', image: '/Hand-Wash/images/pasos/Paso 5.png' },
    { id: 6, name: 'Yemas con palma', icon: '☝️', image: '/Hand-Wash/images/pasos/Paso 6.png' }
  ];
  
  const { data, stats } = useMemo(() => 
    generateStepData(selectedStep, parseInt(dateRange)), 
    [selectedStep, dateRange]
  );
  
  // Calcular estadísticas del período
  const periodStats = useMemo(() => {
    const totalIntentos = data.reduce((sum, item) => sum + item.intentos, 0);
    const totalExitosos = data.reduce((sum, item) => sum + item.exitosos, 0);
    const cumplimientos = data.map(item => item.cumplimiento);
    
    const promedio = cumplimientos.reduce((a, b) => a + b, 0) / cumplimientos.length;
    const varianza = cumplimientos.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / cumplimientos.length;
    const desviacion = Math.sqrt(varianza);
    
    return {
      intentos: totalIntentos,
      exitosos: totalExitosos,
      tasa: ((totalExitosos / totalIntentos) * 100).toFixed(1),
      promedio: promedio.toFixed(1),
      desviacion: desviacion.toFixed(1)
    };
  }, [data]);

  return (
    <div className="step-metrics">
      {/* Header */}
      <div className="metrics-header">
        <div>
          <h1 className="metrics-title">Métricas por Paso</h1>
          <p className="metrics-subtitle">Análisis individual de cada técnica de lavado</p>
        </div>
        
        <div className="chart-controls">
          <button 
            className={`chart-btn ${dateRange === '7' ? 'active' : ''}`}
            onClick={() => setDateRange('7')}
          >
            7 días
          </button>
          <button 
            className={`chart-btn ${dateRange === '30' ? 'active' : ''}`}
            onClick={() => setDateRange('30')}
          >
            30 días
          </button>
          <button 
            className={`chart-btn ${dateRange === '90' ? 'active' : ''}`}
            onClick={() => setDateRange('90')}
          >
            90 días
          </button>
        </div>
      </div>

      {/* Selector de pasos */}
      <div className="steps-selector">
        {steps.map(step => (
          <div
            key={step.id}
            className={`step-card ${selectedStep === step.id ? 'active' : ''}`}
            onClick={() => setSelectedStep(step.id)}
          >
            <img src={step.image} alt={step.name} className="step-card-image" />
            <div className="step-card-info">
              <span className="step-card-number">Paso {step.id}</span>
              <span className="step-card-name">{step.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Cards del paso seleccionado */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Intentos Totales</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{periodStats.intentos}</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(0, 191, 165, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-primary)' }}>🎯</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Exitosos</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{periodStats.exitosos}</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-success)' }}>✓</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tasa de Éxito</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{periodStats.tasa}%</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-success)' }}>📊</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Promedio ± DE</span>
          </div>
          <div className="stat-body">
            <span className="stat-value" style={{ fontSize: '28px' }}>
              {periodStats.promedio}% ± {periodStats.desviacion}%
            </span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-warning)' }}>📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-container">
        {/* Gráfico de líneas con promedio y desviación estándar */}
        <div className="section-card chart-section-full">
          <div className="section-header">
            <h3 className="section-title">
              Tendencia de Cumplimiento - {steps.find(s => s.id === selectedStep).name}
            </h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis 
                  dataKey="fechaLabel" 
                  stroke="#5a6c7d"
                  interval={Math.floor(data.length / 10)}
                />
                <YAxis stroke="#5a6c7d" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {/* Línea de promedio */}
                <ReferenceLine 
                  y={stats.avg} 
                  stroke="#00bfa5" 
                  strokeDasharray="5 5"
                  label={{ value: `Promedio: ${stats.avg}%`, position: 'right', fill: '#00bfa5' }}
                />
                
                {/* Línea de desviación superior */}
                <ReferenceLine 
                  y={stats.avg + stats.std} 
                  stroke="#ff9800" 
                  strokeDasharray="3 3"
                  label={{ value: `+1σ: ${(stats.avg + stats.std).toFixed(1)}%`, position: 'right', fill: '#ff9800' }}
                />
                
                {/* Línea de desviación inferior */}
                <ReferenceLine 
                  y={stats.avg - stats.std} 
                  stroke="#ff9800" 
                  strokeDasharray="3 3"
                  label={{ value: `-1σ: ${(stats.avg - stats.std).toFixed(1)}%`, position: 'right', fill: '#ff9800' }}
                />
                
                {/* Datos reales */}
                <Line 
                  type="monotone" 
                  dataKey="cumplimiento" 
                  stroke="#4caf50" 
                  strokeWidth={2}
                  name="Cumplimiento Real (%)"
                  dot={{ fill: '#4caf50', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de barras - Comparación de intentos vs exitosos */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Intentos vs Exitosos</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis dataKey="fechaLabel" stroke="#5a6c7d" />
                <YAxis stroke="#5a6c7d" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="intentos" fill="#00bfa5" radius={[8, 8, 0, 0]} name="Intentos" />
                <Bar dataKey="exitosos" fill="#4caf50" radius={[8, 8, 0, 0]} name="Exitosos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepMetrics;
