import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; todoId: string } },
) {
  try {
    const { userId, todoId } = params;

    if (!userId || !todoId) {
      return NextResponse.json(
        { success: false, message: 'User ID or Todo ID is missing' },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: userId,
      },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, message: 'Todo item not found' },
        { status: 404 },
      );
    }

    await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Todo item deleted successfully',
        data: { id: todoId },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string; todoId: string } },
) {
  try {
    const { userId, todoId } = params;

    if (!userId || !todoId) {
      return NextResponse.json(
        { success: false, message: 'User ID or Todo ID is missing' },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        createdAt: true,
      },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, message: 'Todo item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Todo item retrieved successfully',
        data: todo,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error retrieving todo item:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}