// script.js

import { router } from "./router.js"; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// We can move these to other event listener if we want
var bulletAddButton = document.getElementById("add-bullet-button");
bulletAddButton.addEventListener("click", addBulletHandler);
function addBulletHandler() {
  let categoryList = [];
  let catagories = document.querySelectorAll("category-entry");
  for (let i = 0; i < catagories.length; i++) {
    categoryList.push(catagories[i].category.title);
  }
  setState("BulletEditor", null, categoryList);
}
var cateAddButton = document.getElementById("add-cate-button");
cateAddButton.addEventListener("click", addCateHandler);
function addCateHandler() {
  setState("CateEditor");
}

// TODO build from local storage
addEventListener("DOMContentLoaded", () => {
  setState("backMain", false);
});

// Will check for click events in entire document
// Note that submit events also register as clicks
document.addEventListener("click", (e) => {
  // composedPath allows us to interact with shadowDom elements
  // console.log(e.composedPath());

  // Click editBullet button
  if (e.composedPath()[0].className == "bullet-button edit-bullet-button") {
    editBullet(e.composedPath()[0]);
  }
  // Click showDetail button
  if (e.composedPath()[0].className == "bullet-button bullet-detail-button") {
    showDetail(e.composedPath()[0]);
  }
  // Click editCategory button
  if (e.composedPath()[0].className == "cate-button") {
    editCategory(e.composedPath()[0]);
  }
  // Submit bullet editor event
  if (e.composedPath()[0].id == "bulletSubmit") {
    submitBullet(e.composedPath()[1]);
  }
  // Submit category editor event
  if (e.composedPath()[0].id == "cate-submit") {
    submitCategory(e.composedPath()[1]);
  }
  // Close bulletEditor or categoryEditor modal
  if (
    e.composedPath()[0].className == "modal" ||
    e.composedPath()[0].className == "close"
  ) {
    closeModal(e.composedPath()[0].getRootNode().host);
  }

  // Check category event
  if (e.composedPath()[0].className == "checkbox") {
    refreshEntryOnCategory();
  }
});

// Helper function for passing right parameters to edit bullet form
function editBullet(editButton) {
  let bullet = editButton.getRootNode().host.bullet;
  let categoryList = [];
  let catagories = document.querySelectorAll("category-entry");
  for (let i = 0; i < catagories.length; i++) {
    categoryList.push(catagories[i].category.title);
  }
  setState("BulletEditor", bullet, categoryList);
  editButton.getRootNode().host.remove();
}

// Helper function for bullet showDetail button
function showDetail(detailButton) {
  var des = detailButton.getRootNode().querySelector(".des");
  if (des.style.display == "block") {
    des.style.display = "none";
  } else {
    des.style.display = "block";
  }
}

// Helper function for passing right parameters to edit category form
function editCategory(editButton) {
  let category = editButton.getRootNode().host.category;
  setState("CateEditor", category);
  editButton.getRootNode().host.remove();
}

// Helper function for submitting new/edited bullet entry
function submitBullet(formObj) {
  let bullet = formObj.getRootNode().host.bullet;
  setState("backMain");
  let newEntry = document.createElement("bullet-entry");
  let mainPane = document.querySelector(".entry-list");
  newEntry.bullet = bullet;

  //Find corresponfing category color
  let targetColor;
  let catagories = document.querySelectorAll("category-entry");
  for (let i = 0; i < catagories.length; i++) {
    if(catagories[i].category.title==bullet.category){
      targetColor=catagories[i].category.color;
    }
  }
  newEntry.color=targetColor;
  mainPane.appendChild(newEntry);
  refreshDateSelector();

}

// Helper function for submitting new/edited category entry
function submitCategory(formObj) {
  let category = formObj.getRootNode().host.category;
  setState("backMain");

  let newEntry = document.createElement("category-entry");
  let mainPane = document.querySelector(".category-box");
  newEntry.category = category;
  mainPane.appendChild(newEntry);
}

function closeModal(editorObj) {
  setState("backMain");

  // If modal is reached from edit button, recreate old entry
  if (editorObj.old) {
    let uneditedEntry = editorObj.old;
    let newEntry;
    let mainPane;
    if (editorObj.tagName == "CATE-EDITOR-PAGE") {
      newEntry = document.createElement("category-entry");
      mainPane = document.querySelector(".category-box");
      newEntry.category = uneditedEntry;
    } else {
      newEntry = document.createElement("bullet-entry");
      mainPane = document.querySelector(".entry-list");
      newEntry.bullet = uneditedEntry;
    }
    mainPane.appendChild(newEntry);
  }
}

function refreshEntryOnCategory(){
  let activeCatrgories=[];
  let catagories = document.querySelectorAll("category-entry");
  for (let i = 0; i < catagories.length; i++) {
    if(catagories[i].checked){
      activeCatrgories.push(catagories[i].category.title);
    }
  }

  let entryList = document.querySelectorAll("bullet-entry");
  for (let i = 0; i < entryList.length; i++) {
    if(!activeCatrgories.includes(entryList[i].category)){
      entryList[i].style.display="none";
    }else{
      entryList[i].style.display="grid";
    }
  }
}

//Refresh the day selector
function refreshDateSelector(){
  let dayEntryiesRaw = document.querySelectorAll("date-entry");
  let dayEntryies = [];

  for (let i = 0; i < dayEntryiesRaw.length; i++) {
    dayEntryies.push(dayEntryiesRaw[i].date);
  }

  let entryList = document.querySelectorAll("bullet-entry");
  for (let i = 0; i < entryList.length; i++) {
    if(!dayEntryies.includes(entryList[i].bullet.date)){
      let newDateEntry = document.createElement('date-entry');
      newDateEntry.date=entryList[i].bullet.date;
      let historyBox= document.querySelector(".jornal-box-history");
      historyBox.insertBefore(newDateEntry, historyBox.firstChild);
    }
  }
}

