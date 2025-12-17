const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Allure Report to GitHub Pages...\n');

const sourceDir = path.join(__dirname, 'allure-report');
const targetDir = path.join(__dirname, 'docs', 'allure-report');

// Check if source report exists
if (!fs.existsSync(sourceDir)) {
  console.error('❌ Error: allure-report folder not found!');
  console.log('💡 Please generate the report first:');
  console.log('   1. Run tests: npm run cypress:run:allure');
  console.log('   2. Generate report: npm run allure:generate');
  process.exit(1);
}

if (!fs.existsSync(path.join(sourceDir, 'index.html'))) {
  console.error('❌ Error: allure-report/index.html not found!');
  console.log('💡 Please generate the report first: npm run allure:generate');
  process.exit(1);
}

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log('✅ Created docs/ directory');
}

// Remove old report if exists
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log('🗑️  Removed old report from docs/allure-report');
}

// Copy report to docs folder
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(sourceDir, targetDir);

console.log('✅ Report copied to docs/allure-report');
console.log('\n📝 Next steps:');
console.log('   1. Review the changes: git status');
console.log('   2. Add files: git add docs/allure-report');
console.log('   3. Commit: git commit -m "Update Allure report"');
console.log('   4. Push: git push origin main');
console.log('\n🌐 After pushing, report will be available at:');
console.log('   https://sulthanhs.github.io/cypress_test_HSE/');
console.log('\n✨ Done!');

