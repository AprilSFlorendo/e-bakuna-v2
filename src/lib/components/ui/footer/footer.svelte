<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement>;
	let className: $$Props['class'] = undefined;

	export { className as class };
</script>

<div class={cn('flex-grow-0 flex flex-wrap gap-4 justify-between p-4', className)}>
	<p class="text-sm opacity-50">e-Bakuna @ 2024 All rights reserved</p>
	<div class="flex gap-4">
		<a
			class="text-sm opacity-50 hover:opacity-100 transition-all duration-300"
			href="/terms-and-conditions">Terms and Conditions</a
		>
		<a
			class="text-sm opacity-50 hover:opacity-100 transition-all duration-300"
			href="/privacy-policy">Privacy Policy</a
		>
	</div>
</div>
