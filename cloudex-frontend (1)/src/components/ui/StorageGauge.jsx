import { formatBytes } from "../../utils/format";

export default function StorageGauge({ usedBytes = 0, limitBytes = 1, size = 128 }) {
  const pct = Math.min(100, (usedBytes / limitBytes) * 100 || 0);
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const color = pct > 90 ? "#EF5B4E" : pct > 70 ? "#F5A623" : "#3654FF";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E4E7EE"
            strokeWidth="10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-semibold text-ink">
            {pct.toFixed(0)}%
          </span>
          <span className="text-[11px] text-ink-faint font-mono">used</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-mono text-xs text-ink-muted">
          {formatBytes(usedBytes)} <span className="text-ink-faint">of</span>{" "}
          {formatBytes(limitBytes)}
        </p>
      </div>
    </div>
  );
}
