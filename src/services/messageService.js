/**
 * Created by jason on 4/20/16.
 */
import * as requestService from './request'


export const req = {
	postMessage: function ({token,content}){
		return requestService.post('/messages',{
			content
		},{
			"x-token": token
		}).then((res) => {
			return res
		})
},

	getMessages: () => {
		return requestService.get('/messages').then((res) => {
			return res
		})
	}
}