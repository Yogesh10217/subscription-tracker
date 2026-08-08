import http from 'http';

const BASE_URL = process.env.SERVER_URL || 'http://localhost:5500';

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
  console.log('🚀 Running SubPulse Platform Smoke Tests...\n');
  const endpoints = [
    { path: '/health', expected: [200], label: 'System Health Check' },
    { path: '/ready', expected: [200], label: 'Readiness Probe' },
    { path: '/live', expected: [200], label: 'Liveness Probe' },
    {
      path: '/api/v1/subscriptions',
      expected: [200, 401],
      label: 'Subscriptions Endpoint (Secured)'
    },
    { path: '/api/v1/users', expected: [200, 401], label: 'Users Endpoint (Secured)' },
    { path: '/', expected: [200], label: 'Frontend Dashboard Index' }
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
