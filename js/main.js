"use strict";
/* 
## TODO
* navのactive状態を作成
* todo追加時の処理を実装
* done属性で色分け
* done状態の切り替え
* 完了の表示/非表示切り替え
* todoをオブジェクトとして格納
* 削除処理
* inputのクリアボタンの実装
* todoContainerをulに変える、これをArrayで管理することでinsertBeforeでなくarrayのunshift,popを用いてappendChildで実装できる？

## IMPLEMENTED
* todoのENTERボタン押下時のevent追加

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

// ページに入ったときにfocus
todoText.focus();

// 引数を代入した新しいtodoを#todoContainerの一番前に挿入する
function addNewTodo() {
    // コンテナとその現在の最上位の子の参照を取得
    const todoContainer = document.body.querySelector("#todoContainer");
    const currentTopTodo = todoContainer.firstChild;
    
    // 取得した値を引数をひな形に流し込みます
    const newTodo = fillTemplate();
    
    // 入力部の消去とfocus()
    // TODO: checkboxとtextの感覚が違うのが謎
    clearForm();
    todoText.focus();

    todoContainer.insertBefore(newTodo, currentTopTodo);
}

// NOTE: addNewTodo内で定義すべきかわからない
// NOTE: ひな形をどう構成すればいいかわからない
// TODO: 見た目が悪い
// TODO: 変更可能にする（editButtonはどうするか）
// fillTemplate内でどこまでやるか
function fillTemplate(){
    const parent = document.createElement("div");
    // parentの子格納array
    let parentChildren = [];
    parent.setAttribute("class", "todoElement");
 
    // checkboxの追加
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("isdone", "false");
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
    
    const dateSpan = document.createElement("span");
    dateSpan.textContent = todoDate.value;
    dateSpan.setAttribute("class", "todoText");
    parentChildren.push(dateSpan);
    
    const timeSpan = document.createElement("span");
    timeSpan.textContent = todoTime.value;
    timeSpan.setAttribute("class", "todoTime");
    parentChildren.push(timeSpan);
    
    const editButton = document.createElement("button");
    const editFavicon = document.createElement("i");
    editFavicon.setAttribute("class", "fa fa-pencil ");
    editButton.appendChild(editFavicon);
    parentChildren.push(editButton);

    const deleteButton = document.createElement("button");
    const closeFavicon = document.createElement("i");
    closeFavicon.setAttribute("class", "fa fa-close ");
    deleteButton.appendChild(closeFavicon);
    parentChildren.push(deleteButton);
    
    // forでparentにくっつける
    for (let i = 0; i < parentChildren.length; i++) {
        parent.appendChild(parentChildren[i]);   
    }
    return parent;
}

function doneStatusInverter() {

}

function clearForm() {
    todoText.value = "";
    todoDate.value = "";
    todoTime.value = "";
}

const addButton = document.querySelector("#ctdAdd");
addButton.addEventListener('click', addNewTodo);
window.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        addNewTodo();
    }
    return;
});