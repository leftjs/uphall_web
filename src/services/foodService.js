/**
 * Created by jason on 4/20/16.
 */
import * as requestService from './request'
import config from '../config';

const urlPrefix = config.domain;




export const req = {

	likeFood: ({id}) => {
		return requestService.get('/foods/' + id + '/like').then((res) => {
			return res
		})
	},

	getFoods: () => {
		return requestService.get('/foods').then((res) => {
			return res

		})
	},
	publishFood: (body,{source}) => {

	}


}