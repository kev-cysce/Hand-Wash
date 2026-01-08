import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { label: 'Lavados Hoy', value: '247', change: '+12%', trend: 'up' },
    { label: 'Lavados Correctos', value: '231', change: '+8%', trend: 'up' },
    { label: 'Tiempo Promedio', value: '28s', change: '-2s', trend: 'up' },
    { label: 'Tasa de Éxito', value: '93.5%', change: '+2.1%', trend: 'up' }
  ];

  const qualityMetrics = [
    { type: 'Lavado No Válido', count: 8, percentage: 3.2, color: '#ef4444', icon: '❌' },
    { type: 'Fuera de Cuadro', count: 5, percentage: 2.0, color: '#f59e0b', icon: '📦' },
    { type: 'Objeto Inusual', count: 2, percentage: 0.8, color: '#f59e0b', icon: '⚠️' },
    { type: 'Invasión del Espacio', count: 1, percentage: 0.4, color: '#f59e0b', icon: '🚫' },
    { type: 'Técnica Incompleta', count: 6, percentage: 2.4, color: '#ef4444', icon: '⏱️' },
    { type: 'Sin Detección', count: 3, percentage: 1.2, color: '#6b7280', icon: '🔍' }
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
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-trend ${stat.trend}`}>{stat.change}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="quality-section">
          <div className="section-card">
            <h3 className="section-title">Alertas de Calidad</h3>
            <div className="quality-metrics">
              {qualityMetrics.map((metric, index) => (
                <div key={index} className="quality-metric-item">
                  <div className="metric-icon-wrapper" style={{ backgroundColor: `${metric.color}20` }}>
                    <span className="metric-icon">{metric.icon}</span>
                  </div>
                  <div className="metric-info">
                    <div className="metric-type">{metric.type}</div>
                    <div className="metric-stats">
                      <span className="metric-count">{metric.count} eventos</span>
                      <span className="metric-percentage" style={{ color: metric.color }}>
                        {metric.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="metric-bar-container">
                    <div 
                      className="metric-bar-fill" 
                      style={{ 
                        width: `${metric.percentage * 10}%`,
                        backgroundColor: metric.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-section">
          <div className="section-card">
            <h3 className="section-title">Últimos Lavados</h3>
            <div className="recent-table">
              <div className="table-header">
                <div className="table-cell">ID</div>
                <div className="table-cell">Área</div>
                <div className="table-cell">Cumplimiento</div>
                <div className="table-cell">Tiempo</div>
                <div className="table-cell">Hora</div>
              </div>
              {recentWashes.map((wash, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">
                    <span className="wash-id">{wash.id}</span>
                  </div>
                  <div className="table-cell">{wash.area}</div>
                  <div className="table-cell">
                    <span className={`compliance-badge ${
                      wash.status === 'invalid' ? 'invalid' :
                      wash.compliance >= 95 ? 'high' : 
                      wash.compliance >= 85 ? 'medium' : 'low'
                    }`}>
                      {wash.compliance}%
                    </span>
                  </div>
                  <div className="table-cell">{wash.time}</div>
                  <div className="table-cell">{wash.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section-full">
        <div className="section-card">
          <h3 className="section-title">Cumplimiento por Hora</h3>
          <div className="chart-placeholder">
            <span className="chart-icon">📊</span>
            <p>Gráfico de cumplimiento horario</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
