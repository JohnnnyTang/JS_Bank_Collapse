var week = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
]

function updateTime() {
    var cd = new Date()
    let clockTime =
        zeroPadding(cd.getHours(), 2) +
        ':' +
        zeroPadding(cd.getMinutes(), 2) +
        ':' +
        zeroPadding(cd.getSeconds(), 2)
    let clockDate =
        zeroPadding(cd.getFullYear(), 4) +
        '-' +
        zeroPadding(cd.getMonth() + 1, 2) +
        '-' +
        zeroPadding(cd.getDate(), 2) +
        ' ' +
        week[cd.getDay()]
    return { clockTime, clockDate }
}
function zeroPadding(num, digit) {
    var zero = ''
    for (var i = 0; i < digit; i++) {
        zero += '0'
    }
    return (zero + num).slice(-digit)
}

function getCurrentHour() {
    var cd = new Date()
    let h = cd.getHours()
    return h
}

function getHoursBackIn(hour, interval) {
    let curHour = getCurrentHour()
    let hours = []
    for (let i = curHour; i >= curHour - hour; i -= interval) {
        if (i < 0) hours.unshift(i + 24 + '时')
        else hours.unshift(i + '时')
    }
    return hours
}

function getNDateBefore(n) {
    let dates = []

    // 获取当前日期
    // let currentDate = new Date()
    // let currentYear = currentDate.getFullYear()
    // let currentMonth = currentDate.getMonth() + 1 // 月份从0开始，需要加1
    // let currentDay = currentDate.getDate()
    // dates.push(
    //     `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
    // )
    let currentDate = new Date()
    dates.push(
        `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    )
    for (let i = 1; i < n; i++) {
        // 获取当前日期的年、月、日
        
        let currentYear = currentDate.getFullYear()
        let currentMonth = currentDate.getMonth() + 1 // 月份从0开始，需要加1
        let currentDay = currentDate.getDate()
        // 计算15天前的日期
        let fifteenDaysAgoDay = currentDay - 15
        let fifteenDaysAgoMonth = currentMonth
        let fifteenDaysAgoYear = currentYear

        // 如果15天前的日期小于1
        if (fifteenDaysAgoDay < 1) {
            // 获取上个月的总天数
            let lastMonth = new Date(currentYear, currentMonth - 1, 0)
            let daysInLastMonth = lastMonth.getDate()

            // 计算15天前的日期在上个月的日期
            fifteenDaysAgoDay = daysInLastMonth + fifteenDaysAgoDay
            fifteenDaysAgoMonth--

            // 如果计算后的月份小于1，需要调整年份和月份
            if (fifteenDaysAgoMonth < 1) {
                fifteenDaysAgoMonth = 12
                fifteenDaysAgoYear--
            }
        }

        // 格式化日期为 "YYYY-MM-DD" 的字符串
        let formattedMonth = String(fifteenDaysAgoMonth).padStart(2, '0')
        let formattedDay = String(fifteenDaysAgoDay).padStart(2, '0')

        let fifteenDaysAgo = `${fifteenDaysAgoYear}-${formattedMonth}-${formattedDay}`

        // 将15天前的日期添加到数组中
        dates.push(fifteenDaysAgo)

        // 更新当前日期为15天前
        currentDate.setDate(fifteenDaysAgoDay)
        currentDate.setMonth(fifteenDaysAgoMonth - 1) // 月份从0开始，需要减1
        currentDate.setFullYear(fifteenDaysAgoYear)
    }

    return dates
}

function getDatesBefore(n) {
    let dates = []

    // 获取当前日期
    // let currentDate = new Date()
    // let currentYear = currentDate.getFullYear()
    // let currentMonth = currentDate.getMonth() + 1 // 月份从0开始，需要加1
    // let currentDay = currentDate.getDate()
    // dates.push(
    //     `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
    // )
    let currentDate = new Date()
    dates.push(
        `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    )
    for (let i = 1; i < n; i++) {
        // 获取当前日期的年、月、日
        
        let currentYear = currentDate.getFullYear()
        let currentMonth = currentDate.getMonth() + 1 // 月份从0开始，需要加1
        let currentDay = currentDate.getDate()
        // 计算15天前的日期
        let fifteenDaysAgoDay = currentDay - 15
        let fifteenDaysAgoMonth = currentMonth
        let fifteenDaysAgoYear = currentYear

        // 如果15天前的日期小于1
        if (fifteenDaysAgoDay < 1) {
            // 获取上个月的总天数
            let lastMonth = new Date(currentYear, currentMonth - 1, 0)
            let daysInLastMonth = lastMonth.getDate()

            // 计算15天前的日期在上个月的日期
            fifteenDaysAgoDay = daysInLastMonth + fifteenDaysAgoDay
            fifteenDaysAgoMonth--

            // 如果计算后的月份小于1，需要调整年份和月份
            if (fifteenDaysAgoMonth < 1) {
                fifteenDaysAgoMonth = 12
                fifteenDaysAgoYear--
            }
        }

        // 格式化日期为 "YYYY-MM-DD" 的字符串
        let formattedMonth = String(fifteenDaysAgoMonth).padStart(2, '0')
        let formattedDay = String(fifteenDaysAgoDay).padStart(2, '0')

        let fifteenDaysAgo = `${formattedMonth}-${formattedDay}`

        // 将15天前的日期添加到数组中
        dates.push(fifteenDaysAgo)

        // 更新当前日期为15天前
        currentDate.setDate(fifteenDaysAgoDay)
        currentDate.setMonth(fifteenDaysAgoMonth - 1) // 月份从0开始，需要减1
        currentDate.setFullYear(fifteenDaysAgoYear)
    }

    return dates.reverse()
}

// 测试函数
let numberOfDates = 5
let fifteenDaysBeforeDates = getNDateBefore(numberOfDates)
console.log('test...', fifteenDaysBeforeDates)

export { updateTime, getHoursBackIn, getDatesBefore }
