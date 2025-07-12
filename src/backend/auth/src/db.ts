import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

export async function saveToken(userId: string, token: any) {
  console.log('=== SAVING TOKEN WITH PRISMA ===');
  console.log('User ID:', userId);
  console.log('Token type:', typeof token);
  console.log('Token keys:', Object.keys(token));
  
  try {
    console.log('Attempting to upsert token...');
    
    const result = await prisma.token.upsert({
      where: {
        userId: userId
      },
      update: {
        token: token,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        token: token
      }
    });

    console.log('Token saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in saveToken:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
}

export async function getToken(userId: string) {
  console.log('=== GETTING TOKEN WITH PRISMA ===');
  console.log('User ID:', userId);
  
  try {
    const result = await prisma.token.findUnique({
      where: {
        userId: userId
      },
      select: {
        token: true
      }
    });

    console.log('Token retrieved successfully');
    return result?.token;
  } catch (error) {
    console.error('Error in getToken:', error);
    throw error;
  }
}

// Função para limpar conexões (opcional)
export async function disconnect() {
  await prisma.$disconnect();
}