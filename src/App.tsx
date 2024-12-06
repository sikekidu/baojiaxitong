import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Materials from './pages/Materials';
import SpareParts from './pages/SpareParts';
import Maintenance from './pages/Maintenance';
import Quotation from './pages/Quotation';
import Settings from './pages/Settings';
import Login from './pages/Login';

// 简单的认证检查
const isAuthenticated = () => {
  // 这里添加实际的认证检查逻辑
  return true;
};

// 受保护的路由组件
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/equipment"
          element={
            <ProtectedLayout>
              <Equipment />
            </ProtectedLayout>
          }
        />
        <Route
          path="/materials"
          element={
            <ProtectedLayout>
              <Materials />
            </ProtectedLayout>
          }
        />
        <Route
          path="/spare-parts"
          element={
            <ProtectedLayout>
              <SpareParts />
            </ProtectedLayout>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedLayout>
              <Maintenance />
            </ProtectedLayout>
          }
        />
        <Route
          path="/quotation"
          element={
            <ProtectedLayout>
              <Quotation />
            </ProtectedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;