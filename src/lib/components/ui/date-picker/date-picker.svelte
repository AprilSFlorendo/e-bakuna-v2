<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	let className: string = 'text-left font-normal';
	export let variant: 'default' | 'outline' | 'ghost' = 'outline';
	export { className as class };

	export let value: DateValue | undefined = undefined;
	export let valueString = '';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	function onValueChange(value: DateValue | undefined) {
		valueString = value?.toString() ?? '';
	}
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			{variant}
			class={cn(className, 'flex', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar bind:value {onValueChange} initialFocus />
	</Popover.Content>
	<input {...$$restProps} bind:value={valueString} class="hidden" />
</Popover.Root>
