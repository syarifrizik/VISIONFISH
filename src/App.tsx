
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './hooks/use-theme';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from './pages/Index';
import Ultra2025AuthPage from './pages/Ultra2025AuthPage';
import { PasswordResetHandler } from '@/components/auth/PasswordResetHandler';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import ProfilePage from './pages/Profile';
import UserProfile from './pages/UserProfile';
import FishAnalysis from './pages/FishAnalysis';
import SpeciesId from './pages/SpeciesId';
import Weather from './pages/Weather';
import Chatroom from './pages/Chatroom';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import AiIoT from './pages/AiIoT';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <NotificationsProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/login" element={<Ultra2025AuthPage />} />
                <Route path="/register" element={<Ultra2025AuthPage />} />
                <Route path="/auth" element={<Ultra2025AuthPage />} />
                <Route path="/verify" element={<PasswordResetHandler />} />
                <Route path="/dashboard" element={<Layout><HomePage /></Layout>} />
                <Route path="/notes" element={<Layout><HomePage /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/premium" element={<Layout><Premium /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/user/:userId" element={<Layout><UserProfile /></Layout>} />
                <Route path="/chat" element={<Layout><ChatList /></Layout>} />
                <Route path="/chat/:userId" element={<Chat />} />
                <Route path="/fish-analysis" element={<Layout><FishAnalysis /></Layout>} />
                <Route path="/analisis" element={<Layout><FishAnalysis /></Layout>} />
                <Route path="/species-id" element={<Layout><SpeciesId /></Layout>} />
                <Route path="/weather" element={<Layout><Weather /></Layout>} />
                <Route path="/cuaca" element={<Layout><Weather /></Layout>} />
                <Route path="/chatroom" element={<Layout><Chatroom /></Layout>} />
                <Route path="/ai-iot" element={<Layout><AiIoT /></Layout>} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </NotificationsProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
