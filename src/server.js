// Requires
const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const ajaxHandler = require('./ajaxResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const methodHandler = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': ajaxHandler.getUsers,
    '/notReal': ajaxHandler.getNotFound,
    defaultResponse: ajaxHandler.getNotFound,
  },
  HEAD: {
    '/getUsers': ajaxHandler.getUsersMeta,
    '/notReal': ajaxHandler.getNotFoundMeta,
  },
  POST: {
    '/addUser': ajaxHandler.processPostRequest,
  },
};

// Function to process requests
const onRequest = (request, response) => {
  // Parse the url to get more information
  const parsedUrl = url.parse(request.url);

  // Get the method in the request (GET, HEAD, POST, etc)
  const { method } = request;

  // Process the method
  if (methodHandler[method] && methodHandler[method][parsedUrl.pathname]) {
    methodHandler[method][parsedUrl.pathname](request, response);
  } else {
    methodHandler.GET.defaultResponse(request, response);
  }
};

// Start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
