interface AuditEntry {
  id: number;
  changed_by: string | null;
  changed_at: string | null;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  createdAt: string;
}

export interface AuditEvent {
  timestamp: string;
  changedBy: string | null;
  isCreation: boolean;
  changes: AuditEntry[];
}

export function groupAuditEntries(entries: AuditEntry[]): AuditEvent[] {
  const eventKey = (e: AuditEntry) => e.changed_at ?? e.createdAt;

  const grouped = entries.reduce<Record<string, AuditEntry[]>>((acc, entry) => {
    const key = eventKey(entry);
    (acc[key] ??= []).push(entry);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([timestamp, group]) => {
      const isCreation = group[0].changed_by === null;
      const changes = group.filter((e) => isCreation || e.old_value !== e.new_value);
      return { timestamp, changedBy: group[0].changed_by, isCreation, changes };
    })
    .filter((event) => event.changes.length > 0)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}