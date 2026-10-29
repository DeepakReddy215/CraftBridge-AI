import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/api';
import { NotFound } from '../../pages/NotFound';

export interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
  render404OnDeny?: boolean;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles,
  children,
  render404OnDeny = false,
}) => {
  const { role, user } = useAuth();

  if (!user || !allowedRoles.includes(role)) {
    if (render404OnDeny) {
      return <NotFound />;
    }
    return <NotFound />;
  }

  return children;
};
