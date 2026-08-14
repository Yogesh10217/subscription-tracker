import http from 'http';

const BASE_URL = process.env.SERVER_URL || 'http://localhost:3000';

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${BASE_URL}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      })
      .on('error', (err) => reject(err));
  });
}

async function runSmokeTests() {
  console.log('🚀 Running SubPulse Next.js Platform Smoke Tests...\n');
  const endpoints = [
    { path: '/', expected: [200], label: 'Next.js App Dashboard' },
    { path: '/api/subscriptions', expected: [200], label: 'Subscriptions API Endpoint' },
    { path: '/api/analytics', expected: [200], label: 'Analytics Engine API Endpoint' },
  ];

  let passed = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetchUrl(ep.path);
      const expectedCodes = Array.isArray(ep.expected) ? ep.expected : [ep.expected];
      if (expectedCodes.includes(res.status)) {
        console.log(`✅ [PASS] ${ep.label} (${ep.path}) -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(
          `❌ [FAIL] ${ep.label} (${ep.path}) -> Expected HTTP ${expectedCodes.join('/')}, got ${res.status}`
        );
      }
    } catch (err) {
      console.error(`❌ [FAIL] ${ep.label} (${ep.path}) -> Error: ${err.message}`);
    }
  }

  console.log(`\n📊 Smoke Test Results: ${passed}/${endpoints.length} Passed`);
  if (passed !== endpoints.length) {
    process.exit(1);
  }
}

runSmokeTests();
