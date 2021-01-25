const https = require('https');

const options = {
  hostname: 'iplocation.com',
  port: 443,
  path: '/',
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const getLocationInfos = (clientIP, cb) => {
  const req = https.request(options, (res) => {
    const serverInfo = res.headers.server;
    res.on('data', (locationDataRaw) => {
      const locationData = JSON.parse(locationDataRaw.toString());

      // console.log(locationData);

      cb(locationData, serverInfo);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(`ip=${clientIP}`);

  req.end();
};

module.exports = {
  getLocationInfos,
};
