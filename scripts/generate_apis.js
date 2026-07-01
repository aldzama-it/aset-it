const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'network', table: 'networkDevice', codePrefix: 'NET', hasAssignedTo: false },
  { name: 'printers', table: 'printer', codePrefix: 'PRN', hasAssignedTo: false },
  { name: 'cctv', table: 'cctv', codePrefix: 'CTV', hasAssignedTo: false },
  { name: 'laptop-accessories', table: 'laptopAccessory', codePrefix: 'ACC', hasAssignedTo: true },
  { name: 'ht', table: 'ht', codePrefix: 'HT', hasAssignedTo: true },
  { name: 'tablets', table: 'tablet', codePrefix: 'TBL', hasAssignedTo: true },
  { name: 'cameras', table: 'camera', codePrefix: 'CAM', hasAssignedTo: true },
  { name: 'starlinks', table: 'starlink', codePrefix: 'STL', hasAssignedTo: false },
  { name: 'dashcams', table: 'dashcam', codePrefix: 'DCM', hasAssignedTo: false },
];

const apiDir = path.join(__dirname, '../app/api');

entities.forEach(entity => {
  const dir = path.join(apiDir, entity.name);
  const idDir = path.join(dir, '[id]');
  
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(idDir, { recursive: true });

  const includeStr = entity.hasAssignedTo ? 'employee: true, location: true' : 'location: true';

  const routeContent = `import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  try {
    const data = await prisma.${entity.table}.findMany({
      where: search ? {
        OR: [
          { asset_code: { contains: search } },
          ${entity.hasAssignedTo ? `{ employee: { name: { contains: search } } },` : ''}
          ${entity.name === 'dashcams' ? `{ vehicle_name: { contains: search } }` : `{ brand: { contains: search } }, { model: { contains: search } }`}
        ]
      } : undefined,
      include: { ${includeStr} },
      orderBy: { created_at: 'desc' }
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const last = await prisma.${entity.table}.findFirst({ orderBy: { id: 'desc' } })
    const asset_code = generateAssetCode('${entity.codePrefix}', last?.asset_code)
    const data = await prisma.${entity.table}.create({
      data: { ...body, asset_code },
      include: { ${includeStr} }
    })
    await recordHistory({
      table_name: '${entity.table}s', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      ${entity.hasAssignedTo ? `to_employee_id: data.assigned_to, ` : ''}to_location_id: data.location_id
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
`;
  
  fs.writeFileSync(path.join(dir, 'route.ts'), routeContent);

  const idRouteContent = `import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const before = await prisma.${entity.table}.findUnique({ where: { id: +params.id } })
    const data = await prisma.${entity.table}.update({
      where: { id: +params.id }, data: body,
      include: { ${includeStr} }
    })
    await recordHistory({
      table_name: '${entity.table}s', asset_id: data.id, asset_code: data.asset_code,
      action: before?.location_id !== data.location_id ? 'Dipindah_Lokasi'
            ${entity.hasAssignedTo ? `: before?.assigned_to !== data.assigned_to ? 'Diserahkan'` : ''}
            : before?.condition !== data.condition ? 'Kondisi_Berubah'
            : 'Diperbarui',
      old_condition: before?.condition, new_condition: data.condition,
      from_location_id: before?.location_id, to_location_id: data.location_id,
      ${entity.hasAssignedTo ? `from_employee_id: before?.assigned_to, to_employee_id: data.assigned_to` : ''}
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal mengupdate data' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const before = await prisma.${entity.table}.findUnique({ where: { id: +params.id } })
    await recordHistory({
      table_name: '${entity.table}s', asset_id: +params.id, asset_code: before?.asset_code,
      action: 'Dihapus', old_condition: before?.condition
    })
    await prisma.${entity.table}.delete({ where: { id: +params.id } })
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal menghapus data' }, { status: 500 })
  }
}
`;

  fs.writeFileSync(path.join(idDir, 'route.ts'), idRouteContent);
});

console.log('API generation complete.');
