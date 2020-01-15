function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

Object.assign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


HK_WEB_UTIL = {
		randomNum:function(n){
		    var rnd="";
		    for(var i=0;i<n;i++)
		        rnd+=Math.floor(Math.random()*10);
		    return rnd;
		}
}
HK_WEB_COMMON = {
	// 获取react对象
	setState:function(id,data){
		var component=this.getReact(id);
		component && component.setState(data)
	},
	setStateWithNameSpace: function(id,data,nameSpace) {
		var component=this.getReactWithNameSpace(id,nameSpace);
		component && component.setState(data)
	},
	setMultiState:function(data){
		if(data instanceof Array){
			for(var i=0;i<data.length;i++){
				for(var key in data[i]){
					this.setState(key,data[i][key])
				}
			}
		}
	},
	 getReact:function(id) {
		var component = base.ComponentMap.get(id);
		if (component == null) {
			console.warn(id+"---构件不存在");
			return null;
		}
		return component
	},
	getReactWithNameSpace:function(id,nameSpace) {
		var nameSpace = window[nameSpace] || window['sunsheen'];
		var component = nameSpace.ComponentMap.get(id);
		if (component == null) {
			console.warn(id+"---构件不存在");
			return null;
		}
		return component
	},
	ajax2:function(config) {
		// 异步调用
        $.ajax(config);
	},
	ajax:function(url,method,data,sCall) {
		var config = {
				url:url,
				type:method,
				data:data,
				success:function(arguments) {
					sCall(arguments);
				}
		}
		// 异步调用
        $.ajax(config)
	},
	ajaxReturnJson :function(url,method,data,sCall) {
		var defaultConfig = {
			method:"post"
		}
		var config = {
				url:url,
				method:method,
				data:data,
				dataType:"json",
				success:function() {
					sCall(arguments);
				}
		}
		config=$.extend({},defaultConfig,config);
		// 异步调用
        $.ajax(config)
	},
	// 刷新构件所在iframe
	refresh: function(id) {
		var component=document.getElementById(id);
		var oParentNode=component.parentNode;
		while (true) {
			if (oParentNode.tagName == "BODY") {
				window.location.reload();
				break;
			}
			if (oParentNode.tagName == "IFRAME") {
				oParentNode.contentWindow.location.reload(true);
				break;
			}
			oParentNode=oParentNode.parentNode;
		}
	}
}
COMBO = {
	reload: function(id,url,data){
		var select=HK_WEB_COMMON.getReact(id);
		if (!select) return;
		select.reload(url,data);
	},
	// 获取下拉框选择项的所有数据
	getSelectData: function(id){
		var select=HK_WEB_COMMON.getReact(id);
		if (!select) return;
		if (select.selectData) {
			return select.selectData;
		}
		return undefined;
	}
}
TREE = {
	// 得到当前节点的所有数据,返回object
	getCurrentNodeDatas: function(id){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		if (rc.extData && rc.extData.currentNodeData && !$.isEmptyObject(rc.extData.currentNodeData)) {
			return rc.extData && rc.extData.currentNodeData;
		}
		if (rc.type == "Tree") { // 普通树
			if (rc.state.selectedKeys) {
				var keyId = rc.state.selectedKeys[0];
				//得到扁平化的数据
				var flatData = rc.memoizeFlatData(rc.state.treeData,'children');
				//找出第一个满足条件的数据
				var data = _.find(flatData,['id',keyId]);
				return data;
			}
			return undefined;
		}
		if (rc.type == "GridTree" || rc.type == "EditGridTree"){ // 表格树和可编辑表格树
			if (rc.state.selectedRowKeys) {
				var keyId = rc.state.selectedRowKeys[0];
				var flatData = rc.memoizeFlatData(rc.state.treeTableData,'children');
				var data = _.find(flatData,['id',keyId]);
				return data;
			}
			return undefined;
		}
	},
	filter: function(treeId, filter) {
		var rc=HK_WEB_COMMON.getReact(treeId);
		if(!rc) return;
		rc.filterTreeData(filter);
	},
	//搜索树
	searchTree: function(treeId,inputValue){
		/*
		以下为执行逻辑
		*/
		const value = inputValue;
		const tree = HK_WEB_COMMON.getReact(treeId);
		const treeData = JSON.parse(JSON.stringify(tree.treeData));
		const dataList = [];//存储key和title
		let gData_data = treeData;//未进行搜索时页面上展示的数据
		let finalData = [];//处理完成后的显示数据
		let nodeList = [];//存储所有要显示的节点
        let keyNode = [];//存储直接包含关键字的节点
		generateList(treeData);// 将拿到数据进行格式化,让dataList存储key和title
		//获取需要展开的节点
		const expandedKeys = dataList.map(function(item){
		    if (item.title.indexOf(value) > -1) {
		        nodeList.push(item.key);
		        return getParentKey(item.key, treeData);
		    }
		    return null;
		}).filter(function(item, i, self){ return item && self.indexOf(item) === i });
		keyNode = nodeList;
		nodeList = nodeList.concat(expandedKeys);
		// console.log("含关键字的父级节点", expandedKeys);
		findAllParent(expandedKeys);
		nodeList = nodeList.filter(function(item, i, self){ return item && self.indexOf(item) === i});
		// console.log("所有展示节点", nodeList);
		copyTree(treeData, finalData);
		console.log(finalData);
		gData_data = JSON.parse(JSON.stringify(finalData));


		/*
		以下为函数
		*/
		function generateList(data) {
		    for (let i = 0; i < data.length; i++) {
		        const node = data[i];
		        const key = node.id;
		        dataList.push({key:key, title: node.text});
		        if (node.children) {
		            generateList(node.children);
		        }
		    }
		};

		// 获取当前节点的父节点
		function getParentKey(key, tree) {
		    let parentKey;
		    for (let i = 0; i < tree.length; i++) {
		        const node = tree[i];
		        if (node.children) {
		            if (node.children.some(function(item) {return item.id === key})) {
		                parentKey = node.id;
		            } else if (getParentKey(key, node.children)) {
		                parentKey = getParentKey(key, node.children);
		            }
		        }
		    }
		    return parentKey;
		};

		// 获取节点的所有父级节点
		function findAllParent(expandedKeys) {
		    const parentKeys = expandedKeys.map(function(item) {
		        return getParentKey(item, treeData);
		    }).filter(function(item, i, self) { return item && self.indexOf(item) === i});
		    if (parentKeys.length !== 0) {
		        nodeList = nodeList.concat(parentKeys);
		        findAllParent(parentKeys);
		    } else {
		        return;
		    }
		}

		function copyTree(arr, parentNode) {
            for (var i = 0, len = arr.length; i < len; i++) {
		        const item = arr[i];
		        const obj = {};
		        if (nodeList.indexOf(item.id) != '-1') {
		            if(keyNode.indexOf(item.id) != '-1'){
		                //包含关键字的直接复制
                        Object.keys(item).forEach(function(key) {
                                obj[key] = item[key];
                        });
                        console.log(obj);
                        parentNode.push(obj);
                    }else{
                        Object.keys(item).forEach(function(key) {
                            if (key != "children") {//不包含关键字的子节点不能直接复制
                                obj[key] = item[key];
                            }
                        });
                        if (item.children) {
                            obj['children'] = [];
                            copyTree(item.children, obj.children);
                        }
                        parentNode.push(obj);
                    }

		        }
		    }
		}

		/*
		更新组件
		*/
		tree.expandedKeys = nodeList;
		tree.getTreeNodes(gData_data);
		tree.setState({expandedKeys: nodeList, treeData: gData_data,});
	},
	 // openKeys是个数组，点击通过id找到菜单并添加key值进openKeys里，
	expendAll:function(id){
		var menu=HK_WEB_COMMON.getReact(id);
		menu.setState({openKeys:menu.keys})
	},
	// 关闭所有展开子菜单
	closeAll:function(id){
		var menu=HK_WEB_COMMON.getReact(id);
		menu.setState({openKeys:''})
	},
	// 得到所有已勾选的节点的data值
	getCheckedDatas:function(id){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		if (rc.extData && rc.extData.checkedDatas && rc.extData.checkedDatas.length > 0) {
			return rc.extData && rc.extData.checkedDatas;
		}
		if (rc.type == "Tree") { // 普通树
			var checkedKeys = rc.state.checkedKeys;
			var flatData = rc.memoizeFlatData(rc.state.treeData,'children');
	        var checkedDatas = _.filter(flatData, function (value) {
	            return _.indexOf(checkedKeys, value.id) + 1;
	        });
	        return checkedDatas;
		}
		if (rc.type == "GridTree" || rc.type == "EditGridTree"){ // 表格树和可编辑表格树
			var selectedRowKeys = rc.state.selectedRowKeys;
			var flatData = rc.memoizeFlatData(rc.state.treeTableData,'children');
	        var checkedDatas = _.filter(flatData, function (value) {
	            return _.indexOf(selectedRowKeys, value.id) + 1;
	        });
	        return checkedDatas;
		}
	},
	// 得到所有已勾选的节点的data值,包括父节点信息
	getCheckedDatas1:function(id){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		if (rc.extData && rc.extData.checkedDatas1 && rc.extData.checkedDatas1.length > 0) {
			return rc.extData && rc.extData.checkedDatas1;
		}
	},
	// 重新指定数据源并加载菜单
	reload:function(id,url,params){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		if(arguments.length ==1){
			rc.reloadTreeData();
		}else if(arguments.length ==2){
			rc.reloadTreeData(url);
		} else {
			rc.reloadTreeData(url,params);
		}
	},
	// 得到节点的所有数据
	getNodeDatas:function(id){
		var menu = HK_WEB_COMMON.getReact(id);
		return menu.state.dataSource;
	},
	// 得到单个节点的数据
	getNodeData:function(id){
		var menu = HK_WEB_COMMON.getReact(id);
		return menu.state.nodeData;
	},
	// 根据数据选择树的节点
	selectNodes:function(id,datas){
		TREE.checkedNodes(id,datas);
	},
	// 根据数据选择树的节点(单选)
	selectNode:function(id,datas){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		var nodesId = [];
		for (var i = 0; i < datas.length; i++) {
			if (datas[i].id)
				nodesId.push(datas[i].id);
		}
		if (rc.type == "Tree") { // 普通树
			rc.setState({selectedKeys: nodesId});
		}
		if (rc.type == "GridTree" || rc.type == "EditGridTree"){ // 表格树和可编辑表格树
			rc.setState({selectedRowKeys: nodesId});
		}
	},
	// 根据数据选择树的节点(多选)
	checkedNodes:function(id,datas){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		setTimeout(function(){
			var nodesId = [];
			for (var i = 0; i < datas.length; i++) {
				if (datas[i].id)
					nodesId.push(datas[i].id);
			}
			if (rc.type == "Tree") { // 普通树
				rc.handleChecked(nodesId);
			}
			if (rc.type == "GridTree" || rc.type == "EditGridTree"){ // 表格树和可编辑表格树
				rc.setState({selectedRowKeys: nodesId});
			}
		}, 500 );
		/*HK_WEB_COMMON.ajax(
			" ",
			"post",
			{},
			function(ret1){
				var nodesId = [];
				for (var i = 0; i < datas.length; i++) {
					if (datas[i].id)
						nodesId.push(datas[i].id);
				}
				if (rc.type == "Tree") { // 普通树
					rc.handleChecked(nodesId);
				}
				if (rc.type == "GridTree" || rc.type == "EditGridTree"){ // 表格树和可编辑表格树
					rc.setState({selectedRowKeys: nodesId});
				}
			}
		);*/
	},
	// 展开指定树节点
	expandedNodes:function(id,datas){
		var rc=HK_WEB_COMMON.getReact(id);
		if(!rc) return;
		var nodesId = [];
		for (var i = 0; i < datas.length; i++) {
			if (datas[i].id)
				nodesId.push(datas[i].id);
		}
		if (rc.type == "Tree") { // 普通树
			rc.setState({expandedKeys: nodesId});
		}
		if (rc.type == "GridTree" || rc.type == "EditGridTree"){ // 表格树和可编辑表格树
			rc.setState({expandedRowKeys: nodesId});
		}
	}
}

		HK_WEB_TREEORDINARY = {
			// 得到选中的结点的数据,返回collection
			getCheckedDatas: function(id) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return [];
				return rc.extData && rc.extData.checkedDatas || [];
			},
			// 刷新树
			reload: function(id,url) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				rc.reloadTreeData(url);
			},
			// 展开树
			expandAll: function(id) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				rc.handleExpandAll(true);
			},
			// 得到当前节点的所有数据,返回object
			getCurrentNodeDatas: function(id){
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.extData && rc.extData.currentNodeData || {};
			},

			// 得到当前节点的单个数据
			getCurrentNodeField: function(id,dataindex){
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.extData && rc.extData.currentNodeData && rc.extData.currentNodeData[dataIndex] || '';
			},

			// 得到节点的单个数据
			getNodeData: function(id,nodeId) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.getNodeData && rc.getNodeData(nodeId);
			},

			// 得到节点的所有数据
			getNodeDatas: function(id) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.getAllNodeData && rc.getAllNodeData();
			}
		}

		HK_WEB_TREETABLE = {
			// 得到选中的结点的数据,返回collection
			getCheckedDatas: function(id) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return [];
				return rc.getAllSelectedData();
			},

			// 刷新树
			reload: function(id,url) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				rc.reloadTreeData(url);
			},

			// 展开树
			expandAll: function(id) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				rc.handleExpandAll(true);
			},

			// 得到当前节点的所有数据,返回object
			getCurrentNodeDatas: function(id){
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.extData && rc.extData.currentNodeData || {};
			},

			// 得到当前节点的单个数据
			getCurrentNodeDatas: function(id,dataindex){
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.extData && rc.extData.currentNodeData && rc.extData.currentNodeData[dataIndex] || '';
			},

			// 得到节点的单个数据
			getNodeData: function(id,nodeId) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.getNodeData && rc.getNodeData(nodeId);
			},

			// 得到节点的所有数据
			getNodeDatas: function(id) {
				var rc=HK_WEB_COMMON.getReact(id);
				if(!rc) return;
				return rc.getAllNodeData && rc.getAllNodeData();
			}
		}


