// サイト設定
const site = {
//	url: 'http://.../demo/index.html';	// 複数URL対応のため自動設定が吉
	topdir: 'demo',
	home: 'MoC-JS',
	title: 'moc.js - menu-of-contents self-generator',
	footer: '(c)2025, ky-heretix',
}

/*
moc.js - menu-of-contents self-generator
ver.2025.09.01
ページの目次を自動で生成します．
てゆーか，<summary>を目次と見立てただけです．
(c)2025, ky-heretix
*/

// デフォルト設定
const def = {
	knob: {		// クローズハンドル
//		text: '<button>close</button>',		// ボタン版
//		title: 'close this section',
		text: '＝　▲　＝　▲　＝　▲　＝',	// シャッター風
		title: '閉店ガラガラ〜',
	},
}

// サイトURLの自動設定
// 前提 URL 形式：
//	現在ページ：http://.../${topdir}/.../...
//	トップページ：http://.../${topdir}/index.html
const item = location.href.split('/');
while (item.length) if (item.pop() == site.topdir) break;
item.push(site.topdir);
site.url = item.join('/') + '/index.html';

// パラメータの解析
// 前提URL形式：http://...?QP#ID
const QP = {};				// クエリパラメータ
for (let item of location.search.slice(1).split('&')) {
	if (item) QP[item] = true;
}
const ID = location.hash.slice(1);	// フラグメントID

// <details>の開閉制御
function Open(elem) { elem.open = true; }
function Close(elem) { elem.open = false; }
function OpenAll() {
	for (let elem of document.getElementsByTagName('details')) {
		Open(elem);
	}
}
function CloseAll() {
	for (let elem of document.getElementsByTagName('details')) {
		Close(elem);
	}
}

// 全<details>にクローズハンドルを追加
function ModifyAll(text=def.knob.text, title=def.knob.title)
{
	const knob = '<div class="knob" onclick="Close(this.parentNode)"'
		+ '" title="' + title + '">'
		+ text + '</div>';
	for (let elem of document.getElementsByTagName('details')) {
		elem.innerHTML += knob;
	}
}

// ページの初期設定
function Init(text=def.knob.text, title=def.knob.title) {
	document.title = site.title;	// <title>を生成

	ModifyAll(text, title);		// クローズハンドルを追加

	if (QP['open']) OpenAll();
		// http://...?open ==> 全<details>をオープン
	if (ID) Open(document.getElementById(ID));
		// http://...#ID ==> <details id="ID">をオープン

	// トップページへのリンクを生成
	const HD = document.createElement('header');
	const HP = document.createElement('a');
	HD.append(HP);
	HP.innerHTML = site.home;
	HP.href = site.url;
	document.body.prepend(HD);

	// フッタを生成
	const FT = document.createElement('footer');
	FT.innerHTML = site.footer;
	document.body.append(FT);

	// 全開閉ボタンを生成
	const CP = document.createElement('div');
	CP.className = 'ctrl';
	const OB = '<button onclick="OpenAll()">Open All Sections</button>';
	const CB = '<button onclick="CloseAll()">Close All Sections</button>';
	CP.innerHTML = OB + CB;
	FT.before(CP);
}

