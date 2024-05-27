<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement>;
	let className: $$Props['class'] = undefined;

	export { className as class };
</script>

<div
	class={cn(
		'flex flex-grow-0 flex-wrap justify-between gap-4 text-center sm:p-4 md:flex-nowrap',
		className
	)}
>
	<p class="w-full text-sm opacity-50 md:w-auto">e-Bakuna @ 2024 All rights reserved</p>
	<div class="flex w-full flex-col gap-4 md:w-auto md:flex-row">
		<a
			class="text-sm opacity-50 transition-all duration-300 hover:opacity-100"
			href="/terms-and-conditions">Terms and Conditions</a
		>
		<a
			class="text-sm opacity-50 transition-all duration-300 hover:opacity-100"
			href="/privacy-policy">Privacy Policy</a
		>
	</div>
</div>
