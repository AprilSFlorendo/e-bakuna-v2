<script lang="ts">
	import { page } from '$app/stores';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { LayoutDashboard, MessageCircleHeart, PiggyBank, Syringe } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	$: handleNavSelection = (url: string) => {
		if (url === '/home' && $page.url.pathname === '/') {
			return 'bg-primary bg-opacity-75 text-black font-bold';
		}

		const inPath = $page.url.toString().includes(url);
		return inPath ? 'bg-primary bg-opacity-75 text-black font-semibold' : '';
	};

	type $$Props = HTMLAttributes<HTMLDivElement>;
	let className: $$Props['class'] = undefined;

	export { className as class };

	const navStyles =
		'p-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-200 hover:bg-opacity-10 hover:text-white';
</script>

<aside
	class={cn(
		'sticky top-12 flex h-[100vh] max-h-[calc(100vh-3.7rem)] flex-col gap-2 overflow-y-auto',
		className
	)}
>
	<nav class="flex flex-grow flex-col gap-2">
		<a class={`${navStyles} ${handleNavSelection('/home')}`} href="/">
			<div class="flex gap-2">
				<LayoutDashboard />
				Dashboard
			</div>
		</a>
		<a class={`${navStyles} ${handleNavSelection('/animals')}`} href="/animals">
			<div class="flex gap-2">
				<PiggyBank />
				Animals
			</div>
		</a>
		<a class={`${navStyles} ${handleNavSelection('/vaccines')}`} href="/vaccines">
			<div class="flex gap-2">
				<Syringe />
				Vaccines
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
