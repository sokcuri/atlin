const {remote} = require('electron')
const {Menu, MenuItem} = remote;

require('./js/pace.min.js');/*#29d*/
remote.getCurrentWebContents().insertCSS(`.pace{-webkit-pointer-events:none;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.pace-inactive{display:none}.pace .pace-progress{background:#00BCD4;position:fixed;z-index:2000;top:0;right:100%;width:100%;height:2px}`);
/*
const menu = new Menu()
menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  setTimeout(() => {menu.popup(remote.getCurrentWindow()) }, 10);
}, false)

*/