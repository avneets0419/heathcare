import "dotenv/config"; // ✅ loads .env file

import { prisma } from "../src/lib/prisma"; // ✅ reuse same client

async function main() {
  // Clean existing data
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // Seed Doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "Dr. Sarah Mitchell",
        specialization: "Cardiology",
        email: "sarah.mitchell@hospital.com",
        phone: "+1 (555) 101-0001",
        experience: "12 years",
        status: "Active",
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. James Patel",
        specialization: "Dental",
        email: "james.patel@hospital.com",
        phone: "+1 (555) 101-0002",
        experience: "8 years",
        status: "Active",
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Emily Nguyen",
        specialization: "Neurology",
        email: "emily.nguyen@hospital.com",
        phone: "+1 (555) 101-0003",
        experience: "15 years",
        status: "Active",
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Robert Kim",
        specialization: "Orthopedics",
        email: "robert.kim@hospital.com",
        phone: "+1 (555) 101-0004",
        experience: "10 years",
        status: "Inactive",
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Priya Sharma",
        specialization: "Dermatology",
        email: "priya.sharma@hospital.com",
        phone: "+1 (555) 101-0005",
        experience: "6 years",
        status: "Active",
      },
    }),
  ]);

  // Seed Patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: "John Carter",
        email: "john.carter@email.com",
        phone: "+1 (555) 201-0001",
        status: "active",                 // ✅ added
        condition: "Cardiology",          // ✅ added
      },
    }),
    prisma.patient.create({
      data: {
        name: "Maria Lopez",
        email: "maria.lopez@email.com",
        phone: "+1 (555) 201-0002",
        status: "under_treatment",        // ✅ added
        condition: "Dental",              // ✅ added
      },
    }),
    prisma.patient.create({
      data: {
        name: "David Chen",
        email: "david.chen@email.com",
        phone: "+1 (555) 201-0003",
        status: "recovered",              // ✅ added
        condition: "Orthopedic",          // ✅ added
      },
    }),
    prisma.patient.create({
      data: {
        name: "Aisha Rahman",
        email: "aisha.rahman@email.com",
        phone: "+1 (555) 201-0004",
        status: "active",                 // ✅ added
        condition: "Neurology",           // ✅ added
      },
    }),
    prisma.patient.create({
      data: {
        name: "Tom Williams",
        email: "tom.williams@email.com",
        phone: "+1 (555) 201-0005",
        status: "inactive",               // ✅ added
        condition: "General Checkup",     // ✅ added
      },
    }),
  ]);

  // Seed Appointments
  await Promise.all([
    prisma.appointment.create({
      data: {
        patientName: patients[0].name,
        type: "Cardiology",
        time: "2025-04-20 10:00 AM",
        status: "upcoming",
        price: 150.0,
      },
    }),
    prisma.appointment.create({
      data: {
        patientName: patients[1].name,
        type: "Dental",
        time: "2025-04-21 11:30 AM",
        status: "upcoming",
        price: 80.0,
      },
    }),
    prisma.appointment.create({
      data: {
        patientName: patients[2].name,
        type: "Neurology",
        time: "2025-04-22 02:00 PM",
        status: "upcoming",
        price: 200.0,
      },
    }),
    prisma.appointment.create({
      data: {
        patientName: patients[3].name,
        type: "Orthopedics",
        time: "2025-04-18 09:00 AM",
        status: "active",
        price: 175.0,
      },
    }),
    prisma.appointment.create({
      data: {
        patientName: patients[4].name,
        type: "Dermatology",
        time: "2025-04-19 03:30 PM",
        status: "active",
        price: 120.0,
      },
    }),
  ]);

  console.log("✅ Seeded doctors, patients, and appointments");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });