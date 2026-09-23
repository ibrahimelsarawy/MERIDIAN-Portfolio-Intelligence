import { describe, expect, it } from 'vitest';
import { fromJSON, toJSON } from './layoutSerializer';

const snapshot = {
  widgets: [{ instanceId: 'w-1', widgetId: 'portfolio-allocation', config: {} }],
  layout: [{ i: 'w-1', x: 0, y: 0, w: 4, h: 3 }],
};

describe('layoutSerializer', () => {
  it('round-trips a dashboard snapshot', () => {
    expect(fromJSON(toJSON(snapshot))).toEqual(snapshot);
  });

  it('rejects files without a snapshot', () => {
    expect(() => fromJSON('{"version":1}')).toThrow('Invalid Meridian layout file.');
  });

  it('rejects malformed snapshots', () => {
    expect(() => fromJSON('{"snapshot":{"widgets":[]}}')).toThrow('Layout file is missing widgets or grid positions.');
  });
});
