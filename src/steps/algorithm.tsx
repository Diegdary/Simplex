import {type finalParameters} from "./structures"

const standardize = (params:finalParameters)=>{
    let funcObj = new Map()
    let restrictions = []
    //make FuncObj
    for (let i = 0; i < params.finalFunc.length; i++) {
        funcObj.set(`X${i+1}`,params.finalFunc[i]);
    }
    console.log(funcObj);
}

const simplex = (params:finalParameters)=>{
    standardize(params)
}

export default simplex;