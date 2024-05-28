CREATE TABLE `schedules` (
	`id` text(100) PRIMARY KEY NOT NULL,
	`title` text(100) NOT NULL,
	`done` integer NOT NULL,
	`user_id` text(100) NOT NULL,
	`animal_id` text(100) NOT NULL,
	`vaccine_id` text(100) NOT NULL,
	`start` integer NOT NULL,
	`created_at` integer NOT NULL
);
