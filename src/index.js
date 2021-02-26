const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';
const endResponse = '\r\n\r\n';

const cpus = os.cpus();
const colors = cpus.map((core, index) => {
  const colorPrint = ` >> Core ${index + 1} - Modelo: ${core.model} | Velocidade: ${core.speed / 1000}GHz`;
  return colorPrint;
});

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startResponse);
      socket.write('<html><head><meta http-equiv="content-type"content="text/html;charset=utf-8">');
      socket.write('<title>Trybe</title></head><body>');
      socket.write('<H1>Explorando os Protocolos</H1>');
      socket.write('</body></html>');
      socket.write(`<h1 data-testid="ip">${clientIP}</h1>`);
      socket.write(`<h1 data-testid="city">${locationData.city}</h1>`);
      socket.write(`<h1 data-testid="postal_code">${locationData.postal_code}</h1>`);
      socket.write(`<h1 data-testid="region">${locationData.region}</h1>`);
      socket.write(`<h1 data-testid="country">${locationData.country_name}</h1>`);
      socket.write(`<h1 data-testid="company">${locationData.company}</h1>`);
      socket.write(`<h1 data-testid="device">${device}</h1>`);
      socket.write(`<h1 data-testid="arch">${os.platform()} ${os.release()} ${os.arch()}</h1>`);
      socket.write(`<h1 data-testid="cpu">CPU ${cpus.length} colors: ${colors}</h1>`);
      socket.write(`<h1 data-testid="memory">${os.totalmem() / 1024 / 1024 / 1024}GB</h1>`);
      socket.write(endResponse);
    });
  });
});

server.listen(8080);