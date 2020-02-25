var _type = true;

		//拖动鼠标，滑动歌词列表
		$(function() {
			$('.scroll_bar .bar').mousedown(function(e) {
				$('body').addClass('noselects');
				//			e.stopPropagation();
				$(document).mousemove(function(e) {
					//鼠标的位置
					var y = e.clientY || e.pageY
					//滚动条的父元素
					var scroll_bar_height = $('.scroll_bar').height();
					//计算li的个数
					var item_len = $('.music_list  li ').length;
					//一个li高度
					var $height = $('.music_list  li ').eq(0).height();
					//所有li总高度	
					var $totle_height = $height * item_len;
					//滚动条高度
					var $bar_height = $('.scroll_bar .bar').height()
					//				var $bar_height = ($totle_height / scroll_bar_height) * $height;
					/*$('.scroll_bar .bar').css({
						'height': $bar_height
					});*/

					//				var bar_height = $('.scroll_bar .bar').height();
					//滚动条的父元素的top
					var top = $('.scroll_bar ').offset().top;
					//滚动条的的top
					var h = y - top - $bar_height / 2;
					var bit = h / scroll_bar_height;

					console.log(h + "---h");

					if(h > scroll_bar_height - $bar_height) {
						h = scroll_bar_height - $bar_height;
					}
					if(h < 0) {
						h = 0;
					}
					$('.music_list').addClass('ppp').scrollTop($totle_height * bit);
					$('.scroll_bar .bar').css({
						'top': h
					});

				}).mouseup(function() {
					$(document).unbind('mousemove');;
					$('body').removeClass('noselects');

				});
			});
		})

		$(document).on('mousewheel DOMMouseScroll', onMouseScroll);
		var num = 0;

		function onMouseScroll(e) {
			e.preventDefault();
			var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			var delta = Math.max(-1, Math.min(1, wheel));

			num += 200;
			if(delta < 0) { //向下滚动
				$('.music_list').scrollTop(num);
				console.log('向下滚动');
			} else { //向上滚动
				console.log('向上滚动');
				$('.music_list').scrollTop(-num);

			}
			console.log(num)
		}

		//播放界面模式切换
		$('.type_select').click(function() {

			if(_type) {

				$('.type_select .txt').removeClass('fl').addClass('fr').siblings('.dot').removeClass('fr').addClass('fl');
				_type = false;
				$('.main_content').hide();
				$('#top-bar').show();
				$('#lyrics').show();

				// $('.only_lyric_page').show();

			} else {

				$('.type_select .txt').removeClass('fr').addClass('fl').siblings('.dot').removeClass('fl').addClass('fr');
				_type = true;
				$('.main_content').show();
				$('#top-bar').hide();
				$('#lyrics').hide();
				// $('.only_lyric_page').hide();
				// $('.only_lyric_page').$('#player').$('#menu').show();

			}

			console.log(_type);
        });
        
		$.ajax({
			type: "get",
			url: "data/music.json",
			async: true,
			success: function(data) {
				var $ul_dom = $('#music_list ul');
				var audio = document.createElement('audio');

				var b = true;
				var index = 0;

				$(document).ready(function() {
					audio.volume = 0.5;

				});
				//界面模式切换

				//当前音乐播放结束，自动播放下一首
				audio.onended = function() {
					$('.icon-xiayishou2').trigger('click');
				}
				//点击音量按钮
				$('.player_voice ').mousedown(function(e) {
					//鼠标位置
					var x = e.clientX || e.pageX;
					//获取进度条的left值					
					var $voice_load_left = $('.player_voice_load').offset().left;
					// 鼠标在进度条上的位置					
					var w = x - $voice_load_left;
					// 获取点击元素的最大位置			
					var maxLeft = $('.player_voice_load').width();

					$('.player_voice__play').css({
						'width': w
					});
					audio.volume = w / maxLeft;
					//					console.log(x+"----")

				});

				//拖动音量按钮
				$('.player_voice__dot').mousedown(function() {

					$(document).mousemove(function(e) {
						// 获取鼠标的位置
						var x = e.clientX || e.pageX;
						//获取进度条的left值
						var $voice_load_left = $('.player_voice_load').offset().left;
						// 鼠标在进度条上的位置
						var w = x - $voice_load_left;

						// 获取拖动元素的最大位置
						var maxLeft = $('.player_voice_load').width();

						if(w > maxLeft) {
							w = maxLeft
						} else if(w < 0) {
							w = 0
						}

						//						console.log(w + "wwwwwwwwwww")
						$('.player_voice__play').css({
							'width': w
						});

						audio.volume = w / maxLeft;

					}).mouseup(function() {
							$(document).unbind('mousemove');
							$(document).unbind('mouseup');
						}

					)

				})

				//点击进度条，跟新播放进度
				$('.player_progress').mousedown(function(e) {
					//鼠标的点击位置
					var x = e.clientX || e.pageX;
					//进度条的left值
					var player_progress_left = $(this).offset().left;
					//鼠标在进度条上的位置
					var w = x - player_progress_left;
					//进度条的长度
					var width = $(this).width();
					//					console.log(w)
					//鼠标在进度条上的位置/进度条的长度
					var percent = w / width;

					$('.player_progress__play').css({
						'width': w
					});

					audio.currentTime = audio.duration * percent;
					//					console.log(percent + "------");
					//					console.log(audio.currentTime + ";;;;;;;;;;;;")

				})
				//拖动进度条的小圆点，更新播放进度
				$('.player_progress__dot').mousedown(function() {

					$(document).mousemove(function(e) {
						// 获取鼠标的位置
						var x = e.clientX || e.pageX;
						//进度条的left值
						var player_progress_left = $('.player_progress').offset().left;
						//鼠标在进度条上的位置
						var w = x - player_progress_left;
						//进度条的长度
						var width = $('.player_progress').width();

						w > width ? w = width : w = x - player_progress_left;
						w < 0 ? w = 0 : w = x - player_progress_left;

						$('.player_progress__play').css({
							'width': w
						});
						audio.currentTime = audio.duration * (w / width);

					}).mouseup(function() {
						$(document).unbind('mousemove');
					});

				});

				// 定义格式化日期的函数
				function formartTime(time) {
					var m = Math.floor(time / 60);
					var s = Math.floor(time % 60);
					return(m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
				}

				//底部按钮 上一首
				$('.play_footer a .icon-shangyishou').click(function() {

					var song_len = data.length;
					//					console.log(song_len)
					index--;
					if(index < 0) {
						index = song_len - 1;
					}
					audio.src = "mp3/" + data[index].song_url;
					audio.play();
					loadLrc(); //加载歌词
					songInfo(index); //歌曲信息：歌名，歌手
					isPaused(true) //按钮状态 播放/暂停
					//					console.log(audio.src + "----------")
					//					console.log(index + "上一首");
				});
				//歌曲信息：歌名，歌手
				function songInfo(i) {
					$('.box_right p span.name').text(data[i].name);
					$('.box_right p span.author').text(data[i].author);
					$('.box_right div a img').attr('src', data[i].img_url);
					$('.music_info .player_music__info .song_name').text(data[index].name);
					$('.music_info .player_music__info .author').text(data[index].author);

				}
				//底部按钮 下一首
				$('.play_footer a .icon-xiayishou2').click(function() {

					var song_len = data.length;
					//					console.log(song_len)
					index++;
					if(index > song_len - 1) {
						index = 0;
					}
					audio.src = "mp3/" + data[index].song_url;

					audio.play();
					loadLrc();
					songInfo(index);
					console.log(index + "下一首");
					isPaused(true) //按钮状态 播放/暂停

				})
				//按钮状态 播放/暂停
				function isPaused(play) {
					//					console.log(play)
					if(play) {
						$('.play_footer a .laodao66').removeClass('icon-zanting').addClass('icon-bofang');
						$('.music_item ').eq(index).find('.name .icon-Icon_bofang').removeClass('icon-Icon_bofang').addClass('icon-bofang');
						$('.music_item').eq(index).find('.state').hide().siblings(' .state_img').find('img').show().parents('.music_item').siblings().find('.state').show().siblings('.state_img').find('img').hide();
						$('.music_item').eq(index).find(' .name .btn_play').addClass('icon-bofang').removeClass('icon-Icon_bofang').parents('.music_item ').siblings('.music_item ').find('.name .btn_play').addClass('icon-Icon_bofang').removeClass('icon-bofang');
					} else {
						$('.play_footer a .laodao66').removeClass('icon-bofang').addClass('icon-zanting');
						$('.music_item ').eq(index).find('.name .icon-Icon_bofang').removeClass('icon-bofang').addClass('icon-Icon_bofang');
						$('.music_item').eq(index).find(' .name .btn_play').addClass('icon-Icon_bofang').removeClass('icon-bofang').parents('.music_item ').siblings('.music_item ').find('.name .btn_play').addClass('icon-Icon_bofang').removeClass('icon-bofang');
						$('.music_item').eq(index).find(' .state_img img').hide().parent('.state_img').siblings('.state').show().parents('.music_item').siblings().find('.state_img img').hide();

					}
				}

				//底部按钮      暂停播放

				$('.play_footer a .icon-zanting').click(function() {
					var obj = $(this);

					playMusic(obj);
					//显示歌词
					loadLrc();
					//显示歌曲基本信息
					songInfo(index);
				});

				//底部按钮      暂停播放
				function playMusic(obj) {
					var playtime = $("body").attr("playTime");
					//					console.log(playtime);
					if(b) {

						if(playtime == undefined) {
							audio.src = "mp3/" + data[index].song_url;

						}
						audio.play();
						animation(true); //专辑旋转特效
						b = false;
						isPaused(true); //按钮状态 播放/暂停

					} else {
						audio.pause();
						animation(false);
						b = true;
						isPaused(false); //按钮状态 播放/暂停

					}
				}

				//index改变，就显示对应的歌曲的全部歌词 start
				function loadLrc() {
					$.ajax({
						type: "get",
						url: data[index].lrc,
						success: function(data) {
							//								console.log(typeof data);
							//第一次截取
							var arr0 = data.split('[');
							//清空上一次的歌词
							$('.song_info__lyric').empty();
							$('.only_lyric_page').empty();
							for(var i = 0; i < arr0.length; i++) {
								//	第二次截取
								var arr1 = arr0[i].split(']');
								//								console.log(arr1)
								//歌词 
								var txt = arr1[1];
								//									console.log(txt + "song");

								//分钟数秒数,毫秒
								var time_arr = arr1[0].split('.');
								//不要毫秒，保留分钟数秒数							
								var munite_secord_arr = time_arr[0].split(':');

								var s1 = munite_secord_arr[0] * 60
								var s2 = munite_secord_arr[1] * 1
								//将分钟数和秒数转化为秒数，相加
								var s = munite_secord_arr[0] * 60 + munite_secord_arr[1] * 1

								//console.log(munite_secord_arr + "----" + s1 + "-----" + s2);
								//将txt变为对象，才能有长度
								var tmpTxt = new String(txt);
								//																console.log(typeof tmpTxt);
								//长度大于2，即不能为空，也不能为空格
								if(tmpTxt.length > 2 && s > 0) {
									console.log(s + "-----" + txt + "-----" + tmpTxt.length);
									var $p = document.createElement('p');
									var $pp = document.createElement('p');

									//txt和秒数拼接（刚好对应  下面的.txt'+i，改变样式）
									$p.className = 'txt' + s;
									$pp.className = 'song_txt' + s;
									$('.song_info__lyric').append($p);
									$('.only_lyric_page').append($pp);
									$p.innerHTML = tmpTxt;
									$pp.innerHTML = tmpTxt;
								}

							}

						}
					});
				}
				//index改变，就显示对应的歌曲的全部歌词 end

				//在当前播放位置改变时执行
				audio.ontimeupdate = function() {
					var curentPlayTime = audio.currentTime;
					$("body").attr("playTime", curentPlayTime);
					showLrc();
					//歌词滚动 ,相应歌词变色
					function showLrc() {
						//秒数向下取整
						var i = (Math.floor(audio.currentTime));
						//console.log(audio.currentTime+"----------")
						//相应秒数的歌词显示绿色
						$('.song_info__lyric').find('.txt' + i).addClass('select').siblings().removeClass('select');
						$('.only_lyric_page').find('.song_txt' + i).addClass('select').siblings().removeClass('select');
						var _index = $('.txt' + i).index();
						//	console.log(_index+"----------")
						if(_index > 0) {
							//主页song_info__lyric
							$('.song_info__lyric').scrollTop((_index - 2) * 32);
							//只有歌词的页面only_lyric_page
							$('.only_lyric_page').scrollTop((_index - 2) * 55);
						}
						//	console.log(_index + "----------");
					}

					//播放时更新进度条长度
					scrollLrc();

					function scrollLrc() {
						var currentTime = formartTime(audio.currentTime);
						var totleTime = formartTime(audio.duration);
						//audio.ontimeupdate

						$('.player_progress .player_progress__play').css({
							'width': audio.currentTime / audio.duration * 100 + "%"
						});
						$('.music_info .player_music__info .song_name').text(data[index].name);
						$('.music_info .player_music__info .author').text(data[index].author);
						$('.player_music__time').text(currentTime + "/" + totleTime);

					}
					/*audio.oncanplay = function() {
						$('.player_music__time').text(formartTime(audio.currentTime) + "/" + formartTime(audio.duration));
					}*/
					audio.ondurationchange = function() {

						$('.player_music__time').text(formartTime(audio.currentTime) + "/" + formartTime(audio.duration));

					}
				}

				//全选反选 start
				$('#songlist__header>input[type="checkbox"]').click(function() {
					// 获取inputchecked属性方法有点奇葩  
					// 对：$('#songlist__header>input')[0].checked
					// 错：$('#songlist__header>input').checked;
					console.log($('#songlist__header>input')[0].checked);

					var item_input = $('.music_item >input');
					var len = $('.music_item').length;

					for(var i = 0; i < len; i++) {
						if($('#songlist__header>input')[0].checked == true) {

							$('.music_item >input[type="checkbox"]')[i].checked = true;

						} else {
							$('.music_item >input[type="checkbox"]')[i].checked = false;

						}
					}
				})
				//全选反选 end
				showSongList();
				//显示音乐列表
				function showSongList() {
					for(var i = 0; i < data.length; i++) {
						//创建元素
						createLi(i);

					}

				}

				//				console.log(musicArr);
				//  单首播放暂停切换
				$('.music_item .name .btn_play').each(function() {
					$(this).click(function() {

						index = $(this).parents('.music_item').index() - 1;
						//四个按钮显示
						$(this).parent('.mod_list_menu').addClass('show').siblings('.mod_list_menu').addClass('show').parents('.music_item').siblings('.music_item').find('.name .mod_list_menu').removeClass('show');

						playOrPause(index, $(this));
						loadLrc();
						songInfo(index);

					})
				});

				function playOrPause(index, obj) { //改变按钮样式
					//每次进来都重新给歌曲的地址
					audio.src = "mp3/" + data[index].song_url;
					var sel = obj.parents('.music_item ').attr('sel');
					//播放暂停切换:如果当前暂停，下一次就播放
					if(!sel) {
						obj.parents('.music_item ').attr('sel', 'select').siblings().removeAttr('sel');
						audio.play();
						animation(true);
						isPaused(true); //按钮状态 播放/暂停

					} else {
						audio.pause();
						obj.parents('.music_item ').removeAttr('sel');
						$('.author_img ').removeClass('animation');
						isPaused(false); //按钮状态 播放/暂停
						animation(false);

					}
					songInfo(index);

					$('.bg_player').css({
						'background-image': 'url(' + data[index].img_url + ')'
					});
				}

				function animation(flag) {
					if(flag) {
						$('.author_img ').addClass('animation');

					} else {
						$('.author_img ').removeClass('animation');

					}
				}

				function createLi(i) {
					//创建外层li
					var li_box = document.createElement('li');
					li_box.className = 'music_item clearfix ';
					$('.music_item').eq(0).addClass('border-top');

					//把外层li追加到ul
					$ul_dom.append(li_box);
					//创建input
					var input = document.createElement('input');
					input.type = 'checkbox';
					//把input追加到外层li
					li_box.appendChild(input);

					//创建span.state
					var span_state = document.createElement('span');
					span_state.className = 'state';
					span_state.innerHTML = data[i].times;
					//把span_state追加到外层li
					li_box.appendChild(span_state);

					//创建span.state_img
					var span_state_img = document.createElement('span');
					span_state_img.className = 'state_img';
					//把span.state_img追加到外层li
					li_box.appendChild(span_state_img);

					//创建img
					var img = new Image();
					img.src = 'img/wave.gif';
					//把img追加到外层span.state_img
					span_state_img.appendChild(img);

					//创建span.name
					var span_name = document.createElement('span')
					span_name.className = 'name';
					li_box.appendChild(span_name);

					//创建span.song_name
					var span_song_name = document.createElement('span');
					span_song_name.className = 'song_name';
					span_song_name.innerHTML = data[i].name;
					//把song_name追加到name
					span_name.appendChild(span_song_name)

					//创建四个span.mod_list_menu
					var span_mod_list_menu0 = document.createElement('span')
					var span_mod_list_menu1 = document.createElement('span')
					var span_mod_list_menu2 = document.createElement('span')
					var span_mod_list_menu3 = document.createElement('span')
					//给四个i 添加样式
					span_mod_list_menu0.className = 'mod_list_menu';
					span_mod_list_menu1.className = 'mod_list_menu';
					span_mod_list_menu2.className = 'mod_list_menu';
					span_mod_list_menu3.className = 'mod_list_menu';
					//创建四个i
					var i0 = document.createElement('i');
					var i1 = document.createElement('i');
					var i2 = document.createElement('i');
					var i3 = document.createElement('i');
					//给四个i 添加样式
					i0.className = 'icon-Icon_bofang iconfont btn_play';
					i1.className = 'icon-jia iconfont';
					i2.className = 'icon-xiazai iconfont';
					i3.className = 'icon-fenxiang iconfont';
					//把四个i分别追加到四个span.mod_list_menu
					span_mod_list_menu0.appendChild(i0);
					span_mod_list_menu1.appendChild(i1);
					span_mod_list_menu2.appendChild(i2);
					span_mod_list_menu3.appendChild(i3);
					//把四个span.mod_list_menu追加到span.name
					span_name.appendChild(span_mod_list_menu0);
					span_name.appendChild(span_mod_list_menu1);
					span_name.appendChild(span_mod_list_menu2);
					span_name.appendChild(span_mod_list_menu3);

					//创建span.author
					var span_author = document.createElement('span');
					span_author.className = 'author';
					span_author.innerHTML = data[i].author;
					//把span_author追加到外层li
					li_box.appendChild(span_author)

					//创建span.time
					var span_time = document.createElement('span')
					span_time.className = 'time';
					//创建icon-shanchu
					var i_shanchu = document.createElement('i');
					//创建 .duration
					var time_span = document.createElement('span');
					time_span.className = 'duration';
					i_shanchu.className = 'icon-shanchu iconfont delete';
					//把i_shanchu追加到span.time
					span_time.appendChild(i_shanchu);
					//把.duration追加到span.time

					span_time.appendChild(time_span);
					//把歌曲时间显示出来
					time_span.innerHTML = data[i].time;

					//把span_time追加到外层li
					li_box.appendChild(span_time);
				}

				$('.delete').click(function() {

					$(this).parents('.music_item ').remove();
				});

			}
		});