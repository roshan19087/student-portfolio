import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { z } from 'zod';
import { UserRole } from '@prisma/client';
import { prisma } from '../db.js';
import { AuthUtils } from '../modules/auth/auth.utils.js';

const AdminInputSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long'),
});

async function main() {
  console.log('\n==============================================');
  console.log('       Admin Account Creation / Reset CLI      ');
  console.log('==============================================\n');

  const rl = readline.createInterface({ input, output });

  try {
    const rawEmail = await rl.question('Enter admin email address: ');
    const rawPassword = await rl.question('Enter admin password (min 8 chars): ');
    const confirmPassword = await rl.question('Confirm admin password: ');

    if (rawPassword !== confirmPassword) {
      console.error('\n❌ Passwords do not match. Aborting.');
      process.exit(1);
    }

    const validationResult = AdminInputSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
    });

    if (!validationResult.success) {
      console.error('\n❌ Validation Error:');
      validationResult.error.issues.forEach((issue) => {
        console.error(`   - ${issue.message}`);
      });
      process.exit(1);
    }

    const { email, password } = validationResult.data;

    console.log('\n⏳ Hashing password with Argon2id...');
    const passwordHash = await AuthUtils.hashPassword(password);

    console.log('⏳ Creating/Updating admin user in database...');
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: UserRole.ADMIN,
      },
      create: {
        email,
        passwordHash,
        role: UserRole.ADMIN,
      },
    });

    console.log('\n✅ Admin account created/updated successfully!');
    console.log(`   User ID : ${user.id}`);
    console.log(`   Email   : ${user.email}`);
    console.log(`   Role    : ${user.role}`);
    console.log('==============================================\n');
  } catch (error) {
    console.error('\n❌ An error occurred while creating admin:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Only execute when run directly
if (process.argv[1]?.includes('createAdmin')) {
  main();
}

export { main as createAdminScript };
