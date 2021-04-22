// eslint-disable-next-line no-unused-vars
import api from "../../api/schedule"
import {
  ADD_MASTER_TO_CELL,
  ADD_MASTER_TO_CELL_MASTER,
  CHANGE_FIRST_DAY,
  CHANGE_LAST_DAY,
  DECLINE_REC,
  DECLINE_REC_BY_DATE_TIME,
  FETCH_SCHEDULE,
  USER_ASSIGN
} from "../actions/schedule";
import dateUtils from "../../utils/dateUtils";
import serviceVuex from "./service"
import Vue from "vue"

const state = {
  data: {
    schedule: [],
    dateLine: initDateLine(new Date(), new Date().addDays(14)),
    timeLine: initTimeLine(),

    filterByMaster: null,
    filterByService: null,

    loading: false,
  }
}
const actions = {
  [FETCH_SCHEDULE]: async ({commit, rootState}) => {
    let from = state.data.dateLine[0]
    let to = state.data.dateLine[state.data.dateLine.length - 1]
    let role = rootState.auth.data.user ? rootState.auth.data.user.role : 'ROLE_USER';
    let schedule;
    switch (role) {
      case "ROLE_USER":
        schedule = await api.fetchUserSchedule(from, to);
        break;
      case "ROLE_ADMIN":
        schedule = await api.fetchSchedule(from, to);
        console.log(schedule)
        break;
      case "ROLE_MASTER":
        schedule = await api.fetchMasterSchedule(from, to);
        break;
    }

    commit("setSchedule", schedule)
  },
  [ADD_MASTER_TO_CELL]: async ({commit}, {rec}) => {
    console.log(JSON.stringify(rec))
    state.data.loading = true;
    rec = await api.addMaster(rec)
    commit("addMasterToCell", rec);
    state.data.loading = false;
  },
  [ADD_MASTER_TO_CELL_MASTER]: async ({commit}, {payload}) => {
    console.log(payload)
    let res = await api.addMasterToCell(payload)
    commit("addMasterToCell", res);
  },
  // eslint-disable-next-line no-unused-vars
  [CHANGE_FIRST_DAY]: async ({dispatch}, {value}) => {
    state.data.loading = true
    state.data.dateLine = initDateLine(value, state.data.dateLine[state.data.dateLine.length - 1])
    await dispatch(FETCH_SCHEDULE);
  },
  [CHANGE_LAST_DAY]: async ({dispatch}, {value}) => {
    state.data.loading = true
    state.data.dateLine = initDateLine(state.data.dateLine[0], value)
    await dispatch(FETCH_SCHEDULE);
  },
  // eslint-disable-next-line no-unused-vars
  [DECLINE_REC]: async ({commit}, {payload}) => {
    let res = await api.declineRec(payload);
    if (res.length) {
      commit('refreshCells', res);
    }
  },
  [DECLINE_REC_BY_DATE_TIME]: async ({commit}, {payload}) => {
    let res = await api.declineRecByDateTime(payload);
    console.log(res)
    commit('deleteRec', res);
  },
  [USER_ASSIGN]: async ({commit}, {payload}) => {
    let res = await api.assignUser(payload);
    console.log(res)
    commit("refreshCells", res);
  }
}
const mutations = {
  setSchedule(state, schedule) {
    state.data.schedule = schedule;
    state.data.loading = false

  },
  deleteRec(state, rec) {
    console.log(rec)
    let index = state.data.schedule.findIndex(value => value.id === rec.id);
    state.data.schedule.splice(index, 1);
    console.log(state.data.schedule)
  },
  refreshCells(state, cellData) {
    cellData.forEach(r => {
      let index = state.data.schedule.findIndex(value => value.id === r.id);
      Vue.set(state.data.schedule, index, r)
    })
    console.log(state.data.schedule)
  },
  addMasterToCell(state, rec) {
    state.data.schedule.push(rec);
  },
  setFilterByMaster(state, master) {
    state.data.filterByMaster = master;
  },
  setFilterByService(state, service) {
    state.data.filterByService = service;
  },


}


const getters = {
  getSchedule: state => {
    return state.data.schedule;
  },
  getScheduleArray() {
    if (state.data.loading) {
      return getEmptySchedule()
    }
    return scheduleToArray(state.data.schedule, false)
  },
  getScheduleArrayFiltered() {
    if (state.data.loading) {
      return getEmptySchedule()
    }
    return scheduleToArray(state.data.schedule, true)
  },
  getDateLine: state => {
    return state.data.dateLine;
  },
  getTimeLine: state => {
    return state.data.timeLine;
  },
  isLoading: state => {
    return state.data.loading;
  },
  getFilterByMaster: state => {
    return state.data.filterByMaster
  },
  getFilterByService: state => {
    return state.data.filterByService
  },

}

