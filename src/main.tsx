import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from './components/ui/provider';
import { AuthProvider } from './contexts/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { ErrorHandler } from './components/ErrorHandler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import ErrorBoundary from './components/ErrorBoundary';

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
  <Provider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <ErrorHandler />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </Provider>
);
