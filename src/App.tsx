import { useState } from 'react'
import "./extra_styles/index.css"


function App() {
  const [objective, setObjective] = useState("Min")

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
          Número de Variables: <input type="number" name="" id="nvariables" />
        </p>
        <p id='funcionObjetivo'> </p>
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
