<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--侧边部门数据-->
            <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
                <div class="head-container">
                    <el-input
                        v-model="deptName"
                        clearable
                        size="small"
                        placeholder="输入部门名称搜索"
                        prefix-icon="el-icon-search"
                        class="filter-item"
                        @input="getDeptDatas"
                    />
                </div>
                <el-tree
                    :data="deptDatas"
                    :load="getDeptDatas"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    lazy
                    @node-click="handleNodeClick"
                />
            </el-col>
            <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
                <div class="head-container">
                    <div v-if="crud.props.searchToggle">
                        <!-- 搜索 -->
                        <el-input
                            v-model="query.blurry"
                            clearable
                            size="small"
                            placeholder="输入名称或者邮箱搜索"
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
                                v-for="item in enabledTypeOptions"
                                :key="item.key"
                                :label="item.display_name"
                                :value="item.key"
                            />
                        </el-select>
                        <rrOperation />
                    </div>
                    <crudOperation show="" :permission="permission" />
                </div>
                <!--表单渲染-->
                <el-dialog
                    append-to-body
                    :close-on-click-modal="false"
                    :before-close="crud.cancelCU"
                    :visible.sync="crudCU"
                    :title="crud.status.title"
                    width="570px"
                >
                    <el-form
                        ref="form"
                        :inline="true"
                        :model="form"
                        :rules="rules"
                        size="small"
                        label-width="66px"
                    >
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" />
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model.number="form.phone" />
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickName">
                            <el-input v-model="form.nickName" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" />
                        </el-form-item>
                        <el-form-item label="部门" prop="dept.id">
                            <treeselect
                                v-model="form.dept.id"
                                :options="depts"
                                :load-options="loadDepts"
                                style="width: 178px"
                                placeholder="选择部门"
                            />
                        </el-form-item>
                        <el-form-item label="岗位" prop="jobs">
                            <el-select
                                v-model="jobDatas"
                                style="width: 178px"
                                multiple
                                placeholder="请选择"
                                @remove-tag="deleteTag"
                                @change="changeJob"
                            >
                                <el-option
                                    v-for="item in jobs"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio-group v-model="form.gender" style="width: 178px">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-radio-group
                                v-model="form.enabled"
                                :disabled="form.id === userInfo.id"
                            >
                                <el-radio
                                    v-for="item in dict.user_status"
                                    :key="item.id"
                                    :label="item.value"
                                    >{{ item.label }}</el-radio
                                >
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
                            <el-select
                                v-model="roleDatas"
                                style="width: 437px"
                                multiple
                                placeholder="请选择"
                                @remove-tag="deleteTag"
                                @change="changeRole"
                            >
                                <el-option
                                    v-for="item in roles"
                                    :key="item.name"
                                    :disabled="level !== 1 && item.level <= level"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="text" @click="crud.cancelCU">取消</el-button>
                        <el-button
                            :loading="crud.status.cu === 2"
                            type="primary"
                            @click="crud.submitCU"
                            >确认</el-button
                        >
                    </div>
                </el-dialog>
                <el-table
                    ref="table"
                    v-loading="crud.loading"
                    :data="crud.data"
                    style="width: 100%;"
                    @selection-change="crud.selectionChangeHandler"
                >
                    <el-table-column
                        :selectable="checkboxT"
                        type="selection"
                        width="55"
                        align="center"
                    />
                    <el-table-column
                        v-for="item in userTableOptions"
                        :key="item.prop"
                        :label="item.label"
                        :prop="item.prop"
                        :width="item.width"
                        :align="item.align"
                        :fixed="item.fixed"
                        :sortable="item.sortable"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'dept'">{{ scope.row.dept.name }}</span>
                            <el-switch
                                v-else-if="item.prop == 'enabled'"
                                v-model="scope.row.enabled"
                                :disabled="userInfo.id === scope.row.id"
                                active-color="#409EFF"
                                inactive-color="#F56C6C"
                                @change="changeEnabled(scope.row, scope.row.enabled)"
                            />
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="checkPer(['admin', 'user:edit', 'user:del'])"
                        label="操作"
                        width="125"
                        align="center"
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            <udOperation
                                :data="scope.row"
                                :permission="permission"
                                :disabled-dle="scope.row.id === userInfo.id"
                            />
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import permission from '@/directive/permission'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
// import { crudOperation, rrOperation, udOperation, pagination } from '@crud'
import crudComps from '@crud'
import DateRangePicker from '@/components/DateRangePicker'
import crudUser from '@/api/system/user'
import { getDepts, getSupDepts } from '@/api/system/dept'
import { userTableOptions } from '../tableConfig'
import { mapGetters } from 'vuex'
import { validPhone } from '@/utils/validate'
// vue-treeselect
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

