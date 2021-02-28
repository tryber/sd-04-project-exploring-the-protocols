const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startResponse = `${[
  'HTTP/1.1 200 OK',
  'Content-Type: text/html; charset=UTF-8',
].join('\r\n')}\r\n\r\n`;

const endResponse = `${[].join('\r\n')}\r\n\r\n`;

const cpus = os.cpus();
const cores = cpus.map((core, index) => {
  const corePrint = ` >> Core ${index + 1} - Modelo: ${core.model} | Velocidade: ${core.speed / 1000}GHz`;
  return corePrint;
});

const httpServer = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startResponse);
      socket.write('<html><head><meta http-equiv="content-type"content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(`<h1 data-testid="ip">${clientIP}</h1>`);
      socket.write(`<h1 data-testid="city">${locationData.city}</h1>`);
      socket.write(`<h1 data-testid="postal_code">${locationData.postal_code}</h1>`);
      socket.write(`<h1 data-testid="region">${locationData.region}</h1>`);
      socket.write(`<h1 data-testid="country">${locationData.country_name}</h1>`);
      socket.write(`<h1 data-testid="company">${locationData.company}</h1>`);
      socket.write(`<h1 data-testid="device">${device}</h1>`);
      socket.write(`<h1 data-testid="arch">${os.platform()} ${os.release()} ${os.arch()}</h1>`);
      socket.write(`<h1 data-testid="cpu">CPU ${cpus.length} cores: ${cores}</h1>`);
      socket.write(`<h1 data-testid="memory">${os.totalmem() / 1024 / 1024 / 1024}GB</h1>`);
      socket.write(endResponse);
    });
  });
});

httpServer.listen(8080);
