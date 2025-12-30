CREATE TABLE `developers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`specialization` enum('nocode','fullstack','mobile') NOT NULL,
	`bio` text,
	`portfolioUrl` varchar(500),
	`hourlyRate` int,
	`yearsExperience` int,
	`skills` text,
	`verified` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `developers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matchAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intakeSubmissionId` int NOT NULL,
	`developerId` int NOT NULL,
	`matchReason` text,
	`sentAt` timestamp,
	`status` enum('assigned','sent','viewed','contacted') NOT NULL DEFAULT 'assigned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matchAssignments_id` PRIMARY KEY(`id`)
);
