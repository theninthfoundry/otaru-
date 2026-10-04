import fs from 'fs';
import path from 'path';

// This script runs before `next build`.
// It fails the build if any unresolved placeholders or 'todo' claims exist in the project.

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function run() {
  console.log('🔍 Running Build Guard: Checking claims and placeholders...');
  let hasErrors = false;

  // 1. Check content files for placeholders
  const contentFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.ts') && f !== 'claims.ts');
  
  for (const file of contentFiles) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    if (content.includes('[CONFIRM]') || content.includes('TODO_CONFIRM')) {
      console.error(`❌ Build Guard Error: Found unresolved placeholder ([CONFIRM] or TODO_CONFIRM) in content/${file}`);
      hasErrors = true;
    }
  }

  // 2. Check claims registry
  const claimsFile = path.join(CONTENT_DIR, 'claims.ts');
  if (fs.existsSync(claimsFile)) {
    const claimsContent = fs.readFileSync(claimsFile, 'utf-8');
    
    // Very rudimentary regex to find status: 'todo'
    // In a real robust script, we'd import the TS file, but for prebuild scripts without TS execution env, regex works.
    if (claimsContent.includes("status: 'todo'") || claimsContent.includes('status: "todo"')) {
      console.error(`❌ Build Guard Error: Found unconfirmed claims (status: 'todo') in content/claims.ts`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\n🚨 BUILD FAILED: You must resolve all placeholders and confirm all claims before deploying to production.');
    console.error('See docs/FOUNDER_HANDOFF.md for instructions.');
    process.exit(1);
  } else {
    console.log('✅ Build Guard passed. No unconfirmed claims or placeholders found.');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
