<template>
    <my-page title="解压">
        <div class="common-container container">
            <!-- <h1>
                如果要在IE9和safari中运行需添加， 具体可以参考官网的说明：
                1：并引用这个JS: https://bitbucket.org/lindenlab/llsd/raw/7d2646cd3f9b/js/typedarray.js
            </div> -->
            <h2 class="tip">在线查看 ZIP 文件</h2>
            <div>
                <input type="file" id="file" @change="onChange($event)">
            </div>
            <ul id="dir">

            </ul>
            <ul class="file-list">
                <li class="item" v-for="item in files" @click="download(item)" :style="{'padding-left': (item.depth * 32) + 'px'}">
                    <div class="name">{{ item.simpleName }}</div>
                </li>
            </ul>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    const zip = window.zip
    zip.workerScriptsPath = '/static/zipjs/'

    export default {
        data () {
            return {
                files: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                let url = 'https://nodeapi.yunser.com/tmp/2019-06-02/1559471491654.zip'
                fetch(url)
                    .then(response => response.blob())
                    // .then(response => {
                    //     if (response.status === 200) {
                    //         console.log('request ok',  response)
                    //         // let blobUrl = window.URL.createObjectURL(blob)
                    //         // this.dealBlob(response.blob())
                    //     } else {
                    //         return Promise.reject(new Error(response.statusText));
                    //     }
                    // })
                    .then(blob => {
                        let blobUrl = window.URL.createObjectURL(blob);
                        // this.dealBlob(blobUrl)
                        // forceDownload(blobUrl, filename);
                    })
            },
            onChange(e) {
                let file = e.target.files[0]
                this.dealBlob(file)
            },
            dealBlob(blob) {
                let unzip = new UnZipArchive(blob)
                this.unzip = unzip
                unzip.getData(() => {
                    let arr = unzip.getEntries()
                    this.files = arr
                    this.files = this.files.sort((a, b) => {
                        return a.filename.localeCompare(b.filename)
                    })
                    this.files = this.files.map(item => {
                        let arr = item.filename.replace(/\/$/, '').split('/')
                        let depth = arr.length
                        let simpleName = arr[arr.length - 1] + (item.directory ? '/' : '')
                        return {
                            ...item,
                            depth,
                            simpleName,
                        }
                    })
                    console.log('files', this.files)
                    // var str = "";
                    // for(var i=0; i<arr.length; i++ ) {
                    //     str += "<li onclick=download('"+arr[i]+"')>"+arr[i]+"</li>"
                    // };
                    // $("#dir").html( str );
                })
            },
            download(item) {
                this.unzip.download(item.filename)
            }
        }
    }
</script>

<style lang="scss" scoped>
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
</style>
