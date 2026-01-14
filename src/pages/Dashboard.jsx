import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  // Estados para filtros
  const [dateRange, setDateRange] = useState('7'); // 7, 30, 90 días
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Generar datos para 90 días (3 meses)
  const generateDailyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseWashes = 180 + Math.random() * 80;
      const compliance = 85 + Math.random() * 12;
      
      data.push({
        fecha: date.toISOString().split('T')[0],
        fechaLabel: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        lavados: Math.round(baseWashes),
        correctos: Math.round(baseWashes * (compliance / 100)),
        cumplimiento: Math.round(compliance),
        promedio: 88
      });
    }
    return data;
  };

  const allData = useMemo(() => generateDailyData(), []);

  // Filtrar datos según el rango seleccionado
  const filteredData = useMemo(() => {
    if (startDate && endDate) {
      return allData.filter(item => {
        return item.fecha >= startDate && item.fecha <= endDate;
      });
    }
    
    const numDays = parseInt(dateRange);
    return allData.slice(-numDays);
  }, [dateRange, startDate, endDate, allData]);

  // Calcular estadísticas del período filtrado
  const stats = useMemo(() => {
    const totalWashes = filteredData.reduce((sum, day) => sum + day.lavados, 0);
    const totalCorrect = filteredData.reduce((sum, day) => sum + day.correctos, 0);
    const avgTime = 28;
    const successRate = totalWashes > 0 ? ((totalCorrect / totalWashes) * 100).toFixed(1) : 0;

    // Calcular cambio respecto al período anterior
    const previousPeriodData = allData.slice(-dateRange * 2, -dateRange);
    const prevTotal = previousPeriodData.reduce((sum, day) => sum + day.lavados, 0);
    const change = prevTotal > 0 ? (((totalWashes - prevTotal) / prevTotal) * 100).toFixed(1) : 0;

    return [
      { 
        label: 'Lavados Totales', 
        value: totalWashes.toString(), 
        change: `${change > 0 ? '+' : ''}${change}%`, 
        trend: change >= 0 ? 'up' : 'down',
        icon: '🖐️',
        color: '#00bfa5'
      },
      { 
        label: 'Lavados Correctos', 
        value: totalCorrect.toString(), 
        change: '+8%', 
        trend: 'up',
        icon: '✓',
        color: '#4caf50'
      },
      { 
        label: 'Tiempo Promedio', 
        value: `${avgTime}s`, 
        change: '-2s', 
        trend: 'up',
        icon: '⏱️',
        color: '#00bfa5'
      },
      { 
        label: 'Tasa de Éxito', 
        value: `${successRate}%`, 
        change: '+2.1%', 
        trend: 'up',
        icon: '📊',
        color: '#4caf50'
      }
    ];
  }, [filteredData, allData, dateRange]);

  // Datos para gráfico de barras - Por área
  const areaData = [
    { area: 'UCI', lavados: 89, correctos: 85 },
    { area: 'Urgencias', lavados: 67, correctos: 62 },
    { area: 'Quirófano', lavados: 54, correctos: 53 },
    { area: 'Pediatría', lavados: 43, correctos: 38 },
    { area: 'Internación', lavados: 38, correctos: 35 }
  ];

  // Datos para gráfico circular
  const pieData = [
    { name: 'Excelente (95-100%)', value: 156, color: '#4caf50' },
    { name: 'Bueno (85-94%)', value: 75, color: '#00bfa5' },
    { name: 'Regular (70-84%)', value: 12, color: '#ff9800' },
    { name: 'Deficiente (<70%)', value: 4, color: '#ef4444' }
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

  const handleDateRangeChange = (days) => {
    setDateRange(days);
    setStartDate('');
    setEndDate('');
    setShowDatePicker(false);
  };

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard de Reportes</h1>
          <p className="dashboard-subtitle">Análisis de cumplimiento y métricas de calidad</p>
        </div>
        <div className="dashboard-actions">
          <div className="date-filter-container">
            <button 
              className="action-btn secondary"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <span>📅</span>
              <span>Filtrar por fecha</span>
            </button>
            
            {showDatePicker && (
              <div className="date-picker-dropdown">
                <div className="date-inputs">
                  <div className="date-input-group">
                    <label>Desde:</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="date-input-group">
                    <label>Hasta:</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <button 
                  className="apply-filter-btn"
                  onClick={handleCustomDateFilter}
                  disabled={!startDate || !endDate}
                >
                  Aplicar Filtro
                </button>
              </div>
            )}
          </div>
          
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

      {/* Gráfico de Líneas - Cumplimiento */}
      <div className="chart-section-full">
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tasa de Cumplimiento - Tendencia</h3>
            <div className="chart-controls">
              <button 
                className={`chart-btn ${dateRange === '7' ? 'active' : ''}`}
                onClick={() => handleDateRangeChange('7')}
              >
                7 días
              </button>
              <button 
                className={`chart-btn ${dateRange === '30' ? 'active' : ''}`}
                onClick={() => handleDateRangeChange('30')}
              >
                30 días
              </button>
              <button 
                className={`chart-btn ${dateRange === '90' ? 'active' : ''}`}
                onClick={() => handleDateRangeChange('90')}
              >
                90 días
              </button>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis 
                  dataKey="fechaLabel" 
                  stroke="#5a6c7d"
                  interval={Math.floor(filteredData.length / 10)}
                />
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
                  dot={{ fill: '#00bfa5', r: 3 }}
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

      {/* Gráfico de Área - Tendencia */}
      <div className="chart-section-full">
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tendencia de Lavados - Período Seleccionado</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis 
                  dataKey="fechaLabel" 
                  stroke="#5a6c7d"
                  interval={Math.floor(filteredData.length / 10)}
                />
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
