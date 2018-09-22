
// mine{
//     var exist_x, exist_y, exist_dir, bullet_rock, bullet_scisors, bullet_paper;

// }

// enemy{
//     // 初期値
//     var fix_x, fix_y, fix_dir, caution, caution_x, caution_y, exist_x, exist_y, exist_dir;
// }

// bullet{
//     var exist_x, exist_y;
// }

// all{
//     var time;
//     var field =[,]
// }

// 初期設定
window.onload = function(){
    this.localStorage.setItem("rock",0);
    this.localStorage.setItem("scissorse",0);
    this.localStorage.setItem("paper",0);
};
// 転移設定
$("#door").on("click", function(){
    location.replace("game.html");
}); 
// 影作成
function shadow(){
    var ctx = document.getElementById("cv3").msGetInputContext("2d");

    ctx.shadowColor = "gray";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX =-5;
    ctx.shadowOffsetY =-5;
};


// ゲーム部分
// 画像クリック時の処理
function choose(ele){
    // 先頭画面での処理
    // 選択読み取り
    if(ele.id == "rock"){
        var player = 0;
    }
    else if(ele.id == "scissorse"){
        var player = 1;
    }
    else if(ele.id == "paper"){
        var player = 2;
    }
    // 計算
    var enemy = Math.floor(Math.random() * 3);
    var ans = enemy - player;

    // 画面切り替え
    $("#first").hide();
    $("#secound").show();

    // 結果画面での処理
    // // アニメーション
    // <img src="../image/rock1.jpg"class="choise">
    // <img src="../image/scissorse1.jpg"class="choise">
    // <img src="../image/paper1.jpg"class="choise">
    if(player == 0){
    $("#call").before('<img src="../image/rock1.jpg"class="choise">');
    }else if(player == 1){
    $("#call").before('<img src="../image/scissorse1.jpg"class="choise">');
    }else if(player == 2){ 
    $("#call").before('<img src="../image/paper1.jpg"class="choise">');
    }
    if(enemy == 0){
    $("#call").before('<img src="../image/rock1.jpg"class="choise space">');
    }else if(enemy == 1){
    $("#call").before('<img src="../image/scissorse1.jpg"class="choise space">');
    }else if(enemy == 2){ 
    $("#call").before('<img src="../image/paper1.jpg"class="choise space">');
    }           


    //　判別
    if(ans == -2 ||ans ==1){
        $("#call").after('<p class="ans_font">you win!</p>');
        var num;
        // 弾丸取得
        if(player ==0){
            num = localStorage.getItem("rock");
            num++;
            localStorage.setItem("rock", num);
        }else if(player ==1){
            num = localStorage.getItem("scissorse");
            num++;
            localStorage.setItem("scissorse", num);
        }else if(player ==2){
            num = localStorage.getItem("paper");
            num++;
            localStorage.setItem("paper", num);
        }
    } 
    else if(ans == -1 || ans ==2){
        $("#call").after('<p class="ans_font">you lose...</p>');
    }
    else if(ans ==0){
        $("#call").after('<p class="ans_font">draw</p>');
    }
};

// 結果画面
function back(){
    $("#secound").hide();
    $("#first").show();
    $("#clean").empty();
    $("#clean").prepend('<div id="call"></div>');
}