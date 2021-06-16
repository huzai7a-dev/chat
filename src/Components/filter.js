import moment from "moment";
const sorting = (a, b) => {
    if (moment(a.fullTime).isAfter(b.fullTime)) {
      return 1;
    }
    else {
      return -1
    }
}
export default sorting;