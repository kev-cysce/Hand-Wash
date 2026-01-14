import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { 
      label: 'Lavados Hoy', 
      value: '247', 
      change: '+12%', 
      trend: 'up',
      icon: '🖐️',
      color: '#00bfa5'
    },
    { 
      label: 'Lavados Correctos', 
      value: '231', 
      change: '+8%', 
      trend: 'up',
      icon: '✓',
      color: '#4caf50'
    },
    { 
      label: 'Tiempo Promedio', 
      value: '28s', 
      change: '-2s', 
      trend: 'up',
      icon: '⏱️',
      color: '#00bfa5'
    },
    { 
      label: 'Tasa de Éxito', 
      value: '93.5%', 
      change: '+2.1%', 
      trend: 'up',
      icon: '📊',
      color: '#4caf50'
    }
  ];

  const qualityMetrics = [
    { type: 'Lavado No Válido', count: 8, percentage: 3.2, color: '#ef4444', icon: '❌' },
    { type: 'Fuera de Cuadro', count: 5, percentage: 2.0, color: '#ff9800', icon: '📦' },
    { type: 'Objeto Inusual', count: 2, percentage: 0.8, color: '#ff9800', icon: '⚠️' },
    { type: 'Invasión del Espacio', count: 1, percentage: 0.4, color: '#ff9800', icon: '🚫' },
    { type: 'Técnica Incompleta', count: 6, percentage: 2.4, color: '#ef4444', icon: '⏱️' },
    { type: 'Sin Detección', count: 3, percentage: 1.2, color: '#8b9cb0', icon: '🔍' }
  ];

  const recentWashes = [
    { id: '#L-1847', area: 'UCI', compliance: 98, time: '26s', timestamp: '10:45', status: 'success' },
    { id: '#L-1846', area: 'Urgencias', compliance: 92, time: '31s', timestamp: '10:42', status: 'success' },
    { id: '#L-1845', area: 'Quirófano', compliance: 100, time: '25s', timestamp: '10:38', status: 'success' },
    { id: '#L-1844', area: 'Pediatría', compliance: 45, time: '15s', timestamp: '10:35', status: 'invalid' },
    { id: '#L-1843', area: 'UCI', compliance: 96, time: '27s', timestamp: '10:30', status: 'success' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard de Reportes</h1>
          <p className="dashboard-subtitle">Análisis de cumplimiento y métricas de calidad</p>
        </div>
        <div className="dashboard-actions">
          <button className="action-btn secondary">
            <span>📅</span>
            <span>Filtrar por fecha</span>
          </button>
          <button className="action-btn primary">
            <span>📊</span>
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-trend ${stat.trend}`}>{stat.change}</span>
            </div>
            <div className="stat-body">
              <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
              <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}10` }}>
                <span className="stat-icon" style={{ color: stat.color }}>{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="quality-section">
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Alertas de Calidad</h3>
              <button className="view-all-btn">Ver todo →</button>
            </div>
            <div className="quality-metrics">
              {qualityMetrics.map((metric, index) => (
                <div key={index} className="quality-metric-item">
                  <div className="metric-left">
                    <div className="metric-icon-wrapper" style={{ 
                      backgroundColor: `${metric.color}10`,
                      borderColor: `${metric.color}30`
                    }}>
                      <span className="metric-icon">{metric.icon}</span>
                    </div>
                    <div className="metric-info">
                      <div className="metric-type">{metric.type}</div>
                      <div className="metric-stats">
                        <span className="metric-count">{metric.count} eventos</span>
                      </div>
                    </div>
                  </div>
                  <div className="metric-right">
                    <span className="metric-percentage" style={{ color: metric.color }}>
                      {metric.percentage}%
                    </span>
                    <div className="metric-bar-container">
                      <div 
                        className="metric-bar-fill" 
                        style={{ 
                          width: `${Math.min(metric.percentage * 10, 100)}%`,
                          backgroundColor: metric.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-section">
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Últimos Lavados</h3>
              <button className="view-all-btn">Ver todo →</button>
            </div>
            <div className="recent-table">
              <div className="table-header">
                <div className="th">ID</div>
                <div className="th">Área</div>
                <div className="th">Cumplimiento</div>
                <div className="th">Tiempo</div>
                <div className="th">Hora</div>
              </div>
              <div className="table-body">
                {recentWashes.map((wash, index) => (
                  <div key={index} className="table-row">
                    <div className="td">
                      <span className="wash-id">{wash.id}</span>
                    </div>
                    <div className="td">
                      <span className="area-text">{wash.area}</span>
                    </div>
                    <div className="td">
                      <span className={`compliance-badge ${
                        wash.status === 'invalid' ? 'invalid' :
                        wash.compliance >= 95 ? 'high' : 
                        wash.compliance >= 85 ? 'medium' : 'low'
                      }`}>
                        {wash.compliance}%
                      </span>
                    </div>
                    <div className="td">
                      <span className="time-value">{wash.time}</span>
                    </div>
                    <div className="td">
                      <span className="timestamp">{wash.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section-full">
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tasa de Cumplimiento - Tendencia Semanal</h3>
            <div className="chart-controls">
              <button className="chart-btn active">7 días</button>
              <button className="chart-btn">30 días</button>
              <button className="chart-btn">90 días</button>
            </div>
          </div>
          <div className="chart-area">
            <div className="chart-placeholder">
              <div className="chart-placeholder-content">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" strokeWidth="2">
                  <path d="M3 3v18h18"></path>
                  <polyline points="7 10 12 5 17 9 21 5"></polyline>
                </svg>
                <p className="chart-text">Gráfico de líneas - Cumplimiento por hora</p>
                <p className="chart-subtext">Los datos se actualizarán automáticamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
