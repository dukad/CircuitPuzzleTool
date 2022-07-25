/*import './style.css';
import 'index.html';*/
export function myFunction(){
    let btn = document.getElementById('menu')
    if(btn.classList.contains('menuReturn')){
        btn.classList.add('menuPullOut')
        btn.classList.remove('menuReturn')
        /*document.getElementById('bar1').classList.add('bar1')
        document.getElementById('bar2').classList.add('bar2')
        document.getElementById('bar3').classList.add('bar3')*/
    } else {
        btn.classList.add('menuReturn')
        btn.classList.remove('menuPullOut')
        /*document.getElementById('bar1').classList.remove('bar1')
        document.getElementById('bar3').classList.remove('bar3')
        document.getElementById('bar2').classList.remove('bar2')*/
    }
}