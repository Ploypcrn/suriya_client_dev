import moment from "moment";
import dayjs from "dayjs";
import 'moment/locale/th';


class DateFormat {
    static dateFormat = 'DD/MM/YYYY';

    static format(date) {
        return moment(date).format(this.dateFormat);
    }

    static formatString(date) {
        return moment(date).format(this.dateFormat);
    }

    static formatStringWithFormat(date, format) {
        return moment(date).format(format);
    }

    static formatWithFormat(date, format) {
        return moment(date).format(format);
    }

    static formatWithFormatString(date, format) {
        return moment(date).format(format);
    }

    static formatWithFormatStringAndLocale(date, format, locale) {
        return moment(date).locale(locale).format(format);
    }

    static formatThaiDate(date) {
        return dayjs(date, "DD/MM/YYYY")
            .locale("th")
            .subtract(543, "year")
            .format("DD/MM/YYYY");
    }

    static DateTime(date) {
        return moment(date).format('HH:mm:ss');
    }

    static formatEnglishDate(date) {
        return moment(date).locale('en').format('LL');
    }

    static formatEnglishDateTime(date) {
        return moment(date).locale('en').format('LLL');
    }

}

export default DateFormat;