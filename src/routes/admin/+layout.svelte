<script lang="ts">
	import { Footer } from '$lib/components/ui/footer';
	import NavBar from './nav-bar.svelte';
	import SideNav from './side-nav.svelte';

	export let data;

	const user = {
		firstName: data.user?.firstName ?? 'Guest',
		lastName: data.user?.lastName ?? 'User',
		avatarUrl: data.user?.avatarUrl ?? ''
	};
</script>

<container class="grid h-[100vh] grid-cols-[min-content_1fr] grid-rows-[3.5rem_1fr]">
	<NavBar class="col-span-2 col-start-1 row-start-1" {user} />
	<SideNav
		class="col-start-1 row-start-2 h-full w-0 overflow-x-hidden px-0 py-6 transition-all duration-300 md:w-[250px] md:border-r md:p-6"
	/>
	<div class="col-start-2 row-start-2 flex h-full flex-col overflow-y-auto">
		<div class="flex-grow p-4">
			<slot />
		</div>
		<Footer />
	</div>
</container>
