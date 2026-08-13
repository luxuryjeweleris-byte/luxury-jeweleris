'use client';

import { createContext, useContext } from 'react';

export interface AdminContextType {
  adminEmail: string;
}

export const AdminContext = createContext<AdminContextType>({ adminEmail: '' });

export function useAdminContext() {
  return useContext(AdminContext);
}
