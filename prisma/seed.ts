import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean
  await prisma.job.deleteMany();
  await prisma.jobType.deleteMany();
  await prisma.property.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const admin = await prisma.user.create({
    data: { name: 'Admin', phone: '3221234567', canAssign: true }
  });
  const maria = await prisma.user.create({
    data: { name: 'Maria Gonzalez', phone: '3229876543', canAssign: false }
  });
  const ana = await prisma.user.create({
    data: { name: 'Ana Lopez', phone: '3225551234', canAssign: false }
  });

  // Client
  const cliente1 = await prisma.client.create({
    data: { name: 'Carlos Mendoza', phone: '3221112233', email: 'carlos@email.com' }
  });

  // Properties
  const prop1 = await prisma.property.create({
    data: { name: 'Casa Playa', address: 'Av. Principal #123', clientId: cliente1.id }
  });
  const prop2 = await prisma.property.create({
    data: { name: 'Depto Centro', address: 'Calle 5 de Mayo #45', clientId: cliente1.id }
  });

  // JobTypes
  const limpieza = await prisma.jobType.create({
    data: { name: 'Limpieza', checklistTemplate: JSON.stringify(['Barrer', 'Trapear', 'Banos', 'Cocina', 'Recamaras']) }
  });
  const checkin = await prisma.jobType.create({
    data: { name: 'Check-in', checklistTemplate: JSON.stringify(['Llaves', 'Tour', 'Amenidades', 'Contacto']) }
  });

  // Jobs
  const today = new Date();
  await prisma.job.create({
    data: {
      propertyId: prop1.id,
      workerId: maria.id,
      jobTypeId: limpieza.id,
      datetime: today,
      status: 'pending',
      checklist: limpieza.checklistTemplate,
      notes: 'Limpieza profunda post check-out'
    }
  });
  await prisma.job.create({
    data: {
      propertyId: prop2.id,
      workerId: ana.id,
      jobTypeId: checkin.id,
      datetime: today,
      status: 'active',
      checklist: checkin.checklistTemplate,
      notes: 'Huesped llega 3pm'
    }
  });

  console.log('Seed completado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
