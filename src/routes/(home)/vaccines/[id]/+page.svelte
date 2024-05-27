<script lang="ts">
	import type { PageData } from './$types';
	import Form from '../form.svelte';
	export let data: PageData;

	const formData = data.form!;
</script>

<h1 class="mb-4 text-3xl">Edit Vaccine</h1>
<div class="p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<Form data={formData} editing></Form>
</div>
