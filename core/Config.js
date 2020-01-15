import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Modal } from "antd";
import { Form, Tabs, Input } from "antd";

const { TabPane } = Tabs;

export default class Config extends Component {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.state = Object.assign({}, props);
    this.update = false;
    this.containerChild = null;
  }
 
  componentDidMount() {
    DesignComponentMap.put(this.id, this);
  }
  click = e => {
    console.log("dd")
    if (e.target.className != "hk-design-config") {
      return false;
    }
    console.log(this, e.target);
    if (e.preventDefault) {
      e.preventDefault();
    }
    let conatinerId;
    try {
      if (this.props.children.props.children.props) {
        conatinerId = this.props.children.props.children.props.id;
      } else {
      }
    } catch (e) {
      console.warn(e);
    }

    if (!this.state.showDialog) {
      this.setState({
        showDialog: true,
        conatinerId: conatinerId
      });
    }
  };
  componentDidUpdate() {
    if (this.state.refresh) {
      var compId = this.props.children.props.id;
      var comp = base.ComponentMap.get(compId);
      if (comp != null) {
        comp.setState({ content: this.state.params.content});
      }
    }
    if (this.update) {
      let conatinerComp = window.DesignComponentMap.get(this.state.conatinerId);
      conatinerComp.setState({ containerChild: this.containerChild });
    }
  }
  handleOk = e => {
    var json = FORM.getFormDataMapping("HCcCayZdOo");
    console.log(json);
    this.setState({
      showDialog: false,
      refresh: true,
      params: json
    });
  };

  handleCancel = e => {
    this.setState({
      showDialog: false
    });
  };

  render() {
    console.log(this, "1111111111111111");
    let child = this.props.children;
    if (this.state.conatinerId != null) {
      let conatinerComp = window.DesignComponentMap.get(this.state.conatinerId);
      let conatinerChild = conatinerComp.state.containerChild;

      let container = child.props.children;
      container = React.cloneElement(container, {
        children: conatinerChild
      });
      this.update = true;
      this.containerChild = conatinerChild;

      console.log(window.DesignComponentMap);
      child = React.cloneElement(child, {
        children: container
      });
      console.log(child);
    } else {
      this.update = false;
    }

    if (this.state.showDialog) {
      return (
        <div
          className="hk-design-config"
          id={this.id}
          onClick={this.click}
          style={{ border: "2px solid red" }}
        >
          <div>
            <Modal
              title="Basic Modal"
              visible={true}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Tabs tabPosition={this.state.tabPosition}>
                <TabPane tab="Tab 1" key="1">
                  <base.FixedColForm
                    id="HCcCayZdOo"
                    width="100%"
                    height="100%"
                    style={{}}
                  >
                    <base.Input
                      name="content"
                      fieldLabel="xx"
                      id="content"
                      value="dddhhhhhh"
                      width="200"
                      inputWidth="120"
                      readOnly={false}
                      type="text"
                      size="default"
                      style={{}}
                    ></base.Input>
                  </base.FixedColForm>
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                  <base.FixedColForm
                    id="HCcCayZdOo"
                    width="100%"
                    height="100%"
                    style={{}}
                  >
                    <base.Input
                      name="content"
                      fieldLabel="xx"
                      id="content"
                      value="dddhhhhhh"
                      width="200"
                      inputWidth="120"
                      readOnly={false}
                      type="text"
                      size="default"
                      style={{}}
                    ></base.Input>
                  </base.FixedColForm>
                </TabPane>
              </Tabs>
            </Modal>

            {child}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="hk-design-config"
          id={this.id}
          onClick={this.click}
          style={{ border: "2px solid red" }}
        >
          {child}
        </div>
      );
    }
  }
}
