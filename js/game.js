enchant();
// 各種データロード
var bullet_rock = localStorage.getItem("rock");
var bullet_scissorse = localStorage.getItem("scissorse");
var bullet_paper = localStorage.getItem("paper");
var select_show =false;

setInterval( function(){
    $("#bullet_rock").text(bullet_rock);
    $("#bullet_scissorse").text(bullet_scissorse);
    $("#bullet_paper").text(bullet_paper);
},100);

//コンティニューボタン設定
setInterval(function(){
    if(clearstage >= 1){
        $("#continue_button").show();
    }else{
        $("#continue_button").hide();
    }
},100);

function stageload(){ 
    if(select_show == false){
        if(clearstage >= 1){
        $("#selectarea").show();
        $("#select1").show();
        $("#select2").show();
        }else{
            $("#select1").hide();
            $("#select2").hide();
        }
        if(clearstage >=2){
                $("#select3").show();
        }else{
            $("#select3").hide();
        }
        if(clearstage >=3){
                $("#select4").show();
        }else{
            $("#select4").hide();
        }
        if(clearstage >=4){
                $("#select5").show();
        }else{
            $("#select5").hide();
        }
        if(clearstage ==5){
            $("#rabbit").show();
        }else{
            $("#rabbit").hide();
        }
        select_show = true;
    }
    else{
        $("#selectarea").hide();
        select_show = false;
    }

}
    
    // クリアステージを決める
    var clearstage = 0;
    if(localStorage.getItem("clearstage")){
        clearstage = localStorage.getItem("clearstage");
    }
var stage = 1;

// 画面転移
$("#door").on("click", function(){
    location.replace("top.html");
}); 


// ウインドウ移動
function td_move(){
    $("#start_scene").hide();
    $("#discription_scene").show();
}
function dt_move(){
    $("#discription_scene").hide();
    $("#start_scene").show();
}

// リセットボタン
function reset(){
    localStorage.removeItem("clearstage");
    // localStorage.clear();
    clearstage =0;
}

// 弾丸UI



