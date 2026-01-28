import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import WashStation from './pages/WashStation';
import Dashboard from './pages/Dashboard';
import StepMetrics from './pages/StepMetrics';
import Reports from './pages/Reports';

function App() {
  const [currentView, setCurrentView] = useState('wash-station');
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'm' || event.key === 'M' || event.key === 'Escape') {
        setShowHeader(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (currentView !== 'wash-station') {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  }, [currentView]);

  const renderView = () => {
    switch(currentView) {
      case 'wash-station':
        return <WashStation />;
      case 'dashboard':
        return <Dashboard />;
      case 'step-metrics':
        return <StepMetrics />;
      case 'reports':
        return <Reports />;
      case 'users':
        return (
          <div style={{ 
            padding: '100px 40px', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            minHeight: 'calc(100vh - 70px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h2 style={{ fontSize: '48px', marginBottom: '16px' }}>👥</h2>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Gestión de Usuarios</h3>
            <p>En desarrollo...</p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ 
            padding: '100px 40px', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            minHeight: 'calc(100vh - 70px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h2 style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</h2>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Configuración</h3>
            <p>En desarrollo...</p>
          </div>
        );
      default:
        return <WashStation />;
    }
  };

  return (
    <Layout 
      currentView={currentView}
      onViewChange={setCurrentView}
      forceShowHeader={showHeader}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
