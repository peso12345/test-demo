const { RandomNum } = require('./getRandom');
/**
 * TinyPng 远程压缩 HTTPS 请求的配置生成方法
 * hostname:'tinypng.com'
 */
function getAjaxOptions(hostname) {
    return {
        method: 'POST',
        hostname: hostname[RandomNum(0, 1)],
        path: '/web/shrink',
        headers: {
            rejectUnauthorized: false,
            "X-Forwarded-For": Array(4).fill(1).map(() => parseInt(Math.random() * 254 + 1)).join('.'),
            'Postman-Token': Date.now(),
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
        }
    }
}

module.exports = {
    getAjaxOptions
}