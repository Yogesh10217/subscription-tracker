#!/usr/bin/env node
/**
 * @file qstash-diagnostics.js
 * @description QStash configuration and connectivity diagnostic tool.
 * NEVER prints secret values.
 */
import { config } from 'dotenv';

config({ path: '.env' });

function maskSecret(value) {
  if (!value) return '(not set)';
  if (value.length <= 4) return '****';
  return value.substring(0, 4) + '***';
}

function parseUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    return { hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? '443' : '80'), protocol: url.protocol };
  } catch {
    return { hostname: 'INVALID_URL', port: 'N/A', protocol: 'N/A' };
  }
}

async function probeEndpoint(urlStr) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(urlStr, { method: 'GET', signal: controller.signal });
    clearTimeout(timeout);
    return { reachable: true, statusCode: response.status, statusText: response.statusText };
  } catch (err) {
    return { reachable: false, error: err.message || 'Unknown error' };
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║        QStash Configuration Diagnostics          ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const qstashUrl = process.env.QSTASH_URL;
  const qstashToken = process.env.QSTASH_TOKEN;
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;
  const callbackUrl = process.env.QSTASH_CALLBACK_URL;

  console.log('── Environment Variables ──');
  console.log(`  QSTASH_URL:                  ${qstashUrl || '(not set)'}`);
  console.log(`  QSTASH_TOKEN:                ${maskSecret(qstashToken)}`);
  console.log(`  QSTASH_CURRENT_SIGNING_KEY:  ${maskSecret(currentSigningKey)}`);
  console.log(`  QSTASH_NEXT_SIGNING_KEY:     ${maskSecret(nextSigningKey)}`);
  console.log(`  QSTASH_CALLBACK_URL:         ${callbackUrl || '(not set)'}`);
  console.log();

  // Parse URL
  const urlInfo = parseUrl(qstashUrl || '');
  const isLoopback = ['127.0.0.1', 'localhost', '::1'].includes(urlInfo.hostname);

  console.log('── Endpoint Analysis ──');
  console.log(`  Hostname:    ${urlInfo.hostname}`);
  console.log(`  Port:        ${urlInfo.port}`);
  console.log(`  Protocol:    ${urlInfo.protocol}`);
  console.log(`  Loopback:    ${isLoopback ? 'YES ⚠️  (not a cloud QStash endpoint)' : 'NO ✅'}`);
  console.log();

  // Missing config
  const missing = [];
  if (!qstashUrl) missing.push('QSTASH_URL');
  if (!qstashToken || qstashToken === 'development' || qstashToken === 'mock_qstash_token') missing.push('QSTASH_TOKEN (production value)');
  if (!currentSigningKey || currentSigningKey === 'development') missing.push('QSTASH_CURRENT_SIGNING_KEY (production value)');
  if (!nextSigningKey || nextSigningKey === 'development') missing.push('QSTASH_NEXT_SIGNING_KEY (production value)');

  if (missing.length > 0) {
    console.log('── Missing / Mock Configuration ──');
    missing.forEach(m => console.log(`  ⚠️  ${m}`));
    console.log();
  }

  // Probe
  if (qstashUrl) {
    console.log('── Connectivity Probe ──');
    const probe = await probeEndpoint(qstashUrl);
    if (probe.reachable) {
      console.log(`  Status:      REACHABLE ✅`);
      console.log(`  HTTP:        ${probe.statusCode} ${probe.statusText}`);
    } else {
      console.log(`  Status:      UNREACHABLE ❌`);
      console.log(`  Error:       ${probe.error}`);
    }
    console.log();
  }

  // Verdict
  console.log('── Verdict ──');
  if (isLoopback || missing.length > 0) {
    console.log('  QSTASH LOCAL VERIFICATION:');
    console.log('  NOT VERIFIED — EXTERNAL INFRASTRUCTURE REQUIRED');
    console.log();
    console.log('  To verify QStash connectivity:');
    console.log('  1. Set QSTASH_URL to your live Upstash QStash endpoint');
    console.log('  2. Set QSTASH_TOKEN to a valid Upstash token');
    console.log('  3. Set QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY');
    console.log('  4. Set QSTASH_CALLBACK_URL to a publicly reachable webhook URL');
    console.log('  5. Re-run: node scripts/qstash-diagnostics.js');
    process.exit(1);
  } else {
    console.log('  QStash configuration appears valid ✅');
    console.log('  Cloud endpoint detected. Run integration tests to verify callbacks.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Diagnostic error:', err.message);
  process.exit(1);
});
