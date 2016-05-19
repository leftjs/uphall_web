/**
 * Created by jason on 4/20/16.
 */
import * as requestService from './request'


export const req = {
	orderFood: ({id,token,orderTime}) => {
		return requestService.post('/orders/' + id, {
			orderTime: orderTime
		}, {
			'x-token': token
		})

	},

	getOrderByUserId: (id) => {
		return requestService.get('/orders/' + id)
		.then((res) => {
			return res
		})
	}
}