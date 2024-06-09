<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { LayoutDashboard, Syringe, BookCheckIcon } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	$: handleNavSelection = (url: string) => {
		if (url === '/admin' && $page.url.pathname === '/admin') {
			return 'bg-primary bg-opacity-75 text-black font-bold';
		}

		const inPath = $page.url.pathname.startsWith(url) && url !== '/admin';
		return inPath ? 'bg-primary bg-opacity-75 text-black font-semibold' : '';
	};

	type $$Props = HTMLAttributes<HTMLDivElement>;
	let className: $$Props['class'] = undefined;

	export { className as class };

	const navStyles =
		'p-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-200 hover:bg-opacity-10 hover:text-white';
</script>

<aside class={cn('flex flex-col gap-2 overflow-y-auto', className)}>
	<nav class="flex flex-grow flex-col gap-2">
		<a class={`${navStyles} ${handleNavSelection('/admin')}`} href="/admin">
			<div class="flex gap-2">
				<LayoutDashboard />
				Dashboard
			</div>
		</a>
		<a class={`${navStyles} ${handleNavSelection('/admin/vaccines')}`} href="/admin/vaccines">
			<div class="flex gap-2">
				<Syringe />
				Vaccines
			</div>
		</a>
		<a class={`${navStyles} ${handleNavSelection('/admin/requests')}`} href="/admin/requests">
			<div class="flex gap-2">
				<BookCheckIcon />
				Open Requests
			</div>
		</a>
	</nav>
</aside>