const defaultForm = {
    id: null,
    username: null,
    nickName: null,
    gender: '男',
    email: null,
    enabled: 'false',
    roles: [],
    jobs: [],
    dept: { id: null },
    phone: null
}
export default {
    name: 'user',
    directives: { permission },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: {
        ...crudComps,
        DateRangePicker,
        Treeselect
    },
    cruds() {
        return CRUD({
            title: '用户',
            url: 'system/user/getList',
            crudMethod: { ...crudUser }
        })
    },
    data() {
        return {
            deptName: '', //左侧部门树形图搜索条件
            depts: [],
            deptDatas: [],
            jobs: [],
            roles: [],
            jobDatas: [],
            roleDatas: [], // 多选时使用
            defaultProps: {
                // tree组件懒加载默认参数
                children: 'children',
                label: 'name',
                isLeaf: 'leaf'
            },
            permission: {
                add: ['admin', 'user:add'],
                edit: ['admin', 'user:edit'],
                del: ['admin', 'user:del']
            },
            enabledTypeOptions: [
                { key: 'true', display_name: '激活' },
                { key: 'false', display_name: '锁定' }
            ],
            dict: {
                user_status: [
                    { id: 1, value: '1', label: '激活' },
                    { id: 2, value: '2', label: '禁用' }
                ]
            },
            userTableOptions,
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 20,
                        message: '长度在 2 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                nickName: [
                    {
                        required: true,
                        message: '请输入用户昵称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 20,
                        message: '长度在 2 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: 'blur'
                    }
                ],
                phone: [{ required: true, trigger: 'blur', validator: validPhone }]
            }
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
        crudCU() {
            return this.crud.status.cu > 0
        }
    },
    methods: {
        // 新增与编辑前做的操作
        [CRUD.HOOK.afterToCU](crud, form) {
            if (form.dept.id) {
                this.getSupDepts(form.dept.id)
            } else {
                this.getDepts()
            }
        },
        // 获取左侧部门数据
        getDeptDatas(node, resolve) {
            const sort = 'id,desc'
            const params = { sort: sort, pid: '' }
            if (typeof node !== 'object') {
                if (node) {
                    params['name'] = node
                }
            } else if (node.level !== 0) {
                params['pid'] = node.data.id
            }
            setTimeout(() => {
                getDepts(params).then(res => {
                    if (resolve) {
                        resolve(res.data.content)
                    } else {
                        this.deptDatas = res.data.content
                    }
                })
            }, 100)
        },
        // 获取弹窗内部门数据
        getDepts() {
            getDepts({ enabled: true }).then(res => {
                this.depts = res.data.content.map(obj => {
                    if (obj.hasChildren) {
                        obj.children = null
                    }
                    return obj
                })
            })
        },
        //编辑时获取弹窗内部门数据
        getSupDepts(deptId) {
            getSupDepts({ pid: deptId }).then(res => {
                const data = res.data.content
                this.buildDepts(data)
                this.depts = data
            })
        },
        // 构建部门树组件数据
        buildDepts(depts) {
            depts.forEach(data => {
                if (data.children) {
                    this.buildDepts(data.children)
                }
                if (data.hasChildren && !data.children) {
                    data.children = null
                }
            })
        },
        // 异步加载部门树数据
        loadDepts({ action, parentNode, callback }) {
            if (action === LOAD_CHILDREN_OPTIONS) {
                getDepts({ enabled: true, pid: parentNode.id }).then(res => {
                    parentNode.children = res.data.content.map(function(obj) {
                        if (obj.hasChildren) {
                            obj.children = null
                        }
                        return obj
                    })
                    setTimeout(() => {
                        callback()
                    }, 200)
                })
            }
        },
        // 切换部门
        handleNodeClick(data) {
            if (data.pid === 0) {
                this.query.deptId = null
            } else {
                this.query.deptId = data.id
            }
            this.crud.toQuery()
        },
        checkboxT(row, rowIndex) {
            return row.id !== this.userInfo.id
        },
        // 改变状态
        changeEnabled(data, val) {
            this.$confirm(
                '此操作将 "' +
                    this.dict.label.user_status[val] +
                    '" ' +
                    data.username +
                    ', 是否继续？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(() => {
                    crudUser
                        .edit(data)
                        .then(res => {
                            this.crud.notify(
                                this.dict.label.user_status[val] + '成功',
                                CRUD.NOTIFICATION_TYPE.SUCCESS
                            )
                        })
                        .catch(() => {
                            data.enabled = !data.enabled
                        })
                })
                .catch(() => {
                    data.enabled = !data.enabled
                })
        },
        deleteTag(value) {
            userRoles.forEach(function(data, index) {
                if (data.id === value) {
                    userRoles.splice(index, value)
                }
            })
        },
        changeJob(value) {
            userJobs = []
            value.forEach(function(data, index) {
                const job = { id: data }
                userJobs.push(job)
            })
        },
        changeRole(value) {
            userRoles = []
            value.forEach(function(data, index) {
                const role = { id: data }
                userRoles.push(role)
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
}
</style>
