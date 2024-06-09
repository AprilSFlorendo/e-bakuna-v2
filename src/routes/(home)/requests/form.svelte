<script lang="ts">
	import { schema, type Schema } from './schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { DotsHorizontal } from 'svelte-radix';
	import { Textarea } from '$lib/components/ui/textarea';
	import { QuantityToggler } from '$lib/components/ui/quantity-toggler';
	import DatePicker from '$lib/components/ui/date-picker/date-picker.svelte';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import type { DateValue } from '@internationalized/date';

	export let date: DateValue;
	export let data: SuperValidated<Infer<Schema>>;
	export let vaccines: { value: string; label: string }[] = [
		{ value: 'covaxin', label: 'Covaxin' },
		{ value: 'covishield', label: 'Covishield' },
		{ value: 'sputnik', label: 'Sputnik' }
	];
	export let editing = false;

	$: submitting = false;

	const form = superForm(data, {
		validators: zodClient(schema),
		onSubmit: async () => {
			submitting = true;
		},
		onResult: ({ result }) => {
			if (result.status !== 200) {
				submitting = false;

				//@ts-ignore
				const error = result.data?.message ?? null;
				if (error) {
					toast.error(error);
				}
				return;
			}

			const message = editing ? 'Vaccine updated successfully' : 'Vaccine created successfully';
			toast.success(message);
			submitting = false;
		},
		onError: () => {
			toast.error('An error occurred. Please try again.');
			submitting = false;
		}
	});

	const { form: formData, enhance } = form;
</script>

<form class="flex flex-col gap-6" method="POST" use:focusTrap={true} use:enhance>
	<Form.Field class="hidden" {form} name="id">
		<Form.Control let:attrs>
			<Form.Label>Id</Form.Label>
			<Input tabindex={-1} class="bg-background" {...attrs} bind:value={$formData.id} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="date">
		<Form.Control let:attrs>
			<Form.Label>Propose Date</Form.Label>
			<DatePicker
				class="w-full justify-start bg-background sm:w-[250px]"
				{...attrs}
				value={date}
				bind:valueString={$formData.date}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="vaccine">
		<Form.Control let:attrs>
			<Form.Label>Vaccine</Form.Label>
			<Combobox
				class="w-full justify-between bg-background sm:w-[250px]"
				{...attrs}
				source={vaccines}
				bind:value={$formData.vaccine}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="shots">
		<Form.Control let:attrs>
			<Form.Label>No. of Shots</Form.Label>
			<QuantityToggler {...attrs} bind:value={$formData.shots} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button disabled={submitting} class="w-full items-center sm:w-[150px] " type="submit">
		{#if submitting}
			<DotsHorizontal class="animate-pulse " />
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>
