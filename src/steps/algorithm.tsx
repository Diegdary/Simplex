import {type finalParameters,type completeSizes ,standardTable} from "./structures"

const getGreaterColumn =(typeObj:string,list:number[][],M:number)=>{
    let index = 1;
    const sumList = list.map((e)=> e[0]*M + e[1]);
    let typeFunc = (oldNum:number,newNum:number)=>newNum<oldNum;//Min
    if (typeObj == "Max") {
        typeFunc = (oldNum:number,newNum:number)=>newNum>oldNum;//Max
    }
    for (let i = 2; i < list.length; i++) {
        const oldNum:number = sumList[index];
        const newNum:number = sumList[i];
        if (typeFunc(oldNum,newNum)) {
            index=i;
        }
    }
    return index+2;
}

const getSelectedRow =(matrix:any[][],selectedColumn:number,sizes:{restLength:number,funcLength:number})=>{
    let selectedRow = NaN;
    for (let i = 2; i < sizes.restLength+2; i++) {
        const theta = matrix[i][2]/matrix[i][selectedColumn];
        matrix[i][sizes.funcLength+3]= theta;
        if(theta>=0 && isNaN(selectedRow)){
            selectedRow = i;
        }
        if (!isNaN(selectedRow) && theta > 0 && theta<matrix[selectedRow][sizes.funcLength+3]) {
            selectedRow = i;
        }
    }
    return {matrix:matrix,selectedRow:selectedRow};
}

const validTable = (typeObj:string,list:number[][],M:number):boolean=>{
    const sumList = list.map((e)=> e[0]*M + e[1]);
    let mainF = (num:number)=>num>=0;//Min
    if (typeObj == "Max"){
        mainF = (num:number)=>num<=0;
    }
    for (let i = 1; i < list.length; i++) {
        if(!mainF(sumList[i])){
            return false
        }
    }
    return true;
}

