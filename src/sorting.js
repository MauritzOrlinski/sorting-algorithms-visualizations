let swaps = 0;
let time = 0;
let comparisons = 0;
let gotReset = false;
let isRunning = false;
let sleepTime = 10;
let selectedAlgorithm = "bubble-sort";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function updateVisualisation(array, currentIndexOfElement = -1, currentIndexOfElement2 = -1) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < array.length; i++) {
        addElementToVisualisation(array[i], i, array.length, i === currentIndexOfElement, i === currentIndexOfElement2);
    }
}

function addElementToVisualisation(size, pos, numberOfElements, mark, mark2) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width / numberOfElements;
    const height = size/100 * canvas.height;
    const y = canvas.height - height;
    const x = width * pos;
    if (mark) {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, width, height);
        return;
    } else if (mark2) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, width, height);
        return;
    }
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
}

function generateRandomArray(numberOfElements) {
    const array = [];
    for (let i = 0; i < numberOfElements; i++) {
        array.push(Math.floor(Math.random() * 100));
    }
    return array;
}

async function bubbleSort(array) {
    let currentTimestamp = new Date().getTime();
    for (let i = 0; i < array.length; i++) {
        for (let j = 1; j < (array.length - i); j++) {
            if (gotReset) {
                gotReset = false;
                return;
            }
            if (array[j - 1] > array[j]) {
                const temp = array[j - 1];
                array[j - 1] = array[j];
                array[j] = temp;
                updateVisualisation(array, j);
                await sleep(sleepTime);

                swaps++;
                time = new Date().getTime() - currentTimestamp;
                document.getElementById("iterations").innerHTML = swaps;
                document.getElementById("time").innerHTML = time;
            }
            comparisons++;
            document.getElementById("comparisons").innerHTML = comparisons;
        }
    }
    updateVisualisation(array);
    isRunning = false;
    if (isSorted(array)) {
        document.getElementById("isSorted").innerHTML = "True";
    }
}

async function insertionSort(array) {
    let currentTimestamp = new Date().getTime();
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            if (gotReset) {
                gotReset = false;
                return;
            }
            array[j+1] = array[j];
            array[j] = key;
            j--;
            updateVisualisation(array, j+1);
            await sleep(sleepTime);
            comparisons += 2;
            document.getElementById("comparisons").innerHTML = comparisons;
        }
        array[j+1] = key;
        swaps++;
        time = new Date().getTime() - currentTimestamp;
        document.getElementById("iterations").innerHTML = swaps;
        document.getElementById("time").innerHTML = time;
    }
}

async function selectionSort(array) {
    let currentTimestamp = new Date().getTime();
    for (let i = 0; i < array.length - 2; i++) {
        minmalElementIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (gotReset) {
                gotReset = false;
                return;
            }
            if (array[j] < array[minmalElementIndex]) {
                minmalElementIndex = j;
            }

            await sleep(sleepTime);
            updateVisualisation(array, minmalElementIndex, j);

            swaps++;
            comparisons++;
            document.getElementById("comparisons").innerHTML = comparisons;
            time = new Date().getTime() - currentTimestamp;
            document.getElementById("iterations").innerHTML = swaps;
            document.getElementById("time").innerHTML = time;
        }
        const tmp = array[minmalElementIndex];
        array[minmalElementIndex] = array[i];
        array[i] = tmp;
    }
}

function reset() {
    gotReset = true;
    isRunning = false;
    comparisons = 0;
    swaps = 0;
    time = 0;
    document.getElementById("iterations").innerHTML = swaps;
    document.getElementById("time").innerHTML = time;
    document.getElementById("comparisons").innerHTML = comparisons;
    document.getElementById("isSorted").innerHTML = "False";
    const numberOfElements = document.getElementById("input").value;
    updateVisualisation([]);
    document.getElementById("start-sort-btn").innerHTML = "Sort";
}

function sort() {
    document.getElementById("start-sort-btn").innerHTML = "Reset";
    if (isRunning) {
        reset();
        return;
    }
    isRunning = true;
    let numberOfElements = document.getElementById("input").value;
    if (isNaN(numberOfElements) || numberOfElements === "" || numberOfElements < 0) {
        alert("Must input an Integer, otherwise the default value of 100 will be used.");
        numberOfElements = 100;
    }
    document.getElementById("arraySize").innerHTML = numberOfElements;
    array = generateRandomArray(numberOfElements);
    document.getElementById("isSorted").innerHTML = "False";
    updateVisualisation(array);
    if (selectedAlgorithm === "bubble-sort") {
        document.getElementById("sortingAlgorithm").innerHTML = "Bubble Sort";
        bubbleSort(array);
    }
    else if (selectedAlgorithm === "insertion-sort") {
        document.getElementById("sortingAlgorithm").innerHTML = "Insertion Sort";
        insertionSort(array);
    }
    else if (selectedAlgorithm === "selection-sort") {
        document.getElementById("sortingAlgorithm").innerHTML = "Selection Sort";
        selectionSort(array);
    }
}

async function isSorted(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i+1] < array[i]) {
            updateVisualisation(array, i+1)
            return false;
        }
        updateVisualisation(array, -1,  i)
        await sleep(sleepTime/2)
    }
    updateVisualisation(array)
    return true;
}

function updateSettings() {
    sleepTime = document.getElementById("speed").value;
    if (isNaN(sleepTime) || sleepTime < 0) {
        alert("Must input an Integer for the wait time, otherwise the default value of 10 will be used.");
        sleepTime = 10;
    }
    selectedAlgorithm = document.getElementById("sorting-algorithm").value;
    reset();
}