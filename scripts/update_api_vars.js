const fs = require('fs');
const path = require('path');
const dir = 'app/api';

const scanAndReplace = (currentDir) => {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndReplace(fullPath);
    } else if (file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/location_id/g, 'location');
      content = content.replace(/assigned_to/g, 'pic');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

scanAndReplace(dir);
console.log('API variables updated');
