// Create web server
// This is a simple web server that will serve a file called comments.html.
// The file is a simple form that allows the user to submit a comment. When the user submits the form, the comment is saved to a file called comments.json.
// The server will also serve the comments.json file when the user requests it.

const http = require('http');
const fs = require('fs');
const url = require('url');

// Create a server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);

  // Serve the comments.html file
  if (parsedUrl.pathname === '/comments.html') {
    fs.readFile('comments.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  // Serve the comments.json file
  if (parsedUrl.pathname === '/comments.json') {
    fs.readFile('comments.json', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }

  // Handle form submission
  if (parsedUrl.pathname === '/submit_comment') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const comment = JSON.parse(body);

      fs.readFile('comments.json', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        const comments = JSON.parse(data);
        comments.push(comment);

        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/plain' });