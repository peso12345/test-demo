

import { createApp, ref, reactive } from '../../vue/vue.esm.js';

const app = createApp({
    data() {
        return {
            types: 'image/*',
            data: {
                info: [],
                length: 0
            },
            size: 0,
            showDialog: false
        }
    },
    created() {

    },
    mounted() {
        let dropbox;

        dropbox = document.getElementById("dropbox");
        dropbox.addEventListener("dragenter", this.dragenter, false);
        dropbox.addEventListener("dragover", this.dragover, false);
        dropbox.addEventListener("drop", this.drop, false);

    },
    methods: {
        handleFiles(e) { // 获取加载的文件信息
            // console.log(e);
            // console.log(e.target.files);
            this.size = 0
            // 释放内存
            this.data = null
            this.$refs.thumbnailRef.innerHTML = ''

            const files = e.target.files
            // 过滤数据
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imageType = /^image\//;
                if (!imageType.test(file.type)) {
                    continue
                }
                this.size += file.size
                const img = document.createElement('img')
                const span = document.createElement('span')
                span.classList.add('line')
                img.classList.add('img-thumbnail')
                img.file = file
                this.$refs.thumbnailRef.appendChild(img)
                this.$refs.thumbnailRef.appendChild(span)

                const reader = new FileReader()
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result
                    }
                })(img)
                reader.readAsDataURL(file)
            }
            // 绑定数据
            this.data = files
            console.log(this.data);
            // 展示数据


        },
        selectFiles() { // 选择文件
            console.log('selectFiles');
            // console.log(this.$refs.filesRef);
            // console.dir(this.$refs.dialogRef);
            // this.showDialog = true
            if (this.$refs.filesRef) {
                // 模拟点击input标签
                this.$refs.filesRef.click()
            } else {
                // 弹出框
                this.showDialog = true
            }
        },
        dragenter(e) {
            console.log('dragenter');
            e.stopPropagation()
            e.preventDefault();
            console.log(e);
        },
        dragover(e) {
            console.log('dragover');
            e.stopPropagation()
            e.preventDefault();
            console.log(e);
        },
        drop(e) {
            console.log('drag');
            e.stopPropagation()
            e.preventDefault();
            console.log(e);

            let dt = e.dataTransfer
            let files = dt.files

            console.log(files);
            let event = {
                target: {
                    files: files
                }
            }
            // let event = {}
            // event.target.files = files
            // console.log(event);

            // var count = files.length;
            // document.getElementById("output").textContent += count;
            this.handleFiles(event)
        },
    },
    beforeUnmount() {
        let dropbox;
        dropbox = document.getElementById("dropbox");
        dropbox.removeEventListener("dragenter", this.dragenter, false);
        dropbox.removeEventListener("dragover", this.dragover, false);
        dropbox.removeEventListener("drop", this.drop, false);
    },
})
app.mount('#app')