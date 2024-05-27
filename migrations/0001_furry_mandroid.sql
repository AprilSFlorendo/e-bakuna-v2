CREATE TABLE `vaccines` (
	`id` text(100) PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`description` text(255) NOT NULL,
	`doses` integer NOT NULL,
	`interval` integer NOT NULL
);
