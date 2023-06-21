javascript: (function () {
  var D = document, // ドキュメントオブジェクトへの参照を取得
    B = D.getElementsByTagName("body")[0]; // ページの<body>要素を取得

  // 既にパネルが存在する場合は処理を終了する
  if (D.getElementById("sp")) {
    return;
  }

  // パネルを作成する関数
  function bmlPanel(id, w, h) {
    var P, F, H, X, DP, CL;
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    // パネル要素を<body>要素に追加
    B.appendChild((P = D.createElement("div")));

    // パネル要素の属性とスタイルを設定
    (P.id = id),
      (P.style.cssText =
        "position: fixed; top: 25%; left: 50%; transform: translate(-50%, -50%); padding: 2px; width: " +
        w +
        "px; height: " +
        h +
        "px; background: #000; border: 0; color: #fff; font-size: 12px; text-align: left; z-index: 9998; border-radius: 5px; cursor: move;");

    // パネルにヘッダー要素を追加
    P.appendChild((H = D.createElement("div")));

    // ヘッダー要素の属性とスタイルを設定
    (H.innerHTML = id),
      (H.style.cssText =
        "padding: 0px 10px; height: 20px; line-height: 20px; color: #fff; font-size: 12px; font-weight: bold; text-align: center; cursor: move;");

    DP = D.createElement("div");
    DP.style.cssText =
      "background: transparent; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;";

    // パネルにコンテンツ要素を追加
    P.appendChild((F = D.createElement("div")));

    // コンテンツ要素のスタイルを設定
    with (F.style) {
      (height = h - 20 - 4 + "px"),
        (backgroundColor = "#222"),
        (color = "#eee"),
        (fontSize = "11px"),
        (cursor = "auto");
    }

    // パネルにクローズボタン要素を追加
    P.appendChild((CL = D.createElement("div")));

    // クローズボタン要素の属性とスタイルを設定
    CL.title = "close";
    // クローズボタンのスタイルを設定
    CL.style.cssText =
      "position: absolute; top: 5px; left: 5px; height: 10px; width: 10px; cursor: pointer; text-align: center; line-height: 10px; background-color: red; color: #fff;";

    // クローズボタンをクリックしたときの処理
    CL.onclick = function () {
      B.removeChild(this.parentNode);
    };

    // パネルをドラッグするためのイベントリスナーを追加
    H.addEventListener("mousedown", dragMouseDown);

    // パネルをドラッグするための処理
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      P.style.top = P.offsetTop - pos2 + "px";
      P.style.left = P.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }

    // パネル要素にヘッダーとコンテンツを関連付ける
    P.header = H;
    P.content = F;

    // パネル要素を返す
    return P;
  }

  // 日付が正しいか判定する関数
  function judgeDateText(releaseDay) {
    if (Array.isArray(releaseDay.match(/\d{2}\/\d{2}/)) || releaseDay === "") {
      return true;
    }
    // エラーの場合はメッセージを出す
    window.alert("ERROR! mm/dd の形式で入力してください！");
    return false;
  }

  // チケットにテンプレートを流し込む関数
  function inputTicketData(releaseDay, trackerId, trackerTitle) {
    var names;

    // prefixを設定
    var prefix = "[" + trackerTitle.slice(0,-5) + "]";

    // フォームの値を設定
    names = document.getElementsByName("issue[subject]");
    names[0].value = `${prefix}${releaseDay}リリースタスク`;

    // トラッカーの初期値を設定
    names = document.getElementsByName("issue[tracker_id]");
    for (var j = 0; j < names[0].options.length; j++) {
      var option = names[0].options[j];
      if (names[0].options[j].value == trackerId) {
        option.selected = true;
        break;
      }
    }

    // テンプレートを設定
    names = document.getElementsByName("issue_template");
    for (var j = 0; j < names[0].options.length; j++) {
      var option = names[0].options[j];
      if (names[0].options[j].value == "641") {
        option.selected = true;
        break;
      }
    }

    // ステータスを設定
    names = document.getElementsByName("issue[status_id]");
    for (var j = 0; j < names[0].options.length; j++) {
      var option = names[0].options[j];
      if (names[0].options[j].value == "1") {
        option.selected = true;
        break;
      }
    }

    // 優先度を設定
    names = document.getElementsByName("issue[priority_id]");
    for (var j = 0; j < names[0].options.length; j++) {
      var option = names[0].options[j];
      if (names[0].options[j].value == "4") {
        option.selected = true;
        break;
      }
    }

    // 完了率を設定
    names = document.getElementsByName("issue[done_ratio]");
    for (var j = 0; j < names[0].options.length; j++) {
      var option = names[0].options[j];
      if (names[0].options[j].value == "0") {
        option.selected = true;
        break;
      }
    }

    // 説明を設定
    names = document.getElementsByName("issue[description]");
    names[0].value = `${releaseDay}リリースタスクです。`;
  }

  // トラッカーの値を取得する関数
  function getTrackerItem() {
    // トラッカーのリストを出力
    var names = document.getElementsByName("issue[tracker_id]");
    var trackerList = [];
    var indexOffset = 0;
    for (var j = 0; j < names[0].options.length; j++) {
      var option = names[0].options[j];
      // 古いイベントは弾く
      if (option.value < 384) {
        indexOffset++;
        continue;
      }
      trackerList[j - indexOffset] = [];
      trackerList[j - indexOffset][0] = option.textContent;
      trackerList[j - indexOffset][1] = option.value;
    }
    console.log(trackerList);
    return trackerList;
  }

  var Es = getTrackerItem();

  // パネルを作成（アイテム数だけ高さを確保する）
  var SP = bmlPanel("sp", 370, 175 + 23 * Es.length);

  // パネルのヘッダーテキストを設定
  SP.header.innerHTML = "親チケットテンプレート";
  SP.content.innerHTML =
    '<div style="padding: 10px;">テキスト入力欄にリリース日を mm/dd の形式で入力してください</div>';

  var C = SP.content, // パネルのコンテンツ要素
    qt, // テキスト入力欄
    rb = [], // ラジオボタン
    td = [], // ラベル
    i,
    sbm,
    tmp;

  // テキスト入力欄の初期値の日付を作成
  var today = new Date();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var initDate =
    month.toString().padStart(2, "0") + "/" + day.toString().padStart(2, "0");

  // テキスト入力欄を作成し、パネルに追加
  C.appendChild((qt = D.createElement("input")));

  // ラジオボタンの説明を追加
  C.style.marginBottom = "10px";
  var textNode = D.createTextNode(
    "作成したいチケットのシーズンを選択してください"
  );
  var container = D.createElement("div");
  container.style.padding = "10px";
  container.appendChild(textNode);

  // 要素をパネルに追加
  C.appendChild(container);

  with (qt) {
    (type = "text"),
      (value = initDate),
      (style.cssText =
        "display:block; width:90%; margin:6px; border:1px solid #666; background:transparent; color:inherit; font-weight:bold; font-size:13px;");
  }

  // ラジオボタンとラベルを作成し、パネルに追加
  for (i = 0; i < Es.length; i++) {
    var container = D.createElement("div");
    container.style.cssText =
      "display: flex; align-items: center; margin: 6px;";
    C.appendChild(container);

    container.appendChild((rb[i] = D.createElement("input")));
    container.appendChild((td[i] = D.createElement("div")));
    C.appendChild((tmp = D.createElement("div")));

    // ラジオボタンの属性とスタイルを設定
    with (rb[i]) {
      (type = "radio"),
        (name = "service"),
        (value = Es[i][1]),
        (style.cssText = "margin-right: 5px;");
    }

    // ラベルのテキストとスタイルを設定
    with (td[i]) {
      innerHTML = Es[i][0];
      style.cssText = "cursor: pointer;";

      // ラベルをクリックしたときの処理
      td[i].onclick = (function (index) {
        return function () {
          rb[index].checked = true;
        };
      })(i);
    }
  }

  // ボタンを作成し、パネルに追加
  C.appendChild((sbm = D.createElement("button")));

  with (sbm) {
    (innerHTML = "チケットに書き込む"),
      (style.cssText =
        "cursor:pointer; margin:6px auto; display:block; clear:both; padding: 6px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 14px;");

    // ボタンをクリックしたときの処理
    onclick = function () {
      if (!judgeDateText(qt.value)) {
        return;
      }
      for (i = 0; i < rb.length; i++) {
        if (rb[i].checked) {
          // チケットにテンプレートを流し込む
          inputTicketData(qt.value, rb[i].value, Es[i][0]);
        }
      }
      // 全ての処理が終わったらパネルを閉じる
      B.removeChild(SP);
    };
  }

  // (2023 06/19現在)25プレを選択状態にする
  rb[1].checked = true;

  // テキスト入力欄にフォーカスを当てる
  qt.focus();
})();
