/**
 * 返回 [start,end] 的整数数字
 */
const RandomNum = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

module.exports = {
    RandomNum
}
