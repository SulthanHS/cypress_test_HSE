const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Generating Allure Report...');

try {
  // Change to the correct directory
  process.chdir(__dirname);
  
  // Generate report
  execSync('npx allure generate allure-results --clean', { 
    stdio: 'inherit',
    shell: true 
  });
  
  console.log('✅ Report generated successfully!');
  console.log('📁 Check the allure-report folder');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
