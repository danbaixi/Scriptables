// 云小智
// 作者：danbaixi
// 调用参数 yunxiaozhi@latest

class Im3xWidget {
	/**
	* 初始化
	* @param arg 外部传递过来的参数
	*/
	constructor (arg) {
		this.arg = arg
		this.widgetSize = config.widgetFamily
	}
	
	//渲染组件
	async render () {
		if (this.widgetSize === 'medium') {
			return await this.renderSmall()
		} else if (this.widgetSize === 'large') {
			return await this.renderLarge()
		} else {
			return await this.renderSmall()
		}
	}

	//渲染小尺寸组件
	async renderSmall () {
		let w = new ListWidget()
		w.addText("暂不支持该尺寸组件")
		return w
	}
	
	//渲染中尺寸组件
	async renderMedium () {
		let result = await this.getData()
		let w = new ListWidget()
		if(result.status !== 0){
			var flTxt = w.addText('数据获取失败')
			flTxt.textColor = new Color("#fb7299")
			flTxt.font = Font.systemFont(14)
			return w
		}
		w = await this.renderHeader(w, data.icon, data.title, false)
		let data = result.data
		let rowLen = 4
		let boxs = w.addStack();
		for (var i = 0; i < rowLen; i++) {
			let box = boxs.addStack();
			var flTxt = box.addText(this.toThousands(data[i]['value']))
			flTxt.textColor = new Color("#fb7299")
			flTxt.font = Font.boldRoundedSystemFont(this.getFontsize(data[i]['value']))
			flTxt.centerAlignText()
			box.addSpacer(20)
			let utTxt = box.addText(data[i]['title'])
			utTxt.font = Font.systemFont(12)
			utTxt.centerAlignText()
			utTxt.textOpacity = 0.5
		} 
		return w
	}
	
	//渲染大尺寸组件
	async renderLarge () {
		let w = new ListWidget()
		w.addText("暂不支持该尺寸组件")
		return w
	}

	//加载数据
	async getData () {
		let api = 'https://yunxiaozhi.cn/v1/public/capi/widget/yxz'
		let req = new Request(api)
		let res = await req.loadJSON()
		return res
	}
  
	//加载远程图片
	async getImage (url) {
		let req = new Request(url)
		return await req.loadImage()
	}
	
	//格式化粉丝数量，加入千分号
	toThousands(num) {
		return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}

	//返回脚本运行时的时间，作为更新时间
	nowTime(){
		let date = new Date()
		return date.toLocaleTimeString('chinese', { hour12: false })
	}
	
	//根据粉丝数量返回不同的字体大小
	getFontsize(num){
		if(num<99){
			return 38
		}else if(num<9999 && num>100){
			return 30
		}else if(num<99999 && num>10000){
			return 28
		}else if(num<999999 && num>100000){
			return 24
		}else if(num<9999999 && num>1000000){
			return 22
		}else{
			return 20
		}
	}

	/**
	 * 渲染标题
	 * @param widget 组件对象
	 * @param icon 图标url地址
	 * @param title 标题
	 */
	async renderHeader (widget, icon, title, customStyle = true) {
		let header = widget.addStack()
		header.centerAlignContent()
		let _icon = header.addImage(await this.getImage(icon))
		_icon.imageSize = new Size(14, 14)
		_icon.cornerRadius = 4
		header.addSpacer(10)
		let _title = header.addText(title)
		if (customStyle) _title.textColor = Color.white()
		_title.textOpacity = 0.7
		_title.font = Font.boldSystemFont(14)
		widget.addSpacer(15)
		return widget
	}
	  
	//编辑测试使用
	async test(){
		if (config.runsInWidget) return
		this.widgetSize = 'small'
		let w1 = await this.render()
		await w1.presentSmall()
		this.widgetSize = 'medium'
		let w2 = await this.render()
		await w2.presentMedium()
		this.widgetSize = 'large'
		let w3 = await this.render()
		await w3.presentLarge()
	}
  
	//组件单独在桌面运行时调用
	async init(){
		if (!config.runsInWidget) return
		let widget = await this.render()
		Script.setWidget(widget)
		Script.complete()
	}
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Im3xWidget().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
//await new Im3xWidget(args.widgetParameter).init()