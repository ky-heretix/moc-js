# moc.js
横着者のためのウェブページ目次生成プラグインスクリプトです．

## 概要
HTML の `<details>`＆`<summary>`タグを利用すると，
アコーディオン（開閉）式のページを容易に実現できます．
閉じておけば目次，開けば本文となります．

しかし，標準機能としては，
手動で `<summary>` 部分をクリックしないと
`<details>` セクションを開閉できません．
このため，次のような不便がありました．

- `<details>` 内のコンテンツが多い場合，
閉じるためにページのスクロールバックも必要．
- リンク経由で `<details>` に来た場合，
目次のどの項目を開くべきか不明．

本スクリプト `moc.js` は，これらの問題点を解決します．
まあ，[デモ](https://www.kushiro-ct.ac.jp/yanagawa/moc-js/demo/index.html) でも御覧ください．
<!-- [デモ](./demo/index.html) -->
「御品書だよ `<summary>` は．」

## ウェブサイトへの導入方法
- スクリプトファイル `moc.js` をサイト内の適切なディレクトリに移設．
- 同ファイル内の「サイト設定」部分をサイトの状況に応じて適切に変更．

## ウェブページの編集作業
ウェブページ編集時の必須の追加作業は次の３点だけです．
（元々，`details`＆`<summary>` を使っていた場合の話です．）

- スクリプトの読込 `<script src="moc.js"></script>`
- `<body>` への `onload="Init()"` の付与
- `<details>` への `id="..."` の付与

その他，お好み次第で CSS を読み込ませたりしてください．

## サンプル HTML 断片
```html
<head>
...
<script src="moc.js"></script><!--必須-->
</head>
<body onload="Init()"><!--onload必須-->
...
<details id="A"><!--id必須-->
<summary>セクション A</summary>
<ul>
<li><a href="page2.html#X">別ページのセクション X へ移行．</a>
（自動で開きますよ💗）
<li><a href="#B">このページ内の別セクション B へ移行．</a>
（手動で開いてね😞）
<li><a href="#B" onclick="Open(B);">セクション B へ移行．</a>
（記述は面倒ですが，自動で開きますよ💩）
</ul>
</details>
<details id="B">
<summary>セクション B</summary>
<a href="/test/details.html#A" onclick="Open(A);">Open and Goto #A.</a>
<a href="#A">Just Goto #A.</a>
</details>
```

## 残念な現状
- 同ページへのリンクの場合，再読込が発生しないので，
`onclick="Open(...);"` の指定も必要です．
（別ページへのリンクの場合，`onclick` は不要です．）
- 多重化された `<details>` の場合，
内側へのリンクでは `Open(...)` が意図通りに効きません．
（内側が開いても，外側は閉じたままなので．）

