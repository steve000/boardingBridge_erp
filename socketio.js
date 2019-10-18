var express = require('express');
var router = express.Router();
var http = require('http');
var qs = require('querystring');

var socket_io = require('socket.io');
var socketio = {};  

var DEBUG = true;
var HOST = DEBUG ? '192.168.0.117' : 'www.baidu.com';
var PORT = DEBUG ? 9888 : 80;

/* ws跟前端交互    post循环请求后台数据 */
router.post('/', function(req, res, next) {
    var params = {};
    for (var key in req.body) {
        keyvalue = req.body[key];
        params[key] = keyvalue;
    };
    console.log('------------', params);
    httpPort(params)
    function httpPort(params) {
        var content = qs.stringify(params);
        var options = {
            method: 'POST',
            host: HOST,
            port: PORT,
            path: '/qmp/text',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded',
                "Content-Length": content.length
            }
        };
        // console.log(options);
        var req = http.request(options, function(res) {
            // console.log('dataHeader: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var _data = '';
            res.on('data', function(chunk) {
                _data += chunk;
                console.log("data---------------:", _data);
                if (_data.slice(-13) == '"status":200}') {
                    resData(_data);
                } else {
                    resData(_data);
                }
            })
        });
        req.write(content);
        req.end();
        req.on('error', function(e) {
            console.log("Got error: " + e.message);
        });

        function resData(data) {
            res.send(data); //返回页面数据，闭包
        }
    }
});


socketio.getSocketio = function(server) {
    var io = socket_io.listen(server);
    let users = []
    io.sockets.on('connection', function (socket) {
        console.log('连接成功');
        // 失去连接
        socket.on('disconnect',function() {
            if(users.indexOf(socket.username)>-1) {
            users.splice(users.indexOf(socket.username),1);
            console.log(socket.username+'===>disconnected');
            }
            socket.broadcast.emit('users',{number:users.length});
        });
        socket.on('message',function(data) {
            let newData = {text: data.text, user: socket.username}
            socket.emit('receive_message',newData);
            socket.broadcast.emit('receive_message',newData);
        });
        socket.on('login',function(data) {
            console.log('--------------------------laiel', data)
            if(users.indexOf(data.username)>-1) {

            } else {
            socket.username = data.username;
            users.push(data.username);
            // 统计连接数
            socket.emit('users',{number:users.length});  // 发送给自己
            socket.broadcast.emit('users',{number:users.length}); // 发送给其他人
            }
        });
    })
};

module.exports = socketio;