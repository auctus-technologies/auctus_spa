'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './components/AuthContext';
import { API_URL } from './endpoint/endpoint';

const DEV_DESIGNATIONS = [
  'software_engineer', 'senior_developer', 'junior_developer',
  'team_lead', 'qa_engineer', 'devops_engineer',
];

const LEAD_STATUS_COLORS = {
  proposal:       '#3b82f6',
  sent:           '#f59e0b',
  processing:     '#8b5cf6',
  client:         '#22c55e',
  lost:           '#ef4444',
  not_interested: '#9ca3af',
};

const PROJECT_STATUS_COLORS = {
  'Planning':  '#f59e0b',
  'Progress':  '#3b82f6',
  'Testing':   '#8b5cf6',
  'Completed': '#22c55e',
  'On Hold':   '#9ca3af',
};

const LEAD_STATUS_BADGE = {
  proposal:       'bg-blue-50 text-blue-700',
  sent:           'bg-yellow-50 text-yellow-700',
  processing:     'bg-purple-50 text-purple-700',
  client:         'bg-green-50 text-green-700',
  lost:           'bg-red-50 text-red-600',
  not_interested: 'bg-gray-100 text-gray-500',
};

function greeting(name) {
  const h = new Date().getHours();
  const t = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return `Good ${t}, ${name}`;
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon, loading, color = 'primary' }) {
  const bg = {
    green:  'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red:    'bg-red-50 text-red-600',
    blue:   'bg-blue-50 text-blue-600',
    primary:'bg-primary/10 text-primary',
  }[color] || 'bg-primary/10 text-primary';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${bg}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 m-0">
        {loading ? <span className="text-gray-200 animate-pulse">—</span> : (value ?? '—')}
      </p>
      <p className="text-xs text-gray-400 mt-1 m-0">{label}</p>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────── */
const Icons = {
  leads: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  clients: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  leave: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="12" y1="18" x2="12" y2="22"/><line x1="9" y1="21" x2="15" y2="21"/>
    </svg>
  ),
  attendance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

/* ── SVG Bar Chart (generic) ────────────────────────────────── */
function BarChart({ data, title, href, colorFn, labelKey = 'label', countKey = 'count', loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-200 text-sm">Loading...</div>
      </div>
    );
  }

  const maxVal = Math.max(...(data || []).map(d => d[countKey]), 1);
  const chartH = 155;
  const padLeft = 36;
  const padBottom = 32;
  const totalW = 500;
  const availW = totalW - padLeft - 8;
  const count = data?.length || 1;
  const slotW = availW / count;
  const barW = Math.min(slotW * 0.5, 52);

  const ySteps = 4;
  const yLines = Array.from({ length: ySteps + 1 }, (_, i) => ({
    val: Math.round((maxVal / ySteps) * (ySteps - i)),
    y: (i / ySteps) * chartH,
  }));

  function roundedTopPath(x, y, w, h) {
    const rx = Math.min(8, w / 2, Math.max(h, 0.1));
    return [
      `M ${x} ${y + h}`,
      `L ${x} ${y + rx}`,
      `Q ${x} ${y} ${x + rx} ${y}`,
      `L ${x + w - rx} ${y}`,
      `Q ${x + w} ${y} ${x + w} ${y + rx}`,
      `L ${x + w} ${y + h}`,
      'Z',
    ].join(' ');
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 m-0">{title}</h2>
        {href && (
          <Link href={href} className="text-xs text-primary font-medium no-underline hover:underline">View all</Link>
        )}
      </div>
      {!data || data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">No data available.</div>
      ) : (
        <svg viewBox={`0 0 ${totalW} ${chartH + padBottom}`} className="w-full" style={{ overflow: 'visible' }}>
          <defs>
            {data.map((d, i) => {
              const color = colorFn ? colorFn(d) : '#6366f1';
              return (
                <linearGradient key={i} id={`bar-g-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.35" />
                </linearGradient>
              );
            })}
          </defs>
          <style>{`
            @keyframes chartGrow {
              from { transform: scaleY(0); opacity: 0; }
              to   { transform: scaleY(1); opacity: 1; }
            }
            @keyframes chartFade {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes chartSlideUp {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {yLines.map(({ val, y }, gi) => (
            <g key={y} style={{ animation: `chartFade 0.4s ease ${gi * 0.04}s both` }}>
              <line
                x1={padLeft} y1={y} x2={totalW - 4} y2={y}
                stroke={y === chartH ? '#e5e7eb' : '#f0f0f0'}
                strokeWidth={y === chartH ? '1.5' : '1'}
                strokeDasharray={y === chartH ? undefined : '5 4'}
              />
              <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#d1d5db">{val}</text>
            </g>
          ))}

          {data.map((d, i) => {
            const val = d[countKey];
            const barH = Math.max((val / maxVal) * chartH, val > 0 ? 12 : 0);
            const x = padLeft + i * slotW + (slotW - barW) / 2;
            const y = chartH - barH;
            const color = colorFn ? colorFn(d) : '#6366f1';
            const inBar = barH > 40;
            const delay = i * 0.09;

            return (
              <g key={i}>
                {/* Background track */}
                <rect
                  x={x} y={0} width={barW} height={chartH} fill="#f9fafb" rx="8"
                  style={{ animation: `chartFade 0.25s ease ${delay}s both` }}
                />

                {/* Gradient bar — springs up from baseline */}
                {val > 0 && (
                  <path
                    d={roundedTopPath(x, y, barW, barH)}
                    fill={`url(#bar-g-${i})`}
                    style={{
                      transformOrigin: `${x + barW / 2}px ${chartH}px`,
                      animation: `chartGrow 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`,
                    }}
                  />
                )}

                {/* Value label */}
                {val > 0 && (
                  <text
                    x={x + barW / 2}
                    y={inBar ? y + 22 : y - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill={inBar ? 'white' : '#111827'}
                    fontWeight="700"
                    style={{ animation: `chartFade 0.3s ease ${delay + 0.4}s both` }}
                  >
                    {val}
                  </text>
                )}

                <text
                  x={x + barW / 2} y={chartH + padBottom - 4}
                  textAnchor="middle" fontSize="10" fill="#9ca3af"
                  style={{ animation: `chartFade 0.3s ease ${delay + 0.15}s both` }}
                >
                  {d[labelKey]}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ── SVG Donut Chart (generic) ──────────────────────────────── */
function DonutChart({ data, title, colorFn, labelKey = 'label', countKey = 'count', loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-200 text-sm">Loading...</div>
      </div>
    );
  }

  const filtered = (data || []).filter(d => d[countKey] > 0);
  const total = filtered.reduce((s, d) => s + d[countKey], 0);

  if (!total) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 m-0">{title}</h2>
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">No data yet.</div>
      </div>
    );
  }

  const cx = 80, cy = 80, r = 68, ir = 46;
  let angle = -Math.PI / 2;

  function slice(sa, ea, color) {
    if (Math.abs(ea - sa) < 0.001) return null;
    const large = ea - sa > Math.PI ? 1 : 0;
    const cos = Math.cos, sin = Math.sin;
    const d = [
      `M ${cx + r * cos(sa)} ${cy + r * sin(sa)}`,
      `A ${r} ${r} 0 ${large} 1 ${cx + r * cos(ea)} ${cy + r * sin(ea)}`,
      `L ${cx + ir * cos(ea)} ${cy + ir * sin(ea)}`,
      `A ${ir} ${ir} 0 ${large} 0 ${cx + ir * cos(sa)} ${cy + ir * sin(sa)}`,
      'Z',
    ].join(' ');
    return <path d={d} fill={color} stroke="white" strokeWidth="2.5" strokeLinejoin="round" />;
  }

  const segments = filtered.map(d => {
    const sweep = (d[countKey] / total) * 2 * Math.PI;
    const sa = angle;
    const ea = angle + sweep;
    angle = ea;
    return { ...d, sa, ea, color: colorFn(d) };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h2 className="text-sm font-semibold text-gray-800 mb-3 m-0">{title}</h2>
      <svg viewBox="0 0 160 160" className="w-full max-w-[160px] mx-auto block">
        <style>{`
          @keyframes chartPop {
            from { opacity: 0; transform: scale(0.55); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes chartFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes chartSlideUp {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {segments.map((s, i) => (
          <g
            key={i}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              animation: `chartPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
            }}
          >
            {slice(s.sa, s.ea, s.color)}
          </g>
        ))}
        <text
          x={cx} y={cy - 8} textAnchor="middle" fontSize="24" fontWeight="800" fill="#111827"
          style={{ animation: 'chartFade 0.5s ease 0.55s both' }}
        >{total}</text>
        <text
          x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#9ca3af" letterSpacing="1"
          style={{ animation: 'chartFade 0.5s ease 0.7s both' }}
        >TOTAL</text>
      </svg>
      <ul className="mt-3 space-y-1.5" style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
        {segments.map((s, i) => (
          <li
            key={i}
            className="flex items-center justify-between text-xs"
            style={{ animation: `chartSlideUp 0.35s ease ${i * 0.08 + 0.5}s both` }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-gray-500 truncate">{s[labelKey]}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-gray-300">{Math.round((s[countKey] / total) * 100)}%</span>
              <span className="font-semibold text-gray-800 w-4 text-right">{s[countKey]}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Recent Projects Table ──────────────────────────────────── */
function RecentProjectsTable({ projects, loading }) {
  const STATUS_BADGE = {
    'Planning':  'bg-yellow-50 text-yellow-700',
    'Progress':  'bg-blue-50 text-blue-700',
    'Testing':   'bg-purple-50 text-purple-700',
    'Completed': 'bg-green-50 text-green-700',
    'On Hold':   'bg-gray-100 text-gray-500',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800 m-0">Recent Projects</h2>
        <Link href="/dashboard/projects" className="text-xs text-primary font-medium no-underline hover:underline">View all</Link>
      </div>
      {loading ? (
        <div className="px-4 py-8 text-center text-sm text-gray-300">Loading...</div>
      ) : !projects || projects.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400">No projects yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {Icons.projects}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 m-0 truncate">{p.name}</p>
                <p className="text-xs text-gray-400 m-0">{p.start_date} → {p.end_date}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[p.status] || 'bg-gray-100 text-gray-500'}`}>
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Recent Leads Table ─────────────────────────────────────── */
function RecentLeadsTable({ leads, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800 m-0">Recent Leads</h2>
        <Link href="/dashboard/leads" className="text-xs text-primary font-medium no-underline hover:underline">View all</Link>
      </div>
      {loading ? (
        <div className="px-4 py-8 text-center text-sm text-gray-300">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400">No leads yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {leads.map((lead) => (
            <li key={lead.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {lead.client_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 m-0 truncate">{lead.client_name}</p>
                <p className="text-xs text-gray-400 m-0 truncate">{lead.company_name || lead.email || '—'}</p>
              </div>
              {lead.status && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${LEAD_STATUS_BADGE[lead.status] || 'bg-gray-100 text-gray-500'}`}>
                  {lead.status.replace('_', ' ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEV OVERVIEW
══════════════════════════════════════════════════════════════ */
function DevOverview({ user, devStats, devCharts, recentProjects, loading }) {
  const devCards = [
    { label: 'My Active Projects',    value: devStats?.my_active,    icon: Icons.projects, color: 'primary' },
    { label: 'My Completed Projects', value: devStats?.my_completed, icon: Icons.check,    color: 'green'   },
    { label: 'Total My Projects',     value: devStats?.my_total,     icon: Icons.clients,  color: 'purple'  },
    { label: 'On Hold',               value: devStats?.my_on_hold,   icon: Icons.leave,    color: 'yellow'  },
  ];

  const projData = (devCharts?.projects_by_status || []).map(p => ({
    ...p,
    label: p.status,
    count: p.count,
  }));

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 m-0">{greeting(user.name)} 👋</h1>
        <p className="text-sm text-gray-400 mt-1 mb-0">Here's your development team overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {devCards.map(card => <StatCard key={card.label} {...card} loading={loading} />)}
      </div>

      {/* Recent Projects full width */}
      <div className="mb-4">
        <RecentProjectsTable projects={recentProjects} loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChart
            title="Projects by Status"
            href="/dashboard/projects"
            data={projData}
            labelKey="label"
            countKey="count"
            colorFn={d => PROJECT_STATUS_COLORS[d.status] || '#6366f1'}
            loading={loading}
          />
        </div>
        <div>
          <DonutChart
            title="Project Status"
            data={projData}
            labelKey="label"
            countKey="count"
            colorFn={d => PROJECT_STATUS_COLORS[d.status] || '#e5e7eb'}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function DashboardHome() {
  const { user } = useAuth();

  const [stats, setStats]             = useState(null);
  const [charts, setCharts]           = useState(null);
  const [devStats, setDevStats]       = useState(null);
  const [devCharts, setDevCharts]     = useState(null);
  const [recentLeads, setLeads]       = useState([]);
  const [recentProjects, setProjects] = useState([]);
  const [loading, setLoading]         = useState(true);

  const dept        = user?.department?.toLowerCase();
  const designation = user?.designation?.toLowerCase();
  const role        = user?.role?.toLowerCase();

  const isAdmin    = role === 'admin';
  const isSalesMkt = ['marketing', 'sales'].includes(dept);
  const isDev      = dept === 'development' || DEV_DESIGNATIONS.includes(designation);

  useEffect(() => {
    if (!user) return;

    async function fetchAll() {
      setLoading(true);
      try {
        const base = [
          fetch(`${API_URL}/dashboard/stats`,  { credentials: 'include' }).then(r => r.ok ? r.json() : null),
          fetch(`${API_URL}/dashboard/charts`, { credentials: 'include' }).then(r => r.ok ? r.json() : null),
        ];

        const leadsP = (isAdmin || isSalesMkt)
          ? fetch(`${API_URL}/leads?page_size=5`, { credentials: 'include' }).then(r => r.ok ? r.json() : null)
          : Promise.resolve(null);

        const devStatsP = isDev
          ? fetch(`${API_URL}/dashboard/dev-stats`, { credentials: 'include' }).then(r => r.ok ? r.json() : null)
          : Promise.resolve(null);

        const devChartsP = isDev
          ? fetch(`${API_URL}/dashboard/dev-charts`, { credentials: 'include' }).then(r => r.ok ? r.json() : null)
          : Promise.resolve(null);

        const projP = isDev
          ? fetch(`${API_URL}/projects?page_size=5`, { credentials: 'include' }).then(r => r.ok ? r.json() : null)
          : Promise.resolve(null);

        const [statsData, chartsData, leadsData, devStatsData, devChartsData, projData] =
          await Promise.all([...base, leadsP, devStatsP, devChartsP, projP]);

        if (statsData)          setStats(statsData);
        if (chartsData)         setCharts(chartsData);
        if (devStatsData)       setDevStats(devStatsData);
        if (devChartsData)      setDevCharts(devChartsData);
        if (leadsData?.leads)   setLeads(leadsData.leads);
        if (projData?.projects) setProjects(projData.projects);
        else if (Array.isArray(projData)) setProjects(projData);
      } catch (e) {
        console.error('Overview fetch error:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [user]);

  /* Dev users get their own full page */
  if (isDev && !isAdmin && user) {
    return (
      <DevOverview
        user={user}
        devStats={devStats}
        devCharts={devCharts}
        recentProjects={recentProjects}
        loading={loading}
      />
    );
  }

  /* ── Stat cards for admin / sales-mkt / other employees ── */
  const adminCards = [
    { label: 'Total Leads',     value: stats?.total_leads,     icon: Icons.leads,      color: 'primary' },
    { label: 'Total Clients',   value: stats?.total_clients,   icon: Icons.clients,    color: 'green'   },
    { label: 'Active Projects', value: stats?.active_projects, icon: Icons.projects,   color: 'purple'  },
    { label: 'Total Employees', value: stats?.total_users,     icon: Icons.users,      color: 'yellow'  },
  ];

  const salesMktCards = [
    { label: 'Total Leads',    value: stats?.total_leads,          icon: Icons.leads,   color: 'primary' },
    { label: 'New This Month', value: stats?.new_leads_this_month, icon: Icons.leads,   color: 'green'   },
    { label: 'Total Clients',  value: stats?.total_clients,        icon: Icons.clients, color: 'purple'  },
    { label: 'Pending Leaves', value: stats?.pending_leaves,       icon: Icons.leave,   color: 'yellow'  },
  ];

  const employeeCards = [
    { label: 'Active Projects', value: stats?.active_projects, icon: Icons.projects,   color: 'primary' },
    { label: 'Present Today',   value: stats?.present_today,   icon: Icons.attendance, color: 'green'   },
    { label: 'Total Employees', value: stats?.total_users,     icon: Icons.users,      color: 'purple'  },
    { label: 'Pending Leaves',  value: stats?.pending_leaves,  icon: Icons.leave,      color: 'yellow'  },
  ];

  const statCards = isAdmin ? adminCards : isSalesMkt ? salesMktCards : employeeCards;

  const leadMonthData = (charts?.leads_by_month || []).map(d => ({
    ...d, label: d.month.split(' ')[0],
  }));

  const leadStatusData = (charts?.leads_by_status || []).map(d => ({
    ...d, label: d.label,
  }));

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 m-0">
          {user ? greeting(user.name) : 'Welcome'} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1 mb-0">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map(card => <StatCard key={card.label} {...card} loading={loading} />)}
      </div>

      {(isAdmin || isSalesMkt) && (
        <div className="mb-4">
          <RecentLeadsTable leads={recentLeads} loading={loading} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChart
            title="Monthly Leads"
            href="/dashboard/leads"
            data={leadMonthData}
            labelKey="label"
            countKey="count"
            colorFn={() => '#6366f1'}
            loading={loading}
          />
        </div>
        <div>
          <DonutChart
            title="Lead Status"
            data={leadStatusData}
            labelKey="label"
            countKey="count"
            colorFn={d => LEAD_STATUS_COLORS[d.status] || '#e5e7eb'}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
