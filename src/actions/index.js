/**
 * Created by jason on 4/19/16.
 */
import * as food from './food'
import * as user from './user'
import * as order from './order'
import * as message from './message'

export default {
	...food,
	...user,
	...order,
	...message
}