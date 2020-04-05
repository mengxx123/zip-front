<template>
    <my-page title="压缩" :page="page">
        <div class="common-container container">
            <app-list :data="groups" />
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                groups: [
                    {
                        // name: '文本处理',
                        apps: [
                            {
                                name: '解压',
                                desc: '',
                                icon: 'https://icons.yunser.com/icons/tool.svg',
                                to: '/home2'
                            },
                            {
                                name: '压缩',
                                desc: '',
                                icon: 'https://icons.yunser.com/icons/tool.svg',
                                to: '/compress'
                            },
                            {
                                name: '批量创建文件夹',
                                desc: '',
                                icon: 'https://icons.yunser.com/icons/tool.svg',
                                to: '/createBatch'
                            },
                            {
                                name: '批量创建文件夹2',
                                desc: '',
                                icon: 'https://icons.yunser.com/icons/tool.svg',
                                to: '/createBatchMd'
                            },
                        ]
                    },
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'search',
                            href: 'https://search.yunser.com?utm_source=text',
                            target: '_blank',
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=text',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        computed: {
        },
        mounted() {
        },
        methods: {
            init() {
            },
            fileChange(e) {
            },
            sizeStr: function (size) {
            }
        }
    }
</script>
