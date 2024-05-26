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
	class="flex w-[100vw] flex-col rounded-none border p-8 dark:bg-[#141414] sm:w-[130%] sm:rounded-lg"
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
	<div class="mt-6 flex flex-col gap-6">
		<Separator />
		<Button class="w-full dark:bg-[#141414]" variant="outline" href="/login/github">
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="m0 0h24v24h-24z" opacity="0" transform="matrix(-1 0 0 -1 24 24)" />
					<path
						d="m12 1a10.89 10.89 0 0 0 -11 10.77 10.79 10.79 0 0 0 7.52 10.23c.55.1.75-.23.75-.52s0-.93 0-1.83c-3.06.65-3.71-1.44-3.71-1.44a2.86 2.86 0 0 0 -1.22-1.58c-1-.66.08-.65.08-.65a2.31 2.31 0 0 1 1.68 1.11 2.37 2.37 0 0 0 3.2.89 2.33 2.33 0 0 1 .7-1.44c-2.44-.27-5-1.19-5-5.32a4.15 4.15 0 0 1 1.11-2.91 3.78 3.78 0 0 1 .11-2.84s.93-.29 3 1.1a10.68 10.68 0 0 1 5.5 0c2.1-1.39 3-1.1 3-1.1a3.78 3.78 0 0 1 .11 2.84 4.15 4.15 0 0 1 1.17 2.89c0 4.14-2.58 5.05-5 5.32a2.5 2.5 0 0 1 .75 2v2.95s.2.63.75.52a10.8 10.8 0 0 0 7.5-10.22 10.89 10.89 0 0 0 -11-10.77"
					/>
				</svg>
				Login with GitHub
			</div>
		</Button>
	</div>
</div>
