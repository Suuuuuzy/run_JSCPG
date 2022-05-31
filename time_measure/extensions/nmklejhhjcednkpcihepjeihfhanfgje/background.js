chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        id: 'javad-rams-window-id-0000001',
        'outerBounds': {
            'width': 800,
            'height': 600
        }
    }, function (createdWindow) {
        createdWindow.onClosed.addListener(function () {
            chrome.sockets.tcpServer.getSockets(function (listenSockets) {
                for (var i = 0; i < listenSockets.length; i++) {
                    var listenSocket = listenSockets[i];
                    chrome.sockets.tcpServer.close(listenSocket.socketId);
                }
            });
            chrome.sockets.tcp.getSockets(function (tcpSockets) {
                for (var i = 0; i < tcpSockets.length; i++) {
                    var tcpSocket = tcpSockets[i];
                    chrome.sockets.tcp.close(tcpSocket.socketId);
                }
            });
        })
    });
});