require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import moment from 'moment'
moment.locale('zh_cn')
import { connect } from 'react-redux';
import {
	ButtonGroup,
	Button,
	ButtonToolbar,
	Navbar,
	Nav,
	NavItem,
	NavDropdown,
	MenuItem,
	Glyphicon,
	Modal,
	Col,
	Form,
	FormGroup,
	FormControl,
	Checkbox,
	ControlLabel,
	Tabs,
	Tab,
	Well,
	ListGroup,
	ListGroupItem,
	Grid,
	Thumbnail,
	Label,
	Image,
	Alert,
	InputGroup
} from 'react-bootstrap'



class AppComponent extends React.Component {

	// 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
	    loginModal: false,
	    registerModal: false,
	    tabSelect: 1,
	    clickTab: null,
	    openDesc: false,
	    loginUsername: '',
	    loginPassword: '',
	    registerUsername: '',
	    registerPassword: '',
	    registerName: '',
	    AlertVisible: false,
	    alertInfo: '',
	    selectedMenu: 'home',
	    upload: {
		    is_recommended: false,
		    is_hot: false,
		    is_breakfast: false,
		    is_lunch: false,
		    is_dinner: false
	    },
	    word: ''
    };
  }

	loginClose = () => {
		this.setState({loginModal:false})
	}

	loginOpen = () => {
		this.setState({loginModal: true})
	}

	registerClose = () => {
		this.setState({registerModal: false})
	}

	registerOpen = () => {
		this.setState({registerModal: true})
	}

	logout = () => {
		this.props.actions.logout({
			resolved: () => {
				this._alertWithInfo("登出成功")
			}
		})
	}

	descClose = () => {
		this.setState({
			clickTab: null,
			openDesc: false
		})
	}

	handleTabSelect = (key) => {
		this.setState({tabSelect: key})
	}

	_renderTabItem = (data) => {

		if (!data){
			return
		}

		const renderArr = []
		for (var key of Object.keys(data)){
			let item = data[key]
			const _itemClick = () => {
				this.setState({
					clickTab: item,
					openDesc: true
				})
			}
			renderArr.push(
				<div className="tabItem" key={key} onClick={_itemClick}>
					<img src={!!item.pic_url ? item.pic_url : "http://lorempixel.com/200/200/"} alt=""/>
					<span className="name">{item.name}</span>
					<span className="price">{item.price}</span>
					<span className="address">{item.address}</span>
					<div><Glyphicon glyph="heart" className="heart"/><span className="like">{item.like}</span></div>
					<div><Glyphicon glyph="list"/><span className="order">{item.orderCount}</span></div>
				</div>
			)
		}
		return renderArr
	}




	_renderDetail = (data) => {

		const likeClick = () => {
			this.props.actions.likeFood({
				id: data._id,
				resolved: () => {
					this.descClose()
					this._alertWithInfo("喜欢成功")
				},
				rejected: () => {
					this.descClose()
					this._alertWithInfo("喜欢失败,请检查您的网络")
				}
			})
		}

		const orderClick = () => {

			if (!this.props.user.token) {
				this.descClose()
				this._alertWithInfo("请您点击右上角按钮进行登录")
				return
			}

			this.props.actions.orderFood({
				id: data._id,
				token: this.props.user.token,
				resolved: () => {
					this.descClose()
					this._alertWithInfo("预定成功,请到订单列表查看")
				},
				rejected: () => {
					this.descClose()
					this._alertWithInfo("预定失败,请检查网络或者是否登录....")
				}
			})
		}
		if (!data) {
			return
		}
		return (
			<Thumbnail className="thumbnail" src={!!data.pic_url ? data.pic_url : 'http://lorempixel.com/250/250/'}>
				<p>
					{!!data.is_breakfast ? (<Label bsStyle="default">早餐</Label>) : null}&nbsp;
					{!!data.is_lunch ? (<Label bsStyle="primary">午餐</Label>) : null}&nbsp;
					{!!data.is_dinner ? (<Label bsStyle="success">晚餐</Label>) : null}&nbsp;
					{!!data.is_hot ? (<Label bsStyle="info">热销</Label>) : null}&nbsp;
					{!!data.is_recommended ? (<Label bsStyle="warning">推荐</Label>) : null}&nbsp;
					{data.discount< 1 ? (<Label bsStyle="danger">折扣</Label>) : null}&nbsp;
				</p>
				<h3>{data.name}</h3>
				<p>{data.description}</p>
				<p>所在地:{data.address}</p>
				<p>折扣率:{data.discount}</p>
				<p>单价:{data.price}</p>
				<p>被收藏:{data.like}次</p>
				<p>预定量:{data.orderCount}次</p>
				<p>
					<Button bsStyle="success" onClick={likeClick}>喜欢</Button>
					<Button bsStyle="info" className="orderBtn" onClick={orderClick}>预定</Button>
				</p>
			</Thumbnail>
		)
	}

	_renderUserInfo = () => {
		const user = this.props.user

		if (!user.name) {
			return (
				<Nav pullRight>
					<NavItem eventKey={1} href="#" onClick={this.loginOpen}>
						<Glyphicon glyph="user"/><span className="iconText">登录</span>
					</NavItem>
					<NavItem eventKey={2} href="#" onClick={this.registerOpen}>
						<Glyphicon glyph="pencil"/><span className="iconText">注册</span>
					</NavItem>
				</Nav>
		)
		} else{
			return (
				<Nav pullRight>
					<NavItem eventKey={1} href="#">
						<img className="avatar" src={!!user.avatar_uri ? user.avatar_uri : 'http://ww2.sinaimg.cn/large/71ae9b51gw1f3v9p7k91tj20cs0cs74t.jpg'}></img>
						<span className="iconText">{user.name}</span>
					</NavItem>
					<NavItem eventKey={2} href="#" onClick={this.logout}>
						<Glyphicon glyph="remove"/><span className="iconText">注销</span>
					</NavItem>
				</Nav>
			)
		}
	}


	_renderLogin = () => {

		const handleLoginUsernameChange = (e) => {
			this.setState({
				loginUsername: e.target.value
			})
		}
		const handleLoginPasswordChange = (e) => {
			this.setState({
				loginPassword: e.target.value
			})
		}
		const login = (e) => {
			e.preventDefault()
			this.props.actions.login({
				username: this.state.loginUsername,
				password: this.state.loginPassword,
				resolved: () => {
					this._alertWithInfo("登录成功")
					this.loginClose()
				},
				rejected: () => {
					alert("登录失败,请检查用户名与密码")
				}
			})
		}
		return (
			<Form horizontal>
				<FormGroup controlId="formHorizontalUsername">
					<Col componentClass={ControlLabel} sm={2} >
						用户名
					</Col>
					<Col sm={10}>
						<FormControl type="text" placeholder="用户名" onChange={handleLoginUsernameChange} />
					</Col>
				</FormGroup>
				<FormGroup controlId="formHorizontalPassword">
					<Col componentClass={ControlLabel} sm={2}>
						密码
					</Col>
					<Col sm={10}>
						<FormControl type="password" placeholder="密码" onChange={handleLoginPasswordChange}/>
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="submit" onClick={login}>
							登录
						</Button>
					</Col>
				</FormGroup>
			</Form>
		)
	}




	_renderRegister = () => {

		const handleRegisterUsernameChange = (e) => {
			this.setState({
				registerUsername: e.target.value
			})
		}

		const handleRegisterPasswordChange = (e) => {
			this.setState({
				registerPassword: e.target.value
			})
		}

		const handleRegisterNameChange = (e) => {
			this.setState({
				registerName: e.target.value
			})
		}

		const register = (e) => {
			e.preventDefault()
			this.props.actions.register({
				username: this.state.registerUsername,
				password: this.state.registerPassword,
				name: this.state.registerName,
				rejected: () => {
					alert("注册失败,请检查您的用户名或者密码")
				},
				resolved: () => {
					this.props.actions.login({
						username: this.state.registerUsername,
						password: this.state.registerPassword,
						rejected: () => {
							alert('注册成功,登录失败,请检查')
						},
						resolved: () => {
							this._alertWithInfo("登录成功")
							this.registerClose()
						}
					})
				}
			})
		}
		return (
			<Form horizontal>
				<FormGroup controlId="formHorizontalUsername">
					<Col componentClass={ControlLabel} sm={2}>
						用户名
					</Col>
					<Col sm={10}>
						<FormControl type="text" placeholder="用户名" onChange={handleRegisterUsernameChange}/>
					</Col>
				</FormGroup>
				<FormGroup controlId="formHorizontalNickname">
					<Col componentClass={ControlLabel} sm={2}>
						昵称
					</Col>
					<Col sm={10}>
						<FormControl type="text" placeholder="昵称" onChange={handleRegisterNameChange}/>
					</Col>
				</FormGroup>
				<FormGroup controlId="formHorizontalPassword">
					<Col componentClass={ControlLabel} sm={2}>
						密码
					</Col>
					<Col sm={10}>
						<FormControl type="password" placeholder="密码" onChange={handleRegisterPasswordChange}/>
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="submit" onClick={register}>
							注册
						</Button>
					</Col>
				</FormGroup>
			</Form>
		)
	}


	_alertWithInfo = (text) => {
		this.setState({
			AlertVisible: true,
			alertInfo: text
		})
	}

	_renderAlert = () => {
		if (!this.state.AlertVisible) {
			return
		}

		setTimeout(() => {
			this.setState({
				AlertVisible: false
			})
		},2000)

		return (
			<Alert bsStyle="warning">
				<strong>通知:</strong> {this.state.alertInfo}
			</Alert>
		)
	}

	_homeClick = () => {
		this.setState({
			selectedMenu: 'home'
		})
	}

	_orderClick = () => {
		this.setState({
			selectedMenu: 'order'
		})
		this.props.actions.getOrderByUserId(this.props.user._id)
	}

	_messageClick = () => {
		this.setState({
			selectedMenu: 'message'
		})

		this.props.actions.getMessages()
	}

	_publishFoodClick = () => {
		this.setState({
			selectedMenu: 'foodPublish'
		})
	}

	_renderHome = () => {
		return (
			<div>
				<Tabs activeKey={this.state.tabSelect} onSelect={this.handleTabSelect} id="controlled-tab-example">
					<Tab eventKey={1} title="全部">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.all,"all")}
						</div>
					</Tab>
					<Tab eventKey={2} title="热销">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.hot,"hot")}
						</div>
					</Tab>
					<Tab eventKey={3} title="推荐">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.recommended,"recommended")}
						</div>
					</Tab>
					<Tab eventKey={4} title="折扣">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.discount,"discount")}
						</div>
					</Tab>
					<Tab eventKey={5} title="早餐">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.breakfast, "breakfast")}
						</div>
					</Tab>
					<Tab eventKey={6} title="午餐">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.lunch, "lunch")}
						</div>
					</Tab>
					<Tab eventKey={7} title="晚餐">
						<div className="mainContainer">
							{this._renderTabItem(this.props.foods.dinner, "dinner")}
						</div>
					</Tab>
				</Tabs>
				<Modal show={this.state.openDesc} onHide={this.descClose}>
					<Modal.Header closeButton>
						<Modal.Title>详情</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this._renderDetail(this.state.clickTab)}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.descClose}>关闭</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}

	_renderOrder = () => {

		var itemsArr = []
		var key = 0
		for (let item of this.props.order) {
			itemsArr.push(
				<ListGroupItem className="orderListItem" key={key++}>
					<img src={!!item.food.pic_url ? item.food.pic_url : "http://lorempixel.com/80/80/"} alt="" className="orderListItemImg"/>
					<div className="orderListItemContent">
						<p className="name">
							{item.food.name}
						</p>
						<p className="price"><strong>单价:</strong>{item.food.price}</p>
						<p className="address"><strong>地址:</strong>{item.food.address}</p>
					</div>
				</ListGroupItem>
			)
		}

		if (!this.props.user.token) {
			return (
				<div><Well bsSize="large">您尚未登录,赶快登录吧~~~~~</Well></div>
			)
		}

		if (itemsArr.length === 0) {
			return (
				<div><Well bsSize="large">您的订单里空空入也,赶快去下订单吧~~~~~~~~~</Well></div>
			)
		}

		return (
				<ListGroup>
					{itemsArr}
				</ListGroup>
		)
	}

	/**
	 * 消息界面的渲染
	 * @private
	 */
	_renderMessage = () => {


		const handleMessageChange = (e) => {
			this.setState({
				word: e.target.value
			})
		}

		const sendClick = () => {

			if (!this.props.user.token) {
				this._alertWithInfo("请您先登录")
				return
			}

			this.props.actions.postMessage({
				token: this.props.user.token,
				content: this.state.word,
				resolved: () => {
					this.props.actions.getMessages()
				}
			})
		}

		var itemsArr = []
		var key = 0
		for (let item of this.props.message) {
			itemsArr.push(
				<ListGroupItem className="messageListItem" key={key++}>
					<img src={!!item.user.avatar_uri ? item.user.avatar_uri : "http://lorempixel.com/80/80/"} alt=""/>
					<div className="messageListItemContent">
						<p className="name">
							{item.user.name}
						</p>
						<p className="content"><strong>说:</strong>{item.content}</p>
						<p className="createAt"><strong>{moment(item.create_at).fromNow()}</strong></p>
					</div>
				</ListGroupItem>
			)
		}

		return (
			<div>
				<Well>
					<FormControl type="text" placeholder="请输入您要说的话" onChange={handleMessageChange}></FormControl>
					<Button onClick={sendClick} className="send">发送</Button>
				</Well>
				{itemsArr.length === 0 ? (<Well>现在还没有人留言哦,赶快发一条吧~~~~</Well>) : (
					<ListGroup>
						{itemsArr}
					</ListGroup>)
				}
			</div>

		)

	}


	/**
	 * 发布食物界面的渲染
	 * @returns {XML}
	 * @private
	 */
	_renderPublishFood = () => {


		/**
		 * 选择文件后的处理
		 * @param e
		 */
		const handleFileChange = (e) => {
			var input = document.querySelector('.pic')
			var data = new FormData()
			data.append('file', input.files[0])
			this.setState({
				upload: {
					...this.state.upload,
					file: data
				}
			})
		}

		/**
		 * 填写名称时的处理
		 * @param e
		 */
		const handleNameChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					name: e.target.value
				}
			})
		}

		/**
		 * 填写单价时的处理
		 * @param e
		 */
		const handlePriceChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					price: JSON.parse(`${e.target.value}`)
				}
			})
		}

		/**
		 * 填写描述时的处理
		 * @param e
		 */
		const handleDescChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					description: e.target.value
				}
			})
		}

		const handleDiscountChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					discount: JSON.parse(`0.${e.target.value}`)
				}
			})
		}

		const handleRecommendChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					is_recommended: JSON.parse(e.target.value)
				}
			})
		}

		const handleHotChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					is_hot: JSON.parse(e.target.value)
				}
			})
		}

		const handleBreakfastChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					is_breakfast: JSON.parse(e.target.value)
				}
			})
		}

		const handleLunchChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					is_lunch: JSON.parse(e.target.value)
				}
			})
		}

		const handleDinnerChange = (e) => {
			this.setState({
				upload: {
					...this.state.upload,
					is_dinner: JSON.parse(e.target.value)
				}
			})
		}


		const upload = (e) => {
			e.preventDefault()

			if (!this.state.upload.file) {
				alert("请选择文件")
				return
			}

			this.props.actions.publishFood(this.state.upload)
		}

		return (
			<Form>
				<FormGroup controlId="name">
					<Col md={8} mdOffset={2}>
						<ControlLabel>食物名称</ControlLabel>
						<FormControl type="text" placeholder="请输入食物名称" onChange={handleNameChange}></FormControl>
					</Col>
				</FormGroup>
				<FormGroup controlId="desc">
					<Col md={8} mdOffset={2}>
						<ControlLabel>描述</ControlLabel>
						<FormControl componentClass="textarea" placeholder="描述" onChange={handleDescChange}/>
					</Col>
				</FormGroup>
				<FormGroup controlId="price">
					<Col md={8} mdOffset={2}>
						<ControlLabel>单价</ControlLabel>
						<InputGroup>
							<InputGroup.Addon>￥</InputGroup.Addon>
							<FormControl type="text" onChange={handlePriceChange}/>
							<InputGroup.Addon>.00</InputGroup.Addon>
						</InputGroup>
					</Col>
				</FormGroup>
				<FormGroup controlId="discount">
					<Col md={8} mdOffset={2}>
						<ControlLabel>折扣</ControlLabel>
						<InputGroup>
							<InputGroup.Addon>0.</InputGroup.Addon>
							<FormControl type="text" onChange={handleDiscountChange}/>
						</InputGroup>
					</Col>
				</FormGroup>
				<FormGroup controlId="pic">
					<Col md={8} mdOffset={2}>
						<ControlLabel>配图</ControlLabel>
						<InputGroup>
							<FormControl type="file" className="pic" onChange={handleFileChange}/>
						</InputGroup>
					</Col>
				</FormGroup>
				<FormGroup controlId="is_recommended">
					<Col md={8} mdOffset={2}>
						<ControlLabel>是否是推荐</ControlLabel>
						<FormControl componentClass="select" placeholder="is_recommended" onChange={handleRecommendChange}>
							<option value={false}>否</option>
							<option value={true}>是</option>
						</FormControl>
					</Col>
				</FormGroup>
				<FormGroup controlId="is_hot">
					<Col md={8} mdOffset={2}>
						<ControlLabel>是否是热销</ControlLabel>
						<FormControl componentClass="select" placeholder="is_hot" onChange={handleHotChange}>
							<option value={false}>否</option>
							<option value={true}>是</option>
						</FormControl>
					</Col>
				</FormGroup>
				<FormGroup controlId="is_breakfast">
					<Col md={8} mdOffset={2}>
						<ControlLabel>是否属于早餐</ControlLabel>
						<FormControl componentClass="select" placeholder="is_breakfast" onChange={handleBreakfastChange}>
							<option value={false}>否</option>
							<option value={true}>是</option>
						</FormControl>
					</Col>
				</FormGroup>
				<FormGroup controlId="is_lunch">
					<Col md={8} mdOffset={2}>
						<ControlLabel>是否属于午餐</ControlLabel>
						<FormControl componentClass="select" placeholder="is_lunch" onChange={handleLunchChange}>
							<option value={false}>否</option>
							<option value={true}>是</option>
						</FormControl>
					</Col>
				</FormGroup>
				<FormGroup controlId="is_dinner">
					<Col md={8} mdOffset={2}>
						<ControlLabel>是否属于晚餐</ControlLabel>
						<FormControl componentClass="select" placeholder="is_dinner" onChange={handleDinnerChange}>
							<option value={false}>否</option>
							<option value={true}>是</option>
						</FormControl>
					</Col>
				</FormGroup>

				<FormGroup>
					<Col mdOffset={2} md={10}>
						<Button type="submit" onClick={upload}>
							发布
						</Button>
					</Col>
				</FormGroup>
			</Form>
		)
	}


	_renderContent = () => {
		switch (this.state.selectedMenu) {
			case 'home':
				return this._renderHome()
			case 'order':
				return this._renderOrder()
			case 'message':
				return this._renderMessage()
			case 'foodPublish':
				return this._renderPublishFood()
			default:
				return
		}

	}
  render() {
    return (
	    <div>
		    <Navbar inverse>
			    <Navbar.Header>
				    <Navbar.Brand>
					    <a href="#">尚食堂</a>
				    </Navbar.Brand>
				    <Navbar.Toggle />
			    </Navbar.Header>
			    <Navbar.Collapse>
				    <Nav>
					    <NavItem eventKey={1} onClick={this._homeClick}>首页</NavItem>
					    <NavItem eventKey={2} onClick={this._orderClick}>订单</NavItem>
					    <NavItem eventKey={3} onClick={this._messageClick}>消息</NavItem>
					    <NavItem eventKey={4} onClick={this._publishFoodClick}>发布</NavItem>
				    </Nav>
				    {this._renderUserInfo()}
			    </Navbar.Collapse>
		    </Navbar>
		    <Modal show={this.state.loginModal} onHide={this.loginClose}>
			    <Modal.Header closeButton>
				    <Modal.Title>尚食堂登录</Modal.Title>
			    </Modal.Header>
			    <Modal.Body>
				    {this._renderLogin()}
			    </Modal.Body>
			    <Modal.Footer>
				    <Button onClick={this.loginClose}>关闭</Button>
			    </Modal.Footer>
		    </Modal>
		    <Modal show={this.state.registerModal} onHide={this.registerClose}>
			    <Modal.Header closeButton>
				    <Modal.Title>尚食堂注册</Modal.Title>
			    </Modal.Header>
			    <Modal.Body>
				    {this._renderRegister()}
			    </Modal.Body>
			    <Modal.Footer>
				    <Button onClick={this.registerClose}>关闭</Button>
			    </Modal.Footer>
		    </Modal>
		    {this._renderAlert()}
		    {this._renderContent()}
	    </div>

    );
  }
}



function mapStateToProps(state) {
	/* Populated by react-webpack-redux:reducer */
	return {
		foods: state.foods,
		user: state.user,
		order: state.order,
		message: state.message
	}
}

export default connect(mapStateToProps)(AppComponent);

