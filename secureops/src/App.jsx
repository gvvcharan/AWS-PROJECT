import { useState } from 'react'
import './App.css'

const INSTANCE_ID = 'i-0a64addaba1970856'
const SESSION_URL = 'https://eu-north-1.console.aws.amazon.com/systems-manager/session-manager?region=eu-north-1'
const navigation = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'instances', label: 'EC2 Instances', icon: 'server' },
  { id: 'activity', label: 'Session Activity', icon: 'activity' },
  { id: 'security', label: 'Security', icon: 'shield' },
]
const pageCopy = {
  overview: ['Infrastructure overview', 'A clear view of your secure access posture.'],
  instances: ['EC2 instances', 'Managed compute resources available through Systems Manager.'],
  activity: ['Session activity', 'Understand access events without exposing a shell in this app.'],
  security: ['Security posture', 'Review the controls that make agent-based access safer than SSH.'],
}
const sampleSessions = [
  { user: 'demo-operator', action: 'Session started', target: 'SSM-Demo-Server', time: 'Today, 10:42 AM', result: 'Success' },
  { user: 'demo-operator', action: 'Session ended', target: 'SSM-Demo-Server', time: 'Today, 10:31 AM', result: 'Success' },
  { user: 'platform-admin', action: 'Session started', target: 'SSM-Demo-Server', time: 'Yesterday, 4:18 PM', result: 'Success' },
  { user: 'demo-operator', action: 'Session started', target: 'SSM-Demo-Server', time: 'Yesterday, 2:06 PM', result: 'Success' },
]

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const shapes = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    server: <><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 17.5h.01M11 7.5h6M11 17.5h6" /></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  }
  return <svg {...common}>{shapes[name] || shapes.grid}</svg>
}

function Badge({ children, tone = 'green' }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot" />{children}</span>
}

