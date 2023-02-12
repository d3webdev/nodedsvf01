const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((verifyUser)=> verifyUser.username === username); 

  if ( !user ) {
    return response.status(400).json({error: "Username not found!"})
  }

  request.user = user;

  return next();
}

function checksExistsTodo(request, response, next) {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((todoId)=>todoId.id === id);

  if (!todo) { 
    return response.status(404).json({error: "Todo not found!"})
  }

  request.todo = todo;
  request.id = id;

  return next();
}


app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userId = uuidv4(); 
  const userAlredyExist = users.some((user)=> user.username === username); 

  if ( userAlredyExist ) {
    return response.status(400).json({error: "Username alredy exist!"})
  }

  if(!name || !username) {
    return response.status(400).json({erro: "Incorrect parameters!"});
  } 

  users.push({
    id: userId,
    name,
    username,
    todos: []
  });

  const user = users.find((checkUser)=>checkUser.id === userId);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(201).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const todoId = uuidv4();

  user.todos.push({
    id: todoId,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  const todo = user.todos.find((checkTodo)=> checkTodo.id === todoId);

  return response.status(201).json(todo);


});

app.put('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const todo = request.todo;

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  // Complete aqui
  const todo = request.todo;

  todo.done = true;

  return response.status(201).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  // Complete aqui
  const id = request.id;
  const todos = request.user.todos;

  const todoIndex = todos.findIndex((checkTodoIndex)=> checkTodoIndex.id === id);

  todos.splice(todoIndex, 1)

  return response.status(204).send();

});

module.exports = app;