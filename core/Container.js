import React, { Component } from "react";
import ReactDOM from "react-dom";
import {default as BaseComponent} from "./BaseComponent";

import { default as DragUtil } from "./DragUtil";

export default class Container extends BaseComponent {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.state = Object.assign({}, props);
  }
  componentDidMount() {
    DesignComponentMap.put(this.id, this);
    DragUtil.addDrag();
  }
  componentDidUpdate() {
    DragUtil.addDrag();
  }
  merge = () => {
    let children = [];
    if (
      !Array.isArray(this.props.children) &&
      !Array.isArray(this.state.containerChild)
    ) {
      if (this.props.children == this.state.containerChild) {
        children = this.state.containerChild;
      }
    }
    if (
      Array.isArray(this.props.children) &&
      !Array.isArray(this.state.containerChild)
    ) {
      let exit = false;
      for (let i = 0; i < this.props.children.length; i++) {
        if (this.props.children[i] == this.state.containerChild) {
          exit = true;
        }
      }
      if (!exit) {
        children = this.props.children;
      }
    }
    if (
      !Array.isArray(this.props.children) &&
      Array.isArray(this.state.containerChild)
    ) {
      let exit = false;
      for (let i = 0; i < this.state.containerChild.length; i++) {
        if (this.props.children == this.state.containerChild[i]) {
          exit = true;
        }
      }
      if (!exit) {
        children = this.state.containerChild;
      }
    }
    if (
      Array.isArray(this.props.children) &&
      Array.isArray(this.state.containerChild)
    ) {
      for (let i = 0;i<this.props.children.length;i++) {
        children.push(this.props.children[i]);
      }
     
      for (let i = 0; i < this.state.containerChild.length; i++) {
        let exit = false;
        for (let j = 0; j < this.props.children.length; j++) {
          if (this.props.children[j] == this.state.containerChild[i]) {
            exit = true;
          }
        }
        if (!exit) {
          children.push(this.state.containerChild[i]);
        }
      }
    }
    console.log("container",this.props.children,this.state.containerChild,children);
    return children;
  };
  render() {
    console.log(this.childrens,"xxxxxxxxxxxxxxx");
    console.log(this.state.containerChild);
    let children = this.merge();
    return (
      <div className="hk-design-container" id={this.id}>
        {children}
      </div>
    );
  }
}
