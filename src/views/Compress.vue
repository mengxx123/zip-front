<template>
    <my-page title="压缩">
        <ui-raised-button label="一键下载" primary @click="download" />
        https://gildas-lormeau.github.io/zip.js/core-api.html#zip-writing
        <div id="container">
            <ol id="demo-container">
                <li>
                    <label>
                        <span class="form-label">choose temporary storage</span>
                        <select id="creation-method-input">
                            <option value="Blob">RAM</option>
                            <option value="File">HDD</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        <span class="form-label">add files into the zip</span>
                        <input type="file" multiple id="file-input">
                    </label>
                </li>
                <li>
                    <span class="form-label">view zip content</span>
                    <ul id="file-list">
                    </ul>
                </li>
                <li>
                    <label>
                        <span class="form-label">set zip file name</span>
                        <input type="text" id="filename-input" value="Example.zip">
                    </label>
                </li>
                <li>
                    <span class="form-label">download the zip file</span>
                    <a id="download-button" href="#">Download</a>
                </li>
            </ol>

        </div>
    
    </my-page>
</template>

<script>
    const obj = window
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

                (function() {
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

                })();
        },
        methods: {
            download() {
                let images = [
                    'http://tool2.yunser.com/asset/img/test1.jpg',
                    'http://tool2.yunser.com/asset/img/test2.jpg',
                    'http://tool2.yunser.com/asset/img/test3.jpg'
                ]
                var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;
                var tmpFilename = "tmp.zip";
                requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
                    function create() {
                        filesystem.root.getFile(tmpFilename, {
                            create : true
                        }, function(zipFile) {
                            let zipFileEntry = zipFile;
                            let writer = new zip.FileWriter(zipFileEntry);
                            writer.add('test1.jpg', 
                                new zip.HttpReader('http://tool2.yunser.com/asset/img/test1.jpg'), function() {
                                    
                                }, function(progress) {

                                });
                        });
                    }

                    filesystem.root.getFile(tmpFilename, null, function(entry) {
                        entry.remove(create, create);
                    }, create);
                });
            }
        }
    }
</script>

<style scoped>
</style>
