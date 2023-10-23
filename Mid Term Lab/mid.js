function HandleDelete(){
    console.log("btn clicked");
    console.log("btn clicked");
    var menuElement = document.querySelector('.logo');
    if (menuElement) {
        menuElement.parentNode.removeChild(menuElement);
}
}