$(function() {
  //一致するユーザーがいた場合の処理
  function addUser(user) {
    let html = `
              <div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${user.name}</p>
                <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
              </div>
            　 `;
    //作ったhtmlを入れる
    $("#user-search-result").append(html);
  }

  //一致するユーザーがいなかった場合の処理
  function addNoUser(){
    let html =`
              <div class="chat-group-user clearfix">
                <p class="chat-group-user__name">ユーザーが見つかりません</p>
              </div>
              `;
    //作ったhtmlを入れる
    $("#user-search-result").append(html);
  }

  function addDeleteUser(name, id) {
    let html = `
              <div class="chat-group-user clearfix" id="${id}">
                <p class="chat-group-user__name">${name}</p>
                <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
              </div>
              `
    $(".js-add-user").append(html);
  }
  function addMember(userId) {
    //userのidをinputタグの初期値としそれをnameを使ってgroupsコントローラ内のparamsで受け取る準備
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;

    //作ったinputタグをaddDeleteUser内で作ったhtml内に書き込む
    $(`#${userId}`).append(html);
  }

  //検索欄に文字入力されるたびに処理を行う
  $("#user-search-field").on("keyup", function() {
    let input = $("#user-search-field").val();
    $.ajax({
      type: "GET",
      url: "/users",
      data: { keyword: input },
      dataType: "json"
    })
      .done(function(users){
        //if,else if,elseどの場合においても、処理後は、すでに検索欄に出力されている情報を削除する。
        $("#user-search-result").empty();
        //検索に一致するユーザーが０じゃない場合(いる場合)
        if (users.length !== 0) {
                //usersという配列をforEachで分解し、ユーザーごとにaddUser関数に飛ばす。
          users.forEach(function(user) {
            addUser(user);
          });
                //入力欄に文字が入力されてない場合処理を終了
        } else if (input.length == 0) {
          return false;
                //検索に一致するユーザーがいない場合はaddNoUserに飛ばす
        } else {
          addNoUser();
        }
      })

      .fail(function(){
        alert("通信エラーです。ユーザーが表示できません。");
      });
  });

  // 追加ボタンを押した際の処理
  $(document).on("click", ".chat-group-user__btn--add", function() {
    //クリックされたところのデータを取得し各変数に代入
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");

    //クリックされたところのhtmlを親要素ごと消す（検索結果から消す）
    $(this)
      .parent()
      .remove();

    //削除ボタンの書いてあるhtmlを呼び出す処理に飛ばす
    addDeleteUser(userName, userId);

    //ユーザーをグループに登録するための処理
    addMember(userId);
  });

  $(document).on("click", ".chat-group-user__btn--remove", function() {
    //クリックされたところのhtmlを親要素をごと消す（検索結果から消す）
    $(this)
      .parent()
      .remove();
  });
});

