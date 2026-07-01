const fs = require('fs');
const path = require('path');
const dir = 'app/(app)';

const scanAndReplace = (currentDir) => {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndReplace(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace item.location?.name with item.location
      content = content.replace(/item\.location\?\.name/g, 'item.location');
      // Replace item.employee?.name with item.pic
      content = content.replace(/item\.employee\?\.name/g, 'item.pic');

      // Also for dashboard
      content = content.replace(/h\.from_location\?\.name/g, 'h.from_location');
      content = content.replace(/h\.to_location\?\.name/g, 'h.to_location');
      content = content.replace(/h\.from_employee\?\.name/g, 'h.from_employee');
      content = content.replace(/h\.to_employee\?\.name/g, 'h.to_employee');

      fs.writeFileSync(fullPath, content);
    }
  }
}

scanAndReplace(dir);
console.log('Pages updated');
