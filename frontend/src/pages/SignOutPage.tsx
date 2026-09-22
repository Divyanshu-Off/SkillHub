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
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground font-mono text-xs">
      <Loader2 className="w-6 h-6 animate-spin text-foreground" />
      <p className="uppercase tracking-wider">Signing you out of SkillHub...</p>
    </div>
  );
};

export default SignOutPage;
