
export interface restriction{
    variableValues: string[] | number[],
    sign: "<="|">="|"=",
    constant: string | number
}

export interface finalParameters{
  typeObj: "Min"|"Max",
  finalFunc:number[],
  finalRestric:restriction[]
}

type ChangeArrayFn = <T>(array: T[], limit: number, alternative: T) => T[];
export const changeArray: ChangeArrayFn = (original,limit,alternative)=>{
    const new_list:typeof original = [];
    for (let i = 0; i < limit; i++) {
      if(i<original.length){
        new_list.push(original[i]);
      }
      else{
        new_list.push(alternative)
      }
    }
    return new_list;
  }

export interface completeSizes{
  M:number,
  restLength:number,
  funcLength:number,
  selectedRow:number,
  selectedColumn:number
} 

export const standardTable = {
  "Min":{
    "function":{
      ">=":{"S":0,"A":"M"},
      "<=":{"S":0},
      "=":{"A":"M"}
    },
    "restriction":{
      ">=":{"S":-1,"A":1},
      "<=":{"S":1},
      "=":{"A":1}
    }
  },
  "Max":{
    "function":{
      ">=":{"S":0,"A":"-M"},
      "<=":{"S":0},
      "=":{"A":"-M"}
    },
    "restriction":{
      ">=":{"S":-1,"A":1},
      "<=":{"S":1},
      "=":{"A":1}
    }
  }
}