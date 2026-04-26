# SauceDemo Playwright Framework

Production-ready Playwright + TypeScript test framework for [SauceDemo](https://www.saucedemo.com), using Page Object Model, fixtures, and dotenv.

---

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # fill in credentials
```

**.env** (never committed):
```
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_USER=locked_out_user
PASSWORD=secret_sauce
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | All tests, headless, all browsers |
| `npm run test:headed` | All tests, headed browser |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:debug` | Step-through debugger |
| `npm run test:smoke` | `tests/smoke/` only |
| `npm run test:auth` | `tests/auth/` only |
| `npm run test:regression` | `tests/regression/` only |
| `npm run test:demo-fail` | Demo failing tests only (see below) |
| `npm run report` | Open last HTML report |

---

## Demo Failing Tests

`tests/demo/demo-failures.spec.ts` contains **3 intentionally failing tests** tagged `@demo-fail`. These exist solely to demonstrate Playwright's failure artifact collection (screenshots, videos, traces) — they should never be added to the normal CI gate.

### Run locally

```bash
npm run test:demo-fail
```

All 3 tests will fail as expected. After the run:

### Where artifacts are stored

| Artifact | Location |
|---|---|
| Screenshots | `test-results/<test-name>/test-failed-1.png` |
| Videos | `test-results/<test-name>/video.webm` |
| Traces | `test-results/<test-name>/trace.zip` |
| HTML report | `playwright-report/index.html` |

Open the HTML report to browse failures interactively:

```bash
npm run report
```

Open a trace file in the Playwright Trace Viewer:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## Project Structure

```
automation/
├── .github/workflows/playwright.yml   # CI pipeline
├── pages/                             # Page Object Model classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── testFixtures.ts                # Playwright fixtures (incl. pre-auth)
├── test-data/
│   ├── users.ts                       # Credentials via env (never hardcoded)
│   └── products.ts                    # Product catalog + checkout info
├── utils/
│   ├── env.ts                         # requireEnv() — fails fast on missing vars
│   └── helpers.ts
└── tests/
    ├── auth/login.spec.ts             # Login / logout scenarios
    ├── smoke/smoke.spec.ts            # Critical path smoke tests
    ├── regression/checkout.spec.ts   # Full checkout flow
    └── demo/demo-failures.spec.ts    # Intentional failures for demo purposes
```

---

## GitHub Actions

The workflow at `.github/workflows/playwright.yml` runs on every push and PR to `main`/`master`.

**Steps:**
1. **Run test suite** — normal tests must pass; workflow fails if any do
2. **Run demo failure tests** — runs with `continue-on-error: true`; workflow continues regardless
3. **Upload artifacts** — both report sets uploaded for 7–14 days
4. **Send email report** — HTML email sent via Brevo SMTP always, even on failure

---

## Email Reports (Brevo SMTP)

The workflow sends an HTML email after every run containing:
- **Status** — PASS / FAIL badge
- **Date** of execution (UTC)
- **Link** to the GitHub Actions run
- **Attached** `playwright-report/index.html` for offline viewing
- Summary of available artifact downloads (screenshots, videos, traces)

### 1. Create a free Brevo account

1. Sign up at [brevo.com](https://www.brevo.com) (free tier: 300 emails/day)
2. Go to **Account → SMTP & API → SMTP**
3. Note your **Login** (your account email) and generate an **SMTP Key** (this is your password — not your account password)

### 2. Add GitHub Secrets

Go to your repository → **Settings → Secrets and variables → Actions → New repository secret** and add each of the following:

| Secret | Value |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `STANDARD_USER` | `standard_user` |
| `LOCKED_USER` | `locked_out_user` |
| `PASSWORD` | `secret_sauce` |
| `MAIL_SERVER` | `smtp-relay.brevo.com` |
| `MAIL_PORT` | `587` |
| `MAIL_USERNAME` | Your Brevo account email (e.g. `you@example.com`) |
| `MAIL_PASSWORD` | Your Brevo **SMTP Key** (from the SMTP settings page) |
| `MAIL_FROM` | Sender address — must be a verified sender in Brevo |
| `MAIL_TO` | Recipient address (can be any email) |

> **Why port 587?** Brevo recommends port 587 with STARTTLS. The workflow sets `secure: false`
> so nodemailer negotiates STARTTLS automatically on connect. Do **not** change this to `true`
> (that is for port 465 / direct SSL only).

> **Verified sender:** In Brevo, go to **Senders & IPs → Senders** and add the address you
> put in `MAIL_FROM`. Without verification Brevo will reject outgoing mail.

### 3. Example Brevo configuration (summary)

```
SMTP host : smtp-relay.brevo.com
Port      : 587
Security  : STARTTLS  (secure: false in the workflow)
Username  : your-brevo-login@example.com
Password  : your-brevo-smtp-key   ← NOT your account password
```

### Attachment note

`playwright-report/index.html` is attached directly to the email. Because it is a
self-contained summary page, linked assets (charts, icons) may not render when opened
from a mail client. Download the full `playwright-report-normal` artifact from the
Actions run page for the complete interactive report.
