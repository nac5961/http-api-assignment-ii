// Requires
const query = require('querystring');

const users = {};

// Function to send response
const sendResponse = (request, response, code, content, hasBody) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  if (hasBody) response.write(content);
  response.end();
};

// Function to send users in the response
const getUsers = (request, response) => {
  const json = { users };

  sendResponse(request, response, 200, JSON.stringify(json), true);
};

// Function to only send the headers for the users in the response
const getUsersMeta = (request, response) => sendResponse(request, response, 200, null, false);

// Function to send a 404 page
const getNotFound = (request, response) => {
  const json = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  sendResponse(request, response, 404, JSON.stringify(json), true);
};

// Function to send the headers for a 404 page
const getNotFoundMeta = (request, response) => sendResponse(request, response, 404, null, false);

// Function to add a new user
const addUser = (request, response, body) => {
  const json = {};

  // Handle 404 responses (Send error message)
  if (!body.name || !body.age) {
    json.id = 'missingParams';
    json.message = 'Name and age are both required.';

    return sendResponse(request, response, 400, JSON.stringify(json), true);
  }

  // Handle 204 response (Update existing user)
  if (users[body.name]) {
    users[body.name].age = body.age;

    return sendResponse(request, response, 204, null, false);
  }

  // Handle 201 response (Create new user)
  users[body.name] = {};
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  json.message = 'Created Successfully';

  return sendResponse(request, response, 201, JSON.stringify(json), true);
};

// Function to handle the 'on' events for the request
const processPostRequest = (request, response) => {
  // Array to hold the stream of data sent
  const body = [];

  // on an error, send a 404 response back
  request.on('error', () => {
    response.statusCode = 400;
    response.end();
  });

  // Get the stream of data
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // When the request has ended, perform the post action
  request.on('end', () => {
    // Convert the stream of data into a query string (Ex: name=John&age=7)
    const bodyString = Buffer.concat(body).toString();

    // Convert the query string into JSON (Ex: {name: John, age: 7})
    const json = query.parse(bodyString);

    // Add new user with the data
    addUser(request, response, json);
  });
};

// Export the functions (make them public)
module.exports.getUsers = getUsers;
module.exports.getUsersMeta = getUsersMeta;
module.exports.getNotFound = getNotFound;
module.exports.getNotFoundMeta = getNotFoundMeta;
module.exports.processPostRequest = processPostRequest;
