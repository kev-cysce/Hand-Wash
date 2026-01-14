import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  // Datos para gráfico de líneas - Cumplimiento por hora
  const complianceData = [
    { hora: '00:00', cumplimiento: 85, promedio: 88 },
    { hora: '04:00', cumplimiento: 78, promedio: 88 },
    { hora: '08:00', cumplimiento: 92, promedio: 88 },
    { hora: '12:00', cumplimiento: 96, promedio: 88 },
    { hora: '16:00', cumplimiento: 94, promedio: 88 },
    { hora: '20:00', cumplimiento: 88, promedio: 88 },
    { hora: '23:59', cumplimiento: 82, promedio: 88 }
  ];

  // Datos para gráfico de barras - Lavados por área
  const areaData = [
    { area: 'UCI', lavados: 89, correctos: 85 },
    { area: 'Urgencias', lavados: 67, correctos: 62 },
    { area: 'Quirófano', lavados: 54, correctos: 53 },
    { area: 'Pediatría', lavados: 43, correctos: 38 },
    { area: 'Internación', lavados: 38, correctos: 35 }
  ];

  // Datos para gráfico circular - Distribución de cumplimiento
  const pieData = [
    { name: 'Excelente (95-100%)', value: 156, color: '#4caf50' },
    { name: 'Bueno (85-94%)', value: 75, color: '#00bfa5' },
    { name: 'Regular (70-84%)', value: 12, color: '#ff9800' },
    { name: 'Deficiente (<70%)', value: 4, color: '#ef4444' }
  ];

  // Datos para área chart - Tendencia semanal
  const weeklyData = [
    { dia: 'Lun', lavados: 198, correctos: 185 },
    { dia: 'Mar', lavados: 215, correctos: 201 },
    { dia: 'Mié', lavados: 234, correctos: 219 },
    { dia: 'Jue', lavados: 228, correctos: 215 },
    { dia: 'Vie', lavados: 247, correctos: 231 },
    { dia: 'Sáb', lavados: 187, correctos: 175 },
    { dia: 'Dom', lavados: 156, correctos: 148 }
  ];

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

      {/* Gráfico de Líneas - Cumplimiento por Hora */}
      <div className="chart-section-full">
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tasa de Cumplimiento - Tendencia por Hora</h3>
            <div className="chart-controls">
              <button className="chart-btn active">Hoy</button>
              <button className="chart-btn">7 días</button>
              <button className="chart-btn">30 días</button>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis dataKey="hora" stroke="#5a6c7d" />
                <YAxis stroke="#5a6c7d" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumplimiento" 
                  stroke="#00bfa5" 
                  strokeWidth={3}
                  name="Cumplimiento (%)"
                  dot={{ fill: '#00bfa5', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="promedio" 
                  stroke="#8b9cb0" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Promedio"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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

      {/* Dos gráficos en fila */}
      <div className="charts-row">
        {/* Gráfico de Barras - Por Área */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Lavados por Área</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis dataKey="area" stroke="#5a6c7d" />
                <YAxis stroke="#5a6c7d" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="lavados" fill="#00bfa5" name="Total Lavados" radius={[8, 8, 0, 0]} />
                <Bar dataKey="correctos" fill="#4caf50" name="Correctos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Circular - Distribución */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Distribución de Cumplimiento</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Área - Tendencia Semanal */}
      <div className="chart-section-full">
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tendencia Semanal</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis dataKey="dia" stroke="#5a6c7d" />
                <YAxis stroke="#5a6c7d" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="lavados" 
                  stackId="1"
                  stroke="#00bfa5" 
                  fill="#00bfa5" 
                  fillOpacity={0.6}
                  name="Total Lavados"
                />
                <Area 
                  type="monotone" 
                  dataKey="correctos" 
                  stackId="2"
                  stroke="#4caf50" 
                  fill="#4caf50" 
                  fillOpacity={0.6}
                  name="Lavados Correctos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
