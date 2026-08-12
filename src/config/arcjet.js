import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';
import { ARCJET_KEY, NODE_ENV } from './env.js';

const isProd = NODE_ENV === 'production';

const aj = arcjet({
  key: ARCJET_KEY || 'ajkey_development_placeholder',
  characteristics: ['ip.src'],
  rules: [
    shield({ mode: isProd ? 'LIVE' : 'DRY_RUN' }),
    detectBot({
      mode: 'DRY_RUN',
      allow: ['CATEGORY:SEARCH_ENGINE']
    }),
    tokenBucket({
      mode: isProd ? 'LIVE' : 'DRY_RUN',
      refillRate: 20,
      interval: 10,
      capacity: 100
    })
  ]
});

export default aj;
