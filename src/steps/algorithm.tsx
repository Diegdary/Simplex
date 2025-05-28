import {type finalParameters ,standardTable} from "./structures"

const getGreaterColumn =(typeObj:string,list:number[][],M:number)=>{
    let index = 1;
    const sumList = list.map((e)=> e[0]*M + e[1]);
    let typeFunc = (oldNum:number,newNum:number)=>newNum<oldNum;//Min
    if (typeObj == "Max") {
        typeFunc = (oldNum:number,newNum:number)=>newNum>oldNum;//Max
    }
    for (let i = 2; i < list.length+1; i++) {
        const oldNum:number = sumList[index];
        const newNum:number = sumList[i];
        if (typeFunc(oldNum,newNum)) {
            index=i;
        }
    }
    return index+2;
}

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
    return {funcObj:funcObj,restrictions:restrictions}
}

const simplex = (params:finalParameters)=>{
    const enter_values = standardize(params)
    let matrix:any[][] = [["","","Cj"],["Ci","Vb","Bi"]];
    //filling first table
    for (const value of enter_values.funcObj.values()) {
        matrix[0].push(value);
    }
    matrix[0].push("");
    for(const element of enter_values.funcObj.keys()){
        matrix[1].push(element);
    }
    matrix[1].push("Θi");
    //restrictions rows
    for (let i = 0; i < enter_values.restrictions.length; i++) {
        matrix.push([]);//new row
        const indexedRest= Array.from(enter_values.restrictions[i]);
        const lastRestVal = indexedRest[indexedRest.length-2][0];
        matrix[i+2].push(enter_values.funcObj.get(lastRestVal))
        matrix[i+2].push(lastRestVal);
        matrix[i+2].push(enter_values.restrictions[i].get('value'));
        for(const keyVar of enter_values.funcObj.keys()){
            let value= enter_values.restrictions[i].get(keyVar);
            value= value ? value : 0;
            matrix[i+2].push(value);
        }
        matrix[i+2].push("");
    }//Zj
    matrix.push(["","Zj"])
    let abstractM:number[][] = [];
    const M_sign = new Map([["M",1],["-M",-1]])
    for (let column = 2; column < enter_values.funcObj.size+3; column++) {
        let m_counter =0;
        let non_M = 0;
        for (let row = 2; row < enter_values.restrictions.length+2; row++) {
            if(M_sign.has(matrix[row][0])){//possible error
                m_counter+= matrix[row][column] * M_sign.get(matrix[row][0])!;
            }
            else{
                non_M += matrix[row][column] * matrix[row][0];
            }
        }
        abstractM.push([m_counter,non_M])
        matrix[enter_values.restrictions.length+2].push(`${non_M}+${m_counter}M`);//CHANGE
    }
    matrix[enter_values.restrictions.length+2].push("");
    matrix.push(["Cj-Zj",""]);
    for (let i = 1; i <= enter_values.funcObj.size; i++) {
        
        abstractM[i] = abstractM[i].map(e=> e*-1);
        if (M_sign.has(matrix[0][i+2])) {
            abstractM[i][0]+= M_sign.get(matrix[0][i+2])!;
        }
        else{
            abstractM[i][1]+= matrix[0][i+2];
        }
        matrix[matrix.length-1].push(`${abstractM[i][1]}+${abstractM[i][0]}M`);//CHANGE
    }
    
    const selectedColumn= getGreaterColumn(params.typeObj,abstractM,1000);
    let selectedRow = 2;
    for (let i = 2; i < enter_values.restrictions.length+2; i++) {
        const theta = matrix[i][2]/matrix[i][selectedColumn];
        matrix[i][enter_values.funcObj.size+3]= theta;
        if (theta > 0 && theta<matrix[selectedRow][enter_values.funcObj.size+3]) {
            selectedRow = i;
        }
    }

    console.log(abstractM)
    console.log(matrix);
    console.log("Column selected: " + getGreaterColumn(params.typeObj,abstractM,1000));
    console.log("Row selected: " + selectedRow)
}

export default simplex;