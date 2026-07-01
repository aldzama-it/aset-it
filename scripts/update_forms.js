const fs = require('fs');
const path = require('path');
const dir = 'components/forms';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');

    // Remove imports
    content = content.replace(/import \{ LocationSelect \} from '@\/components\/shared\/LocationSelect'\n/g, '');
    content = content.replace(/import \{ EmployeeSelect \} from '@\/components\/shared\/EmployeeSelect'\n/g, '');

    // Replace LocationSelect
    content = content.replace(/<LocationSelect\s+value=\{watch\('location_id'\)\}\s+onChange=\{\(v\)\s*=>\s*setValue\('location_id',\s*v\)\}\s*\/>/g, '<Input {...register(\'location\')} />');

    // Replace EmployeeSelect
    content = content.replace(/<EmployeeSelect\s+value=\{watch\('assigned_to'\)\}\s+onChange=\{\(v\)\s*=>\s*setValue\('assigned_to',\s*v\)\}\s*\/>/g, '<Input {...register(\'pic\')} />');

    fs.writeFileSync(p, content);
  }
});
console.log('Forms updated');
