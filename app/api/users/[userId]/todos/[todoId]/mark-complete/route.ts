import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { userId: string; todoId: string } },
) {
  try {
    const { userId, todoId } = params;

    if (!userId || !todoId) {
      return NextResponse.json(
        { success: false, message: 'Invalid user or todo ID' },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.findFirst({
      where: { id: todoId, userId: userId },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, message: 'Todo item not found' },
        { status: 404 },
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { isCompleted: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Todo item marked as complete',
        data: {
          id: updatedTodo.id,
          isCompleted: updatedTodo.isCompleted,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error marking todo as complete:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}