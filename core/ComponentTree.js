import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Menu, Icon } from "antd";
import { default as DragUtil } from "./DragUtil";
import reqwest from 'reqwest';
const { SubMenu } = Menu;

export default class ComponentTree extends Component {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.state = Object.assign({}, props);
  }

  componentDidMount() {
		DesignComponentMap.put(this.id, this);
		reqwest({
			url: this.state.url,
			method: 'get',
			data: {},
			type: 'json'
		}).then((res) => {	
				this.setState({
					data: res.data
				});		
		});
		DragUtil.addDrag();
	}

  isLeaf(node) {
    if (node.children != null && node.children.length > 0) {
      return false;
    }
    return true;
	}
	treeOpen=()=> {
		DragUtil.addDrag();
	}
  getTree(data) {
    return data.map(item => {
      if (this.isLeaf(item)) {
        return (<Menu.Item className="hk-design-drager" id={item.id} key={item.id}> 
            <div url={item.url}>{item.text}</div>
        </Menu.Item>)
      } else {
        return (
        <SubMenu key={item.id} title={<span>{item.text}</span>}>
          {this.getTree(item.children)}
        </SubMenu>
				)
      }
    });
  }
  render() {
    let tree = this.getTree(this.state.data);
    return (
      <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}  onOpenChange={this.treeOpen} forceSubMenuRender={true}>
        {tree}
      </Menu>
    );
  }
}

ComponentTree.defaultProps = {
  // defaultValue:　undefined,
  data:　[],
}