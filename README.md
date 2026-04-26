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
4. **Send email report** — HTML email with run status, Actions link, and artifact info

### Required GitHub Secrets

Set these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `STANDARD_USER` | `standard_user` |
| `LOCKED_USER` | `locked_out_user` |
| `PASSWORD` | `secret_sauce` |
| `MAIL_SERVER` | SMTP host (e.g. `smtp.gmail.com`) |
| `MAIL_PORT` | SMTP port (e.g. `465`) |
| `MAIL_USERNAME` | SMTP login email |
| `MAIL_PASSWORD` | SMTP password or app password |
| `MAIL_TO` | Recipient email address |
| `MAIL_FROM` | Sender address |

> **Gmail users:** Generate an [App Password](https://myaccount.google.com/apppasswords) and use it as `MAIL_PASSWORD`.
