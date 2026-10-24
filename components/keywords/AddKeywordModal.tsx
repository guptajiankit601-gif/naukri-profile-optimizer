'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ALIASES } from '@/lib/data/skills-dict';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keyword: string) => void;
}

export const AddKeywordModal: React.FC<AddKeywordModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [keyword, setKeyword] = useState('');
  const [aliasAdvisory, setAliasAdvisory] = useState<string | null>(null);

  const handleInputChange = (val: string) => {
    setKeyword(val);
    const lower = val.trim().toLowerCase();
    const resolved = ALIASES[lower];
    if (resolved && resolved !== lower) {
      setAliasAdvisory(`Did you mean the canonical skill "${resolved.toUpperCase()}"?`);
    } else {
      setAliasAdvisory(null);
    }
  };

  const handleConfirm = () => {
    if (!keyword.trim()) return;
    onAdd(keyword.trim());
    setKeyword('');
    setAliasAdvisory(null);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      title="Add Custom Skill / Keyword"
      description="Enter a technical skill or tool to evaluate recruiter search volume."
      className="max-w-sm"
    >
      <div className="space-y-3 pt-2">
        <Input
          value={keyword}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g. Kafka, Docker, Redis"
          className="bg-slate-950/60 border-white/10 text-white text-xs"
        />

        {aliasAdvisory && (
          <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/30">
            {aliasAdvisory}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} className="bg-[#FF7582] text-slate-950 font-bold text-xs">
            Add Skill
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
