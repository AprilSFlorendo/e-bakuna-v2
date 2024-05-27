<script>
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Edit, Trash } from 'lucide-svelte';

	export let data;

	let vaccines = data.vaccines;
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
							<Button class="rounded-full" variant="ghost" size="icon">
								<Trash class="stroke-destructive" size="16" />
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
