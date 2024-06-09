<script lang="ts">
	import { Minus, Plus } from 'lucide-svelte';
	import { Button } from '../button';
	import { suppressDefault } from '$lib/utils/helper';
	import { cn } from '$lib/utils';
	import { browser } from '$app/environment';

	export let value = 1;
	export let onChange: (quantity: number) => void = () => {};

	let className = '';

	export { className as class };

	let qtyStr = value.toString();

	$: if (qtyStr) {
		const num = parseInt(qtyStr);

		if (qtyStr === '' || num < 1 || isNaN(num) || qtyStr !== num.toString()) {
			qtyStr = '1';
		} else {
			qtyStr = num.toString();
		}

		if (browser) {
			onChange(num);
			value = num;
		}
	}

	let qty = value;

	function increaseQuantity() {
		qty++;
		qtyStr = qty.toString();
	}

	function decreaseQuantity() {
		if (qty <= 1) return;

		qty--;
		qtyStr = qty.toString();
	}
</script>

<div class={cn(className, 'flex')}>
	<Button
		on:click={suppressDefault(() => decreaseQuantity())}
		class="rounded-none rounded-l-md focus-visible:ring-0"
		variant="outline"
	>
		<Minus class="w-[18px]" />
	</Button>
	<input
		bind:value={qtyStr}
		class="max-w-[75px] grow-0 border-y bg-background text-center outline-0"
	/>
	<Button
		on:click={suppressDefault(() => increaseQuantity())}
		class="rounded-none rounded-r-md focus-visible:ring-0"
		variant="outline"
	>
		<Plus class="w-[18px]" />
	</Button>
	<input {...$$restProps} bind:value class="hidden" />
</div>
