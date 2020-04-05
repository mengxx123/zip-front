<template>
    <my-page title="批量创建文件夹" :page="page">
        <div class="common-container container">
            <textarea class="form-control folders" v-model="form.folders" rows="6" placeholder="文件/文件夹名称（一行一个）"></textarea>
            <!-- <h1>
                如果要在IE9和safari中运行需添加， 具体可以参考官网的说明：
                1：并引用这个JS: https://bitbucket.org/lindenlab/llsd/raw/7d2646cd3f9b/js/typedarray.js
            </div> -->
            <!-- <div class="item">
                <ui-radio label="文件夹" name="group" nativeValue="folder" v-model="form.type" class="demo-radio"/>
                <br />
                <ui-radio label="文件" name="group" nativeValue="file" v-model="form.type"  class="demo-radio"/>
            </div> -->
            <!-- <ui-raised-button primary @click="download">下载</ui-raised-button> -->
            <!-- <button @click="download">下载</button> -->
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import JSZip from 'jszip'
    const zip = new JSZip();// 实例化JSZip 
    // const zip = window.zip
    // zip.workerScriptsPath = '/static/zipjs/'
    const saveAs = window.saveAs
    import { parse2Json } from '../util/parser'

    const text = `* 001
* 002
    * a
    * b
        * aa
    * c
* 003`
    function parser(text) {
        let lines = text.split('\n')
        for (let item of lines) {
            let match = item.match(/^(\s*)/)
            console.log('mtach', match[0].length)
        }
    }

    console.log('parser', parser(text))
        console.log('parser', parse2Json(`* 001
* 002
* 003
    * aa
    * bb
    * cc
        * A
* 004
* 005
* 006`))

    export default {
        data () {
            return {
                form: {
                    type: 'folder',
                    folders: `文件夹001
文件夹002
文件夹003
文件夹004
文件夹005
文件夹006
文件夹007
文件夹008
文件夹009
文件夹010
`
                },
                files: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/e5b8c6d0700911ea8cb36ffb40b52694',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            // this.init()
        },
        methods: {
            download(item) {
                let folders = this.form.folders.split('\n').filter(item => item)
                let foldersMap = {}
                for (let folder of folders) {
                    foldersMap[folder] = ''
                }
                for (let folder in foldersMap) {
                    if (this.form.type === 'folder') {
                        zip.folder(folder)
                    } else {
                        zip.file(folder, '123')
                    }
                }
                zip.generateAsync({type: 'blob'}).then(content => {
                    saveAs(content, `${this.form.type === 'folder' ? 'folder' : 'file'}s.zip`)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.item {
    margin-bottom: 16px;
}
textarea.form-control {
    height: auto;
}
.form-control {
    display: block;
    width: 100%;
    max-width: 400px;
    height: 33px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42;
    color: #55595c;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
}
.tip {
    color: #999;
    margin-bottom: 24px;
}
.file-list {
    margin-top: 24px;
    .item {
        margin-bottom: 8px;
    }
    .name {
        cursor: pointer;
    }
}
.folders {
    margin-bottom: 16px;
}
</style>
