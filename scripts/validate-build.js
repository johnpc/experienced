#!/usr/bin/env node

/**
 * Build validation script for static site generation
 * Run this script to validate content and build configuration
 */

const {
  validateBuildContent,
  logBuildValidation,
  generateBuildReport,
} = require('../src/lib/build-validation');

async function main() {
  console.log('🚀 Starting build validation...\n');

  try {
    // Run validation
    const result = await validateBuildContent();

    // Log results
    logBuildValidation(result);

    // Generate detailed report
    const report = await generateBuildReport();

    // Save report to file if in CI environment
    if (process.env.CI) {
      const fs = require('fs');
      const path = require('path');

      const reportPath = path.join(process.cwd(), 'build-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Build report saved to: ${reportPath}`);
    }

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('❌ Build validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
