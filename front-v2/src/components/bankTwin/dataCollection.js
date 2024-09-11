///// JIA XING API

/////////////////////////////////基本信息/////////////////////////////////
const getBasicInfo = () => {
    return [
        { title:'民主沙右缘示范段' },
        { level: 'Ⅰ级' },
        { length: '全长7公里' },
        { quantity: '32台' },
        { time: distanceOpenTime('2024-04-20') }, //持续监测时间
    ]
}
//获取持续监测时间
function distanceOpenTime(showTime) {
      const currentTime = new Date()
      const targetTime = new Date(showTime)
      // 计算时间差（以毫秒为单位）
      const timeDiff = currentTime.getTime() - targetTime.getTime()
      // 将时间差转换为小时、分钟和秒数
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      let ret = `${days} 天`
      return ret
    }
/////////////////////////////////设备状态/////////////////////////////////
//设备类型
const getDeviceType = () => {
    return [
        { name: '位移测量站' },
        { name: '应力桩' },
        { name: '孔隙水应力计' },
        { name: '测斜仪' },
        // { name: '分布式光纤' },
    ]
}

const getDeviceStatus = () => {
    return [
        { name: '位移测量站', count: 10, time: '2024', freq: '10分钟' },
        { name: '应力桩', count: 7, time: '2024', freq: '1分钟' },
        { name: '孔隙水压力计', count: 9, time: '2024', freq: '1小时' },
        { name: '测斜仪', count: 9, time: '2024', freq: '1小时' },
        { name: '分布式光纤', count: 1, time: '2024', freq: '1小时' },//分布式光纤的更新频率暂不确定
        // { name: '视频监控', count: 3, time: '2024', freq: '实时' },
    ]
}


