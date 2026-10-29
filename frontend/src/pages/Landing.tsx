import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Hero } from '../components/landing/Hero';
import { Lifecycle } from '../components/landing/Lifecycle';
import { Modules } from '../components/landing/Modules';
import { Roles } from '../components/landing/Roles';
import { Cta } from '../components/landing/Cta';

export const Landing: React.FC = () => {
  return (
    <PageShell>
      <Hero />
      <Lifecycle />
      <Modules />
      <Roles />
      <Cta />
    </PageShell>
  );
};
