'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskMakeService } from "@/modules/task/factories/taskMakeService";
import { Task } from "@/core/task/interfaces/taskInterface";

const createTaskSchema = z.object({
    task: z.string()
})

interface CreateTaskRequest {
    id: string;
    uid: string | undefined;
    task: string;
    completed: boolean;
    createdAt: number;
    concludedAt: number | null;
}

type CreateTaskSchema = z.infer<typeof createTaskSchema>

export function CreateTaskDialog() {
    const queryClient = useQueryClient();
    const taskService = taskMakeService();

    const { register, handleSubmit, formState } = useForm<CreateTaskSchema>({
        resolver: zodResolver(createTaskSchema)
    })
    const { isSubmitting } = formState;

    const { data: user, isLoading } = useQuery<Task>({
        queryKey: ['userData'],
    })

    async function createTask(data: CreateTaskRequest) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!user?.id) {
            let dataLocal = JSON.parse(String(localStorage.getItem("anonymous"))) || [];

            if (!!dataLocal) {
                const newDataLocal = [...dataLocal, data]
                localStorage.setItem("anonymous", JSON.stringify(newDataLocal));

                return dataLocal;
            }

            localStorage.setItem("anonymous", JSON.stringify(data));

            return data;
        }

        try {
            if (user?.id) {
                await taskService.createTask(data)

                return;
            }
        } catch (error) {
            console.error(error)
            throw new Error("Erro ao criar task");
        }
    }

    const { mutateAsync: createTaskFn } = useMutation({
        mutationFn: createTask,
        onSuccess(_, variables) {
            queryClient.setQueryData(['tasks'], (data: CreateTaskRequest[]) => {
                return [...data, {
                    id: variables.id,
                    task: variables.task,
                    completed: variables.completed,
                    createdAt: variables.createdAt,
                    concludedAt: variables.concludedAt,
                }]
            })
        }
    })

    async function handleCreateTask(data: CreateTaskSchema) {
        const id = crypto.randomUUID();
        const timestamp = new Date().getTime();

        try {
            await createTaskFn({
                task: data.task,
                id: id,
                uid: user?.id ? user.id : "",
                completed: false,
                createdAt: timestamp,
                concludedAt: null,
            })
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <form onSubmit={handleSubmit(handleCreateTask)} className="flex mt-8">
            <input
                id="task"
                type="text"
                className="bg-[#1e1e1e]/70 w-full outline-none border border-[#242424] focus-within:border-secundary rounded-md px-4 py-2 placeholder:text-neutral-500 transition-all"
                placeholder="Digite sua próxima tarefa"
                {...register('task')}
            />
            <button disabled={isSubmitting} type="submit" className="bg-secundary hover:bg-transparent border border-secundary rounded-md px-4 py-2 ml-2 transition-all">
                <span>{isSubmitting || isLoading ? 'Carregando...' : 'Adicionar'}</span>
            </button>
        </form>
    )
}