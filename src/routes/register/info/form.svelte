<script lang="ts">
	import { schema, type Schema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import { Input } from '$lib/components/ui/input';
	import { DotsHorizontal } from 'svelte-radix';
	import type { Info } from '../+page.svelte';

	export let info: Info;
	export let page: number;
	export let data: SuperValidated<Infer<Schema>>;

	$: submitting = false;
	$: errorMessage = '';

	const form = superForm(data, {
		resetForm: false,
		invalidateAll: false,
		validators: zodClient(schema),
		onSubmit: async () => {
			submitting = true;
		},
		onResult: ({ result }) => {
			if (result.status === 400) {
				// @ts-ignore
				errorMessage = result.data.message ?? '';
			} else {
				// @ts-ignore
				const form = result.data.form;

				info = {
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					email: form.data.email
				};
				page = 1;
			}

			submitting = false;
		}
	});

	const { form: formData, enhance } = form;

	$: {
		if (form.message) {
			errorMessage = '';
		}
	}
</script>

<div class="flex flex-col rounded-none border p-8 dark:bg-slate-500/10 sm:rounded-lg">
	<form class="flex flex-col gap-4" method="POST" use:focusTrap={true} use:enhance action="?/next">
		<Form.Field {form} name="firstName">
			<Form.Control let:attrs>
				<Form.Label>First Name</Form.Label>
				<Input class="bg-background" {...attrs} bind:value={$formData.firstName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="lastName">
			<Form.Control let:attrs>
				<Form.Label>Last Name</Form.Label>
				<Input class="bg-background" {...attrs} bind:value={$formData.lastName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input class="bg-background" {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={submitting} class="w-full">
			{#if submitting}
				<DotsHorizontal class="animate-pulse " />
			{:else}
				<div class="flex items-center gap-2">Next</div>
			{/if}
		</Form.Button>
		{#if errorMessage !== ''}
			<p class="mt-2 text-center text-destructive">{errorMessage}</p>
		{/if}
	</form>
</div>
