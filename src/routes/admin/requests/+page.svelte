<script>
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { BanIcon, CheckIcon, Hand, MoreVerticalIcon, ThumbsUpIcon } from 'lucide-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let data;

	const { requests } = data;

	function toBgColor(status) {
		switch (status) {
			case 'on-hold':
				return 'bg-white font-semibold text-black';
			case 'pending':
				return 'bg-yellow-600 text-white font-semibold';
			case 'approved':
				return 'bg-green-500 text-white';
			case 'completed':
				return 'bg-blue-500 text-white';
			case 'cancelled':
				return 'bg-destructive text-white';
			default:
				return 'bg-grey-500 font-semibold';
		}
	}
</script>

<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl">Open Requests</h1>
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
		<Table.Body>
			{#each requests as request}
				<Table.Row>
					<Table.Cell>{request.ticketNumber.toString().padStart(6, '0')}</Table.Cell>
					<Table.Cell>{request.createdAt.toLocaleDateString()}</Table.Cell>
					<Table.Cell>{request.date.toLocaleDateString()}</Table.Cell>
					<Table.Cell>{request.vaccine.name}</Table.Cell>
					<Table.Cell class="text-center">{request.shots}</Table.Cell>
					<Table.Cell class="table-cell items-center px-1">
						<div class="flex justify-center">
							<div
								class={`flex min-w-[75px] items-center justify-center rounded-full px-2 py-1 text-xs ${toBgColor(request.status)}`}
							>
								{request.status}
							</div>
						</div>
					</Table.Cell>
					<Table.Cell class="flex justify-center gap-2">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button variant="ghost" size="icon" class="rounded-full" builders={[builder]}>
									<MoreVerticalIcon size="16" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Label>Actions</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<div class="flex flex-col gap-2">
									<DropdownMenu.Item class="flex gap-4">
										<Hand size="16" />
										Put on hold
									</DropdownMenu.Item>
									<DropdownMenu.Item class="flex gap-4">
										<ThumbsUpIcon size="16" />
										Approve request
									</DropdownMenu.Item>
									<DropdownMenu.Item class="flex gap-4">
										<CheckIcon size="16" />
										Mark as completed
									</DropdownMenu.Item>
									<Separator />
									<DropdownMenu.Item class="flex gap-4 text-destructive">
										<BanIcon size="16" />
										Cancel request
									</DropdownMenu.Item>
								</div>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
