// console.log('s')

const api = 'https:appleseed-wa.herokuapp.com/api/users/'
let apiFirstArray = []
let apiSecondArray = []

let mainArray = []
let saveArrays = {}


const table = document.querySelector('#table')

// console.log(table)




getApiInfo()

async function getApiInfo() {

  const infoStage1 = await fetch(api)
  const info = await infoStage1.json()
  apiFirstArray = info
  // console.log(apiFirstArray)

  info.forEach(person => {
    getApiExtraInfo(person, info.length)
  });

  return true
}
async function getApiExtraInfo(person, n) {

  const infoStage2 = await fetch(api + (person.id).toString())
  const extraInfo = await infoStage2.json() //array
  apiSecondArray.push(extraInfo)

  if (n === apiSecondArray.length) {
    apiSecondArray = apiSecondArray.sort(function(a,b){
      return a.id - b.id
    })

    // console.log(apiSecondArray)
    return apiIsDone()
  }
}
function apiIsDone() {
  // console.log('lets start build my information center')

  for (let i = 0; i < apiFirstArray.length; i++) {
    let temp = {}
    temp.id = apiFirstArray[i].id
    temp.firstName = apiFirstArray[i].firstName
    temp.lastName = apiFirstArray[i].lastName
    temp.capsule = apiFirstArray[i].capsule
    temp.age = apiSecondArray[i].age
    temp.city = apiSecondArray[i].city
    temp.gender = apiSecondArray[i].gender
    temp.hobby = apiSecondArray[i].hobby

    mainArray.push(temp)
  }

  return makeTable()
}

function makeTable() {

  mainArray.forEach(person => {
    const tableRow = document.createElement('tr')

    tableRow.innerHTML = '<td>' + person.id + '</td>'
    tableRow.innerHTML = tableRow.innerHTML + '<td>' + person.firstName + '</td><td>' + person.lastName + '</td>'
    tableRow.innerHTML = tableRow.innerHTML + '<td>' + person.capsule + '</td><td>' + person.age + '</td>'
    tableRow.innerHTML = tableRow.innerHTML + '<td>' + person.city + '</td><td>' + person.gender + '</td><td>' + person.hobby + '</td>'

    table.appendChild(tableRow)
    let deleteButton = document.createElement('button')

    deleteButton.innerHTML = 'deleteButton'
    deleteButton.classList.add('btn')
    deleteButton.classList.add('delete')
    tableRow.appendChild(deleteButton)
    deleteButton.addEventListener('click', deleteRow)

    let updateButton = document.createElement('button')
    updateButton.innerHTML = 'updateButton'
    updateButton.classList.add('btn')
    updateButton.classList.add('update')
    tableRow.appendChild(updateButton)
    updateButton.addEventListener('click', updateRow)
  })
}

function deleteRow(e) {
  if (e.target.innerHTML === 'deleteButton') {
    table.removeChild(e.target.parentElement)
  }

  else {
    let currentRow = e.target.parentElement
    let currentDeleteBtn = e.target
    let currentUpdateBtn = currentRow.childNodes[9]

    let memory = saveArrays[currentRow.childNodes[0].innerHTML]

    currentUpdateBtn.innerHTML = 'updateButton'
    currentDeleteBtn.innerHTML = 'deleteButton'

    for (let i = 1; i < 8; i++) {
      currentRow.childNodes[i].innerHTML = memory[i-1]
    }
  }
}

function updateRow(e) {
  if (e.target.innerHTML === "updateButton") {
    let currentRow = e.target.parentElement
    let currentDeleteBtn = currentRow.childNodes[8]
    let currentUpdateBtn = e.target
    currentUpdateBtn.innerHTML = 'confirm'
    currentDeleteBtn.innerHTML = 'cancel'

    let saveArray = []
    for (let i = 1; i < 8; i++) {
      let x = currentRow.childNodes[i].innerHTML
      saveArray.push(x)
      currentRow.childNodes[i].innerHTML = '<input type="text" value="' + x + '">'
    }
    saveArrays[currentRow.childNodes[0].innerHTML] = saveArray
  }

  else {
    let currentRow = e.target.parentElement
    let currentDeleteBtn = currentRow.childNodes[8]
    let currentUpdateBtn = e.target

    currentUpdateBtn.innerHTML = 'updateButton'
    currentDeleteBtn.innerHTML = 'deleteButton'

    for (let i = 1; i < 8; i++) {
      let tempValue = currentRow.childNodes[i].childNodes[0].value
      currentRow.childNodes[i].innerHTML = tempValue
    }
  } 
}