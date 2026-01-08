import Header from './Header';
import './Layout.css';

const Layout = ({ children, currentView, onViewChange, forceShowHeader }) => {
  const hideHeaderViews = ['wash-station'];
  const shouldHideHeader = hideHeaderViews.includes(currentView) && !forceShowHeader;

  return (
    <div className="layout">
      <Header 
        currentView={currentView} 
        onViewChange={onViewChange}
        className={shouldHideHeader ? 'hidden' : 'visible'}
      />
      
      <main className={`main-content ${shouldHideHeader ? 'no-header' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
