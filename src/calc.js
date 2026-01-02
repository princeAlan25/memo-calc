//function to set numbers into entry dv space element
let allEndlessId = [];
if(window.sessionStorage.getItem("endlessId")){
    allEndlessId = JSON.parse(window.sessionStorage.getItem("endlessId"))
}else{
    window.sessionStorage.setItem("endlessId",JSON.stringify([]))
}


let allNumbersHistory = [];
let allSolutions = [];
let allOperators = [];
let allSavedFlowCharts = [];
let sequentialCalculation = false;
let operatorSign = "";
const historySide = document.getElementsByClassName("history-side")[0];
const flowChartSpace = document.getElementById("history-flowchart");

if(window.sessionStorage.getItem("allSavedFlowCharts")){
    allSavedFlowCharts = JSON.parse(window.sessionStorage.getItem("allSavedFlowCharts"))
    flowChartSpace.innerHTML = allSavedFlowCharts.join("")
}else{
    window.sessionStorage.setItem("allSavedFlowcharts",JSON.stringify([]))
}

//initiate session storage
let allHistory = [];
if(window.sessionStorage.getItem("allFlowChartHistory")){
    allHistory = JSON.parse(window.sessionStorage.getItem("allFlowChartHistory"))
    historySide.innerHTML = allHistory.join("")
}else{
    window.sessionStorage.setItem("allFlowChartHistory",JSON.stringify([]))
}

let operatorRepeated = false;
let startedOperatorBasedCalc = false;
let firstStrNum = "";
const entryElement = document.getElementById("entry-input")
function loadClickedNumber(numberId){
    const clickedButton = document.getElementById(numberId)
    startedOperatorBasedCalc = true;
    if(operatorRepeated){
        entryElement.value = ""
        firstStrNum = ""
        entryElement.value +=clickedButton.innerHTML;
        operatorRepeated = false;
    }else{
        entryElement.value +=clickedButton.innerHTML;
    }
}

//function to delete each last number
function deleteLastNumber(){
    let numberCopy = entryElement.value.split("")
    numberCopy.pop()
    entryElement.value = numberCopy.join("")
}

//function to clear whole calculated draft without saving
function clearWholeCalculation(){
    entryElement.value = "";
    firstStrNum = "";
    allNumbersHistory = [];
    allOperators = [];
    allSolutions = [];
    operatorSign = "";
    sequentialCalculation = false;
    allSavedFlowCharts = [];

}

//function to assign dot into entry 
function assignDotOperator(){
    if(entryElement.value.length < 1){
        entryElement.value = "0."
    }else if(entryElement.value.match(/\./gi)){
    }else{
        entryElement.value+="."
    }
}

//function to toggle negative/positive operator
let isPositiveNumber = true;
function changeNumberQuality(){
    isPositiveNumber=!isPositiveNumber;
    if(!isPositiveNumber){
        let negative = "-"+entryElement.value;
        entryElement.value = negative;
    }else{
        let splitter = entryElement.value.split("")
        splitter.splice(0,1);
        entryElement.value = splitter.join("")
    }
}

//function to perform operations
function loadOperationType(sign){

    let operator = document.getElementById(sign).innerHTML;
    operatorSign = operator;

    firstStrNum = parseFloat(entryElement.value);
    if(firstStrNum){
        allOperators.push(operator)
        entryElement.value = "";

        
        if(allSolutions.length <= 0){
            allSolutions.push(firstStrNum);
        }else{
            if(sequentialCalculation){
                if(startedOperatorBasedCalc){
                    matchCurrentOperator(allOperators[allOperators.length - 2]);
                    allNumbersHistory.push([allSolutions[allSolutions.length - 2],firstStrNum])
                }else{
                    operatorRepeated = true;
                    entryElement.value = allSolutions[allSolutions.length - 1];
                    startedOperatorBasedCalc = false;
                }
            }
            
        }
        sequentialCalculation = true;

    }
}

//function to extract operator and generate actual solution based on operator

function matchCurrentOperator(operator){

    switch(operator){

        case "+":
            operatorRepeated = true;
            allSolutions.push(allSolutions[allSolutions.length - 1] + firstStrNum);
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
            entryElement.value = allSolutions[allSolutions.length - 1];
        break;

        case "-":
            operatorRepeated = true;
            allSolutions.push(allSolutions[allSolutions.length - 1] - firstStrNum);
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
            entryElement.value = allSolutions[allSolutions.length - 1];
        break;

        case "/":
            operatorRepeated = true;
            allSolutions.push(allSolutions[allSolutions.length - 1] / firstStrNum);
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
            entryElement.value = allSolutions[allSolutions.length - 1];
        break;

        case "X":
            operatorRepeated = true;
            allSolutions.push(allSolutions[allSolutions.length - 1] * firstStrNum);
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
            entryElement.value = allSolutions[allSolutions.length - 1];
        break;

        case "x<sup>n</sup>":
            operatorRepeated = true;
            allSolutions.push(Math.pow(allSolutions[allSolutions.length - 1], firstStrNum));
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
            entryElement.value = allSolutions[allSolutions.length - 1];
        break;

        case "sqrt":
            operatorRepeated = true;
            allSolutions.push(Math.sqrt(allSolutions[allSolutions.length - 1], firstStrNum));
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
            entryElement.value = allSolutions[allSolutions.length - 1];
        break;

        default:
            operatorRepeated = true;
            entryElement.value = allSolutions[allSolutions.length - 1];
            startedOperatorBasedCalc = false;
        break;

    }

}

