function Component(){
    this.setSourceXml = function(sourceXml) {
        this.sourceXml = sourceXml;
    }
    this.getSourceXml = function() {
        return this.sourceXml;
    }
}

Util = {
    parserComponent(compId,compInfo) {
        let comp = new Component();
        comp.setSourceXml(compInfo);
        DesignComponentSourceMap.put(compId,comp);
    },
     loadReactComponent(containerId,index,url,compId) {
        $.ajax({
            type: "get",  
            url: url,  
            async:false,
            dataType: "text",  
            success: function(compInfo){  
                Util.parserComponent(compId,compInfo);
                var parser=new DOMParser(); 
                var xmlDoc=parser.parseFromString(compInfo,"text/xml"); 

                //提取数据 
                var designCode = xmlDoc.getElementsByTagName('designCode');                
                var container = DesignComponentMap.get(containerId);
                var reactObj = null;
                try {
                    reactObj = eval(babel.transform(designCode[0].textContent).code);
                }catch(e) {
                    console.error(e);
                }
                if (reactObj!=null) {
                    React.cloneElement
                    var obj = React.cloneElement(reactObj, {
                        id: Util.randomRangeId(10),
                        compId:compId
                      });
                    
                   var children =  container.state.containerChild;
                   container.childrens.push(obj);
                   container.componentIds.push(obj.props.id);
                   if (children != null) {
                     var newChildren = Util.addIndexArray(children,index,obj);

                     container.setState({containerChild:newChildren})
                   } else {
                     container.setState({containerChild:[obj]})
                   }
                  
                   
                }
                Util.addSortable();
                Util.addDialog();
            },
            error:function(e){  
                console.error(e);  
            }  
        })
    },
    //添加新的可以追加的容器
    addSortable() {
        $(".hk-design-container").sortable({
            opacity: .35,
            connectWith: ".hk-design-container"
        })
        //添加数据在数组制定位置
    },
     //添加弹出框配置
     addDialog() {
      
    },
   
    addIndexArray(array,index,obj) {
        var length = array.length;
        var newArray = [];
      
            for (var i = 0 ;i<length ;i++) {
                if (i == index) {
                    newArray.push(obj);
                } else {
                    newArray.push(array[i])
                }
            }
            newArray.push(array[length-1]);
        
        return newArray;
    },
    randomRangeId(num){
        var returnStr = "",       
            charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
        for(var i=0; i<num; i++){
            var index = Math.round(Math.random() * (charStr.length-1));
            returnStr += charStr.substring(index,index+1);
        }
        return returnStr;
    }
   
}


DesignComponentSourceMap = {
    map:{},
	 put(key,value){
		if (DesignComponentSourceMap.map == null) {
			DesignComponentSourceMap.map={};
		}
		if (DesignComponentSourceMap.map[key] !=null) {
			//console.warn(key+"已存在")
		}
		DesignComponentSourceMap.map[key]=value;
	},
	 get(key){
		if (DesignComponentSourceMap.map == null) {
			DesignComponentSourceMap.map={};
		}
		return DesignComponentSourceMap.map[key];
	}
}
DesignComponentMap = {
     map:{},
	 put(key,value){
		if (DesignComponentMap.map == null) {
			DesignComponentMap.map={};
		}
		if (DesignComponentMap.map[key] !=null) {
			//console.warn(key+"已存在")
		}
		DesignComponentMap.map[key]=value;
	},
	 get(key){
		if (DesignComponentMap.map == null) {
			DesignComponentMap.map={};
		}
		return DesignComponentMap.map[key];
	}
	
}