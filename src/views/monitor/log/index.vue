<template>
    <div class="app-container">
        <div class="head-container">
            <div v-if="crud.props.searchToggle">
                <el-input
                    v-model="query.blurry"
                    clearable
                    size="small"
                    placeholder="请输入你要搜索的内容"
                    style="width: 200px;"
                    class="filter-item"
                />
                <date-range-picker v-model="query.createTime" class="date-item" />
                <rrOperation />
            </div>
            <crudOperation>
                <el-button
                    slot="left"
                    class="filter-item"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :loading="crud.delAllLoading"
                    @click="confirmDelAll()"
                >
                    清空
                </el-button>
            </crudOperation>
        </div>
        <!--表格渲染-->
        <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="请求方法">
                            <span>{{ props.row.method }}</span>
                        </el-form-item>
                        <el-form-item label="请求参数">
                            <span>{{ props.row.params }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="requestIp" label="IP" />
            <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="browser" label="浏览器" />
            <el-table-column prop="time" label="请求耗时" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else-if="scope.row.time <= 1000" type="warning"
                        >{{ scope.row.time }}ms</el-tag
                    >
                    <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" width="180px" />
        </el-table>
        <!--分页组件-->
        <pagination />
    </div>
</template>

<script>
import CRUD, { presenter, header, crud } from '@crud/crud'
import crudComps from '@crud'
import DateRangePicker from '@/components/DateRangePicker'

export default {
    name: 'Log',
    components: { ...crudComps, DateRangePicker },
    mixins: [presenter(), header(), crud()],
    cruds() {
        return CRUD({
            url: 'monitor/log/getList',
            title: '操作日志',
            optShow: { download: true }
        })
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.demo-table-expand {
    font-size: 0;
    ::v-deep label {
        width: 70px;
        color: #99a9bf;
    }
    ::v-deep .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
    ::v-deep .el-form-item__content {
        font-size: 12px;
    }
}
</style>
