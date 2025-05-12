import { useState } from 'react'
import "./extra_styles/index.css"
import React from 'react'


function App() {
  const [objective, setObjective] = useState<string>("Min")
  const [func, setFunc] = useState<number[]>([])
  const [restrictions, setRestriction] = useState<number[][]>([])

  const funcController = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setFunc((last=>{
      const limit = parseInt(e.target.value);
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
      console.log(new_list)
      return new_list;
    })
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
          Cantidad de Restricciones: <input type="number" name="" id="nrestricciones" />
        </p>
        <div>

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
