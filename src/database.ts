import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import process from "node:process";
import assert from "assert";


const db: Database = await (async function() {
	const db = await open({
		filename: "database.db",
		driver: sqlite3.Database
	});
	process.on("exit", async (code) => {
		assert(db != null);
		await db.close();
		console.log(`About to exit with code: ${code}`);
	});
	return db;
})();

export class Status {
	id: number;
	name: string;

	private constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	static async getAll(): Promise<Status[]> {
		assert(db != null);
		return db.all("SELECT id, name FROM Status ORDER BY id");
	}

	static async add(name: string): Promise<Status> {
		assert(db != null);
		const {lastID} = await db.run("INSERT INTO Status (name) values (?)", name);
		if (typeof(lastID) != "undefined")
			return new Status(lastID, name);

		throw "Can't add a new status.";
	}
}

export class User {
	id: number;
	name: string;

	private constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	static async getAll(): Promise<User[]> {
		assert(db != null);
		return db.all("SELECT id, name FROM user");
	}

	static async add(name: string): Promise<User> {
		assert(db != null);
		const {lastID} = await db.run("INSERT INTO User (name) values (?)", name);
		if (typeof(lastID) != "undefined")
			return new User(lastID, name);

		throw "Can't add a new user.";
	}
}

export class Task {
	id: number;
	title: string;
	description: string;
	statusId: number;
	userId: number;

	private constructor(id: number, title: string, desc: string, status:
						number, user: number) {
		this.id = id;
		this.title = title;
		this.description = desc;
		this.statusId = status;
		this.userId = user;
	}

	static async getAll(): Promise<Task[]> {
		assert(db != null);
		return db.all("SELECT * FROM task");
	}

	static async add(title: string, description: string, statusId: number,
		userId: number): Promise<Task> {

		assert(db != null);
		const {lastID} = await db.run(
			`INSERT INTO Task (title, description, statusId, userId)
			values (?, ?, ?, ?)`,
			title, description, statusId, userId);

		if (typeof(lastID) != "undefined")
			return new Task(lastID, title, description, statusId, userId);

		throw "Can't add a new task.";
	}

	static async update(taskId: number, userId: number, statusId: number): Promise<void> {
		assert(db != null);
		await db.run(
			`UPDATE Task
			SET (userId, statusId) = (?, ?)
			WHERE id = ?;`,
			userId, statusId, taskId);
	}

	static async delete(taskId: number): Promise<void> {
		assert(db != null);
		await db.run(
			`DELETE FROM Task
			WHERE id = ?`,
			taskId);
	}
}
