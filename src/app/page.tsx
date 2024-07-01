import { CreateTaskDialog } from '@/components/create-tasks-dialog';
import { Header } from '@/components/header';
import { TasksList } from '@/components/tasks-list';

export default function Home() {
	
	return (
		<main className="flex min-h-screen flex-col items-center justify-between md:px-24 px-8 py-8">
			<div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm lg:flex">
				<div className="mx-auto w-full">
					<Header />

					<div className="border-b border-[#ffffff1a] mt-8 flex justify-center" />

					<CreateTaskDialog />
					<TasksList />
				</div>
			</div>
		</main>
	)
}
