<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputEvents } from '.';
	import { cn } from '$lib/utils';
	import { Eye, EyeOff } from 'lucide-svelte';

	type $$Props = HTMLInputAttributes;
	type $$Events = InputEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };

	let showPassword = false;
	$: type = showPassword ? 'text' : 'password';

	function onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		value = input.value;
	}
</script>

<div class="grid">
	<input
		class={cn(
			'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring col-start-1 row-start-1 flex h-9 w-full rounded-md border px-3 py-1 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{type}
		{value}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input={onInput}
		{...$$restProps}
	/>
	<button
		class="col-start-1 row-start-1 mx-3 h-9 place-self-end"
		tabindex="-1"
		type="button"
		on:click={() => (showPassword = !showPassword)}
	>
		{#if showPassword}
			<EyeOff class="h-4 w-4 scale-100" />
		{:else}
			<Eye class="h-4 w-4 scale-100" />
		{/if}
	</button>
</div>

<style>
	input::-ms-reveal,
	input::-ms-clear {
		display: none;
	}
</style>
