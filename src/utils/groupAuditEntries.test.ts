import { describe, it, expect } from 'vitest';
import { groupAuditEntries } from './groupAuditEntries';

// trimmed version of the real response you got back earlier
const sampleEntries = [
  { id: 40, changed_by: null, changed_at: null, field_name: 'cleanedBy', old_value: null, new_value: 'anthony', createdAt: '2026-09-10T12:38:07.066Z' },
  { id: 41, changed_by: null, changed_at: null, field_name: 'cleanedAt', old_value: null, new_value: '', createdAt: '2026-09-10T12:38:07.066Z' },
  { id: 45, changed_by: 'abc', changed_at: '2026-09-10T14:31:33.360Z', field_name: 'notes', old_value: 'Standard cycle', new_value: 'Standard cycle', createdAt: '2026-09-10T14:31:33.372Z' },
  { id: 46, changed_by: 'abc', changed_at: '2026-09-10T14:31:33.362Z', field_name: 'status', old_value: 'pending', new_value: 'pending', createdAt: '2026-09-10T14:31:33.372Z' },
  { id: 60, changed_by: 'me', changed_at: '2026-09-10T16:32:51.234Z', field_name: 'notes', old_value: 'not finished kama sarini ye jaye', new_value: 'not finished kama sarini ye jaye khatam hua finally', createdAt: '2026-09-10T16:32:51.235Z' },
  { id: 61, changed_by: 'me', changed_at: '2026-09-10T16:32:51.234Z', field_name: 'status', old_value: 'pending', new_value: 'verified', createdAt: '2026-09-10T16:32:51.235Z' },
];

describe('groupAuditEntries', () => {
  it('marks the creation event correctly and keeps all fields even when new_value is empty', () => {
    const events = groupAuditEntries(sampleEntries);
    const creationEvent = events[0];
    expect(creationEvent.isCreation).toBe(true);
    expect(creationEvent.changes).toHaveLength(2);
  });

  it('drops no-op entries where old_value equals new_value', () => {
    const events = groupAuditEntries(sampleEntries);
    // the "abc" event (ids 45, 46) has old === new on both fields — should vanish entirely
    const abcEvent = events.find((e) => e.changedBy === 'abc');
    expect(abcEvent).toBeUndefined();
  });

  it('keeps a real update event and preserves its changed fields', () => {
    const events = groupAuditEntries(sampleEntries);
    const finalEvent = events[events.length - 1];
    expect(finalEvent.changedBy).toBe('me');
    expect(finalEvent.changes).toHaveLength(2);
    expect(finalEvent.changes.map((c) => c.field_name)).toEqual(['notes', 'status']);
  });

  it('sorts events chronologically', () => {
    const events = groupAuditEntries(sampleEntries);
    const timestamps = events.map((e) => new Date(e.timestamp).getTime());
    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
  });

  it('returns an empty array for no entries', () => {
    expect(groupAuditEntries([])).toEqual([]);
  });
});