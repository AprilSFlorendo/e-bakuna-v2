<script lang="ts">
	import { Footer } from '$lib/components/ui/footer';
	import { NavBar } from '$lib/components/ui/nav-bar';
	import { SideNav } from '$lib/components/ui/side-nav';

	export let data;

	const user = {
		firstName: data.user?.firstName ?? 'Guest',
		lastName: data.user?.lastName ?? 'User',
		avatarUrl: data.user?.avatarUrl ?? ''
	};
</script>

<container class="flex min-h-[100vh] flex-col">
	<NavBar {user} />
	<div class="flex h-full w-full flex-grow flex-row overflow-auto">
		<section
			class="w-0 border-r opacity-0 transition-all duration-300 motion-reduce:transition-none sm:w-[250px] sm:opacity-100"
		>
			<SideNav class="w-[250px] overflow-x-hidden p-6 " />
		</section>
		<div class="sm:p4 flex flex-grow flex-col overflow-hidden p-6 py-4 sm:px-2">
			<div class="m-0 flex-grow sm:m-2 sm:mx-4">
				<slot />
			</div>
			<Footer />
		</div>
	</div>
</container>
