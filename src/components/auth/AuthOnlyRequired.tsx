
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthOnlyRequiredProps {
  children: React.ReactNode;
}

export const AuthOnlyRequired = ({ children }: AuthOnlyRequiredProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('AuthOnlyRequired: No user found, redirecting to login');
        navigate('/login');
      } else {
        console.log('AuthOnlyRequired: User authenticated, allowing access');
        setAuthChecked(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
