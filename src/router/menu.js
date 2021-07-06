let menus = [
    {
        component: 'Layout',
        hidden: false,
        meta: {
            icon: 'system',
            noCache: true,
            title: '系统管理'
        },
        name: '系统管理',
        path: '/system',
        alwaysShow: true,
        redirect: 'noredirect',
        children: [
            {
                component: 'system/user/index',
                hidden: false,
                meta: {
                    icon: 'peoples',
                    noCache: true,
                    title: '用户管理'
                },
                name: 'User',
                path: 'user'
            },
            {
                component: 'system/role/index',
                hidden: false,
                meta: {
                    icon: 'role',
                    noCache: true,
                    title: '角色管理'
                },
                name: 'Role',
                path: 'role'
            },
            {
                component: 'system/menu/index',
                hidden: false,
                meta: {
                    icon: 'menu',
                    noCache: true,
                    title: '菜单管理'
                },
                name: 'Menu',
                path: 'menu'
            },
            {
                component: 'system/dept/index',
                hidden: false,
                meta: {
                    icon: 'dept',
                    noCache: true,
                    title: '部门管理'
                },
                name: 'Dept',
                path: 'dept'
            },
            {
                component: 'system/job/index',
                hidden: false,
                meta: {
                    icon: 'Steve-Jobs',
                    noCache: true,
                    title: '岗位管理'
                },
                name: 'Job',
                path: 'job'
            },
            {
                component: 'system/dict/index',
                hidden: false,
                meta: {
                    icon: 'dictionary',
                    noCache: true,
                    title: '字典管理'
                },
                name: 'Dict',
                path: 'dict'
            },
            {
                component: 'system/timing/index',
                hidden: false,
                meta: {
                    icon: 'timing',
                    noCache: true,
                    title: '任务调度'
                },
                name: 'Timing',
                path: 'timing'
            }
        ]
    }
]
