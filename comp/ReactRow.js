







<component>
    <designCode>
    <![CDATA[
<hkDesign.Config>
<antd.Row className="row" id={Util.randomRangeId(10)}> 
    <hkDesign.Container id={Util.randomRangeId(10)}>


    </hkDesign.Container>
   
</antd.Row> 

    
    </hkDesign.Config>
]]>
    </designCode>

    <sourceCode>
    <![CDATA[
        <antd.Row className="row" id={Util.randomRangeId(10)} text="${params.content}"> 
           
        
        </antd.Row> 
    ]]>
    </sourceCode>
    <dialog>
        <tab name="基础配置">
             <label text="名称" />
			 <text key="text">
				
			 </text>	
        </tab>

        
    </dialog>
</component>
