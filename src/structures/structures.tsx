export interface typeObjective{
    value: "Min"|"Max"
}

export interface restriction{
    variableValues: number[],
    sign: "<"|"<="|">"|">="|"="
    constant: number
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