#!/bin/bash

# eCareHealth API Workflow Tests Runner
# This script runs the complete appointment booking workflow tests

echo "🚀 Starting eCareHealth API Workflow Tests"
echo "=========================================="

# Check if Playwright is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js and npm first."
    exit 1
fi

# Check if playwright is available
if ! npx playwright --version &> /dev/null; then
    echo "❌ Playwright not found. Installing..."
    npm install @playwright/test
fi

echo "📋 Available workflow tests:"
echo "1. Complete Appointment Workflow (Basic)"
echo "2. Enhanced Appointment Workflow (Advanced)"
echo "3. Complete Healthcare Workflow (End-to-End with Check-in & Encounter)"
echo "4. All workflows"
echo "5. Individual API tests"
echo ""

read -p "Select test to run (1-5): " choice

case $choice in
    1)
        echo "🧪 Running Complete Appointment Workflow..."
        npx playwright test tests/api/complete-appointment-workflow.spec.js --reporter=line
        ;;
    2)
        echo "🧪 Running Enhanced Appointment Workflow..."
        npx playwright test tests/api/enhanced-appointment-workflow.spec.js --reporter=line
        ;;
    3)
        echo "🧪 Running Complete Healthcare Workflow (End-to-End)..."
        npx playwright test tests/api/complete-healthcare-workflow.spec.js --reporter=line
        ;;
    4)
        echo "🧪 Running All Workflows..."
        npx playwright test tests/api/complete-appointment-workflow.spec.js tests/api/enhanced-appointment-workflow.spec.js tests/api/complete-healthcare-workflow.spec.js --reporter=line
        ;;
    5)
        echo "🧪 Running Individual API Tests..."
        echo "Available individual tests:"
        echo "  - appointment-booking-test.spec.js"
        echo "  - get-appointments-test.spec.js"
        echo "  - provider-slots-test.spec.js"
        echo "  - update-appointment-status-test.spec.js"
        echo ""
        npx playwright test tests/api/ --reporter=line
        ;;
    *)
        echo "❌ Invalid choice. Please select 1-5."
        exit 1
        ;;
esac

echo ""
echo "✅ Test execution completed!"
echo "📊 Check the output above for detailed results."
echo "📁 HTML report available at: playwright-report/index.html"