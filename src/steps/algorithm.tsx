import {type finalParameters, standardTable} from "./structures"

const standardize = (params:finalParameters)=>{
    let funcObj = new Map()
    let restrictions = [];
    let s_counter = 1;
    let a_counter = 1;
    //make FuncObj
    for (let i = 0; i < params.finalFunc.length; i++) {
        funcObj.set(`X${i+1}`,params.finalFunc[i]);
    }
    for(const restrict of params.finalRestric){
        const objFunInfo =standardTable[params.typeObj].function[restrict.sign];
        const objRestInfo =standardTable[params.typeObj].restriction[restrict.sign];
        let current_restriction= new Map();
        for (let i = 0; i < restrict.variableValues.length; i++) {
            current_restriction.set(`X${i+1}`,restrict.variableValues[i]);
        }
        for(const property in objFunInfo){
            if (property == "S") {
                funcObj.set(`S${s_counter}`,objFunInfo[property as keyof object]);
                current_restriction.set(`S${s_counter}`,objRestInfo[property as keyof object]);
                s_counter++;
                
            }
            else{
                funcObj.set(`A${a_counter}`,objFunInfo[property as keyof object]);
                current_restriction.set(`A${a_counter}`,objRestInfo[property as keyof object]);
                a_counter++;

            }
        }
        current_restriction.set("value",restrict.constant);
        restrictions.push(current_restriction);
    }
    console.log(funcObj);
    console.log(restrictions)
    for (const x of funcObj.keys()) {
        console.log(restrictions[1].get(x))
    }
}

const simplex = (params:finalParameters)=>{
    standardize(params)
}

export default simplex;