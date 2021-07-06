<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <div v-if="crud.props.searchToggle">
                <el-input
                    v-model="query.name"
                    clearable
                    size="small"
                    placeholder="输入岗位名称搜索"
                    style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="crud.toQuery"
                />
                <date-range-picker v-model="query.createTime" class="date-item" />
                <el-select
                    v-model="query.enabled"
                    clearable
                    size="small"
                    placeholder="状态"
                    class="filter-item"
                    style="width: 90px"
                    @change="crud.toQuery"
                >
                    <el-option
                        v-for="item in dict.dict.job_status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <rrOperation />
            </div>
            <crudOperation :permission="permission" />
        </div>
        <el-dialog
            append-to-body
            :close-on-click-modal="false"
            :before-close="crud.cancelCU"
            :visible.sync="crudCU"
            :title="crud.status.title"
            width="500px"
        >
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="排序" prop="jobSort">
                    <el-input-number
                        v-model.number="form.jobSort"
                        :min="0"
                        :max="999"
                        controls-position="right"
                        style="width: 370px;"
                    />
                </el-form-item>
                <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
                    <el-radio
                        v-for="item in dict.job_status"
                        :key="item.id"
                        v-model="form.enabled"
                        :label="item.value === 'true'"
                    >
                        {{ item.label }}
                    </el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="crud.cancelCU">
                    取消
                </el-button>
                <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">
                    确认
                </el-button>
            </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="jobSort" label="排序">
                <template slot-scope="scope">
                    {{ scope.row.jobSort }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.enabled"
                        active-color="#409EFF"
                        inactive-color="#F56C6C"
                        @change="changeEnabled(scope.row, scope.row.enabled)"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" />
            <!--   编辑与删除   -->
            <el-table-column
                v-if="checkPer(['admin', 'job:edit', 'job:del'])"
                label="操作"
                width="130px"
                align="center"
                fixed="right"
            >
                <template slot-scope="scope">
                    <udOperation :data="scope.row" :permission="permission" />
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
    </div>
</template>

<script>
import permission from '@/directive/permission'
import crudJob from '@/api/system/job'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
// import { crudOperation, rrOperation, udOperation, pagination } from '@crud'
import crudComps from '@crud'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
    id: null,
    name: '',
    jobSort: 999,
    enabled: true
}
export default {
    name: 'job',
    directives: { permission },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: { ...crudComps, DateRangePicker },
    cruds() {
        return CRUD({
            title: '岗位',
            url: 'system/job/getList',
            sort: ['jobSort,asc', 'id,desc'],
            crudMethod: { ...crudJob }
        })
    },
    dicts: ['job_status', 'user_status'],
    data() {
        return {
            permission: {
                add: ['admin', 'job:add'],
                edit: ['admin', 'job:edit'],
                del: ['admin', 'job:del']
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                jobSort: [
                    { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
                ]
            }
        }
    },

    computed: {
        crudCU() {
            return this.crud.status.cu > 0
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
    text-align: left;
}
</style>
