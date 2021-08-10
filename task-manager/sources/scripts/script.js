// script.js
import * as storage from "./storage.js";

// Use to handle edit inline Title category/bullet
var activeTitle = 0;

// Use to handle inline editBullet and editCategory
var oldElement = 0;

// We can move these to other event listener if we want
var bulletAddButton = document.getElementById("add-bullet-button");
bulletAddButton.addEventListener("click", addBulletHandler);

/**
 * When the add bullet button is clicked, this function is called to set the state so that the add
 * bullet modal pops up
 */
function addBulletHandler(e) {
  let defaultCategory = {
    title: "Default",
    color: "Blue",
  };
  let newBullet = {
    title: "",
    checked: false,
    description: "",
    date: storage.todayDate,
    category: JSON.stringify(defaultCategory),
    type: "task",
  };
  let newObj = {
    bullet: newBullet,
  };
  storage.addBullet(newObj);

  // Make new bullet editable TODO
  /*
  let newEntry;
  let entries = document.querySelector(".entry-list").children;
  for (let entry of entries){
    if(JSON.stringify(entry.bullet) == JSON.stringify(newBullet)){
      newEntry = entry;
    }
  }
  oldElement = newBullet;
  activeTitle = newEntry.shadowRoot.getElementById("bullet-title");
  activeTitle.contentEditable = true;
  console.log(activeTitle)
  */
}
var cateAddButton = document.getElementById("new-category");
cateAddButton.addEventListener("click", addCateHandler);

/**
 * When the add category button is clicked, this function is called to set the state so that the add
 * category modal pops up
 */
function addCateHandler() {
  let defaultCategory = {
    title: "",
    color: "Blue",
    checked: false
  };
  let mainPane = document.querySelector(".category-box");
  let newEntry = document.createElement("category-entry");
  newEntry.category=defaultCategory;
  storage.addCategory(newEntry);
  mainPane.appendChild(newEntry);
}

/**
 * build from local storage
 */
addEventListener("DOMContentLoaded", () => {
  storage.start()
  document.getElementById("category-toggle").checked = true;
});

/**
 * Will check for click events in entire document
 * Note that submit events also register as clicks
 */
