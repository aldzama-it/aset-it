const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Fix Next.js 15+ async params
      if (content.includes('{ params }') || content.includes('{params}')) {
        // Change params type to Promise
        content = content.replace(/params:\s*\{\s*([a-zA-Z]+):\s*string\s*\}/g, 'params: Promise<{ $1: string }>');
        
        // Inject await inside the function blocks
        // For GET, POST, PUT, DELETE
        const methods = ['GET', 'POST', 'PUT', 'DELETE'];
        for (const method of methods) {
          const regex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\([^)]*params[^)]*\\)\\s*\\{`, 'g');
          content = content.replace(regex, (match) => {
            return match + '\n  const resolvedParams = await params;';
          });
        }

        // Replace params.id with resolvedParams.id
        content = content.replace(/params\.id/g, 'resolvedParams.id');
        content = content.replace(/params\.filename/g, 'resolvedParams.filename');

        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
};

walk('app/api');
console.log('Fixed async params');
