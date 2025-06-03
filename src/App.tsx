import React, { useState } from 'react';
import './styles/index.css';
import {
  type restriction,
  type finalParameters,
  type finalValues,
  changeArray,
} from './steps/structures';
import simplex from './steps/algorithm';

function App(): React.JSX.Element {
  const [objective, setObjective] = useState<string>('Max');
  const [func, setFunc] = useState<string[]>([]);
  const [restrictions, setRestriction] = useState<restriction[]>([]);
  const [answer, setAnswer] = useState<{columnSize:number,iterations:finalValues[]}>({columnSize:0,iterations:[]});

  const updateFuncSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    const restrictionsInput = document.getElementById('nrestricciones') as HTMLInputElement;
    updateRestrictionsSize(restrictionsInput, newSize);
    setFunc((prev) => changeArray(prev, newSize, '1'));
  };

  const updateFuncValue = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    setFunc((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const updateRestrictionsSize = (e: HTMLInputElement, funcLength: number) => {
    const limit = parseInt(e.value);
    setRestriction((prev) => {
      const updated: restriction[] = [];
      for (let i = 0; i < limit; i++) {
        if (i < prev.length) {
          const vars = changeArray(prev[i].variableValues as string[], funcLength, '0');
          updated.push({ constant: prev[i].constant, sign: prev[i].sign, variableValues: vars });
        } else {
          updated.push({
            constant: '0',
            sign: '<=',
            variableValues: Array(funcLength).fill('0'),
          });
        }
      }
      return updated;
    });
  };

  const handleRestrictionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    mode: 0 | 1 | 2,
    { parent, child }: { parent: number; child?: number }
  ) => {
    setRestriction((prev) => {
      const updated = structuredClone(prev);
      switch (mode) {
        case 0:
          updated[parent].variableValues[child!] = e.target.value;
          break;
        case 1:
          updated[parent].sign = e.target.value as restriction['sign'];
          break;
        case 2:
          updated[parent].constant = e.target.value;
          break;
      }
      return updated;
    });
  };

  const renderFunctionInputs = (array: string[]): React.JSX.Element[] =>
    array.map((value, index) => (
      <p key={index}>
        <input
          type="number"
          value={value}
          onChange={(e) => updateFuncValue(e, index)}
        />
        X<sub>{index + 1}</sub>
        {index !== array.length - 1 ? ' + ' : ''}
      </p>
    ));

  const renderNonNegativity = (): React.JSX.Element[] =>
    func.map((_, index) => (
      <p key={index}>
        X<sub>{index + 1}</sub>
        {index !== func.length - 1 ? ', ' : ' ≥ 0'}
      </p>
    ));

  const parseData = (
    funcList: string[],
    restrictionsList: restriction[],
    objType: string
  ): finalParameters | null => {
    const result: finalParameters = {
      finalFunc: [],
      finalRestric: structuredClone(restrictionsList),
      typeObj: objType as finalParameters['typeObj'],
    };

    for (const num of funcList) {
      const parsed = parseFloat(num);
      if (isNaN(parsed)) return null;
      result.finalFunc.push(parsed);
    }

    for (let i = 0; i < result.finalRestric.length; i++) {
      const r = result.finalRestric[i];
      r.variableValues = r.variableValues.map((v) => {
        const parsed = parseFloat(v as string);
        if (isNaN(parsed)) throw new Error('Invalid value');
        return parsed;
      });
      const parsedConst = parseFloat(r.constant as string);
      if (isNaN(parsedConst)) return null;
      r.constant = parsedConst;
    }

    return result;
  };

  const runSimplex = () => {
    try {
      const data = parseData(func, restrictions, objective);
      if (!data) throw new Error('Datos no válidos');
      const result = simplex(data);
      setAnswer(result);
    } catch {
      alert('Datos no válidos.');
    }
  };

  return (
    <>
      <h1 className="title">Método Simplex</h1>
      <div className="parameters">
        <h2>Función Objetivo:</h2>
        <p id="objective">
          Z(
          <select
            className="border_none"
            name="objective"
            id="obj"
            onChange={(e) => setObjective(e.target.value)}
          >
            <option value="Max">Max</option>
            <option value="Min">Min</option>
          </select>
          )
        </p>

        <p>
          Número de Variables:{' '}
          <input type="number" id="nvariables" value={func.length} onChange={updateFuncSize} />
        </p>

        <div className="row" id="funcionObjetivo">
          {renderFunctionInputs(func)}
        </div>

        <h2>Sujeto A:</h2>
        <p>
          Cantidad de Restricciones:{' '}
          <input
            type="number"
            id="nrestricciones"
            value={restrictions.length}
            onChange={(e) => updateRestrictionsSize(e.target, func.length)}
          />
        </p>

        <div id="restricciones">
          {restrictions.map((r, index) => (
            <div className="row" key={index}>
              {r.variableValues.map((coef, i) => (
                <p key={i}>
                  <input
                    type="number"
                    value={coef}
                    onChange={(e) => handleRestrictionChange(e, 0, { parent: index, child: i })}
                  />
                  X<sub>{i + 1}</sub>
                  {i !== r.variableValues.length - 1 ? ' + ' : ''}
                </p>
              ))}
              <select
                className="border_none"
                value={r.sign}
                onChange={(e) => handleRestrictionChange(e, 1, { parent: index })}
              >
                <option value="<=">&lt;=</option>
                <option value=">=">&gt;=</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                value={r.constant}
                onChange={(e) => handleRestrictionChange(e, 2, { parent: index })}
              />
            </div>
          ))}
        </div>

        <h2>No negatividad:</h2>
        <div className="row" id="NoNegatividad">
          {renderNonNegativity()}
        </div>

        <button onClick={runSimplex}>Aplicar</button>
      </div>

      <div id="answer">
        {answer.iterations.map((table, i) => (
          <div
            key={i}
            style={{
              width: '80vw',
              height: '50vh',
              display: 'grid',
              gridTemplateColumns: `repeat(${answer.columnSize}, 1fr)`,
              gridAutoRows: '1fr',
            }}
          >
            {table.matrix.map((cell, j) => (
              <div key={j} className="grid-child">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
