import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PathsPage } from './pages/PathsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignOutPage } from './pages/SignOutPage';
import { PublicOnlyRoute } from './components/RouteGuards';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="paths" element={<PathsPage />} />

        {/* Guest-only routes: redirected to /projects if already authenticated */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        {/* SignOut route: clears auth and redirects to signin */}
        <Route path="signout" element={<SignOutPage />} />
      </Route>
    </Routes>
  );
};

export default App;
