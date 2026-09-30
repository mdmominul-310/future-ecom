'use client';

import { logout } from '@/lib/action';

export default function SignOutButton() {
  return (
    <button
      onClick={() => logout()}
      className=""
    >
      Sign Out
    </button>
  );
} 