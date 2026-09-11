import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const SignOutPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Single-purpose effect: run logout logic and redirect to signin
    logout();
    navigate('/signin', { replace: true });
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      <p className="text-sm">Signing you out of SkillHub...</p>
    </div>
  );
};
