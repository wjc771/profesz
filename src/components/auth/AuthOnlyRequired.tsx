
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
    console.log('AuthOnlyRequired: checking...', { 
      user: !!user, 
      loading, 
      userEmail: user?.email,
      emailConfirmed: user?.email_confirmed_at 
    });
    
    if (!loading) {
      if (!user) {
        console.log('AuthOnlyRequired: No user found, redirecting to login');
        navigate('/login');
      } else if (!user.email_confirmed_at) {
        console.log('AuthOnlyRequired: Email not confirmed, redirecting to verification');
        navigate('/verification-pending');
      } else {
        console.log('AuthOnlyRequired: User authenticated and confirmed, allowing access');
        setAuthChecked(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading || !authChecked) {
    console.log('AuthOnlyRequired: Still loading or checking');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