const iterate = (sizes:completeSizes,typeObj:string,matrix:any[][]|any[],lastAbstM:number[][])=>{
    let information = [{matrix:matrix,selectedRow:sizes.selectedRow,selectedColumn:sizes.selectedColumn}];
    let pivotColumn=sizes.selectedColumn;
    let pivotRow=sizes.selectedRow;
    let oldMatrix = structuredClone(matrix);// perhaps this one is not necessary
    let abstractM = structuredClone(lastAbstM);
    let outBounds = 0;
     while (!validTable(typeObj,abstractM,sizes.M) && outBounds<10) {
        //debugger
        let nextMatrix = structuredClone(oldMatrix);
        debugger
        nextMatrix[pivotRow][0]=nextMatrix[0][pivotColumn];
        nextMatrix[pivotRow][1]=nextMatrix[1][pivotColumn];
        //entry row
        for (let i = 2; i <= sizes.funcLength+2; i++) {
            nextMatrix[pivotRow][i] /= oldMatrix[pivotRow][pivotColumn];
        }
        for (let row = 2; row < sizes.restLength+2; row++) {
            if(row != pivotRow){
                for (let column = 2; column <= sizes.funcLength+2; column++) {
                    nextMatrix[row][column]= oldMatrix[row][column] - (oldMatrix[row][pivotColumn]*nextMatrix[pivotRow][column]);
                }
            }
        }
        
        nextMatrix[sizes.restLength+2] =["","Zj"];
        abstractM = [];
        const M_sign = new Map([["M",1],["-M",-1]]);
         for (let column = 2; column < sizes.funcLength + 3; column++) {
             let m_counter:number | string = 0;
             let non_M:number | string = 0;
             for (let row = 2; row < sizes.restLength + 2; row++) {
                 if (M_sign.has(nextMatrix[row][0])) {
                     m_counter += nextMatrix[row][column] * M_sign.get(nextMatrix[row][0])!;
                 }
                 else {
                     non_M += nextMatrix[row][column] * nextMatrix[row][0];
                 }
             }
             abstractM.push([m_counter, non_M]);
             m_counter= m_counter == Math.floor(m_counter)?m_counter:parseFloat(m_counter.toFixed(2));
             m_counter = m_counter == 0? "": m_counter+"M";
             non_M= non_M == Math.floor(non_M)?non_M:parseFloat(non_M.toFixed(2));
             non_M = non_M == 0? "": non_M;
             const addedVal = m_counter+non_M == ""?0: `${non_M}+${m_counter}`;
             nextMatrix[sizes.restLength + 2].push(addedVal);//CHANGE
         }
         nextMatrix[sizes.restLength + 2].push("")
         nextMatrix.pop();
         nextMatrix.push(["", "Cj-Zj", ""]);
         for (let i = 1; i <= sizes.funcLength; i++) {
             abstractM[i] = abstractM[i].map(e => e * -1);
             if (M_sign.has(nextMatrix[0][i + 2])) {
                 abstractM[i][0] += M_sign.get(nextMatrix[0][i + 2])!;
             }
             else {
                 abstractM[i][1] += nextMatrix[0][i + 2];
             }
             let m_counter:number|string= abstractM[i][1] == Math.floor(abstractM[i][0])?abstractM[i][1]:parseFloat(abstractM[i][0].toFixed(2));
             m_counter = m_counter == 0? "": m_counter+"M";
             let non_M:number|string= abstractM[i][0] == Math.floor(abstractM[i][1])?abstractM[i][0]:parseFloat(abstractM[i][1].toFixed(2));
             non_M = non_M == 0? "": non_M;
             const addedVal = m_counter+non_M == ""?0: `${non_M}+${m_counter}`;
             nextMatrix[nextMatrix.length - 1].push(addedVal);//CHANGE
         }
         nextMatrix[nextMatrix.length - 1].push("");
         
         pivotColumn = getGreaterColumn(typeObj,abstractM,sizes.M)
         const rowSelection = getSelectedRow(nextMatrix,pivotColumn,{restLength:sizes.restLength,funcLength:sizes.funcLength});
         pivotRow = rowSelection.selectedRow;
         nextMatrix = rowSelection.matrix;
         oldMatrix = nextMatrix;
         information.push({matrix:oldMatrix,selectedColumn:pivotColumn,selectedRow:pivotRow})
         outBounds++
     }
     return information;
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
    matrix.push(["","Zj"]);
    let abstractM:number[][] = [];
    const M_sign = new Map([["M",1],["-M",-1]])
    for (let column = 2; column < enter_values.funcObj.size+3; column++) {
        let m_counter:number | string =0;
        let non_M:number | string = 0;
        for (let row = 2; row < enter_values.restrictions.length+2; row++) {
            if(M_sign.has(matrix[row][0])){
                m_counter+= matrix[row][column] * M_sign.get(matrix[row][0])!;
            }
            else{
                non_M += matrix[row][column] * matrix[row][0];
            }
        }
        abstractM.push([m_counter,non_M])
        m_counter= m_counter == Math.floor(m_counter)?m_counter:parseFloat(m_counter.toFixed(2));
        m_counter = m_counter == 0? "": m_counter+"M";
        non_M= non_M == Math.floor(non_M)?non_M:parseFloat(non_M.toFixed(2));
        non_M = non_M == 0? "": non_M;
        const addedVal = m_counter+non_M == ""?0: `${non_M}+${m_counter}`;
        matrix[enter_values.restrictions.length+2].push(addedVal);//CHANGE
    }
    matrix[enter_values.restrictions.length+2].push("");
    matrix.push(["","Cj-Zj",""]);
    for (let i = 1; i <= enter_values.funcObj.size; i++) {
        
        abstractM[i] = abstractM[i].map(e=> e*-1);
        if (M_sign.has(matrix[0][i+2])) {
            abstractM[i][0]+= M_sign.get(matrix[0][i+2])!;
        }
        else{
            abstractM[i][1]+= matrix[0][i+2];
        }
        let m_counter:number|string= abstractM[i][1] == Math.floor(abstractM[i][0])?abstractM[i][1]:parseFloat(abstractM[i][0].toFixed(2));
        m_counter = m_counter == 0? "": m_counter+"M";
        let non_M:number|string= abstractM[i][0] == Math.floor(abstractM[i][1])?abstractM[i][0]:parseFloat(abstractM[i][1].toFixed(2));
        non_M = non_M == 0? "": non_M;
        const addedVal = m_counter+non_M == ""?0: `${non_M}+${m_counter}`;
        matrix[matrix.length-1].push(addedVal);//CHANGE
    }
    matrix[matrix.length-1].push("");
    const selectedColumn= getGreaterColumn(params.typeObj,abstractM,1000);
    const rowSelection=getSelectedRow(matrix,selectedColumn,{restLength:enter_values.restrictions.length,funcLength:enter_values.funcObj.size});
    matrix = rowSelection.matrix;
    const sizes= {M:1000,funcLength:enter_values.funcObj.size,restLength:enter_values.restrictions.length,selectedColumn:selectedColumn,selectedRow:rowSelection.selectedRow}; 
    

    console.log(matrix);
    
    let valueStack= iterate(sizes,params.typeObj,matrix,abstractM);
    let funcMap = new Map([["Z("+params.typeObj+")",valueStack[valueStack.length-1].matrix[enter_values.restrictions.length+2][2]]])
    for (let i = 2; i < sizes.restLength+2; i++) { 
            funcMap.set(valueStack[valueStack.length-1].matrix[i][1],valueStack[valueStack.length-1].matrix[i][2].toFixed(2));
    }
    for(const element of enter_values.funcObj.keys()){
        if (!funcMap.has(element)) {
            funcMap.set(element,0);
        }
    }
    let fMap = Array.from(funcMap);
    console.log(fMap)
    valueStack= valueStack.map((element)=>{
        let flatList:any[] = [];
        for (let i = 0; i < element.matrix.length; i++) {
            for (let j = 0; j < element.matrix[0].length; j++) {
                if(typeof(element.matrix[i][j]) == "number" && element.matrix[i][j] != Math.floor(element.matrix[i][j])){
                    flatList.push(element.matrix[i][j].toFixed(2));
                }
                else{
                    flatList.push(element.matrix[i][j])
                }
            }
            
        }

        return {matrix:flatList,selectedColumn:element.selectedColumn,selectedRow:element.selectedRow}
    });
    console.log(valueStack)
    
    const restListed = enter_values.restrictions.map(element=>Array.from(element))
    return {iterations:valueStack,columnSize:sizes.funcLength+4,standarized:{function:Array.from(enter_values.funcObj),restriction:restListed,fMap:fMap}};
}

export default simplex;