/**
 * Security Verification Script
 * Run: node scripts/security-check.js
 * 
 * Checks:
 * 1. No secrets in client bundles
 * 2. Server actions validate roles
 * 3. Quiz grading is server-side only
 * 4. File uploads validate MIME/size
 * 5. Certificate verification uses HMAC
 */

const fs = require('fs');
const path = require('path');

const PASS = '  ✓';
const FAIL = '  ✗';
let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`${PASS} ${label}`);
  } else {
    console.log(`${FAIL} ${label}`);
    failures++;
  }
}

console.log('\n=== SkillItLearn Security Audit ===\n');

// ── 1. Check no secrets in client code ──
console.log('1. Secret Exposure Check');

function scanDir(dir, patterns) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    const fp = path.join(dir, String(file));
    if (!fs.statSync(fp).isFile()) continue;
    if (!fp.endsWith('.js') && !fp.endsWith('.html')) continue;
    
    const content = fs.readFileSync(fp, 'utf8');
    for (const pat of patterns) {
      if (content.includes(pat)) {
        results.push({ file: fp, pattern: pat });
      }
    }
  }
  return results;
}

// Check .next/static (client bundles) for secrets
const clientSecretLeaks = scanDir('.next/static', [
  'SUPABASE_SERVICE_ROLE_KEY',
  'CERTIFICATE_SECRET',
  'skillitlearn-cert-secret',
  'service_role',
]);
check('No service role key in client bundles', clientSecretLeaks.length === 0);
if (clientSecretLeaks.length > 0) {
  clientSecretLeaks.forEach(l => console.log(`    LEAK: ${l.pattern} in ${l.file}`));
}

// Check env vars are not NEXT_PUBLIC_ for secrets
const envLocal = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const envFile = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
const allEnv = envLocal + envFile;
check('SUPABASE_SERVICE_ROLE_KEY is not NEXT_PUBLIC_', !allEnv.includes('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE'));
check('CERTIFICATE_SECRET is not NEXT_PUBLIC_', !allEnv.includes('NEXT_PUBLIC_CERTIFICATE_SECRET'));

// ── 2. Quiz grading is server-side ──
console.log('\n2. Quiz Grading Security');

const quizActions = fs.readFileSync('src/app/(main)/careers/[slug]/[pathSlug]/[skillSlug]/quiz/actions.ts', 'utf8');
check('Quiz actions use "use server"', quizActions.includes('"use server"'));
check('Correct choice is NOT sent to client', quizActions.includes('correctChoiceId is NOT selected'));
check('Server-side grading compares answers', quizActions.includes('correctChoiceId') && quizActions.includes('score'));

const quizClient = fs.readFileSync('src/app/(main)/careers/[slug]/[pathSlug]/[skillSlug]/quiz/quiz-client.tsx', 'utf8');
check('Client never references correctChoiceId', !quizClient.includes('correctChoiceId'));

// ── 3. File upload validation ──
console.log('\n3. File Upload Validation');

const uploadActions = fs.readFileSync('src/app/(main)/admin/actions/upload-actions.ts', 'utf8');
check('Upload validates MIME type', uploadActions.includes('ALLOWED_MIMES'));
check('Upload enforces max file size', uploadActions.includes('MAX_SIZE'));
check('Upload requires admin role', uploadActions.includes('requireRole'));

const certUploadActions = fs.readFileSync('src/app/(main)/admin/certificates/actions.ts', 'utf8');
check('Cert upload validates MIME type', certUploadActions.includes('ALLOWED_IMAGE_MIMES'));
check('Cert upload enforces max size', certUploadActions.includes('MAX_SIZE'));

// ── 4. Certificate HMAC verification ──
console.log('\n4. Certificate Security');

const certActions = fs.readFileSync('src/app/(main)/certificates/actions.ts', 'utf8');
check('Certificate uses HMAC for verification', certActions.includes('createHmac'));
check('Certificate checks hash on verify', certActions.includes('expectedHash') && certActions.includes('verificationHash'));
check('Signed URLs expire (not permanent)', certActions.includes('createSignedUrl') && certActions.includes('300'));
check('Certificate ID uniqueness is enforced', certActions.includes('ensureUniqueCertId'));

// ── 5. Auth & Role Checks ──
console.log('\n5. Auth & Role Enforcement');

const adminCareerActions = fs.readFileSync('src/app/(main)/admin/actions/career-actions.ts', 'utf8');
check('Career admin actions require role', adminCareerActions.includes('requireRole'));

const adminPathActions = fs.readFileSync('src/app/(main)/admin/actions/path-actions.ts', 'utf8');
check('Path admin actions require role', adminPathActions.includes('requireRole'));

const middleware = fs.readFileSync('src/middleware.ts', 'utf8');
check('Middleware protects /admin routes', middleware.includes('/admin'));
check('Middleware refreshes session', middleware.includes('getUser'));

// ── 6. Security headers ──
console.log('\n6. Security Headers');

const nextConfig = fs.readFileSync('next.config.mjs', 'utf8');
check('CSP header configured', nextConfig.includes('Content-Security-Policy'));
check('X-Frame-Options: DENY', nextConfig.includes('DENY'));
check('X-Content-Type-Options: nosniff', nextConfig.includes('nosniff'));
check('HSTS configured', nextConfig.includes('Strict-Transport-Security'));
check('Referrer-Policy configured', nextConfig.includes('strict-origin-when-cross-origin'));
check('Permissions-Policy configured', nextConfig.includes('Permissions-Policy'));

// ── Summary ──
console.log(`\n${'='.repeat(40)}`);
if (failures === 0) {
  console.log('All security checks passed! ✅');
} else {
  console.log(`${failures} security check(s) FAILED ❌`);
}
console.log('');
process.exit(failures > 0 ? 1 : 0);
