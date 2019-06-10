<template>
    <my-page title="压缩">
        <div class="common-container container" id="container">
            <ui-article>
                <ol id="demo-container">
                    <li>
                        <label>
                            <span class="form-label">选择 temporary storage</span>
                            <select id="creation-method-input">
                                <option value="Blob">RAM</option>
                                <option value="File">HDD</option>
                            </select>
                        </label>
                    </li>
                    <li>
                        <label>
                            <span class="form-label">上传多个文件</span>
                            <input type="file" multiple id="file-input">
                        </label>
                    </li>
                    <li>
                        <span class="form-label">查看压缩包内容</span>
                        <ul id="file-list">
                        </ul>
                    </li>
                    <li>
                        <label>
                            <span class="form-label">设置压缩包文件名</span>
                            <input type="text" id="filename-input" value="Example.zip">
                        </label>
                    </li>
                    <li>
                        <span class="form-label">下载压缩文件</span>
                        <a id="download-button" href="#">下载</a>
                    </li>
                </ol>
            </ui-article>
            <!-- <ui-raised-button label="一键下载" primary @click="download" /> -->
            <!-- https://gildas-lormeau.github.io/zip.js/core-api.html#zip-writing -->
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    const obj = window
    import simpleZip from '@/util/zip'

    export default {
        data () {
            return {
                page: {
                    fileList: [],
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
            let _this = this
            var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

            function onerror(message) {
                alert(message);
            }

            function createTempFile(callback) {
                var tmpFilename = "tmp.zip";
                requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
                    function create() {
                        filesystem.root.getFile(tmpFilename, {
                            create : true
                        }, function(zipFile) {
                            callback(zipFile);
                        });
                    }

                    filesystem.root.getFile(tmpFilename, null, function(entry) {
                        entry.remove(create, create);
                    }, create);
                });
            }

            var model = (function() {
                var zipFileEntry, zipWriter, writer, creationMethod, URL = obj.webkitURL || obj.mozURL || obj.URL;

                return {
                    setCreationMethod : function(method) {
                        creationMethod = method;
                    },
                    addFiles : function addFiles(files, oninit, onadd, onprogress, onend) {
                        var addIndex = 0;

                        function nextFile() {
                            var file = files[addIndex];
                            onadd(file);
                            zipWriter.add(file.name, new zip.BlobReader(file), function() {
                                addIndex++;
                                if (addIndex < files.length)
                                    nextFile();
                                else
                                    onend();
                            }, onprogress);
                        }

                        function createZipWriter() {
                            zip.createWriter(writer, function(writer) {
                                zipWriter = writer;
                                oninit();
                                nextFile();
                            }, onerror);
                        }

                        if (zipWriter)
                            nextFile();
                        else if (creationMethod == "Blob") {
                            writer = new zip.BlobWriter();
                            createZipWriter();
                        } else {
                            createTempFile(function(fileEntry) {
                                zipFileEntry = fileEntry;
                                writer = new zip.FileWriter(zipFileEntry);
                                createZipWriter();
                            });
                        }
                    },
                    getBlobURL : function(callback) {
                        zipWriter.close(function(blob) {
                            var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
                            callback(blobURL);
                            zipWriter = null;
                        });
                    },
                    getBlob : function(callback) {
                        zipWriter.close(callback);
                    }
                };
            })();

            // initial
            var fileInput = document.getElementById("file-input");
            var zipProgress = document.createElement("progress");
            var downloadButton = document.getElementById("download-button");
            var fileList = document.getElementById("file-list");
            var filenameInput = document.getElementById("filename-input");
            var creationMethodInput = document.getElementById("creation-method-input");
            if (typeof requestFileSystem == "undefined")
                creationMethodInput.options.length = 1;
            model.setCreationMethod(creationMethodInput.value);
            fileInput.addEventListener('change', function() {
                fileInput.disabled = true;
                creationMethodInput.disabled = true;
                model.addFiles(fileInput.files, function() {
                }, function(file) {
                    var li = document.createElement("li");
                    zipProgress.value = 0;
                    zipProgress.max = 0;
                    li.textContent = file.name;
                    li.appendChild(zipProgress);
                    fileList.appendChild(li);
                }, function(current, total) {
                    zipProgress.value = current;
                    zipProgress.max = total;
                }, function() {
                    if (zipProgress.parentNode)
                        zipProgress.parentNode.removeChild(zipProgress);
                    fileInput.value = "";
                    fileInput.disabled = false;
                });
            }, false);
            creationMethodInput.addEventListener('change', function() {
                model.setCreationMethod(creationMethodInput.value);
            }, false);
            downloadButton.addEventListener("click", function(event) {
                var target = event.target, entry;
                if (!downloadButton.download) {
                    if (typeof navigator.msSaveBlob == "function") {
                        model.getBlob(function(blob) {
                            navigator.msSaveBlob(blob, filenameInput.value);
                        });
                    } else {
                        model.getBlobURL(function(blobURL) {
                            var clickEvent;
                            clickEvent = document.createEvent("MouseEvent");
                            clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                            downloadButton.href = blobURL;
                            downloadButton.download = filenameInput.value;
                            downloadButton.dispatchEvent(clickEvent);
                            creationMethodInput.disabled = false;
                            fileList.innerHTML = "";
                        });
                        event.preventDefault();
                        return false;
                    }
                }
            }, false);
        },
        methods: {
            download() {
                let images = [
                    'http://tool2.yunser.com/asset/img/test1.jpg',
                    'http://tool2.yunser.com/asset/img/test2.jpg',
                    'http://tool2.yunser.com/asset/img/test3.jpg'
                ]
                async function f() {
                    await simpleZip.init()
                    console.log('测试')
                    console.log(simpleZip.addUrl)
                    await simpleZip.addUrl('/static/img/test1.jpg', '1.png')
                    let base64 = 'data:image/png;base64,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'
                    await simpleZip.addDataUrl(base64, '2.png')
                    simpleZip.download('hehe.zip')
                }
                f()
            }
        }
    }
</script>

<style scoped>
</style>
