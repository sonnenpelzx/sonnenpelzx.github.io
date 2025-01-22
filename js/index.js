const exp_debaters_input = document.getElementById("exp_debaters_input")
const nov_debaters_input = document.getElementById("nov_debaters_input")
const exp_debaters_input_submit = document.getElementById("exp_debaters_input_submit")
const nov_debaters_input_submit = document.getElementById("nov_debaters_input_submit")
const exp_debaters_list = document.getElementById("exp_debaters_list")
const nov_debaters_list = document.getElementById("nov_debaters_list")
const rooms_list = document.getElementById("rooms_list")
const leftovers = document.getElementById("leftovers")
const debate_format = document.getElementById("debate_format")
let exp_debaters = []
let nov_debaters = []
let format = "OPD"

debate_format.addEventListener("change", change_debate_format)
exp_debaters_input_submit.addEventListener("click", add_exp_debater)
nov_debaters_input_submit.addEventListener("click", add_nov_debater)

function change_debate_format(){
    format = debate_format.value
    render_debaters()
}

function add_exp_debater(){
   let input = exp_debaters_input.value
    exp_debaters.push(input)
    render_debaters()
}
function add_nov_debater(){
    let input = nov_debaters_input.value
    nov_debaters.push(input)
    render_debaters()
}

function render_debaters(){
    exp_debaters_list.innerHTML = ""
    nov_debaters_list.innerHTML = ""
    exp_debaters.forEach((debater, index) => {
        add_debater_to_list(debater, index, exp_debaters, exp_debaters_list, nov_debaters)
    })
    nov_debaters.forEach((debater, index) => {
        add_debater_to_list(debater, index, nov_debaters, nov_debaters_list, exp_debaters)
    })
    if(format === "BP"){
        let [rooms, lo] = create_BP_rooms()
        render_BP_rooms(rooms, lo)
    }
    else{
        let [rooms, lo] = create_OPD_rooms()
        render_OPD_rooms(rooms, lo)
    }
}

function add_debater_to_list(debater, index, array1, listDom1, array2){
        let li = document.createElement('li')
        let text = document.createElement('div')
        let del = document.createElement('button')
        let move = document.createElement('button')
        text.innerText = `${debater} `
        listDom1.appendChild(li)
        li.appendChild(text)
        text.appendChild(del)
        text.appendChild(move)
        del.innerText = "Delete"
        move.innerText = "move"
        del.onclick = function(){
            array1.splice(index, 1)
            render_debaters()
        }
        move.onclick = function(){
            li.remove()
            array1.splice(index, 1)
            array2.push(debater)
            render_debaters()
        }
}

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function appendArrays(array1, array2){
    let result = []
    array1.forEach((e) => result.push(e))
    array2.forEach((e) => result.push(e))
    return result
}

function create_BP_rooms(){
    let exp_dbs = exp_debaters.slice()
    shuffle(exp_dbs)
    let nov_dbs = nov_debaters.slice()
    shuffle(nov_dbs)
    let all_debaters = appendArrays(exp_dbs, nov_dbs)
    let number_of_rooms = Math.floor(all_debaters.length/8)
    let rooms = []
    for(let i = 0; i < number_of_rooms; i++){
        rooms.push([[], [], [], []])
    }
    for(let i = 0; i < number_of_rooms*8; i++){
        let room = Math.floor((i / 4)) % number_of_rooms
        let team = i%4
        rooms[room][team].push(all_debaters[i])
    }
    all_debaters.splice(0, number_of_rooms*8)
    return [rooms, all_debaters]
}

function render_BP_rooms(rooms, lo){
    rooms_list.innerHTML = ""
    rooms.forEach((r, room_index) => {
       let room = document.createElement('li')
        room.innerText = 'Room' 
        let ul = document.createElement('ul')
        for(let i = 0; i < 4; i++){
            let li = document.createElement('li')
            ul.appendChild(li)
            li.innerText = r[i]
        }
        room.appendChild(ul)
        rooms_list.appendChild(room)
    })
   leftovers.innerText = lo 
}

function render_OPD_rooms(rooms, lo){
    rooms_list.innerHTML = ""
    rooms.forEach((r, room_index) => {
       let room = document.createElement('li')
        room.innerText = 'Room' 
        let ul = document.createElement('ul')
        for(let i = 0; i < 2; i++){
            let li = document.createElement('li')
            ul.appendChild(li)
            li.innerText = r[i]
        }
        room.appendChild(ul)
        rooms_list.appendChild(room)
    })
   leftovers.innerText = lo 
}

function create_OPD_rooms(){
    let exp_dbs = exp_debaters.slice()
    shuffle(exp_dbs)
    let nov_dbs = nov_debaters.slice()
    shuffle(nov_dbs)
    let number_of_rooms = Math.floor((exp_debaters.length + nov_debaters.length)/6)
    let rooms = []
    for(let i = 0; i < number_of_rooms; i++){
        rooms.push([[],[]])
    }
    let first_ex = exp_dbs.slice(0, number_of_rooms * 2)
    let first_nov = nov_dbs.slice(0, number_of_rooms * 2)
    let last_debaters = appendArrays(exp_dbs.slice(number_of_rooms*2), nov_dbs.slice(number_of_rooms*2))
    while(first_ex.length < number_of_rooms * 2)
        first_ex.push(last_debaters.pop())
    while(first_nov.length < number_of_rooms * 2)
        first_nov.push(last_debaters.pop())
    shuffle(last_debaters)
    for(let i = 0; i < number_of_rooms * 2; i++){
        let room = Math.floor(i/2) % number_of_rooms
        let team = i % 2
        rooms[room][team].push(first_ex.pop())
        rooms[room][team].push(first_nov.pop())
        rooms[room][team].push(last_debaters.pop())
    }
    return [rooms, last_debaters]
}
