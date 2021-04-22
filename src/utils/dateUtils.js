Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
function getCurrentWeek(){
  let now = new Date();
  return now
}
function toString(date) {
  return date.toLocaleDateString("ru-ru")
}
function toJSONString(date){
  return dotsToMinuses(toString(date))
}
function dotsToMinuses(date){
  date= date.replace(/\./g,"-");
  let datearr = date.split("-");
  return [datearr[2],datearr[1],datearr[0]].join("-")
}
function minusesToDots(date){
  date= date.replace(/-/g,".");
  let datearr = date.split(".");
  return [datearr[2],datearr[1],datearr[0]].join(".")
}
/**
 * @return {string}
 */
function dateToYYYYMMDD(date){
  if (date.toString().match(dateRegEx)){
    return date;
  }
  return date.toISOString().substr(0,10);
}
const dateRegEx = "^[0-9]{4}-[0-9]{2}-[0-9]{2}$";
export default {
  toJSONString,
  getCurrentWeek,
  minusesToDots,
  toString,
  dotsToMinuses,
  dateToYYYYMMDD
}