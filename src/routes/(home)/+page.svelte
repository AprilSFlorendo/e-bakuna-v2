<script>
	import Calendar from '@event-calendar/core';
	import DayGrid from '@event-calendar/day-grid';

	let plugins = [DayGrid];

	let options = {
		view: 'dayGridMonth',
		events: [
			{
				start: '2024-04-06',
				end: '2024-04-06',
				title: JSON.stringify({ title: 'Event 1', description: 'Description 1' }),
				description: 'Description 1',
				backgroundColor: '#23262E',
				id: '1'
			},
			{
				id: '2',
				start: '2024-04-06',
				end: '2024-04-06',
				title: JSON.stringify({ title: 'Event 2', description: 'Description 2' })
			}
		],
		eventClick: (info) => console.log(info),
		eventContent: (info) => {
			const json = JSON.parse(info.event.title);

			return {
				html: `<div class="flex flex-col">
							<div class="text-md font-bold">${json.title}</div>
							<div class="text-xs">${json.description}</div>
					   </div>`
			};
		}
	};
</script>

<div class="ec-dark overflow-x-hidden">
	<h1 class="text-3xl">Dashboard</h1>
	<div class="h-full overflow-x-auto">
		<div class="pb-1 min-w-[768px]">
			<Calendar {plugins} {options} />
		</div>
	</div>
</div>
