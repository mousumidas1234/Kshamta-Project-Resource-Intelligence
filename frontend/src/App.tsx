import { useEffect, useState } from 'react';
import { api } from './services/api';
import type { User, ManagedUser } from './types';
import { KPI, Badge, Table } from './components/UI';
import { Chart } from './components/Chart';
import {
  LayoutDashboard,
  Home,
  BarChart3,
  AlertTriangle,
  Users,
  UserCheck,
  Brain,
  ShieldAlert,
  FolderKanban,
  Contact,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Plus,
  Key,
  Users2,
  Info,
  Sliders,
  Play,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  Mail,
  Lock,
  UserCircle,
  AlertOctagon,
  Shield
} from 'lucide-react';

const permissions: Record<string, string[]> = {
  Admin: [
    'Home',
    'Dashboard',
    'Project Analytics',
    'Project Risk',
    'Workforce Analytics',
    'Resource Recommendation',
    'What-If Simulation',
    'Attrition Prediction',
    'Project Details',
    'Employee Details',
    'User Management'
  ],
  'Project Manager': [
    'Home',
    'Dashboard',
    'Project Analytics',
    'Project Risk',
    'Resource Recommendation',
    'What-If Simulation',
    'Project Details'
  ],
  'HR Manager': [
    'Home',
    'Dashboard',
    'Workforce Analytics',
    'Attrition Prediction',
    'Employee Details'
  ],
  Employee: ['Home', 'Dashboard', 'My Work']
};

const labels: Record<string, string> = {
  total_projects: 'Total Projects',
  total_tasks: 'Total Tasks',
  total_forms: 'Total Forms',
  open_tasks: 'Open Tasks',
  overdue_tasks: 'Overdue Tasks',
  completion_rate: 'Completion Rate',
  average_project_risk: 'Average Project Risk',
  total_employees: 'Total Employees',
  employee_attrition_rate: 'Employee Attrition Rate'
};

// Modern Dashboard Sidebar Navigation Groups
const navGroups = [
  {
    title: 'Overview',
    items: [{ name: 'Dashboard', icon: LayoutDashboard }]
  },
  {
    title: 'Project Intelligence',
    items: [
      { name: 'Project Analytics', icon: BarChart3 },
      { name: 'Project Details', icon: FolderKanban },
      { name: 'Project Risk', icon: AlertTriangle }
    ]
  },
  {
    title: 'Workforce Intelligence',
    items: [
      { name: 'Workforce Analytics', icon: Users },
      { name: 'Employee Details', icon: Contact }
    ]
  },
  {
    title: 'My Workspace',
    items: [{ name: 'My Work', icon: UserCircle }]
  },
  {
    title: 'Simulations & ML',
    items: [
      { name: 'Resource Recommendation', icon: UserCheck },
      { name: 'What-If Simulation', icon: Brain },
      { name: 'Attrition Prediction', icon: ShieldAlert }
    ]
  },
  {
    title: 'System',
    items: [{ name: 'User Management', icon: Settings }]
  }
];

function Landing({ onExplore, onSignIn }: { onExplore: () => void; onSignIn: () => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white relative flex flex-col justify-between">
      {/* Background Decorative Blobs */}
      <div className="pointer-events-none absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-20 bottom-10 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" className="h-11 rounded-xl bg-white p-1 shadow-md shadow-white/5" />
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-350 md:flex">
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#roles" className="hover:text-white transition-colors">Demo Roles</a>
          <button
            onClick={onSignIn}
            className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-2.5 text-white hover:bg-slate-900 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer"
          >
            Sign In
          </button>
        </nav>
        <button
          onClick={onSignIn}
          className="rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-white md:hidden hover:border-indigo-400"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto w-full max-w-7xl grid gap-14 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-10 lg:pb-24 lg:pt-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Enterprise Intelligence Hub</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl text-white">
            Project Intelligence <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
              &amp; Resource Analytics
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-350">
            KSHAMTA integrates operational project statistics, risk analytics, simulated workforce matching, and machine learning-powered attrition forecasting into one real-time enterprise management platform.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={onExplore}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-2"
            >
              Explore Demo Sandbox <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onSignIn}
              className="rounded-xl border border-slate-750 bg-slate-900/30 px-6 py-4 text-sm font-bold text-white hover:bg-slate-900 hover:border-indigo-400 transition-all cursor-pointer"
            >
              Access Account
            </button>
          </div>
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">KSHAMTA Control Panel</p>
              <p className="mt-1 text-lg font-bold text-white">Intelligence Summary</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 hover:border-indigo-500/20 transition-colors">
              <p className="text-xs font-semibold text-slate-400">Project Delivery Health</p>
              <p className="mt-3 text-3xl font-black text-white">360°</p>
              <p className="mt-2.5 text-xs font-semibold text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Risk-aware tracking
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 hover:border-teal-500/20 transition-colors">
              <p className="text-xs font-semibold text-slate-400">Workforce Analytics</p>
              <p className="mt-3 text-3xl font-black text-white">ML-Driven</p>
              <p className="mt-2.5 text-xs font-semibold text-teal-400 flex items-center gap-1">
                <Brain className="h-3.5 w-3.5" /> Predictive insights
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-400" /> Multi-Perspective Portal
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-350">
              Access tailored workflows built specifically for Administrator, Project Director, and HR executive needs.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="bg-white px-6 py-20 text-slate-900 border-t border-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Built for Action</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl text-slate-900">Decisions Powered by Real Analytics</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<FolderKanban className="h-6 w-6 text-indigo-600" />}
              title="Project Intelligence"
              text="Monitor project deadlines, task completions, and identify operational blockers with customized risk metrics."
            />
            <Feature
              icon={<Sliders className="h-6 w-6 text-teal-650" />}
              title="Simulated Resource Recommendation"
              text="Score employee credentials and availability dynamically against project requirements without affecting historical logs."
            />
            <Feature
              icon={<Brain className="h-6 w-6 text-purple-600" />}
              title="Workforce & Attrition Predictor"
              text="Forecast attrition probabilities using scikit-learn models based on satisfaction levels, performance history, and salary."
            />
          </div>
        </div>
      </section>

      {/* Demo Roles Info */}
      <section id="roles" className="bg-slate-50 px-6 py-16 text-slate-900 border-t border-slate-250/20">
        <div className="mx-auto max-w-7xl flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Try KSHAMTA Sandbox</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Choose a Demo Persona</h2>
            <p className="mt-2 text-slate-500 text-sm">Explore restricted workspaces populated with mock operational data.</p>
          </div>
          <button
            onClick={onExplore}
            className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-600 shadow-md transition-all cursor-pointer shrink-0"
          >
            Launch Demo Portal
          </button>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-350 flex flex-col gap-4">
      <div className="rounded-xl bg-slate-50 w-12 h-12 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
      </div>
    </article>
  );
}

