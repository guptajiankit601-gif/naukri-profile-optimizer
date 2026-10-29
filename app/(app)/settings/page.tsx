import React from 'react';
import { SettingsView } from '@/components/settings/SettingsView';
import { Metadata } from 'next';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata: Metadata = {
  title: `Settings & Preferences | ${BRAND_CONFIG.name}`,
  description: 'Manage appearance, analysis preferences, AI features, and local data.'
};

export default function SettingsPage() {
  return <SettingsView />;
}
