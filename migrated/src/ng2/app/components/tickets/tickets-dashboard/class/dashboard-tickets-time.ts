import * as moment from 'moment';

export class DashboardTicketsTime {
  averageResponseTime: number = 0;
  averageLifeTime: number = 0;
  startDate: string;
  endDate: string;
  constructor() {
    let startDate = new Date();
    startDate = new Date(startDate.getFullYear(), 0, 1);
    this.startDate = moment(startDate).format('YYYY/MM/DD');
    this.endDate = moment(new Date()).format('YYYY/MM/DD');
  }
  public onSetDates(value) {
    let startDate = new Date();
    let endDate = new Date();
    if (value === "YEAR_TO_DATE") {
      startDate = new Date(startDate.getFullYear(), 0, 1);
      this.startDate = moment(startDate).format('YYYY/MM/DD');
      this.endDate = moment(endDate).format('YYYY/MM/DD');
    }
    if (value === "CURRENT_MONTH") {
      startDate.setDate(1);
      let lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
      endDate.setDate(lastDayOfMonth);
      this.startDate = moment(startDate).format('YYYY/MM/DD');
      this.endDate = moment(endDate).format('YYYY/MM/DD');
    }
    if (value === "LAST_MONTH") {
      startDate.setDate(1);
      startDate.setMonth(startDate.getMonth() - 1);
      endDate.setMonth(endDate.getMonth() - 1);
      let lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
      endDate.setDate(lastDayOfMonth);
      this.startDate = moment(startDate).format('YYYY/MM/DD');
      this.endDate = moment(endDate).format('YYYY/MM/DD');
    }
  }
  public setData(data) {
    this.averageResponseTime = data.averageResponseTime;
    this.averageLifeTime = data.averageLifeTime;
  }
  public getAverageResponseTime() {
    var timeInMinutes = this.averageResponseTime * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes} hrs`
  }
  public getAverageLifeTime() {
    var timeInMinutes = this.averageResponseTime * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return `${(minutes < 10) ? '0' + minutes : minutes} min`
  }
}