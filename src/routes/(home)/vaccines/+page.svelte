<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { mediaQuery } from 'svelte-legos';
	import { Button } from '$lib/components/ui/button';
	import { Edit, Trash } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	let vaccines = data.vaccines;

	let currentId = '';
	async function deleteVaccine() {
		try {
			const res = await fetch(`/api/vaccines/${currentId}`, {
				method: 'DELETE'
			});

			dialogOpen = false;

			if (res.ok) {
				vaccines = vaccines.filter((vaccine) => vaccine.id !== currentId);
				toast.success('Vaccine deleted successfully');
			} else {
				const data = await res.json();
				toast.error(data.message);
			}
		} catch (error) {
			toast.error('Failed to delete vaccine');
		}
	}

	function openDialog(id: string) {
		dialogOpen = true;
		currentId = id;
	}

	let dialogOpen = false;
	const isDesktop = mediaQuery('(min-width: 768px)');
</script>

<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl">Vaccines</h1>
		<Button class="self-end" href="vaccines/add">Add New</Button>
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head class="text-center">No. of Doses (ml)</Table.Head>
				<Table.Head class="text-center">Interval(days)</Table.Head>
				<Table.Head class="w-[100px]">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each vaccines as item}
				<Table.Row>
					<Table.Cell>{item.name}</Table.Cell>
					<Table.Cell>{item.description}</Table.Cell>
					<Table.Cell class="text-center">{item.doses}</Table.Cell>
					<Table.Cell class="text-center">{item.interval}</Table.Cell>
					<Table.Cell class="w-[100px]">
						<div class="flex gap-2">
							<Button
								href={`/vaccines/${item.id}`}
								class="rounded-full"
								variant="ghost"
								size="icon"
							>
								<Edit size="16" />
							</Button>
							<Button
								on:click={() => openDialog(item.id)}
								class="rounded-full"
								variant="ghost"
								size="icon"
							>
								<Trash class="stroke-destructive" size="16" />
							</Button>
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
				<Dialog.Title>Delete Vaccine</Dialog.Title>
				<Dialog.Description>
					Do you want to delete this vaccine? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<div class="flex justify-end gap-4">
				<Button variant="destructive" on:click={deleteVaccine}>Delete</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={dialogOpen}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Delete Vaccine</Drawer.Title>
				<Drawer.Description class="mb-4">
					Do you want to delete this vaccine? This action cannot be undone.
				</Drawer.Description>
			</Drawer.Header>
			<Button on:click={deleteVaccine} variant="destructive" class="mx-4">Delete</Button>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