MENU = {
		 // openKeys是个数组，点击通过id找到菜单并添加key值进openKeys里，
				expendAll:function(id){
					var menu=HK_WEB_COMMON.getReact(id);
					menu.setState({openKeys:menu.keys})
				},
				// 关闭所有展开子菜单
				closeAll:function(id){
					var menu=HK_WEB_COMMON.getReact(id);
					menu.setState({openKeys:''})
				},
				// 得到所有已勾选的节点的data值
				getCheckedDatas:function(id){
					var menu = HK_WEB_COMMON.getReact(id).state.arrData
					for(var i=0;i<menu.length;i++){
						var menudata = menu[i]
						console.log(menudata)
						alert(menudata)
					}
					return menudata
				},
				// 得到单个最近节点的对象
				getCurrentNode:function(id){
					var menu = HK_WEB_COMMON.getReact(id).state.nodeData;
					console.log(menu)
					alert(menu)
					return menu
				},
				// 得到单个节点的数据
				getCurrentNodeData:function(id){
					var menu = HK_WEB_COMMON.getReact(id).state.nodeData.item.props;
					console.log(menu)
					alert(menu)
					return menu
				},
				// 得到节点的所有数据
				getNodeDatas:function(id){
					var menu = HK_WEB_COMMON.getReact(id).state.dataSource
					console.log(menu)
					return menu
				},
				// 重新指定数据源并加载菜单
				reload:function(id,url){
					if(arguments.length ==1){
						var menu = HK_WEB_COMMON.getReact(id);
						console.log(menu)
						menu.setState({openKeys:'',nodeData:'',arrData:[],dataSourceParams:undefined})
					}else{
						var menu = HK_WEB_COMMON.getReact(id);
						menu.setState({openKeys:'',nodeData:'',arrData:[],dataSourceParams:undefined,dataSourceDynamic:url});
						menu.loadData();
					}
				}

		}

