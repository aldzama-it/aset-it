const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// 1. Remove employee and location models
schema = schema.replace(/model employee \{[\s\S]*?\n\}\n/g, '');
schema = schema.replace(/model location \{[\s\S]*?\n\}\n/g, '');
schema = schema.replace(/enum location_type \{[\s\S]*?\n\}\n/g, '');

// 2. Update assethistory
schema = schema.replace(/from_employee_id\s+Int\?/g, 'from_employee String? @db.VarChar(100)');
schema = schema.replace(/to_employee_id\s+Int\?/g, 'to_employee String? @db.VarChar(100)');
schema = schema.replace(/from_location_id\s+Int\?/g, 'from_location String? @db.VarChar(100)');
schema = schema.replace(/to_location_id\s+Int\?/g, 'to_location String? @db.VarChar(100)');
schema = schema.replace(/.*@relation\("assethistory.*\n/g, '');
schema = schema.replace(/.*@@index\(\[from_employee_id\].*\n/g, '');
schema = schema.replace(/.*@@index\(\[to_employee_id\].*\n/g, '');
schema = schema.replace(/.*@@index\(\[from_location_id\].*\n/g, '');
schema = schema.replace(/.*@@index\(\[to_location_id\].*\n/g, '');

// 3. Update all asset tables
schema = schema.replace(/location_id\s+Int\?/g, 'location String? @db.VarChar(100)');
schema = schema.replace(/assigned_to\s+Int\?/g, 'pic String? @db.VarChar(100)');
schema = schema.replace(/.*@relation\(fields: \[location_id\].*\n/g, '');
schema = schema.replace(/.*@relation\(fields: \[assigned_to\].*\n/g, '');
schema = schema.replace(/.*@@index\(\[location_id\].*\n/g, '');
schema = schema.replace(/.*@@index\(\[assigned_to\].*\n/g, '');

// Delete lingering location/employee relation fields that might have different names, e.g. location location? 
schema = schema.replace(/.*location\s+location\?.*\n/g, '');
schema = schema.replace(/.*employee\s+employee\?.*\n/g, '');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated successfully');
