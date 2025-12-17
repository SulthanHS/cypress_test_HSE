# DemoHSE Cypress Test Suite

## Overview
This directory contains comprehensive Cypress end-to-end tests for the DemoHSE Laravel application, covering login, dashboard navigation, CRUD operations, role-based access control, and 50 UAT test cases.

## Test Structure

### Core Test Files
- `login.cy.js` - Login functionality tests
- `admin-dashboard.cy.js` - Admin dashboard navigation tests
- `crud-operations.cy.js` - CRUD operations for all entities
- `role-based-access.cy.js` - Role-based access control tests
- `setup-test-users.cy.js` - Test user provisioning script

### UAT Test Files (Organized by Role)
- `admin/` - Admin role UAT tests (UAT-ADM-001 to UAT-ADM-020)
- `operator/` - Operator role UAT tests (UAT-OPR-001 to UAT-OPR-008)
- `safety-officer/` - Safety Officer role UAT tests (UAT-SOF-001 to UAT-SOF-010)
- `supervisor/` - Supervisor role UAT tests (UAT-SPV-001 to UAT-SPV-004)
- `negative/` - Negative test cases (UAT-NEG-001 to UAT-NEG-007)
- `general/` - General functionality tests (UAT-GEN-001 to UAT-GEN-004)
- `flows/` - Cross-role workflow tests (UAT-FLOW-001 to UAT-FLOW-003)

### Cleanup Scripts
- `cleanup-users.cy.js` - Basic cleanup script
- `cleanup-simple.cy.js` - Simple cleanup using custom commands
- `cleanup-automation-users.cy.js` - **NEW: Comprehensive cleanup for automation users**
- `quick-cleanup.cy.js` - **NEW: Fast daily cleanup script**

## Custom Commands
- `cy.loginAsAdmin()` - Login as admin user
- `cy.cleanupTestUsers()` - Clean up test users
- `cy.verifyNoTestUsers()` - Verify no test users remain

## Running Tests

### Run All Tests
```bash
npx cypress run
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/admin/UAT-1-5-Admin.cy.js"
```

### Run Tests by Role
```bash
# Admin tests
npx cypress run --spec "cypress/e2e/admin/**/*.cy.js"

# Operator tests
npx cypress run --spec "cypress/e2e/operator/**/*.cy.js"
```

## Cleanup Scripts Usage

### Quick Daily Cleanup (Recommended)
```bash
npx cypress run --spec "cypress/e2e/quick-cleanup.cy.js"
```
**Use this for daily cleanup** - Fast, simple, removes all UAT users automatically.

### Comprehensive Cleanup
```bash
npx cypress run --spec "cypress/e2e/cleanup-automation-users.cy.js"
```
**Use this for thorough cleanup** - Multiple strategies, retry mechanism, detailed logging.

### Features of Cleanup Scripts
- **Automatic detection** of UAT/automation users by name/email patterns
- **Confirmation dialog handling** - No manual intervention needed
- **Multiple cleanup strategies** - Pattern-based, retry mechanism, force cleanup
- **Verification** - Confirms all automation users are removed
- **Detailed logging** - Shows what's being deleted and progress
- **Safe deletion** - Won't delete admin accounts or current user

### What Gets Cleaned Up
- Users with names containing "UAT" or "Test"
- Users with emails containing "uat_", "test_"
- Specific patterns: "uat_user_", "uat_edit_", "uat_delete_", "uat_count_"
- All automation test users created during UAT testing

### Cleanup Patterns Detected
```javascript
// Name patterns
name.includes('UAT') || name.includes('Test')

// Email patterns  
email.includes('uat_') || email.includes('test_')
email.includes('uat_user_') || email.includes('uat_edit_')
email.includes('uat_delete_') || email.includes('uat_count_')
```

## Test Data Management
- Tests create temporary users with unique timestamps
- Cleanup scripts automatically remove all test data
- No manual cleanup required after test runs
- Safe to run multiple times

## New Features Added

### Inventory Delete Functionality
- **Admin & Safety Officer** can now delete equipment units from inventory
- **Delete button** with confirmation modal for safety
- **Data-CY attributes** added for reliable Cypress testing
- **Route protection** - only authorized roles can delete

### Equipment Unit Search in Problem Reports
- **Autocomplete dropdown** for equipment unit selection
- **Real-time search** using jQuery UI autocomplete
- **Required field validation** - must select existing equipment unit
- **Proper form submission** only after equipment selection

### Updated UAT Flow Tests
- **Equipment unit search** now properly selects from dropdown
- **Notifications replaced** with equipment requests check
- **Data-CY selectors** for reliable button interactions
- **Modal handling** for delete confirmations

## Configuration
- Base URL: `http://127.0.0.1:8000`
- Admin credentials: `admin@example.com` / `password`
- Test users are automatically created and cleaned up
- Uses `data-cy` attributes for stable selectors

## Troubleshooting
- If tests fail due to missing elements, check if `data-cy` attributes are present
- Run cleanup scripts if test data accumulates
- Use `cypress open` for interactive debugging
- Check browser console for application errors

## Notes
- All UAT tests are organized by user role and functionality
- Cleanup scripts are safe and won't delete production data
- Tests use robust selectors and error handling
- Comprehensive coverage of application functionality
