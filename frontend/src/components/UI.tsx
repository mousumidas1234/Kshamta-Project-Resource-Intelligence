import {
  Briefcase,
  ListTodo,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Users,
  TrendingDown,
  Percent,
  Shield,
  ClipboardList,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

// Maps labels to clean descriptive Lucide icons for visual representation in cards
function getIconForLabel(label: string) {
  const norm = label.toLowerCase().replaceAll('_', ' ');
  if (norm.includes('project') && norm.includes('risk')) return AlertOctagon;
  if (norm.includes('project')) return Briefcase;
  if (norm.includes('total task') || norm.includes('tasks')) return ListTodo;
  if (norm.includes('open task') || norm.includes('open actions')) return Clock;
  if (norm.includes('overdue')) return AlertTriangle;
  if (norm.includes('completion') || norm.includes('closed task')) return CheckCircle2;
  if (norm.includes('employee') && norm.includes('attrition')) return TrendingDown;
  if (norm.includes('employee') || norm.includes('users')) return Users;
  if (norm.includes('rate') || norm.includes('probability')) return Percent;
  if (norm.includes('safety')) return Shield;
  if (norm.includes('form') || norm.includes('kpi')) return ClipboardList;
  if (norm.includes('action') || norm.includes('workload')) return Layers;
  if (norm.includes('performance')) return TrendingUp;
  return HelpCircle;
}

// Determines the color theme of the KPI based on its semantic nature
function getColorsForLabel(label: string) {
  const norm = label.toLowerCase();
  if (norm.includes('overdue') || norm.includes('risk') || norm.includes('attrition_rate') || norm.includes('shortfall')) {
    return {
      bg: 'bg-rose-50 border-rose-100',
      icon: 'bg-rose-100 text-rose-600',
      text: 'text-rose-950',
    };
  }
  if (norm.includes('completion') || norm.includes('closed') || norm.includes('active')) {
    return {
      bg: 'bg-emerald-50 border-emerald-100',
      icon: 'bg-emerald-100 text-emerald-600',
      text: 'text-emerald-950',
    };
  }
  if (norm.includes('warning') || norm.includes('medium')) {
    return {
      bg: 'bg-amber-50 border-amber-100',
      icon: 'bg-amber-100 text-amber-600',
      text: 'text-amber-950',
    };
  }
  // Default Indigo branding colors
  return {
    bg: 'bg-indigo-50/50 border-indigo-100/50',
    icon: 'bg-indigo-100/70 text-indigo-600',
    text: 'text-slate-900',
  };
}

export function KPI({ label, value }: { label: string; value: any }) {
  const IconComponent = getIconForLabel(label);
  const colors = getColorsForLabel(label);

  return (
    <div className={`rounded-2xl border border-slate-100 shadow-sm card-design flex items-center justify-between gap-4`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
          {label}
        </p>
        <p className={`mt-2.5 text-2xl font-black tracking-tight ${colors.text}`}>
          {value}
        </p>
      </div>
      <div className={`rounded-xl p-3 shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105 ${colors.icon}`}>
        <IconComponent className="h-6 w-6 stroke-[2.25]" />
      </div>
    </div>
  );
}

export function Badge({ value }: { value: string }) {
  const val = String(value).trim().toLowerCase();
  
  let classes = 'bg-slate-50 text-slate-600 border-slate-200/60';
  
  if (
    val === 'high' ||
    val === 'avoid' ||
    val === 'inactive' ||
    val === 'critical' ||
    val === 'urgent'
  ) {
    classes = 'bg-rose-50 text-rose-700 border-rose-100';
  } else if (
    val === 'medium' ||
    val === 'consider' ||
    val === 'warning' ||
    val === 'shortfall'
  ) {
    classes = 'bg-amber-50 text-amber-700 border-amber-100';
  } else if (
    val === 'low' ||
    val === 'recommended' ||
    val === 'active' ||
    val === 'complete' ||
    val === 'completed' ||
    val === 'closed' ||
    val === 'success' ||
    val === 'optimal'
  ) {
    classes = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  } else if (
    val === 'admin' ||
    val === 'project manager' ||
    val === 'hr manager' ||
    val === 'manager'
  ) {
    classes = 'bg-indigo-50 text-indigo-700 border-indigo-100';
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide shadow-sm/5 transition-colors duration-200 ${classes}`}>
      {value}
    </span>
  );
}

export function Table({ rows }: { rows: any[] }) {
  if (!rows?.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-semibold text-slate-400">No data is available for this selection.</p>
      </div>
    );
  }

  // Filter out system metadata keys
  const cols = Object.keys(rows[0]).filter(
    (k) => !['task_records', 'tasks', 'prediction'].includes(k)
  );

  const formatHeader = (col: string) => {
    return col
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderCell = (col: string, val: any) => {
    const stringVal = String(val);
    const lowerVal = stringVal.toLowerCase();

    // 1. Badge checking: For categorical flags and recommendation actions
    const badgeColumns = ['status', 'recommendation', 'risk_level', 'risk_category', 'priority', 'role_level', 'department'];
    const badgeValues = ['high', 'medium', 'low', 'active', 'inactive', 'avoid', 'consider', 'recommended', 'critical', 'urgent', 'complete', 'completed', 'closed', 'admin', 'project manager', 'hr manager'];
    
    if (badgeColumns.includes(col.toLowerCase()) || badgeValues.includes(lowerVal)) {
      return <Badge value={stringVal} />;
    }

    // 2. Suitability score formatting: Percentage with vertical progress bar
    if (col.toLowerCase().includes('suitability_score')) {
      const score = Number(val);
      let barColor = 'bg-rose-500';
      if (score >= 80) barColor = 'bg-emerald-500';
      else if (score >= 60) barColor = 'bg-indigo-500';
      else if (score >= 40) barColor = 'bg-amber-500';

      return (
        <div className="flex items-center gap-3">
          <span className="w-10 font-bold text-slate-800">{score}%</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 hidden sm:block">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      );
    }

    // 3. Capacity gap indicator: Color coded +/-
    if (col.toLowerCase().includes('capacity_gap')) {
      const num = Number(val);
      if (num < 0) {
        return <span className="font-semibold text-rose-600">{num} hrs</span>;
      }
      return <span className="font-semibold text-emerald-600">+{num} hrs</span>;
    }

    // 4. Time and workloads
    if (
      col.toLowerCase().includes('weekly_hours') ||
      col.toLowerCase().includes('weekly_workload') ||
      col.toLowerCase().includes('available_simulated_capacity') ||
      col.toLowerCase().includes('required_workload') ||
      col.toLowerCase() === 'hours' ||
      col.toLowerCase() === 'avg_weekly_hours font-bold'
    ) {
      return <span className="text-slate-700">{Number(val).toFixed(1).replace('.0', '')} hrs</span>;
    }

    // 5. Exclude / description fields wrapping
    if (col.toLowerCase().includes('explanation') || col.toLowerCase().includes('cause')) {
      return (
        <div className="max-w-xs sm:max-w-md text-xs text-slate-500 whitespace-normal leading-relaxed">
          {stringVal}
        </div>
      );
    }

    // 6. Identity fields (Ids, names)
    if (
      col.toLowerCase().includes('id') ||
      col.toLowerCase() === 'project' ||
      col.toLowerCase() === 'name' ||
      col.toLowerCase() === 'full_name' ||
      col.toLowerCase() === 'username'
    ) {
      return <span className="font-semibold text-slate-900">{stringVal}</span>;
    }

    // 7. General percentages (e.g. completion rate)
    if (col.toLowerCase().includes('rate')) {
      return <span className="font-bold text-slate-800">{Number(val).toFixed(1).replace('.0', '')}%</span>;
    }

    // 8. Fallback numerical cell formatting
    if (typeof val === 'number') {
      return <span className="text-slate-800 font-medium">{Number(val).toFixed(1).replace('.0', '')}</span>;
    }

    return <span className="text-slate-600">{stringVal}</span>;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm card-design">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              {cols.map((c) => (
                <th className="whitespace-nowrap px-6 py-4" key={c}>
                  {formatHeader(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr
                className="hover:bg-slate-50/50 transition-colors duration-200"
                key={i}
              >
                {cols.map((c) => (
                  <td className="whitespace-nowrap px-6 py-4 align-middle" key={c}>
                    {renderCell(c, r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
