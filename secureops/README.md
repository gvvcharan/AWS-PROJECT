# SecureOps — Session Manager Access Dashboard

A frontend-only hackathon dashboard showing how AWS Systems Manager Session Manager can provide managed EC2 access without opening inbound SSH. Built with the existing React 19 + Vite project and existing dependencies; no AWS SDK or backend is included.

## Run locally

Requirements: Node.js compatible with the existing Vite 8 setup and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173/). The project already has its dependencies declared; do not install extra packages for this frontend. To create a production bundle, run `npm run build`. To preview that bundle locally, run `npm run preview`.

## Pages and interactions

- **Overview:** verified demo instance details, SSM status, security posture, sample activity visualization, and a Session Manager link.
- **EC2 Instances:** responsive inventory with instance-ID copy controls.
- **Session Activity:** clearly labeled illustrative records, not CloudTrail or live SSM history.
- **Security:** verified demo facts and an explanation of the access model and its limits.
- Navigation works without a routing dependency; layouts adapt for desktop, tablet, and mobile.
- **Copy instance ID** copies `i-0a64addaba1970856` when clipboard access is available and announces success or a manual-copy fallback.
- **Connect with Session Manager** opens [the eu-north-1 AWS console](https://eu-north-1.console.aws.amazon.com/systems-manager/session-manager?region=eu-north-1) in a new tab. It does not embed a terminal.

## Data and architecture

This is a static frontend demo. It has no API client, backend, database, CloudTrail integration, AWS SDK, or AWS credentials. Values on the dashboard are local display fixtures based on the operator-verified setup below. The interface labels its snapshot as **not live AWS data**. Session Activity rows and chart values are fabricated illustrative sample data; do not treat their users, times, counts, or results as real events. Error feedback is provided for clipboard failures; no AWS loading/error state is implied because this implementation does not make AWS requests.

### Operator-verified demo setup

- Region: `eu-north-1` (Europe/Stockholm)
- Instance: `SSM-Demo-Server` (`i-0a64addaba1970856`)
- Platform: Amazon Linux; instance state: running
- Systems Manager managed node: online
- An actual Session Manager shell was tested with `hostname`, `whoami`, and `uptime`.
- The selected security group has no inbound rules.

These are user-provided verified facts, not values queried by this application. Confirm current state in AWS before relying on it.

## AWS and IAM requirements

The dashboard itself requires **no AWS credentials or IAM permissions**. To use Connect, the operator must sign into the AWS console and have authorization to start a Session Manager session to the instance; the instance must remain managed by SSM and reachable by the agent. This project does not change EC2, SSM, security-group, or IAM configuration. Do not add SSH ingress or put credentials in browser code.

A future live read-only integration would need a separately reviewed backend, server-side credential sourcing (prefer an IAM role), authentication/authorization, and narrowly scoped read actions such as `ec2:DescribeInstances`, `ec2:DescribeInstanceStatus`, and the necessary SSM describe/list operations. Scope resource-level permissions wherever AWS supports it, restrict allowed regions/targets, validate input, protect the API, and never expose role credentials. Session start/stop and shell-command execution are not read-only and are intentionally not implemented. Do not claim such integration exists until it is built, tested, and deployed.

## Security limitations

- The dashboard is a presentation UI, not an AWS control plane, live security scanner, or audit source.
- Static facts can become stale. Sample activity is not actual operator activity.
- The console link relies on the visitor's own AWS console session and permissions.
- A zero-inbound-rule security group is the operator-reported selected group; the page does not enumerate every network path or validate the full account posture.
- Session logging and retention depend on separately configured AWS services and policies.
- No arbitrary command endpoint, embedded shell, AWS key, or AWS config mutation is present.

## Two-minute demo script

**0:00–0:20 — Problem.** “Traditional SSH often means managing keys and opening inbound port 22. SecureOps explores a managed alternative using AWS Systems Manager Session Manager.”

**0:20–0:45 — Overview.** Show the demo instance, region, running state, and SSM online badge. Say explicitly: “This is a frontend snapshot from an operator-verified setup; it is not querying AWS live.”

**0:45–1:05 — Access.** Copy the instance ID and show the success announcement. Click **Connect with Session Manager** to open the specified AWS console in a new tab. Explain the shell opens in AWS, not inside SecureOps. If appropriate, show the already-tested SSM shell in the console.

**1:05–1:25 — Activity.** Open Session Activity and point out the sample-data notice. Explain a production read-only integration could display authorized audit records, but these sample rows are not real sessions.

**1:25–1:45 — Security.** Show that the selected security group has no inbound rules and that no SSH rule was added. Explain the instance was confirmed online in SSM and a shell was tested with `hostname`, `whoami`, and `uptime`.

**1:45–2:00 — Close.** “This prototype demonstrates the dashboard experience without browser credentials, arbitrary shell execution, or changes to the working EC2 setup. Live inventory and auditing would require a separately secured, least-privilege backend.”

## Demo checklist

- [ ] Run `npm run dev` and open the URL Vite prints.
- [ ] Check Overview, EC2 Instances, Session Activity, and Security navigation.
- [ ] Copy the instance ID; if clipboard access is blocked by browser context, use the displayed manual-copy fallback.
- [ ] Confirm the Session Manager link target is the eu-north-1 console URL and opens a new tab.
- [ ] Keep the “not live” and sample-log notices visible when describing the dashboard.
- [ ] Sign into AWS separately before the demo if you plan to show the actual Session Manager shell.
- [ ] Do not add inbound SSH rules, reveal credentials, or imply the sample logs are real.
- [ ] Run `npm run build` before presenting.
