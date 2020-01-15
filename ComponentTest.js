import React, { Component } from "react";
import ReactDOM from "react-dom";

import { default as ComponentTree } from "./core/ComponentTree";
import { default as Container } from "./core/Container";
import { default as Config } from "./core/Config";
import { Layout, Menu, Breadcrumb, Icon, Button } from "antd";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

window.hkDesign = {};
window.hkDesign.Container = Container;
window.hkDesign.Config = Config;

function generaeteCode() {
  console.log("生成代码");
  var main = DesignComponentMap.get("container1");

  var sourceCode = "";
  main.childrens.map(function(o, i) {
    var compObj = DesignComponentMap.get(o.props.id);
    var params = compObj.state.params;
    var sourcComp = DesignComponentSourceMap.get(o.props.compId);

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(sourcComp.getSourceXml(), "text/xml");
    //提取数据
    var code = xmlDoc.getElementsByTagName("sourceCode")[0].textContent;
   
    if (params != null) {
      for (i in params) {
        var exp = "${params."+i+"}";
        code = code.replace(exp,params[i]);
      }
    }

    console.log(code);
  });
  console.log(sourceCode);
}
ReactDOM.render(
  <Layout>
    <Header className="header">
      <Button type="primary" onClick={generaeteCode}>
        生成代码
      </Button>
    </Header>
    <Layout>
      <Sider width={200} style={{ background: "#fff" }}>
        <ComponentTree url="json/tree.json" />
      </Sider>
      <Layout style={{ padding: "0 24px 24px", minHeight: "500px" }}>
        <Container id="container1" />
      </Layout>
    </Layout>
  </Layout>,
  document.getElementById("hk-app")
);
