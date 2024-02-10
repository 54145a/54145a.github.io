<style>
    * {
        margin: 0;
        padding: 0;
    }

    iframe {
        width: 1201px;
        height: 200px
    }

    iframe {
        border: none;
    }
                                
</style>
<iframe id="content" src="https://dao3.fun/creator"></iframe>
移动端可以在上方的iframe内新建地图、扩展地图、发布地图等。但是iframe编辑地图效果不好，需要获取地图创作端链接。在iframe里进入你要进入的地图，然后在地图index.js输入以下代码<br>
<code>
    world.onPlayerJoin(({ entity }) => entity.player.link(world.url.toString().replace("view.dao3.fun/e","dao3.fun/edit")));
</code><br>
运行之后就会通过player.link打开创作端了。建议收藏你的创作端链接。<br>
