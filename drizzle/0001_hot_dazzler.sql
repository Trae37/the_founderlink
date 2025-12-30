CREATE TABLE `intakeSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`context` text,
	`productType` enum('nocode-matches','fullstack-waitlist','mobile-waitlist') NOT NULL,
	`stripeSessionId` varchar(255),
	`paymentStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intakeSubmissions_id` PRIMARY KEY(`id`)
);
