const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    size: state => state.app.size,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    userInfo: state => state.user.userInfo,
    permission_routes: state => state.permission.routes,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    errorLogs: state => state.errorLog.logs
}
export default getters
