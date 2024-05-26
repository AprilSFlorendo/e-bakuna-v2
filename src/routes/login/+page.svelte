<script lang="ts">
	import Logo from '$lib/assets/favicon.webp';
	import type { PageData } from './$types';
	import Form from './form.svelte';
	export let data: PageData;
</script>

<div class="flex h-full justify-center">
	<div class="m-12 flex flex-col items-center gap-10">
		<div class="flex flex-col gap-2 text-center">
			<h1 class="text-lg font-bold">Welcome to</h1>
			<div class="flex items-center gap-2">
				<img src={Logo} alt="Logo" width="40" height="40" />
				<h1 class="text-3xl font-bold">e-Bakuna</h1>
			</div>
		</div>
		<Form data={data.form} />

		<div class="flex gap-2">
			New to e-Bakuna? <a class="text-blue-600 hover:underline" href="/register">
				Create an account
			</a>
		</div>
	</div>
</div>
