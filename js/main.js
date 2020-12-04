"use strict";
/* 
## TODO
* drag& drop
* todoをオブジェクトとして格納
* arrayに格納してfilter, reduce()
* ローカルストレージ IndexedDB
* todoの属性（予定、簡易リスト、期限

## PROBLEM
!!! Todoが無いときの表示の処理が面倒になっていた。array、indexで管理・・・
CSSのtransition、同様のJSでの実装が分からず見送り
IndexedDBは修繕が大きいため見送り
filter,reduceなど使えていない（emptyだったときの処理）
エラーや汎用性を想定していない。

* CSS:
* checkbox transparent

## IMPLEMENTED
* navのactive状態を作成
* 完了の表示/非表示切り替え convertDoneShowing()
* inputのクリアボタンの実装
* 削除処理
* todo追加時の処理を実装
* todoのENTERボタン押下時のevent追加
* 

## IDEA
Features I want to add in future.
* //のTODOやNOTEを表示させたい。

## REMINDER
仮置きなど、今後修正する必要性のある事項
* todo追加時の仮処理を記述
* todoのひな形
*/

// 入力データ
const todoText = document.querySelector("#ctodoText");
const todoDate = document.querySelector("#ctdDate");
const todoTime = document.querySelector("#ctdTime");
const showOption = document.querySelector("#showOption");
const todoContainer = document.body.querySelector("#todoContainer");
const doneContainer = document.body.querySelector("#doneContainer");
const clearDone = document.querySelector("#clearDone");

// todoがないときに表示するテキスト
const emptyText = document.createElement("li");
emptyText.classList.add("emptyText");
emptyText.classList.add("hidden");
emptyText.textContent = "表示するToDoがありません。";
emptyText.style.color = "rgb(150,150,150)";
emptyText.style.textAlign = "center";
todoContainer.appendChild(emptyText);
const emptyTextForDone = emptyText.cloneNode(true);
doneContainer.appendChild(emptyTextForDone);

// 引数を代入した新しいtodoを#todoContainerの一番前に挿入する
function addNewTodo() {
    // コンテナとその現在の最上位の子の参照を取得
    const currentTopTodo = todoContainer.firstChild;
    
    // 取得した値を引数をひな形に流し込みます
    const newTodo = fillTemplate();
    
    // 入力部の消去とfocus()
    // TODO: checkboxとtextの感覚が違うのが謎
    clearForm();
    todoText.focus();

    todoContainer.insertBefore(newTodo, currentTopTodo);
    checkNoTodos();
}

// NOTE: addNewTodo内で定義すべきかわからない
// NOTE: ひな形をどう構成すればいいかわからない
// TODO: 見た目が悪い
// TODO: 変更可能にする（editButtonはどうするか）
// fillTemplate内でどこまでやるか
function fillTemplate(){
    const parent = document.createElement("li");
    // parentの子格納array
    let parentChildren = [];
    parent.setAttribute("class", "todoElement");
 
    // checkboxの追加
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    parentChildren.push(checkbox);
    
    // todoText
    const textSpan = document.createElement("span");
    textSpan.textContent = (() => { //iifeとアロー関数
        // ctodoTextが空白なら名前を与える
        if(todoText.value === ""){
            return "名無しのTODO";
        }else{
            return todoText.value;
        };
    })();
    
    textSpan.setAttribute("class", "todoDate");
    parentChildren.push(textSpan);
    
    // const dateSpan = document.createElement("span");
    // dateSpan.textContent = todoDate.value;
    // dateSpan.setAttribute("class", "todoText");
    // parentChildren.push(dateSpan);
    
    // const timeSpan = document.createElement("span");
    // timeSpan.textContent = todoTime.value;
    // timeSpan.setAttribute("class", "todoTime");
    // parentChildren.push(timeSpan);
    
    // const editButton = document.createElement("button");
    // const editFavicon = document.createElement("i");
    // editFavicon.setAttribute("class", "fa fa-pencil ");
    // editButton.appendChild(editFavicon);
    // parentChildren.push(editButton);

    const deleteButton = document.createElement("button");
    const closeFavicon = document.createElement("i");
    closeFavicon.setAttribute("class", "fa fa-close ");
    deleteButton.appendChild(closeFavicon);
    parentChildren.push(deleteButton);

    // process done attribute
    checkbox.onclick = (e) => {
        doneShifter(parent);
        checkNoTodos();
    };

    // delete func
    deleteButton.onclick = (e) => {
        parent.remove();
        checkNoTodos();
    }
    // forでparentにくっつける
    for (let i = 0; i < parentChildren.length; i++) {
        parent.appendChild(parentChildren[i]);   
    }
    return parent;
}

function doneShifter(e){
    const element = e;
    e.remove();
    if(element.classList.contains("isdone")){
        element.classList.remove("isdone");
        document.querySelector("#todoContainer").insertBefore(element, document.querySelector("#todoContainer").firstChild);
    }else{
        element.classList.add("isdone");
        doneContainer.insertBefore(element, doneContainer.firstChild);
    }
    checkNoTodos();
}

function clearForm() {
    todoText.value = "";
    todoDate.value = "";
    todoTime.value = "";
}

document.querySelector("#clearFormBtn").onclick = () => {
    clearForm();
    todoText.focus();
}


const addButton = document.querySelector("#ctdAdd");
addButton.addEventListener('click', addNewTodo);
window.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        addNewTodo();
    }
    return;
});
showOption.addEventListener("click", (e) => {
    console.log(e.target.tagName);
    // クリックされた対象がliかつselectedクラスでない時selectedを付与
    if(e.target.tagName === "LI" && !e.target.classList.contains("selected")){
        toggleShowOption(e.target);
    }
});
const toggleShowOption = (el) => {
    // 他のselectedを削除
    Array.from(showOption.children).forEach(option => option.classList.remove("selected"));
    // selectedを付与
    el.classList.add("selected");

    // 初期化
    todoContainer.classList.remove("hidden");
    doneContainer.classList.remove("hidden");
    // 隠す
    switch(el.getAttribute("id")){
        case "showActive":
            doneContainer.classList.add("hidden");break;
        case "showDone":
            todoContainer.classList.add("hidden");break;
    }
}

// clear done
clearDone.onclick = () => {
    while(doneContainer.firstChild){
        doneContainer.removeChild(doneContainer.firstChild);
    }
}

// show no todos
const checkNoTodos = () => {
    if(todoContainer.childElementCount === 1 && todoContainer.firstChild.classList.contains("emptyText")){
        emptyText.classList.remove("hidden");
    }else {
        emptyText.classList.add("hidden");
    }
    if(doneContainer.childElementCount === 1 && doneContainer.firstChild.classList.contains("emptyText")){
        emptyTextForDone.classList.remove("hidden");
    }else {
        emptyTextForDone.classList.add("hidden");
    }
}
// show description
const about = document.querySelector("#about");
const description = document.querySelector("#description");
about.onclick = (e) => {
    if(description.classList.contains("hidden")){
        description.classList.remove("hidden");
    }else {
        description.classList.add("hidden");
    }
}

// Web Storage generate



// initialization
// ページに入ったときにfocus
todoText.focus();
toggleShowOption(showAll);
checkNoTodos();