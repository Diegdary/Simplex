export interface typeObjective{
    value: "Min"|"Max"
}

export interface restriction{
    variableValues: number[],
    sign: "<"|"<="|">"|">="|"="
    constant: number
}