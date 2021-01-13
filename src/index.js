const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
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

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<h2 data-testid="ip">IP: ${clientIP}</h2>`);
      socket.write(`<h3 data-testid="city">CITY: ${locationData.city}</h3>`);
      socket.write(
        `<h3 data-testid="postal_code">POSTAL CODE: ${locationData.postal_code}</h3>`,
      );
      socket.write(
        `<h3 data-testid="region">REGION: ${locationData.region}</h3>`,
      );
      socket.write(
        `<h3 data-testid="country">COUNTRY: ${locationData.country_name}</h3>`,
      );
      socket.write(
        `<h3 data-testid="company">COMPANY: ${locationData.company}</h3>`,
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
