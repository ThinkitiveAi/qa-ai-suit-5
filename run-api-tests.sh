#!/bin/bash

# eCareHealth API Test Runner
# This script runs the API tests with proper reporting

echo "🚀 Running eCareHealth API Tests"
echo "================================="

# Create directories for reports if they don't exist
mkdir -p test-results
mkdir -p playwright-report

# Run API tests
npx playwright test tests/api/ --project=api

# Check test result
if [ $? -eq 0 ]; then
  echo "✅ API Tests completed successfully!"
else
  echo "❌ Some API tests failed. Check the report for details."
fi

# Open report
echo "📊 Generating test report..."
npx playwright show-report

echo "Done!" 