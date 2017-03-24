wahidSpriteSheetHelper
======================

これは[Wahid](https://github.com/denadev/wahid/)でスプライトシートを簡単に扱えるようにするAdobe Flash Extensionです。
このExtensionはFlashドキュメントからHTML5 形式でパブリッシュしたJavascriptファイルにスプライトシートの情報を埋め込み、[Wahid](https://github.com/denadev/wahid/)に適した形に編集します。

もし Adobe Flash Processional CS6を使っているなら、このExtensionの代わりに[Flash Professional Toolkit for CreateJS](http://www.adobe.com/jp/devnet/createjs.html)と[toolkit-supporter](https://code.google.com/archive/p/toolkit-supporter/)を利用できます。


# 簡単な使い方
1. [Adobe Creative Cloud デスクトップアプリケーション](http://www.adobe.com/jp/creativecloud/desktop-app.html)を使ってAdobe Flash Professional CC(2014)（以下Flash）をインストールする
1. 同様にAdobe Extension Manager CCをインストールする
1. [wahidSpriteSheetHelper.zxp](./exported/wahidSpriteSheetHelper.zxp)をダブルクリックしてインストールする
1. Flash上でHTML5 Canvasドキュメントを作成する
1. 画像ファイルをドキュメントに埋め込む
1. メニューの「ファイル」->「パブリッシュ設定」でJavaScript/HTML5出力設定をし、パブリッシュする
1. Flash標準機能でスプライトシートを生成する。データ形式は「JSON-ARRAY」を選択し、出力先は先にパブリッシュした画像ディレクトリを選択する
1. メニューの「ウィンドウ」->「エクステンション」->「wahidSpriteSheetHelper」を選択する
1. 必要なら「SpriteSheetに組み入れた画像を消す」チェックボックスにチェックを入れる
1. 「書き換える」ボタンを押す
1. 先にパブリッシュしたJavascriptファイルが書き換えられていること、きちんと動くことを確認する

以上で完了です。詳しい使い方に関しては、[こちら](./usage_ja.md)をご覧ください。

# Extensionのビルド方法
このプロジェクトはFlashのExtensionですので、Extensionの開発環境を導入する必要があります。[こちら](http://labs.adobe.com/technologies/extensionbuilder3/)を参考に、
* [Eclipse 3.6 or later](http://www.eclipse.org/)
* [Extension Bulider 3 Preview 3](http://labs.adobe.com/downloads/extensionbuilder3.html)
* [Extendscript Toolkit CC（必要に応じて）](https://creative.adobe.com/products/estk)

をインストールしてください。動作環境としてFlashも必要です。
* Adobe Flash Professional(2014)
* Adobe Extension Manager CC

[先の記事](http://labs.adobe.com/technologies/extensionbuilder3/)にもあるように、Extension Builder 3はそのままではAdobe Creative Cloud 2014アプリケーションに対応していません。[こちら](https://blogs.adobe.com/cssdk/2014/06/adobe-extension-builder-and-creative-cloud-2014.html)を参考に修正を加える必要があります。その際、以下の点に注意してください。
* Step 2で設定するService Manager Root Folderは、存在しなければ作る
* Step 3でManifest.xmlを編集しているが、その後Manifest Builderで変更すると上書きされてしまうので、再編集する

以上で環境設定は終了です。次にプロジェクトのソースコードを取得し、Eclipseでプロジェクトをビルドします。

```shell
# git clone https://github.com/DeNADev/wahidSpriteSheetHelper.git
# cd wahidSpriteSheetHelper
# cd ExtensionContent
# npm install jed
```

* インストールしたEclipseを起動し、新しいWorkspaceを作成する
* File->Import->Existing Projects into Workspace でこのプロジェクトをインポートする
* File->Export->Adobe Extension Builder 3->Application Extension でExtensionを出力する

これでExtensionをビルドできます。

Extensionの開発については、[Adobe CEP Resources](http://adobe-cep.github.io/CEP-Resources/)と[「Andy Hall's Super Mega Guide」](http://aphall.com/2014/08/cep-mega-guide/)が参考になります。


# License
[LICENSE](LICENSE.md)をご覧ください。

本プロジェクトは下記のオープンソースソフトウェアを利用しています。

* JSON 3 ( https://bestiejs.github.io/json3/ )
* Jed ( http://messageformat.github.io/Jed/ )

JSON 3とJedは[MIT License](http://kit.mit-license.org/)で公開されています.

これらのファイルは[Adobe Extension Builder 3](http://labs.adobe.com/downloads/extensionbuilder3.html)から生成されたものを基にしています。
* [.staged-extension/CSXS/manifest.xml](./.staged-extension/CSXS/manifest.xml)
* [ExtensionContent/lib/CSInterface-4.0.0.js](./ExtensionContent/lib/CSInterface-4.0.0.js)
* [ExtensionContent/ext.js](./ExtensionContent/ext.js)
* [ExtensionContent/index.html](./ExtensionContent/index.html)
* [ExtensionContent/style.css](./ExtensionContent/style.css)

以上。
