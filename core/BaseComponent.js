import React, { Component } from "react";
import ReactDOM from "react-dom";


export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.childrens = [];
        this.componentIds=[];
       
      }
}