import type { LayoutSnapshot } from '../../types/layouts';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export function toJSON(snapshot: LayoutSnapshot) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), snapshot }, null, 2);
}

export function fromJSON(input: string): LayoutSnapshot {
  const parsed: unknown = JSON.parse(input);
  if (!isRecord(parsed) || !isRecord(parsed.snapshot)) throw new Error('Invalid Meridian layout file.');
  const snapshot = parsed.snapshot;
  if (!Array.isArray(snapshot.widgets) || !Array.isArray(snapshot.layout)) throw new Error('Layout file is missing widgets or grid positions.');
  return { widgets: snapshot.widgets as LayoutSnapshot['widgets'], layout: snapshot.layout as LayoutSnapshot['layout'] };
}

export function downloadJSON(filename: string, json: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
