declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			userInfo: {
				firstName: string;
				lastName: string;
				email: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@event-calendar/core';
declare module '@event-calendar/day-grid';
declare module '@event-calendar/interaction';
export {};
