/**
 * Конвертирует API ключи вида AAA,BBB,CCC (из .env) в массив вида ['AAA', 'BBB', 'CCC']
 * @param string
 */
export function convertApiKeys(string = '') {
    if (typeof string === 'string' && string.length > 0) {
        return string.split(',')
    }
    return []
}

/**
 * Получаем количество минут из миллисекунд
 * @param milliseconds
 * @returns {number}
 */
export function getMinutesFromMilliseconds(milliseconds) {
    return milliseconds / 60 / 1000
}