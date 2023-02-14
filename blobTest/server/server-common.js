/*
 * @Author: peso12345
 * @LastEditors: peso12345
 * @Date: 2023-02-08 02:29:20
 * @Version: 0.0.1
 * @Description: 本地node服务，批量压缩png jpg图片 
 * @Run: 运行=> node ./server-common.js -f ./intput   输出=> output/intput
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const URL = require('url').URL;
const EventEmitter = require('events');
const err = msg => new EventEmitter().emit('error', msg);

const { getAjaxOptions } = require('./utils/getAjaxOptions');
const { cwd } = require('process');


if (getHelp()) return false;

const TINYIMG_URL = [
    'tinyjpg.com',
    'tinypng.com'
]

const conf = {
    files: [],
    EntryFolder: getEntryFolder(),
    DeepLoop: getDeepLoop(),
    Exts: ['.jpg', '.png'],
    Max: 5200000, // 5MB == 5242848.754299136
}

fileFilter(conf.EntryFolder)

console.log("本次执行脚本的配置：", conf);
console.log("等待处理文件的数量:", conf.files.length)

conf.files.forEach(img => fileUpload(img))

/**
 * 获取帮助命令
 * 指令 -h
 */
function getHelp() {
    let i = process.argv.findIndex(i => i === "-h");
    if (i !== -1) {
        console.log(
            `* 帮助文档
            * -------
            * 
            * 获取帮助
            * 指令 -h
            * 
            * 获取命令执行文件夹 
            * 指令 -f 
            * 参数 ./
            * 必填，待处理的图片文件夹
            * 
            * 获取是否深度递归处理图片文件夹
            * 指令 -deep
            * 可选，默认不深度递归
            * 
            * > node ./tinypng.js -f ./test -deep`
        )
        return true;
    }
}

/**
 * 获取命令执行文件夹 
 * 指令 -f 
 * 参数 ./
 * 必填，待处理的图片文件夹
 */
function getEntryFolder() {
    let i = process.argv.findIndex(i => i === "-f");
    if (i === -1 || !process.argv[i + 1]) return err('获取命令执行文件夹：失败');
    return process.argv[i + 1];
}

/**
 * 获取是否深度递归处理图片文件夹
 * 指令 -deep
 * 可选，默认不深度递归
 */
function getDeepLoop() {
    return process.argv.findIndex(i => i === "-deep") !== -1;
}

/**
 * 过滤待处理文件夹，得到待处理文件列表
 * @param {*} folder 待处理文件夹
 * @param {*} files 待处理文件列表
 */
function fileFilter(folder) {
    // 读取文件夹
    fs.readdirSync(folder).forEach(file => {
        let fullFilePath = path.join(folder, file)
        // 读取文件信息
        let fileStat = fs.statSync(fullFilePath);
        // 过滤文件安全性/大小限制/后缀名
        if (fileStat.size <= conf.Max && fileStat.isFile() && conf.Exts.includes(path.extname(file))) conf.files.push(fullFilePath);
        // 是都要深度递归处理文件夹
        else if (conf.DeepLoop && fileStat.isDirectory()) fileFilter(fullFilePath);
    });
}

/**
 * TinyPng 远程压缩 HTTPS 请求
 * @param {string} img 待处理的文件
 * @success {
 *              "input": { "size": 887, "type": "image/png" },
 *              "output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }
 *           }
 * @error  {"error": "Bad request", "message" : "Request is invalid"}
 */
function fileUpload(imgPath) {
    let req = https.request(getAjaxOptions(TINYIMG_URL), (res) => {
        res.on('data', buf => {
            let obj = JSON.parse(buf.toString());
            if (obj.error) console.log(`压缩失败！\n 当前文件：${imgPath} \n ${obj.message}`);
            else fileUpdate(imgPath, obj);
        });
    });

    req.write(fs.readFileSync(imgPath), 'binary');
    req.on('error', e => console.error(`请求错误! \n 当前文件：${imgPath} \n`, e));
    req.end();
}

// 该方法被循环调用,请求图片数据
function fileUpdate(entryImgPath, obj) {
    const outputDir = path.join(cwd(), 'output');
    console.log('umm00000:', cwd());
    console.log('umm000:', entryImgPath);
    // console.log('umm111:', entryImgPath = entryImgPath.replace(`/${cwd().toString()}/`, ''));
    const entryPath = path.join(cwd(), 'output', conf.EntryFolder.replace(/.\/|..\//, '/'));

    entryImgPath = path.join(cwd(), 'output', entryImgPath.replace(cwd(), ''));
    // conf.EntryFolder.replace(/.\/|..\//,'/')
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    if (!fs.existsSync(entryPath)) {
        fs.mkdirSync(entryPath);
    }


    // console.log('umm:', cwd());
    // console.log('umm1:', outputDir);
    // console.log('umm2:', entryImgPath);
    // console.log('umm3:', conf.EntryFolder.replace(/.\/|..\//, '/'));
    // console.log('umm233333:', process.argv);
    // console.log('EntryFolder:', conf.EntryFolder);

    // 
    let options = new URL(obj.output.url);
    // console.log(`======================`);
    // console.log(obj.output.url); // tinypng的图片下载地址
    // console.log(obj);
    // console.log(options); // 把网址转换成URL对象
    // console.log(`======================`);

    let req = https.request(options, res => {
        let body = '';
        res.setEncoding('binary');
        res.on('data', (data) => body += data);
        res.on('end', () => {
            fs.writeFile(entryImgPath, body, 'binary', err => {
                if (err) return console.error(err);
                let log = '压缩成功';
                log += `优化比例: ${((1 - obj.output.ratio) * 100).toFixed(2)}%`;
                log += ` 原始大小: ${(obj.input.size / 1024).toFixed(2)}KB `;
                log += ` 压缩大小: ${(obj.output.size / 1024).toFixed(2)}KB`;
                log += `文件：${entryImgPath}`;
                console.log(log);
            });
        });
    });
    req.on('error', e => console.error(e));
    req.end();
}

// node ./server-es.js -f ./intput