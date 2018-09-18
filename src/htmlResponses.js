// Requires
const fs = require('fs');

// Load html and css into memory
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Function to send the index in the response
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Function to send the css in the response
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// Export the functions (make them public)
module.exports.getIndex = getIndex;
module.exports.getCSS = getCSS;
