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
				start: schedule.date,
				end: schedule.date,
				title: JSON.stringify({
					number: schedule.ticketNumber,
					vaccine: schedule.vaccine.name,
					shots: schedule.shots,
					status: schedule.status
				}),
				id: schedule.id
			};
		}),

		eventContent: (info) => {
			const json = JSON.parse(info.event.title);

			return {
				html: `<div class="flex flex-col gap-1 p-2">
							<div class="font-semibold">#${json.number.toString().padStart(6, '0')} ${json.vaccine}</div>
							<div class="text-sm">${json.shots} ${json.shots > 1 ? 'shots' : 'shot'}</div>
							<div class="text-xs mt-2">${json.status}</div>
					   </div>`
			};
		}
	};
</script>

<div class="flex flex-col gap-4 p-0 sm:rounded-xl sm:bg-slate-500/10 sm:p-8">
	<h1 class="text-3xl">Client Schedules</h1>
	<div class="h-full overflow-x-auto">
		<div class="ec-dark min-w-[768px] pb-1">
			<Calendar {plugins} {options} />
		</div>
	</div>
</div>