function getEmptySchedule() {
  let array = {};
  state.data.dateLine.forEach(date => {
    array[date] = {};
    state.data.timeLine.forEach(time => array[date][time] = [])
  });
  return array;
}

function scheduleToArray(schedule, filter) {
  let array = {};
  state.data.dateLine.forEach(date => {
    array[date] = {};
    state.data.timeLine.forEach(time => array[date][time] = [])
  });
  if (filter) {
    schedule = applyFilter(schedule, state.data.filterByMaster)
  }

  schedule.forEach(value => {
    let formattedDate = value.date;
    let formattedTime = value.time.substr(0, value.time.length - 3);
    array[formattedDate][formattedTime].push(value)
  })
  if (state.data.filterByService) {
    array = applyServiceFilter(array, state.data.filterByService);
  }
  return array;

}

function applyFilter(arr, master) {
  return arr.filter(rec => {
    if (!master) {
      return true
    }
    if (rec.master.id === master) {
      return true
    }
    return false;
  })
}

function applyServiceFilter(arr, service) {
  service = serviceVuex.state.data.services.filter(value => value.id === service)[0];
  let schedule = getEmptySchedule();
  let dur = service.duration;
  //массив дат
  let dateLine = state.data.dateLine;
  //массив времени
  let timeLine = state.data.timeLine;
  //по каждой дате
  dateLine.forEach(date => {
    //получаем объект с временами
    let times = arr[date];
    //для каждого временного значения
    for (let i = 0; i < timeLine.length; i++) {
      //текущее время
      let curTime = timeLine[i];
      //инфо по текущим дата+время
      let curCellData = times[curTime];
      //массив мастеров, работающих на этом промежутке
      let masters = curCellData.map(rec => rec.master);
      //если их нет, оставляем пустую
      if (!masters.length) {
        continue;
      }
      //буфер мастеров, из которого удаляем занятых, на выходе должны получить только тех, кто будет свободен в течение следующих 'dur' часов
      let freeMasters = Object.assign([], masters);
      console.log(date + "/" + curTime + "; Masters at start: " + freeMasters.map(rec => rec.id).join(","))
      let mastersToSplice = [];
      console.log(freeMasters + "\n")
      let mastersFreeHoursCounter = new Map();
      freeMasters.forEach(value => mastersFreeHoursCounter.set(value.id, 0));
      //цикл, убирающий из freeMasters тех мастеров, которые не будут свободны в течение следующих 'dur' часов
      for (let timeIndex = 0; timeIndex < dur; timeIndex++) {
        console.log("timeIndex: " + timeIndex)
        let curDayInfoArr = times[timeLine[i + timeIndex]];
        console.log("Info Arr length: " + curDayInfoArr.length)
        curDayInfoArr.forEach(rec => {
          if (freeMasters.filter(freeMaster => freeMaster.id === rec.master.id).length) {
            console.log(mastersFreeHoursCounter.get(rec.master.id))
            let curFreeHours = Number(mastersFreeHoursCounter.get(rec.master.id));
            mastersFreeHoursCounter.set(rec.master.id, curFreeHours + 1);
            console.log(mastersFreeHoursCounter.get(rec.master.id))

            if (rec.cellState === "BUSY_CURRENT") {
              console.log(rec.master.id + " is busy. removing")
              mastersToSplice.push(rec.master.id);
              mastersFreeHoursCounter.delete(rec.master.id)
              /*let busyMasterIndex = freeMasters.findIndex(value => value.id===rec.master.id);
              freeMasters.splice(busyMasterIndex,1)*/
            }
          }
        })
      }
      mastersFreeHoursCounter.forEach((value, key) => {

        if (value < dur) {
          console.log(date + "/" + curTime + "; Removing " + key)
          mastersToSplice.push(key)
        }
      })
      mastersToSplice.forEach(id => {
        let busyMasterIndex = freeMasters.findIndex(value => value.id === id);
        freeMasters.splice(busyMasterIndex, 1)
      })
      //записываем инфу только по мастерам, которые смогут проработать 'dur' часов
      let filteredData = curCellData.filter(rec => freeMasters.includes(rec.master));
      schedule[date][curTime] = filteredData;
    }
  });
  return schedule;
}

function initDateLine(from, to) {
  let arr = [];
  from = new Date(from);
  to = new Date(to);
  let next = from;
  arr.push(dateUtils.dateToYYYYMMDD(next))
  while (next.getTime() !== to.getTime()) {
    next = next.addDays(1);
    arr.push(dateUtils.dateToYYYYMMDD(next));
  }

  return arr;
}

function initTimeLine() {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push((10 + i) + ":00");
  }
  return arr;
}

function getEmptyCell() {
  return {
    "id": null,
    "master": null,
    "date": null,
    "time": null,
    "service": null,
    "customer": null
  }
}

export default {
  state,
  mutations,
  actions,
  getters,
  getEmptyCell,
  applyFilter
}