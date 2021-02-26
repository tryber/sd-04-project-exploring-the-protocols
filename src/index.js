const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  console.log('HEADERDATA: ', headerData);
  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('DATA: ', data);
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    console.log('CLIENTIP: ', clientIP);

    getLocationInfos(clientIP, (locationData) => {
      const {
        ip,
        city,
        postal_code: postalCode,
        region,
        region_name: regionName,
        country_name: countryName,
        company,
      } = locationData;

      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write(`<p data-testid="ip">${ip}</p>`);
      socket.write(`<p data-testid="city">${city}</p>`);
      socket.write(`<p data-testid="postal_code">${postalCode}</p>`);
      socket.write(`<p data-testid="region">${region}${regionName}</p>`);
      socket.write(`<p data-testid="country">${countryName}</p>`);
      socket.write(`<p data-testid="company">${company}</p>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080, () => console.log('Servidor funfou!'));
