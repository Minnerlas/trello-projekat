import express, { Express, Request, Response } from 'express';

import {init, Status, User, Task} from './database.js';

const statuscols = ["Todo", "In progress", "Done"];

await init();

const app: Express = express();
const port = 8000;

app.use(express.json());
app.use('/', express.static('public'));

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.get('/api/statuses', async (req: Request, res: Response) => {
	res.send(JSON.stringify(await Status.getAll()));
});

app.post('/api/statuses', (req: Request, res: Response) => {
	const {status}: {status: string} = req.body;
	Status.add(status);
	res.send("ok");
});

app.get('/api/users', async (req: Request, res: Response) => {
	res.send(JSON.stringify(await User.getAll()));
});

app.post('/api/users', async (req: Request, res: Response) => {
	const {user}: {user: string} = req.body;
	User.add(user);
	res.send("ok");
});

app.get('/api/tasks', async (req: Request, res: Response) => {
	res.send(JSON.stringify(await Task.getAll()));
});

app.post('/api/tasks', async (req: Request, res: Response) => {
	const task: Task = req.body;
	Task.add(task.title, task.description, task.statusId, task.userId);
	res.send("ok");
});

app.put('/api/task/:id', async (req: Request, res: Response) => {
	const {id: idstr} = req.params;
	const id = parseInt(idstr);
	const {userId, statusId}: {userId: number, statusId: number} = req.body;

	if (!isNaN(id))
		Task.update(id, userId, statusId);
	res.send("ok");
});

app.delete('/api/task/:id', async (req: Request, res: Response) => {
	const {id: idstr} = req.params;
	const id = parseInt(idstr);

	if (!isNaN(id))
		Task.delete(id);
	res.send("ok");
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


