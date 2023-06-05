//form datalari ele almaq
const type = document.querySelector('.type');
const charge = document.querySelector('#charge');
const amount = document.querySelector('#amount');
const btnSubmit = document.querySelector('.btn-submit');
const btnDelAll = document.querySelector('.btn-delete-all');
//ul
const listUl = document.querySelector('.list');
//edit edende editlenen row'un yeri
let targetEditedItem;

//buttons of list
const btnDel = document.querySelector('.btn-item-delete');
const btnEdit = document.querySelector('.btn-item-edit');

//datanin dashinacaghi Object modeli ctor
function Task(type, charge, amount){
    this.type = type,
    this.charge = charge,
    this.amount = amount;
}


//eventler
btnSubmit.addEventListener('click', taskAdd);
document.addEventListener('click', checkBtn);
document.addEventListener('DOMContentLoaded', localStorageRead);
btnDelAll.addEventListener('click', deleteAll);

function deleteAll(){
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Poof! Your imaginary file has been deleted!", {
            icon: "success",
          });
          const targetArray = document.querySelectorAll('.list-item-container');

    targetArray.forEach(item => {
        item.classList.toggle('delete');
        item.addEventListener('transitionend', function(){item.remove()})
    });

    let tasks = localStorageArray();
    tasks.splice(0, tasks.length);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    Toastify({
        text: "All  budget tasks deleted",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
        } else {
          swal("Your imaginary file is safe!");
        }
      });
}

function checkBtn(e){
    let tempTaskObject;
    if(e.target.classList.value === 'btn-item-delete'){
        //row-un ana div'ini verir 
        let targetClick = e.target.parentElement.parentElement;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Poof! Your imaginary file has been deleted!", {
                icon: "success",
              });
              targetClick.classList.toggle('delete');
        targetClick.addEventListener('transitionend', function(){
            targetClick.remove()})
        tempTaskObject = taskToObject(e);
        localStorageDel(tempTaskObject);
            } else {
              swal("Your imaginary file is safe!");
            }
          });
        
        
        
    }else if(e.target.classList.value === 'btn-item-edit'){
        targetEditedItem = e.target.parentElement.parentElement;
        tempTaskObject = taskToObject(e);
        objectToEdit(tempTaskObject, e);
    }
}
function reverseTaskTypeCheck(value){
    if(value === 'Income'){
        return 1;
    }else{
        return 0;
    }
}

function objectToEdit(editObject){
    type.value = editObject.type;
    charge.value = editObject.charge;
    amount.value = parseFloat(editObject.amount);
    btnSubmit.classList.remove('btn-submit');
    btnSubmit.classList.add('btn-save');
    btnSubmit.innerText = 'Save';
}

//row-daki datani object-e chevirib gonderen 
function taskToObject(e){
    //li'nin ichindeki p'ler
    const liOfRow = e.target.parentElement.parentElement.children[0];
    const typeValue = reverseTaskTypeCheck(liOfRow.children[0].innerText);
    const chargeValue = liOfRow.children[1].innerText;
    const amountValue = liOfRow.children[2].innerText;
    const tempObject = new Task(typeValue, chargeValue, amountValue);  
    
    return tempObject;
}