function Stack() {
    var stack = new Array();  // 存放栈的数组
    this.stack =stack;
    // 入栈
    this.push = function(o) {
        stack.push(o);
    };
    this.top = function(o) {
    	  var o = stack[stack.length-1];
    	  return o;
    };
    // 出栈
    this.pop = function() {
        var o = stack[stack.length-1];
        stack.splice(stack.length-1,1);
        return o;
    };
    // 检查栈是否为空
    this.isEmpty = function() {
        if(stack.length>0) {
            return false;
        }
        else {
            return true;
        }
    }
}
DIALOG={
		dialogs:{},
		showIds:new Stack(),
		showVisible:true,
		callbacks: {},
		// 关闭对话框
		close:function(){
			var showId = window.top.DIALOG.showIds.pop();
			window.top.DIALOG.get(showId).setState({
				visible:false
			});
			window.top.DIALOG.getCallback(showId) &&window.top.DIALOG.getCallback(showId)("");
		},

		// 关闭对话框
		closeRetValue:function(value){
			var showId = window.top.DIALOG.showIds.pop();
			window.top.DIALOG.get(showId).setState({
				visible:false
			});
			window.base = window.oldBase;
			window.top.DIALOG.getCallback(showId) &&window.top.DIALOG.getCallback(showId)(value);
		},

		// 打开浮动的子窗口
		show:function(url,width,height,title,data,okFun,cancalFun,callback,beforeClose,maskClosable,cancelText,confirmText) {
			if (arguments.length == 1) {
				var url1 = url.url;
				var width = url.width;
				var height = url.height;
				var title = url.title;
				var data = url.data;
				var maskClosable = url.maskClosable;
				var okFun = url.okClick;
				var cancalFun = url.cancalClick;
				var callback = url.callback;
				var beforeClose = url.beforeClose;
				var id = url.id;
				var wrapClassName = url.wrapClassName;
				var cancelText = url.cancelText;
				var confirmText = url.confirmText;
				var scrolling = url.scrolling; //是否出现滚动条,yes或no
				window.top.DIALOG.show2(window,url1,width,height,title,data,okFun,cancalFun,callback,beforeClose,maskClosable,id,wrapClassName,cancelText,confirmText,scrolling);
			} else {
				// originWindow调用弹出框方法的window
				window.top.DIALOG.show2(window,url,width,height,title,data,okFun,cancalFun,callback,beforeClose,maskClosable);
			}
		},
		show2:function(originWindow,url,width,height,title,data,okFun,cancalFun,callback,beforeClose,maskClosable,id,wrapClassName,cancelText,confirmText,scrolling) {
			  if(width.indexOf("px") == -1 ){
				  width = width + 'px';
			  }
			  if(height.indexOf("px") == -1 ){
				  height = height + 'px';
			  }
			  var idStr = Date.now().toString(36)
			  idStr += Math.random().toString(36).substr(3,10);
			  if (id) {
				  idStr = id;
			  }
			  var dialogContianer =  document.createElement('div');
			  dialogContianer.setAttribute("id", idStr);
			  document.body.appendChild(dialogContianer);
			  var AntdModal = antd.Modal;
			   AntdModal = createReactClass({
				    getInitialState: function() {
				        this.state = Object.assign({}, this.props);
				        return this.state;
				    },
				    myOnclick:function (){
				    	DIALOG.close();
				    },
				    render:function(){
				    	var _this =this;
				    	var _extends = Object.assign || function (target) {
				    		for (var i = 1; i < arguments.length; i++) {
				    			var source = arguments[i];
				    			for (var key in source) {
				    				if (Object.prototype.hasOwnProperty.call(source, key)) {
				    					target[key] = source[key];
				    					}
				    				}
				    			}
				    		return target;
				    		};
				    	return React.createElement(antd.Modal, _extends({}, _this.state, { onCancel: _this.myOnclick }));
				    }
			  })
			  var frameId = idStr + "_iframe";
			   window.originWindow = originWindow;
			   var customOkFun = function() {
				   var originWindow = window.originWindow;
				   return function() {
					   var win = originWindow;
					   win.oldBase=win.base;
					   win.base = window.frames[frameId].contentWindow.base;
					   try {
						   okFun();
					   }catch(e) {

					   }
					   win.base = win.oldBase;
				   }
			  }
			   var customCancleFun = function() {
				   var originWindow = window.originWindow;
				   return function() {
					   var win = originWindow;
					   win.oldBase= win.base;
					   win.base = window.frames[frameId].contentWindow.base;
					   try {
						   cancalFun();
					   }catch(e) {

					   }
					   win.base = win.oldBase;
					   DIALOG.close()
				   }
			  }
			  var okF = customOkFun()
			  var cF = customCancleFun()
			  var cancelButton = React.createElement('button',
					  {
				  			className: 'ant-btn',
				  			type: 'button',
				  			onClick:cF
					  },
					  		React.createElement('span', null, cancelText ? cancelText : '取 消'));
			  var confirmButton = React.createElement('button',
					  {
				  		className: 'ant-btn dialog-btn-primary ant-btn-primary',
				  		type: 'button',
				  		onClick: okF
					  },
					  	React.createElement('span', null, confirmText ? confirmText : '确 定'));
			  var array = [];
			  if (okFun) {
				  array.push(confirmButton);
			  }
			  if (cancalFun) {
				  array.push(cancelButton);
			  }
			  var footer = React.createElement('div', null, array);
			  var modal = React.createElement(
					  AntdModal,
					  {
					    id: idStr,
					    title: title,
					    footer: array.length > 0 ? footer : null,
					    visible: DIALOG.showVisible,
					    width: width,
					    height: height,
					    data: data,
					    destroyOnClose:true,
					    maskClosable: maskClosable,
					    wrapClassName: wrapClassName ? wrapClassName : ""
					  },
					  React.createElement("iframe", {
					    src: url,
					    id: frameId,
					    frameBorder: "0",
					    width: "100%",
					    height: height,
					    scrolling: scrolling ? scrolling : "no"
					  })
					);


			  HK_WEB_COMMON.ajax ("","post",{},function(ret1){ // 将className添加dialog的外层容器
				  var dialog = ReactDOM.render(
						  modal, dialogContianer);
				  DIALOG.showIds.push(idStr);
				  DIALOG.putCallback(idStr,callback); // 添加属性及值到dialogs内
				  DIALOG.put(idStr,dialog); // 添加属性及值到dialogs内
				  if (wrapClassName) {
			    		var dialogs = document.getElementsByClassName(wrapClassName);
			    		for (var i=0; i<dialogs.length; i++) {
			    			if (dialogs[i].getAttribute("role") == "dialog" && dialogs[i].style.display != "none") {
			    				var dialog = dialogs[i];
			    				dialog.classList.remove(wrapClassName);
			    				dialog.parentNode.classList.add(wrapClassName);
			    			}
			    		}
			    	}
			  });
		},
		putCallback:function (id,callback){
			DIALOG.callbacks[id]=callback;
		},
		getCallback:function(id) {
			return DIALOG.callbacks[id];
		},
		put:function (id,dialog){
			DIALOG.dialogs[id]=dialog;
		},
		get:function(id) {
			return DIALOG.dialogs[id];
		},
		// 浏览器打开模态对话框 features描述对话框的外观等信息 字符串 dialogHeight dialogWidth
		showBrowserDialog:function(id,url,width,height,data){
			window.showModalDialog(url+Math.random(),data,"dialogWidth:"+width+";dialogHeight:"+height+";")
		},
		// 在子窗口获取父窗口的参数
		getParameter:function(){
			var showId = window.top.DIALOG.showIds.top();
			if (showId)
				return  window.top.DIALOG.get(showId).state.data;
		},
		getWindowId:function(){
			var showId = window.top.DIALOG.showIds.top();
			if (showId)
				return  window.top.DIALOG.get(showId).state.id;
		}
}


