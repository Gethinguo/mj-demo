import config from '../config/index.js'

export const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro



/**
 * 节流函数，改写了一下，不知道好不好使，用fun.id  fun.delay 声明参数，这样在调用的时候可以直接 throttle(this.getData, 3000)()
 * 这个节流，在单位时间内连续点了很多次，会触发第一次和最后一次，2次
 * @param fun
 * @param delay
 * @returns {function(...[*]=)}
 */
export function throttle(fun, delay) {
	return function(..._args) {
		let now = +new Date() // 是把new Date() 转为number
		if (fun.last && now < fun.last + delay) {
			clearTimeout(fun.id)
			fun.id = setTimeout(() => {
				fun.last = now
				// fun(..._args)
				fun.apply(this, _args)
			}, delay)
		} else {
			fun.last = now
			// fun(..._args)
			fun.apply(this, _args)
		}
	}
}
/**
 * 节流函数，改写了一下
 * 这个节流，在单位时间内连续点了很多次，会触发第一次，共一次
 * 适用于防止按钮多次点击的时候
 * @param {Object} fun
 * @param {Object} delay
 */
export function throttleOne(fun, delay) {
	return function(..._args) {
		let now = +new Date() // 是把new Date() 转为number
		if (now > (fun.last || 0) + delay) {
			fun.last = now
			fun.apply(this, _args)
		}
	}
}
export const downloadPic = (image_url) => {

}
export const removeNull = (obj) => {
	for (var prop in obj) {
		if (obj[prop] === null) {
			delete obj[prop];
		} else if (typeof obj[prop] === 'object') {
			removeNull(obj[prop]);
		}
	}
	return obj;
}