document.addEventListener("click", (e) => {
  console.log(e.composedPath()[0]);

  // Handle inline edit category/bullet title event
  if (
    activeTitle &&
    e.composedPath()[0].id != "bullet-title" &&
    e.composedPath()[0].id != "category-title"
  ) {
    let entry = activeTitle.getRootNode().host;
    activeTitle.contentEditable = false;

    // editBullet storage
    if (activeTitle.id == "bullet-title") {
      let newElement = entry.bullet;
      if (entry.oldDetail !== undefined) {
        newElement.description = entry.oldDetail;
      }
      storage.editBullet(newElement, oldElement);
    }
    // editCategory storage
    else {
      storage.editCategory(entry.category, oldElement);
    }
    activeTitle = null;
  }

  // Toggle menu bar
  if (e.composedPath()[0].id == "menu-bar") {
    let menu = document.getElementById("left_menu");
    let filler = document.getElementById("left_filler");
    console.log(menu.style.display);
    console.log(filler.style.display);
    if(menu.style.display == 'none'){
      menu.style.display = 'block';
      filler.style.display = 'flex';
    }
    else {
      menu.style.display = 'none';
      filler.style.display = 'none';
    }

  }


  // Click showDetail button
  if (
    e.composedPath()[0].className == "bullet"
  ) {
    showDetail(e.composedPath()[0]);
  }

  //Swtich the type of bullet
  if (e.composedPath()[0].className == "fas fa-chevron-down fa-xs") {
    let bulletObj = e.composedPath()[0].getRootNode().host;
    let oldBullet = bulletObj.bullet;
    let newBullet = bulletObj.bullet;
    if (oldBullet.type == "note") {
      newBullet.type = "event";
    } else if (oldBullet.type == "event") {
      newBullet.type = "task";
    } else {
      newBullet.type = "note";
    }
    bulletObj.bullet = newBullet;

    // Handle when detail has been changed w/o saving
    if (bulletObj.oldDetail !== undefined) {
      newBullet.description = bulletObj.oldDetail;
      oldBullet.description = bulletObj.oldDetail;
    }
    storage.editBullet(newBullet, oldBullet);
  }

  // Delete bullet event
  if (e.composedPath()[0].id == "bullet-delete") {
    deleteBullet(e.composedPath()[0].getRootNode().host);
  }
  // Delete category event
  if (e.composedPath()[0].id == "cate-delete") {
    deleteCategory(e.composedPath()[0].getRootNode().host);
  }

  // Toggle expand categories
  if (e.composedPath()[0].className == "category-header" ||
      e.composedPath()[0].id == "category-show" ||
      e.composedPath()[0].id == "category-name") {
    let toggle = document.getElementById("category-show");
    if(toggle.classList.contains("category-open")){
      toggle.classList.remove("category-open");
      document.getElementById("box-expand").style.display = "none";
    }
    else{
      toggle.classList.add("category-open")
      document.getElementById("box-expand").style.display = "initial";
    }
  }

  // Toggle select all/no categories
  if (e.composedPath()[0].id == "category-toggle") {
    let categoryElements = document.querySelectorAll("category-entry");
    if(e.composedPath()[0].checked == true){
      categoryElements.forEach((element) => {
        element.checked = true;
        storage.updateActiveCategories(element, false);
      });
    }
    else{
      categoryElements.forEach((element) => {
        element.checked = false;
        storage.updateActiveCategories(element, false);
      });
    }
    storage.buildCurrent();
  }

  // Check category event
  if (e.composedPath()[0].id == "category-check") {
    let categoryElement = e.composedPath()[0].getRootNode().host;
    storage.updateActiveCategories(categoryElement, true);
  }
  // Select date event
  if (e.composedPath()[0].classList.contains("date")) {
    let dateElement = e.composedPath()[0];
    storage.updateActiveDates(dateElement);
  }
  // Check bullet event
  if (e.composedPath()[0].id == "bullet-check") {
    fadeBullet(e.composedPath()[0]);
    let entry = e.composedPath()[0].getRootNode().host;
    let newElement = entry.bullet;
    if (entry.oldDetail !== undefined) {
      newElement.description = entry.oldDetail;
    }
    storage.editBullet(newElement, newElement);
  }

  // Handle bullet/category edit attempt by saving element
  if (
    e.composedPath()[0].id == "bullet-category" ||
    e.composedPath()[0].id == "bullet-date"
  ) {
    let entry = e.composedPath()[0].getRootNode().host;
    oldElement = entry.bullet;
    if (entry.oldDetail !== undefined) {
      oldElement.description = entry.oldDetail;
    }
  }
  if (e.composedPath()[0].id == "color") {
    oldElement = e.composedPath()[0].getRootNode().host.category;
  }

  // Inline edit category/color event for Firefox
  if (e.composedPath()[0].tagName == "OPTION") {
    let entry = e.composedPath()[0].getRootNode().host;
    // Inline edit bullet category
    if (entry.tagName == "BULLET-ENTRY") {
      let newElement = entry.bullet;
      newElement.category = e.composedPath()[1].value;
      if (entry.oldDetail !== undefined) {
        newElement.description = entry.oldDetail;
      }
      storage.editBullet(newElement, oldElement);
    }
    // Inline edit category color
    else {
      let newElement = entry.category;
      newElement.color = e.composedPath()[1].value;
      entry.category = newElement;
      storage.editCategory(newElement, oldElement);
    }
  }

  // Inline edit bullet description save button event
  if (e.composedPath()[0].id == "detail-save") {
    let entry = e.composedPath()[0].getRootNode().host;
    let oldBullet = entry.bullet;
    oldBullet.description = entry.oldDetail;
    storage.editBullet(entry.bullet, oldBullet);
    entry.oldDetail = entry.bullet.description;
    let detailEdit = entry.shadowRoot.querySelector("#detail-editor");
    detailEdit.contentEditable = false;
  }
});

