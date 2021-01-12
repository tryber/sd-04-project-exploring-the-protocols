const net = require('net');
const os = require('os');

// console.log(os.platform()) // linux
// console.log(os.arch()) // arquitetura OS
// console.log(os.release()) // versão OS
// console.log(os.cpus()) // cpus
// console.log(os.totalmem()/1024/1024/1024) // total memory

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  console.log(data);
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      const {
        ip,
        city,
        postal_code: zip,
        region,
        region_name: state,
        country_name: country,
        company,
      } = locationData;
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<p data-testid="ip">${ip}</p>`);
      socket.write(`<p data-testid="city">${city}</p>`);
      socket.write(`<p data-testid="postal_code">${zip}</p>`);
      socket.write(`<p data-testid="region">${state}, ${region}</p>`);
      socket.write(`<p data-testid="country">${country}</p>`);
      socket.write(`<p data-testid="company">${company}</p>`);
      socket.write(`<p data-testid="device">${device}</p>`);
      socket.write(`<p>INFO ABOUT SYSTEM</p>`);
      socket.write(`<p data-testid="cpu">CPU Model: ${os.cpus()[0].model}</p>`);
      socket.write(`<p data-testid="cpu">CPU Cores: ${os.cpus().length}</p>`);
      socket.write(
        `<p data-testid="cpu">CPU Speed: ${os.cpus()[0].speed} MHz</p>`,
      );
      socket.write(
        `<p data-testid="arch">OS: ${os.platform()}, ${os.arch()}, ${
          os.release
        }</p>`,
      );
      // dividir 3 x por 1024 para pegar a qtd de GB
      socket.write(
        `<p data-testid="memory">Memory: ${
          os.totalmem() / 1024 / 1024 / 1024
        } Gb</p>`,
      );
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
