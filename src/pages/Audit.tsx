import { useAudit } from "@/hooks/useCleaning";
import { groupAuditEntries } from "@/utils/groupAuditEntries";
import { useLocation } from "react-router-dom";

interface AuditEntry {
  id: number;
  changed_by: string | null;
  changed_at: string | null;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  createdAt: string;
}

function formatValue(v: string | null) {
  if (v === null) return <span className="text-gray-400 italic">empty</span>;
  if (v === "") return <span className="text-gray-400 italic">empty</span>;
  return v;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

function Audit() {
  const location = useLocation();
  const id = location.state?.id;
  const { data, isLoading, isError, error } = useAudit(id);

  if (isLoading)
    return <div className="p-6 text-gray-500">Loading audit trail…</div>;
  if (isError)
    return (
      <div className="p-6 text-red-600">
        Failed to load audit trail: {String(error)}
      </div>
    );

  const record: any = data?.data;
  const auditEntries: AuditEntry[] = record?.audit ?? [];

  if (auditEntries.length === 0) {
    return (
      <div className="p-6 text-gray-500">No audit history for this record.</div>
    );
  }

  const events = groupAuditEntries(auditEntries);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-1">Audit Trail — Record</h1>
      <p className="text-sm text-gray-500 mb-6">
        {record.cleanedBy} · {record.method} · status:{" "}
        <span
          className={
            record.status == "pending" ? "text-red-400" : "text-green-400"
          }
        >
          {record.status}
        </span>
      </p>

      <div className="space-y-4">
        {events.map((event) => {
          const { timestamp, changedBy, isCreation, changes } = event;
          
          return (
            <div
              key={timestamp}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  {isCreation
                    ? "Created"
                    : `Changed by ${changedBy || "unknown"}`}
                </span>
                <span>{formatDate(timestamp)}</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {changes.map((e) => (
                    <tr key={e.id} className="border-t border-gray-100">
                      <td className="py-2 pr-3 font-medium text-gray-700 w-28">
                        {e.field_name}
                      </td>
                      <td className="py-2 pr-2 text-gray-400">
                        {formatValue(e.old_value)}
                      </td>
                      <td className="py-2 pr-2 text-gray-400">→</td>
                      <td className="py-2 text-gray-900">
                        {formatValue(e.new_value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Audit;
