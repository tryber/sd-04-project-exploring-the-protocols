const net = require('net');
const os = require('os');

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

const cpu = `${[
  `<li>Modelo: ${os.cpus()[0].model}</li>`,
  `<li>Frequência: ${os.cpus()[0].speed} mhz</li>`,
  `<li>Quantidade de cores: ${os.cpus().length}</li>`,
].join('\r\n')}`;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, ({
      city,
      postal_code: postalCode,
      region,
      country_name: countryName,
      company,
    }) => {
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      socket.write(`<p data-testid="city">${city}</p>`);
      socket.write(`<p data-testid="postal_code">${postalCode}</p>`);
      socket.write(`<p data-testid="region">${region}</p>`);
      socket.write(`<p data-testid="country">${countryName}</p>`);
      socket.write(`<p data-testid="company">${company}</p>`);
      socket.write('<p >Device</p>');
      socket.write(`<p data-testid="device">${device}</p>`);
      socket.write(`<p data-testid="arch">${os.arch()}</p>`);
      socket.write(`<p data-testid="memory">${os.totalmem()}</p>`);
      socket.write(`<p data-testid="cpu">${cpu}</p>`);
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
