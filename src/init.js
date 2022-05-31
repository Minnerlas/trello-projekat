import fs from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dir = "./build";

if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}

const db = await open({
	filename: "database.db",
	driver: sqlite3.Database
});

await db.exec(`CREATE TABLE IF NOT EXISTS User (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL
)`);

await db.exec(`CREATE TABLE IF NOT EXISTS Status (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL
)`);

await db.run( `INSERT INTO Status (name)
	values ("Todo"), ("In progress"), ("Done")`);

await db.exec(`CREATE TABLE IF NOT EXISTS Task (
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	statusId INTEGER NOT NULL,
	userId INTEGER NOT NULL,
	CONSTRAINT fkuserid FOREIGN KEY (userId) REFERENCES User (id)
)`);


await db.close();
