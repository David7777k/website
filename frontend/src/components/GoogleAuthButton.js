import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const GoogleAuthButton = () => {
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    // Dynamically load Google Identity Services if not present
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSignIn = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        alert('GOOGLE_CLIENT_ID is not configured');
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => {
          const idToken = res.credential;
          signInWithGoogle(idToken);
        }
      });

      window.google.accounts.id.prompt();
    } else {
      // Fallback: call context directly
      signInWithGoogle();
    }
  };

  return (
    <button className="btn btn-google" onClick={handleSignIn}>
      Увійти через Google
    </button>
  );
};

export default GoogleAuthButton;
