import React from 'react';
import { LogIn } from 'lucide-react';
import { authService } from '../../services/authService';

export function GoogleSignIn() {
  return (
    <button onClick={authService.login} className="btn btn-white">
      <LogIn size={20} />
      <span>Sign in with Google</span>
    </button>
  );
}