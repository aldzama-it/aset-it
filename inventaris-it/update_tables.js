const fs = require('fs');
const path = require('path');
const dir = 'components/tables';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');

    content = content.replace(/item\.location\?\.name/g, 'item.location');
    content = content.replace(/item\.employee\?\.name/g, 'item.pic');

    fs.writeFileSync(p, content);
  }
});
console.log('Tables updated');
