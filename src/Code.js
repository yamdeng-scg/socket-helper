import Constant from './Constant';
import _ from 'lodash';

const Code = {};

// O, X
Code.dbBooleanValueCodeList = [
  { name: 'O', value: Constant.DB_TRUE_VALUE },
  { name: 'X', value: Constant.DB_FALSE_VALUE }
];

// 메시지 유형 0: 일반, 1: img, 2: mv, 3: attach, 4: link
Code.messageTypeCodeList = [
  { name: '일반', value: 0 },
  { name: '이미지', value: 1 },
  { name: '동영상', value: 2 },
  { name: '첨부', value: 3 },
  { name: '가스앱링크', value: 4 }
];

Code.getCodeNameByValue = function (codeCategory, codeValue) {
  let codeName = null;
  let codeList = Code[codeCategory] || [];
  let searchIndex = _.findIndex(codeList, (codeInfo) => {
    if (codeValue === codeInfo.value) {
      return true;
    } else {
      return false;
    }
  });
  if (searchIndex !== -1) {
    let findCodeInfo = codeList[searchIndex];
    codeName = findCodeInfo.name;
  }
  return codeName;
};

export default Code;
