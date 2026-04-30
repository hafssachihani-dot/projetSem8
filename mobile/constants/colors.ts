export const Colors = {
  primary: '#22C55E',
  accent: '#F59E0B',
  destructive: '#EF4444',
  background: '#F4F6F9',
  card: '#FFFFFF',
  sidebar: '#1E293B',
  border: '#E2E8F0',
  muted: '#F1F5F9',
  slate: '#334155',
  slateLight: '#64748B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
} as const;

export type ColorKey = keyof typeof Colors;
