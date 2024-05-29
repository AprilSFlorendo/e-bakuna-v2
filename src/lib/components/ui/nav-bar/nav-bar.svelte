<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Logo from '$lib/assets/favicon.webp';
	import { Button } from '$lib/components/ui/button';
	import { SideNav } from '$lib/components/ui/side-nav';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export let user: {
		firstName: string;
		lastName: string;
		avatarUrl: string;
	};

	type $$Props = HTMLAttributes<HTMLDivElement> & { user };
	let className: $$Props['class'] = undefined;

	export { className as class };
</script>

<header
	class={cn(
		'flex h-14 w-full justify-between border-b bg-background/75 p-4 backdrop-blur',
		className
	)}
>
	<div class="flex items-center gap-4">
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} class="inline px-2 md:hidden" variant="ghost">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="stroke-white"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M4 18H10" stroke-width="2" stroke-linecap="round" />
						<path d="M4 12L16 12" stroke-width="2" stroke-linecap="round" />
						<path d="M4 6L20 6" stroke-width="2" stroke-linecap="round" />
					</svg>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="w-[250px]" side="left">
				<Sheet.Header>
					<Sheet.Title>
						<div class="flex w-[250px] items-center gap-2">
							<img src={Logo} alt="default logo" width="20" height="20" />
							<p class="text-xl font-semibold">E-Bakuna</p>
						</div>
					</Sheet.Title>
				</Sheet.Header>
				<SideNav class="h-full py-6" />
			</Sheet.Content>
		</Sheet.Root>
		<div class="flex w-[250px] items-center gap-4">
			<img src={Logo} alt="default logo" width="20" height="20" />
			<p class="text-xl font-semibold">E-Bakuna</p>
		</div>
	</div>
	<div class="flex items-center justify-end gap-4">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="ghost" size="icon" class="h-8 w-8 rounded-full" builders={[builder]}>
					<Avatar.Root class="h-8 w-8">
						<Avatar.Image src={user.avatarUrl} alt="User image" />
						<Avatar.Fallback>
							<p class="text-sm">{`${user.firstName[0]}${user.lastName[0]}`}</p>
						</Avatar.Fallback>
					</Avatar.Root>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Label>{`${user.firstName} ${user.lastName}`}</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item href="/logout">
					Log out
					<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
