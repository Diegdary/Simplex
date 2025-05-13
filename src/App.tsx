import { useState } from 'react'
import "./extra_styles/index.css"
import React from 'react'
import type { restriction } from './structures/structures';

function App() {
  const [objective, setObjective] = useState<string>("Min");
  const [func, setFunc] = useState<number[]>([]);
  const [restrictions, setRestriction] = useState<restriction[]>([]);//restrictions have every coeficient and the value they are being compared to.

  const funcController = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const current_length = parseInt(e.target.value);
    restSizeController((document.getElementById("nrestricciones") as HTMLInputElement)!, current_length);
    setFunc((last=>{
      const limit = current_length;
      let t_list:number[] = [];
      for (let i = 0; i < limit; i++) {
        if (last.length>i) {
          t_list.push(last[i]);
        }
        else{
          t_list.push(1)
        }
      }
      return t_list;
    }));
    
  }

  const funcValueController = (e: React.ChangeEvent<HTMLInputElement>,index:number)=>{
    setFunc((last)=>{
      let new_list = [...last] 
      new_list[index]= parseInt(e.target.value)
      return new_list;
    })
  }

  const restSizeController = (e:HTMLInputElement,restLength:number)=>{
    console.log(e.value)
    console.log(restLength)
    let limit:number = parseInt(e.value);
    limit =  isNaN(limit)?0:limit;
    e.value = `${limit}`;
    setRestriction((last)=>{
      let new_restrictions:restriction[] = []
      for (let i = 0; i < limit; i++) {
        if (i < last.length) {
          let element:number[]= [];
          //CREATE A FUNCTION THAT MAKES THIS SHIT AUTOMATICALLY
          new_restrictions.push(last[i]);
        }
        else{
          let element:number[] = [];
          for (let j = 0; j < restLength; j++) {
            element[j]= 0;
          }
          new_restrictions.push({constant:0,sign:"<=",variableValues:element});
        }
      }
      return new_restrictions;
    });

  }

  const noNegativityBuilder = (): React.JSX.Element[]=>{
    let new_list = [...func]
    new_list.pop();
    return new_list.map((value,index)=>(
            <p key={index}>X<sub>{index+1},</sub></p>
            ))
  }

  return (
    <>
      <h1 className='title'>Método Simplex</h1>
      <div className='parameters'>
        <h2>Función Objetivo:</h2>
        <p id='objective'>Z(
          <select name="objective" id="obj" onChange={(e)=>{setObjective(e.target.value)}}>
            <option value="Max">Max</option>
            <option value="Min">Min</option>
          </select>)
        </p>
        <p>
          Número de Variables: <input type="number" id="nvariables" onChange={(e)=>{funcController(e)}} />
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
          Cantidad de Restricciones: <input type="number" name="" id="nrestricciones" onChange={(e)=>{restSizeController(e.target,func.length)}} />
        </p>
        <div id='restricciones'>
            {restrictions.map((value,index)=>(
              <div className='row' key={index}>
                {value.variableValues.map((coef,each)=>(<p key={each}><input type="number" value={coef}/>X<sub>{each+1}</sub></p>))}
                <select name="">
                  <option value="<=">&lt;=</option>
                  <option value=">=">&gt;=</option>
                  <option value="<">&lt;</option>
                  <option value=">">&gt;</option>
                  <option value="=">=</option>
                </select>
                <p>{value.constant}</p>
              </div>)
            )}
        </div>
        <h2>No negatividad:</h2>
        <div className='row' id='NoNegatividad'>
          {noNegativityBuilder()}
          <p>X<sub>{func.length}</sub> &gt;= 0</p>
        </div>
      </div>
    </>
  )
}

export default App
