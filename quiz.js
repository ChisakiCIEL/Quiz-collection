$(function () {

    function init() {

        //イベント登録
        $(".filter_year input").on("change", onFilterChange);
        $(".filter_keyword input").on("change", onFilterChange);
        $(".filter_option input").on("change", onFilterChange);
        $(".filter_pages input").on("change", onFilterChange);
        //$(".filter_first input").on("change", onFilterChange);

        //すべて結合
        allList = List01;

        //未定義aliasにuserを代入

        //最初はすべてを出力
        refleshHtml(allList);
    }


    /*================================================================
    HTML出力
    ================================================================*/

    //出力する内容をRecord_dataに格納
    function refleshHtml(list) {
        /*================================================================*/
        //出力する内容をBoard_dataに格納
        let Board_data = '';

        if (list.length >= 0) {
            _.each(list, function (line, i) {
                let genre = '';
                if (line.genre == 1) {
                    genre = '文系';
                } else if (line.genre == 2) {
                    genre = '理系';
                } else if (line.genre == 3) {
                    genre = '雑学';
                } else if (line.genre == 4) {
                    genre = 'スポーツ';
                } else if (line.genre == 5) {
                    genre = 'ニュース';
                } else if (line.genre == 6) {
                    genre = '芸能';
                };

                Board_data += `<div class="deckframe"><div class="rankerdata"><div class="deck">`;
                Board_data += `　${line.sentence}<div class="genre">${genre}　</div>`;
                Board_data += `<hr class="border" ><div class="exp">`

                let AnsEncode = encodeURIComponent(line.answer);

                if (line.dummy1 != undefined) {
                    Board_data += `<div class="names1"><a href="https://www.google.co.jp/search?q=${AnsEncode}" target="_blank" rel="noopener noreferrer">１．${line.answer}</a></div><div class="names1 answer2">２．${line.dummy1}</div></div><div class="exp"><div class="names1 answer2">３．${line.dummy2}</div><div class="names1 answer2">４．${line.dummy3}</div>
              </div>`;

                } else {
                    Board_data += `<div class="names1 answer"><a href="https://www.google.co.jp/search?q=${AnsEncode}" target="_blank" rel="noopener noreferrer">${line.answer}</a></div></div>`;
                }

                Board_data += `</div></div></div>`;
            });

        } else {
            //スクロールバー関連
            $('.Board_data').css({
                'height': '',
                'height': 'auto'
            });
        };


        //HTML出力
        $('.Board_data').html(Board_data);
        //検索件数表示
        $('.productCntArea').html(`<div class="noproduct"><center><p>${list.length} / ${allList.length}</center></p></div>`);

        //スクロールバー関連
        if (list.length < 10) {
            $('.Board_data').css({
                'height': 'auto',
            });
        } else {
            $('.Board_data').css({
                'height': '',
            });
        };
    }

    /*================================================================
    絞り込み条件を変更した時
    ================================================================*/
    function onFilterChange(e) {

        var filterFncs = [];
        var result = [];

        //セレクトボックスの値を引数に指定した関数filterByOptionをfilterFuncs配列に格納
        filterFncs.push(
            function (list) {
                return filterByOption(list, $('.filter_option input:checked'));
            }
        );

        //セレクトボックスの値を引数に指定した関数filterByOptionをfilterFuncs配列に格納
        filterFncs.push(
            function (list) {
                return filterByPages(list, $('.filter_pages input:checked'));
            }
        );
        //チェックボックスの値を引数に指定した関数filterByYearをfilterFuncs配列に格納
        filterFncs.push(
            function (list) {
                return filterByYear(list, $('.filter_year input:checked'));
            }
        );
        //キーワードの値を引数に指定した関数filterByKeywordをfilterFuncs配列に格納
        filterFncs.push(
            function (list) {
                return filterByKeyword(list, _.escape($('.filter_keyword input').val()));
            }
        );
        //チェックボックスの値を引数に指定した関数filterByYearをfilterFuncs配列に格納
        //FilterFuncs配列内の関数をバケツリレーみたいに1つずつ実行して結果をresult配列に格納
        result = _.reduce(filterFncs, function (list, fnc) {
            return fnc(list);
        }, allList);

        refleshHtml(result);
    }
    /*================================================================
       絞り込み[1] ゾロ目等絞り込み
       ================================================================*/
    function filterByOption(list, value) {

        //絞り込み指定がない場合はリターン
        if (value.length == "") {
            return list;
        }

        //選択した属性（チェックボックス）とremarkがマッチするかでフィルタリング
        return _.filter(list, function (item) {

            var isMatch = false;

            _.each(value, function (optionItem, i) {

                _.each([item.type], function (optiItem, i) {
                    if (optiItem == $(optionItem).val()) {
                        isMatch = true;
                    }
                });

            });

            return isMatch;
        });
    }

    /*================================================================
    絞り込み[2] ページ絞り込み
    ================================================================*/
    function filterByPages(list, value) {

        if (value.length == 0) {
            return list;
        }

        //選択した属性（チェックボックス）とyearがマッチするかでフィルタリング
        return _.filter(list, function (item) {

            var isMatch = false;

            _.each(value, function (optionItem, i) {

                _.each([item.genre], function (optiItem, i) {
                    if (optiItem == $(optionItem).val()) {
                        isMatch = true;
                    }
                });

            });

            return isMatch;
        });
    }
    /*================================================================
       絞り込み[4] 年代絞り込み
       ================================================================*/
    function filterByYear(list, value) {

        if (value.length == 0) {
            return list;
        }

        //選択した属性（チェックボックス）とyearがマッチするかでフィルタリング
        return _.filter(list, function (item) {

            var isMatch = false;

            //配列同士の比較
            _.each(value, function (chkItem, i) {

                _.each([item.year], function (yearItem, i) {
                    if (yearItem == $(chkItem).val()) {
                        isMatch = true;
                    }
                });

            });

            return isMatch;
        });
    }
    /*================================================================
        絞り込み[6] ユーザー名絞り込み
        ================================================================*/
    function filterByKeyword(list, value) {


        if (value == "") {
            return list;
        }


        var freeAry = [];
        var val = value.replace(/or/g, "or");
        searchAry = val.split("or");

        //入力したキーワードがuserもしくaliasにマッチするかでフィルタリング
        return _.filter(list, function (item) {

            var isMatch = false;

            _.each(searchAry, function (data, i) {
                if (item.sentence.indexOf(data) != -1 || item.answer.indexOf(data) != -1) {
                    isMatch = true;
                }
            });

            return isMatch;

        });

    }

    init();

});
