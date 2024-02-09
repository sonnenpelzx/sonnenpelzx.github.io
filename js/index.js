const plan = document.getElementById("plan");
const auswahl = document.getElementById("auswahl")
auswahl.addEventListener("change", newRender);
const schichtTyp = document.getElementById("schichtTyp")
schichtTyp.addEventListener("change", newRender);
const dateSelector = document.getElementById("dateSelector");
dateSelector.addEventListener("change", newRender)
let tableSize = 7
const vergleich = document.getElementById("vergleich")
vergleich.addEventListener("change", newRender)
const range = document.getElementById("range")
range.addEventListener("change", rangeChange)
//adebc
const schichtAblauf = ['s', 's', 's', '-', 'f', 'f', 'f', 'f', '-', 'n', 'n', 'n', 'n', '-', '-', 'f', 'f', 'f', '-', '-', 'n', 'n', 'n', '-', 's', 's', 's', 's', '-', '-', '-', '-', '-', '-', '-'] 
const schichtStart= new Date('1/2/2024');
const dayTranslate = {
                    0: "Sonntag",
                    1: "Montag",
                    2: "Dienstag",
                    3: "Mittwoch",
                    4: "Donnerstag",
                    5: "Freitag",
                    6: "Samstag",   
                }
const schichtBedeutung = {ot: 
                        {f: {
                            begin: 5,
                            end: 11 
                            },
                        s: {begin: 12,
                            end: 19
                        },
                        n: {begin: 20,
                            end: 4}
                        },  
                        oc:
                        {f:{ 
                            begin: 5,
                            end: 12 
                            },
                        s: {
                            begin: 13,
                            end: 19
                        },
                        n: {
                            begin: 20,
                            end: 4}
                        }}
const schichtOffset = { a: 0,
                        d: 7,
                        e: 21,
                        b: 14,
                        c: 28}

function getSchicht(plan, offset, schichtAuswahl){
    const today = (dateSelector.value) ? new Date(dateSelector.value): new Date();
    const diffTime = Math.abs(today - schichtStart);
    const diffDays = (Math.ceil(diffTime / (1000 * 60 * 60 * 24))  - 1  + schichtOffset[schichtAuswahl])% schichtAblauf.length;
    return plan[(offset + diffDays)%schichtAblauf.length]
}

function rangeChange(){
    tableSize = range.value
    generateTable()
}

function vergleichSchichten(){
    for(let i = -1; i < tableSize; i++){
        plan.rows[0].cells[i + 2].classList.remove("vergleich");
        plan.rows[0].cells[i + 2].classList.remove("vergleichZocken");
        plan.rows[0].cells[i + 2].classList.remove("vergleichTreffen");
    }
    if(vergleich.value === 'x'){
        return;
    }
    for(let offset = -1; offset < tableSize; offset++){
        if(getSchicht(schichtAblauf, offset, vergleich.value) === '-' && getSchicht(schichtAblauf, offset, auswahl.value) === '-' && getSchicht(schichtAblauf, offset -1, auswahl.value) != 'n' && getSchicht(schichtAblauf, offset -1, auswahl.value) != 'n'){
            plan.rows[0].cells[offset + 2].classList.add("vergleich");
        }
        else if((getSchicht(schichtAblauf, offset, vergleich.value) === 'f' && getSchicht(schichtAblauf, offset, auswahl.value) === '-') || (getSchicht(schichtAblauf, offset, vergleich.value) === '-' && getSchicht(schichtAblauf, offset, auswahl.value) === 'f') || (getSchicht(schichtAblauf, offset, vergleich.value) === 's' && getSchicht(schichtAblauf, offset, auswahl.value) === '-') || (getSchicht(schichtAblauf, offset, vergleich.value) === '-' && getSchicht(schichtAblauf, offset, auswahl.value) === 's')){
            plan.rows[0].cells[offset + 2].classList.add("vergleichZocken");
        }
        else if(getSchicht(schichtAblauf, offset, vergleich.value) === '-' || getSchicht(schichtAblauf, offset, auswahl.value) === '-'){
            plan.rows[0].cells[offset + 2].classList.add("vergleichTreffen");
        }
    }
}

function clearTable(){
    for(let i = 1; i <= 25; i++){
        const row = plan.rows[i]
        for(let j = 0; j <= tableSize; j++){
            const cell = row.cells[j + 1]
            cell.style.display = "table-cell"
            cell.rowSpan = "1"
            cell.classList.remove("schicht")
        }
    }
}

function showSchicht(){
    clearTable()
    for(let offset = -1; offset < tableSize; offset++){
        const schicht = getSchicht(schichtAblauf, offset, auswahl.value)
        if(schicht === '-'){
            continue
        }
        const begin = schichtBedeutung[schichtTyp.value][schicht].begin + 1;
        const end = schichtBedeutung[schichtTyp.value][schicht].end + 1;
        if(schicht === 'n'){
            plan.rows[begin].cells[offset + 2].rowSpan = `${25 - begin + 1}`
            plan.rows[begin].cells[offset + 2].classList.add("schicht")
            for(let i = begin + 1; i <= 25; i++){
                const row = plan.rows[i];
                row.cells[offset + 2].style.display = 'none';
            }
            if(offset < tableSize - 1){
                plan.rows[1].cells[offset + 3].rowSpan = `${end}`
                plan.rows[1].cells[offset + 3].classList.add("schicht")
                for(let i = 2; i <= end; i++){
                    const row = plan.rows[i];
                    row.cells[offset + 2].style.display = 'none';
                }
            }
        }
        else{
            plan.rows[begin].cells[offset + 2].rowSpan = `${end - begin + 1}`
            plan.rows[begin].cells[offset + 2].classList.add("schicht")
            for(let i = begin + 1 ; i <= end; i++){
                const row = plan.rows[i];
                row.cells[offset + 2].style.display = 'none';
            }
        }
    }   
}

function generateTable(){
    plan.innerHTML = ""
    const first = document.createElement("tr")
    first.appendChild(document.createElement("th"))
    plan.appendChild(first)
    for(let i = -1; i < tableSize; i++){
        const head = document.createElement("th");
        let date = (dateSelector.value) ? new Date(dateSelector.value): new Date();
        date.setDate(date.getDate() + i)
        if(window.screen.width >= 600){
            head.innerHTML = `${dayTranslate[date.getDay()]} ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`    
        }
        else{
            head.innerHTML = `${dayTranslate[date.getDay()].slice(0, 2)} ${date.getDate()}.${date.getMonth()}.`    
        }
        plan.rows[0].appendChild(head);
        plan.rows[0].cells[i + 2].classList.add("weekday")
    }
    for(let i = 0; i < 25; i++){
        const row = document.createElement("tr");
        let cell = document.createElement("td")
        const text = document.createTextNode(`${i}:00`)
        cell.appendChild(text)
        row.appendChild(cell)
        for(let j = 0; j <= tableSize; j++){
            cell = document.createElement("td");
            row.appendChild(cell)
        }
        plan.appendChild(row)
    }
    newRender()
}
function newRender(){
    for(let i = -1; i < tableSize; i++){
        let date = (dateSelector.value) ? new Date(dateSelector.value): new Date();
        date.setDate(date.getDate() + i)
        const head =  plan.rows[0].cells[i + 2]
        if(window.screen.width >= 600){
            head.innerHTML = `${dayTranslate[date.getDay()]} ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`    
        }
        else{
            head.innerHTML = `${dayTranslate[date.getDay()].slice(0, 2)} ${date.getDate()}.${date.getMonth()}.`    
        }
    }
    showSchicht();
    vergleichSchichten();
}
generateTable();