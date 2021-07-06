<template>
    <div
        v-loading="!show"
        element-loading-text="数据加载中..."
        :style="!show ? 'height: 500px' : 'height: 100%'"
        class="app-container"
    >
        <div v-if="show">
            <el-card class="box-card">
                <div class="sys-box" style="color: #666;font-size: 13px;">
                    <svg-icon icon-class="system" style="margin-right: 5px" />
                    <span> 系统：{{ data.sys.os }} </span>
                    <span> IP：{{ data.sys.ip }} </span>
                    <span> 项目已不间断运行：{{ data.sys.day }} </span>
                    <i class="el-icon-refresh" style="margin-left: 40px" @click="init" />
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-weight: bold;color: #666;font-size: 15px">状态</span>
                </div>
                <div>
                    <el-col
                        v-for="item in gaugeConfig"
                        :key="item.key"
                        :xs="24"
                        :sm="24"
                        :md="12"
                        :lg="6"
                        :xl="6"
                        style="margin-bottom: 10px"
                    >
                        <div class="title">{{ item.name }}</div>
                        <div class="content">
                            <el-tooltip placement="top-end">
                                <div slot="content" style="font-size: 12px;line-height:20px">
                                    <template v-if="item.key == 'cpu'">
                                        {{ data.cpu.name }}<br />
                                        {{ data.cpu.package }}<br />
                                        {{ data.cpu.core }}<br />
                                        {{ data.cpu.logic }}
                                    </template>
                                    <template v-if="item.key == 'memory'">
                                        总量：{{ data.memory.total }}<br />
                                        已使用：{{ data.memory.used }}<br />
                                        空闲：{{ data.memory.available }}<br />
                                    </template>
                                    <template v-if="item.key == 'swap'">
                                        总量：{{ data.swap.total }}<br />
                                        已使用：{{ data.swap.used }}<br />
                                        空闲：{{ data.swap.available }}<br />
                                    </template>
                                    <template v-if="item.key == 'disk'">
                                        总量：{{ data.disk.total }}<br />
                                        空闲：{{ data.disk.available }}<br />
                                    </template>
                                </div>
                                <v-chart autoresize :option="bulidOption(item)" />
                            </el-tooltip>
                        </div>
                        <div class="footer">
                            <span v-if="item.key == 'cpu'">{{ data.cpu.coreNumber }} 核心</span>
                            <span v-if="item.key == 'memory'">
                                {{ data.memory.used }} / {{ data.memory.total }}
                            </span>
                            <span v-if="item.key == 'swap'">
                                {{ data.swap.used }} / {{ data.swap.total }}
                            </span>
                            <span v-if="item.key == 'disk'">
                                {{ data.disk.used }} / {{ data.disk.total }}
                            </span>
                        </div>
                    </el-col>
                </div>
            </el-card>
            <div>
                <el-row :gutter="6">
                    <el-col
                        :xs="24"
                        :sm="24"
                        :md="12"
                        :lg="12"
                        :xl="12"
                        style="margin-bottom: 10px"
                    >
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-weight: bold;color: #666;font-size: 15px"
                                    >CPU使用率监控</span
                                >
                            </div>
                            <div class="content2">
                                <v-chart autoresize :option="cpuInfo" />
                            </div>
                        </el-card>
                    </el-col>
                    <el-col
                        :xs="24"
                        :sm="24"
                        :md="12"
                        :lg="12"
                        :xl="12"
                        style="margin-bottom: 10px"
                    >
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-weight: bold;color: #666;font-size: 15px"
                                    >内存使用率监控</span
                                >
                            </div>
                            <div class="content2">
                                <v-chart autoresize :option="memoryInfo" />
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { initData } from '@/api/data'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, PolarComponent, GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import VChart, { THEME_KEY } from 'vue-echarts'
import lodash from 'lodash'
import { parseTime } from '@/utils'
use([
    CanvasRenderer,
    LineChart,
    GaugeChart,
    TitleComponent,
    TooltipComponent,
    PolarComponent,
    GridComponent
])
export default {
    name: 'Server',
    components: { VChart },
    provide: { [THEME_KEY]: 'light' },
    data() {
        return {
            show: false,
            monitor: null,
            url: 'monitor/server/getInfo',
            data: {},
            gaugeConfig: [
                { name: 'CPU使用率', key: 'cpu' },
                { name: '内存使用率', key: 'memory' },
                { name: '交换区使用率', key: 'swap' },
                { name: '磁盘使用率', key: 'disk' }
            ],
            $_handleResize: null,
            cpuInfo: {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 100,
                    interval: 20
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        areaStyle: {
                            normal: {
                                color: 'rgb(32, 160, 255)' // 改变区域颜色
                            }
                        },
                        itemStyle: {
                            color: '#6fbae1',
                            lineStyle: {
                                color: '#6fbae1' // 改变折线颜色
                            }
                        }
                    }
                ]
            },
            memoryInfo: {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 100,
                    interval: 20
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        areaStyle: {
                            normal: {
                                color: 'rgb(32, 160, 255)' // 改变区域颜色
                            }
                        },
                        itemStyle: {
                            color: '#6fbae1',
                            lineStyle: {
                                color: '#6fbae1' // 改变折线颜色
                            }
                        }
                    }
                ]
            }
        }
    },
    created() {
        this.init()
        this.monitor = window.setInterval(() => {
            setTimeout(() => {
                this.init()
            }, 2)
        }, 5000)
    },
    destroyed() {
        clearInterval(this.monitor)
    },
    mounted() {
        this.handleResize()
    },
    activated() {
        if (!this.$_handleResize) {
            this.handleResize()
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$_handleResize)
        this.$_handleResize = null
    },
    deactivated() {
        window.removeEventListener('resize', this.$_handleResize)
        this.$_handleResize = null
    },
    methods: {
        init() {
            initData(this.url, {}).then(res => {
                this.data = res.data
                this.show = true
                if (this.cpuInfo.xAxis.data.length >= 8) {
                    this.cpuInfo.xAxis.data.shift()
                    this.memoryInfo.xAxis.data.shift()
                    this.cpuInfo.series[0].data.shift()
                    this.memoryInfo.series[0].data.shift()
                }
                this.cpuInfo.xAxis.data.push(parseTime(new Date(res.data.time), '{h}:{i}:{s}'))
                this.memoryInfo.xAxis.data.push(parseTime(new Date(res.data.time), '{h}:{i}:{s}'))
                this.cpuInfo.series[0].data.push(parseFloat(res.data.cpu.used))
                this.memoryInfo.series[0].data.push(parseFloat(res.data.memory.usageRate))
            })
        },
        handleResize() {
            this.$_handleResize = lodash.debounce(() => {
                let contents = document.getElementsByClassName('content')
                let content2s = document.getElementsByClassName('content2')
                const boxWidth = document.getElementsByClassName('box-card')[1]
                // const allContents = [...Array.from(contents), ...Array.from(content2s)]

                Array.from(contents).forEach(item => {
                    let width = item.clientWidth
                    let height = (width * 2) / 3
                    if (boxWidth >= 992) {
                        item.style.height = height + 'px'
                    }
                })
                Array.from(content2s).forEach(item => {
                    let width = item.clientWidth
                    let height = (width * 2) / 3
                    item.style.height = height + 'px'
                })
            }, 1000)
            window.addEventListener('resize', this.$_handleResize)
        },
        bulidOption(item) {
            let options = {
                series: [
                    {
                        name: item.name,
                        type: 'gauge',
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}',
                            color: 'inherit',
                            fontSize: '24'
                        },
                        data: [{ value: 0 }],
                        axisLine: {
                            lineStyle: {
                                width: 12,
                                color: [
                                    [0.3, '#67e0e3'],
                                    [0.7, '#37a2da'],
                                    [1, '#fd666d']
                                ]
                            }
                        },
                        axisTick: {
                            distance: -12,
                            length: 6,
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        splitLine: {
                            distance: -12,
                            length: 12,
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        axisLabel: {
                            color: 'inherit',
                            distance: 16
                            // fontSize: 20
                        }
                    }
                ]
            }
            switch (item.key) {
                case 'cpu':
                    options.series[0].data[0].value = this.data.cpu.used
                    break
                case 'memory':
                    options.series[0].data[0].value = this.data.memory.usageRate
                    break
                case 'swap':
                    options.series[0].data[0].value = this.data.swap.usageRate
                    break
                case 'disk':
                    options.series[0].data[0].value = this.data.disk.usageRate
                    break
            }
            return options
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
    margin-bottom: 5px;
    .sys-box {
        span {
            margin-right: 28px;
        }
    }
    .el-icon-refresh {
        margin-right: 10px;
        float: right;
        cursor: pointer;
    }
}
.cpu,
.memory,
.swap,
.disk {
    width: 20%;
    float: left;
    padding-bottom: 20px;
    margin-right: 5%;
}
.title {
    text-align: center;
    font-size: 16px;
    font-weight: 550;
    color: #999;
    // margin-bottom: 16px;
}
.footer {
    text-align: center;
    font-size: 16px;
    font-weight: 550;
    color: #999;
    margin-top: -5px;
    margin-bottom: 10px;
}
.content {
    height: 270px;
    margin: 0 auto;
    // text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
}
.content2 {
    height: 400px;
}
</style>
