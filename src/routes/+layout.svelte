<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<ModeWatcher defaultMode="dark" />
<Toaster />
<body class="h-screen w-full">
	<slot />
</body>

<svelte:head>
	<title>e-Bakuna</title>
	<meta
		name="description"
		content="Manage. Schedule. Vaccinate. Vaccination assistant you can count on."
	/>
</svelte:head>