document.addEventListener("dblclick", (e) => {
  // Handle edit inline bullet title event
  if (e.composedPath()[0].id == "bullet-title") {
    // If reached after editing another title
    if (activeTitle) {
      activeTitle.contentEditable = false;
      let entry = activeTitle.getRootNode().host;
      if (activeTitle.id == "bullet-title") {
        editBullet(entry);
      } else {
        storage.editCategory(entry.category, oldElement);
      }
    }
    // Set reference to activeTitle element and store pre-edited data
    e.composedPath()[0].contentEditable = true;
    activeTitle = e.composedPath()[0];
    let entry = e.composedPath()[0].getRootNode().host;
    oldElement = entry.bullet;
    if (entry.oldDetail !== undefined) {
      oldElement.description = entry.oldDetail;
    }
  }

  // Handle edit inline category title event
  if (
    e.composedPath()[0].id == "category-title" &&
    e.composedPath()[0].name != "default-category"
  ) {
    // If reached after editing another title
    if (activeTitle) {
      activeTitle.contentEditable = false;
      let entry = activeTitle.getRootNode().host;
      if (activeTitle.id == "bullet-title") {
        editBullet(entry);
      } else {
        storage.editCategory(entry.category, oldElement);
      }
    }
    // Set reference to activeTitle element and store pre-edited data
    e.composedPath()[0].contentEditable = true;
    activeTitle = e.composedPath()[0];
    oldElement = e.composedPath()[0].getRootNode().host.category;
  }
});

document.addEventListener("input", (e) => {
  // Inline edit bullet date
  if (e.composedPath()[0].id == "bullet-date") {
    let entry = e.composedPath()[0].getRootNode().host;
    editBullet(entry);
  }

  // Inline edit bullet category/color for Chrome
  if (e.composedPath()[0].tagName == "SELECT") {
    let entry = e.composedPath()[0].getRootNode().host;
    // Inline edit bullet category
    if (entry.tagName == "BULLET-ENTRY") {
      let newElement = entry.bullet;
      newElement.category = e.composedPath()[0].value;
      if (entry.oldDetail !== undefined) {
        newElement.description = entry.oldDetail;
      }
      storage.editBullet(newElement, oldElement);
    }
    // Inline edit category color
    else {
      let newElement = entry.category;
      newElement.color = e.composedPath()[0].value;
      entry.category = newElement;
      storage.editCategory(newElement, oldElement);
    }
  }
});

/**
 * Helper function for bullet to fade if completed
 * @param {*} check  - Check whether or not the box has been checked
 */
function fadeBullet(check) {
  let see = check.getRootNode().querySelector(".bullet");
  let des = check.getRootNode().querySelector(".des");
  if (check.checked == true) {
    see.style.opacity = "0.25";
    des.style.opacity = "0.25";
  } else {
    see.style.opacity = "1";
    des.style.opacity = "1";
  }
}

/**
 * Helper function for bullet showDetail button
 * @param {*} detailButton  - The detail button clicked on 
 */
function showDetail(detailButton) {
  let detailEdit = detailButton.getRootNode().getElementById("detail-editor");
  let bulletEntry = detailButton.getRootNode().host;
  let des = detailButton.getRootNode().querySelector(".des");
  detailEdit.contentEditable = false;
  if (bulletEntry.oldDetail === undefined) {
    bulletEntry.oldDetail = bulletEntry.bullet.description;
  }
  if (des.style.display == "block") {
    des.style.display = "none";
  } else {
    des.style.display = "block";
  }
}

/**
 * Edit bullet from page
 * @param {*} entry - the bullet to be edited
 */
function editBullet(entry) {
  let newElement = entry.bullet;
  if (entry.oldDetail !== undefined) {
    newElement.description = entry.oldDetail;
  }
  storage.editBullet(newElement, oldElement);
}

/**
 * Delete bullet from page
 * @param {*} bulletObj - the bullet to be deleted
 */
function deleteBullet(bulletObj) {
  let bullet = bulletObj.bullet;
  if (bulletObj.oldDetail !== undefined) {
    bullet.description = bulletObj.oldDetail;
  }
  storage.deleteBullet(bullet);
  bulletObj.remove();
}

/**
 * Delete category from page
 * @param {*} categoryObj - the category to be deleted
 */
function deleteCategory(categoryObj) {
  storage.deleteCategory(categoryObj);
  categoryObj.remove();
}

export { fadeBullet, showDetail, deleteBullet, deleteCategory };