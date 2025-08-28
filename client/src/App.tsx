import React from 'react';
import MapView from './components/MapView';
import { useWebSocket } from './hooks/useWebSocket';
import AlertList from './components/AlertList';

const App: React.FC = () => {
  useWebSocket(); // connects and injects alerts into Redux

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <MapView />
      </div>
      <aside style={{ width: 360, borderLeft: '1px solid #eee', overflow: 'auto' }}>
        <AlertList />
      </aside>
    </div>
  );
};

export default App;
