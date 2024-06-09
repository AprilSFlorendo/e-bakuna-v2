<script>
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl">My Requests</h1>
		<Button class="self-end" href="/requests/new">New Request</Button>
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Ticket No.</Table.Head>
				<Table.Head>Date Requested</Table.Head>
				<Table.Head>Proposed Date</Table.Head>
				<Table.Head>Vaccine</Table.Head>
				<Table.Head class="text-center">No. of Shots</Table.Head>
				<Table.Head class="text-center">Status</Table.Head>
				<Table.Head class="w-[100px]">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body></Table.Body>
	</Table.Root>
</div>
