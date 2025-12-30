CREATE TABLE `documentTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('prd','sow') NOT NULL,
	`route` enum('no-code','hybrid','custom') NOT NULL,
	`content` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documentTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`message` text NOT NULL,
	`category` enum('bug','feature','question','other') NOT NULL DEFAULT 'other',
	`status` enum('new','in-progress','resolved','closed') NOT NULL DEFAULT 'new',
	`adminResponse` text,
	`respondedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userFeedback_id` PRIMARY KEY(`id`)
);
