/*
 * @Author: peso12345
 * @LastEditors: peso12345
 * @Date: 2023-02-02 20:01:53
 * @Version: 0.0.1
 * @Description: 图片上传下载，随机ip
 */

const Https = require('https');
const Url = require('url')

const Fs = require('fs');
const Path = require('path');
const Chalk = require('chalk')
const EventEmitter = require('events')
const err = msg => new EventEmitter().emit('error', msg)

if (getHelp()) return false

const conf = {
    files: [],
    entryFolder: getEntryFolder(),
    DeepLoop: getDeepLoop(),
    Exts: ['.jpg', 'png', '.webp'],
    Max: 5200000, // 5MB
}

fileFilter(conf.entryFolder)
console.log('本次执行脚本的配置：',conf);
console.log('等待处理文件的数量：',conf.files.length);

conf.files.forEach(img=>filload)

/**
 * 获取帮助命令
 * 指令 -h
 */
function getHelp() {
    let i = process.argv.findIndex(i => i === '-h')
    console.log(i);
    if (i !== -1) {
        return true
    }
}

/**
 * 过滤文件
 */

function fileFilter(folder) {
    // 读取文件夹
    Fs.readdirSync(folder).forEach(file=>{
        let fullFilePath = path.join()
    })
        
}

/**
 * tinypng https
 */
function fileUpload(imgpath) {
    let req = Https.request(getAjaxOptions(),res=>{
        res
    })
}

/**
 *  获取随机整数，限定范围
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
const RandomNum = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}
// console.log(RandomNum(0,1));

/**
 * hostname列表
 */
const TINYIMG_URL = [
    'tinyjpg.com',
    'tinypng.com'
]


/**
 * 随机ip 请求头
 * @returns 
 */
function RandomHeader() {
    // fill(0) 填充0到数组
    const ip = new Array(4).fill(0).map(() => parseInt(Math.random() * 255)).join('.')
    // console.log(ip);

    const index = RandomNum(0, 1)
    return {
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            "Postman-Token": Date.now(),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
            "X-Forwarded-For": ip
        },
        hostname: TINYIMG_URL[index],
        method: "POST",
        path: '/web/shrink',
        rejectUnauthorized: false
    }
}
// RandomHeader()
/**
 * 上传图片
 * @param {*} file 
 * @returns 
 */
function UploadImg(file) {
    const opts = RandomHeader()
    return new Promise((resolve, reject) => {
        const req = Https.request(opts, res => res.on('data', data => {
            const obj = JSON.parse(data.tostring())
            obj.error ? reject(obj.message) : resolve(obj)
        }))
        req.write(file, 'binary')
        req.on('error', e => reject(e))
        req.end()
    })
}
/**
 * 下载图片
 * @param {*} url 
 * @returns 
 */
function DownloadImg(url) {
    const opts = new Url.URL(url)
    return new Promise((resolve, reject) => {
        const req = Https.request(opts, res => {
            let file = ''
            res.setEncoding('binary')
            res.on('data', chunk => file += chunk)
            res.on('end', () => resolve(file))
        })
        req.on('error', e => reject(e))
        req.end()
    })
}