function SectionHeading({ eyebrow, title, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</div>
}

function Metric({ label, value, note, icon, green = false }) {
  return <section className="card metric-card"><span className="metric-icon"><Icon name={icon} /></span><div><span className="metric-label">{label}</span><strong className={green ? 'metric-green' : ''}>{value}</strong><small>{note}</small></div></section>
}

function App() {
  const [activePage, setActivePage] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const copyInstanceId = async () => {
    setCopied(false)
    setCopyError('')
    try {
      await navigator.clipboard.writeText(INSTANCE_ID)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopyError('Clipboard access is unavailable. Select and copy the instance ID manually.')
    }
  }

  const selectPage = (page) => {
    setActivePage(page)
    setMobileMenuOpen(false)
  }

  const renderOverview = () => <>
    <div className="overview-grid">
      <section className="card instance-hero">
        <div className="instance-hero-top"><div className="instance-symbol"><Icon name="server" size={22} /></div><Badge>Running</Badge></div>
        <p className="eyebrow">DEMO EC2 INSTANCE <span className="demo-tag">MOCK / VERIFIED CONFIG</span></p>
        <h2>SSM-Demo-Server</h2>
        <p className="muted">Amazon Linux <span className="bullet">•</span> eu-north-1</p>
        <div className="instance-id-row"><code>{INSTANCE_ID}</code><button className="icon-button" onClick={copyInstanceId} aria-label="Copy instance ID" title="Copy instance ID"><Icon name="copy" /></button></div>
        {copied && <p className="inline-feedback" role="status">Instance ID copied</p>}
        {copyError && <p className="inline-error" role="alert">{copyError}</p>}
        <div className="hero-divider" />
        <div className="hero-facts"><div><span>SSM MANAGED NODE</span><strong className="fact-online"><i />Online</strong></div><div><span>SSH INBOUND</span><strong>None configured</strong></div></div>
        <a className="button button-primary connect-button" href={SESSION_URL} target="_blank" rel="noopener noreferrer">Connect with Session Manager <Icon name="arrow" size={16} /></a>
        <p className="button-caption">Opens the AWS console in a new tab. The shell is not embedded here.</p>
      </section>

      <section className="card posture-card">
        <div className="card-title-row"><div><p className="eyebrow">ACCESS POSTURE</p><h2>Secure by design</h2></div><span className="shield-icon"><Icon name="shield" size={21} /></span></div>
        <p className="muted posture-copy">Session Manager provides managed access without opening inbound SSH ports or distributing keys.</p>
        <div className="posture-score"><div className="score-number">4<span>/4</span></div><div><strong>Core checks passed</strong><small>Based on verified demo setup</small></div></div>
        <div className="check-list"><div><Icon name="check" /><span>Managed node is online</span><strong>Ready</strong></div><div><Icon name="check" /><span>Instance is running</span><strong>Ready</strong></div><div><Icon name="check" /><span>No inbound security group rules</span><strong>Ready</strong></div><div><Icon name="check" /><span>Session Manager access tested</span><strong>Ready</strong></div></div>
        <p className="disclaimer">Checks reflect the user-verified demo configuration, not a live AWS security scan.</p>
      </section>
    </div>

    <div className="metrics-grid">
      <Metric label="Managed instances" value="01" note="Demo fixture" icon="server" />
      <Metric label="SSM connectivity" value="Online" note="Verified by operator" icon="activity" green />
      <Metric label="Inbound SSH rules" value="0" note="No ingress configured" icon="shield" green />
      <Metric label="AWS region" value="eu-north-1" note="Stockholm" icon="globe" />
    </div>

    <div className="lower-grid">
      <section className="card chart-card"><SectionHeading eyebrow="ACCESS OVERVIEW · SAMPLE" title="Session activity" action={<span className="small-label">Illustrative</span>} /><div className="chart-area" role="img" aria-label="Illustrative chart of sample session counts"><div className="chart-y"><span>8</span><span>6</span><span>4</span><span>2</span><span>0</span></div><div className="chart-bars">{[['Mon', 38], ['Tue', 59], ['Wed', 46], ['Thu', 75], ['Fri', 54], ['Sat', 29], ['Sun', 44]].map(([day, height]) => <div className="bar-column" key={day}><div className="bar-track"><span style={{ height: `${height}%` }} /></div><small>{day}</small></div>)}</div></div><p className="chart-caption">Sample values for layout only. No CloudTrail or session history is connected.</p></section>
      <section className="card activity-card"><SectionHeading eyebrow="RECENT EVENTS · SAMPLE" title="Recent session activity" action={<button className="text-button" onClick={() => selectPage('activity')}>View all <span>→</span></button>} />{sampleSessions.slice(0, 3).map((session, index) => <div className="mini-event" key={`${session.time}-${index}`}><span className="event-icon"><Icon name={session.action.includes('ended') ? 'check' : 'arrow'} size={15} /></span><div><strong>{session.action}</strong><span>{session.user} · {session.target}</span></div><time>{session.time.replace('Today, ', '').replace('Yesterday, ', '')}</time></div>)}<p className="sample-note">Sample logs — illustrative, not live AWS events.</p></section>
    </div>
  </>

  const renderInstances = () => <>
    <section className="card table-card"><div className="table-intro"><div><p className="eyebrow">COMPUTE INVENTORY</p><h2>Managed instances</h2><p className="muted">A local fixture based on the verified hackathon demo setup.</p></div><span className="demo-tag">DEMO DATA · NOT LIVE</span></div><div className="table-wrap"><table><caption className="visually-hidden">Demo EC2 instance inventory</caption><thead><tr><th>INSTANCE</th><th>PLATFORM</th><th>REGION</th><th>INSTANCE STATE</th><th>SSM STATUS</th><th><span className="visually-hidden">Actions</span></th></tr></thead><tbody><tr><td><strong>SSM-Demo-Server</strong><small className="mono">{INSTANCE_ID}</small></td><td>Amazon Linux</td><td>eu-north-1</td><td><Badge>Running</Badge></td><td><Badge>Online</Badge></td><td><button className="icon-button" onClick={copyInstanceId} aria-label="Copy instance ID" title="Copy instance ID"><Icon name="copy" /></button></td></tr></tbody></table></div>{copied && <p className="inline-feedback" role="status">Instance ID copied</p>}{copyError && <p className="inline-error" role="alert">{copyError}</p>}<div className="table-foot"><span><span className="live-dot" />Configuration verified by project operator</span><span>1 demo instance</span></div></section>
    <div className="notice-card"><span className="notice-icon"><Icon name="globe" /></span><div><strong>Read-only demo view</strong><p>This dashboard does not call AWS APIs. Instance values are displayed from the verified project configuration and must be rechecked in the AWS console.</p></div></div>
  </>

  const renderActivity = () => <>
    <div className="notice-card sample-banner"><span className="notice-icon"><Icon name="clock" /></span><div><strong>Sample data — not connected to CloudTrail or Session Manager history</strong><p>The rows below are illustrative demo records. They do not represent real users, timestamps, or AWS session events.</p></div></div>
    <section className="card table-card"><div className="table-intro"><div><p className="eyebrow">AUDIT TRAIL</p><h2>Session events</h2><p className="muted">Example of the activity view a production integration could provide.</p></div><span className="demo-tag">MOCK LOGS</span></div><div className="table-wrap"><table><caption className="visually-hidden">Illustrative sample session events, not live AWS activity</caption><thead><tr><th>PRINCIPAL</th><th>EVENT</th><th>INSTANCE</th><th>TIME</th><th>RESULT</th></tr></thead><tbody>{sampleSessions.map((session, index) => <tr key={`${session.time}-${index}`}><td><strong>{session.user}</strong><small>Example principal</small></td><td>{session.action}</td><td>{session.target}</td><td>{session.time}</td><td><Badge>{session.result}</Badge></td></tr>)}</tbody></table></div><div className="table-foot"><span>Illustrative records for presentation only</span><span>4 sample events</span></div></section>
    <div className="notice-card"><span className="notice-icon"><Icon name="shield" /></span><div><strong>Production audit integration</strong><p>Use CloudTrail and SSM session history with authorized read-only permissions. Do not infer live activity from these examples.</p></div></div>
  </>

  const renderSecurity = () => <>
    <section className="card security-summary"><div className="security-emblem"><Icon name="shield" size={28} /></div><div><p className="eyebrow">VERIFIED DEMO CONFIGURATION</p><h2>SSH-free access path</h2><p className="muted">Operator-confirmed: an SSM shell was opened successfully and the selected security group has no inbound rules.</p></div><Badge>Session Manager ready</Badge></section>
    <div className="security-grid"><section className="card control-card"><SectionHeading eyebrow="CONTROL CHECKLIST" title="What this demo demonstrates" /><div className="security-control"><span className="control-check"><Icon name="check" /></span><div><strong>No inbound SSH ingress</strong><p>The selected security group has no inbound rules. No port 22 access was added.</p></div><Badge>Verified</Badge></div><div className="security-control"><span className="control-check"><Icon name="check" /></span><div><strong>SSM managed node online</strong><p>The EC2 instance is registered and available through Systems Manager.</p></div><Badge>Verified</Badge></div><div className="security-control"><span className="control-check"><Icon name="check" /></span><div><strong>Session Manager shell tested</strong><p>The operator confirmed hostname, whoami and uptime in an actual SSM shell.</p></div><Badge>Verified</Badge></div><div className="security-control"><span className="control-check"><Icon name="check" /></span><div><strong>No browser-held AWS credentials</strong><p>This frontend contains no AWS keys and does not execute commands.</p></div><Badge>By design</Badge></div></section>
      <section className="card principle-card"><p className="eyebrow">SECURITY MODEL</p><h2>How access works</h2><div className="flow-step"><span>01</span><div><strong>Identity</strong><p>AWS identity permissions control who can start sessions.</p></div></div><div className="flow-line" /><div className="flow-step"><span>02</span><div><strong>Managed node</strong><p>SSM Agent connects outbound to Systems Manager.</p></div></div><div className="flow-line" /><div className="flow-step"><span>03</span><div><strong>Auditable session</strong><p>Connect through the AWS console; logging depends on AWS configuration.</p></div></div><div className="security-callout"><strong>Scope note</strong><p>This page reflects verified demo facts, not a live policy, IAM, or vulnerability assessment.</p></div></section></div>
  </>

  return (
    <div className="app-shell">
      <aside id="main-navigation" className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); selectPage('overview') }}><span className="brand-mark"><Icon name="shield" size={20} /></span><span>secure<span className="brand-light">ops</span><small>INFRASTRUCTURE ACCESS</small></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">{navigation.map((item) => <button className={`nav-item ${activePage === item.id ? 'nav-active' : ''}`} key={item.id} onClick={() => selectPage(item.id)} aria-current={activePage === item.id ? 'page' : undefined}><Icon name={item.icon} /><span>{item.label}</span>{item.id === 'instances' && <span className="nav-count">1</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="region-card"><span className="region-icon"><Icon name="globe" /></span><div><small>AWS REGION</small><strong>eu-north-1</strong><span>Europe (Stockholm)</span></div><i /></div><div className="profile"><span className="avatar">DO</span><span><strong>Demo Operator</strong><small>Hackathon workspace</small></span><span className="more">•••</span></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="mobile-menu" aria-label="Toggle navigation" aria-controls="main-navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Icon name="menu" /></button><div className="breadcrumb">SecureOps <span>/</span> <strong>{navigation.find((item) => item.id === activePage)?.label}</strong></div><div className="topbar-right"><span className="environment-pill"><i />DEMO ENVIRONMENT</span><span className="top-divider" /><button className="help-button" aria-label="About SecureOps" aria-expanded={aboutOpen} aria-controls="about-secureops" onClick={() => setAboutOpen(!aboutOpen)}>?</button></div><div id="about-secureops" className="about-popover" role="status" hidden={!aboutOpen}>SecureOps is a frontend demo. Instance facts are operator-verified fixtures, not live AWS data.</div></header>
        <div className="page-content"><div className="page-heading"><div><p className="eyebrow">SECUREOPS CONSOLE <span className="heading-dot">/</span> {navigation.find((item) => item.id === activePage)?.label.toUpperCase()}</p><h1>{pageCopy[activePage][0]}</h1><p className="page-subtitle">{pageCopy[activePage][1]}</p></div><div className="snapshot-label"><span className="snapshot-dot" /><span><strong>Local demo snapshot</strong><small>Not live AWS data</small></span></div></div>
          {activePage === 'overview' && renderOverview()}
          {activePage === 'instances' && renderInstances()}
          {activePage === 'activity' && renderActivity()}
          {activePage === 'security' && renderSecurity()}
          <footer className="page-footer"><span>SecureOps <b>·</b> Session Manager access dashboard</span><span>Frontend demo only <b>·</b> No AWS API connection</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
