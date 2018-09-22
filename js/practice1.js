enchant();
window.onload = function() {
    var core = new Core(320, 320);
    core.preload("../image/chara1.png");
    core.preload("../image/map0.png");
    core.fps =15;
    core.onload = function(){
        // べあクラス作成
        // var Bear = Class.create(Sprite, {
        //     initialize: function(x, y) {
        //         Sprite.call(this, 32, 32);
        //         this.x = x;
        //         this.y = y;
        //         this.frame = rand(5);
        //         this.opacity =rand(100) /100;
        //         this.image = core.assets["../image/chara1.png"];
        //         // this.on("enterframe", function(){
        //         //     this.rotate(rand(10))
        //         // });

        //         // タイムライン
        //         this.tl.moveBy(rand(100), 0, 40, enchant.Easing.BOUNCE_EASEOUT)
        //                .moveBy(-rand(100), -rand(20), rand(20))
        //                .fadeOut(20)
        //                .fadeIn(10)
        //                .loop();

        //         core.rootScene.addChild(this);
        //     }
        // });

        // ベア初期設定
        var bear = new Sprite(32, 32);
        bear.image = core.assets["../image/chara1.png"];
        bear.x = 0;
        bear.y = 0;
        bear.frame = 1;
        // var bear =new Bear(0,0);
        // var bears =[];
        // for(var i = 0; i < 100; i++){
        //     bears[i] = new Bear(rand(320), rand(320));
        // }
        
        // ベアイベント設定
        // bear.addEventListener("enterframe", function(){
        //     if(core.input.left) {
        //         this.x -= 5;
        //         bear.frame = 1;
        //     }
        //     if(core.input.right) this.x += 5;
        //     if(core.input.up) this.y -= 5;
        //     if(core.input.down) this.y += 5;

        //     intersect
        //     if(this.intersect(enemy)){
        //         label.text = "hit!";
        //     };

            // within
        //     if(this.within(enemy, 10)){
        //         label.text ="hit!";
        //         core.pushScene(gameOverScene);
        //         core.stop();
        //     };

        // })
        // エネミー初期設定
        var enemy = new Sprite(32, 32);
        enemy.image = core.assets["../image/chara1.png"];
        enemy.x = 80;
        enemy.y = 0;
        enemy.frame = 5;

        // タッチした時のベアの挙動
        bear.on("touchstart", function(){
            core.rootScene.removeChild(this);

        });
        core.rootScene.on("touchstart",function(e){
            bear.x = e.x;
            bear.y = e.y;
        });
        // ゲームオーバー画面
        var gameOverScene =new Scene();
        gameOverScene.backgroundColor = "black";

        
        // label関連の設定
        var label = new Label();
        label.x =250;
        label.y =5;
        label.color ="red";
        label.font = "14px Arial";
        // label.text ="0";
        // label.on("enterframe",function(){
        //     label.text =(core.frame / core.fps).toFixed(2);
        // })

        // Map を作って描画する
        var map = new Map(16, 16);
        map.image = core.assets['../image/map0.png'];
        var baseMap = [
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0],
        [  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0],
        [  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
        ];
        map.loadData(baseMap);
        
        core.rootScene.addChild(map);



        // core.rootScene.addChild(bear);
        core.rootScene.addChild(label);
        core.rootScene.addChild(enemy);
    }
    core.start();

};

function rand(n) {
    return Math.floor(Math.random() * (n +1));
}

function fizzbuzz(a, b){
    var line, lock;
    for(var i = a; a < b; i++){
        line = "";
        lock = 0;
        if(i % 3){
            line += "fizz";
            lock = 1;
        }
        if(i % 5){
            line += "buzz";
            lock = 1;
        }
        if(lock ==0){
            line += "i";
        }
        console.log(line);

    }

}