const PUBLIC_URL = {
  test: {
    //baseUrl: 'http://192.168.1.135:9051/inspectmanagement/',
    baseUrl: 'http://192.168.1.124:20003/cs/',
    imgUrl: 'http://192.168.1.138/',
    websocketUrl: 'ws://192.168.1.135:9528/schedulertask/webSocket/index',
    xj: 'http://39.97.227.181/cdg/bhweb/index.html'
  },
  online: {
    //baseUrl: 'http://39.97.227.181/mmsapi_cdg_web/',
    baseUrl: 'http://192.168.1.124:20003/cs/',
    // baseUrl: '/api/mmsapi_cdg_web',
    imgUrl: 'http://39.97.228.175/',
    websocketUrl: 'ws://39.97.228.223:9528/schedulertask/webSocket/index',
    xj: 'http://39.97.227.181/cdg/bhweb/index.html'
  },
};

const env = 'online';

export default PUBLIC_URL[env];