MSG = {
		error:function(content,duration,onClose) {
			antd.message.error(content,duration,onClose)
		},
		success:function(content,duration,onClose) {
			antd.message.success(content,duration,onClose)
		},
		tip:function(msg,time) {
			antd.message.info(msg,time)
		},
		warning:function(content,duration,onClose) {
			antd.message.warning(content,duration,onClose)
		},
		warn:function(content,duration,onClose) {
			antd.message.warning(content,duration,onClose)
		},
		loading:function(content,duration,onClose) {
			antd.message.loading(content,duration,onClose)
		}
}
NOTIFICATION = {
		// 普通通知
		normal:function(message,description,onClose,duration,placement,key,className,style,btn,icon) {
			var defaultConfig = {
				placement:"topRight"
			}
			if (arguments.length <=5) {
				var config = {
					message:message,
					description:description,
					duration:duration,
					placement:placement,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					}
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.open(newConfig);
			} else {
				var config = {
					message:message,
					description:description,
					className:className,
					style:style,
					btn:btn,
					icon:icon,
					key:key,
					duration:duration,
					placement:placement,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					}
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.open(newConfig);
			}

		},
		// 成功通知
		success:function(message,description,onClose,duration,placement,key,className,style,btn,icon) {
			var defaultConfig = {
				placement:"topRight"
			}
			if (arguments.length <=5) {
				var config = {
					message:message,
					description:description,
					duration:duration,
					placement:placement,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					}
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.success(newConfig);
			} else {
				var config = {
					message:message,
					description:description,
					className:className,
					style:style,
					btn:btn,
					icon:icon,
					key:key,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					},
					duration:duration,
					placement:placement
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.success(newConfig);
			}
		},
		// 错误通知
		error:function(message,description,onClose,duration,placement,key,className,style,btn,icon) {
			var defaultConfig = {
				placement:"topRight"
			}
			if (arguments.length <=5) {
				var config = {
					message:message,
					description:description,
					duration:duration,
					placement:placement,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					}
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.error(newConfig);
			} else {
				var config = {
					message:message,
					description:description,
					className:className,
					style:style,
					btn:btn,
					icon:icon,
					key:key,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					},
					duration:duration,
					placement:placement
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.error(newConfig);
			}
		},
		// 信息通知
		info:function(message,description,onClose,duration,placement,key,className,style,btn,icon) {
			var defaultConfig = {
				placement:"topRight"
			}
			if (arguments.length <=5) {
				var config = {
					message:message,
					description:description,
					duration:duration,
					placement:placement,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					}
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.info(config);
			} else {
				var config = {
					message:message,
					description:description,
					className:className,
					style:style,
					btn:btn,
					icon:icon,
					key:key,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					},
					duration:duration,
					placement:placement
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.info(config);
			}
		},
		// 警告通知
		warn:function(message,description,onClose,duration,placement,key,className,style,btn,icon) {
			var defaultConfig = {
				placement:"topRight"
			}
			if (arguments.length <=5) {
				var config = {
					message:message,
					description:description,
					duration:duration,
					placement:placement,
					onClose:function() {
						if (onClose) {
							onClose();
						}
					}
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.warn(config);
			} else {
				var config = {
					message:message,
					description:description,
					className:className,
					style:style,
					btn:btn,
					icon:icon,
					key:key,
					onClose:onClose,
					duration:duration,
					placement:placement
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.notification.warn(config);
			}
		},
		// 关闭通知
		close:function(key) {
			antd.notification.close(key);
		}
}
MODAL = {
		modals:{},
		showIds:new Stack(),
		put:function (id,modals){
			MODAL.modals[id]=modals;
		},
		get:function(id) {
			return MODAL.modals[id];
		},
		// 信息对话框
		info:function(title,content,onOk,onCancel,width,iconType,okText,cancelText,maskClosable) {
			var defaultConfig = {
				okText:"确认",
				cancelText:"取消"
			}
			if (arguments.length <=5) {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.info(newConfig);
			} else {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width,
						iconType:iconType,
						okText:okText,
						cancelText:cancelText,
						maskClosable:maskClosable
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.info(newConfig);
			}
		},
		// 成功对话框
		success:function(title,content,onOk,onCancel,width,iconType,okText,cancelText,maskClosable) {
			var defaultConfig = {
				okText:"确认",
				cancelText:"取消"
			}
			if (arguments.length <=5) {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.success(newConfig);
			} else {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width,
						iconType:iconType,
						okText:okText,
						cancelText:cancelText,
						maskClosable:maskClosable
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.success(newConfig);
			}
		},
		// 错误对话框
		error:function(title,content,onOk,onCancel,width,iconType,okText,cancelText,maskClosable) {
			var defaultConfig = {
				okText:"确认",
				cancelText:"取消"
			}
			if (arguments.length <=5) {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.error(newConfig);
			} else {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width,
						iconType:iconType,
						okText:okText,
						cancelText:cancelText,
						maskClosable:maskClosable
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.error(newConfig);
			}
		},
		// 警告对话框
		warning:function(title,content,onOk,onCancel,width,iconType,okText,cancelText,maskClosable) {
			var defaultConfig = {
				okText:"确认",
				cancelText:"取消"
			}
			if (arguments.length <=5) {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.warning(newConfig);
			} else {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width,
						iconType:iconType,
						okText:okText,
						cancelText:cancelText,
						maskClosable:maskClosable
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.warning(newConfig);
			}
		},
		// 确认对话框
		confirm:function(title,content,onOk,onCancel,width,iconType,okText,cancelText,maskClosable) {
			var defaultConfig = {
					okText:"确认",
					cancelText:"取消"
			}
			if (arguments.length <=5) {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.confirm(newConfig);
			} else {
				var config = {
						title:title,
						content:content,
						onOk:function() {
							if (onOk) {
								onOk();
							}
						},
						onCancel:function() {
							if (onCancel) {
								onCancel();
							}
						},
						width:width,
						iconType:iconType,
						okText:okText,
						cancelText:cancelText,
						maskClosable:maskClosable
				}
				var newConfig =  Object.assign({}, defaultConfig,config);
				antd.Modal.confirm(newConfig);
			}
		},
		// 确认对话框,带右上角关闭按钮
		confirmWithCloseButton:function(title,content,myOk,myCancel,onCancel) {
			var config = {
					title:title,
					content:content,
					footer:null,
					okText:"确认",
					cancelText:"取消",
					onCancel:function() { // 右上角关闭事件
						if (onCancel) {
							onCancel();
						}
					},
					myOk:function() { // 确定按钮点击事件
						if (myOk) {
							myOk();
						}
					},
					myCancel:function() { // 取消按钮点击事件
						if (myCancel) {
							myCancel();
						}
					}
			}
			base.ConfirmWithCloseButton.confirm(config);
		},
		// 带输入框的对话框
		prompt:function(title,content,onOk,onCancel) {
			var config = {
					title:title,
					content:content,
					okText:"确认",
					cancelText:"取消",
					onCancel:function(value) { // 右上角关闭事件
						if (onCancel) {
							onCancel(value);
						}
					},
					onOk:function(value) { // 右上角关闭事件
						if (onOk) {
							onOk(value);
						}
					}
			}
			base.Prompt.prompt(config);
		},
		prompt1:function(content,myOk,myCancel,onCancel) {
			var config = {
					content:content,
					footer:null,
					okText:"确认",
					cancelText:"取消",
					onCancel:function(value) { // 右上角关闭事件
						if (onCancel) {
							onCancel(value);
						}
					},
					myOk:function(value) { // 确定按钮点击事件
						if (myOk) {
							myOk(value);
						}
					},
					myCancel:function(value) { // 取消按钮点击事件
						if (myCancel) {
							myCancel(value);
						}
					}
			}
			base.Prompt.prompt(config);
		},
		loading:function(msg) {
			var idStr = Date.now().toString(36)
			idStr += Math.random().toString(36).substr(3,10);
			var dialogContianer =  document.createElement('div');
			dialogContianer.setAttribute("id", idStr);
			document.body.appendChild(dialogContianer);
			var AntdModal = antd.Modal;
			   AntdModal = createReactClass({
				    getInitialState: function() {
				        this.state = Object.assign({}, this.props);
				        return this.state;
				    },
				    myOnclick:function (){
				    	this.setState({visible: false});
				    },
				    render:function(){
				    	var _this =this;
				    	var _extends = Object.assign || function (target) {
				    		for (var i = 1; i < arguments.length; i++) {
				    			var source = arguments[i];
				    			for (var key in source) {
				    				if (Object.prototype.hasOwnProperty.call(source, key)) {
				    					target[key] = source[key];
				    					}
				    				}
				    			}
				    		return target;
				    		};
				    	return React.createElement(antd.Modal, _extends({}, _this.state, { onCancel: _this.myOnclick }));
				    }
			  })
			  var divId = "div"+HK_WEB_UTIL.randomNum(5);
			   HK_WEB_COMMON.ajax("","post",{},function(ret1){
				   var dialog = ReactDOM.render(
							  React.createElement(
									  AntdModal,
									  {
									    id: idStr,
									    title: "系统信息提示",
									    footer: null,
									    visible: true,
									    width: "200px",
									    height: "100px",
									    destroyOnClose:true,
									    maskClosable: false,
									    centered:true,
									    closable:false,
									    wrapClassName: "loading",
									    getContainer: function() {return document.body}
									  },
									  React.createElement("div", {
									    id: divId,
									    width: "100%",
									    height: "100%",
									  },React.createElement(antd.Icon,{type:"loading"}),msg)
									), dialogContianer);
						  MODAL.showIds.push(idStr);
						  MODAL.put(idStr,dialog);
			   });
		},
		endLoading:function() {
			HK_WEB_COMMON.ajax("","post",{},function(ret1){
				var showId = MODAL.showIds.pop();
				MODAL.get(showId).setState({visible: false});
			});
		}

}

FORM = {
		/**
		 * 表单
		 *
		 * @param formId
		 *            表单id
		 * @param inputId
		 *            输入框id
		 */
		// 得到表单JSON数据
		getFormDataMapping: function(formId) {
			var json = {};
			var form = HK_WEB_COMMON.getReact(formId);
			var children = form.props.children;
			if (Object.prototype.toString.call(children) === "[object Array]") {
				for (var i=0; i<children.length; i++) {
					var child = children[i];
					var name = child.props.name;
					if (name) {
						json[name] = FORM.getFormValue(formId, name);
					}
				}
				return json;
			}
			var name = children.props.name;
			if (name) {
				json[name] = FORM.getFormValue(formId, name);
			}
			return json;
			/*var data= form.props.form.getFieldsValue();
			for (i in data) {
				if (data[i] != null && data[i].format != null) {
					data[i] = data[i].format('YYYY-MM-DD HH:mm:ss');
				}
				if (data[i] != null && data[i].length==2 && data[i][0].format!=null) {
					var dataArr = [];
					for (var j=0;j<data[i].length;j++) {
						dataArr.push(data[i][j].format('YYYY-MM-DD HH:mm:ss'));
					}
					data[i] = dataArr;
				}
				if (data[i] == undefined) {
					data[i] = "";
				}
			}*/
			return data;
		},
		// 得到表单数据
		getFormValue: function(formId,inputId) {
			var form = HK_WEB_COMMON.getReact(formId);
			var data = form.props.form.getFieldValue(inputId);
			if (data != null && data.format != null) {
				var item = HK_WEB_COMMON.getReact(inputId);
				data = data.format(item.props.format ? item.props.format : 'YYYY-MM-DD HH:mm:ss');
			}
			if (data != null && data.length==2 && data[0].format!=null) {
				var item = HK_WEB_COMMON.getReact(inputId);
				var dataArr = [];
				for (var j=0;j<data.length;j++) {
					dataArr.push(data[j].format(item.props.format ? item.props.format : 'YYYY-MM-DD HH:mm:ss'));
				}
				data = dataArr;
			}
			if (data == undefined) {
				data = "";
			}
			return data;
		},
		// 设置单个表单项数据
		setFormValue: function(formId, inputId, value) {
			var form = HK_WEB_COMMON.getReact(formId);
			var input = HK_WEB_COMMON.getReact(inputId);
			var name = input.props.name;
			var config = {};
			config[name] = value;
			form.props.form.setFieldsValue(config);
		},
		// 设置表单项数据
		setFormValues: function(formId, data) {
			var form = HK_WEB_COMMON.getReact(formId);
			form.props.form.setFieldsValue(data);
		},
		// 重置整个表单
		resetFormValues: function(formId) {
			var form = HK_WEB_COMMON.getReact(formId);
			form.props.form.resetFields();
		},
		// 重置某个输入框
		resetFormValue: function(formId,inputId) {
			var form = HK_WEB_COMMON.getReact(formId);
			form.props.form.resetFields([inputId]);
		},
		// 表单验证
		valid: function(formId){
			var form = HK_WEB_COMMON.getReact(formId);
			var errFlag = null;
			form.props.form.validateFields(function(err){
				errFlag = err;
			});
			if (errFlag === null){
				return true;
			}
			for (var i in errFlag) {
				var err = errFlag[i];
				var fieldId = err.errors[0].field;
				var item = document.getElementById(fieldId);
				if (item) {
					item.focus();
					 window.scrollTo(0,item.getBoundingClientRect().top);
					break;
				}
			}
			return false;
		},
		// 表单禁用或启用
		setFormDisabled: function(formId,disabled){
			var form = HK_WEB_COMMON.getReact(formId);
			var children = form.props.children;
			if (Object.prototype.toString.call(children) === "[object Array]") {
				for (var i=0; i<children.length; i++) {
					var child = children[i];
					var name = child.props.name;
					if (name) {
						var item = HK_WEB_COMMON.getReact(name);
						item.setState({disabled: disabled});
					}
				}
				return;
			}
			var name = children.props.name;
			if (name) {
				var item = HK_WEB_COMMON.getReact(name);
				item.setState({disabled: disabled});
			}
		},
		// 表单输入框禁用
		setFormInputDisabled: function(formId,inputId,disabled){
			var form = HK_WEB_COMMON.getReact(formId);
			var children = form.props.children;
			if (Object.prototype.toString.call(children) === "[object Array]") {
				for (var i=0; i<children.length; i++) {
					var child = children[i];
					var name = child.props.name;
					if (name && name == inputId) {
						var item = HK_WEB_COMMON.getReact(name);
						item.setState({disabled: disabled});
					}
				}
				return;
			}
			var name = children.props.name;
			if (name && name == inputId) {
				var item = HK_WEB_COMMON.getReact(name);
				item.setState({disabled: disabled});
			}
		},
		// 设置表单tooltip
		setFormTooltip: function(formId,data){
			var form = HK_WEB_COMMON.getReact(formId);
			var children = form.props.children;
			for (var i=0; i<children.length; i++) {
				var child = children[i];
				var name = child.props.name;
				if (name && data[name]) {
					var item = HK_WEB_COMMON.getReact(name);
					item.setState({tooltip: data[name]});
				}
			}
		}
}



STRINGUTIL = {
		key : 0,
		hex : new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B",
				"C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
				"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"),
		decimaltoAnother : function(B, C) {
			B = 1 * B;
			s = "";
			while (B >= C) {
				s += StringUtil.hex[B % C];
				B = Math.floor(B / C)
			}
			return StringUtil.transpose(s += StringUtil.hex[B])
		},
		transpose : function(C) {
			N = C.length;
			for (var B = 0, A = ""; B < N; B++) {
				A += C.substring(N - B - 1, N - B)
			}
			return A
		},
		autoid20 : function() {
			var B = new Date();
			var A = StringUtil.decimaltoAnother(B.getTime() + StringUtil.key++, 36)
					.toLowerCase();
			return A
		},
		uuid : function(A, B) {
			return Math.uuid(A, B)
		},
		convertToJson : function(str) {
			return eval("(" + str + ")")
		},
		concat : function(A, B) {
			A = A == null || A == undefined ? "" : A;
			return A.concat(B)
		},
		charAt : function(B, A) {
			return B.charAt(A)
		},
		indexOf : function(B, A, C) {
			if (typeof (C) == "number") {
				return B.indexOf(A, C)
			} else {
				if (typeof (C) == "string" && !isNaN(parseInt(C))) {
					return B.indexOf(A, parseInt(C))
				} else {
					return B.indexOf(A)
				}
			}
		},
		lastIndexOf : function(B, A, C) {
			if (typeof (C) == "number") {
				return B.lastIndexOf(A, C)
			} else {
				if (typeof (C) == "string" && !isNaN(parseInt(C))) {
					return B.lastIndexOf(A, parseInt(C))
				} else {
					return B.lastIndexOf(A)
				}
			}
		},
		match : function(B, A, C) {
			return B.match(A, C)
		},
		replace : function(B, A, C) {
			if (B) {
				return B.replace(A, C)
			}
			return null
		},
		search : function(A, B) {
			return A.search(B)
		},
		split : function(A, C, B) {
			if (typeof (B) == "number") {
				return A.split(C, B)
			} else {
				if (typeof (B) == "string" && !isNaN(parseInt(B))) {
					return A.split(C, parseInt(B))
				} else {
					return A.split(C)
				}
			}
		},
		substr : function(A, C, B) {
			if (typeof (B) == "number") {
				return A.substr(C, B)
			} else {
				if (typeof (B) == "string" && !isNaN(parseInt(B))) {
					return A.substr(C, parseInt(B))
				} else {
					return A.substr(C)
				}
			}
		},
		substring : function(A, C, B) {
			if (typeof (B) == "number") {
				return A.substring(C, B)
			} else {
				if (typeof (B) == "string" && !isNaN(parseInt(B))) {
					return A.substring(C, parseInt(B))
				} else {
					return A.substring(C)
				}
			}
		},
		trim : function(A) {
			return A.replace(/(^\s*)|(\s*$)/g, "")
		},
		ltrim : function(A) {
			return A.replace(/(^\s*)/g, "")
		},
		rtrim : function(A) {
			return A.replace(/(\s*$)/g, "")
		}
	};
	var StringUtil = STRINGUTIL;

var GRID = (function () {

	var randomId = function randomId() {
		// 随机生成id
		var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
		var id = "";
		var timestamp = new Date().getTime();
		for (var i = 0; i < 13; i++) {
			id += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
		}

		return id;
	};
	var getGrid = function getGrid(id) {
		return HK_WEB_COMMON.getReact(id);
	};
	var clearSelections = function clearSelections(id) {
		// 取消所有选择
		var grid = getGrid(id);
		if (!grid) return;
		grid.setState({ selectedRowKeys: [], selectedRows: [] });
	};
	var deSelectRange = function deSelectRange(id, start, end) {
		// 取消选中指定开始行和结束行
		var grid = getGrid(id);
		if (!grid) return;

		var selectedRowKeys = grid.getData('selectedRowKeys');
		var data = grid.getData('dataSource').slice(start, end + 1);
		if (selectedRowKeys) {
			selectedRowKeys = selectedRowKeys.slice(0);
		} else {
			console.warn('请选中行');
			return;
		}

		for (var i = 0; i < data.length; i++) {
			var index = selectedRowKeys.indexOf(data[i].id);
			if (index !== -1) {
				selectedRowKeys.splice(index, 1);
			}
		}
		grid.changeData({ selectedRowKeys: selectedRowKeys });
	};
	var deSelectRow = function deSelectRow(id, index) {
		// 取消选中指定行
		var grid = getGrid(id);
		if (!grid) return;
		deSelectRange(id, index, index);
	};
	var blurQuery = function blurQuery(id, text) {
		// 当前数据源模糊查询
		var grid = getGrid(id);
		if (!grid) return;
		grid.addProperty('BLURQUERY', text);
		grid.onChange({ current: 1 });
	};
	var getCurrentRowsData = function getCurrentRowsData(id) {
		// 获取选中多行数据
		var grid = getGrid(id);
		if (!grid) return;
		return getGrid(id).state.selectedRows;
	};

	var getCurrentRowsCellData = function getCurrentRowsCellData(id, selectedIndex, dataIndex) {
		// 获取多行选中的某行数据
		var grid = getGrid(id);
		if (!grid) return;
		var data = getCurrentRowsData(id)[selectedIndex];
		if (!data) {
			console.warn('当前没有选中行');
		} else {
			return data[dataIndex];
		}
		// return data.length>0?data[data.length-1][dataIndex]:null
	};
	var getCurrentRowsIndex = function getCurrentRowsIndex(id) {
		// 得到多行行号
		var grid = getGrid(id);
		if (!grid) return;
		var pagination = grid.state.pagination;
		var selectedRowKeys = grid.getData('selectedRowKeys');
		var data = grid.getData('dataSource');
		data = data.slice(pagination.pageSize * (pagination.current - 1));
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			if (selectedRowKeys.indexOf(data[i].id) != -1) {
				arr.push(i);
			}
		}
		return arr;
	};
	var getCurrentRowData = function getCurrentRowData(gridId) {
		// 得到单行数据
		var grid = getGrid(gridId);
		if (!grid) return null;
		if(!grid.state.selectedRows) return null;
		return grid.state.selectedRows[0];
	};
	var getSelections = function getSelections(gridId) {
		// 得到单行数据
		var grid = getGrid(gridId);
		if (!grid) return null;
		if(!grid.state.selectedRows) return null;
		return grid.state.selectedRows;
	};
	var getCurrentRowCellData = function getCurrentRowCellData(id, dataIndex) {
		// 得到单行某列数据
		var grid = getGrid(id);
		if (!grid) return;
		return getCurrentRowsCellData(id, 0, dataIndex);
	};
	var getCurrentRowIndex = function getCurrentRowIndex(id) {
		// 得到单行行号
		var grid = getGrid(id);
		if (!grid) return;
		return getCurrentRowsIndex(id)[0];
	};
	var getDatas = function getDatas(id) {
		// 得到本页所有数据
		var grid = getGrid(id);
		if (!grid) return;
		return getGrid(id).state.dataSource;
	};
	var getRowData = function getRowData(id, index) {
		// 得到本页一行数据
		var grid = getGrid(id);
		if (!grid) return;
		return getDatas(id)[index];
	};
	var changeData = function changeData(id, data) {
		getGrid(id).changeData(data);
	};
	var queryLoad = function queryLoad(id, data) {
		// 以查询方式过滤表格
		var grid = getGrid(id);
		if (!grid) return;
		var datas = {};
		for (var key in data) {
			datas[key] = data[key].value;
		}
		datas.baseQuery = JSON.stringify(data);
		grid.requestData('', datas);
	};
	var reload = function reload(gridId, url, data) {
		// 重新加载表格
		var grid = getGrid(gridId);
		if (!grid) return;
		if (arguments.length === 1)
			grid.reload(grid.url, null);
		if (arguments.length === 2)
			grid.reload(grid.url, {savePage: url});
		if (arguments.length === 3)
			grid.reload(url, data);
		if (arguments.length === 4)
			grid.reload(url, Object.assign({},data,{savePage: savePage}));
	};
	var reloadSavePage = function reloadSavePage(gridId, url, data) {
		// 重新加载表格
		var grid = getGrid(gridId);
		if (!grid) return;
		if (arguments.length === 1)
			grid.reload(grid.url, {savePage: true});
		if (arguments.length === 3)
			grid.reload(url, Object.assign({},data,{savePage: true}));
	};
	var reloadWithData = function reloadWithData(id, data) {
		reload(id, null, data);
	};
	var removeAllRow = function removeAllRow(id) {
		// 删除所有行
		var grid = getGrid(id);
		if (!grid) return;
		var dataSource = grid.getData('dataSource');
		grid.changeData({ dataSource: [], selectedRowKeys:[], selectedRows:[] });
	};
	var selectAll = function selectAll(id) {
		// 选择所有行
		var grid = getGrid(id);
		if (!grid) return;
		var dataSource = grid.getData('dataSource');
		var data = [];
		for (var i = 0; i < dataSource.length; i++) {
			data.push(dataSource[i].id);
		}
		grid.changeData({ selectedRowKeys: data });
	};
	var selectFirstRow = function selectFirstRow(id) {
		// 选中第一行
		var grid = getGrid(id);
		if (!grid) return;
		grid.changeData({ selectedRowKeys: [grid.getData('dataSource')[0].id] });
	};
	var selectLastRow = function selectLastRow(id) {
		// 选中最后一行
		var grid = getGrid(id);
		if (!grid) return;
		var data = grid.getData('dataSource');
		grid.changeData({ selectedRowKeys: [data[data.length - 1].id] });
	};
	var countIndex = function countIndex(id) {
		var grid = getGrid(id);
		var data = grid.getData('dataSource');
		var selectedRowKeys = grid.getData('selectedRowKeys');
		selectedRowKeys = selectedRowKeys[selectedRowKeys.length - 1];
		for (var i = 0; i < data.length; i++) {
			if (data[i].id === selectedRowKeys) {
				return { len: data.length - 1, index: i };
			}
		}
		return !1;
	};
	var selectNext = function selectNext(id) {
		// 选中下一行
		var grid = getGrid(id);
		if (!grid) return;
		var json = countIndex(id);
		if (json.index < json.len) {
			var _grid = getGrid(id);
			var data = _grid.getData('dataSource');
			_grid.changeData({ selectedRowKeys: [data[json.index + 1].id] });
		}
	};
	var selectPrevious = function selectPrevious(id) {
		// 选中上一行
		var grid = getGrid(id);
		if (!grid) return;
		var json = countIndex(id);
		if (json.index > 0) {
			var _grid2 = getGrid(id);
			var data = _grid2.getData('dataSource');
			_grid2.changeData({ selectedRowKeys: [data[json.index - 1].id] });
		}
	};
	var selectRange = function selectRange(id, start, end) {
		// 选中一个范围
		var grid = getGrid(id);
		if (!grid) return;
		var data = grid.getData('dataSource').slice(start, end + 1);
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			arr.push(data[i].id);
		}
		grid.changeData({ selectedRowKeys: arr });
	};
	var getRow = function getRow(grid, index) {
		var pagination = grid.state.pagination;
		var data = grid.getData('dataSource');
		data = data.slice(pagination.pageSize * (pagination.current - 1));
		return data[index];
	};
	var selectRow = function selectRow(id, index) {
		// 选中一行
		var grid = getGrid(id);
		if (!grid) return;
		var data = getRow(grid, index);
		grid.changeData({ selectedRowKeys: [data] });
	};
	var selectRows = function selectRows(id, arr) {
		// 选中多行
		var grid = getGrid(id);
		if (!grid) return;
		var datas = [];
		var keys = [];
		for (var i = 0; i < arr.length; i++) {
			var data = getRow(grid, arr[i]);
			keys.push(data.key);
			datas.push(data);
		}
		grid.setState({ selectedRowKeys: keys,selectedRows: datas });
	};
	// 增加通用操作列,新增明细操作按钮
	var addOperationCol = function addOperationCol(editFun,deleteFun,detailFun,downloadFun) {
		// 编辑按钮
		var editButton = React.createElement(antd.Button, {
		    className: "edit",
		    type: "button",
		    onClick: function onClick() {
		    	editFun();
		    },
		    icon: "form"
		  });
		// 删除按钮
		var delButton = React.createElement(antd.Button, {
		    className: "delete",
		    onClick: function onClick() {
		    	deleteFun();
		    },
		    type: "button",
		    icon: "delete"
		  });
		// 明细按钮
		var detailButton = React.createElement(antd.Button, {
		    className: "detail",
		    onClick: function onClick() {
		    	detailFun();
		    },
		    type: "button",
		    icon: "profile"
		  });
		// 下载按钮
		var downloadButton = React.createElement(antd.Button, {
		    className: "download",
		    onClick: function onClick() {
		    	downloadFun();
		    },
		    type: "button",
		    icon: "download"
		  });
		var com = React.createElement(
		  "div",
		  null,
		  editButton,delButton
		);
		if (arguments.length === 3) {
			com = React.createElement(
			  "div",
			  null,
			  editButton,delButton,detailButton
			);
		}
		if (arguments.length === 4) {
			com = React.createElement(
			  "div",
			  null,
			  editButton,delButton,detailButton,downloadButton
			);
		}
		return com;
	};
	// 新增自定义文字操作列
	var addDescribeOperationCol = function addOperationCol1(describe, color, gridId, func) {
		var argumentLength = arguments.length;
		var colDescribe = React.createElement('a', {
		    onClick: function onClick() {
		    	if (argumentLength === 3) {
		    		gridId();
		    	}
		    	if (argumentLength === 4) {
		    		func();
		    		var grid = getGrid(gridId);
		    		if (!grid) return;
		    		grid.rowClickDisabled=true;// 禁止表格行点击事件
		    	}
		    },
		    style: {
		    	color: color,
		    	textDecoration:'underline',
		    	marginRight:'8px'
		    }
		  },describe);
		return colDescribe;
	};
	var getModifiedData = function getModifiedData(gridId) {
		var grid = getGrid(gridId);
		if (!grid) return;
		return grid.rowModify;
	};
	// 固定列中单元格可以显示的行数
	var setColumnCellRows = function setColumnCellRows(text,rows) {
		var column = React.createElement(base.FixedHeightColumn,
						{value:text,webkitLineClamp:rows}
					);
		return	column;
	};
	// 在指定行新增数据,'LAST'指在表格最后添加数据
	var addRowIndex = function addRowIndex(gridId,rowIndex,data) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		data = data || {};
		data.id = data.id || GRID.randomId();
		var dataSource = GRID.getDatas(gridId).slice(0);
		if (rowIndex == 'LAST') {
			dataSource.splice(dataSource.length, 0, data);
		} else {
			var pagination = grid.state.pagination;
			if (pagination.current) {
				rowIndex = (pagination.current - 1) * pagination.pageSize + rowIndex * 1;
			}
			dataSource.splice(rowIndex, 0, data);
		}
		grid.saveInsert(data);
		grid.changeData({ dataSource: dataSource });
	};
	// 在最前新增数据
	var addRowBefore = function addRowBefore(gridId,data) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var dataSource = GRID.getDatas(gridId).slice(0);
		var data = data || {};
		if (Object.prototype.toString.call(data) === "[object Array]") {
			for (var i=0; i<data.length; i++) {
				data[i].id = data[i].id || GRID.randomId();
				dataSource.splice(i, 0, data[i]);
				grid.saveInsert(data[i]);
			}
			grid.changeData({ dataSource: dataSource });
		} else {
			data.id = data.id || GRID.randomId();
			dataSource.splice(0, 0, data);
			grid.saveInsert(data);
			grid.changeData({ dataSource: dataSource });
		}
	};
	// 删除行
	var removeRow = function removeRow(gridId,index) {
		var argumentLength = arguments.length;
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var dataSource = GRID.getDatas(gridId).slice(0);
		var data = [];
		var delData = [];
		if (argumentLength === 1) {
			var indexs = GRID.getCurrentRowsIndex(gridId);
			for (var i = 0; i < dataSource.length; i++) {
				if (indexs.indexOf(i) === -1) {
					data.push(dataSource[i]);
					continue;
				}
				delData.push(dataSource[i]);
			}
		}
		if (argumentLength === 2) {
			var pagination = grid.state.pagination;
			if (pagination.current) {
				index = (pagination.current - 1) * pagination.pageSize + index * 1;
			}
			delData.push(dataSource[index]);
			dataSource.splice(index, 1);
			data = dataSource;
		}
		grid.saveDelete(delData);
		grid.changeData({ dataSource: data, selectedRowKeys:[], selectedRows:[] });
	};
	// 返回可编辑表格中当前被修改行的所有数据
	var getModifiedRowData = function getModifiedData(gridId) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var rowModify = grid.rowModify;
		if (rowModify) {
			for (var i=0;i<rowModify.length;i++) {
				for (var key in rowModify[i]) {
					rowModify[i][key] = "" + rowModify[i][key];
				}
			}
		}
		return {data:rowModify};
	};
	// 隐藏表格列
	var hiddenColumn = function hiddenColumn(gridId,columnId) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var newChild;
		var children = grid.state.children;
		if (children.length && children.length!=0) {
			if (Object.prototype.toString.call(columnId) === "[object Array]") {
				for (var i=0; i < columnId.length; i++) {
					// 遍历列
					newChild = children.map(function(child,index) {
						if (child.props.dataIndex === columnId[i]) {
							return React.cloneElement(child, { hidden:true})
						}
						return child;
					});
					children = newChild;
				}
			} else {
				// 遍历列
				newChild = children.map(function(child,index) {
					if (child.props.dataIndex === columnId) {
						return React.cloneElement(child, { hidden:true})
					}
					return child;
				});
			}
		} else {
			if (Object.prototype.toString.call(columnId) === "[object Array]") {
				for (var i=0; i < columnId.length; i++) {
					if (children.props.dataIndex === columnId[i]) {
						newChild= React.cloneElement(children, { hidden:true})
					} else {
						newChild = children;
					}
				}
			} else {
				if (children.props.dataIndex === columnId) {
					newChild= React.cloneElement(children, { hidden:true})
				} else {
					newChild = children;
				}
			}
		}
		grid.setState({children:newChild});
	};
	// 显示表格列
	var showColumn = function showColumn(gridId,columnId) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var newChild;
		var children = grid.state.children;
		if (children.length!=0) {
			// 遍历列
			newChild = children.map(function(child,index) {
				if (child.props.id === columnId) {
					return React.cloneElement(child, { hidden:false})
				}
				return child;
			});
		} else {
			if (children.props.id === columnId) {
				newChild= React.cloneElement(child, { hidden:false})
			} else {
				newChild = children;
			}
		}
		grid.setState({children:newChild});
	}
	return { getModifiedData:getModifiedData,addOperationCol:addOperationCol,getSelections:getSelections,clearSelections: clearSelections, deSelectRange: deSelectRange, deSelectRow: deSelectRow, blurQuery: blurQuery, getCurrentRowsCellData: getCurrentRowsCellData, getCurrentRowsData: getCurrentRowsData,
		getCurrentRowsIndex: getCurrentRowsIndex, getCurrentRowData: getCurrentRowData, getCurrentRowCellData: getCurrentRowCellData, getCurrentRowIndex: getCurrentRowIndex, getDatas: getDatas, getRowData: getRowData,
		queryLoad: queryLoad, reload: reload, removeAllRow: removeAllRow, selectAll: selectAll,
		selectFirstRow: selectFirstRow, selectLastRow: selectLastRow, selectNext: selectNext, selectPrevious: selectPrevious, selectRange: selectRange, selectRow: selectRow, selectRows: selectRows,getGrid:getGrid,randomId:randomId,addDescribeOperationCol:addDescribeOperationCol,
		setColumnCellRows:setColumnCellRows, addRowIndex: addRowIndex,addRowBefore: addRowBefore,removeRow: removeRow,getModifiedRowData: getModifiedRowData,hiddenColumn: hiddenColumn,showColumn: showColumn,reloadSavePage:reloadSavePage
	};
})();

