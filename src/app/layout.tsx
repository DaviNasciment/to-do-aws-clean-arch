import type { Metadata } from 'next'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from '@/lib/react-query';
import './globals.css'

export const metadata: Metadata = {
	title: 'Tarefas',
	description: 'Tarefas',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</body>
		</html>
	)
}