const demoRoles = [
  {
    role: 'Admin' as const,
    title: 'Platform Administrator',
    text: 'Unrestricted control over system dashboard, analytical views, simulations, and user account configurations.',
    color: 'border-indigo-100 bg-indigo-500/5 text-indigo-650 hover:border-indigo-300'
  },
  {
    role: 'Project Manager' as const,
    title: 'Project Lead / Director',
    text: 'Focuses on task monitoring, overdue analytics, risk estimation, dynamic resource suggestion, and replacement modelling.',
    color: 'border-teal-100 bg-teal-500/5 text-teal-650 hover:border-teal-300'
  },
  {
    role: 'HR Manager' as const,
    title: 'HR Business Partner',
    text: 'Accesses workforce characteristics, absence records, employee histories, and the attrition forecasting pipeline.',
    color: 'border-purple-100 bg-purple-500/5 text-purple-650 hover:border-purple-300'
  },
  { role: 'Employee' as const, title: 'Employee Workspace', text: 'Review assigned projects, assigned tasks, workload, and update your own task status.', color: 'border-sky-100 bg-sky-500/5 text-sky-650 hover:border-sky-300' }
];

function DemoChooser({ onBack, onEnter }: { onBack: () => void; onEnter: (role: User['role']) => void }) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white relative flex flex-col justify-center">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <button onClick={onBack} className="text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer">
          ← Back to home
        </button>
        <div className="mt-8 flex items-center justify-between">
          <img src="/logo.svg" className="h-11 rounded-xl bg-white p-1" />
        </div>
        <div className="mt-12 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Sandbox</span>
          </div>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Select Demo Role</h1>
          <p className="mt-4 text-slate-350 text-base leading-relaxed">
            Choose a demo account profile. No passwords are required for demo role environments, allowing you to preview user capabilities.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoRoles.map(({ role, title, text, color }) => (
            <article key={role} className={`flex flex-col justify-between rounded-2xl border bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-350 hover:bg-slate-900 ${color}`}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10">
                  {role}
                </span>
                <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-350">{text}</p>
              </div>
              <button
                onClick={() => onEnter(role)}
                className="mt-8 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white transition-all shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
              >
                Launch {role} Dashboard
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function Login({ onLogin, onBack }: { onLogin: (u: User) => void; onBack: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const r = await api.login(username, password);
      localStorage.setItem('kshamta_token', r.access_token);
      onLogin(r.user);
    } catch (e: any) {
      setError(e.message || 'Incorrect credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-5 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl" />

      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl relative z-10">
        <button type="button" onClick={onBack} className="mb-6 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer">
          ← Back to home
        </button>
        <img src="/logo.svg" className="h-12 rounded-xl bg-slate-50 p-1" />
        <h1 className="mt-6 text-2xl font-black text-slate-900">Sign in to KSHAMTA</h1>
        <p className="mt-1 text-xs text-slate-500">Project Intelligence &amp; Resource Analytics Platform</p>

        <div className="mt-6 rounded-xl border border-indigo-50 bg-indigo-500/5 p-3.5 text-xs leading-relaxed text-indigo-800">
          Sign in with your configured employee account credentials. Default admin details can be found in the documentation guide.
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <UserCircle className="h-5 w-5" />
              </span>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-xl border border-slate-250 pl-11 pr-4 py-3 text-slate-805 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-250 pl-11 pr-4 py-3 text-slate-805 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? 'Verifying Credentials...' : 'Access Workspace'}
        </button>
      </form>
    </main>
  );
}

function Dashboard() {
  const [d, setD] = useState<any>();
  useEffect(() => {
    api.dashboard().then(setD);
  }, []);

  if (!d) return <Loading />;

  return (
    <Page title="Executive Dashboard" subtitle="Enterprise project status telemetry and workforce parameters.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(d.metrics).map(([k, v]) => (
          <KPI key={k} label={labels[k] || k} value={k.includes('rate') ? `${v}%` : v} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Chart title="Tasks by Project" data={d.project_charts.tasks_by_project} />
        <Chart title="Task Status Distribution" data={d.project_charts.tasks_by_status} x="Status" pie />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-base font-bold uppercase tracking-wider text-slate-450 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-500" /> Top Project Risks
        </h2>
        <Table rows={d.top_risks} />
      </div>
    </Page>
  );
}

function Projects({ detail = false, canEdit = false }: { detail?: boolean; canEdit?: boolean }) {
  const [d, setD] = useState<any>();
  const [project, setProject] = useState('');
  const [savingProject, setSavingProject] = useState(false);
  const [savingTask, setSavingTask] = useState<number | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    api.analytics().then(setD);
  }, []);

  useEffect(() => {
    if (project) api.project(project).then(setD);
    if (project && canEdit) Promise.all([api.employees(), api.getProjectAssignments(project)]).then(([all, assigned]) => { setEmployees(all); setAssignments(assigned); }).catch(() => undefined);
  }, [project, canEdit]);

  const assignEmployee = async () => {
    if (!project || !selectedEmployee) return;
    try { await api.assignProjectEmployee(project, Number(selectedEmployee)); setAssignments(await api.getProjectAssignments(project)); setSelectedEmployee(''); }
    catch (e: any) { window.alert(e.message || 'Assignment failed.'); }
  };

  const saveProject = async () => {
    setSavingProject(true);
    try {
      await api.updateProject(d.project, { name: d.name, status: d.status, priority: d.priority, deadline: d.deadline || null });
      setD(await api.project(d.project));
    } catch (e: any) {
      window.alert(e.message || 'Project update failed.');
    } finally {
      setSavingProject(false);
    }
  };

  const saveTaskStatus = async (taskId: number, status: string) => {
    setSavingTask(taskId);
    try {
      await api.updateTaskStatus(taskId, status);
      setD(await api.project(d.project));
    } catch (e: any) {
      window.alert(e.message || 'Task status update failed.');
    } finally {
      setSavingTask(null);
    }
  };

  if (!d) return <Loading />;

  const metricLabels: Record<string, string> = { total_tasks: 'Total Tasks', open_tasks: 'Open Tasks', closed_tasks: 'Closed Tasks', overdue_tasks: 'Overdue Tasks', completion_rate: 'Completion Rate', safety_tasks: 'Safety Tasks', high_priority_tasks: 'High Priority Tasks', total_forms: 'Total Forms', open_actions: 'Open Actions', total_actions: 'Total Actions' };
  const metricCards = Object.entries(d.metrics).filter(([key]) => metricLabels[key]);

  const breakdownRows = d.breakdowns
    ? Object.entries(d.breakdowns).flatMap(([type, items]: any) =>
        (items as any[]).map((x: any) => ({ breakdown: type, ...x }))
      )
    : [];

  if (detail) {
    return (
      <Page title="Project Details" subtitle="Granular analysis of project tasks, priorities, and workflow breakdowns.">
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm max-w-md">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Project Code
          </label>
          <select
            onChange={(e) => setProject(e.target.value)}
            className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          >
            <option value="">Choose project option...</option>
            {d.filters?.projects?.map((p: string) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        {d.project ? (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xl font-extrabold text-slate-900">Project: {d.project}</h2>
            </div>
            {d.metrics && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Object.entries(d.metrics)
                  .filter(([k]) => k !== 'project')
                  .map(([k, v]) => (
                    <KPI key={k} label={k.replaceAll('_', ' ')} value={v} />
                  ))}
              </div>
            )}
            {canEdit && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Name<input value={d.name || ''} onChange={(e) => setD({ ...d, name: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800" /></label>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Status<select value={d.status || 'Active'} onChange={(e) => setD({ ...d, status: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800"><option>Active</option><option>On Hold</option><option>Completed</option><option>Cancelled</option></select></label>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority<select value={d.priority || 'Medium'} onChange={(e) => setD({ ...d, priority: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Deadline<input type="date" value={d.deadline || ''} onChange={(e) => setD({ ...d, deadline: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800" /></label>
                </div>
                <button onClick={saveProject} disabled={savingProject || !d.name?.trim()} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{savingProject ? 'Saving…' : 'Save Project Changes'}</button>
                <div className="mt-6 border-t border-indigo-100 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Resources</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row"><select aria-label="Select employee to assign" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800"><option value="">Select employee…</option>{employees.filter((e) => !assignments.some((a) => String(a.employee_id) === String(e.employee_id))).map((e) => <option key={e.employee_id} value={e.employee_id}>#{e.employee_id} · {e.department} · {e.role_level}</option>)}</select><button onClick={assignEmployee} disabled={!selectedEmployee} className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Assign Resource</button></div>
                  <div className="mt-3 flex flex-wrap gap-2">{assignments.length ? assignments.map((a) => <span key={a.employee_id} className="rounded-full border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">#{a.employee_id} · {a.department} · {a.role_level}</span>) : <span className="text-xs text-slate-400">No resources assigned yet.</span>}</div>
                </div>
              </div>
            )}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Breakdown Metrics</h3>
              <Table rows={breakdownRows} />
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Task Log Details</h3>
              <Table rows={d.tasks} />
              {canEdit && d.tasks?.length > 0 && (
                <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Authorized Task Status Updates</p>
                  <div className="space-y-2">
                    {d.tasks.map((task: any) => <div key={task.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-semibold text-slate-700">{task.Ref || `Task ${task.id}`} <span className="font-normal text-slate-400">· {task.Description || 'No description'}</span></span><select value={task.Status || ''} disabled={savingTask === task.id} onChange={(e) => saveTaskStatus(task.id, e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:w-44"><option>Open</option><option>In Progress</option><option>Closed</option><option>Completed</option><option>On Hold</option></select></div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm/5">
            <FolderKanban className="mx-auto h-8 w-8 text-slate-350 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Choose a project from the selector to load data records.</p>
          </div>
        )}
      </Page>
    );
  }

  return (
    <Page title="Project Analytics" subtitle="Aggregate telemetry of deliverables, priorities, and workflow statuses.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metricCards.map(([k, v]) => (
          <KPI key={k} label={metricLabels[k]} value={k === 'completion_rate' ? `${v}%` : v} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Chart title="Tasks by Project" data={d.charts.tasks_by_project} />
        <Chart title="Tasks by Status" data={d.charts.tasks_by_status} x="Status" pie />
        <Chart title="Task Group Distribution" data={d.charts.tasks_by_group} x="Task Group" />
        <Chart title="Overdue Tasks by Project" data={d.charts.overdue_by_project} />
      </div>
    </Page>
  );
}

function Risk() {
  const [d, setD] = useState<any>();
  useEffect(() => {
    api.risk().then(setD);
  }, []);

  if (!d) return <Loading />;

  return (
    <Page title="Project Risk Intelligence" subtitle={d.disclaimer}>
      <Table rows={d.projects} />
    </Page>
  );
}

function Workforce() {
  const [d, setD] = useState<any>();
  useEffect(() => {
    api.workforce().then(setD);
  }, []);

  if (!d) return <Loading />;

  return (
    <Page
      title="Workforce Analytics"
      subtitle="Overview of workforce distributions and observations. Excludes causal determinations."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(d.metrics).map(([k, v]) => (
          <KPI key={k} label={k.replaceAll('_', ' ')} value={k === 'attrition_rate' ? `${v}%` : v} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Chart title="Employees by Department" data={d.charts.employees_by_department} x="department" />
        <Chart title="Observed Attrition by Department" data={d.charts.attrition_by_department} x="department" />
      </div>
    </Page>
  );
}

function Resource() {
  const [result, setResult] = useState<any>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    department: '',
    role_level: '',
    estimated_weekly_workload: 8,
    minimum_performance_rating: 3
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .employees()
      .then((e) => {
        setEmployees(e);
        setForm((f) => ({
          ...f,
          department: f.department || e[0]?.department || '',
          role_level: f.role_level || e[0]?.role_level || ''
        }));
      })
      .catch((e) => setError(e.message));
  }, []);

  const departments = [...new Set(employees.map((e) => e.department))];
  const roles = [...new Set(employees.map((e) => e.role_level))];

  const evaluate = () => {
    setError('');
    setIsSubmitting(true);
    api
      .recommend(form)
      .then((r) => {
        setResult(r);
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Page
      title="Simulated Resource Recommendation"
      subtitle="Evaluates matching candidates based on skill sets, department, performance, and capacity."
    >
      <div className="rounded-2xl border border-indigo-50 bg-indigo-500/5 p-4 mb-6 text-xs leading-relaxed text-indigo-905 flex items-start gap-3">
        <Info className="h-5 w-5 text-indigo-650 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Recommendation Methodology:</span> Standard calculations assume a baseline capacity threshold of 40 hours per week. Results represent simulation matching filters and do not change active operational project schedules.
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Department
            </label>
            <select
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            >
              <option value="">Choose department...</option>
              {departments.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Role Level
            </label>
            <select
              required
              value={form.role_level}
              onChange={(e) => setForm({ ...form, role_level: e.target.value })}
              className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            >
              <option value="">Choose role level...</option>
              {roles.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Estimated Weekly Workload
            </label>
            <input
              type="number"
              min="0"
              max="40"
              value={form.estimated_weekly_workload}
              onChange={(e) => setForm({ ...form, estimated_weekly_workload: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Min Performance Rating
            </label>
            <select
              value={form.minimum_performance_rating}
              onChange={(e) => setForm({ ...form, minimum_performance_rating: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            >
              {[0, 1, 2, 3, 4, 5].map((x) => (
                <option key={x} value={x}>
                  {x} or higher
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          disabled={!form.department || !form.role_level || isSubmitting}
          onClick={evaluate}
          className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm px-6 py-3.5 transition-all shadow-md shadow-indigo-500/10 hover:shadow-lg cursor-pointer inline-flex items-center gap-2"
        >
          <Play className="h-4 w-4" /> {isSubmitting ? 'Evaluating Matching Scores...' : 'Evaluate Suitability'}
        </button>
      </div>

      {result && (
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
            {result.disclaimer}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Simulated Recommendations
            </h3>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-100/70 border border-slate-200/50 px-3.5 py-1.5 rounded-xl shadow-xs shrink-0">
              <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span>
                <strong className="text-slate-800">Capacity Gap</strong> ={' '}
                <strong className="text-emerald-600">Available Capacity</strong> −{' '}
                <strong className="text-indigo-600">Required Workload</strong> (
                <strong className="text-rose-600 font-bold">negative values</strong> indicate a{' '}
                <strong className="text-rose-600 font-bold">shortfall constraint</strong>)
              </span>
            </div>
          </div>
          <Table rows={result.recommendations} />
        </div>
      )}
    </Page>
  );
}

function WhatIf() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [result, setResult] = useState<any>();
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const selected = employees.find((e) => String(e.employee_id) === id);

  useEffect(() => {
    api
      .employees()
      .then(setEmployees)
      .catch((e) => setError(e.message));
  }, []);

  const simulate = () => {
    setError('');
    setIsSimulating(true);
    api
      .whatIf(id)
      .then((r) => {
        setResult(r);
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsSimulating(false));
  };

  return (
    <Page
      title="What-If Resource Simulation"
      subtitle="Forecast organization workload impact if a specific team member becomes unavailable."
    >
      {error && (
        <div className="mb-6 rounded-lg bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Employee Profile
            </label>
            <select
              required
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setResult(undefined);
              }}
              className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
            >
              <option value="">Choose employee...</option>
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>
                  ID: {e.employee_id} — {e.department} — {e.role_level} — {e.avg_weekly_hours} hrs/wk — Performance: {e.performance_rating}
                </option>
              ))}
            </select>
          </div>
          <button
            disabled={!id || isSimulating}
            onClick={simulate}
            className="rounded-xl bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-sm px-6 py-3.5 shadow-md shadow-indigo-650/10 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> {isSimulating ? 'Running Model Simulation...' : 'Simulate Imbalance'}
          </button>
        </div>

        {selected && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
              <Contact className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Target Candidate Selected</p>
              <p className="mt-0.5 text-slate-850 font-bold">
                Employee {selected.employee_id} · {selected.department} · {selected.role_level} · {selected.avg_weekly_hours} hrs/week · Rating: {selected.performance_rating}
              </p>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(result)
              .filter(([k]) => !['replacement_recommendations', 'disclaimer', 'workload_impact'].includes(k))
              .map(([k, v]) => (
                <KPI key={k} label={k.replaceAll('_', ' ')} value={v} />
              ))}
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 flex items-start gap-3">
            <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-950">Workload Disruption Forecast</h4>
              <p className="mt-1 text-xs text-rose-800 leading-relaxed">
                {result.workload_impact}. The selected individual is automatically filtered out from matching replacements.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Simulated Replacement Matches (Top 10)
            </h3>
            <Table rows={result.replacement_recommendations} />
          </div>
        </div>
      )}
    </Page>
  );
}

function Form({ fields, set }: { fields: any; set: (x: any) => void }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(fields).map(([key, value]: any) => (
        <div key={key}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {key.replaceAll('_', ' ')}
          </label>
          <input
            type={typeof value === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) =>
              set({
                ...fields,
                [key]: typeof value === 'number' ? Number(e.target.value) : e.target.value
              })
            }
            className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-805 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>
      ))}
    </div>
  );
}

function Attrition() {
  const [result, setResult] = useState<any>();
  const [m, setM] = useState<any>();
  const [isEstimating, setIsEstimating] = useState(false);
  const [form, setForm] = useState({
    department: 'Engineering',
    role_level: 'Senior',
    monthly_salary: 60000,
    avg_weekly_hours: 40,
    projects_handled: 4,
    performance_rating: 3,
    absences_days: 10,
    job_satisfaction: 3
  });

  useEffect(() => {
    api.metrics().then(setM);
  }, []);

  const handlePredict = () => {
    setIsEstimating(true);
    api
      .predict(form)
      .then((r) => {
        setResult(r);
      })
      .catch((err) => alert(err.message))
      .finally(() => setIsEstimating(false));
  };

  // Radial Risk Meter Color Helper
  const getRiskMeterColor = (category: string) => {
    const norm = String(category).toLowerCase();
    if (norm.includes('high') || norm.includes('avoid')) return 'text-rose-500 border-rose-200 bg-rose-50';
    if (norm.includes('medium') || norm.includes('consider')) return 'text-amber-500 border-amber-200 bg-amber-50';
    return 'text-emerald-500 border-emerald-200 bg-emerald-50';
  };

  return (
    <Page
      title="Attrition Risk Prediction"
      subtitle="Evaluates employee attrition probabilities using Stratified Logistic Regression / Random Forest models."
    >
      <div className="rounded-2xl border border-indigo-50 bg-indigo-500/5 p-4 mb-6 text-xs leading-relaxed text-indigo-905 flex items-start gap-3">
        <Info className="h-5 w-5 text-indigo-605 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">ML Pipeline Disclaimer:</span> Predictions are statistical estimates generated by trained models and do not guarantee employee retention outcomes.
        </div>
      </div>

      {m && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Selector Status:</span>
            <Badge value={m.selected_model} />
          </div>
          <Table rows={Object.entries(m.metrics).map(([model, values]) => ({ model, ...(values as object) }))} />
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">Employee Parameters</h3>
        <Form fields={form} set={setForm} />
        <button
          onClick={handlePredict}
          disabled={isEstimating}
          className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm px-6 py-3.5 shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <Brain className="h-4 w-4" /> {isEstimating ? 'Calculating Coefficients...' : 'Estimate Attrition Probability'}
        </button>
      </div>

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-3 animate-fade-in">
          {/* Circular probability display */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">Probability Estimate</p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className={
                    result.risk_category.toLowerCase().includes('high')
                      ? 'stroke-rose-500'
                      : result.risk_category.toLowerCase().includes('medium')
                      ? 'stroke-amber-500'
                      : 'stroke-emerald-500'
                  }
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.probability)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-2xl font-black text-slate-900">{(result.probability * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm flex flex-col items-center justify-center text-center ${getRiskMeterColor(result.risk_category)}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Calculated Risk Tier</p>
            <Shield className="h-10 w-10 mb-3 stroke-[2.25]" />
            <span className="text-xl font-black">{result.risk_category}</span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center text-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Serialised Estimator</p>
            <Settings className="h-8 w-8 mb-3 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Model Version</span>
            <span className="mt-1 font-bold text-slate-900">{result.model_used}</span>
          </div>
        </div>
      )}
    </Page>
  );
}

function Employees() {
  const [e, setE] = useState<any[]>([]);
  const [x, setX] = useState<any>();
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    api.employees().then(setE);
  }, []);

  const handleSelectEmployee = (id: string) => {
    setSelectedId(id);
    if (id) {
      api.employee(id).then(setX);
    } else {
      setX(null);
    }
  };

  return (
    <Page title="Employee Analytics" subtitle="Review employee credentials, performance indicators, and departments.">
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm max-w-md">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Employee ID
        </label>
        <select
          value={selectedId}
          onChange={(ev) => handleSelectEmployee(ev.target.value)}
          className="w-full rounded-xl border border-slate-205 p-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
        >
          <option value="">Choose employee option...</option>
          {e.map((r) => (
            <option key={r.employee_id} value={r.employee_id}>
              {r.employee_id} — {r.department}
            </option>
          ))}
        </select>
      </div>

      {x ? (
        <div className="animate-fade-in space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Employee Details Panel</h3>
          <Table rows={[x]} />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm/5">
          <Contact className="mx-auto h-8 w-8 text-slate-350 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Select an employee from the list to display details.</p>
        </div>
      )}
    </Page>
  );
}

function MyWork() {
  const [data, setData] = useState<any>();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<number | null>(null);
  useEffect(() => { api.myWork().then(setData).catch((e) => setError(e.message)); }, []);
  const update = async (id: number, status: string) => {
    setSaving(id);
    try { await api.updateTaskStatus(id, status); setData(await api.myWork()); }
    catch (e: any) { setError(e.message); } finally { setSaving(null); }
  };
  if (!data) return error ? <Page title="My Work" subtitle={error}><div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div></Page> : <Loading />;
  return <Page title="My Work" subtitle="Your assigned projects, tasks, and current workload capacity.">
    {error && <div className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><KPI label="Assigned Projects" value={data.projects.length} /><KPI label="Assigned Tasks" value={data.tasks.length} /><KPI label="Assigned Workload" value={`${data.tasks.reduce((sum: number, t: any) => sum + Number(t.assigned_hours || 0), 0)} hrs`} /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><section><h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">My Projects</h2><Table rows={data.projects} /></section><section><h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">My Tasks</h2><div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">{data.tasks.length ? data.tasks.map((task: any) => <div key={task.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0 text-sm font-semibold text-slate-700 break-words">{task.Ref || `Task ${task.id}`} · {task.Description || 'No description'} <span className="text-xs text-slate-400">({task.assigned_hours || 0} hrs)</span></span><select aria-label={`Status for ${task.Ref || task.id}`} value={task.Status || ''} disabled={saving === task.id} onChange={(e) => update(task.id, e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:w-36"><option>Open</option><option>In Progress</option><option>Closed</option><option>Completed</option><option>On Hold</option></select></div>) : <p className="p-5 text-sm text-slate-400">No tasks assigned yet.</p>}</div></section></div>
  </Page>;
}

function UserManagement({ readOnly = false }: { readOnly?: boolean }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const blank = {
    full_name: '',
    username: '',
    password: '',
    confirm_password: '',
    role: 'Project Manager',
    status: 'Active'
  };
  const [form, setForm] = useState<any>(blank);

  const load = () =>
    api
      .users()
      .then(setUsers)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const close = () => {
    setModal(null);
    setSelected(null);
    setError('');
    setForm(blank);
  };

  const save = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      if (modal === 'create') {
        if (!form.password || form.password !== form.confirm_password) {
          throw new Error('Passwords do not match');
        }
        await api.createUser(form);
        setMessage('User created successfully.');
      } else {
        await api.updateUser(selected!.id, {
          full_name: form.full_name,
          username: form.username,
          role: form.role,
          status: form.status,
          employee_id: form.employee_id || null
        });
        setMessage('User settings updated.');
      }
      close();
      load();
    } catch (x: any) {
      setError(x.message || 'Operation failed.');
    }
  };

  const edit = (u: ManagedUser) => {
    setSelected(u);
    setForm({ ...u, password: '', confirm_password: '' });
    setModal('edit');
    setError('');
  };

  const toggle = async (u: ManagedUser) => {
    try {
      await api.updateUser(u.id, {
        full_name: u.full_name,
        username: u.username,
        role: u.role,
        status: u.status === 'Active' ? 'Inactive' : 'Active'
      });
      setMessage(`User ${u.status === 'Active' ? 'deactivated' : 'activated'} successfully.`);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (u: ManagedUser) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(u.id);
      setMessage('User deleted successfully.');
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Page
      title="User Account Settings"
      subtitle={
        readOnly
          ? 'Demo workspace accounts are set to read-only. Settings alterations are restricted.'
          : 'Configure user credentials, permissions, and status details.'
      }
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm font-semibold text-slate-550">{users.length} active platform profiles</p>
        {!readOnly && (
          <button
            onClick={() => {
              setForm(blank);
              setModal('create');
              setError('');
              setMessage('');
            }}
            className="rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm px-4 py-2.5 transition-all shadow-md shadow-indigo-650/15 cursor-pointer flex items-center gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Add Profile
          </button>
        )}
      </div>

      {message && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-rose-50 border border-rose-105 p-4 text-xs font-semibold text-rose-600 flex items-center gap-2">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Role Permission</th>
                <th className="px-6 py-4">Status Flag</th>
                <th className="px-6 py-4">Date Configured</th>
                {!readOnly && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 font-semibold text-slate-900">{u.full_name}</td>
                  <td className="px-6 py-4 text-slate-600">{u.username}</td>
                  <td className="px-6 py-4">
                    <Badge value={u.role} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge value={u.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => edit(u)} className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => toggle(u)} className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer">
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => remove(u)} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Creation Modal */}
      {!readOnly && modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <form onSubmit={save} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-fade-in border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {modal === 'create' ? 'Register New Profile' : 'Modify Account Profile'}
              </h2>
              <button type="button" onClick={close} className="text-2xl text-slate-400 hover:text-slate-650 transition-colors">
                &times;
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Username
                </label>
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="johndoe"
                  className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                />
              </div>

              {modal === 'create' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={form.confirm_password}
                      onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                      placeholder="Repeat password"
                      className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Role Permission
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                >
                  <option>Admin</option>
                  <option>Project Manager</option>
                  <option>HR Manager</option>
                  <option>Employee</option>
                </select>
              </div>

              {form.role === 'Employee' && <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Employee ID</label>
                <input required type="number" min="1" value={form.employee_id || ''} onChange={(e) => setForm({ ...form, employee_id: Number(e.target.value) })} placeholder="Linked employee ID" className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white" />
              </div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Status Flag
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-205 p-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-indigo-650 hover:bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-650/10 hover:shadow-lg transition-all cursor-pointer">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </Page>
  );
}

function getPageTheme(title: string) {
  const norm = title.toLowerCase();
  if (norm.includes('dashboard')) {
    return {
      text: 'from-emerald-600 to-teal-500',
      pill: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      desc: 'System summary'
    };
  }
  if (norm.includes('project analytics')) {
    return {
      text: 'from-indigo-600 to-indigo-500',
      pill: 'bg-indigo-50 text-indigo-750 border-indigo-100',
      desc: 'Performance metrics'
    };
  }
  if (norm.includes('project details')) {
    return {
      text: 'from-blue-600 to-sky-500',
      pill: 'bg-blue-50 text-blue-750 border-blue-100',
      desc: 'Granular log files'
    };
  }
  if (norm.includes('risk')) {
    return {
      text: 'from-rose-600 to-orange-500',
      pill: 'bg-rose-50 text-rose-700 border-rose-100',
      desc: 'Bottleneck alerts'
    };
  }
  if (norm.includes('workforce')) {
    return {
      text: 'from-violet-600 to-fuchsia-500',
      pill: 'bg-violet-50 text-violet-750 border-violet-100',
      desc: 'Workforce summary'
    };
  }
  if (norm.includes('recommendation')) {
    return {
      text: 'from-teal-600 to-emerald-500',
      pill: 'bg-teal-50 text-teal-700 border-teal-100',
      desc: 'Workload matching'
    };
  }
  if (norm.includes('what-if')) {
    return {
      text: 'from-cyan-600 to-sky-500',
      pill: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      desc: 'Imbalance models'
    };
  }
  if (norm.includes('attrition')) {
    return {
      text: 'from-fuchsia-600 to-pink-500',
      pill: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
      desc: 'ML predictive risk'
    };
  }
  if (norm.includes('employee')) {
    return {
      text: 'from-purple-600 to-indigo-550',
      pill: 'bg-purple-50 text-purple-750 border-purple-100',
      desc: 'Personnel profiles'
    };
  }
  return {
    text: 'from-amber-600 to-orange-500',
    pill: 'bg-amber-50 text-amber-700 border-amber-100',
    desc: 'Access credentials'
  };
}

function Page({ title, subtitle, children }: any) {
  const theme = getPageTheme(title);
  return (
    <main className="space-y-6">
      {/* Dynamic Styled Header Card with accent line & page signature colors */}
      <div className="rounded-2xl border border-slate-100 p-6 shadow-sm card-design relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${theme.pill}`}>
              {theme.desc}
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight bg-gradient-to-r ${theme.text} bg-clip-text text-transparent mt-1.5`}>
            {title}
          </h1>
          <p className="max-w-4xl text-xs font-semibold leading-relaxed text-slate-400">
            {subtitle}
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50/30 to-transparent pointer-events-none hidden md:block" />
      </div>
      <div className="pt-2">{children}</div>
    </main>
  );
}

function Loading() {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      <p className="text-sm font-semibold text-slate-500">Querying active datasets...</p>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    if (window.location.hash !== '#app') return null;
    try {
      return JSON.parse(
        localStorage.getItem('kshamta_user') || sessionStorage.getItem('kshamta_demo_user') || 'null'
      );
    } catch {
      return null;
    }
  });

  const [demoRole, setDemoRole] = useState<User['role'] | null>(() => {
    if (window.location.hash !== '#app') return null;
    try {
      return JSON.parse(sessionStorage.getItem('kshamta_demo_user') || 'null')?.role || null;
    } catch {
      return null;
    }
  });

  const [entry, setEntry] = useState<'landing' | 'chooser' | 'login'>('landing');
  const [page, setPage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    if (entry === 'chooser') {
      return (
        <DemoChooser
          onBack={() => setEntry('landing')}
          onEnter={async (role) => {
            try {
              const r = await api.demoLogin(role);
              sessionStorage.setItem('kshamta_demo_token', r.access_token);
              sessionStorage.setItem('kshamta_demo_user', JSON.stringify(r.user));
              window.location.hash = 'app';
              setDemoRole(role);
              setUser(r.user);
            } catch (e: any) {
              alert(e.message);
            }
          }}
        />
      );
    }
    if (entry === 'login') {
      return (
        <Login
          onBack={() => setEntry('landing')}
          onLogin={(u) => {
            localStorage.setItem('kshamta_user', JSON.stringify(u));
            window.location.hash = 'app';
            setUser(u);
          }}
        />
      );
    }
    return <Landing onExplore={() => setEntry('chooser')} onSignIn={() => setEntry('login')} />;
  }

  const activeUser = user;
  const content: any = {
    Dashboard: <Dashboard />,
    'Project Analytics': <Projects />,
    'Project Risk': <Risk />,
    'Workforce Analytics': <Workforce />,
    'Resource Recommendation': <Resource />,
    'What-If Simulation': <WhatIf />,
    'Attrition Prediction': <Attrition />,
    'Project Details': <Projects detail canEdit={!demoRole} />,
    'Employee Details': <Employees />,
    'My Work': <MyWork />,
    'User Management': <UserManagement readOnly={!!demoRole} />
  };

  const exit = () => {
    localStorage.removeItem('kshamta_user');
    localStorage.removeItem('kshamta_token');
    sessionStorage.removeItem('kshamta_demo_token');
    sessionStorage.removeItem('kshamta_demo_user');
    window.location.hash = '';
    setUser(null);
    setDemoRole(null);
    setEntry('landing');
    setPage('Dashboard');
  };

  const allowedPages = permissions[activeUser.role];
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowedPages.includes(item.name))
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-5 py-4 border-b border-slate-800 shrink-0 select-none">
        <img src="/logo.svg" className="h-8 rounded bg-white p-0.5" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Navigation Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out shrink-0
          lg:relative lg:translate-x-0 lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-800 hidden lg:block">
          <img src="/logo.svg" className="h-10 rounded-xl bg-white p-1" />
        </div>

        {demoRole && (
          <div className="mx-4 mt-5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 flex items-start gap-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-450 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Demo Sandbox</p>
              <p className="mt-0.5 text-xs text-white/90">{demoRole} Persona</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {visibleGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = page === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setPage(item.name);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer
                        ${isActive
                          ? 'bg-indigo-650/20 text-indigo-400 font-bold border-l-2 border-indigo-500 pl-2.5'
                          : 'hover:bg-slate-800/40 hover:text-white text-slate-400'
                        }
                      `}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-650 text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
              {activeUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{activeUser.username}</p>
              <p className="text-[10px] text-slate-500 truncate capitalize font-semibold">{activeUser.role}</p>
            </div>
          </div>
          <button
            onClick={exit}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-800 hover:border-rose-500/20 hover:bg-rose-500/5 text-xs text-slate-400 hover:text-rose-450 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{demoRole ? 'Exit Sandbox' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content pane */}
      <section className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-workspace">
        {/* Sticky Desktop header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between shrink-0 hidden lg:flex select-none">
          <div className="flex items-center gap-2 text-xs text-slate-450 font-bold">
            <span>KSHAMTA Control</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
            <span className="text-slate-800 font-extrabold">{page}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-450">
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {content[page]}
        </div>
      </section>
    </div>
  );
}
