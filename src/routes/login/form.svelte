<script lang="ts">
	import { schema, type Schema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { DotsHorizontal } from 'svelte-radix';
	import { PasswordInput } from '$lib/components/ui/password-input';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<Schema>>;

	$: submitting = false;
	$: errorMessage = '';

	const form = superForm(data, {
		validators: zodClient(schema),
		onSubmit: async () => {
			submitting = true;
		},
		onResult: ({ result }) => {
			if (result.status === 400) {
				console.log(form.message);
				// @ts-ignore
				errorMessage = result.data.message ?? '';
			}

			submitting = false;
		},
		onError: () => {
			toast.error('An error occurred. Please try again.');
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

<div
	class="flex w-[100vw] flex-col rounded-none border p-8 dark:bg-slate-500/10 sm:w-[130%] sm:rounded-lg"
>
	<form class="flex flex-col gap-6" method="POST" use:focusTrap={true} use:enhance>
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username or email</Form.Label>
				<Input class="bg-background" {...attrs} bind:value={$formData.username} />
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
		<Form.Button disabled={submitting} class="w-full" type="submit">
			{#if submitting}
				<DotsHorizontal class="animate-pulse " />
			{:else}
				<div class="flex items-center gap-2">Login</div>
			{/if}
		</Form.Button>
	</form>
	{#if errorMessage !== ''}
		<p class="mt-2 text-center text-destructive">{errorMessage}</p>
	{/if}
</div>
