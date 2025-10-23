const puppeteer = require('puppeteer');
const assert = require('assert');

async function testWidget() {
  console.log('Starting widget tests...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Load the test page
    await page.goto('http://localhost:3000/test-widget.html');
    console.log('✓ Test page loaded');

    // Wait for widget to initialize
    await page.waitForSelector('[class^="fv-"]');
    console.log('✓ Widget initialized');

    // Test 1: Verify widget button appearance
    const buttonStyles = await page.evaluate(() => {
      const button = document.querySelector('[class^="fv-"][class*="widget-button"]');
      return window.getComputedStyle(button);
    });

    assert(buttonStyles.background.includes('linear-gradient'));
    console.log('✓ Button styles applied correctly');

    // Test 2: Verify widget position
    const containerStyles = await page.evaluate(() => {
      const container = document.querySelector('[class^="fv-"][class*="widget-container"]');
      return window.getComputedStyle(container);
    });

    assert(containerStyles.position === 'fixed');
    assert(containerStyles.right === '20px' || containerStyles.left === '20px');
    console.log('✓ Widget position correct');

    // Test 3: Test button click
    await page.click('[class^="fv-"][class*="widget-button"]');
    console.log('✓ Button click registered');

    // Test 4: Verify voting board iframe
    const votingBoard = await page.$('#voting-board iframe');
    assert(votingBoard !== null);
    console.log('✓ Voting board loaded');

    // Test 5: Verify custom button
    await page.click('#suggest-feature-btn');
    console.log('✓ Custom button click registered');

    // Test 6: Check analytics events
    const analyticsRequests = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/widget/analytics')) {
        analyticsRequests.push(request);
      }
    });

    console.log('✓ Analytics events tracked:', analyticsRequests.length);

    // Test 7: Verify settings API call
    const settingsRequests = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/widget/config/')) {
        settingsRequests.push(request);
      }
    });

    assert(settingsRequests.length > 0);
    console.log('✓ Settings API called successfully');

    console.log('\nAll tests passed! ✨');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run tests
testWidget().catch(console.error);
