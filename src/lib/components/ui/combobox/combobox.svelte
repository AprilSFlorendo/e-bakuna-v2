<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { type Props, Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	export let placeholder = 'Search here...';
	export let notFound = 'No result found.';
	export let value = '';
	export let source: { value: string; label: string }[] = [];

	let className: string = 'text-left font-normal justify-between';
	export let variant: 'default' | 'outline' | 'ghost' = 'outline';
	export { className as class };

	let open = false;

	$: selectedValue = source.find((f) => f.value === value)?.label ?? placeholder;

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			{variant}
			role="combobox"
			aria-expanded={open}
			class={cn(className, 'flex', !value && 'text-muted-foreground')}
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="p-0">
		<Command.Root>
			<Command.Input {placeholder} />
			<Command.Empty>{notFound}</Command.Empty>
			<Command.Group>
				{#each source as item}
					<Command.Item
						value={item.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== item.value && 'text-transparent')} />
						{item.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
	<input {...$$restProps} bind:value class="hidden" />
</Popover.Root>
