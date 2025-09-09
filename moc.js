/*
moc.js - menu-of-contents self-generator
横着者のためのウェブページ目次生成プラグインスクリプトです．
手作りの簡素なウェブページに対して，<details>の目次を自動で生成します．
てゆーか，<summary>を目次と見立てただけです．
多重の<details>でもOK．
Ver.2025.09.09
(c)2025, ky-heretix
*/

// 構成要素のデフォルト設定
const def = {
	knob:	// 各<details>の折畳ハンドル
//`<button class="onclick="Close(this.parentNode)">close</button>`,	// ボタン版
`
<!--
<div class="knob" onclick="Close(this.parentNode)" title="閉店ガラガラ〜">
＝　▲　＝　▲　＝　▲　＝
</div>
-->
<button class="ctrl" onclick="Close(this.parentNode)">🔺 close</button>
`,	// シャッター風
	ctrl:		// 制御盤（全<details>の開閉ボタン）
`<div id="CP">
<hr>
<button class="ctrl" onclick="ResetAll()">⏪ Reset All</button>
<button class="ctrl" onclick="CloseAll()">⏫ Close All</button>
<button class="ctrl" onclick="OpenAll()">⏩ Open All</button>
&nbsp;
<button class="ctrl" onclick="Reload()">🔁 Reload Page</button>
</div>`,
	home: '<a id="HP"></a>',
	head: '<header id="HD"></header>',
	foot: '<footer id="FT"></footer>',
}

// URLの解析	前提URL形式：http://...?QP#ID
const URL = location.href.split('?')[0].split('#')[0];	// http://...
const QP = {};				// クエリパラメータ
for (const item of location.search.slice(1).split('&')) {
	if (item) QP[item] = true;
}
const ID = location.hash.slice(1);	// フラグメントID

console.log(QP);

if (!QP['moc=off']) {

// ページ読込直後に実行開始
window.onload = Init;

// CSSファイル：moc.jsと同じディレクトリにあるsite.css
const srcdir = document.currentScript.src.replace(/[^/]*$/, '');
const CSS = document.createElement('link');
CSS.rel = 'stylesheet';
CSS.href = srcdir + 'site.css';
document.head.append(CSS);

// 設定ファイル：moc.jsと同じディレクトリにあるsite.js
const CFG = document.createElement('script');
CFG.src = srcdir + 'site.js';
document.head.append(CFG);

}

// サイトURLの生成
// 現在ページ：http://.../${topdir}/.../...
// ==> トップページ：http://.../${topdir}/index.html
function SiteURL(topdir) {
	const item = location.href.split('/');
	while (item.length) if (item.pop() == topdir) break;
	item.push(topdir);
	return (item.join('/') + '/index.html');
}

// <details>の開閉状態の復元
// HTMLソース通りに<details open>は展開，<detais>は折畳
function Reload() { location.replace(URL); }		// ページ再読込
function Reset(elem) { elem.open = elem.openBak; }	// 単独の復元
function ResetChildren(elem) {	// root以下の全<details>の復元
	for (const item of elem.getElementsByTagName('details')) {
		Reset(item);
	}
}
function ResetAll(root) {	// root以下の全<details>の復元
	if (root) Reset(root); else root = document;
	ResetChildren(root);
}

// <details>の展開
function Open(elem) { elem.open = true; }	// 単独の展開
function OpenParents(elem) {	// 祖先全員の展開
	while (elem = elem.parentElement) {
		if (elem.tagName == 'DETAILS') Open(elem);
	}
}
function OpenAll(root) {	// root以下全員の展開
	if (root) Open(root); else root = document;
	for (const elem of root.getElementsByTagName('details')) {
		Open(elem);
	}
}
function OpenNest(elem) {	// 連鎖的な展開
	Open(elem);			// 自身を展開
	OpenParents(elem);		// 祖先も展開
}

// <details>の折畳
function Close(elem) { elem.open = false; }	// 単独の折畳
function CloseChildren(elem) {	// 子孫全員の折畳
	for (const item of elem.getElementsByTagName('details')) {
		Close(item);
	}
}
function CloseAll(root) {	// root以下全員の折畳
	if (root) Close(root); else root = document;
	CloseChildren(root);
}
function CloseNest(elem) {	// 連鎖的な折畳
	Close(elem);			// 自身を折畳
	ResetChildren(elem);		// 子孫を復元
}

// 全<details>および<a>の機能強化
function ModifyAll()
{
	let n = 0;
	// <details>
	for (const elem of document.getElementsByTagName('details')) {
		elem.openBak = elem.open;	// 開閉状態の初期値を保管
		elem.innerHTML += def.knob;	// 折畳ハンドルを追加

/*
		if (elem.getElementsByTagName('details').length) {
			elem.innerHTML += def.menu;
				// サブセクション制御盤を追加
		}
*/

		elem.ontoggle = function() {
			if (!elem.open) ResetChildren(elem);
				// 閉じる際，子孫の開閉状態を復元
		}
		n++;
	}
	// <a href="#...">
	if (n) for (const elem of document.getElementsByTagName('a')) {
		const part = elem.href.split('#');
		const url = part[0].split('?')[0];
		if (url != URL) continue;	// 外部リンク
		const hash = part[1];
		if (!hash) continue;		// フラグメントIDなし
		elem.onclick = function() {	// 内部リンク先を自動展開
			OpenNest(document.getElementById(hash));
		}
	}
	return n;	// <details>の個数
}

// ページの初期設定
function Init() {
	// <title>の生成
	if (!document.title) document.title = site.title;

	// ヘッダ（トップページへのリンク）の生成
	if (!document.getElementById('HD')) {
		document.body.insertAdjacentHTML('afterbegin', def.head);
	}
	if (!document.getElementById('HP')) {
		HD.insertAdjacentHTML('afterbegin', def.home);
		if (!site.url) site.url = SiteURL(site.topdir);
		HP.href = site.url;
		HP.innerHTML = site.home;
	}

	// フッタの生成
	if (!document.getElementById('FT')) {
		document.body.insertAdjacentHTML('beforeend', def.foot);
		FT.innerHTML = site.footer;
	}

	// 全<details>および<a>の機能強化
	if (!ModifyAll()) return;

	// 制御盤（全<details>の開閉ボタン）の生成
	if (!document.getElementById('CP')) {
		FT.insertAdjacentHTML('beforebegin', def.ctrl);
	}

	// URLによる開閉制御
	if (QP['open']) OpenAll();
		// http://...?open ==> 全<details>を展開
	if (ID) Open(document.getElementById(ID));
		// http://...#ID ==> <details id="ID">を展開
}

/* HTMLサンプル断片：
<html>
<head>
...
<script src="moc.js"></script>
</head>
<body>
<h1>題名...</h1>
<p>
概要...
</p>
<details id="A">
<summary>セクション A</summary>
...
〇〇については，<a href="#B">次章</a> で詳述する．
△△については，<a href="index2.html#C">別紙</a> を参照せよ．
...
クリックするとリンク先の<details>が自動展開．
</details>

<details id="B">
<summary>セクション B</summary>
...
</details>
...
</body>
</html>
*/

