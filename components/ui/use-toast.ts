'use client';

import * as React from 'react';
import { ToastContext } from './toast';

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    return {
      toast: () => {},
      removeToast: () => {},
    };
  }
  return context;
}
