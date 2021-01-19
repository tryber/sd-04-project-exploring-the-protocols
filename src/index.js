const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  console.log(data);
  const headerData = data.split('\r\n').find((chunk) => chunk.startsWith(header));

  console.log(headerData);
  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');

    getLocationInfos(clientIP, (locationData) => {
      console.log(locationData);
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );

      socket.write(`<h4 data-testid="ip">${clientIP}</h4>`);
      socket.write(`<h4 data-testid="city">${locationData.city}</h4>`);
      socket.write(`<h4 data-testid="postal_code">${locationData.postal_code}</h4>`);
      socket.write(`<h4 data-testid="region">${locationData.region}</h4>`);
      socket.write(`<h4 data-testid="country">${locationData.country_name}</h4>`);
      socket.write(`<h4 data-testid="company">${locationData.company}</h4>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
