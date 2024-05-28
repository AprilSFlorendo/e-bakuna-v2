<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import { mediaQuery } from 'svelte-legos';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { Combobox } from '$lib/components/ui/combobox';
	import { Label } from '$lib/components/ui/label';
	import { DatePicker } from '$lib/components/ui/date-picker';
	import { CalendarDate } from '@internationalized/date';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Edit, Trash } from 'lucide-svelte';

	export let data: PageData;

	let schedules = data.schedules;
	const animal = data.animal;

	let scheduleDialogOpen = false;
	let deleteDialogOpen = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	const now = new Date();
	let selectedDate = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

	let selectedId = '';
	let title = '';
	let vaccines = undefined;
	$: selectedVaccine = undefined;

	async function openSchedule() {
		try {
			const res = await fetch(`/api/vaccines`);

			const data = await res.json();
			vaccines = data.map((x) => ({
				value: x.id,
				label: x.name
			}));
			scheduleDialogOpen = true;

			if (selectedId === '') {
				selectedVaccine = undefined;
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to fetch vaccines');
		}
	}

	async function submitNewSchedule() {
		if (!animal) {
			toast.error('Animal not found');
			return;
		}

		const res = await fetch(`/api/schedules`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				animalId: animal.id,
				date: selectedDate.toString(),
				vaccineId: selectedVaccine
			})
		});

		if (res.ok) {
			toast.success('Schedule added successfully');
			scheduleDialogOpen = false;
		} else {
			toast.error('Failed to add schedule');
		}

		clearEntries();
	}

	async function submitUpdateSchedule() {
		if (!animal) {
			toast.error('Animal not found');
			return;
		}

		const res = await fetch(`/api/schedules`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: selectedId,
				title: title,
				animalId: animal.id,
				date: selectedDate.toString(),
				vaccineId: selectedVaccine
			})
		});

		if (res.ok) {
			const data = await res.json();
			const index = schedules.findIndex((schedule) => schedule.id === selectedId);
			schedules[index] = data;

			schedules.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

			toast.success('Schedule updated successfully');
		} else {
			toast.error('Failed to update schedule');
		}

		clearEntries();
	}

	function clearEntries() {
		title = '';
		const now = new Date();
		selectedDate = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
		selectedVaccine = undefined;
		scheduleDialogOpen = false;
	}

	$: disabled = true;
	$: {
		if (title !== '' && selectedDate && selectedVaccine !== '') {
			disabled = false;
		} else {
			disabled = true;
		}
	}

	async function onDone(checked, id) {
		try {
			const res = await fetch('/api/schedules/done', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: id,
					done: checked
				})
			});

			if (res.ok) {
				toast.success('Schedule updated successfully');
			} else {
				toast.error('Failed to update schedule');
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to update schedule');
		}
	}

	function onEdit(item) {
		selectedId = item.id;
		title = item.title;
		const date = new Date(item.start);
		selectedDate = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

		selectedVaccine = item.vaccine.id;
		openSchedule();
	}

	function openDialog(item) {
		if (item.done) {
			toast.error('Cannot delete a completed schedule');
			return;
		}
		selectedId = item.id;
		deleteDialogOpen = true;
	}

	async function deleteSchedule() {
		const res = await fetch(`/api/schedules/`, {
			method: 'DELETE',
			body: JSON.stringify({
				id: selectedId
			})
		});

		if (res.ok) {
			schedules = schedules.filter((schedule) => schedule.id !== selectedId);
			toast.success('Schedule deleted successfully');
		} else {
			toast.error('Failed to delete schedule');
		}
		deleteDialogOpen = false;
	}
</script>

<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<div class="flex items-center justify-between gap-2">
		<h1 class="text-3xl">Vaccine Schedule</h1>
		<Button on:click={openSchedule}>New Schedule</Button>
	</div>
	<div class="my-4 flex items-center gap-8">
		<img
			class="h-24 w-24 rounded-lg object-cover"
			srcset={animal?.imageUrl ?? `https://fakeimg.pl/250x100/?text=animal`}
			alt={animal?.name}
		/>
		<div class="flex flex-col gap-2">
			<p class="text-3xl">{animal?.name}</p>
			<p>{animal?.details}</p>
		</div>
	</div>
	{#if schedules.length === 0}
		<p class="m-4 text-center">No schedules found</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[50px]">Done</Table.Head>
					<Table.Head>Title</Table.Head>
					<Table.Head>Vaccine</Table.Head>
					<Table.Head>Date</Table.Head>
					<Table.Head class="w-[50px]">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each schedules as item}
					<Table.Row>
						<Table.Cell>
							<Checkbox bind:checked={item.done} onCheckedChange={(e) => onDone(e, item.id)}
							></Checkbox>
						</Table.Cell>
						<Table.Cell>
							{item.title}
						</Table.Cell>
						<Table.Cell>{item.vaccine.name}</Table.Cell>
						<Table.Cell>{new Date(item.start).toDateString()}</Table.Cell>
						<Table.Cell>
							<div class="flex gap-2">
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<Button
											on:click={() => onEdit(item)}
											builders={[builder]}
											class="rounded-full"
											variant="ghost"
											size="icon"
										>
											<Edit size="16" />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Edit schedule</p>
									</Tooltip.Content>
								</Tooltip.Root>
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<Button
											on:click={() => openDialog(item)}
											disabled={item.done}
											builders={[builder]}
											class="rounded-full"
											variant="ghost"
											size="icon"
										>
											<Trash class="stroke-destructive" size="16" />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Delete schedule</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
{#if $isDesktop}
	<Dialog.Root bind:open={scheduleDialogOpen}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>{`${animal?.name}`}</Dialog.Title>
				<Dialog.Description>
					Add new schedule for {animal?.name}
				</Dialog.Description>
			</Dialog.Header>
			<Label>Title</Label>
			<Input bind:value={title}></Input>
			<Label>Date</Label>
			<DatePicker bind:value={selectedDate}></DatePicker>
			<Label>Vaccine</Label>
			<Combobox source={vaccines} bind:value={selectedVaccine} />
			<div class="flex justify-end">
				<Button
					{disabled}
					on:click={selectedId === '' ? submitNewSchedule : submitUpdateSchedule}
					class="mx-4 mt-8">Submit</Button
				>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={scheduleDialogOpen}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>{`${animal?.name}`}</Drawer.Title>
				<Drawer.Description class="mb-4">
					Add new schedule for {animal?.name}
				</Drawer.Description>
			</Drawer.Header>
			<div class="mx-4 flex flex-col justify-stretch gap-4">
				<Label>Title</Label>
				<Input bind:value={title}></Input>
				<Label>Date</Label>
				<DatePicker bind:value={selectedDate}></DatePicker>
				<Label>Vaccine</Label>
				<Combobox source={vaccines} bind:value={selectedVaccine} />
			</div>
			<Button
				{disabled}
				on:click={selectedId === '' ? submitNewSchedule : submitUpdateSchedule}
				class="mx-4 mt-8">Submit</Button
			>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}

{#if $isDesktop}
	<Dialog.Root bind:open={deleteDialogOpen}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Delete Schedule</Dialog.Title>
				<Dialog.Description>
					Do you want to delete this schedule? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<div class="flex justify-end gap-4">
				<Button variant="destructive" on:click={deleteSchedule}>Delete</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={deleteDialogOpen}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Delete Animal</Drawer.Title>
				<Drawer.Description class="mb-4">
					Do you want to delete this animal? This action cannot be undone.
				</Drawer.Description>
			</Drawer.Header>
			<Button on:click={deleteSchedule} variant="destructive" class="mx-4">Delete</Button>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