var EDITGRID = (function () {
	// 在指定行新增数据
	var addRowIndex = function addRowIndex(gridId,rowIndex,data) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		data = data || {};
		data.id = data.id || GRID.randomId();
		var dataSource = GRID.getDatas(gridId).slice(0);
		console.log(dataSource);
		var pagination = grid.state.pagination;
		console.log(pagination);
		rowIndex = (pagination.current - 1) * pagination.pageSize + rowIndex;
		dataSource.splice(rowIndex, 0, data);
		grid.saveInsert(data);
		grid.changeData({ dataSource: dataSource }, data, 'insert');
	}
	// 在最前新增数据
	var addRowBefore = function addRowBefore(gridId,data) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var dataSource = GRID.getDatas(gridId).slice(0);
		var data = data || {};
		if (Object.prototype.toString.call(data) === "[object Array]") {
			for (var i=0; i<data.length; i++) {
				data[i].id = data[i].id || GRID.randomId();
				dataSource.splice(i, 0, data[i]);
				grid.saveInsert(data[i]);
			}
			grid.changeData({ dataSource: dataSource }, data.length);
		} else {
			data.id = data.id || GRID.randomId();
			dataSource.splice(0, 0, data);
			grid.saveInsert(data);
			grid.changeData({ dataSource: dataSource }, 1);
		}
	}
	// 删除行
	var removeRow = function removeRow(gridId) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var indexs = GRID.getCurrentRowsIndex(gridId);
		var dataSource = grid.getData('dataSource').slice(0);
		var data = [];
		var delData = [];
		for (var i = 0; i < dataSource.length; i++) {
			if (indexs.indexOf(i) === -1) {
				data.push(dataSource[i]);
				continue;
			}
			delData.push(dataSource[i]);
		}
		grid.saveDelete(delData);
		grid.changeData({ dataSource: data, selectedRowKeys:[], selectedRows:[] }, delData);
	}
	// 返回可编辑表格中当前被修改行的所有数据
	var getModifiedRowData = function getModifiedData(gridId) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		var rowModify = grid.rowModify;
		if (rowModify) {
			for (var i=0;i<rowModify.length;i++) {
				for (var key in rowModify[i]) {
					rowModify[i][key] = rowModify[i][key];
				}
			}
		}
		var mode = grid.mode;
		return {mode:mode,data:rowModify};
	}
	// 遍历表格获得可直接进行数据库操作的结果集供DAO.save使用
	var getModifiedRowDataForSave = function getModifiedRowDataForSave(gridId, insertSqlid, updateSqlid, delSqlid) {
		var modifiedData = getModifiedRowData(gridId);
		var mode = modifiedData.mode;
		var data = modifiedData.data;
		var paramsArray=[];
		for (var i in mode) {
			if (mode[i] === 'insert'){
				json = {
					sqlid:insertSqlid,
					data:data[i]
				};
				paramsArray.push(json);
			}
			if (mode[i] === 'update'){
				var json = {
					sqlid:updateSqlid,
					data:data[i]
				};
				paramsArray.push(json);
			}
			if (mode[i] === 'delete'){
				var json = {
					sqlid:delSqlid,
					data:data[i]
				};
				paramsArray.push(json);
			}
		}
		return paramsArray;
	}
	// 对表格指定的行设定数据
	setRowData=function(gridId,rowIndex,data) {
		var grid = GRID.getGrid(gridId);
		if (!grid) return;
		grid.onRowChange(rowIndex,data);
	}
	return {
		addRowBefore:addRowBefore,removeRow:removeRow,getModifiedRowData:getModifiedRowData,getModifiedRowDataForSave:getModifiedRowDataForSave,
		addRowIndex:addRowIndex,setRowData:setRowData
	};
})();

