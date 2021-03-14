// console.log('s')

const api = 'https://appleseed-wa.herokuapp.com/api/users/'
// const proxyLink = 'https://api.allorigins.win/raw?url='
// const proxyLink = 'https://api.codetabs.com/v1/proxy?quest='
// const proxyLink = 'https://yacdn.org/proxy/'
// const proxyLink = 'http://alloworigin.com/get?url='

// const proxyLink = 'https://api.codetabs.com/v1/proxy/?quest='
// const proxyLink = ''

let apiFirstArray = []
let apiSecondArray = []

let mainArray = []
let saveArrays = {}


const table = document.querySelector('#table')
const searchDropDown = document.querySelector('#searchDropDown')
const searchTextBox = document.querySelector('#searchTextBox')
const tableHead = document.querySelector('#tableHead')

// console.log(tableHead)

// searchTextBox.addEventListener('click', searchEngine)
searchTextBox.addEventListener('keyup', searchEngineType)

function focusOnSearch() {
  searchTextBox.value = ''
}
function focusNotOnSearch() {
  searchTextBox.value = 'search...'
}

getApiInfo()

async function getApiInfo() {

  const infoStage1 = await fetch(proxyLink + api)
  // console.log(infoStage1)
  const info = await infoStage1.json()
  // console.log(info)
  // apiFirstArray = JSON.parse(info.contents)
  apiFirstArray = info

  console.log(infoStage1)
  info.forEach(person => {
    getApiExtraInfo(person, info.length)
  });

  // console.log(info)
  return true
}
async function getApiExtraInfo(person, n) {

  const infoStage2 = await fetch(proxyLink + api + (person.id).toString())
  const extraInfo = await infoStage2.json() //array
  // let extraInfo2 = JSON.parse(extraInfo.contents)
  apiSecondArray.push(extraInfo)

  if (n === apiSecondArray.length) {
    apiSecondArray = apiSecondArray.sort(function (a, b) {
      return a.id - b.id
    })
    // console.log(apiFirstArray)
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

  buildSearchDropDown()
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
    let currentRow = e.target.parentElement
    let idNumber = parseInt(currentRow.childNodes[0].innerHTML)

    let n = -1
    mainArray.forEach(element => {
      n++
      if (element.id === idNumber) {
        mainArray.splice(n, 1)
      }
    })
  }

  else {
    let currentRow = e.target.parentElement
    let currentDeleteBtn = e.target
    let currentUpdateBtn = currentRow.childNodes[9]

    let memory = saveArrays[currentRow.childNodes[0].innerHTML]

    currentUpdateBtn.innerHTML = 'updateButton'
    currentDeleteBtn.innerHTML = 'deleteButton'

    for (let i = 1; i < 8; i++) {
      currentRow.childNodes[i].innerHTML = memory[i - 1]
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



    //thats why i should have worked with classes : change the list of all existing people and their values is 
    // very hard to manipulate, because there is need to find the exact index in the original list 
    // + as each person is declared in object, its automatically orders it in alphabetic way
    // and later its impossoble simplly to match between the table and the array in the code... :

    let index = 0
    let idNumber = parseInt(currentRow.childNodes[0].innerHTML)
    let n = -1
    mainArray.forEach(element => {
      n++
      if (element.id === idNumber) {
        index = n
      }
    })

    let currnetObg = mainArray[index]
    let headers = document.querySelectorAll('th')

    for (let i = 1; i < 8; i++) {

      let x = headers[i].innerHTML
      if (x === 'first name') { // translate table name to object key name
        x = "firstName"
      }
      if (x === 'last name') {
        x = "lastName"
      }

      let tempValue = currentRow.childNodes[i].childNodes[0].value
      currentRow.childNodes[i].innerHTML = tempValue

      for (let key in currnetObg) {
        if (key === x) { //id,firstname,etc
          currnetObg[key] = tempValue //value
        }
      }
    }
    console.log(mainArray[index])
  }
}

//build search options
function buildSearchDropDown() {

  for (let key in mainArray[0]) {
    // console.log(key)
    searchDropDown.innerHTML = searchDropDown.innerHTML + '<option>' + key + '</option>'
  }
}

function searchEngineType() {
  console.log('s')

}