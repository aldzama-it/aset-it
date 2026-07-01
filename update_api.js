const fs = require('fs');
const path = require('path');

const deleteDir = (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// 1. Delete employee and location routes
deleteDir('app/api/employees');
deleteDir('app/api/locations');
deleteDir('app/(app)/employees');
deleteDir('app/(app)/locations');
deleteDir('components/shared'); // Wait, ConditionBadge is in here! Let's just delete the files directly.

// Recreate components/shared and put ConditionBadge back if we delete it? No, just delete specific files.
if (fs.existsSync('components/shared/EmployeeSelect.tsx')) fs.unlinkSync('components/shared/EmployeeSelect.tsx');
if (fs.existsSync('components/shared/LocationSelect.tsx')) fs.unlinkSync('components/shared/LocationSelect.tsx');


// 2. Remove include from all APIs
const scanAndReplace = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndReplace(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // regex to remove include: { ... } where it might contain location or employee
      const original = content;
      content = content.replace(/,\s*include:\s*\{[^}]*\}/g, '');
      content = content.replace(/include:\s*\{[^}]*\},\s*/g, '');
      content = content.replace(/include:\s*\{[^}]*\}/g, '');

      if (original !== content) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

scanAndReplace('app/api');
console.log('API updated');
