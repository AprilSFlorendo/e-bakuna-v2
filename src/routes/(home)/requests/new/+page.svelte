<script lang="ts">
	import type { PageData } from './$types';
	import Form from '../form.svelte';
	import { CalendarDate } from '@internationalized/date';
	export let data: PageData;

	const { vaccines, form } = data;

	const today = new Date();
	const startingDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
</script>

<div class="p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<h1 class="mb-4 text-3xl">Create Request</h1>
	<Form date={startingDate} {vaccines} data={form}></Form>
</div>
