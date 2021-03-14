

/////////////////// ClASSES ///////////////////////////////////
class StudentList{
    constructor(){
        this.StudentArray = []
    }

    addStudent = (Student) =>{
        this.StudentArray.push(Student)
    }
}


class Student{

    constructor(id,firstName,lastName,capsule,age,city,gender,hobby){
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.capsule = capsule
        this.age = age
        this.city = city
        this.gender = gender
        this.hobby = hobby
    }


    print = () =>{
       console.log(`ID: ${this.id} FirstName: ${this.firstName} LastName: ${this.lastName} Capsule: ${this.capsule}`)
       console.log(`Age: ${this.age} City: ${this.city} Gender: ${this.gender} Hobby: ${this.hobby}`)
    }


   UpdateStudent = (firstName,lastName,capsule,age,city,gender,hobby) =>{
        this.firstName = firstName
        this.lastName = lastName
        this.capsule = capsule
        this.age = age
        this.city = city
        this.gender = gender
        this.hobby = hobby
    }
}


////////////////// VARIBALS

const SearchBar = document.querySelector('#searchBar')
const tbody = document.querySelector('#tbody')
const Table = document.querySelector('table')
const Th = document.querySelectorAll('th h1')
const proxy = 'https://api.allorigins.win/raw?url='
let studentList = new StudentList()
let upDateArray = []
let CancelArray =[]
let typeSearch = 'firstName'




////////////////// EVENTS
SearchBar.addEventListener('input', (p) =>{
    DeleteOldTable()
    if(studentList.StudentArray.length > 0){
        let SearchArray = studentList.StudentArray.filter(student =>{
            if(isNaN(student[typeSearch])){
                return student[typeSearch].includes(p.target.value)
            }
            else{
                let number = parseInt(p.target.value)
                return student[typeSearch] === number
            }

     })
     createTableData(SearchArray)
    }
})




const SearchOption = () =>{
    typeSearch = document.querySelector('select').value;
}



//////////////// FUNCTIONS
const GetStudentsNameID = async () =>{
    let request = await fetch(`${proxy}https://appleseed-wa.herokuapp.com/api/users/`)
    let responce = await request.json()
    return responce

} 


const GetSpecificStudentData = async (id) =>{
    let request = await fetch(`${proxy}https://appleseed-wa.herokuapp.com/api/users/${id}`)
    let responce = await request.json()
    return responce
}

const GetAllStudentDataHandler = async (students) =>{

    for(let i =0;i<students.length;i++){
        let studentdata = await GetSpecificStudentData(students[i].id)
        let student = new Student(students[i].id,students[i].firstName,students[i].lastName,students[i].capsule,studentdata.age,studentdata.city,studentdata.gender,studentdata.hobby) 
        studentList.addStudent(student)
    }
       
    return students
}


const createTableData = (arr) =>{
    tbody.innerHTML =''
    arr.forEach(p =>{
    let row = `<tr>
       <td>${p.id}</td>
       <td>${p.firstName}</td>
       <td>${p.lastName}</td>
       <td>${p.capsule}</td>
       <td>${p.age}</td>
       <td>${p.city}</td>
       <td>${p.gender}</td>
       <td>${p.hobby}</td>
       <td id=${p.id} type="delete">Delete</td>
       <td id=${p.id}>Update</td>
       </tr>`
       tbody.innerHTML += row
    })
    DeleteButtonEvent()

    for(let i=1;i<Table.rows.length;i++){
    UpdateButtonEvent(i)
    }
}


const DeleteStudentFromList = (id,arr) =>{
     id  =  parseInt(id)
    arr = arr.filter(p =>{
        return p.id !== id
    })
    return arr
}


const DeleteOldTable = () =>{
    const TDAll = document.querySelectorAll('td')
    TDAll.forEach(p =>{
        p.remove()
    })
}


const DeleteButtonEvent = () => {
    for(let i=1;i<Table.rows.length;i++){

        Table.rows[i].cells[8].addEventListener('click',(p) =>{
            
            Table.deleteRow(p.target.parentElement.rowIndex)
            studentList.StudentArray = DeleteStudentFromList(p.target.getAttribute('id'),studentList.StudentArray)
            
        })
    }
}



