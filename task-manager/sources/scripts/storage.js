import * as calender from "./calender.js";

var myStorage = window.localStorage;
export var bulletArr;
export var categoryArr;
export var dateMap;
var dateArr = [];
dateMap = new Map();

// Only store actives in current session
export var activeCategories = new Map();
export var activeDates = new Map();

export function start() {
  // Fetch bulletArr
  let dataVar;
  fetch('https://pageus.site/api/', {
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.bulletarr);
      bulletArr = data.bulletarr;
      categoryArr = data.categoryarr;
      dateArr = data.datearr;
    })
    .then(buildDefault())
    .catch((error) => {
      console.error('Error:', error);
    });
  dateArr.forEach(element => dateMap.set(element));
  console.log(bulletArr);
  console.log(categoryArr);
  console.log(dateArr);

}


// Today's date
let today = new Date();
export var todayDate = today.getFullYear();
if (today.getMonth() + 1 < 10) {
  todayDate += "-0" + (today.getMonth() + 1);
} else {
  todayDate += "-" + (today.getMonth() + 1);
}
if (today.getDate() < 10) {
  todayDate += "-0" + today.getDate();
} else {
  todayDate += "-" + today.getDate();
}

// TODO put to each one
export function updateBullet() {
  //myStorage.setItem("bulletArr", JSON.stringify(bulletArr));
  // Fetch bulletArr
  //let bulletStr = JSON.stringify(bulletArr);
  console.log(bulletArr);
  fetch('https://pageus.site/api/bullet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bulletArr)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
export function updateCategory() {
  myStorage.setItem("categoryArr", JSON.stringify(categoryArr));
}
export function updateDate() {
  dateArr = Array.from(dateMap.keys())
  myStorage.setItem("dateArr", JSON.stringify(dateArr));
}


/**
 * Delete bullet from storage
 * @param {*} bullet - the bullet to delete
 */
export function deleteBullet(bullet) {
  let dateEntryCount = 0;
  let hasBeenDeleted = false;
  bullet.checked = false;

  // Don't change this, for loop needs to look like this to work with splice
  let i;
  for (i = bulletArr.length - 1; i >= 0; i -= 1) {
    if (bullet.date == bulletArr[i].date) {
      dateEntryCount++;
    }
    let item = JSON.parse(JSON.stringify(bulletArr[i]));
    item.checked = false;
    if (JSON.stringify(bullet) == JSON.stringify(item) && !hasBeenDeleted) {
      bulletArr.splice(i, 1);
      hasBeenDeleted = true;
    }
  }
  updateBullet();

  // If last entry in date, delete date
  if (dateEntryCount == 1) {
    dateMap.delete(bullet.date)
    updateDate();
    activeDates.delete(bullet.date);
    buildDate();
    buildCurrent();
  }
}

/**
 * Delete category from storage
 * @param {*} obj - the category to be deleted
 * @returns - does not return any value
 */
export function deleteCategory(obj) {
  // Default all bullets with category to be deleted
  let categoryKey = JSON.stringify({
    title: obj.category.title,
    color: obj.category.color,
  });

  bulletArr.forEach(function (item, index) {
    if (categoryKey == item.category) {
      bulletArr[index].category = '{"title":"Default","color":"Blue"}';
    }
  });

  updateBullet();

  let index = 0;
  for (let item of categoryArr) {
    //Check title and color for equality
    //May be different in check
    if (
      JSON.stringify(obj.category.title) == JSON.stringify(item.title) &&
      JSON.stringify(obj.category.color) == JSON.stringify(item.color)
    ) {
      categoryArr.splice(index, 1);
      let categoryKey = JSON.stringify({
        title: obj.category.title,
        color: obj.category.color,
      });
      activeCategories.delete(categoryKey);
      break;
    }
    index++;
  }
  updateCategory();
  buildCurrent();
}

/**
 * Edit bullet in storage
 * @param {*} newBullet - the new bullet whose data should be used
 * @param {*} oldBullet - the old bullet whose data needs to be updated
 */
export function editBullet(newBullet, oldBullet) {
  let dateEntryCount = 0;
  let hasBeenDeleted = false;
  newBullet = JSON.parse(JSON.stringify(newBullet));
  oldBullet.checked = false;
  bulletArr.forEach(function (item, index) {
    let bulletStr = JSON.parse(JSON.stringify(item));
    bulletStr.checked = false;
    if (oldBullet.date == item.date) {
      dateEntryCount++;
    }
    if (
      JSON.stringify(oldBullet) == JSON.stringify(bulletStr) &&
      !hasBeenDeleted
    ) {
      bulletArr[index] = newBullet;
      hasBeenDeleted = true;
    }
  });
  updateBullet();

  // Handle date edit event
  if (newBullet.date != oldBullet.date) {
    // If last entry in date, delete date
    if (dateEntryCount == 1) {
      dateMap.delete(oldBullet.date);
      activeDates.delete(oldBullet.date);
    }

    // Add new date if it does not exist
    dateMap.set(newBullet.date);

    updateDate();
    buildCurrent();
    buildDate();
  } else if (newBullet.category != oldBullet.category) {
    buildCurrent();
  }
}

/**
 * Edit category in storage
 * @param {*} newCategory - the new category whose data should be used
 * @param {*} oldCategory - the old category whose data needs to be updated
 */
export function editCategory(newCategory, oldCategory) {
  // Edit all bullets with category
  let oldKey = { title: oldCategory.title, color: oldCategory.color };
  let newKey = null;
  bulletArr.forEach(function (item, index) {
    if (JSON.stringify(oldKey) == item.category) {
      let edit = { title: newCategory.title, color: newCategory.color };
      bulletArr[index].category = JSON.stringify(edit);
    }
  });
  updateBullet();

  // If active, stay active
  if (newCategory.checked == true) {
    newKey = { title: newCategory.title, color: newCategory.color };
  }
  oldCategory.checked = false;
  newCategory.checked = false;
  let index = 0;
  for (let item of categoryArr) {
    //Check title and color equality
    //Their check may be different
    if (
      JSON.stringify(oldCategory.title) == JSON.stringify(item.title) &&
      JSON.stringify(oldCategory.color) == JSON.stringify(item.color)
    ) {
      categoryArr[index] = newCategory;
      activeCategories.delete(JSON.stringify(oldKey));
      if (newKey) {
        activeCategories.set(JSON.stringify(newKey));
      }
      break;
    }
    index++;
  }
  updateCategory();
  buildCurrent();
}

/**
 * adds a new bullet to storage
 * @param {*} obj - the bullet to add to the storage
 */
export function addBullet(obj) {
  const newBullet = obj.bullet;
  bulletArr.push(newBullet);
  updateBullet();

  // Update activeCategories and Dates so that a new bullet entry is displayed
  let defaultCategory = document.createElement("category-entry");
  defaultCategory.category = { title: "Default", color: "Blue", checked: true };
  updateActiveCategories(defaultCategory, false);
  let entry = document.querySelector(".category-box").firstChild.shadowRoot;
  entry.getElementById("category-check").checked = true;
  if (activeDates.size > 0) {
    activeDates.set(todayDate);
    buildDate();
  }

  // Add new date if it does not exist
  dateMap.set(newBullet.date);
  updateDate();
  buildDate();
  buildCurrent();
}

/**
 * add a new category to storage
 * @param {*} obj - the category to add to storage
 */
export function addCategory(obj) {
  const newCategory = obj.category;
  categoryArr.push(newCategory);
  updateCategory();
  // If category is active update activeCategories
  if (obj.checked) {
    let categoryKey = JSON.stringify({
      title: newCategory.title,
      color: newCategory.color,
    });
    activeCategories.set(categoryKey);
  }
  buildCurrent();
}

/**
 * Build initial screen
 */
export function buildDefault() {
  const categoryPane = document.querySelector(".category-box");
  activeCategories.clear();
  activeDates.clear();

  // Build default category
  let defaultCategory = document.createElement("category-entry");
  defaultCategory.category = { title: "Default", color: "Blue", checked: true };
  defaultCategory.default = 0;
  categoryPane.appendChild(defaultCategory);
  updateActiveCategories(defaultCategory, false);

  console.log(categoryArr)
  console.log(bulletArr)
  console.log(dateArr)
  // Create each category from storage
  categoryArr.forEach(function (item, index) {
    let newCategory = document.createElement("category-entry");
    categoryArr[index].checked = false;
    newCategory.category = {
      title: item.title,
      color: item.color,
      checked: true,
    };
    categoryPane.appendChild(newCategory);
    updateActiveCategories(newCategory, false);
  });

  activeDates.set(todayDate);
  buildDate();

  // default build all from today
  buildCurrent();
}

/**
 * Build current selection of dates and categories
 */
export function buildCurrent() {
  // Purge all bullet elements
  const mainPane = document.querySelector(".entry-list");
  while (mainPane.firstChild) {
    mainPane.firstChild.remove();
  }

  // Sort lmao
  const sortedBullets = bulletArr.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  //If no day and category select Today date entry show up
  //If only no day select, show all day with the category
  //If no category select, show no entry
  //Categroy as hard filter, day as soft filter

  if (activeCategories.size == 0) {
    // nothing
  }
  // all/selected categories
  else if (activeDates.size == 0) {
    sortedBullets.forEach(function (item) {
      if (activeCategories.has(item.category)) {
        let newBullet = document.createElement("bullet-entry");


        newBullet.bullet = item;
        newBullet.categoryList = categoryArr;
        mainPane.appendChild(newBullet);
      }
    });
  }
  // Get selected intersection of categories/date
  else {
    sortedBullets.forEach(function (item) {
      if (activeDates.has(item.date) && activeCategories.has(item.category)) {
        let newBullet = document.createElement("bullet-entry");

        newBullet.bullet = item;
        newBullet.categoryList = categoryArr;
        mainPane.appendChild(newBullet);
      }
    });
  }
}

/**
 * Call to update date viewer in real time
 */
function buildDate() {
  calender.buildCalender(0, dateMap, activeDates);
}

/**
 * Update storage when toggling active categories
 * @param {*} categoryObj - category object used to update the active Categories
 */
export function updateActiveCategories(categoryObj, build) {
  let categoryKey = JSON.stringify({
    title: categoryObj.category.title,
    color: categoryObj.category.color,
  });
  if (categoryObj.checked) {
    activeCategories.set(categoryKey);
  } else {
    activeCategories.delete(categoryKey);
  }
  if (build) {
    buildCurrent();
  }
}

/**
 * Update storage when toggling active dates
 * @param {*} dateObj - date object used to update the active dates
 */
export function updateActiveDates(dateObj) {
  if (dateObj.classList.contains("active")) {
    activeDates.delete(dateObj.title);
  } else {
    activeDates.set(dateObj.title);
  }
  dateObj.classList.toggle("active");
  buildCurrent();
}
