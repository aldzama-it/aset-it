const fs = require('fs');
const path = require('path');

const scanAndReplace = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndReplace(fullPath);
    } else if (file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/employee:\s*\{\s*name:\s*\{\s*contains:\s*search\s*\}\s*\}/g, 'pic: { contains: search }');
      content = content.replace(/to_employee_id/g, 'to_employee');
      content = content.replace(/from_employee_id/g, 'from_employee');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

scanAndReplace('app/api');
console.log('API fixed');
