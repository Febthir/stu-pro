function getToken(params) {
    var url
    var params
    return new Promise((resolve, reject) => {
        uni.request({
            url,
            method: 'GET',
            complete(res) {
                resolve(res)
            }
        })
    })
}

this.getToken().then(data=>{
    
})
