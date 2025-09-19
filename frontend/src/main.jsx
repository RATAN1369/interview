import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { err: null }; }
  static getDerivedStateFromError(e){ return { err: e }; }
  componentDidCatch(e, info){ console.error('App crashed:', e, info); }
  render(){ return this.state.err
    ? <div style={{padding:24,fontFamily:'system-ui'}}><h1>⚠️ App crashed</h1><pre>{String(this.state.err)}</pre></div>
    : this.props.children; }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
