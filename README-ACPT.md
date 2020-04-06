graphql server port 3500 - http://opendata.slo.nl:3500
Note: do not use https!

api-server port 4500
src/api-server.js:
const port=4500;
const backendUrl="http://opendata.slo.nl:3500";

www/index.html
<base url="/curriculum/api-acpt/v1/">