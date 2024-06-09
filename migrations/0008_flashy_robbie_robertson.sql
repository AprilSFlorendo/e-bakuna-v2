CREATE TABLE `requests` (
	`id` text(100) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`vaccine_id` text(100) NOT NULL,
	`shots` integer NOT NULL,
	`user_id` text(100) NOT NULL,
	FOREIGN KEY (`vaccine_id`) REFERENCES `vaccines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
