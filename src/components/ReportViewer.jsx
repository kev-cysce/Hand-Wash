import './ReportViewer.css';

const ReportViewer = ({ reportData, onClose }) => {
  const { unit, reportType, stats, stepData, detailedData, dateRange } = reportData;

  return (
    <div className="report-viewer-modal">
      <div className="report-viewer-header">
        <h3>📄 Reporte Generado - {unit}</h3>
        <div className="report-viewer-actions">
          <button className="report-action-btn print" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
          <button className="report-action-btn close" onClick={onClose}>
            ✕ Cerrar
          </button>
        </div>
      </div>
      
      <div className="report-viewer-content">
        <div className="report-document">
          {/* Header del reporte */}
          <div className="report-header">
            <div className="report-logos">
              <img src="/Hand-Wash/images/Logo.jpeg" alt="CYSCE" className="report-logo" />
              <img src="/Hand-Wash/images/LOGO HDS.jpg" alt="Hospital HDS" className="report-logo" />
            </div>
            <div className="report-title-section">
              <h1>Hand-Wash - Sistema de Supervisión</h1>
              <h2>CYSCE - Hospital HDS</h2>
            </div>
          </div>

          {/* Información del reporte */}
          <div className="report-info-box">
            <h3>{reportType}</h3>
            <div className="report-metadata">
              <p><strong>Fecha de generación:</strong> {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Unidad:</strong> {unit}</p>
              <p><strong>Período:</strong> {dateRange}</p>
            </div>
          </div>

          {/* Resumen ejecutivo */}
          <div className="report-section">
            <h3 className="section-title">Resumen Ejecutivo</h3>
            <div className="summary-grid">
              <div className="summary-card">
                <span className="summary-label">Total de Lavados</span>
                <span className="summary-value">{stats.totalLavados.toLocaleString()}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Lavados Correctos</span>
                <span className="summary-value">{stats.totalCorrectos.toLocaleString()}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Tasa de Éxito</span>
                <span className="summary-value">{stats.tasaExito}%</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Tiempo Promedio</span>
                <span className="summary-value">28s</span>
              </div>
            </div>
          </div>

          {/* Análisis por pasos (si aplica) */}
          {reportType === 'Por Pasos' && stepData && (
            <div className="report-section">
              <h3 className="section-title">Análisis por Paso</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Paso</th>
                    <th>Técnica</th>
                    <th>Cumplimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {stepData.map(step => (
                    <tr key={step.id}>
                      <td>{step.id}</td>
                      <td>{step.name}</td>
                      <td>{step.cumplimiento}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Datos detallados */}
          <div className="report-section">
            <h3 className="section-title">Datos Detallados - Últimos 10 días</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Lavados</th>
                  <th>Correctos</th>
                  <th>Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {detailedData.slice(-10).map((day, index) => (
                  <tr key={index}>
                    <td>{day.fechaLabel}</td>
                    <td>{day.lavados}</td>
                    <td>{day.correctos}</td>
                    <td>{day.cumplimiento}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>TOTAL</strong></td>
                  <td><strong>{detailedData.reduce((sum, d) => sum + d.lavados, 0)}</strong></td>
                  <td><strong>{detailedData.reduce((sum, d) => sum + d.correctos, 0)}</strong></td>
                  <td><strong>{stats.tasaExito}%</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="report-footer">
            <p>Hand-Wash © 2026 CYSCE - Hospital HDS</p>
            <p>Generado automáticamente por el Sistema de Supervisión de Lavado de Manos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
