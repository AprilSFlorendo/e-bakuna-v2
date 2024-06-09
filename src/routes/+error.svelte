<script>
	import { page } from '$app/stores';
</script>

<div class="flex h-full w-full items-center justify-center gap-2 overflow-x-hidden">
	<h1 class="text-3xl">{$page.status}</h1>
	<h2 class="text-3xl">|</h2>
	<h3 class="text-xl">{$page.error?.message}</h3>
</div>
