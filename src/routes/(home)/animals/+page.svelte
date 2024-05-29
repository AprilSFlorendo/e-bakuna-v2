<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { mediaQuery } from 'svelte-legos';
	import { Button } from '$lib/components/ui/button';
	import { Edit, Image, MoreVertical, Calendar, Trash } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	let fileinput;
	let animals = data.animals;

	let currentId = '';
	async function deleteAnimal() {
		try {
			const res = await fetch(`/api/animals/${currentId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				animals = animals.filter((animal) => animal.id !== currentId);
				toast.success('Animal deleted successfully');
			} else {
				const data = await res.json();
				toast.error(data.message);
			}
		} catch (error) {
			toast.error('Failed to delete animal');
		}

		dialogOpen = false;
	}

	function openDialog(id: string) {
		dialogOpen = true;
		currentId = id;
	}

	let dialogOpen = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	let animalId = '';
	const onFileSelected = async (e) => {
		let file = e.target.files[0];
		const response = await fetch(`/api/animals/image/${animalId}`, {
			method: 'POST',
			body: file
		});

		const result = await response.json();
		console.log(result);

		if (response.ok) {
			toast.success('Image uploaded successfully');

			animals = animals.map((animal) => {
				if (animal.id === animalId) {
					animal.imageUrl = result.imageUrl;
					animal.cloudinaryId = result.cloudinaryId;
				}
				return animal;
			});
		} else {
			toast.error('Failed to upload image');
		}
	};
</script>

<input
	style="display:none"
	type="file"
	accept=".jpg, .jpeg, .png"
	on:change={(e) => onFileSelected(e)}
	bind:this={fileinput}
/>
<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl">Animals</h1>
		<Button class="self-end" href="animals/add">Add New</Button>
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Image</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head class="hidden md:table-cell">Details</Table.Head>
				<Table.Head class="w-[100px] text-center">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each animals as item}
				<Table.Row>
					<Table.Cell>
						<img
							class="h-12 w-12 rounded-lg object-cover"
							srcset={item.imageUrl ?? `https://fakeimg.pl/250x100/?text=animal`}
							alt={item.name}
						/>
					</Table.Cell>
					<Table.Cell>{item.name}</Table.Cell>
					<Table.Cell class="hidden md:table-cell">{item.details}</Table.Cell>
					<Table.Cell>
						<div class="flex justify-center gap-2">
							{#if $isDesktop}
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<Button
											href={`/animals/schedules/${item.id}`}
											builders={[builder]}
											class="rounded-full"
											variant="ghost"
											size="icon"
										>
											<Calendar size="16" />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Open schedule</p>
									</Tooltip.Content>
								</Tooltip.Root>
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<Button
											on:click={() => {
												animalId = item.id;
												fileinput.click();
											}}
											builders={[builder]}
											class="rounded-full"
											variant="ghost"
											size="icon"
										>
											<Image size="16" />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Change image</p>
									</Tooltip.Content>
								</Tooltip.Root>
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<Button
											builders={[builder]}
											href={`/animals/${item.id}`}
											class="rounded-full"
											variant="ghost"
											size="icon"
										>
											<Edit size="16" />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Edit animal</p>
									</Tooltip.Content>
								</Tooltip.Root>
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<Button
											on:click={() => openDialog(item.id)}
											builders={[builder]}
											class="rounded-full"
											variant="ghost"
											size="icon"
										>
											<Trash class="stroke-destructive" size="16" />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Delete animal</p>
									</Tooltip.Content>
								</Tooltip.Root>
							{:else}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button variant="ghost" size="icon" class="rounded-full" builders={[builder]}>
											<MoreVertical size="16" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Label>Actions</DropdownMenu.Label>
										<DropdownMenu.Separator />
										<div class="flex flex-col gap-2">
											<DropdownMenu.Item href={`/animals/schedules/${item.id}`}>
												<div class="flex gap-4">
													<Calendar size="16" />
													Open schedule
												</div>
											</DropdownMenu.Item>
											<DropdownMenu.Item
												on:click={() => {
													animalId = item.id;
													fileinput.click();
												}}
											>
												<div class="flex gap-4">
													<Image size="16" />
													Change image
												</div>
											</DropdownMenu.Item>
											<DropdownMenu.Item href={`/animals/${item.id}`}>
												<div class="flex gap-4">
													<Edit size="16" />
													Edit animal
												</div>
											</DropdownMenu.Item>
											<DropdownMenu.Item on:click={() => openDialog(item.id)}>
												<div class="flex gap-4">
													<Trash class="stroke-destructive" size="16" />
													<p class="text-destructive">Delete animal</p>
												</div>
											</DropdownMenu.Item>
										</div>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{/if}
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if $isDesktop}
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Delete Animal</Dialog.Title>
				<Dialog.Description>
					Do you want to delete this animal? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<div class="flex justify-end gap-4">
				<Button variant="destructive" on:click={deleteAnimal}>Delete</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={dialogOpen}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Delete Animal</Drawer.Title>
				<Drawer.Description class="mb-4">
					Do you want to delete this animal? This action cannot be undone.
				</Drawer.Description>
			</Drawer.Header>
			<Button on:click={deleteAnimal} variant="destructive" class="mx-4">Delete</Button>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
