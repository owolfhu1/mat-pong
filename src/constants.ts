export const URL = 'https://catalyte-pong.herokuapp.com/';
// export const URL = 'http://localhost:8080/';

export const LOGO_PATH = 'assets/images/Ping_Pong.jpg';

export const HASH = s => {
  if (s === '')
    return '';
  let a = 1;
  let c = 0;
  let h, o;
  if (s) {
    a = 0;
    for (h = s.length - 1; h >= 0; h--) {
      o = s.charCodeAt(h);
      a = (a<<6&268435455) + o + (o<<14);
      c = a & 266338304;
      a = c!==0?a^c>>21:a;
    }
  }
  return String(a);
};