const UpdateButtonEvent = (i) =>{
   
     // the loop will change to outside the function
        Table.rows[i].cells[9].addEventListener('click',(p) =>{
            
            //Temporary Object for update will save in  upDateArray
            let StoreObject = {
                id:p.target.getAttribute('id'),
                index:p.target.parentElement.rowIndex
            }



            //Temporary Object for cancel update will save in  CanelArray
            let CancelObject = {
                id:p.target.getAttribute('id'),
                index:p.target.parentElement.rowIndex
            }
            upDateArray.push(StoreObject)
            let index = p.target.parentElement.rowIndex
            
            
            //create the rows with inputs
            for (let i = 1;i<p.target.parentElement.cells.length-2;i++){
                let value = Table.rows[index].cells[i].innerHTML
                CancelObject[Th[i].innerHTML] = value
                Table.rows[index].cells[i].innerHTML = `<input value=${value}>`  
            }   
            CancelArray.push(CancelObject)
            console.log(CancelArray)

            //Adding a Confirm Button and Cancel
            Table.rows[index].cells[8].remove()
            Table.rows[index].cells[8].remove() 
            let Confirm = document.createElement('td')
            let Cancel = document.createElement('td')
            Confirm.innerHTML = 'Confirm'
            Cancel.innerHTML = 'Cancel'
            Confirm.setAttribute('id',p.target.getAttribute('id'))
            Cancel.setAttribute('id',p.target.getAttribute('id'))
            Table.rows[index].appendChild(Confirm)
            Table.rows[index].appendChild(Cancel)
            


            //Event Lisntner for the confirm update
            Confirm.addEventListener('click',(p) =>{
                StoreObject = upDateArray.find(student => student.id === p.target.getAttribute('id'))
                CancelArray = CancelArray.filter(student => student.id !== p.target.getAttribute('id'))
                UpdateStudent(StoreObject)

            })

            Cancel.addEventListener('click',(p) =>{

                CancelObject = CancelArray.find(student => student.id === p.target.getAttribute('id'))
                upDateArray = upDateArray.filter(p => p.id !== CancelObject.id)
                CancelArray = CancelArray.filter(p => p.id !== CancelObject.id)
                creatNewRow(CancelObject)
            })            

    })

   
}





const UpdateStudent = (StoreObject) =>{
    const Th = document.querySelectorAll('th h1')
    for(let i=1;i<Table.rows[StoreObject.index].cells.length-2;i++){
        StoreObject[Th[i].innerHTML] = Table.rows[StoreObject.index].cells[i].firstElementChild.value
    } 
    //cleaning the update from the temporary array and assign the updates to the student
    let student =  studentList.StudentArray.find(p => p.id === parseInt(StoreObject.id))
    student.UpdateStudent(StoreObject['First Name'],StoreObject['Last Name'],StoreObject['Capsule'],parseInt(StoreObject['Age']),StoreObject['City'],StoreObject['Gender'],StoreObject['Hobby'])
    upDateArray = upDateArray.filter(p => p.id !== StoreObject.id)

    creatNewRow(StoreObject)
}


//Create new row with the updates
const creatNewRow = (StoreObject) =>{
    
    for(let i=1;i<Table.rows[StoreObject.index].cells.length-2;i++){
        Table.rows[StoreObject.index].cells[i].innerHTML = StoreObject[Th[i].innerHTML]
    }
    Table.rows[StoreObject.index].cells[8].remove() 
    Table.rows[StoreObject.index].cells[8].remove() 
    
    let Delete = document.createElement('td')
    Delete.innerHTML = 'Delete'
    Delete.setAttribute('id',StoreObject.id)
    Delete.setAttribute('type','delete')
    Table.rows[StoreObject.index].appendChild(Delete)
    Delete.addEventListener('click',(p) =>{
        Table.deleteRow(p.target.parentElement.rowIndex)
        studentList.StudentArray = DeleteStudentFromList(p.target.getAttribute('id'),studentList.StudentArray)
        
    })

    let Update = document.createElement('td')
    Update.innerHTML = 'Update'
    Update.setAttribute('id',StoreObject.id)
    Table.rows[StoreObject.index].appendChild(Update)
    UpdateButtonEvent(StoreObject.index) // need to change it to a single listner
}




const run = async () =>{
    let students = await GetStudentsNameID()
    await GetAllStudentDataHandler(students)
    createTableData(studentList.StudentArray)
}



