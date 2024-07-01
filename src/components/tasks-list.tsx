'use client';

import { Task } from "@/core/task/interfaces/taskInterface";
import { User } from "@/core/user/interfaces/userInterface";
import { taskMakeService } from "@/modules/task/factories/taskMakeService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UpdateTaskRequest {
    id: string;
    completed: boolean;
    concludedAt: number | null;
}

async function updateTask(_: UpdateTaskRequest) {
    return;
}

export function TasksList() {
    const queryClient = useQueryClient()
    const taskService = taskMakeService()

    const { data: user } = useQuery<User>({
        queryKey: ['userData'],
    })

    const handleGetTask = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!user?.id) {
            const data = JSON.parse(String(localStorage.getItem("anonymous")));

            return Array.isArray(data) ? data : [];
        }

        try {
            const data = await taskService.getAllTasksByUid(user.id);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const { mutateAsync: updateTaskFn } = useMutation({
        mutationFn: updateTask,
        onSuccess(_, variables) {
            const updatedTasks = tasks?.map((task: Task) => {
                if (task.id === variables.id) {
                    return {
                        ...task,
                        completed: variables.completed,
                        concludedAt: variables.concludedAt
                    };
                }
                return task;
            });
            queryClient.setQueryData(['tasks'], updatedTasks);
        }
    })

    async function handleUpdateTask(data: Task, checked: boolean) {
        const timestamp = new Date().getTime();

        try {
            await updateTaskFn({
                id: data.id,
                completed: checked,
                concludedAt: checked ? timestamp : null,
            })
        } catch (err) {
            console.log(err)
        }
    };

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: handleGetTask,
        enabled: !!user?.id || user === null,
    })

    console.log(tasks)

    return (
        <ul className="mt-4">
            {tasks?.sort((a: Task, b: Task) => b.createdAt - a.createdAt)?.map((task: Task) => (
                <li key={task.id} className="flex items-center mt-2">
                    <div className="checkbox-wrapper">
                        <input
                            id={`check1-${task.id}`}
                            type="checkbox"
                            className="check"
                            defaultChecked={task.completed}
                            onChange={(event) => handleUpdateTask(task, event.target.checked)}
                        />
                        <label htmlFor={`check1-${task.id}`} className="label">
                            <svg width="30" height="30" viewBox="0 0 95 95">
                                <rect x="30" y="20" width="50" height="50" rx="10" ry="10" stroke="white" fill="none" />
                                <g transform="translate(0,-952.36222)">
                                    <path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4 " stroke="#ffffff" strokeWidth="3" fill="none" className="path1" />
                                </g>
                            </svg>
                        </label>
                    </div>

                    <div className="flex justify-between items-center w-full gap-1">
                        <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-100'}>
                            {task.task}
                        </span>
                        <span>
                            <div>
                                {new Intl.DateTimeFormat('pt-BR', {}).format(task.createdAt)}
                                {task.concludedAt && " - " + new Intl.DateTimeFormat('pt-BR', {}).format(task.concludedAt)}
                            </div>
                        </span>
                    </div>
                </li>
            ))}

            {isLoading &&
                <div role="status" className="animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-2.5 bg-[#1e1e1e]/70 border border-[#242424] rounded-full w-4 mr-2"></div>
                        <div className="h-2.5 bg-[#1e1e1e]/70 border border-[#242424] rounded-full w-full"></div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-2.5 bg-[#1e1e1e]/70 border border-[#242424] rounded-full w-4 mr-2"></div>
                        <div className="h-2.5 bg-[#1e1e1e]/70 border border-[#242424] rounded-full w-full"></div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-2.5 bg-[#1e1e1e]/70 border border-[#242424] rounded-full w-4 mr-2"></div>
                        <div className="h-2.5 bg-[#1e1e1e]/70 border border-[#242424] rounded-full w-full"></div>
                    </div>
                </div>
            }
        </ul>
    )
}