// ゲーム関数
function game(startstage){
    // 外への干渉
    $("#selectarea").hide();
    select_show = false;
    $("#start_scene").hide();

    //内側の設定
    stage = startstage;
    var core = new Core(320, 320);
    core.bs = 10;
    core.preload("../image/chara5.png");
    core.preload("../image/chara7.png");
    core.preload("../image/map0.png");
    core.preload("../image/bullet.png");
    core.preload("../image/enemyB.png");
    core.preload("../image/enemyR.png");
    core.preload("../image/enemyG.png");
    $("#enchant-stage").prependTo("#screen");
    core.onload = function(){
    // 起動後設定
    // キー指定
    core.keybind(90,"z");
    core.keybind(88,"x");
    var score = 0;
    var cooltime = -10, firetime = -10;

    // ゲームシーン設定
    var gameScene = function(){
        // 初期設定
        var scene = new Scene();
        core.fps=20;
        score =0;
        firetime = -5;
        cooltime = -10;
        var effect_time;
        var nod = false, unl = false, gho = false;
        var enemylist = [];
        var bulletlist = [];
        bullet_rock = localStorage.getItem("rock");
        bullet_scissorse = localStorage.getItem("scissorse");
        bullet_paper = localStorage.getItem("paper");
        
        // Map を作って描画する
        var field = new Group();
        var map = new Map(16, 16);
        map.image = core.assets["../image/map0.png"];

        // ゴール作成
        var Goal = Class.create(Sprite, {
            initialize: function(x, y) {
                Sprite.call(this, 16, 16);
                this.x = x;
                this.y = y;
                this.frame = 14;
                this.image = core.assets["../image/map0.png"];
                field.addChild(this);
            }});

        // 敵作成
        var Enemy = Class.create(Sprite, {
            initialize: function(x, y, dir, color) {
                Sprite.call(this, 14, 22);
                this.x = x;
                this.y = y;
                if(color == "R"){
                    this.image = core.assets["../image/enemyR.png"];
                }else if(color == "B"){
                    this.image = core.assets["../image/enemyB.png"];
                }else if(color == "G"){
                    this.image = core.assets["../image/enemyG.png"];
                }
                var upon = dir.indexOf("0");
                var righton = dir.indexOf("1");
                var downon = dir.indexOf("2");
                var lefton = dir.indexOf("3");
                var lock = 5;
                var enemy_fire = -500;
                this.on("enterframe", function(){
                    // 方向変換
                    var direction;
                    if(lock == 5){
                        if(upon != -1 && Math.floor(this.age / 20) % dir.length == upon){
                            this.frame = Math.floor(core.frame / 2) % 3 + 18;
                            direction = 0;
                        }else if(righton != -1 && Math.floor(this.age / 20) % dir.length == righton){
                            this.frame = Math.floor(core.frame / 2) % 3 + 12;
                            direction = 1;
                        }else if(downon != -1 && Math.floor(this.age / 20) % dir.length == downon){
                            this.frame = Math.floor(core.frame / 2) % 3;
                            direction = 2;
                        }else if(lefton != -1 && Math.floor(this.age / 20) % dir.length == lefton){
                            this.frame = Math.floor(core.frame / 2) % 3 + 6;
                            direction = 3;
                        }
                    }
                    else{
                        direction = lock;
                    }


                    // 索敵判定
                    if(direction == 0){
                        if(Math.pow(this.x - player.x - 9, 2) + Math.pow(this.y- player.y - 5, 2) <= Math.pow(120, 2)){
                            if((player.y - this.y + 5) / Math.abs(this.x - player.x - 9) <= -Math.sqrt(3) ){
                                if(enemy_fire + 10 <= core.frame){
                                    enemy_fire = core.frame;
                                    var enemy_bullet = new Bullet(this.x,this.y, direction, "enemy");
                                }
                                lock = direction;
                            }
                            else{lock = 5;}
                        }
                        else{lock = 5;}
                    }else if(direction == 1){
                        if(Math.pow(this.x - player.x - 9, 2) + Math.pow(this.y- player.y - 5, 2) <= Math.pow(120, 2)){
                            if(Math.abs(player.y - this.y + 5) / (this.x - player.x - 9) >= -Math.sqrt( 1 / 3) &&Math.abs(player.y - this.y + 5) / (this.x - player.x - 9) <= 0){
                                if(enemy_fire + 10 <= core.frame){
                                    enemy_fire = core.frame;
                                    var enemy_bullet = new Bullet(this.x,this.y, direction, "enemy");
                                }
                                lock = direction;
                            }
                            else{lock = 5;}
                        }
                        else{lock = 5;}
                    }else if(direction == 2){
                        if(Math.pow(this.x - player.x - 9, 2) + Math.pow(this.y- player.y - 5, 2) <= Math.pow(120, 2)){
                            if((player.y - this.y + 5) / Math.abs(this.x - player.x - 9) >= Math.sqrt(3)){
                                if(enemy_fire + 10 <= core.frame){
                                    enemy_fire = core.frame;
                                    var enemy_bullet = new Bullet(this.x,this.y, direction, "enemy");
                                }
                                lock = direction;
                            }
                            else{lock = 5;}
                        }
                        else{lock = 5;}
                    }else if(direction == 3){
                        if(Math.pow(this.x - player.x - 9, 2) + Math.pow(this.y- player.y - 5, 2) <= Math.pow(120, 2)){
                            if(Math.abs(player.y - this.y + 5) / (this.x - player.x - 9) <= Math.sqrt(1 / 3) && Math.abs(player.y - this.y + 5) / (this.x - player.x - 9) >= 0){
                                if(enemy_fire + 10 <= core.frame){
                                    enemy_fire = core.frame;
                                    var enemy_bullet = new Bullet(this.x,this.y, direction, "enemy");
                                }
                                lock = direction;
                            }
                            else{lock = 5;}
                        }
                        else{lock = 5;}
                    }

                    //  殺害判定
                    if(this.within(player, 10) && nod == false){
                        core.replaceScene(gameoverScene());
                    };
                    
                });
                enemylist.push(this);
                field.addChild(this);
            }});

            // 弾丸作成　↑:0　→:1 ↓:2　←:3
            var Bullet = Class.create(Sprite, {
            initialize: function(x, y, dir, mode) {
                Sprite.call(this, 16, 16);
                this.x = x;
                this.y = y;
                this.image = core.assets["../image/bullet.png"];
                // 画像指定
                if(mode == "enemy"){
                    this.frame =112;
                }else if(mode == "R"){
                    this.frame =114;
                    bulletlist.push(this);
                }else if(mode == "G"){
                    this.frame =120;
                    bulletlist.push(this);
                }else if(mode == "B"){
                    this.frame =124;
                    bulletlist.push(this);
                }
                    if(dir==1){
                    this.rotation = 90;
                }else if(dir==2){
                    this.rotation = 180;
                }else if(dir==3){
                    this.rotation = 270;
                }

                this.on("enterframe", function(){
                // 弾丸軌道
                    if(dir == 0){
                    this.y -= 8;
                }else if(dir == 1){
                    this.x += 8;
                }else if(dir == 2){
                    this.y += 8;
                }else if(dir == 3){
                    this.x -= 8;
                }

                // 壁での消滅
                if(map.hitTest(this.x + 8,this.y + 8) === true || this.x <= -100 || this.x >= innerWidth + 100 || this.y <= -100 || this.y >= innerHeight + 100){
                    bulletlist.pop(this);
                    field.removeChild(this);
                }
                    
                    //  殺害判定{
                        if(mode =="enemy"){
                            if(this.within(player, 10) && nod == false){
                                core.replaceScene(gameoverScene());
                            }
                        }
                        
                });
                field.addChild(this);
            }});
   
            
            //アイテム作成
            var Item = Class.create(Sprite, {
            initialize: function(x, y, type) {
                Sprite.call(this, 16, 16);
                this.x = x;
                this.y = y;
                if(type == "gun"){
                    this.image = core.assets["../image/bullet.png"];
                    this.frame = 158;
                }else{
                    this.image = core.assets["../image/map0.png"];
                    if(type == "nodamage"){
                        this.frame =25;
                    }else if(type == "ghost"){
                        this.frame =27;
                    }else if(type == "unlimited"){
                        this.frame =26;
                    }
                }
                field.addChild(this);

                this.on("enterframe", function(){
                if(this.within(player, 10)){
                    if(type == "nodamage"){
                        nod = true;
                        effect_time = core.frame;
                    }else if(type == "ghost"){
                        gho = true;
                        effect_time = core.frame;
                    }else if(type == "unlimited"){
                        unl = true;
                        effect_time = core.frame;
                    }else if(type == "gun"){
                        bullet_rock++;
                        bullet_paper++;
                        bullet_scissorse++;
                    }
                    field.removeChild(this);
                }
            })
            }});

            // 時間表記
            var clock = new Label();
            var progress;
            clock.x =200;
            clock.y =5;
            clock.color ="white";
            clock.font = "20px Arial";
            clock.addEventListener(enchant.Event.ENTER_FRAME, function(){
                progress = parseInt(core.frame/core.fps);
                var calculate = progress;
    
                // 時間分割
                var minute = Math.floor(calculate / 60);
                calculate = calculate % 60;
                var second = Math.floor(calculate);
        
                // 文章作成
                var line;
                if(minute < 10){
                    line = "0" + minute +":";}
                else{
                    line= minute + ":";}
                if(second < 10){ 
                    line += "0" + second}
                else{
                    line += second;
                }
                clock.text = line;
             
            });


            //ステージ読み込み
        if(stage ==1){
            var baseMap = [
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 4, 4]
            ];
            map.loadData(baseMap);
            field.addChild(map);
            var enemy = new Enemy(160, 235, "013", "R");
            enemy = new Enemy(100, 64, "23", "B");
            enemy = new Enemy(200, 64, "12", "G");
            var goal  = new Goal( 300, 0);
        }else if(stage ==2){
            var baseMap = [
              [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
              [  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  4,  4,  3,  4,  4,  4,  4,  3,  4,  4,  3,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  4,  4,  3,  4,  4,  4,  4,  3,  4,  4,  3,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  4,  4,  3,  4,  4,  4,  4,  3,  4,  4,  3,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  4,  4,  3,  4,  4,  4,  4,  3,  4,  4,  3,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  4,  4,  3,  4,  4,  4,  4,  3,  4,  4,  3,  4,  4,  3,  3,  4,  4,  4,  4,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  4,  4,  3,  4,  4,  4,  4,  3,  4,  4,  3,  4,  4,  3,  3,  4,  4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3, 3, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 3, 3, 3, 4, 3, 3],
              [  4,  4,  3,  3,  4,  4,  4,  4,  3,  4,  4,  4,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 3, 3, 3, 4, 3, 3],
              [  4,  4,  3,  3,  4,  4,  4,  4,  3,  4,  4,  4,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3],
              [  4,  4,  3,  3,  4,  4,  4,  4,  3,  4,  4,  4,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3],
              [  4,  4,  3,  3,  4,  4,  4,  4,  3,  4,  4,  4,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3],
              [  4,  4,  3,  3,  4,  4,  4,  4,  3,  4,  4,  4,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3],
              [  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 3, 3, 4, 3, 3, 3, 3, 3],
              [  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  3,  3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 3, 3, 4, 3, 3, 3, 3, 3],
              [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            ];
  
    
            map.loadData(baseMap);
            field.addChild(map);
            //左側敵データ
            var enemy = new Enemy(40, 20, "12", "B");
            enemy = new Enemy(40, 270, "01", "R");
            enemy = new Enemy(280, 270, "30", "G");
            enemy = new Enemy(96, 90, "02", "B");
            enemy = new Enemy(130, 200, "02", "R");
            enemy = new Enemy(178, 90, "02", "G");
            enemy = new Enemy(195, 200, "20", "B");
            enemy = new Enemy(225, 90, "02", "R");
            //下ルート
            enemy = new Enemy(470, 157, "2", "R");
            enemy = new Enemy(505, 257, "0", "G");
            enemy = new Enemy(530, 157, "2", "B");
            enemy = new Enemy(570, 257, "0", "R");
            enemy = new Enemy(605, 157, "2", "G");
            enemy = new Enemy(630, 257, "0", "B");
            enemy = new Enemy(665, 157, "2", "R");
            enemy = new Enemy(700, 257, "0", "G");
            enemy = new Enemy(730, 157, "2", "B");
            enemy = new Enemy(745, 257, "0", "R");
            enemy = new Enemy(790, 157, "2", "G");
            //上ルート
            enemy = new Enemy(508, 60, "20", "B");
            enemy = new Enemy(524, 60, "02", "R");
            enemy = new Enemy(540, 60, "20", "G");
            enemy = new Enemy(556, 60, "02", "B");
            enemy = new Enemy(572, 60, "20", "R");
            enemy = new Enemy(588, 60, "02", "G");
            enemy = new Enemy(604, 60, "20", "B");
            enemy = new Enemy(620, 60, "02", "R");
            enemy = new Enemy(636, 60, "20", "G");
            enemy = new Enemy(652, 60, "02", "B");
            enemy = new Enemy(668, 60, "20", "R");
            enemy = new Enemy(684, 60, "02", "G");
            var item0 = new Item(400, 220, "nodamage");
            var item1 = new Item(400, 60, "unlimited");
            var item2 = new Item(40, 150, "gun");
            var item3 = new Item(280, 150, "ghost");
            var item4 = new Item(160, 150, "gun");
            var goal  = new Goal(840, 142);
        }else if(stage ==3){
            var baseMap = [
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 4, 3]
            ];
            map.loadData(baseMap);
            scene.addChild(map);
            var enemy = new Enemy(160, 235, "013", 0);
            enemy = new Enemy(100, 64, "23", 1);
            enemy = new Enemy(200, 64, "12", 2);
            item0 = new Item(10, 50, "nodamage");
            item1 = new Item(50, 50, "unlimited");
            item2 = new Item(90, 50, "gun");
            item3 = new Item(130, 50, "ghost");
            var goal  = new Goal( 300, 0);
        }else if(stage ==4){
            var baseMap = [
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 4, 4]
            ];
            map.loadData(baseMap);
            scene.addChild(map);
            var enemy = new Enemy(160, 235, "013", 0);
            enemylist.push(enemy);
            enemy = new Enemy(100, 64, "23", 1);
            enemylist.push(enemy);
            enemy = new Enemy(200, 64, "12", 2);
            enemylist.push(enemy);
            var goal  = new Goal( 300, 0);
        }else if(stage ==5){
            var baseMap = [
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  4,  4,  4,  4,  3,  3,  4,  4,  3,  4,  3,  3,  4,  4,  4,  4, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3, 3, 3],
              [  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3, 3, 3],
              [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, 4, 4]
            ];
            map.loadData(baseMap);
            scene.addChild(map);
            var enemy = new Enemy(160, 235, "013", 0);
            enemylist.push(enemy);
            enemy = new Enemy(100, 64, "23", 1);
            enemylist.push(enemy);
            enemy = new Enemy(200, 64, "12", 2);
            enemylist.push(enemy);
            var goal  = new Goal( 300, 0);
        }

    
            // 主人公設定
            var player = new Sprite(32, 32);
            if(stage==1){
                player.x = 0;
                player.y = 0;
            }else if(stage == 2){
                player.x = 0;
                player.y = 142;                
            }else if(stage == 3){
                player.x = 0;
                player.y = 0;                
            }else if(stage == 4){
                player.x = 0;
                player.y = 0;                
            }else if(stage == 5){
                player.x = 0;
                player.y = 0;                
            }
            player.frame = 1;
            var dir = 2, mode ="R";
            
            // 主人公挙動設定
            var up = 0, down = 0, left = 0, right = 0;

            player.addEventListener("enterframe", function(){
                //無敵状態表記
                if(nod == true){
                    player.image = core.assets["../image/chara5.png"];
                }else{
                    player.image = core.assets["../image/chara7.png"];
                }
                // キャラ移動 （画像は右向き）
                if(core.input.left) {
                    player.frame = this.age % 3 + 9;
                    dir = 3;
                    if(left == 0){this.x -= 5;}
                }else if(core.input.right){
                    player.frame = (this.age % 3) + 18;
                    dir = 1;
                    if(right == 0){this.x += 5;}
                }else if(core.input.up){
                    player.frame = this.age % 3 + 27;
                    dir = 0;
                    if(up == 0){this.y -= 5;}
                }else if(core.input.down){
                    player.frame = this.age % 3;
                    dir = 2;
                    if(down ==0){this.y += 5;}
                };

                
                //アイテム効果失効
                if(core.frame >= effect_time + 100){
                    nod = false;
                    gho = false;
                    unl = false;
                }
                //画像状態遷移
                if(gho == true){
                    player.opacity = 0.5; 
                }else{
                    player.opacity = 1;
                }

                //自機状態表記
                if(nod == true){
                    $("#ability").text("nodamage");
                    $("#ability").css("color", "#ff0");
                }else if(unl == true){
                    $("#ability").text("unlimited");
                    $("#ability").css("color","#F00");
                }else if(gho == true){
                    $("#ability").text("ghost");
                    $("#ability").css("color","#00f");
                }else{
                    $("#ability").text("nomal"); 
                    $("#ability").css("color","#FFF");                   
                }
                // マガジンチェンジ
                if(core.input.x && (core.frame - cooltime) >=10){
                    var redUI = document.getElementById("bullet_rock");
                    var blueUI = document.getElementById("bullet_paper");
                    var greenUI = document.getElementById("bullet_scissorse");
                    if(mode == "R"){
                        mode ="B";
                        $("#redUI").css("order:0");
                        $("#blueUI").css("order:2");
                        $("#greenUI").css("order:1");
                    }else if(mode == "B"){
                        mode ="G";
                        $("#redUI").order =1;
                        $("#blueUI").order =0;
                        $("#greenUI").order =2;
                    }else if(mode == "G"){
                        mode ="R";
                        $("#redUI").order =2;
                        $("#blueUI").order =1;
                        $("#greenUI").order =0;
                    }
                    cooltime = core.frame;
                }

    
                // 攻撃判定
                if(core.input.z && (core.frame - firetime) >=10){
                    if(mode == "R"){ 
                        if( unl == true || bullet_rock > 0){
                            if(unl == false){
                                bullet_rock--;
                            } 
                        var bullet = new Bullet(this.x + 8, this.y + 8, dir, mode);
                        bulletlist.push(bullet);
                        }
                    }
                    else if(mode == "B"){ 
                        if(unl == true || bullet_paper > 0){
                            if(unl == false){
                                bullet_paper--;
                            } 
                        var bullet = new Bullet(this.x + 8, this.y + 8, dir, mode);
                        bulletlist.push(bullet);
                        }
                    }
                    else if(mode == "G"){
                        if(unl == true || bullet_scissorse > 0){ 
                            if(unl == false){
                                bullet_scissorse--;
                            } 
                        var bullet = new Bullet(this.x + 8, this.y + 8, dir, mode);
                        bulletlist.push(bullet);
                        }
                    }
                    
                    firetime = core.frame;
                    console.log(player.x,player.y);
                }

                // 敵の殺害判定
                for (var i = 0; i < enemylist.length; i++) {
                    if (enemylist[i].destroy === true) continue ;
                    for (var j = 0; j < bulletlist.length; j++) {
                        // 敵と弾の衝突判定
                        if (bulletlist[j].within(enemylist[i], 10) == true) {
                            score += 20;
                            field.removeChild(enemylist[i]);
                            field.removeChild(bulletlist[j]);                      
                        break;
                        }
                    }
                }
    
                // マップスクロール
                //右
                if(field.x  >= 320 - baseMap[0].length * 16){
                    if(field.x > 200 -player.x){
                        field.x = 200 -player.x;
                    }
                }
                //左
                if(field.x < 0){
                    if(field.x < 120 - player.x){
                        field.x = 120 - player.x;
                    }
                }

                // 衝突判定
                if(stage ==1){
                    var colMap = [
                        [  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  0,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  0,  1,  0,  0,  1,  1,  1,  1, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 1, 1]
                      ];}else if(stage ==2){
                    var colMap = [
                        [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  0,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  0,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  0,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  0,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  0,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  1,  1,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  0,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                        [  1,  1,  0,  0,  1,  1,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                        [  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
                        [  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
                        [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                      ];}else if(stage ==3){
                        var colMap = [
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0]
                        ];}else if(stage ==4){
                        var colMap = [
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0]
                        ];}else if(stage ==5){
                        var colMap = [
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0]
                        ];}
                         map.collisionData = colMap;
                   
                //   衝突判定処理
                  if (map.hitTest(player.x,player.y) === true && map.hitTest(player.x + 6,player.y) === true && gho == false) {
                    up = 1;
                  }else if (map.hitTest(player.x + 26, player.y) === true && map.hitTest(player.x + 32,player.y) === true && gho == false) {
                    up = 1;
                  }else if(player.y <=0 ){
                      up = 1;
                  }
                  else{
                      up=0;
                  }
                  if (map.hitTest(player.x, player.y) === true && map.hitTest(player.x, player.y + 6) === true && gho == false) {
                    left = 1;
                  }else if (map.hitTest(player.x, player.y + 26) === true && map.hitTest(player.x, player.y + 32) === true && gho == false) {
                    left = 1;
                  }else if(player.x <=0){
                      left = 1;
                  }
                  else{
                      left=0;
                  }
                  if (map.hitTest(player.x + 32,player.y) === true && map.hitTest(player.x + 32,player.y + 6) === true && gho == false) {
                    right = 1;
                  }else if (map.hitTest(player.x + 32,player.y + 26) === true && map.hitTest(player.x + 32,player.y +32) === true && gho == false) {
                    right = 1;
                  }else if(player.x + 32 >= baseMap[0].length * 16){
                      right =1;
                  }
                  else{
                      right=0;
                  }
                  if (map.hitTest(player.x,player.y + 32) === true && map.hitTest(player.x + 6,player.y + 32) === true && gho == false) {
                    down = 1;
                  }else if (map.hitTest(player.x + 26, player.y + 32) === true && map.hitTest(player.x + 32,player.y + 32) === true && gho == false) {
                    down = 1;
                  }else if(player.y -32 >= baseMap.length * 16){
                      down = 1;
                  }
                  else{
                      down=0;
                  }
    
            
            //     ゴール判定及び処理
            if(this.within(goal, 10)){
                if(300 - progress >= 0){
                score += 300 - progress;
                }
                core.replaceScene(resultScene());
            };
                                              
            });
            //time

            // 要素追加
            field.addChild(player);
            scene.addChild(field);
            // scene.addChild(player);

            scene.addChild(clock);
            return scene;
    };

    // リザルトシーン設定
    var resultScene = function(){
        var scene = new Scene();
        if(clearstage <= stage){
            clearstage = stage;
            localStorage.setItem("clearstage",clearstage);
    }

        // シーン描写
        scene.backgroundColor = "#000";

        // タイトル
        var result = new Label();
        result.x =50;
        result.y =40;
        result.color ="blue";
        result.font = "30px Arial";
        result.text = "mission complete";

        // スコア
        var scoreLabel = new Label();
        scoreLabel.x =30;
        scoreLabel.y =110;
        scoreLabel.color ="blue";
        scoreLabel.font = "30px Arial";
        scoreLabel.text = "score:" + score * 100;
        score = 0;

        // 選択肢
        var resultChoise = 0;
        var choise1 = new Label();
        choise1.x =160;
        choise1.y =200;
        choise1.color ="yellow";
        choise1.font = "30px Arial";
        choise1.text = "continue";
        var choise2 = new Label();
        choise2.x =160;
        choise2.y =250;
        choise2.color ="yellow";
        choise2.font = "30px Arial";
        var selecthold = -20;
   
        choise1.addEventListener(enchant.Event.ENTER_FRAME, function(){
            // 選択変更
            var resultPush = 0;
            if(resultPush == 0){
                if(core.input.up || core.input.down){
                    if(resultChoise ==0 && selecthold + 20 <= core.frame){
                        resultChoise = 1;
                        selecthold = core.frame;
                    }else if(resultChoise ==1 && selecthold + 20 <= core.frame){
                        resultChoise = 0;
                        selecthold = core.frame;
                    }
                    resultPush = 1;
                }
            }
            else{
                resultPush =0;
            }
            // 表記変更
            if(resultChoise ==0){
                choise1.text = "▶continue";
                choise2.text = "exit";
            }else if(resultChoise ==1){
                choise1.text = "continue";
                choise2.text = "▶exit";
            }
                // 決定時反応
                if(core.input.z){
                    if(resultChoise ==0){
                        stage++;
                        core.frame = 0;
                        core.replaceScene(gameScene());
                    }else if(resultChoise ==1){
                        core.popScene(resultScene);
                        core.stop();
                        $("#start_scene").show();
                        var gameEnd1 = document.getElementById("enchant-stage");
                        var gameEnd2 = document.getElementById("screen");
                        gameEnd2.removeChild(gameEnd1);

                    }
                }
            });
    
            // 要素の追加
            scene.addChild(result);
            scene.addChild(scoreLabel);
            scene.addChild(choise1);
            scene.addChild(choise2);
    
            return scene;
        }

                // ゲームオーバーシーン描写
                var gameoverScene = function(){
                    //最初のもろもろの処理
                    var scene = new Scene();
                    $("#ability").text("stand by..."); 
                    $("#ability").css("color","#0f0");     
            
                    // シーン描写
                    scene.backgroundColor = "#000";
            
                    // タイトル
                    var gameover = new Label();
                    gameover.x =25;
                    gameover.y =70;
                    gameover.color ="red";
                    gameover.font = "50px Arial";
                    gameover.text = "Game Over";
            
            
                    // 選択肢
                    var gameoverChoise = 0;
                    var choise1 = new Label();
                    choise1.x =160;
                    choise1.y =200;
                    choise1.color ="yellow";
                    choise1.font = "30px Arial";
                    choise1.text = "continue";
                    var choise2 = new Label();
                    choise2.x =160;
                    choise2.y =250;
                    choise2.color ="yellow";
                    choise2.font = "30px Arial";
                    var selecthold = -20;
                    
                    choise1.addEventListener(enchant.Event.ENTER_FRAME, function(){
                        // 選択変更
                        if(core.input.up || core.input.down){
                            if(gameoverChoise ==0 && selecthold + 20 <= core.frame){
                                gameoverChoise = 1;
                                selecthold = core.frame;
                            }else if(gameoverChoise ==1 && selecthold + 20 <= core.frame){
                                gameoverChoise = 0;
                                selecthold = core.frame;
                            }
                            resultPush = 1;
                        }
                        
            
                        // 表記変更
                        if(gameoverChoise ==0){
                            choise1.text = "▶continue";
                            choise2.text = "exit";
                        }else if(gameoverChoise ==1){
                            choise1.text = "continue";
                            choise2.text = "▶exit";
                        }
                        // 決定時反応
                        if(core.input.z){
                            if(gameoverChoise ==0){
                                core.frame = 0;
                                core.replaceScene(gameScene());
                            }else if(gameoverChoise ==1){
                                core.popScene(gameoverScene);
                                core.stop();
                                $("#start_scene").show();
                                var gameEnd1 = document.getElementById("enchant-stage");
                                var gameEnd2 = document.getElementById("screen");
                                gameEnd2.removeChild(gameEnd1);
        
                            }
                        }
        });

        // 要素の追加
        scene.addChild(gameover);
        scene.addChild(choise1);
        scene.addChild(choise2);

        return scene;
    }
    // 最初にシーンを置き換える
    core.replaceScene(gameScene());
};
    core.start();
};
