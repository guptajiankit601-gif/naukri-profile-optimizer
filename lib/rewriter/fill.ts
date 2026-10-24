/**
 * Slot filling helper for deterministic bullet rewriting
 */

export interface BulletSlot {
  key: string;
  label: string;
  placeholder: string;
  example: string;
  value?: string;
}

export function extractSlotsFromTemplate(templateText: string): BulletSlot[] {
  const matches = templateText.match(/\[(.*?)\]/g) || [];
  return matches.map(m => {
    const content = m.replace(/[\[\]]/g, '');
    return {
      key: content.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      label: content,
      placeholder: content,
      example: content.includes('metric') ? '35% reduction' : '20k TPS'
    };
  });
}

export function fillTemplateSlots(templateText: string, slotValues: Record<string, string>): string {
  let result = templateText;
  for (const [key, value] of Object.entries(slotValues)) {
    if (!value) continue;
    // Replace bracketed placeholders matching key or generalized metric
    result = result.replace(new RegExp(`\\[[^\\]]*${key}[^\\]]*\\]`, 'gi'), value);
    result = result.replace(/\[Insert your metric[^\]]*\]/gi, value);
  }
  return result;
}
