import { useState } from 'react'
import "./extra_styles/index.css"


function App() {
  const [objective, setObjective] = useState("Min")
  const [func, setFunc] = useState<number[]>([])

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

  return (
    <>
      <h1 className='title'>Método Simplex</h1>
      <div className='parameters'>
        <h2>Función Objetivo:</h2>
        <p id='objective'>Z(
          <select name="objective" id="obj">
          <option value="Max">Max</option>
          <option value="Min">Min</option>
        </select>)
        </p>
        <p>
          Número de Variables: <input type="number" id="nvariables" onChange={(e)=>{funcController(e)}} />
        </p>
        <div id='funcionObjetivo'>
          {func.map((value,index)=>(
              <p key={index}>
              <input type="number" id="" value={func[index]} onChange={e => funcValueController(e,index)}/> X<sub>{index+1}</sub>
              </p>))}
          </div>
        <h2>
          Sujeto A:
        </h2>
        <p>
          Cantidad de Restricciones: <input type="number" name="" id="nrestricciones" />
        </p>
        <p id='NoNegatividad'></p>
      </div>
    </>
  )
}

export default App
