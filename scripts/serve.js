const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const page = join(__dirname, '..', 'build', 'index.html');
const port = Number(process.env.PORT || 3000);
createServer(async (request, response) => {
  if (request.url !== '/' && request.url !== '/index.html') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  try {
    const html = await readFile(page);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
  } catch {
    response.writeHead(500);
    response.end('Build the site first with npm run build.');
  }
}).listen(port, () => console.log(`Preview at http://localhost:${port}`));
