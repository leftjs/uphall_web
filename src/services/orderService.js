/**
 * Created by jason on 4/20/16.
 */
import * as requestService from './request'


export const req = {
	orderFood: ({id,token}) => {
		return requestService.post('/orders/' + id, {}, {
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