"use client";

import { useState } from "react";
import { fetchAllPropertiesForPriority } from "@/actions/supabase/queries/properties";
import { computeWateringPriorityScore } from "@/lib/wateringPriorityScore";

export default function PrioritiesPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAlgorithm() {
    setLoading(true);
    setError(null);
    setText("");
    try {
      const rows = await fetchAllPropertiesForPriority();
      const asOf = new Date();
      const lines = rows.map(row => {
        const priority_score = computeWateringPriorityScore(row.prev_watered, {
          asOf,
        });
        return {
          id: row.id,
          address: row.address ?? "",
          prev_watered: row.prev_watered,
          priority_score,
        };
      });
      lines.sort((a, b) => b.priority_score - a.priority_score);
      setText(
        [
          `asOf: ${asOf.toISOString()}`,
          `count: ${lines.length}`,
          "",
          ...lines.map(
            row =>
              `${row.id}\t${row.address}\tprev_watered=${row.prev_watered ?? "null"}\tpriority_score=${row.priority_score.toFixed(4)}`,
          ),
        ].join("\n"),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={runAlgorithm} disabled={loading}>
        {loading ? "Running…" : "Run priority algorithm"}
      </button>
      {error ? <pre>{error}</pre> : null}
      {text ? <pre>{text}</pre> : null}
    </div>
  );
}
