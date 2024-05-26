<script lang="ts">
	import { schema, type Schema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import { DotsHorizontal } from 'svelte-radix';
	import { PasswordInput } from '$lib/components/ui/password-input';
	import { Input } from '$lib/components/ui/input';
	import type { Info } from '../+page.svelte';
	import { Button } from '$lib/components/ui/button';

	export let page: number;
	export let info: Info;
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
			}
			submitting = false;
		},
		onError: () => {
			toast.error('An error occurred. Please try again.');
		}
	});

	const { form: formData, enhance } = form;

	$: {
		if (form.message) {
			errorMessage = '';
		}
	}
</script>

<div
	use:focusTrap={true}
	class="rounded-none flex flex-col border p-8 sm:rounded-lg dark:bg-[#141414]"
>
	<form
		class="flex flex-col gap-4"
		method="POST"
		use:enhance
		action={`?/register&firstName=${info.firstName}&lastName=${info.lastName}&email=${info.email}`}
	>
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} class="bg-background" bind:value={$formData.username} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<PasswordInput {...attrs} class="bg-background" bind:value={$formData.password} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="confirmPassword">
			<Form.Control let:attrs>
				<Form.Label>Confirm Password</Form.Label>
				<PasswordInput {...attrs} class="bg-background" bind:value={$formData.confirmPassword} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={submitting} class="w-full">
			{#if submitting}
				<DotsHorizontal class="animate-pulse" />
			{:else}
				<div class="flex items-center gap-2">Register</div>
			{/if}
		</Form.Button>

		{#if errorMessage !== ''}
			<p class="mt-2 text-destructive text-center">{errorMessage}</p>
		{/if}
	</form>

	<Button
		disabled={submitting}
		variant="outline"
		class="mt-6 dark:bg-[#141414]"
		on:click={() => {
			page = 0;
			form.reset();
			errorMessage = '';
		}}>Back</Button
	>
</div>
