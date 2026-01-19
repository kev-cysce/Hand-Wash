import './Header.css';

const Header = ({ currentView, onViewChange, className }) => {
  const menuItems = [
    { id: 'wash-station', icon: '🖐️', label: 'Estación de Lavado' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'reports', icon: '📈', label: 'Reportes' },
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' }
  ];

  return (
    <header className={`top-header ${className}`}>
      <div className="header-content">
        <div className="logo-section">
          <img src="/Hand-Wash/images/Logo.jpeg" alt="CYSCE" className="header-logo" />
        </div>

        <nav className="top-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-right">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Sistema Activo</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
