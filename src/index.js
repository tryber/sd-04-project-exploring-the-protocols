const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  console.log(data);
  const headerData = data.split('\r\n').find((chunk) => chunk.startsWith(header));
  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const userAgent = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<h4 data-testid="ip">${clientIP}</h4>`);
      socket.write(`<h5 data-testid="device">${userAgent}</h5>`);
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4"' +
        'width="480"' +
        'height="236"' +
        'frameBorder="0"' +
        'class="giphy-embed"' +
        ' allowFullScreen></iframe>'
      );
      socket.write(`<h5 data-testid="city">${JSON.stringify(locationData.city)}</h5>`);
      socket.write(`<h5 data-testid="postal_code">${JSON.stringify(locationData.postal_code)}</h5>`);
      socket.write(`<h5 data-testid="region">${JSON.stringify(locationData.region_name)}</h5>`);
      socket.write(`<h5 data-testid="country">${JSON.stringify(locationData.country_name)}</h5>`);
      socket.write(`<h5 data-testid="company">${JSON.stringify(locationData.company)}</h5>`);
      socket.write(`<h5 data-testid="arch">${os.platform()} / ${os.release()} / ${os.arch()}🔎</h5>`);
      socket.write(`<h5 data-testid="cpu">${JSON.stringify(os.cpus()[0])}🔎</h5>`);
      socket.write(`<h5 data-testid="memory">${(os.totalmem() / 1000000000).toFixed(3)}GB 🔎</h5>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
