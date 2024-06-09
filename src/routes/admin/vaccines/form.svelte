<script lang="ts">
	import { schema, type Schema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { DotsHorizontal } from 'svelte-radix';
	import { Textarea } from '$lib/components/ui/textarea';

	export let data: SuperValidated<Infer<Schema>>;
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
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input class="bg-background" {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea class="bg-background" {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex flex-col gap-2 sm:flex-row">
		<Form.Field {form} name="doses">
			<Form.Control let:attrs>
				<Form.Label>No. of Doses (ml)</Form.Label>
				<Input class="bg-background" {...attrs} bind:value={$formData.doses} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="interval">
			<Form.Control let:attrs>
				<Form.Label>Interval (days)</Form.Label>
				<Input class="bg-background" {...attrs} bind:value={$formData.interval} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Button disabled={submitting} class="w-full items-center sm:w-[150px] " type="submit">
		{#if submitting}
			<DotsHorizontal class="animate-pulse " />
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>