//function to save whole calculation history
function saveCalculation(){
    if(allSolutions.length > 0){
        const historyName = document.getElementById("operation-type");
        let historyExtractedName;
        if(historyName.value){
            historyExtractedName = historyName.value;
        }else{
            let date = new Date();

            historyExtractedName = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}: ${date.getMinutes()}: ${date.getMinutes()}`;
        }
        for(let init = 0;init<allNumbersHistory.length;init++){
            const twoNumbersSum = allNumbersHistory[init].reduce((sum,num)=>{
                switch(allOperators[init]){
                    case "+":
                        return sum+num;
                    break;
                    case "-":
                        return sum-num;
                    break;
                    case "/":
                        return sum/num;
                    break;
                    case "X":
                        return sum*num;
                    break;
                    case "sqrt":
                        return Math.sqrt(sum,num);
                    break;
                    case "x<sup>n</sup>":
                        return Math.pow(sum,num);
                    break;
                    default:
                        
                    break;
                }
                
            })
            const flowChart = `<div class="flowchart">
                                <p class="number-processor">
                                    <font>${allNumbersHistory[init][0]}</font>
                                    <font>${allOperators[init]}</font>
                                    <font>${allNumbersHistory[init][1]}</font>
                                </p>
                                <div class="flow-lines"></div>
                                <p class="structure-solution">${twoNumbersSum}</p>
                            </div>`
            allSavedFlowCharts.push(flowChart)
        }
        let subHistoryHolder = `<div id="history-flowchart${allHistory.length}" class="history-flowchart">
                                    <div class="history-title">
                                        <img src="./icon/restore.svg" alt="restore button" width="35" id="restore-history${allHistory.length}" onclick="restoreHistory(this.id)">
                                        <h4>${historyExtractedName}</h4>
                                        <img src="./icon/delete.svg" alt="remove button" width="35" id="delete-history${allHistory.length}" onclick="removeClickedHistory(this.id)">
                                    </div>
                                    ${allSavedFlowCharts.join("")}
                                </div>`
        allHistory.push(subHistoryHolder)
        window.sessionStorage.setItem("allFlowChartHistory",JSON.stringify(allHistory))

        historySide.innerHTML = allHistory.join("")

    }
    clearWholeCalculation()
}

//function to work on equal sign to generate solution.
function generateSolution(){

    let  firstNum;
    if(sequentialCalculation){
        firstNum = allSolutions[allSolutions.length - 1];
    }else{
        firstNum = parseFloat(firstStrNum);
    }
    let secondNum = parseFloat(entryElement.value)

    if(firstNum && secondNum){
        entryElement.value = "";
        allNumbersHistory.push([firstNum,secondNum])

        switch(operatorSign){
            case "+":
                entryElement.value = firstNum + secondNum;
                allSolutions.push(firstNum + secondNum);
            break;
            case "-":
                entryElement.value = firstNum - secondNum;
                allSolutions.push(firstNum - secondNum);
            break;
            case "X":
                entryElement.value = firstNum * secondNum;
                allSolutions.push(firstNum * secondNum);
            break;
            case "/":
                entryElement.value = firstNum / secondNum;
                allSolutions.push(firstNum / secondNum);
            break;
            case "x<sup>n</sup>":
                entryElement.value = Math.pow(firstNum, secondNum);
                allSolutions.push(Math.pow(firstNum, secondNum));
            break;
            case "sqrt":
                entryElement.value = Math.sqrt(firstNum, secondNum);
                allSolutions.push(Math.sqrt(firstNum, secondNum));
            break;
        }
        sequentialCalculation = false;
    }
    
}

//function to restore the history
function restoreHistory(restoreButtonId){
    const clickedHistory = allHistory.filter((history)=>{
        let matcher = history.match(restoreButtonId);
        if(matcher){
            return true;
        }else{
            return false;
        }
    })[0];
    let matchAllSolutions = clickedHistory.match(/(\d.*\d+)/gi)
    let finalSolution = parseFloat(matchAllSolutions[matchAllSolutions.length - 1])
    entryElement.value = finalSolution;
    allHistory.splice(allHistory.indexOf(clickedHistory),1)
    let allHistoryLength = allHistory.length;
    let updatedHistory = [];
    for(let init = 0;init<allHistoryLength;init++){
        const eachUpdatedHistory = allHistory[init].replace("history-flowchart",`history-flowchart${init}`)
        updatedHistory.push(eachUpdatedHistory)
    }
    window.sessionStorage.setItem("allFlowChartHistory",JSON.stringify(updatedHistory))
    allHistory = JSON.parse(window.sessionStorage.getItem("allFlowChartHistory"))
    historySide.innerHTML = allHistory.join("")
}

//function to remove some chosen history
function removeClickedHistory(removeButtonId){

    const clickedHistory = allHistory.filter((history)=>{
        let matcher = history.match(removeButtonId);
        if(matcher){
            return true;
        }else{
            return false;
        }
    })[0];
    allHistory.splice(allHistory.indexOf(clickedHistory),1)
    let allHistoryLength = allHistory.length;
    let updatedHistory = [];
    for(let init = 0;init<allHistoryLength;init++){
        const eachUpdatedHistory = allHistory[init].replace("history-flowchart",`history-flowchart${init}`)
        updatedHistory.push(eachUpdatedHistory)
    }
    window.sessionStorage.setItem("allFlowChartHistory",JSON.stringify(updatedHistory))
    allHistory = JSON.parse(window.sessionStorage.getItem("allFlowChartHistory"))
    historySide.innerHTML = allHistory.join("")

}

