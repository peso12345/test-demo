/*
 * @Author: peso12345
 * @LastEditors: peso12345
 * @Date: 2023-01-24 20:02:04
 * @Version: 0.0.1
 * @Description: 描述
 */

import { createApp, ref, onMounted, getCurrentInstance } from '../../vue/vue.esm.js';

const app = createApp({
    data() {
        return {
            gogogo: '通过a标签下载文件，可用download属性定义文件名',
            // abc:3,
        }
    },
    setup(props) {
        const btnRef = ref(null)
        const marqueeRef = ref(null)
        const inputpassword = ref(null)
        let showPassword = ref(true)

        let fileUrl = ''

        onMounted(() => {
            btnRef.value.addEventListener('click', () => {
                let str = '这是个str字符串,用来测试url的......';
                // console.log(str);
                const blobVal = new Blob([str], { type: 'text/plain' })
                // console.log(blobVal);

                fileUrl = URL.createObjectURL(blobVal)
                // console.log(fileUrl);

                let aDom = document.createElement('a')
                aDom.setAttribute('href', fileUrl)
                aDom.setAttribute('download', 'xx123.txt')
                aDom.click()
                URL.revokeObjectURL(fileUrl)
            })

            let times = setTimeout(() => {
                marqueeRef.value.setAttribute('direction', 'right')
                console.log(marqueeRef.value.direction);
                setTimeout(() => {
                    marqueeRef.value.direction = 'left'
                    console.log(marqueeRef.value.direction);
                }, 2000);
            }, 3000);

            
        })

        let abc = ref(3)

        const buttons = () => {
            // setTimeout(() => {
            showPassword.value ? inputpassword.value.type = 'text' : inputpassword.value.type = 'password'
            showPassword.value = !showPassword.value
            // }, 2000)
            console.log(showPassword.value);
        }



        // setup函数必须有返回值
        return { btnRef, marqueeRef, inputpassword, buttons, showPassword }
    }
}).mount('#app')