var EDITTREE = {
	// 在指定节点下新增孩子节点
	addChildNode:function(treeId,nodeId,data) {
		var tree = HK_WEB_COMMON.getReact(treeId);
		if (!tree) return;
		var dataSource = tree.state.treeTableData.slice(0);
		var nodeData=tree.getData(dataSource, nodeId);
		if (!nodeData) return;
		nodeData.children = nodeData.children || [];
		var data = data || {};
		if (Object.prototype.toString.call(data) === "[object Array]") {
			for (var i=0; i<data.length; i++) {
				data[i].id = data[i].id || GRID.randomId();
				nodeData.children.push(data[i]);
				tree.saveInsert(data[i]);
			}
			tree.setState({treeTableData: dataSource});
		} else {
			data.id = data.id || GRID.randomId();
			nodeData.children.push(data);
			tree.saveInsert(data);
			tree.setState({treeTableData: dataSource});
		}
	},
	// 在根节点下新增孩子节点
	addRootChildNode:function(treeId,data) {
		var tree = HK_WEB_COMMON.getReact(treeId);
		if (!tree) return;
		var dataSource = tree.state.treeTableData.slice(0);
		var data = data || {};
		if (Object.prototype.toString.call(data) === "[object Array]") {
			for (var i=0; i<data.length; i++) {
				data[i].id = data[i].id || GRID.randomId();
				dataSource.push(data[i]);
				tree.saveInsert(data[i]);
			}
			tree.setState({treeTableData: dataSource});
		} else {
			data.id = data.id || GRID.randomId();
			dataSource.push(data);
			tree.saveInsert(data);
			tree.setState({treeTableData: dataSource});
		}
	},
	// 根据nodeId移除节点
	removeNode:function(treeId,nodeId) {
		var tree = HK_WEB_COMMON.getReact(treeId);
		if (!tree) return;
		var dataSource = tree.state.treeTableData.slice(0);
		var removeNodes = [];
		if (Object.prototype.toString.call(nodeId) === "[object Array]") {
			for (var i=0; i<nodeId.length; i++) {
				EDITTREE.removeNode1(tree, nodeId[i], dataSource, removeNodes);
			}
		} else {
			EDITTREE.removeNode1(tree, nodeId, dataSource, removeNodes);
		}
		tree.saveDelete(removeNodes);
		tree.setState({treeTableData: dataSource});
	},
	removeNode1:function(tree, nodeId, dataSource, removeNodes) {
		var nodeData=tree.getData(dataSource, nodeId);
		if (removeNodes.indexOf(nodeData) == -1) {
			removeNodes.push(nodeData);
		}
		if (!nodeData) return;
		EDITTREE.getNodeChildren(nodeData.children, removeNodes);
		if (nodeData.belongto) {
			var parentData=tree.getData(dataSource, nodeData.belongto);
			parentData.children.splice(parentData.children.indexOf(nodeData),1);
		} else {
			dataSource.splice(dataSource.indexOf(nodeData),1);
		}
	},
	getNodeChildren:function(children, removeNodes) {
		if (children) {
			for (var i=0; i<children.length; i++) {
				if (removeNodes.indexOf(children[i]) == -1) {
					removeNodes.push(children[i]);
				}
				if (children[i].children && children[i].children.length !== 0) {
					EDITTREE.getNodeChildren(children[i].children, removeNodes);
				}
			}
		}
	},
	// 移除选择节点
	removeSelectNode:function(treeId) {
		var tree = HK_WEB_COMMON.getReact(treeId);
		if (!tree) return;
		var dataSource = tree.state.treeTableData.slice(0);
		var removeNodesId = [];
		var selectNodes = TREE.getCheckedDatas(treeId);
		for (var i = 0; i < selectNodes.length; i++) {
			removeNodesId.push(selectNodes[i].id);
		}
		EDITTREE.removeNode(treeId, removeNodesId);
	},
	// 返回可编辑表格树中当前被修改行的所有数据
	getModifiedRowData:function getModifiedData(treeId) {
		var tree = HK_WEB_COMMON.getReact(treeId);
		if (!tree) return;
		var rowModify = tree.rowModify;
		if (rowModify) {
			for (var i=0;i<rowModify.length;i++) {
				for (var key in rowModify[i]) {
					rowModify[i][key] = rowModify[i][key];
				}
			}
		}
		var mode = tree.mode;
		return {mode:mode,data:rowModify};
	}
}

