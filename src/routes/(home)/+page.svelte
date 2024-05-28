<script>
	import { goto } from '$app/navigation';
	import Calendar from '@event-calendar/core';
	import DayGrid from '@event-calendar/day-grid';

	export let data;

	let schedules = data.schedules;

	let plugins = [DayGrid];

	let options = {
		view: 'dayGridMonth',
		events: schedules.map((schedule) => {
			return {
				start: schedule.start,
				end: schedule.start,
				title: JSON.stringify({
					title: schedule.title,
					animal: schedule.animal.name,
					vaccine: schedule.vaccine.name,
					done: schedule.done
				}),
				description: schedule.title,
				backgroundColor: schedule.color,
				id: schedule.animal.id
			};
		}),

		eventClick: (info) => goto(`/animals/schedules/${info.event.id}`),
		eventContent: (info) => {
			const json = JSON.parse(info.event.title);

			return {
				html: `<div class="flex flex-col gap-2 p-2">
							<div class="font-semibold">${json.animal}</div>
							<div class="text-base">${json.title}</div>
							<div class="text-xs">${json.vaccine}</div>
							<div class="text-xs mt-2">${json.done ? 'finished' : 'in-progress'}</div>
					   </div>`
			};
		}
	};
</script>

<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<h1 class="text-3xl">Dashboard</h1>
	<div class="h-full overflow-x-auto">
		<div class="min-w-[768px] pb-1">
			<Calendar {plugins} {options} />
		</div>
	</div>
</div>
