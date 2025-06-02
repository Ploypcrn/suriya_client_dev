import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import { noteOnce } from 'rc-util/lib/warning';

import buddistEra from 'dayjs/plugin/buddhistEra';

import th from 'dayjs/locale/th';

dayjs.locale(
  {
    ...th,
    formats: {
      LT: 'H:mm',
      LTS: 'H:mm:ss',
      L: 'DD/MM/BBBB',
      LL: 'D MMMM BBBB',
      LLL: 'D MMMM BBBB เวลา H:mm',
      LLLL: 'วันddddที่ D MMMM BBBB เวลา H:mm',
    },
  },
  undefined,
  true
);

// Dayjs.extend(buddistEra);
// console.log(dayjsGenerateConfig);
dayjs.extend(buddistEra);

type IlocaleMapObject = Record<string, string>;
const localeMap: IlocaleMapObject = {
  // ar_EG:
  // az_AZ:
  // bg_BG:
  bn_BD: 'bn-bd',
  by_BY: 'be',
  // ca_ES:
  // cs_CZ:
  // da_DK:
  // de_DE:
  // el_GR:
  en_GB: 'en-gb',
  en_US: 'en',
  // es_ES:
  // et_EE:
  // fa_IR:
  // fi_FI:
  fr_BE: 'fr', // todo: dayjs has no fr_BE locale, use fr at present
  fr_CA: 'fr-ca',
  // fr_FR:
  // ga_IE:
  // gl_ES:
  // he_IL:
  // hi_IN:
  // hr_HR:
  // hu_HU:
  hy_AM: 'hy-am',
  // id_ID:
  // is_IS:
  // it_IT:
  // ja_JP:
  // ka_GE:
  // kk_KZ:
  // km_KH:
  kmr_IQ: 'ku',
  // kn_IN:
  // ko_KR:
  // ku_IQ: // previous ku in antd
  // lt_LT:
  // lv_LV:
  // mk_MK:
  // ml_IN:
  // mn_MN:
  // ms_MY:
  // nb_NO:
  // ne_NP:
  nl_BE: 'nl-be',
  // nl_NL:
  // pl_PL:
  pt_BR: 'pt-br',
  // pt_PT:
  // ro_RO:
  // ru_RU:
  // sk_SK:
  // sl_SI:
  // sr_RS:
  // sv_SE:
  // ta_IN:
  th_TH: 'th',
  // tr_TR:
  // uk_UA:
  // ur_PK:
  // vi_VN:
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  zh_TW: 'zh-tw',
};

const parseLocale = (locale: string) => {
  // const mapLocale = localeMap[locale];
  // return mapLocale || locale.split('_')[0];
  return 'th';
};

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(
    false,
    'Not match any format. Please help to fire a issue about this.'
  );
};

const config = {
  ...dayjsGenerateConfig,
  getFixedDate: (string: string | number | dayjs.Dayjs | Date | null | undefined) => dayjs(string, ['BBBB-M-DD', 'BBBB-MM-DD']),
  setYear: (date: { year: (arg0: number) => any; }, year: number) => {
    return date.year(year - 543);
  },
  getYear: (date: { format: (arg0: string) => any; }) => Number(date.format('BBBB')),
//   locale: {
//     getWeekFirstDay: (locale) =>
//       dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
//     getWeekFirstDate: (locale, date) =>
//       date.locale(parseLocale(locale)).weekday(0),
//     getWeek: (locale, date) => date.locale(parseLocale(locale)).week(),
//     getShortWeekDays: (locale) =>
//       dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
//     getShortMonths: (locale) =>
//       dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
//     format: (locale, date, format) => {
//       const convertFormat = format.replace('YYYY', 'BBBB');
//       return date.locale(parseLocale(locale)).format(convertFormat);
//     },
//     parse: (locale, text, formats) => {
//       const localeStr = parseLocale(locale);
//       for (let i = 0; i < formats.length; i += 1) {
//         const format = formats[i];
//         const formatText = text;
//         if (format.includes('wo') || format.includes('Wo')) {
//           // parse Wo
//           const year = formatText.split('-')[0];
//           const weekStr = formatText.split('-')[1];
//           const firstWeek = dayjs(year, 'BBBB')
//             .startOf('year')
//             .locale(localeStr);
//           for (let j = 0; j <= 52; j += 1) {
//             const nextWeek = firstWeek.add(j, 'week');
//             if (nextWeek.format('Wo') === weekStr) {
//               return nextWeek;
//             }
//           }
//           parseNoMatchNotice();
//           return null;
//         }
//         const date = dayjs(formatText, format, true).locale(localeStr);
//         if (date.isValid()) {
//           return date;
//         }
//       }

//       if (text) {
//         parseNoMatchNotice();
//       }
//       return null;
//     },
//   },
};

const DatePicker = generatePicker<Dayjs>(config);

export default DatePicker;