WEBDAO={
	webSave:function(param,func){
		var json = {type:"object",json:param};
		if (Object.prototype.toString.call(param) === "[object Array]") {
			json.type = "array";
		}
		HK_WEB_COMMON.ajax(
			"api/rest/daoController/save",
			"post",
			{data:JSON.stringify(json)},
			function(ret1) {
				func(ret1);
			}
		);
	}
}

WEBSERVER={
	webGetList:function(param){
		var param1 = {sqlid:param.sqlid,data:param.data};
		HK_WEB_COMMON.ajax(
			"api/rest/serverController/getList",
			"post",
			{data:JSON.stringify(param1)},
			function(ret1) {
				if (param.callBack) {
					param.callBack(ret1);
				}
			}
		);
	},
	webGetMap:function(param){
		var param1 = {sqlid:param.sqlid,data:param.data};
		HK_WEB_COMMON.ajax(
			"api/rest/serverController/getMap",
			"post",
			{data:JSON.stringify(param1)},
			function(ret1) {
				if (param.callBack) {
					param.callBack(ret1);
				}
			}
		);
	},
}

Badge={
		addNum:function(id,value){
			var component = base.ComponentMap.get(id);
			if (component == null) {
				console.warn(id+"---构件不存在");
				return null;
			}
			console.log(value);
			value=value+1;
			component.changNum(value);
		},
		subNum:function(id,value){
			var component = base.ComponentMap.get(id);
			if (component == null) {
				console.warn(id+"---构件不存在");
				return null;
			}
			console.log(value);
			value=value-1;
			component.changNum(value);
		}
}

