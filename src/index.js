const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data.split('\r\n').find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const user = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      const {
        postal_code: postalCode,
        region,
        city,
        country_name: country,
        company,
      } = locationData;
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<h4 data-testid="ip">${clientIP}</h4>`);
      socket.write(`<h5 data-testid="device">${user}</h5>`);
      socket.write(`<p data-testid="city">${city}</p>`);
      socket.write(`<p data-testid="postal_code">${postalCode}</p>`);
      socket.write(`<p data-testid="region">${region}</p>`);
      socket.write(`<p data-testid="country">${country}</p>`);
      socket.write(`<p data-testid="company">${company}</p>`);
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
