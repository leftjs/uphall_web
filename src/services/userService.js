/**
 * Created by jason on 4/20/16.
 */
import * as requestService from './request'
import config from '../config'
const urlPrefix = config.domain;


export const req = {
	login: ({username, password}) => {

		storageService.setItem('user', {username, password})
		return requestService.post('/users/login', {
			username,
			password
		}).then(res => {

			return res
		})
	},
	register: ({name, username, password}) => {
		return requestService.post('/users/register',{
			name,
			username,
			password
		}).then(res => {
			return res
		})
	},
	uploadAvatar: ({id,source}) => {

	}

}