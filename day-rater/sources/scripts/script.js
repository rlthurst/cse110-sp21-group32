// script.js
import * as calender from "./calender.js";

var colors = [
  '#364b9a',
  '#4a7bb6',
  '#6fa6cd',
  '#98cae1',
  '#c2e4ee',
  '#ebeccc',
  '#fedb8a',
  '#fcb366',
  '#f67e4a',
  '#dd3d2d',
  '#a50126'
]

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

export var dateMap = new Map();

/**
 * build from local storage
 */
addEventListener("DOMContentLoaded", async () => {
  // call getDays
  let boo = await getDays();
  console.log('fuck');
  calender.buildCalender(0, dateMap);
  // createCalender function build around todayDate
  if (dateMap.has(todayDate)) {
    createForm(todayDate, 1);
  } else {
    createForm(todayDate, 0);
  }
  // construct default form using todays date, check if it exists first
  // make function for creating form with date and deleteBtn params
  // build dateMap from inital fetch
  // rewrite calender function to build from new dateMap
  // write onclick events for calender click form function call
  // have functions update backend and local dateMap
  // udpate css for mobile
  // if extra time merge with bulletJournal or add more visualization!!
});


/**
 * Will check for click events in entire document
 * Note that submit events also register as clicks
 */
document.addEventListener("click", (e) => {
  //console.log(e.target);
  if (e.target.classList.contains("date")) {
    let date = e.target.title;
    if (dateMap.has(date)) {
      createForm(date, 1)
    } else {
      createForm(date, 0);
    }
  }
});
submit.addEventListener("click", (e) => {
  if (submit.value == "Submit") {
    submitDay();
  } else {
    let elem = getForm();
    if(JSON.stringify(elem) != JSON.stringify(dateMap.get(elem.date))){
      editDay();
    }
  }

});
deleteBtn.addEventListener("click", (e) => {
  deleteDay();
});

// Toggle changes submit to edit and adds delete
export function createForm(date, edit) {
  dateLegend.textContent = date;
  if (!edit) {
    dayForm.reset();
    deleteBtn.style.visibility = "hidden";
    submit.value = "Submit";
  } else {
    // populate form with dateMap value
    let elem = dateMap.get(date)
    dayRating.value = elem.rating;
    dayValue.textContent = elem.rating;
    dayRating.classList.remove(...dayRating.classList);
    dayRating.classList.add("slider");
    dayRating.classList.add(String(dayRating.value));

    dayBody.value = elem.content;
    deleteBtn.style.visibility = "initial";
    submit.value = 'Edit';
  }
}

function getForm() {
  let form = {
    date: dateLegend.textContent,
    rating: dayRating.value,
    content: dayBody.value,
  }
  return form;
}

// submit
async function submitDay() {
  let dayElem = getForm();
  console.log(dayElem);
  // get dayElem from event.target.parent
  // new dateMap entry
  // send post to api
  fetch('https://pageus.site/api', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dayElem)
  })
    .then(response => console.log(response))
    .then(data => {
      console.log(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  dateMap.set(dayElem.date, dayElem);
  createForm(dayElem.date, 1);
  calender.buildCalender(dayElem.date, dateMap);
}

// edit
async function editDay() {
  // edit dateMap
  // send put to api
  let dayElem = getForm();
  fetch(`https://pageus.site/api/${dayElem.date}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dayElem)
  })
    .then(response => console.log(response))
    .then(data => {
      console.log(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  dateMap.set(dayElem.date, dayElem);
  calender.buildCalender(dayElem.date, dateMap);
}

// delete
async function deleteDay() {
  // delete from dateMap
  // send delete to api
  let dayElem = getForm();
  fetch(`https://pageus.site/api/${dayElem.date}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => console.log(response))
    .then(data => {
      console.log(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  dateMap.delete(dayElem.date);
  createForm(dayElem.date, 0)
  calender.buildCalender(dayElem.date, dateMap);
}

// initial get
async function getDays() {
  // send get to api
  // create dateMap;
  let dateArr;
  await fetch('https://pageus.site/api', {
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.datearr);
      dateArr = data.datearr;
      dateArr.forEach(element => dateMap.set(element.date, element));
      console.log(dateMap);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return dateArr;
}