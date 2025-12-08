import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

type Tenant = {
  id: string;
  name: string;
};

type TenantContextValue = {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
};

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ useLocation is INSIDE the component (safe)
  const location = useLocation();

  // TODO: yahan tum apni location-based logic laga sakte ho
  // e.g. route se tenant infer karna, etc.

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const value = useMemo(
    () => ({
      currentTenant,
      setCurrentTenant,
    }),
    [currentTenant]
  );

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextValue => {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return ctx;
};
