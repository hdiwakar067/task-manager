const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasks_db = require('./task.json');
const tasks = tasks_db['tasks'];

app.get('/', (req, res) => {
    res.send("Welcome to the tasks manager api")
})

// Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.send(tasks);
});

// Retrieve a single task by id
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const task = tasks.find(task => task.id === parseInt(id));
    if(!task) {
        res.status(404).send('Task not found');
    }
    res.send(task);
});


// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;

    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be a boolean');
    }

    const id = tasks.length + 1;
    const task = { id, title, description, completed: completed || false };
    tasks.push(task);
    res.status(201).send(task);
});

// Update a task by id
app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, completed } = req.body;

    const task = tasks.find(task => task.id === parseInt(id));
    if(!task) {
        res.status(404).send('Task not found');
    }

    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be a boolean');
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = (req.body.completed) ? req.body.completed : task.completed;
    res.send(task);
});

// Delete a task by id
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const task = tasks.find(task => task.id === parseInt(id));
    if(!task) {
        res.status(404).send('Task not found');
    }
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    res.send(task);
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;