// 给构件赋数据方法
DATA={
		setGridData:function(id,data) { // 表格数据赋值
			var com = HK_WEB_COMMON.getReact(id);
			if (com) {
				com.rowModify = null;
				com.mode = null;
				com.dataSource = data;
				com.setState({dataSource: data});
			}
		},
		setTreeData:function(id,data) { // 树数据赋值
			var com = HK_WEB_COMMON.getReact(id);
			if (com) {
				var treeData = com.props.hasRoot
	            ? [
	                {
	                    "checkbox": false,
	                    "checked": false,
	                    "children": data,
	                    "cls": "forum",
	                    "data": {
	                        "id": com.rootEventKey,
	                        "text": com.props.defaultRootName,
	                        "height": 650,
	                        "width": 1024,
	                        "state": "2",
	                        "belongto": "personworks",
	                        "resizable": "1",
	                        "grade": 1,
	                        "url": "pageDemo/demo1/index.w.xhtml",
	                        "iconcls": null
	                    },
	                    "expanded": false,
	                    "iconCls": "",
	                    "id": com.rootEventKey,
	                    "leaf": false,
	                    "text": com.props.defaultRootName,
	                    "uiProvider": ""
	                }
	            ]
	            : data;
	            //是否需要展开所有的树结点
	            com.treeData = treeData;
	            com.props.defaultExpandAll && com.handleExpandAll(true,treeData);
	            com.getTreeNodes(treeData)
				com.setState({treeData: treeData});
	            if (com.checkedKeys) {
	            	com.handleChecked(com.checkedKeys);
	            }
			}
		},
		setMenuData:function(id,data) {// 菜单数据赋值
			var com = HK_WEB_COMMON.getReact(id);
			if (com) {
				com.child = com.renderMenuNodes(data);
				com.setState({
	                dataSource: data
	            });
			}
		},
		setSelectData:function(id,data) {// 选择器数据赋值
			var com = HK_WEB_COMMON.getReact(id);
			if (com) {
				var dataSource = data;
				// 对可查询下拉列表数据特殊处理，只加载前300条数据，防止数据量过多导致渲染时卡顿
				if (com.props.showSearch) {
					if (dataSource.length > 300) {
						var dataSourceTemp = [];
						for (var i = 0; i < 300; i++) {
							dataSourceTemp.push(dataSource[i]);
						}
						dataSourceTemp.push({code:"disabled",text:"...",disabled:"true"})
						dataSource = dataSourceTemp;
					}
				}
				com.setState({ dataSource: com.formatData(dataSource) })
			}
		},
		setCascaderData:function(id,data) {// 级联选择数据赋值
			var com = HK_WEB_COMMON.getReact(id);
			if (com) {
				var options = com.getAntdCascaderData(data);
				com.setState({
					options: options,
				});
			}
		},
		setTreeSelectData:function(id,data) {// 树选择数据赋值
			var com = HK_WEB_COMMON.getReact(id);
			if (com) {
		    	com.formatData(data)
		    	com.setState({ treeData: data })
			}
		}
}

DRAWER={
		drawers:{},
		showIds:new Stack(),
		showVisible:true,
		callbacks: {},
		// 关闭对话框
		close:function(){
			var showId = window.top.DRAWER.showIds.pop();
			window.top.DRAWER.get(showId).setState({
				visible:false
			});
			window.top.DRAWER.getCallback(showId) && window.top.DRAWER.getCallback(showId)("");
		},

		// 关闭对话框
		closeRetValue:function(value){
			var showId = window.top.DRAWER.showIds.pop();
			window.top.DRAWER.get(showId).setState({
				visible:false
			});
			window.base = window.oldBase;
			window.top.DRAWER.getCallback(showId) &&window.top.DRAWER.getCallback(showId)(value);
		},

		// 打开浮动的子窗口
		show:function(params) {
			var url = params.url; // 页面地址
			var length = params.length; // 抽屉长度，当方向为top或bottom时，此为高度；当方向为left或right时，此为宽度
			var title = params.title; // 标题
			var data = params.data; // 数据
			var maskClosable = params.maskClosable; // 点击蒙层是否允许关闭
			var placement = params.placement; // 方向
			var okFun = params.okClick;
			var cancalFun = params.cancalClick;
			var callback = params.callback;
			var wrapClassName = params.wrapClassName;
			var cancelText = params.cancelText;
			var confirmText = params.confirmText;
			window.top.DRAWER.show2(window,url,length,title,data,maskClosable,placement,wrapClassName,cancelText,confirmText,okFun,cancalFun,callback);
		},
		show2:function(originWindow,url,length,title,data,maskClosable,placement,wrapClassName,cancelText,confirmText,okFun,cancalFun,callback) {
			  var idStr = Date.now().toString(36)
			  idStr += Math.random().toString(36).substr(3,10);
			  var dialogContianer =  document.createElement('div');
			  dialogContianer.setAttribute("id", idStr);
			  document.body.appendChild(dialogContianer);
			  var AntdDrawer = antd.Drawer;
			  AntdDrawer = createReactClass({
				    getInitialState: function() {
				        this.state = Object.assign({}, this.props);
				        return this.state;
				    },
				    myOnClose:function() {
				    	DRAWER.close();
				    },
				    render:function() {
				    	var _this =this;
				    	var _extends = Object.assign || function (target) {
				    		for (var i = 1; i < arguments.length; i++) {
				    			var source = arguments[i];
				    			for (var key in source) {
				    				if (Object.prototype.hasOwnProperty.call(source, key)) {
				    					target[key] = source[key];
				    					}
				    				}
				    			}
				    		return target;
				    	};
				    	return React.createElement(antd.Drawer, _extends({}, _this.state, { onClose: _this.myOnClose }));
				    }
			  })
			  var frameId = idStr + "_iframe";
			  window.originWindow = originWindow;
			  var customOkFun = function() {
				   var originWindow = window.originWindow;
				   return function() {
					   var win = originWindow;
					   win.oldBase=win.base;
					   win.base = window.frames[frameId].contentWindow.base;
					   try {
						   okFun();
					   }catch(e) {

					   }
					   win.base = win.oldBase;
				   }
			  }
			  var customCancleFun = function() {
				   var originWindow = window.originWindow;
				   return function() {
					   var win = originWindow;
					   win.oldBase= win.base;
					   win.base = window.frames[frameId].contentWindow.base;
					   try {
						   cancalFun();
					   }catch(e) {

					   }
					   win.base = win.oldBase;
					   DIALOG.close()
				   }
			  }
			  var okF = customOkFun()
			  var cF = customCancleFun()
			  var cancelButton = React.createElement('button',
					  {
				  			className: 'ant-btn',
				  			type: 'button',
				  			onClick:cF,
				  			style:{marginRight:'8px'}
					  },
					  React.createElement('span', null, cancelText ? cancelText : '取 消'));
			  var confirmButton = React.createElement('button',
					  {
				  		className: 'ant-btn dialog-btn-primary ant-btn-primary',
				  		type: 'button',
				  		onClick: okF
					  },
					  React.createElement('span', null, confirmText ? confirmText : '确 定'));
			  var footer = null;
			  if (okFun) {
				  footer = React.createElement('div', {style:{position: 'absolute',left: '0px',bottom: '0px',width: '100%',borderTop: '1px solid rgb(233, 233, 233)',padding: '10px 16px',background: 'rgb(255, 255, 255)',textAlign: 'right'}}, cancelButton, confirmButton);
			  }
			  var dialog = ReactDOM.render(
					  React.createElement(
							  AntdDrawer,
							  {
							    id: idStr,
							    title: title,
							    visible: DRAWER.showVisible,
							    width: length,
							    height: length,
							    data: data,
							    destroyOnClose:true,
							    maskClosable: maskClosable,
							    className: wrapClassName ? wrapClassName : "",
							    placement: placement
							  },
							  React.createElement("iframe", {
							    src: url,
							    id: frameId,
							    frameBorder: "0",
							    width: "100%",
							    height: "100%",
							    scrolling: "no"
							  }),footer
							), dialogContianer);
			  DRAWER.showIds.push(idStr);
			  DRAWER.putCallback(idStr,callback); // 添加属性及值到dialogs内
			  DRAWER.put(idStr,dialog); // 添加属性及值到dialogs内
		},
		putCallback:function (id,callback){
			DRAWER.callbacks[id]=callback;
		},
		getCallback:function(id) {
			return DRAWER.callbacks[id];
		},
		put:function (id,dialog){
			DRAWER.drawers[id]=dialog;
		},
		get:function(id) {
			return DRAWER.drawers[id];
		},
		// 在子窗口获取父窗口的参数
		getParameter:function(){
			var showId = window.top.DRAWER.showIds.top();
			if (showId)
				return  window.top.DRAWER.get(showId).state.data;
		},
		getWindowId:function(){
			var showId = window.top.DRAWER.showIds.top();
			if (showId)
				return  window.top.DRAWER.get(showId).state.id;
		}
}
