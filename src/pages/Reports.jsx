import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Reports.css';

// Generar datos simulados por unidad
const generateUnitData = (unitName, startDate, endDate) => {
  const data = [];
  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate) : new Date();
  
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    
    const lavados = Math.floor(Math.random() * 80) + 180;
    const correctos = Math.floor(lavados * 0.76684);
    
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

const Reports = () => {
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('general');

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
  const reportData = useMemo(() => {
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
    
    reportData.forEach(({ data }) => {
      data.forEach(day => {
        totalLavados += day.lavados;
        totalCorrectos += day.correctos;
      });
    });
    
    return {
      totalLavados,
      totalCorrectos,
      tasaExito: totalLavados > 0 ? ((totalCorrectos / totalLavados) * 100).toFixed(3) : 0,
      unidades: reportData.length
    };
  }, [reportData]);

  // Generar datos por paso (para reporte de pasos)
  const generateStepData = () => {
    const steps = [
      { id: 1, name: 'Palma con palma', cumplimiento: 95.2 },
      { id: 2, name: 'Palma sobre dorsos', cumplimiento: 72.4 },
      { id: 3, name: 'Palma entrelazados', cumplimiento: 88.1 },
      { id: 4, name: 'Manos a dedos', cumplimiento: 65.3 },
      { id: 5, name: 'Rotación pulgar', cumplimiento: 70.8 },
      { id: 6, name: 'Yemas con palma', cumplimiento: 68.5 }
    ];
    return steps;
  };

  // Generar PDF y abrirlo en nueva ventana
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header con logos
    doc.setFontSize(20);
    doc.setTextColor(0, 191, 165);
    doc.text('Hand-Wash - Sistema de Supervisión', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(90, 108, 125);
    doc.text('CYSCE - Hospital HDS', pageWidth / 2, 28, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(224, 228, 232);
    doc.line(15, 32, pageWidth - 15, 32);
    
    // Título del reporte
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 95);
    const reportTitle = reportTypes.find(r => r.id === reportType)?.name || 'Reporte General';
    doc.text(reportTitle, 15, 42);
    
    // Información del reporte
    doc.setFontSize(10);
    doc.setTextColor(90, 108, 125);
    const today = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Fecha de generación: ${today}`, 15, 50);
    doc.text(`Unidad: ${units.find(u => u.id === selectedUnit)?.name}`, 15, 56);
    
    const periodStart = startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('es-ES');
    const periodEnd = endDate || new Date().toLocaleDateString('es-ES');
    doc.text(`Período: ${periodStart} - ${periodEnd}`, 15, 62);
    
    // Resumen ejecutivo
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text('Resumen Ejecutivo', 15, 75);
    
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Lavados', stats.totalLavados.toLocaleString()],
      ['Lavados Correctos', stats.totalCorrectos.toLocaleString()],
      ['Tasa de Éxito', `${stats.tasaExito}%`],
      ['Unidades Analizadas', stats.unidades.toString()],
      ['Tiempo Promedio', '28 segundos']
    ];
    
    doc.autoTable({
      startY: 80,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [0, 191, 165],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'right', cellWidth: 'auto' }
      }
    });
    
    let currentY = doc.lastAutoTable.finalY + 15;

    // Agregar contenido específico según tipo de reporte
    if (reportType === 'steps') {
      // Reporte por pasos
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 95);
      doc.text('Análisis por Paso', 15, currentY);
      
      currentY += 7;
      
      const stepData = generateStepData();
      const stepTableData = [
        ['Paso', 'Técnica', 'Cumplimiento'],
        ...stepData.map(step => [
          step.id.toString(),
          step.name,
          `${step.cumplimiento}%`
        ])
      ];
      
      doc.autoTable({
        startY: currentY,
        head: [stepTableData[0]],
        body: stepTableData.slice(1),
        theme: 'striped',
        headStyles: {
          fillColor: [0, 191, 165],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        }
      });
      
      currentY = doc.lastAutoTable.finalY + 10;
    }
    
    if (reportType === 'comparative' && selectedUnit === 'all') {
      // Reporte comparativo
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 95);
      doc.text('Comparación entre Unidades', 15, currentY);
      
      currentY += 7;
      
      const compData = [
        ['Unidad', 'Total Lavados', 'Correctos', 'Tasa de Éxito'],
        ...reportData.map(({ unit, data }) => {
          const total = data.reduce((sum, day) => sum + day.lavados, 0);
          const correctos = data.reduce((sum, day) => sum + day.correctos, 0);
          const tasa = ((correctos / total) * 100).toFixed(1);
          return [unit, total.toString(), correctos.toString(), `${tasa}%`];
        })
      ];
      
      doc.autoTable({
        startY: currentY,
        head: [compData[0]],
        body: compData.slice(1),
        theme: 'striped',
        headStyles: {
          fillColor: [0, 191, 165],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        }
      });
      
      currentY = doc.lastAutoTable.finalY + 10;
    }
    
    // Datos detallados por unidad
    doc.addPage();
    currentY = 20;
    
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text('Datos Detallados por Unidad', 15, currentY);
    
    currentY += 7;
    
    reportData.forEach(({ unit, data }) => {
      const unitTotal = data.reduce((sum, day) => sum + day.lavados, 0);
      const unitCorrectos = data.reduce((sum, day) => sum + day.correctos, 0);
      const unitTasa = ((unitCorrectos / unitTotal) * 100).toFixed(1);
      
      // Mostrar últimos 10 días
      const recentData = data.slice(-10);
      
      const unitData = [
        ['Fecha', 'Lavados', 'Correctos', 'Cumplimiento'],
        ...recentData.map(day => [
          day.fechaLabel,
          day.lavados.toString(),
          day.correctos.toString(),
          `${day.cumplimiento}%`
        ]),
        ['TOTAL', unitTotal.toString(), unitCorrectos.toString(), `${unitTasa}%`]
      ];
      
      doc.setFontSize(12);
      doc.setTextColor(0, 191, 165);
      doc.text(`Unidad: ${unit}`, 15, currentY);
      currentY += 5;
      
      doc.autoTable({
        startY: currentY,
        head: [unitData[0]],
        body: unitData.slice(1, -1),
        foot: [unitData[unitData.length - 1]],
        theme: 'striped',
        headStyles: {
          fillColor: [0, 191, 165],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [30, 58, 95],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 4
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { halign: 'right', cellWidth: 30 },
          2: { halign: 'right', cellWidth: 30 },
          3: { halign: 'right', cellWidth: 35 }
        }
      });
      
      currentY = doc.lastAutoTable.finalY + 15;
      
      // Nueva página si es necesario
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
    });
    
    // Footer en todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        'Hand-Wash © 2026 CYSCE - Hospital HDS',
        pageWidth - 15,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
    
    // Abrir PDF en nueva ventana en lugar de descargar
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="reports">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Generación de Reportes</h1>
          <p className="reports-subtitle">Reportes personalizados por unidad con exportación PDF</p>
        </div>
      </div>

      {/* Configuración del reporte */}
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

      {/* Previsualización */}
      <div className="report-preview">
        <div className="preview-header">
          <h3 className="preview-title">Previsualización del Reporte</h3>
          <button className="generate-btn" onClick={generatePDF}>
            📄 Generar y Abrir PDF
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
