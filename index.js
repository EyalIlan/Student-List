

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
const proxy = 'https://api.allorigins.win/raw?url='
let studentList = new StudentList()





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





const run = async () =>{
    console.log('here')
    let students = await GetStudentsNameID()
    await GetAllStudentDataHandler(students)
    console.log(studentList)
}


run()
