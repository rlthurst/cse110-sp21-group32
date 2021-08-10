import * as storage from "./storage.js";
export function buildCalender(date, events, actives){
  clear();
  if(!date){
    let today = new Date();
    date = today.getFullYear();
    if (today.getMonth() + 1 < 10) {
      date += "-0" + (today.getMonth()+1);
    } else {
      date += "-" + (today.getMonth()+1);
    }
    date += "-01";
  }
  let dateObj = new Date(date+" 00:00:00");
  let monthElement = document.getElementById('monthVal');
  let monthDayNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
  monthElement.title = date;
  monthElement.textContent = months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
  let weekArr = [];
  weekArr.push(document.querySelector(".first"));
  weekArr.push(document.querySelector(".second"));
  weekArr.push(document.querySelector(".third"));
  weekArr.push(document.querySelector(".fourth"));
  weekArr.push(document.querySelector(".fifth"));
  weekArr.push(document.querySelector(".sixth"));
  let day = getDayOfWeek(date);
  let count = 0;
  for(let i = 0; count < monthDayNum[dateObj.getMonth()]; i++){
    let fillCount = 0;
    for(let j = 0; j < 7; j++){
      let newDay = document.createElement('span');
      // Filler days before month start
      if(i == 0 && j < day){
        fillCount++;
        if(dateObj.getMonth() == 0){
          newDay.textContent = 31 - day + fillCount;
        } else{
          newDay.textContent = monthDayNum[dateObj.getMonth()-1] - day + fillCount;
        }
        newDay.classList.add('last-month');
      }
      else{
        count++;
        // If all days are accounted for, create filler days for row
        if(count > monthDayNum[dateObj.getMonth()]){
          fillCount++;
          newDay.textContent = '0' + fillCount;
          newDay.classList.add('last-month');
        }
        else{
          let curDate = date.slice(0, 8);
          if(count < 10){
            newDay.textContent = '0' + count;
            curDate += '0' + count;
          }else{
            newDay.textContent = count;
            curDate += count;
          }
          newDay.title = curDate;
          newDay.classList.add("date");
          if(events.has(curDate)){
            newDay.classList.add('event');
          }
          if(actives.has(curDate)){
            newDay.classList.add('active');
          }
        }
      }
      weekArr[i].appendChild(newDay);
    }
  }
}

function clear(){
  let first = document.querySelector(".first");
  while (first.firstChild) { first.removeChild(first.firstChild); }
  let second = document.querySelector(".second");
  while (second.firstChild) { second.removeChild(second.firstChild); }
  let third = document.querySelector(".third");
  while (third.firstChild) { third.removeChild(third.firstChild); }
  let fourth = document.querySelector(".fourth");
  while (fourth.firstChild) { fourth.removeChild(fourth.firstChild); }
  let fifth = document.querySelector(".fifth");
  while (fifth.firstChild) { fifth.removeChild(fifth.firstChild); }
  let sixth = document.querySelector(".sixth");
  while (sixth.firstChild) { sixth.removeChild(sixth.firstChild); }
}

function getDayOfWeek(date) {
  const dayOfWeek = new Date(date+" 00:00:00").getDay();    
  return isNaN(dayOfWeek) ? null : dayOfWeek;
}

document.querySelector(".fa-angle-left").addEventListener("click", (e) => {
  let date = document.getElementById('monthVal').title;
  let dateObj = new Date(date+" 00:00:00");
  if(dateObj.getMonth() == 0){
    date = dateObj.getFullYear() - 1;
    date += "-12";
    date += "-01";
    console.log(date)
  }
  else{
    date = dateObj.getFullYear();
    if (dateObj.getMonth() < 10) {
      date += "-0" + (dateObj.getMonth());
    } else {
      date += "-" + (dateObj.getMonth());
    }
    date += "-01";
  }
  buildCalender(date, storage.dateMap, storage.activeDates);
});

document.querySelector(".fa-angle-right").addEventListener("click", (e) => {
  let date = document.getElementById('monthVal').title;
  let dateObj = new Date(date+" 00:00:00");
  if(dateObj.getMonth() == 11){
    date = dateObj.getFullYear() + 1;
    console.log(date)
    date += "-01";
    date += "-01";
  }
  else{
    date = dateObj.getFullYear();
    if (dateObj.getMonth() + 2 < 10) {
      date += "-0" + (dateObj.getMonth() + 2);
    } else {
      date += "-" + (dateObj.getMonth() + 2);
    }
    date += "-01";
  }
  buildCalender(date, storage.dateMap, storage.activeDates);
});