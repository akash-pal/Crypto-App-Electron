const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notifyBtn');
var price = document.querySelector('h1');
var targetPriceVal;
var targetPrice = document.getElementById('targetPrice');

const notification = {
    title : 'BTC Alert',
    body : 'BTC just beat your price!',
    icon: path.join(__dirname, '../assets/images/btc.ico')
}

function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
         .then(res=>{
            let cryptos =  res.data.BTC.USD;
            price.innerHTML = '$'+ cryptos.toLocaleString('en');

            if(targetPrice.innerHTML!='' && targetPriceVal < cryptos){
                const myNotification = new window.Notification(notification.title,notification);
                console.log(myNotification);
                myNotification.onclick = () =>{
                    console.log('clicked');
                }
            }

         });
}

getBTC();

setInterval(getBTC,30000);

notifyBtn.addEventListener('click',function(event){
    const modalPath = path.join('file://',__dirname,'add.html');
    let win = new BrowserWindow({frame:false,transparent:true,alwaysOnTop:true,width:400,height:200});
    win.on('close',function(){
        win = null;
    });
    win.loadURL(modalPath);
    win.show();
});

ipc.on('targetPriceVal',function(event,arg){
   targetPriceVal = Number(arg);
   targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en');
});