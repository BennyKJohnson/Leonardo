import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const scheduleId1 = '5b4c567a-07de-4b05-8bab-0d5142ab4274';
  const scheduleId2 = '5b4c567a-07de-4b05-8bab-0d5142ab4275';
  const task1Id = 'aaeb362c-92b6-403f-95d6-020fbf552f23';
  const task2Id = 'aaeb362c-92b6-403f-95d6-020fbf552f24';

  const schedule1 = await prisma.schedule.upsert({
    where: {
      id: scheduleId1,
    },
    update: {},
    create: {
      id: scheduleId1,
      accountId: 1,
      agentId: 1,
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  const schedule2 = await prisma.schedule.upsert({
    where: {
      id: scheduleId2,
    },
    update: {},
    create: {
      id: scheduleId2,
      accountId: 2,
      agentId: 2,
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  const task1 = await prisma.task.upsert({
    where: {
      id: task1Id,
    },
    update: {},
    create: {
      id: task1Id,
      accountId: 1,
      scheduleId: scheduleId1,
      startTime: new Date(),
      duration: 120,
      type: 'work',
    },
  });

  const task2 = await prisma.task.upsert({
    where: {
      id: task1Id,
    },
    update: {},
    create: {
      id: task2Id,
      accountId: 1,
      scheduleId: scheduleId2,
      startTime: new Date(),
      duration: 120,
      type: 'work',
    },
  });

  console.log({ schedule1, schedule2, task1, task2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
