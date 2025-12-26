import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://c6-pvrolomx.aws-us-west-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NzQ1NDgwNzAsImlhdCI6MTc2Njc3MjA3MCwiaWQiOiI0Zjk2ZTZmNi1iYzIxLTQ5MWQtYjdmOS1kMGUxMDk5ZWM3NGUiLCJyaWQiOiJiYjRlYTRmMC1mZjNiLTRiMGItOGFlMy05NWZkOTBjMDRkMWYifQ._uWZJvpf8VxneVqFRRq2LdgEU1GuV1VDxjmztajhDYY0cmci27L_AySkUgpyrmnL3AmnyY8_AzldZJOwsRDACg'
});

async function setup() {
  console.log('Creating tables...');
  
  await client.execute(`CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL UNIQUE,
    "canAssign" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await client.execute(`CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await client.execute(`CREATE TABLE IF NOT EXISTS "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await client.execute(`CREATE TABLE IF NOT EXISTS "JobType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "checklistTemplate" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await client.execute(`CREATE TABLE IF NOT EXISTS "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "jobTypeId" TEXT NOT NULL,
    "datetime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "checklist" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL
  )`);

  console.log('Tables created. Seeding...');

  // Seed data
  const now = new Date().toISOString();
  
  // Users
  await client.execute({
    sql: `INSERT OR IGNORE INTO "User" (id, name, phone, canAssign, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: ['admin1', 'Admin', '3221234567', 1, now]
  });
  await client.execute({
    sql: `INSERT OR IGNORE INTO "User" (id, name, phone, canAssign, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: ['maria1', 'Maria Gonzalez', '3229876543', 0, now]
  });
  await client.execute({
    sql: `INSERT OR IGNORE INTO "User" (id, name, phone, canAssign, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: ['ana1', 'Ana Lopez', '3225551234', 0, now]
  });

  // Client
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Client" (id, name, phone, email, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: ['client1', 'Carlos Mendoza', '3221112233', 'carlos@email.com', now]
  });

  // Properties
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Property" (id, name, address, clientId, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: ['prop1', 'Casa Playa', 'Av. Principal #123', 'client1', now]
  });
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Property" (id, name, address, clientId, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: ['prop2', 'Depto Centro', 'Calle 5 de Mayo #45', 'client1', now]
  });

  // JobTypes
  await client.execute({
    sql: `INSERT OR IGNORE INTO "JobType" (id, name, checklistTemplate, createdAt) VALUES (?, ?, ?, ?)`,
    args: ['type1', 'Limpieza', JSON.stringify(['Barrer', 'Trapear', 'Banos', 'Cocina', 'Recamaras']), now]
  });
  await client.execute({
    sql: `INSERT OR IGNORE INTO "JobType" (id, name, checklistTemplate, createdAt) VALUES (?, ?, ?, ?)`,
    args: ['type2', 'Check-in', JSON.stringify(['Llaves', 'Tour', 'Amenidades', 'Contacto']), now]
  });

  // Jobs
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Job" (id, propertyId, workerId, jobTypeId, datetime, status, checklist, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['job1', 'prop1', 'maria1', 'type1', now, 'pending', JSON.stringify(['Barrer', 'Trapear', 'Banos', 'Cocina', 'Recamaras']), 'Limpieza profunda post check-out', now, now]
  });
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Job" (id, propertyId, workerId, jobTypeId, datetime, status, checklist, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['job2', 'prop2', 'ana1', 'type2', now, 'active', JSON.stringify(['Llaves', 'Tour', 'Amenidades', 'Contacto']), 'Huesped llega 3pm', now, now]
  });

  console.log('Seed complete!');
  
  // Verify
  const result = await client.execute('SELECT COUNT(*) as count FROM "Job"');
  console.log('Jobs in DB:', result.rows[0].count);
}

setup().catch(console.error);
