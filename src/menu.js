/*import './styleIndex.css';
import 'index.html';*/
export function myFunction(){
    let btn = document.getElementById('menu')
    btn.classList.add('menuPullOut')
    btn.classList.remove('menuReturn')

}
export function closeNav(){
    let btn = document.getElementById('menu')
    btn.classList.add('menuReturn')
    btn.classList.remove('menuPullOut')
}