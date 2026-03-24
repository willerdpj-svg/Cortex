import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProspectsPage from './pages/ProspectsPage';
import ProspectDetailPage from './pages/ProspectDetailPage';
import PipelinePage from './pages/PipelinePage';
import DealDetailPage from './pages/DealDetailPage';
import ActivitiesPage from './pages/ActivitiesPage';
import TasksPage from './pages/TasksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/prospects" element={<ProspectsPage />} />
                <Route path="/prospects/:id" element={<ProspectDetailPage />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/deals/:id" element={<DealDetailPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/tasks" element={<TasksPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </AuthProvider>
  );
}
