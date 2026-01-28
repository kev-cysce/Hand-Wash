import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import './Dashboard.css';

// Generar datos de 90 días (3 meses) con tasa de éxito del 76.684%
const generateDailyData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const lavados = Math.floor(Math.random() * 80) + 180; // 180-260 lavados
    const correctos = Math.floor(lavados * 0.76684); // Tasa de éxito 76.684%
    const cumplimiento = (correctos / lavados) * 100;
    
    data.push({
      fecha: date.toISOString().split('T')[0],
      fechaLabel: `${date.getDate()}/${date.getMonth() + 1}`,
      lavados,
      correctos,
      cumplimiento: parseFloat(cumplimiento.toFixed(1)),
      promedio: 28
    });
  }
  
  return data;
};

const Dashboard = () => {
  const allData = useMemo(() => generateDailyData(), []);
  
  const [dateRange, setDateRange] = useState('7');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtrar datos según rango seleccionado
  const filteredData = useMemo(() => {
    if (startDate && endDate) {
      return allData.filter(item => 
        item.fecha >= startDate && item.fecha <= endDate
      );
    }
    
    const days = parseInt(dateRange);
    return allData.slice(-days);
  }, [allData, dateRange, startDate, endDate]);

  // Calcular estadísticas del período
  const stats = useMemo(() => {
    const totalLavados = filteredData.reduce((sum, item) => sum + item.lavados, 0);
    const totalCorrectos = filteredData.reduce((sum, item) => sum + item.correctos, 0);
    const tasaExito = totalLavados > 0 ? (totalCorrectos / totalLavados) * 100 : 0;
    
    return {
      totalLavados,
      totalCorrectos,
      tasaExito: tasaExito.toFixed(3), // 76.684%
      tiempoPromedio: 28
    };
  }, [filteredData]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setStartDate('');
    setEndDate('');
    setShowDatePicker(false);
  };

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
    }
  };

  // Datos por área
  const areaData = [
    { area: 'UCI', total: 450, correctos: 345 },
    { area: 'Urgencias', total: 380, correctos: 291 },
    { area: 'Quirófano', total: 320, correctos: 245 },
    { area: 'Pediatría', total: 280, correctos: 215 },
    { area: 'Internación', total: 420, correctos: 322 }
  ];

  // Datos de distribución de cumplimiento
  const distributionData = [
    { name: 'Excelente (95-100%)', value: 15, color: '#4caf50' },
    { name: 'Bueno (85-94%)', value: 35, color: '#00bfa5' },
    { name: 'Regular (70-84%)', value: 40, color: '#ff9800' },
    { name: 'Deficiente (<70%)', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard de Supervisión</h1>
          <p className="dashboard-subtitle">Análisis de cumplimiento de lavado de manos</p>
        </div>
        
        <div className="dashboard-actions">
          <div className="date-filter-container">
            <button 
              className="action-btn secondary"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              📅 Filtrar por fecha
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
            📄 Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros de rango rápido */}
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

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Lavados Totales</span>
            <span className="stat-trend">+12%</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats.totalLavados.toLocaleString()}</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(0, 191, 165, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-primary)' }}>🖐️</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Lavados Correctos</span>
            <span className="stat-trend">+8%</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats.totalCorrectos.toLocaleString()}</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-success)' }}>✓</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tiempo Promedio</span>
            <span className="stat-trend">-2%</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats.tiempoPromedio}s</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-warning)' }}>⏱️</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tasa de Éxito</span>
            <span className="stat-trend">+5%</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats.tasaExito}%</span>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <span className="stat-icon" style={{ color: 'var(--accent-success)' }}>🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-row">
        {/* Gráfico de líneas - Cumplimiento por hora */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tendencia de Cumplimiento</h3>
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
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumplimiento" 
                  stroke="#00bfa5" 
                  strokeWidth={2}
                  name="Cumplimiento (%)"
                  dot={{ fill: '#00bfa5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de barras - Lavados por área */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Lavados por Área</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e8" />
                <XAxis dataKey="area" stroke="#5a6c7d" />
                <YAxis stroke="#5a6c7d" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e4e8',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#00bfa5" radius={[8, 8, 0, 0]} name="Total Lavados" />
                <Bar dataKey="correctos" fill="#4caf50" radius={[8, 8, 0, 0]} name="Correctos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="charts-row">
        {/* Gráfico circular */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Distribución de Cumplimiento</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de área */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Tendencia de Lavados</h3>
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
                    backgroundColor: '#ffffff',
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
                  name="Total"
                />
                <Area 
                  type="monotone" 
                  dataKey="correctos" 
                  stackId="2" 
                  stroke="#4caf50" 
                  fill="#4caf50" 
                  fillOpacity={0.6}
                  name="Correctos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Contenido adicional */}
      <div className="dashboard-content">
        {/* Alertas de calidad */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Alertas de Calidad</h3>
            <button className="view-all-btn">Ver todas →</button>
          </div>
          <div className="quality-metrics">
            {[
              { type: 'Lavado No Válido', count: 58, total: 1850, percent: 3.2, icon: '❌', color: '#ef4444' },
              { type: 'Fuera de Cuadro', count: 37, total: 1850, percent: 2.0, icon: '📦', color: '#ff9800' },
              { type: 'Objeto Inusual', count: 15, total: 1850, percent: 0.8, icon: '⚠️', color: '#ff9800' },
              { type: 'Invasión del Espacio', count: 8, total: 1850, percent: 0.4, icon: '🚫', color: '#ef4444' },
              { type: 'Técnica Incompleta', count: 44, total: 1850, percent: 2.4, icon: '⏱️', color: '#ff9800' },
              { type: 'Sin Detección', count: 22, total: 1850, percent: 1.2, icon: '🔍', color: '#5a6c7d' }
            ].map((metric, index) => (
              <div key={index} className="quality-metric-item">
                <div className="metric-left">
                  <div className="metric-icon-wrapper" style={{ borderColor: metric.color, backgroundColor: `${metric.color}15` }}>
                    <span className="metric-icon">{metric.icon}</span>
                  </div>
                  <div className="metric-info">
                    <div className="metric-type">{metric.type}</div>
                    <div className="metric-stats">
                      <span className="metric-count">{metric.count}</span> de {metric.total} lavados
                    </div>
                  </div>
                </div>
                <div className="metric-right">
                  <span className="metric-percentage" style={{ color: metric.color }}>{metric.percent}%</span>
                  <div className="metric-bar-container">
                    <div 
                      className="metric-bar-fill" 
                      style={{ 
                        width: `${metric.percent * 10}%`,
                        backgroundColor: metric.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos lavados */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Últimos Lavados</h3>
            <button className="view-all-btn">Ver todos →</button>
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
              {[
                { id: 'L-4521', area: 'UCI', compliance: 'high', percent: 98, time: '32s', timestamp: '14:23' },
                { id: 'L-4520', area: 'Urgencias', compliance: 'medium', percent: 87, time: '28s', timestamp: '14:18' },
                { id: 'L-4519', area: 'Quirófano', compliance: 'high', percent: 95, time: '30s', timestamp: '14:12' },
                { id: 'L-4518', area: 'Pediatría', compliance: 'low', percent: 72, time: '22s', timestamp: '14:05' },
                { id: 'L-4517', area: 'Internación', compliance: 'invalid', percent: 0, time: '--', timestamp: '13:58' }
              ].map((wash) => (
                <div key={wash.id} className="table-row">
                  <div className="td">
                    <span className="wash-id">{wash.id}</span>
                  </div>
                  <div className="td">
                    <span className="area-text">{wash.area}</span>
                  </div>
                  <div className="td">
                    <span className={`compliance-badge ${wash.compliance}`}>
                      {wash.percent > 0 ? `${wash.percent}%` : 'Inválido'}
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
  );
};

export default Dashboard;
