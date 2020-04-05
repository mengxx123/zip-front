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
            <ui-raised-button primary @click="download">下载</ui-raised-button>
            <!-- <button @click="download">下载</button> -->
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import JSZip from 'jszip'
    const zip = new JSZip();// 实例化JSZip 
    // const zip = window.zip·1 
    // zip.workerScriptsPath = '/static/zipjs/'
    const saveAs = window.saveAs
    import { parse2Json } from '../util/parser'



    export default {
        data () {
            return {
                form: {
                    type: 'folder',
                    folders: `主科
    语文
    数学
    英语
理科
    物理
    化学
    生物
文科
    政治
    地理
    历史`
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
            // this.download()
        },
        methods: {
            download(item) {
                let folders = this.form.folders.split('\n').filter(item => item).join('\n')
                let json = parse2Json(folders)
                console.log('json', json)
                function eachNodes(nodes, zip) {
                    for (let node of nodes) {
                        let folder = zip.folder(node.text)
                        if (node.children && node.children.length) {
                            // let folder = zip.folder(node.text)
                            eachNodes(node.children, folder)
                        }
                    }
                }
                eachNodes(json, zip)
                // let foldersMap = {}
                // for (let folder of folders) {
                //     foldersMap[folder] = ''
                // }
                // for (let folder in foldersMap) {
                //     if (this.form.type === 'folder') {
                //         zip.folder(folder)
                //     } else {
                //         zip.file(folder, '123')
                //     }
                // }
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
