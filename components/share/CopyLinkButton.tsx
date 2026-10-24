'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  textToCopy,
  label = 'Copy Share Text',
  className
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCopy}
      className={`border-white/10 text-xs text-slate-200 ${className || ''}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
      {copied ? 'Copied to Clipboard!' : label}
    </Button>
  );
};
