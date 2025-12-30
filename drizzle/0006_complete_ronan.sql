CREATE TABLE `assessmentProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`currentStep` int NOT NULL DEFAULT 0,
	`responses` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessmentProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessmentProgress_email_unique` UNIQUE(`email`)
);
