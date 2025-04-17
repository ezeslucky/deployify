
import { eq } from "drizzle-orm";
import { logger } from "./logger.js";
import { scheduleJob } from "./queue.js";
import type { QueueJob } from "./schema.js";
import {cleanUpDockerBuilder, cleanUpSystemPrune,cleanUpUnusedImages,} from "../../../packages/server/src/utils/docker/utils.js"
import {findBackupById} from "../../../packages/server/src/services/backup.js"
import {findServerById} from "../../../packages/server/src/services/server.js"
import {keepLatestNBackups} from "../../../packages/server/src/utils/backups/index.js"
import {runMariadbBackup} from "../../../packages/server/src/utils/backups/mariadb.js"
import {runMongoBackup} from " ../../../packages/server/src/utils/backups/mongo.js"
import {runMySqlBackup} from "../../../packages/server/src/utils/backups/mysql.js"
import {runPostgresBackup} from "../../../packages/server/src/utils/backups/postgres.js"

import { db } from "../../../packages/server/dist/db";
import { backups, server } from "../../../packages/server/dist/db/schema";


export const runJobs = async (job: QueueJob) => {
	try {
		if (job.type === "backup") {
			const { backupId } = job;
			const backup = await findBackupById(backupId);
			const { databaseType, postgres, mysql, mongo, mariadb } = backup;

			if (databaseType === "postgres" && postgres) {
				const server = await findServerById(postgres.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runPostgresBackup(postgres, backup);
				await keepLatestNBackups(backup, server.serverId);
			} else if (databaseType === "mysql" && mysql) {
				const server = await findServerById(mysql.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runMySqlBackup(mysql, backup);
				await keepLatestNBackups(backup, server.serverId);
			} else if (databaseType === "mongo" && mongo) {
				const server = await findServerById(mongo.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runMongoBackup(mongo, backup);
				await keepLatestNBackups(backup, server.serverId);
			} else if (databaseType === "mariadb" && mariadb) {
				const server = await findServerById(mariadb.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runMariadbBackup(mariadb, backup);
				await keepLatestNBackups(backup, server.serverId);
			}
		}
		if (job.type === "server") {
			const { serverId } = job;
			const server = await findServerById(serverId);
			if (server.serverStatus === "inactive") {
				logger.info("Server is inactive");
				return;
			}
			await cleanUpUnusedImages(serverId);
			await cleanUpDockerBuilder(serverId);
			await cleanUpSystemPrune(serverId);
		}
	} catch (error) {
		logger.error(error);
	}

	return true;
};


export const initializeJobs = async () => {
	logger.info("Setting up Jobs....");

	const servers = await db.query.server.findMany({
		where: eq(server.enableDockerCleanup, true),
	});

	for (const server of servers) {
		const { serverId } = server;
		scheduleJob({
			serverId,
			type: "server",
			cronSchedule: "0 0 * * *",
		});
	}

	logger.info({ Quantity: servers.length }, "Servers Initialized");

	const backupsResult = await db.query.backups.findMany({
		where: eq(backups.enabled, true),
		with: {
			mariadb: true,
			mysql: true,
			postgres: true,
			mongo: true,
		},
	});

	for (const backup of backupsResult) {
		scheduleJob({
			backupId: backup.backupId,
			type: "backup",
			cronSchedule: backup.schedule,
		});
	}
	logger.info({ Quantity: backupsResult.length }, "Backups Initialized");
};
