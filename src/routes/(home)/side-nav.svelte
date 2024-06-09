<script lang="ts">
	import { page } from '$app/stores';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { LayoutDashboard, MessageCircleHeart, PiggyBank, Syringe } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	$: handleNavSelection = (url: string) => {
		if (url === '/' && $page.url.pathname === '/') {
			return 'bg-primary bg-opacity-75 text-black font-bold';
		}

		const inPath = $page.url.pathname.startsWith(url) && url !== '/';
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
		<a class={`${navStyles} ${handleNavSelection('/')}`} href="/">
			<div class="flex gap-2">
				<LayoutDashboard />
				Dashboard
			</div>
		</a>
	</nav>
	<Separator class="bg-zinc-500" />
	<a class={`${navStyles} ${handleNavSelection('/feedback')}`} href="/feedback">
		<div class="flex gap-2">
			<MessageCircleHeart />
			Feedback
		</div>
	</a>
</aside>
