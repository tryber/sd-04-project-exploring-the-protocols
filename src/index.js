const net = require('net');
const os = require('os');

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
    const userAgent = getHeaderValue(data.toString(), 'User-Agent');
    getLocationInfos(clientIP, (locationData) => {
      console.log(locationData);
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write(`<p data-test-id="ip">${clientIP}</p>`);
      socket.write(`<p data-test-id="city">${locationData.city}</p>`);
      socket.write(`<p data-test-id="postal_code">${locationData.postal_code}</p>`);
      socket.write(`<p data-test-id="region">${locationData.region}</p>`);
      socket.write(`<p data-test-id="country">${locationData.country_name}</p>`);
      socket.write(`<p data-test-id="company">${locationData.company}</p>`);
      socket.write(`<p data-test-id="device">${userAgent}</p>`);
      socket.write(`<p data-testid="arch">${os.platform()}: ${os.release()}, ${os.arch()}`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
