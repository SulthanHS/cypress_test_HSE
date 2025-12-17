# Cypress E2E Test Automation for DemoHSE

Comprehensive Cypress end-to-end test suite for the DemoHSE Laravel application, covering login, dashboard navigation, CRUD operations, role-based access control, and 50+ UAT test cases.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- DemoHSE Laravel app running at `http://127.0.0.1:8000`

### Installation
```bash
npm install
```

### Run Tests
```bash
# Open Cypress Test Runner (Interactive)
npm run cypress:open

# Run all tests headless
npm run cypress:run

# Run tests with Allure reporting
npm run cypress:run:allure
```

### Generate Allure Report
```bash
# Generate report from allure-results
npm run allure:generate

# Open report in browser
npm run allure:open

# Or serve directly
npm run allure:serve
```

## 📊 Test Structure

### UAT Test Files (Organized by Role)
- `cypress/e2e/admin/` - Admin role UAT tests (UAT-ADM-001 to UAT-ADM-020)
- `cypress/e2e/operator/` - Operator role UAT tests (UAT-OPR-001 to UAT-OPR-008)
- `cypress/e2e/safety-officer/` - Safety Officer role UAT tests (UAT-SOF-001 to UAT-SOF-010)
- `cypress/e2e/supervisor/` - Supervisor role UAT tests (UAT-SPV-001 to UAT-SPV-004)
- `cypress/e2e/negative/` - Negative test cases (UAT-NEG-001 to UAT-NEG-007)
- `cypress/e2e/general/` - General functionality tests (UAT-GEN-001 to UAT-GEN-004)
- `cypress/e2e/flows/` - Cross-role workflow tests (UAT-FLOW-001 to UAT-FLOW-003)

### Core Test Files
- `cypress/e2e/login.cy.js` - Login functionality tests
- `cypress/e2e/admin-dashboard.cy.js` - Admin dashboard navigation tests
- `cypress/e2e/crud-operations.cy.js` - CRUD operations for all entities
- `cypress/e2e/role-based-access.cy.js` - Role-based access control tests

## 🔧 Configuration

### Base URL
Tests run against: `http://127.0.0.1:8000`

### Test Credentials
Default test credentials (for local development):
- Admin: `admin@example.com` / `password`
- Operator: `perdanado11@gmail.com` / `perdana123`
- Safety Officer: `rendiando12@gmail.com` / `rendi123`
- Supervisor: `Agusnoti19@gmail.com` / `agustian123`

⚠️ **Note**: Real credentials are excluded from repository for security.

## 📈 Allure Reporting

### View Report Locally
```bash
npm run allure:serve
```

### View Report Online
Allure reports are automatically generated and published to GitHub Pages:
👉 **[View Latest Report](https://sulthanhs.github.io/cypress_test_HSE/)**

Reports are generated automatically via GitHub Actions on every push to `main` branch.

## 🧹 Cleanup Scripts

### Quick Cleanup (Recommended)
```bash
npx cypress run --spec "cypress/e2e/quick-cleanup.cy.js"
```

### Comprehensive Cleanup
```bash
npx cypress run --spec "cypress/e2e/cleanup-automation-users.cy.js"
```

## 🛠️ CI/CD Integration

This repository includes GitHub Actions workflow (`.github/workflows/allure-report.yml`) that:
1. Runs Cypress tests (when Laravel server is available)
2. Generates Allure report
3. Publishes to GitHub Pages automatically

### Setup GitHub Pages
1. Go to repository Settings → Pages
2. Source: Deploy from a branch → `gh-pages` (or use GitHub Actions)
3. Save

## 📝 Test Data Management
- Tests create temporary users with unique timestamps
- Cleanup scripts automatically remove all test data
- No manual cleanup required after test runs
- Safe to run multiple times

## 🔍 Troubleshooting

### Tests fail due to missing elements
- Check if `data-cy` attributes are present in the application
- Verify Laravel app is running at `http://127.0.0.1:8000`

### Allure report shows "Loading..."
- Open report via HTTP server, not `file://` protocol
- Use `npm run allure:serve` or `npx http-server allure-report`

### Report not updating on GitHub Pages
- Check GitHub Actions workflow status
- Ensure GitHub Pages is enabled in repository settings

## 📚 Related Repositories
- **Backend Application**: [DemoHSE Laravel App](https://github.com/SulthanHS/DemoHSE)
- **Portfolio**: [QA Portfolio](https://sulthanhs.github.io/portfolio)

## 📄 License
This test suite is part of the DemoHSE project demonstration.

