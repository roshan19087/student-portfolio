import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { SiteSettingsProvider } from './context/SiteSettingsContext.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';
import { AppRoutes } from './routes/AppRoutes.js';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SiteSettingsProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SiteSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
