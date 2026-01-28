import { useState, useMemo } from 'react';
import ReportViewer from '../components/ReportViewer';
import './Reports.css';

// IMPORTANTE: Usar la misma tasa de éxito que en Dashboard (76.684%)
const TASA_EXITO = 0.76684;

// Generar datos simulados por unidad (CONGRUENTE con Dashboard)
const generateUnitData = (unitName, startDate, endDate) => {
  const data = [];
  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate) : new Date();
  
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    
    const lavados = Math.floor(Math.random() * 80) + 180; // 180-260 lavados
    const correctos = Math.floor(lavados * TASA_EXITO); // Usar tasa exacta
    
    data.push({
      fecha: date.toISOString().split('T')[0],
      fechaLabel: `${date.getDate()}/${date.getMonth() + 1}`,
      lavados,
      correctos,
      cumplimiento: ((correctos / lavados) * 100).toFixed(1)
    });
  }
  
  return data;
};

// Datos por paso (CONGRUENTE con StepMetrics)
const stepMetrics = [
  { id: 1, name: 'Palma con palma', cumplimiento: 95.2 },
  { id: 2, name: 'Palma sobre dorsos', cumplimiento: 72.4 },
  { id: 3, name: 'Palma entrelazados', cumplimiento: 88.1 },
  { id: 4, name: 'Manos a dedos', cumplimiento: 65.3 },
  { id: 5, name: 'Rotación pulgar', cumplimiento: 70.8 },
  { id: 6, name: 'Yemas con palma', cumplimiento: 68.5 }
];

const Reports = () => {
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('general');
  const [showViewer, setShowViewer] = useState(false);
  const [reportData, setReportData] = useState(null);

  const units = [
    { id: 'all', name: 'Todas las Unidades', icon: '🏥' },
    { id: 'uci', name: 'UCI', icon: '🏥' },
    { id: 'urgencias', name: 'Urgencias', icon: '🚑' },
    { id: 'quirofano', name: 'Quirófano', icon: '⚕️' },
    { id: 'pediatria', name: 'Pediatría', icon: '👶' },
    { id: 'internacion', name: 'Internación', icon: '🛏️' }
  ];

  const reportTypes = [
    { id: 'general', name: 'Reporte General', description: 'Resumen completo de todas las métricas' },
    { id: 'compliance', name: 'Cumplimiento', description: 'Enfocado en tasas de cumplimiento' },
    { id: 'steps', name: 'Por Pasos', description: 'Análisis detallado de cada paso' },
    { id: 'comparative', name: 'Comparativo', description: 'Comparación entre unidades' }
  ];

  // Generar datos según filtros
  const generatedData = useMemo(() => {
    const unitsToInclude = selectedUnit === 'all' 
      ? ['UCI', 'Urgencias', 'Quirófano', 'Pediatría', 'Internación']
      : [units.find(u => u.id === selectedUnit)?.name];
    
    const allData = unitsToInclude.map(unit => ({
      unit,
      data: generateUnitData(unit, startDate, endDate)
    }));
    
    return allData;
  }, [selectedUnit, startDate, endDate]);

  // Calcular estadísticas totales
  const stats = useMemo(() => {
    let totalLavados = 0;
    let totalCorrectos = 0;
    
    generatedData.forEach(({ data }) => {
      data.forEach(day => {
        totalLavados += day.lavados;
        totalCorrectos += day.correctos;
      });
    });
    
    return {
      totalLavados,
      totalCorrectos,
      tasaExito: totalLavados > 0 ? ((totalCorrectos / totalLavados) * 100).toFixed(3) : '76.684',
      unidades: generatedData.length
    };
  }, [generatedData]);

  // Generar reporte
  const generateReport = () => {
    const selectedUnitName = units.find(u => u.id === selectedUnit)?.name;
    const selectedReportType = reportTypes.find(r => r.id === reportType)?.name;
    
    const periodStart = startDate 
      ? new Date(startDate).toLocaleDateString('es-ES')
      : new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('es-ES');
    const periodEnd = endDate 
      ? new Date(endDate).toLocaleDateString('es-ES')
      : new Date().toLocaleDateString('es-ES');
    
    const report = {
      unit: selectedUnitName,
      reportType: selectedReportType,
      stats: stats,
      stepData: reportType === 'steps' ? stepMetrics : null,
      detailedData: generatedData[0]?.data || [],
      dateRange: `${periodStart} - ${periodEnd}`
    };
    
    setReportData(report);
    setShowViewer(true);
  };

  return (
    <div className="reports">
      {/* Visor de Reporte */}
      {showViewer && reportData && (
        <ReportViewer 
          reportData={reportData}
          onClose={() => setShowViewer(false)}
        />
      )}

      <div className="reports-header">
        <div>
          <h1 className="reports-title">Generación de Reportes</h1>
          <p className="reports-subtitle">Reportes personalizados por unidad con vista previa</p>
        </div>
      </div>

      <div className="report-config">
        <div className="config-section">
          <h3 className="config-title">Seleccionar Unidad</h3>
          <div className="units-grid">
            {units.map(unit => (
              <div
                key={unit.id}
                className={`unit-card ${selectedUnit === unit.id ? 'active' : ''}`}
                onClick={() => setSelectedUnit(unit.id)}
              >
                <span className="unit-icon">{unit.icon}</span>
                <span className="unit-name">{unit.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h3 className="config-title">Tipo de Reporte</h3>
          <div className="report-types-grid">
            {reportTypes.map(type => (
              <div
                key={type.id}
                className={`report-type-card ${reportType === type.id ? 'active' : ''}`}
                onClick={() => setReportType(type.id)}
              >
                <div className="report-type-name">{type.name}</div>
                <div className="report-type-desc">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h3 className="config-title">Rango de Fechas</h3>
          <div className="date-range">
            <div className="date-input-group">
              <label>Fecha Inicio:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="date-input-group">
              <label>Fecha Fin:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="report-preview">
        <div className="preview-header">
          <h3 className="preview-title">Previsualización del Reporte</h3>
          <button 
            className="generate-btn" 
            onClick={generateReport}
          >
            📄 Generar Reporte
          </button>
        </div>

        <div className="preview-stats">
          <div className="preview-stat">
            <span className="preview-stat-label">Total de Lavados</span>
            <span className="preview-stat-value">{stats.totalLavados.toLocaleString()}</span>
          </div>
          <div className="preview-stat">
            <span className="preview-stat-label">Lavados Correctos</span>
            <span className="preview-stat-value">{stats.totalCorrectos.toLocaleString()}</span>
          </div>
          <div className="preview-stat">
            <span className="preview-stat-label">Tasa de Éxito</span>
            <span className="preview-stat-value">{stats.tasaExito}%</span>
          </div>
          <div className="preview-stat">
            <span className="preview-stat-label">Unidades</span>
            <span className="preview-stat-value">{stats.unidades}</span>
          </div>
        </div>

        <div className="preview-info">
          <p>
            <strong>Unidad seleccionada:</strong> {units.find(u => u.id === selectedUnit)?.name}
          </p>
          <p>
            <strong>Tipo de reporte:</strong> {reportTypes.find(r => r.id === reportType)?.name}
          </p>
          <p>
            <strong>Período:</strong> {startDate || 'Últimos 30 días'} hasta {endDate || 'Hoy'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
