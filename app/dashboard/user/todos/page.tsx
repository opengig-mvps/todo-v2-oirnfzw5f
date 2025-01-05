"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui"; // Corrected path
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Ensure this path is correct and the module exists
import api from "@/lib/api";

// Zod schema for todo
const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

const TodoPage: React.FC = () => {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/${session?.user?.id}/todos`);
      setTodos(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) return;
    fetchTodos();
  }, [session]);

  const addTodo = async (data: TodoFormData) => {
    try {
      const response = await api.post(`/api/users/${session?.user?.id}/todos`, data);
      if (response.data.success) {
        toast.success("Todo item added successfully");
        fetchTodos();
        reset();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const updateTodo = async (todoId: string, data: TodoFormData) => {
    try {
      const response = await api.patch(`/api/users/${session?.user?.id}/todos/${todoId}`, data);
      if (response.data.success) {
        toast.success("Todo item updated successfully");
        fetchTodos();
        setEditingTodo(null);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      const response = await api.delete(`/api/users/${session?.user?.id}/todos/${todoId}`);
      if (response.data.success) {
        toast.success("Todo item deleted successfully");
        fetchTodos();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Task Management</h2>
      <Card>
        <form onSubmit={handleSubmit(editingTodo ? (data) => updateTodo(editingTodo.id, data) : addTodo)}>
          <CardHeader>
            <CardTitle>{editingTodo ? "Edit Todo" : "Add Todo"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input {...register("title")} placeholder="Enter task title" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea {...register("description")} placeholder="Enter task description" />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingTodo ? "Update Todo" : "Add Todo"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos?.map((todo) => (
            <TableRow key={todo?.id}>
              <TableCell>{todo?.title}</TableCell>
              <TableCell>{todo?.description}</TableCell>
              <TableCell>{todo?.isCompleted ? "Completed" : "Pending"}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => setEditingTodo(todo)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="ml-2">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. This will permanently delete the todo item.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={() => deleteTodo(todo?.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodoPage;