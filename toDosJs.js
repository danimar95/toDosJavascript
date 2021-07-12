let editedCard;
let isNewTask;

function clearInputs(){
  document.getElementById("inputTask").value = "";
  document.getElementById("inputCompleted").checked = false;
}

function capitalize(str){
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
 }

function toggleModaltoCreateCard (){ 
  isNewTask = true;
  clearInputs();
  $("#myModal").modal('toggle');
 }

 
function editCard (titleEditedParameter,completeEditedParameter){
  editedCard.getElementsByClassName("card-title")[0].innerText = capitalize(titleEditedParameter);
  editedCard.getElementsByClassName("completedCheckbox")[0].className = completeEditedParameter ? 
  "btn far fa-check-square cardOptions completedCheckbox" : "btn far fa-square cardOptions completedCheckbox";
 }
 
function toggleModalToEditCard(){
 const cardToEdit = this.parentElement.parentElement.parentElement.parentElement;
 editedCard = cardToEdit;
 isNewTask = false;
 const cardToEditTitleValue = cardToEdit.getElementsByClassName("card-title")[0].innerText;
 const cardToEditCompletedCheckbox = cardToEdit.getElementsByClassName("completedCheckbox")[0].className.includes("check-square");
 
 document.getElementById("inputTask").value = cardToEditTitleValue;
 document.getElementById("inputCompleted").checked = cardToEditCompletedCheckbox;
 $("#myModal").modal('toggle');
}

function createCard(titleParameter, completeParameter, idParameter) {

  const card = document.createElement("div");
  card.className = "card createdCard mb-3";

  const cardContainer = document.createElement("div");
  cardContainer.className = "container"; 
  card.appendChild(cardContainer);

  const cardRow = document.createElement("div");
  cardRow.className ="row align-items-center";
  cardContainer.appendChild(cardRow);

  const cardFirstCol = document.createElement("div");
  cardFirstCol.className ="col-6";
  cardRow.appendChild(cardFirstCol);

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title m-0 d-flex";
  cardTitle.innerText= capitalize(titleParameter);
  cardFirstCol.appendChild(cardTitle);

  const cardSecondCol = document.createElement("div");
  cardSecondCol.className ="col-2 mt-1";
  cardRow.appendChild(cardSecondCol);

  const cardCheckboxImage = document.createElement("i");
  cardCheckboxImage.className = completeParameter ? "btn far fa-check-square cardOptions completedCheckbox" : "btn far fa-square cardOptions completedCheckbox";
  cardSecondCol.appendChild(cardCheckboxImage);

  const cardThirdCol = document.createElement("div");
  cardThirdCol.className="col-2";
  cardRow.appendChild(cardThirdCol);

  
  const cardEditBtn = document.createElement("button");
  cardEditBtn.setAttribute("id", "editBtnId");
  cardEditBtn.setAttribute("data-toggle","tooltip");
  cardEditBtn.setAttribute("data-placement","bottom");
  cardEditBtn.setAttribute("title","Edit task");
  cardEditBtn.className= "btn cardOptions ";
  const editIcon = document.createElement("i");
  editIcon.className="btn cardOptions fas fa-edit";
  cardEditBtn.addEventListener("click", toggleModalToEditCard);
  cardEditBtn.appendChild(editIcon);
  cardThirdCol.appendChild(cardEditBtn);
  $(cardEditBtn).tooltip();

  const cardFourthCol = document.createElement("div");
  cardFourthCol.className="col-2";
  cardRow.appendChild(cardFourthCol);
  
  const cardDeleteBtn = document.createElement("button");
  cardDeleteBtn.className= "btn cardOptions";
  cardDeleteBtn.setAttribute("data-toggle","tooltip");
  cardDeleteBtn.setAttribute("data-placement","bottom");
  cardDeleteBtn.setAttribute("title","Delete task");
  const deleteIcon = document.createElement("i");
  deleteIcon.className="btn cardOptions fas fa-trash";
  cardDeleteBtn.addEventListener("click", deleteCard);
  cardDeleteBtn.appendChild(deleteIcon);
  cardFourthCol.appendChild(cardDeleteBtn);
  $(cardDeleteBtn).tooltip();

  const cardId = document.createElement("input");
  cardId.className="card-id";
  cardId.type ="hidden";
  cardId.value = idParameter;
  cardFourthCol.appendChild(cardId);

  const placeToDisplayCard = document.getElementById("placeTasks");
  placeToDisplayCard.prepend(card);
}

//REST API'S FUNCTIONS 

//GET METHOD
function getTodosRequest() {
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((todoList) => {
      todoList.forEach(function (todo) {
        createCard(todo.title, todo.completed, todo.id);
      });
    });
}
//POST METHOD
function postTodosRequest(body){
fetch('https://jsonplaceholder.typicode.com/todos', {
  method: "POST",
  body: JSON.stringify(body),
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
.then(response => response.json()) 
.then(todoPost => 
  createCard(todoPost.title, todoPost.completed,todoPost.id));
}
//DELETE METHOD
function deleteTodosRequest(getCard,cardId){
  fetch(`https://jsonplaceholder.typicode.com/todos/${cardId}`,{
  method: 'DELETE'
})
  .then(response => response.json())
  .then(() => getCard.remove());
}
//PUT METHOD
function putTodosRequest(body){
 const cardId = editedCard.getElementsByClassName("card-id")[0].value;
  fetch(`https://jsonplaceholder.typicode.com/todos/${cardId}`, {
    method: 'PUT', 
    body: JSON.stringify(body),
    headers:{
      'Content-Type': 'application/json'
      
    }
  }).then(response => response.json())
    .then(todoUpdate => 
      editCard(todoUpdate.title, todoUpdate.completed));
}

function deleteCard(){
  const getCard = this.parentElement.parentElement.parentElement.parentElement;
  const cardId = getCard.getElementsByClassName("card-id")[0].value;
  deleteTodosRequest(getCard,cardId);
}

function createEditCard (event) {
  event.preventDefault();

  const taskTitle = document.getElementById("inputTask").value;
  const taskCheckbox = document.getElementById("inputCompleted").checked; 

  if (isNewTask) { 
    if (taskTitle.length > 0) {
      postTodosRequest({ title:taskTitle, completed:taskCheckbox });
    } else {
      swal.fire("Warning","Please add a task title!","warning");
    }
  } else {
      if (taskTitle.length > 0) {
        putTodosRequest({ title:taskTitle, completed:taskCheckbox });
      } else {
      swal.fire("Warning","Please add a task title!","warning");
    }
  }
  $("#myModal").modal('toggle');
}

const openModalButtonGlobal = document.getElementById("openModalButton");
openModalButtonGlobal.setAttribute("data-toggle","tooltip");
openModalButtonGlobal.setAttribute("data-placement","bottom");
openModalButtonGlobal.setAttribute("title","Add new task");
openModalButtonGlobal.addEventListener("click", toggleModaltoCreateCard);
$(openModalButtonGlobal).tooltip();

const getSaveBtnGlobal = document.getElementById("saveEditbtn");
getSaveBtnGlobal.addEventListener("click", createEditCard);
window.addEventListener("load", getTodosRequest());