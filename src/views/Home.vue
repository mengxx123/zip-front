<template>
    <my-page title="解压">
        <!-- <h1>
        兼容性
    </h1>
    <div>
        <p>
            zip.js可以在所有的chrome浏览器和firefox浏览器中运行， 可以在safari6和IE10，以及IE10以上运行;
        </p>
        <p>
            如果要在IE9和safari中运行需添加， 具体可以参考官网的说明：
        </p>
        <code>
            1：并引用这个JS: https://bitbucket.org/lindenlab/llsd/raw/7d2646cd3f9b/js/typedarray.js
        </code>
    </div> -->

    <h2>在线查看 ZIP 文件</h2>
    <div>
        <input type="file" id="file">
    </div>
    <ul id="dir">

    </ul>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
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
            $("#file").change(function (e) {
            var file = this.files[0];
            window.un = new UnZipArchive( file );
            un.getData( function() {
                var arr = un.getEntries();
                var str = "";
                for(var i=0; i<arr.length; i++ ) {
                    str += "<li onclick=download('"+arr[i]+"')>"+arr[i]+"</li>"
                };
                $("#dir").html( str );
            });
        });
        var download = function ( filename ) {
            un.download( filename );
        };
        }
    }
</script>

<style scoped>
</style>
