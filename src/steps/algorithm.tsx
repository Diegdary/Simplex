import {type finalParameters, standardTable} from "./structures"

const standardize = (params:finalParameters)=>{
    let funcObj = new Map()
    let restrictions = []
    let s_counter = 1;
    let a_counter = 1;
    //make FuncObj
    for (let i = 0; i < params.finalFunc.length; i++) {
        funcObj.set(`X${i+1}`,params.finalFunc[i]);
    }
    for(const restrict of params.finalRestric){
        for(const property in standardTable[params.typeObj].function[restrict.sign]){
            
        }
        //funcObj.set()
    }
    console.log(funcObj);
}

const simplex = (params:finalParameters)=>{
    standardize(params)
}

export default simplex;