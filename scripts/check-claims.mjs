import fs from 'fs';
import path from 'path';

// Claim & placeholder validation script
const CONTENT_DIR = path.join(process.cwd(), 'content');

async function run() {
  console.log('🔍 Running Build Guard: Checking claims and placeholders...');
  let hasErrors = false;

  if (fs.existsSync(CONTENT_DIR)) {
    const contentFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.ts') && f !== 'claims.ts');
    
    for (const file of contentFiles) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      if (content.includes('[CONFIRM]') || content.includes('TODO_CONFIRM')) {
        console.warn(`⚠️ Notice: Found placeholder ([CONFIRM]) in content/${file}`);
        hasErrors = true;
      }
    }

    const claimsFile = path.join(CONTENT_DIR, 'claims.ts');
    if (fs.existsSync(claimsFile)) {
      const claimsContent = fs.readFileSync(claimsFile, 'utf-8');
      if (claimsContent.includes("status: 'todo'") || claimsContent.includes('status: "todo"')) {
        console.warn(`⚠️ Notice: Found unconfirmed claims in content/claims.ts`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('❌ Build Guard Failed: Editorial placeholders detected. Please resolve placeholders before release.');
    process.exit(1);
  } else {
    console.log('✅ Build Guard passed. Archive claims verified.');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Build Guard execution error:', err);
  process.exit(1);
});
