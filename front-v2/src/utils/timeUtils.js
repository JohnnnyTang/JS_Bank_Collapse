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
    return {clockTime, clockDate}
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
    for(let i=curHour; i >= (curHour - hour); i-=interval ) {
        if(i < 0) hours.unshift((i+24) + '时')
        else hours.unshift(i + '时')
    }
    return hours
}

export {
    updateTime, getHoursBackIn
}