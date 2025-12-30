CREATE TABLE `mvpSuggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userDescription` text NOT NULL,
	`problemDescription` text,
	`features` json,
	`selectedRoute` varchar(50),
	`complexity` varchar(20),
	`budget` varchar(50),
	`timeline` varchar(50),
	`estimatedCostMin` int,
	`estimatedCostMax` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mvpSuggestions_id` PRIMARY KEY(`id`)
);
