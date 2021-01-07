/**
 * 获取url参数
 */
export const getQureParam = function() {
  var params = {};

  if (location.search !== '') {
    var arr = location.search.substring(1).split('&');

    for (var i = 0, iLen = arr.length; i < iLen; i++) {
      var aTmp = arr[i].split('='),
        value = decodeURIComponent(aTmp[1]),
        numberVal = Number(value);
      //处理数字
      if (typeof numberVal === 'number' && numberVal === numberVal) {
        value = numberVal;
      }
      //处理布尔值
      if (value === 'true' || value === 'false') {
        value = value === 'true';
      }
      params[aTmp[0]] = value;
    }
  }
  return params;
};

//ArrayBuffer转字符串
export function ab2str(u: ArrayBuffer, f: () => void) {
  var b = new Blob([u]);
  var r = new FileReader();
  r.readAsText(b, 'utf-8');
  r.onload = function() {
    if (f) f.call(r.result);
  };
}
