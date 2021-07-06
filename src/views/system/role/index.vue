<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <div v-if="crud.props.searchToggle">
                <!-- 搜索 -->
                <el-input
                    v-model="query.blurry"
                    size="small"
                    clearable
                    placeholder="输入名称或者描述搜索"
                    style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="crud.toQuery"
                />
                <date-range-picker v-model="query.createTime" class="date-item" />
                <rrOperation />
            </div>
            <crudOperation :permission="permission" />
        </div>
        <!-- 表单渲染 -->
        <el-dialog
            append-to-body
            :close-on-click-modal="false"
            :before-close="crud.cancelCU"
            :visible.sync="crudCU"
            :title="crud.status.title"
            width="520px"
        >
            <el-form
                ref="form"
                :inline="true"
                :model="form"
                :rules="rules"
                size="small"
                label-width="80px"
            >
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" style="width: 380px;" />
                </el-form-item>
                <el-form-item label="角色级别" prop="level">
                    <el-input-number
                        v-model.number="form.level"
                        :min="1"
                        controls-position="right"
                        style="width: 145px;"
                    />
                </el-form-item>
                <el-form-item label="数据范围" prop="dataScope">
                    <el-select
                        v-model="form.dataScope"
                        style="width: 140px"
                        placeholder="请选择数据范围"
                        @change="changeScope"
                    >
                        <el-option
                            v-for="item in dateScopes"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
                    <treeselect
                        v-model="deptDatas"
                        :load-options="loadDepts"
                        :options="depts"
                        multiple
                        style="width: 380px"
                        placeholder="请选择"
                    />
                </el-form-item>
                <el-form-item label="描述信息" prop="description">
                    <el-input
                        v-model="form.description"
                        style="width: 380px;"
                        rows="5"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="crud.cancelCU">取消</el-button>
                <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU"
                    >确认</el-button
                >
            </div>
        </el-dialog>
        <el-row :gutter="15">
            <!--角色管理-->
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span class="role-span">角色列表</span>
                    </div>
                    <el-table
                        ref="table"
                        v-loading="crud.loading"
                        highlight-current-row
                        style="width: 100%;"
                        :data="crud.data"
                        @selection-change="crud.selectionChangeHandler"
                        @current-change="handleCurrentChange"
                    >
                        <el-table-column
                            :selectable="checkboxT"
                            type="selection"
                            width="55"
                            align="center"
                        />
                        <el-table-column
                            v-for="item in roleTableOptions"
                            :key="item.prop"
                            :label="item.label"
                            :prop="item.prop"
                            :width="item.width"
                            :align="item.align"
                            :fixed="item.fixed"
                            :sortable="item.sortable"
                        >
                        </el-table-column>
                        <el-table-column
                            v-if="checkPer(['admin', 'roles:edit', 'roles:del'])"
                            label="操作"
                            width="130px"
                            align="center"
                            fixed="right"
                        >
                            <template slot-scope="scope">
                                <udOperation
                                    v-if="scope.row.level >= level"
                                    :data="scope.row"
                                    :permission="permission"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页组件-->
                    <pagination />
                </el-card>
            </el-col>
            <!-- 菜单授权 -->
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix" style="height:18px">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="选择指定角色分配菜单"
                            placement="top"
                        >
                            <span class="role-span">菜单分配</span>
                        </el-tooltip>
                        <el-button
                            v-permission="['admin', 'roles:edit']"
                            :disabled="!showButton"
                            :loading="menuLoading"
                            icon="el-icon-check"
                            size="mini"
                            style="float: right; padding: 6px 9px;margin-top: -5px;"
                            type="primary"
                            @click="saveMenu"
                            >保存</el-button
                        >
                    </div>
                    <el-tree
                        ref="menu"
                        lazy
                        :data="menus"
                        :default-checked-keys="menuIds"
                        :load="getMenuDatas"
                        :props="defaultProps"
                        check-strictly
                        accordion
                        show-checkbox
                        node-key="id"
                        @check="menuChange"
                    />
                </el-card>
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
// vue-treeselect
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
//api接口
import crudRoles from '@/api/system/role'
import { getMenusTree, getChild } from '@/api/system/menu'
import { getDepts, getSupDepts } from '@/api/system/dept'

// 表头配置
import { roleTableOptions } from '../tableConfig'

const defaultForm = {
    id: null,
    name: null,
    depts: [],
    description: null,
    dataScope: '全部',
    level: 3
}
export default {
    name: 'role',
    directives: { permission },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: {
        ...crudComps,
        DateRangePicker,
        Treeselect
    },
    cruds() {
        return CRUD({
            title: '角色',
            url: 'system/role/getList',
            sort: 'level,asc',
            crudMethod: { ...crudRoles }
        })
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'leaf'
            },
            level: 1,
            currentId: 0,
            menuLoading: false,
            showButton: false,
            menus: [],
            menuIds: [],
            permission: {
                add: ['admin', 'roles:add'],
                edit: ['admin', 'roles:edit'],
                del: ['admin', 'roles:del']
            },
            roleTableOptions,
            dateScopes: ['全部', '本级', '自定义'],
            depts: [],
            deptDatas: [], // 多选时使用
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                permission: [{ required: true, message: '请输入权限', trigger: 'blur' }]
            }
        }
    },
    computed: {
        crudCU() {
            return this.crud.status.cu > 0
        }
    },
    methods: {
        // 列表触发单选
        handleCurrentChange(val) {
            if (val) {
                const _this = this
                // 清空菜单的选中
                this.$refs.menu.setCheckedKeys([])
                // 保存当前的角色id
                this.currentId = val.id
                // 初始化默认选中的key
                this.menuIds = []
                val.menus.forEach(function(data) {
                    _this.menuIds.push(data.id)
                })
                this.showButton = true
            }
        },
        // 单选禁用
        checkboxT(row) {
            return row.level >= this.level
        },
        // 保存菜单
        saveMenu() {
            this.menuLoading = true
            const role = { id: this.currentId, menus: [] }
            // 得到已选中的 key 值
            this.menuIds.forEach(function(id) {
                const menu = { id: id }
                role.menus.push(menu)
            })
            crudRoles
                .editMenu(role)
                .then(() => {
                    this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
                    this.menuLoading = false
                    this.update()
                })
                .catch(err => {
                    this.menuLoading = false
                    console.log(err.response.data.message)
                })
        },
        // 获取菜单树的数据-所有数据
        getMenuDatas(node, resolve) {
            setTimeout(() => {
                getMenusTree(node.data.id ? node.data.id : 0).then(res => {
                    resolve(res.data.content)
                })
            }, 100)
        },
        // 点击菜单树选择框的回调
        menuChange(menu) {
            // 获取该节点的所有子节点，id 包含自身
            getChild(menu.id).then(res => {
                const childIds = res.data.content
                // 判断是否在 menuIds 中，如果存在则删除，否则添加
                if (this.menuIds.indexOf(menu.id) !== -1) {
                    for (let i = 0; i < childIds.length; i++) {
                        const index = this.menuIds.indexOf(childIds[i])
                        if (index !== -1) {
                            this.menuIds.splice(index, 1)
                        }
                    }
                } else {
                    for (let i = 0; i < childIds.length; i++) {
                        const index = this.menuIds.indexOf(childIds[i])
                        if (index === -1) {
                            this.menuIds.push(childIds[i])
                        }
                    }
                }
                this.$refs.menu.setCheckedKeys(this.menuIds)
            })
        },
        // 如果数据权限为自定义则获取部门数据
        changeScope() {
            if (this.form.dataScope === '自定义') {
                this.getDepts()
            }
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
