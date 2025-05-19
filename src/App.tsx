import { useState } from 'react'
import "./styles/index.css"
import React from 'react'
import  { type restriction,type finalParameters, changeArray } from './steps/structures';
import simplex from './steps/algorithm';

function App() {
  const [objective, setObjective] = useState<string>("Min");
  const [func, setFunc] = useState<string[]>([]);
  const [restrictions, setRestriction] = useState<restriction[]>([]);//restrictions have every coeficient and the value they are being compared to.

   

  const funcController = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const current_length = parseInt(e.target.value);
    restSizeController((document.getElementById("nrestricciones") as HTMLInputElement)!, current_length);
    setFunc((last=>{
      const limit = current_length;
      return changeArray(last,limit,"1");
    }));
    
  }

  const funcValueController = (e: React.ChangeEvent<HTMLInputElement>,index:number)=>{
    const received =e.target.value;
    console.log(received)
    console.log(e.target.value);
    setFunc((last)=>{
      let new_list = [...last];
      new_list[index]= received;

      return new_list;
    })
  }

  const restSizeController = (e:HTMLInputElement,funcLength:number)=>{

    let limit:number = parseInt(e.value);
    
    setRestriction((last)=>{
      let new_restrictions:restriction[] = []
      for (let i = 0; i < limit; i++) {
        if (i < last.length) {
          //CREATE A FUNCTION THAT MAKES THIS SHIT AUTOMATICALLY
          let tmp_rest:string[] = changeArray(last[i].variableValues as string[], funcLength, "0");
          new_restrictions.push({constant:last[i].constant,sign:last[i].sign,variableValues:tmp_rest});
        }
        else{
          let element:string[] = [];
          for (let j = 0; j < funcLength; j++) {
            element[j]= "0";
          } 
          new_restrictions.push({constant:"0",sign:"<=",variableValues:element});
        }
      }
      return new_restrictions;
    });

  }

  const restValues = (e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>,mode:number, indexes:{parent:number,child?:number})=>{
    setRestriction((last)=>{
      const new_restriction = structuredClone(last);
      switch (mode) {
        case 0:
          new_restriction[indexes.parent].variableValues[indexes.child!] = e.target.value;
          break;
        case 1:
          new_restriction[indexes.parent].sign = e.target.value as restriction["sign"];
          break;
        case 2:
          new_restriction[indexes.parent].constant= e.target.value;
          break;
        default:
          alert("Something's wrong...");
          break;
      }
     
      return new_restriction;
    });
  }

  

  const noNegativityBuilder = (): React.JSX.Element[]=>{
    let new_list = [...func]
    new_list.pop();
    return new_list.map((value,index)=>(
            <p key={index}>X<sub>{index+1},</sub></p>
            ))
  }

  const compatibleData = (first_list:string[],second_list:restriction[]):finalParameters | null=>{
    
    let finalData:finalParameters = {finalFunc:[],finalRestric:second_list};
    if(!first_list.length || !second_list.length){
      return null;
    }
    //type casting of the function list:
    for (const num of first_list) {
      const item = parseFloat(num);
      if(isNaN(item)){
        return null;
      }
      finalData.finalFunc.push(item);
    }
    //type casting of the restriction list:
    for (let i = 0; i < second_list.length; i++) {
      for(let j=0; j < second_list[i].variableValues.length; j++){
        const item = parseFloat(second_list[i].variableValues[j] as string);
        if(isNaN(item)){
          return null
        }
        finalData.finalRestric[i].variableValues[j] = item;
      }
      const item =parseFloat(second_list[i].constant as string);
      if (isNaN(item)) {
        return null
      }
      finalData.finalRestric[i].constant = item;
    }
    console.log(finalData)
    return finalData;
  }

  const execution = (first_list:string[],second_list:restriction[])=>{
    let finalData=compatibleData(first_list,second_list);
    if(finalData){
      console.log("simplex!:")
      simplex(finalData);
    }
    else{
      alert("Datos no válidos.");
    }
    
  }

  return (
    <>
      <h1 className='title'>Método Simplex</h1>
      <div className='parameters'>
        <h2>Función Objetivo:</h2>
        <p id='objective'>Z(
          <select className='border_none' name="objective" id="obj" onChange={(e)=>{setObjective(e.target.value)}}>
            <option value="Max">Max</option>
            <option value="Min">Min</option>
          </select>)
        </p>
        <p>
          Número de Variables: <input type="number" id="nvariables" value={func.length} onChange={(e)=>{funcController(e)}} />
        </p>
        <div className='row' id='funcionObjetivo'>
          {func.map((value,index)=>(
              <p key={index}>
              <input type="number" id="" value={value} onChange={e => funcValueController(e,index)}/> X<sub>{index+1}</sub>
              </p>))}
          </div>
        <h2>
          Sujeto A:
        </h2>
        <p>
          Cantidad de Restricciones: <input type="number" name="" id="nrestricciones" value={restrictions.length} onChange={(e)=>{restSizeController(e.target,func.length)}} />
        </p>
        <div id='restricciones'>
            {restrictions.map((value,index)=>(
              <div className='row' key={index}>
                {value.variableValues.map((coef,each)=>(<p key={each}><input type="number" value={coef} onChange={e=>restValues(e,0,{parent:index,child:each})}/>X<sub>{each+1}</sub></p>))}
                <select className='border_none' id='random' name="" onChange={e=>{restValues(e,1,{parent:index})}}>
                  <option value="<=">&lt;=</option>
                  <option value=">=">&gt;=</option>
                  <option value="<">&lt;</option>
                  <option value=">">&gt;</option>
                  <option value="=">=</option>
                </select>
                <input type="number" value={value.constant} onChange={e=>{restValues(e,2,{parent:index})}}/>
              </div>)
            )}
        </div>
        <h2>No negatividad:</h2>
        <div className='row' id='NoNegatividad'>
          {noNegativityBuilder()}
          <p>X<sub>{func.length}</sub> &gt;= 0</p>
        </div>
        <div>
          <button onClick={()=>execution(func,restrictions)}>Aplicar</button>
        </div>
      </div>
    </>
  )
}

export default App