//local storagede kontrol
function localStorageArray(){
    let tasks;
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function localStorageRead(){
    let tasks = localStorageArray();
    tasks.forEach(task => {
        submitNewBudget(task);
    });
    addSumm();
}

function localStorageAdd(newTask){
    let tasks = localStorageArray();
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    addSumm();
}
function localStorageDel(task){
    let tasks = localStorageArray();
    let taskDelIndex = tasks.indexOf(task);
    tasks.splice(taskDelIndex,1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    addSumm();
    Toastify({
        text: "Task Deleted",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
}

//type-da income ve ya excome oldughu
function taskTypeCheck(value){
    if(value === '1'){
        return 'Income';
    }else{
        return 'Excome';
    }
};

//submit sonrasi taskin add olunmasi bashladan funksiya
function taskAdd(e){
    if(charge.value === '' || isNaN(parseFloat(amount.value)) !== false || amount.value === '' ){
        swal("Inputs does not empty")
    }else{
    
    let tempTask = new Task(type.value, charge.value, amount.value);
    if(btnSubmit.classList.contains('btn-save')){
        let oldType = (reverseTaskTypeCheck(targetEditedItem.children[0].children[0].innerText)).toString();
        let oldCharge = targetEditedItem.children[0].children[1].innerText; 
        let oldAmount = parseFloat(targetEditedItem.children[0].children[2].innerText);
        let oldTask = new Task(oldType, oldCharge, oldAmount.toString());        
        
        targetEditedItem.children[0].children[0].innerText = taskTypeCheck(tempTask.type);
        targetEditedItem.children[0].children[1].innerText = tempTask.charge;
        targetEditedItem.children[0].children[2].innerText = tempTask.amount + " AZN";

        let tasks = localStorageArray();
        let index = tasks.findIndex(item => { return (item.type).toString() === (oldTask.type).toString() &&
            (item.charge).toString() === (oldTask.charge).toString() && (item.amount).toString() === (oldTask.amount).toString()});

        tasks.splice(index, 1, tempTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        btnSubmit.classList.remove('btn-save');
        btnSubmit.classList.add('btn-submit');
        btnSubmit.innerText = 'Submit';
        type.value = 0;
        charge.value = '';
        amount.value = '';
        Toastify({
            text: "Budget Task Edited",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
        
    }else{
    submitNewBudget(tempTask);
    localStorageAdd(tempTask);
    Toastify({
        text: "New Budeget Task Added",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
    }
    
}
e.preventDefault();
addSumm();
}

function greenOrRed(value){
    if(value === '1'){
        return 'green';
    }else{
        return 'red';
    }
}

function submitNewBudget(task){
    //div create
    const newTaskDiv = document.createElement('div');
    newTaskDiv.classList.add('list-item-container');

    //li create
    const newTaskLi = document.createElement('li');
    newTaskLi.classList.add('list-item');
    newTaskDiv.appendChild(newTaskLi);
    
    //p create
    const newTaskPType = document.createElement('p');
    newTaskPType.classList.add('p');
    newTaskPType.classList.add('p-type');
    newTaskPType.textContent = taskTypeCheck(task.type); 
    newTaskLi.appendChild(newTaskPType);

    const newTaskPCharge = document.createElement('p');
    newTaskPCharge.classList.add('p');
    newTaskPCharge.classList.add('p-charge');
    newTaskPCharge.textContent = task.charge;
    newTaskLi.appendChild(newTaskPCharge);

    const newTaskPAmount = document.createElement('p');
    newTaskPAmount.classList.add('p');
    newTaskPAmount.classList.add('p-amount');
    let greenRed = greenOrRed(task.type);
    if(greenRed === 'green'){
        newTaskPAmount.classList.add('income');
    }else{
        newTaskPAmount.classList.add('excome');
    }
    newTaskPAmount.textContent = task.amount + " AZN";
    newTaskLi.appendChild(newTaskPAmount);

    //button-div create
    const newTaskBtnDiv = document.createElement('div');
    newTaskBtnDiv.classList.add('list-button');
    newTaskDiv.appendChild(newTaskBtnDiv);
    //buttons create
    const newTaskBtnEdit = document.createElement('button');
    newTaskBtnEdit.classList.add('btn-item-edit');
    newTaskBtnEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'
    newTaskBtnDiv.appendChild(newTaskBtnEdit);

    const newTaskBtnDel = document.createElement('button');
    newTaskBtnDel.classList.add('btn-item-delete');
    newTaskBtnDel.innerHTML = '<i class="fa-solid fa-trash"></i>';
    newTaskBtnDiv.appendChild(newTaskBtnDel);

    listUl.appendChild(newTaskDiv);
    charge.value = '';
    amount.value = '';
}

function addSumm(){
    let tasks = localStorageArray();
    let summ = 0;

    tasks.forEach(element => {
        if(element.type === '1'){
            summ = summ + parseFloat(element.amount);
        }else{
            summ = summ - parseFloat(element.amount);}
    });
    document.querySelector('.summ').innerText = summ;
}