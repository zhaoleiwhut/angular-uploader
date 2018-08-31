const user = {
    username: 'admin',
    password: 'admin',
};
// let target = 'https://10.67.1.181';
let target = 'http://localhost:8888';
let cookie;
let CSRFToken;

const PROXY_CONFIG = [{
    target: target,
    context: [
        '/uploader',
    ],
    secure: false,
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
        req.headers.referer = target;
        if (cookie && CSRFToken) {
            req.headers.cookie = cookie;
            req.headers['X-CSRFToken'] = CSRFToken;
        }
    }
}]

const querystring = require('querystring');
const crypto = require('crypto');
const sha1 = (str) => {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};
let [protocol, hostname, port] = target.split(/\:\/\/|:/g);

const https = require(protocol); // protocol -> https/http
port = port || (protocol === 'https' ? 443 : 80);

user.password = sha1(user.password); // sha1加密

const login = (cookie) => {
    var contents = querystring.stringify(user);
    const options = {
        hostname: hostname,
        port: port,
        path: '/user/login',
        // path: '/',
        method: 'POST',
        rejectUnauthorized: false,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Content-Length': contents.length,
            cookie: cookie,
            referer: target,
            'X-CSRFToken': CSRFToken,
        }
    };
    options.agent = new https.Agent(options);
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const setCookie = res.headers['set-cookie'] || [''];
            resolve(setCookie[0].split('; ')[0]);
            res.on('data', (d) => {
                // process.stdout.write(d);
            });
        });

        req.write(contents);
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
};

const getSetCookie = () => {
    const options = {
        hostname: hostname,
        port: port,
        path: '/',
        method: 'GET',
        rejectUnauthorized: false,
    };
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const setCookie = res.headers['set-cookie'] || [''];
            resolve(setCookie[0].split('; ')[0]);
            res.on('data', (d) => {
                // process.stdout.write(d);
            });
        }).on('error', (e) => {
            reject(e);
        });
        req.end();
    });
};

getSetCookie()
    .then(data => {
        cookie = data;
        CSRFToken = data.split('=')[1]; // csrftoken=xxxx => xxxx
        return login(data);
    })
    .then(data => {
        cookie += '; ' + data;
        console.log('登录成功');
    })
    .catch(err => {
        console.log('无法登陆');
    });

module.exports = PROXY_CONFIG;
