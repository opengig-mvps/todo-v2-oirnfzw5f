import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type TodoRequestBody = {
  title: string;
  description?: string;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 },
      );
    }

    const body: TodoRequestBody = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Todo item added successfully',
        data: {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          isCompleted: todo.isCompleted,
          userId: todo.userId,
          createdAt: todo.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}