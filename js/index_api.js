const frontEndBaseUrl = "http://127.0.0.1:5500"
const backEndBaseUrl = "http://127.0.0.1:8000"

// 게시글 전체 리스트 조회
async function getIndexFeedList(page_id){
    const response = await fetch(`${backEndBaseUrl}/articles/?page=${page_id}`,{
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    })

    response_json = await response.json()
    return response_json
}

// start ~ end 까지 숫자 리스트에 담아주기
function range(start, end) {
    if(start === end) return [start];
    return [start,...range(start + 1, end)];
    }

// 시간 변형 코드 (value 시간을 현재 시간이랑 비교하여 '~ 전' 출력)
function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
        return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
}

// 팔로우 버튼
async function handleFollow(user_id){


    const response = await fetch(`${backEndBaseUrl}/users/follow/${user_id}/`, {
    headers: {
        'content-type': 'application/json',
        "Authorization":"Bearer " + localStorage.getItem("access")
    },
    method: 'POST',
    body: JSON.stringify({

        })
    })

    const response_json = await response.json()
    window.location.reload();
    return response_json
}
    

// 로그인 사용자 정보 가져오기
async function getUser(){
    let User_payload = JSON.parse(localStorage.getItem('payload'))
    const response = await fetch(`${backEndBaseUrl}/users/${User_payload.user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    const response_json = await response.json()
    return response_json
}


// 좋아요 버튼
async function handleLike(feed_id){
    console.log("좋아요했습니다")
    const response = await fetch(`${backEndBaseUrl}/articles/${feed_id}/like/`, {
    headers: {
        'content-type': 'application/json',
        "Authorization":"Bearer " + localStorage.getItem("access")
    },
    method: 'POST',
    body: JSON.stringify({

        })
    })
    window.location.reload()
}


window.onload = async function getIndex_API(){
    let User_payload = JSON.parse(localStorage.getItem('payload'))
    if (User_payload === undefined ||  User_payload === null){
        location.href=`${frontEndBaseUrl}/users/login.html`;
        
        
    } else {
    

      // 좌측 메뉴바 API 연결
      nav_user_info = await getNavUserInfo(User_payload.user_id)
      nav_user_info = nav_user_info.users
      console.log(nav_user_info)
      nav_category_box = await getNavCategoryBox()

      // 현재 접속한 페이지 번호 확인
      const page_number = location.search
      if(page_number == ''){
          page_id = 1
      }
      else {
          page_id = page_number.replace("?page=", "")
      }

      // 게시글 전체 리스트 조회(페이지네이션)
      feed_list = await getIndexFeedList(page_id)
      feed_list = feed_list.articles

      console.log(feed_list)
      if ( feed_list.count == 0 ){
          console.log("게시글 없음")
      } else {








      // 패이지 네이션 관련 로그 확인
      // console.log(feed_list)
      // console.log(`page_id : ${page_id}`)
      // console.log(`count : ${feed_list.count}`)
      // console.log(`next : ${feed_list.next}`)
      // console.log(`prev : ${feed_list.previous}`)

      // 게시글 전체 리스트 총 페이지 수 확인
      page_count = Math.ceil(feed_list.count/12)
      page_number_button_list = range(1, page_count)
      // console.log(page_number_button)

      // 페이지네이션 버튼 < prev / 반복문 / next >
      var page_prev_button = document.getElementsByClassName('PagePrevButton')[0];
      var page_next_button = document.getElementsByClassName('PageNextButton')[0];
      prev_button = null
      next_button = null

      // 이전, 다음 페이지 버튼 유무 확인
      if(feed_list.previous != null){
      prev_button = feed_list.previous.replace(`${backEndBaseUrl}/articles/`, "")
      page_prev_button.setAttribute("href", `${frontEndBaseUrl}/${prev_button}`)
      page_prev_button.innerText = `< Prev`
      }
      if(feed_list.next != null){
      next_button = feed_list.next.replace(`${backEndBaseUrl}/articles/`, "")
      page_next_button.setAttribute("href", `${frontEndBaseUrl}/${next_button}`)
      page_next_button.innerText = `Next >`
      }


        // 게시글 전체 리스트 조회(페이지네이션)
        feed_list = await getIndexFeedList(page_id)
        feed_list = feed_list.articles

        // 패이지 네이션 관련 로그 확인
        // console.log(feed_list)
        // console.log(`page_id : ${page_id}`)
        // console.log(`count : ${feed_list.count}`)
        // console.log(`next : ${feed_list.next}`)
        // console.log(`prev : ${feed_list.previous}`)

        // 게시글 전체 리스트 총 페이지 수 확인
        page_count = Math.ceil(feed_list.count/12)
        page_number_button_list = range(1, page_count)
        // console.log(page_number_button)

        // 페이지네이션 버튼 < prev / 반복문 / next >
        var page_prev_button = document.getElementsByClassName('PagePrevButton')[0];
        var page_next_button = document.getElementsByClassName('PageNextButton')[0];
        prev_button = null
        next_button = null

        // 이전, 다음 페이지 버튼 유무 확인
        if(feed_list.previous != null){
        prev_button = feed_list.previous.replace(`${backEndBaseUrl}/articles/`, "")
        page_prev_button.setAttribute("href", `${frontEndBaseUrl}/${prev_button}`)
        page_prev_button.innerText = `< Prev`
        }
        if(feed_list.next != null){
        next_button = feed_list.next.replace(`${backEndBaseUrl}/articles/`, "")
        page_next_button.setAttribute("href", `${frontEndBaseUrl}/${next_button}`)
        page_next_button.innerText = `Next >`
        }


        // 페이지 카운트 반복문
        // 현재 페이지 레드 컬러 하이라이트 기능
        var page_number_button = document.getElementsByClassName('PageNumberButton')[0];
        page_number_button_list.forEach(page_number => {
            if(page_id == page_number){
            page_number_button.innerHTML += `<li style="margin:3px;"><a style="text-decoration:none; color: red;" href="?page=${page_number}">${page_number}</a></li>`
            }
            else{
                page_number_button.innerHTML += `<li style="margin:3px;"><a style="text-decoration:none; color: black;" href="?page=${page_number}">${page_number}</a></li>`
            }
        })

        // 팔로우 버튼 기능 API
        me = await getUser()
        me = me.users
        // console.log(me)



        // 게시글 반복 부분
        var wrap = document.getElementsByClassName('FeedBoxCont')[0];

        feed_list.results.forEach(feed => {
            console.log(`--------- ${feed.pk}번 게시물 정보 출력 ---------`)
            // console.log(feed)
            // console.log(`
            //     pk : ${feed.pk}
            //     user : ${feed.user}
            //     like_count : ${feed.like_count}
            //     title : ${feed.title}
            //     category : ${feed.category}
            //     content : ${feed.content}
            //     transfer_image : ${feed.transfer_image}
            //     updated_at : ${feed.updated_at}
            //     user_id : ${feed.user_id}
            // `)
            
            

            // 좋아요 부분
            // 좋아요 기능
            like_list = feed
            var like_wrap = document.getElementsByClassName('like_box')[0];
            var like_count = document.getElementById('like_count')
            // console.log(like_list)
            // 좋아요 체크하는 부분
            if(like_list.like.length == 0){
                console.log("좋아요 한 유저가 없을때")
                    like_check = 0
                }
                else{
                    console.log("좋아요 한 유저가 있을때")
                    like_check = 0
                // 게시물 좋아요 유무를 체크하는 조건문 부분
                like_list.like.forEach(liker => {

                        if(liker==User_payload.user_id){
                        console.log(`${liker}유저가 ${feed.pk}번 게시물을 좋아요 중입니다`)
                        like_check = +1
                    }
                        else{
                        console.log(`${liker}유저가 ${feed.pk}번 게시물을 좋아요 중이 아닙니다`)
                        }
                    })
                // 체크한 부분을 토대로 출력해주는 부분
                    if(like_check==1){
                        console.log(`${like_list.pk}번 게시물을 ${User_payload.user_id}번 유저가 좋아요 중입니다`)
                        // like_wrap.innerHTML +=`<button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike()" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="../static/icon/heart_bk.png" /></button>`
                    }
                    else{
                        console.log(`${like_list.pk}번 게시물을 ${User_payload.user_id}번 유저가 좋아요 중이 아닙니다`)
                        // like_wrap.innerHTML +=`<button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike()" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="../static/icon/heart.png" /></button>`
                    }
                } 
            console.log(`${like_check} 중입니다.`)
            

            // 게시글 주인 팔로우 유무 확인
            follow_check = 0
            if( me.follow.length == 0 ){
                if( feed.user_id == me.id ){
                    follow_check =+ 2
                }
            }
            else {
            me.follow.forEach(fme => {
                // console.log(`fme : ${fme}`)
                // console.log(`feed : ${feed.user_id}`)
                if ( feed.user_id == me.id ) {
                    follow_check =+ 2
                }
                else if ( feed.user_id == fme ) {
                    follow_check =+ 1
                }
            })
        }

        //팔로우 부분
        // 게시글 주인 팔로우 유무에따라 팔로우/팔로잉/공백 버튼 게시글 출력
        if(follow_check == 1){
            if (like_check == 1){
                console.log(`${feed.pk}번 피드의 ${feed.user}님을 팔로우 중 입니다.`)
                console.log(`${feed.pk}번 피드를 ${me.nickname}님이 좋아요 중 입니다.`)
                wrap.innerHTML += `<div class="FeedBox" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                <div style="width: 300px; min-width: 300px; height: 400px; min-height: 400px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; height: 40px;"><div style="display: flex; flex-direction: row;">
                        <img src="${backEndBaseUrl}/${feed.profile_image}" alt="" style="width: 20px; height: 20px; border-radius: 10px; margin: 10px 5px 0 5px;">
                        <div onclick="location.href='${frontEndBaseUrl}/users/profile.html?id=${feed.user_id}'" style="font-weight: bold; margin-top: 7px ;">
                        ${feed.user}
                    </div>
                    <a onclick="handleFollow(${feed.user_id})" style="border: solid 1px #aaaaaa; border-radius: 4px; height: 25px; margin: 5px 0 0 10px; padding-left: 5px; padding-right: 5px; font-size: 11pt; text-decoration: none; color: #fafafa;; background-color: #aaaaaa;">팔로잉</a>
                </div>
                <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border: none; background-color: #fafafa;">
                        <div style="font-weight: bold; margin: 3px 10px 0 0;">...</div>
                    </button>
                    <!-- <ul class="dropdown-menu" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                        <li><a style="text-decoration: none; color: black; margin-left: 30px;" href="{% url 'contents:post_update' feed.id %}">수정</a></li>
                        <li><a style="text-decoration: none; color: red; margin-left: 30px;" href="{% url 'contents:post_delete' feed.id %}">삭제</a></li>
                    </ul> -->
                </div>
                </div>
                    <div style="width: 300px; min-width: 300px; height: 280px; min-height: 280px;">
                        <img onclick="location.href='/articles/detail.html?id=${feed.pk}'" style="cursor: pointer; width: 300px; min-width: 300px; height: 280px; min-height: 280px; object-fit: cover;" src="${feed.transfer_image}"></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;"><div style="font-size: 12pt; font-weight: bold; margin: 5px 0 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px;">${feed.title}</div>
                    <form action='' method='post'>
                        <div style="display: flex; flex-direction: row;">
                            <div style="margin: 10px 5px 0 0; font-size: 10pt;">${feed.like_count}개
                            </div>
                            <button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike(${feed.pk})" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="/static/icon/heart_bk.png" /></button>
                        </div>
                    </form>
                </div>
                    <div style="font-size: 10pt; font-weight: normal; margin: 0 0 0 10px; color: #aaaaaa;">${feed.category}</div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; flex-direction: row; margin: 3px 0 0 8px;">
                        <span style="height: 18px; background-color: #aaaaaa; color: #fafafa; border-radius: 5px; font-size: 10pt; margin-left: 3px; padding-left: 3px; padding-right: 3px;">
                            #태그
                        </span>
                        </a>
                            <br>
                        </div>
                        <div style="text-align: right; margin-right: 10px; font-size: 10pt; color: #aaaaaa;">${timeForToday(feed.updated_at)}</div>
                    </div>
                </div>
            </div>`
        } else if (like_check == 0) {
                console.log(`${feed.pk}번 피드의 ${feed.user}님을 팔로우 중 입니다.`)
                console.log(`${feed.pk}번 피드를 ${me.nickname}님이 좋아요 중이 아닙니다.`)
                wrap.innerHTML += `<div class="FeedBox" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                <div style="width: 300px; min-width: 300px; height: 400px; min-height: 400px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; height: 40px;"><div style="display: flex; flex-direction: row;">
                        <img src="${backEndBaseUrl}/${feed.profile_image}" alt="" style="width: 20px; height: 20px; border-radius: 10px; margin: 10px 5px 0 5px;">
                        <div onclick="location.href='${frontEndBaseUrl}/users/profile.html?id=${feed.user_id}'" style="font-weight: bold; margin-top: 7px ;">
                        ${feed.user}
                    </div>
                    <a onclick="handleFollow(${feed.user_id})" style="border: solid 1px #aaaaaa; border-radius: 4px; height: 25px; margin: 5px 0 0 10px; padding-left: 5px; padding-right: 5px; font-size: 11pt; text-decoration: none; color: #fafafa;; background-color: #aaaaaa;">팔로잉</a>
                </div>
                <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border: none; background-color: #fafafa;">
                        <div style="font-weight: bold; margin: 3px 10px 0 0;">...</div>
                    </button>
                    <!-- <ul class="dropdown-menu" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                        <li><a style="text-decoration: none; color: black; margin-left: 30px;" href="{% url 'contents:post_update' feed.id %}">수정</a></li>
                        <li><a style="text-decoration: none; color: red; margin-left: 30px;" href="{% url 'contents:post_delete' feed.id %}">삭제</a></li>
                    </ul> -->
                </div>
                </div>
            
                    <div style="width: 300px; min-width: 300px; height: 280px; min-height: 280px;">
                        <img onclick="location.href='/articles/detail.html?id=${feed.pk}'" style="cursor: pointer; width: 300px; min-width: 300px; height: 280px; min-height: 280px; object-fit: cover;" src="${feed.transfer_image}"></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;"><div style="font-size: 12pt; font-weight: bold; margin: 5px 0 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px;">${feed.title}</div>
                    <form action='' method='post'>
                        <div style="display: flex; flex-direction: row;">
                            <div style="margin: 10px 5px 0 0; font-size: 10pt;">${feed.like_count}개
                            </div>
                            <button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike(${feed.pk})" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="/static/icon/heart.png" /></button>
                        </div>
                    </form>
                </div>
                    <div style="font-size: 10pt; font-weight: normal; margin: 0 0 0 10px; color: #aaaaaa;">${feed.category}</div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; flex-direction: row; margin: 3px 0 0 8px;">
                        <span style="height: 18px; background-color: #aaaaaa; color: #fafafa; border-radius: 5px; font-size: 10pt; margin-left: 3px; padding-left: 3px; padding-right: 3px;">
                            #태그
                        </span>
                        </a>
                            <br>
                        </div>
                        <div style="text-align: right; margin-right: 10px; font-size: 10pt; color: #aaaaaa;">${timeForToday(feed.updated_at)}</div>
                    </div>
                </div>
            </div>`
            }  
        }
        else if ( follow_check == 2 ){
            if( like_check == 1 ) {
                console.log(`${feed.pk}번 피드의 ${feed.user}님을 팔로우 중이 아닙니다.`)
                console.log(`${feed.pk}번 피드를 ${me.nickname}님이 좋아요 중 입니다.`)
                wrap.innerHTML += `<div class="FeedBox" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                <div style="width: 300px; min-width: 300px; height: 400px; min-height: 400px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; height: 40px;"><div style="display: flex; flex-direction: row;">
                        <img src="${backEndBaseUrl}/${feed.profile_image}" alt="" style="width: 20px; height: 20px; border-radius: 10px; margin: 10px 5px 0 5px;">
                        <div onclick="location.href='${frontEndBaseUrl}/users/profile.html?id=${feed.user_id}'" style="font-weight: bold; margin-top: 7px ;">
                        ${feed.user}
                    </div>
                    
                </div>
                <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border: none; background-color: #fafafa;">
                        <div style="font-weight: bold; margin: 3px 10px 0 0;">...</div>
                    </button>
                    <!-- <ul class="dropdown-menu" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                        <li><a style="text-decoration: none; color: black; margin-left: 30px;" href="{% url 'contents:post_update' feed.id %}">수정</a></li>
                        <li><a style="text-decoration: none; color: red; margin-left: 30px;" href="{% url 'contents:post_delete' feed.id %}">삭제</a></li>
                    </ul> -->
                </div>
                </div>
            
                    <div style="width: 300px; min-width: 300px; height: 280px; min-height: 280px;">
                        <img onclick="location.href='/articles/detail.html?id=${feed.pk}'" style="cursor: pointer; width: 300px; min-width: 300px; height: 280px; min-height: 280px; object-fit: cover;" src="${feed.transfer_image}"></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;"><div style="font-size: 12pt; font-weight: bold; margin: 5px 0 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px;">${feed.title}</div>
                    <form action='' method='post'>
                        <div style="display: flex; flex-direction: row;">
                            <div style="margin: 10px 5px 0 0; font-size: 10pt;">${feed.like_count}개
                            </div>
                            <button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike(${feed.pk})" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="/static/icon/heart_bk.png" /></button>
                        </div>
                    </form>
                </div>
                    <div style="font-size: 10pt; font-weight: normal; margin: 0 0 0 10px; color: #aaaaaa;">${feed.category}</div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; flex-direction: row; margin: 3px 0 0 8px;">
                        <span style="height: 18px; background-color: #aaaaaa; color: #fafafa; border-radius: 5px; font-size: 10pt; margin-left: 3px; padding-left: 3px; padding-right: 3px;">
                            #태그
                        </span>
                        </a>
                            <br>
                        </div>
                        <div style="text-align: right; margin-right: 10px; font-size: 10pt; color: #aaaaaa;">${timeForToday(feed.updated_at)}</div>
                    </div>
                </div>
            </div>`

            } else if ( like_check == 0 ) {
                console.log(`${feed.pk}번 피드의 ${feed.user}님을 팔로우 중이 아닙니다.`)
                console.log(`${feed.pk}번 피드를 ${me.nickname}님이 좋아요 중이 아닙니다.`)
                wrap.innerHTML += `<div class="FeedBox" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                <div style="width: 300px; min-width: 300px; height: 400px; min-height: 400px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; height: 40px;"><div style="display: flex; flex-direction: row;">
                        <img src="${backEndBaseUrl}/${feed.profile_image}" alt="" style="width: 20px; height: 20px; border-radius: 10px; margin: 10px 5px 0 5px;">
                        <div onclick="location.href='${frontEndBaseUrl}/users/profile.html?id=${feed.user_id}'" style="font-weight: bold; margin-top: 7px ;">
                        ${feed.user}
                    </div>
                    
                </div>
                <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border: none; background-color: #fafafa;">
                        <div style="font-weight: bold; margin: 3px 10px 0 0;">...</div>
                    </button>
                    <!-- <ul class="dropdown-menu" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                        <li><a style="text-decoration: none; color: black; margin-left: 30px;" href="{% url 'contents:post_update' feed.id %}">수정</a></li>
                        <li><a style="text-decoration: none; color: red; margin-left: 30px;" href="{% url 'contents:post_delete' feed.id %}">삭제</a></li>
                    </ul> -->
                </div>
                </div>
            
                    <div style="width: 300px; min-width: 300px; height: 280px; min-height: 280px;">
                        <img onclick="location.href='/articles/detail.html?id=${feed.pk}'" style="cursor: pointer; width: 300px; min-width: 300px; height: 280px; min-height: 280px; object-fit: cover;" src="${feed.transfer_image}"></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;"><div style="font-size: 12pt; font-weight: bold; margin: 5px 0 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px;">${feed.title}</div>
                    <form action='' method='post'>
                        <div style="display: flex; flex-direction: row;">
                            <div style="margin: 10px 5px 0 0; font-size: 10pt;">${feed.like_count}개
                            </div>
                            <button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike(${feed.pk})" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="/static/icon/heart.png" /></button>
                        </div>
                    </form>
                </div>
                    <div style="font-size: 10pt; font-weight: normal; margin: 0 0 0 10px; color: #aaaaaa;">${feed.category}</div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; flex-direction: row; margin: 3px 0 0 8px;">
                        <span style="height: 18px; background-color: #aaaaaa; color: #fafafa; border-radius: 5px; font-size: 10pt; margin-left: 3px; padding-left: 3px; padding-right: 3px;">
                            #태그
                        </span>
                        </a>
                            <br>
                        </div>
                        <div style="text-align: right; margin-right: 10px; font-size: 10pt; color: #aaaaaa;">${timeForToday(feed.updated_at)}</div>
                    </div>
                </div>
            </div>`
            }
        }
        else if ( follow_check == 0 ) {
            if( like_check == 1 ) {
                console.log(`${feed.pk}번 피드는 본 계정 소유 입니다.`)
                console.log(`${feed.pk}번 피드를 ${me.nickname}님이 좋아요 중 입니다.`)
                wrap.innerHTML += `<div class="FeedBox" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                <div style="width: 300px; min-width: 300px; height: 400px; min-height: 400px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; height: 40px;"><div style="display: flex; flex-direction: row;">
                        <img src="${backEndBaseUrl}/${feed.profile_image}" alt="" style="width: 20px; height: 20px; border-radius: 10px; margin: 10px 5px 0 5px;">
                        <div onclick="location.href='${frontEndBaseUrl}/users/profile.html?id=${feed.user_id}'" style="font-weight: bold; margin-top: 7px ;">
                        ${feed.user}
                    </div>
                    <a onclick="handleFollow(${feed.user_id})" style="border: solid 1px #aaaaaa; border-radius: 4px; height: 25px; margin: 5px 0 0 10px; padding-left: 5px; padding-right: 5px; font-size: 11pt; text-decoration: none; color: #aaaaaa;; background-color: #fafafa;">팔로우</a>
                </div>
                <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border: none; background-color: #fafafa;">
                        <div style="font-weight: bold; margin: 3px 10px 0 0;">...</div>
                    </button>
                    <!-- <ul class="dropdown-menu" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                        <li><a style="text-decoration: none; color: black; margin-left: 30px;" href="{% url 'contents:post_update' feed.id %}">수정</a></li>
                        <li><a style="text-decoration: none; color: red; margin-left: 30px;" href="{% url 'contents:post_delete' feed.id %}">삭제</a></li>
                    </ul> -->
                </div>
                </div>
            
                    <div style="width: 300px; min-width: 300px; height: 280px; min-height: 280px;">
                        <img onclick="location.href='/articles/detail.html?id=${feed.pk}'" style="cursor: pointer; width: 300px; min-width: 300px; height: 280px; min-height: 280px; object-fit: cover;" src="${feed.transfer_image}"></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;"><div style="font-size: 12pt; font-weight: bold; margin: 5px 0 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px;">${feed.title}</div>
                    <form action='' method='post'>
                        <div style="display: flex; flex-direction: row;">
                            <div style="margin: 10px 5px 0 0; font-size: 10pt;">${feed.like_count}개
                            </div>
                            <button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike(${feed.pk})" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="/static/icon/heart_bk.png" /></button>
                        </div>
                    </form>
                </div>
                    <div style="font-size: 10pt; font-weight: normal; margin: 0 0 0 10px; color: #aaaaaa;">${feed.category}</div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; flex-direction: row; margin: 3px 0 0 8px;">
                        <span style="height: 18px; background-color: #aaaaaa; color: #fafafa; border-radius: 5px; font-size: 10pt; margin-left: 3px; padding-left: 3px; padding-right: 3px;">
                            #태그
                        </span>
                        </a>
                            <br>
                        </div>
                        <div style="text-align: right; margin-right: 10px; font-size: 10pt; color: #aaaaaa;">${timeForToday(feed.updated_at)}</div>
                    </div>
                </div>
            </div>`
            } else if ( like_check == 0 ) {
                console.log(`${feed.pk}번 피드는 본 계정 소유 입니다.`)
                console.log(`${feed.pk}번 피드를 ${me.nickname}님이 좋아요 중이 아닙니다.`)
                wrap.innerHTML += `<div class="FeedBox" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                <div style="width: 300px; min-width: 300px; height: 400px; min-height: 400px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between; height: 40px;"><div style="display: flex; flex-direction: row;">
                        <img src="${backEndBaseUrl}/${feed.profile_image}" alt="" style="width: 20px; height: 20px; border-radius: 10px; margin: 10px 5px 0 5px;">
                        <div onclick="location.href='${frontEndBaseUrl}/users/profile.html?id=${feed.user_id}'" style="font-weight: bold; margin-top: 7px ;">
                        ${feed.user}
                    </div>
                    <a onclick="handleFollow(${feed.user_id})" style="border: solid 1px #aaaaaa; border-radius: 4px; height: 25px; margin: 5px 0 0 10px; padding-left: 5px; padding-right: 5px; font-size: 11pt; text-decoration: none; color: #aaaaaa;; background-color: #fafafa;">팔로우</a>
                </div>
                <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border: none; background-color: #fafafa;">
                        <div style="font-weight: bold; margin: 3px 10px 0 0;">...</div>
                    </button>
                    <!-- <ul class="dropdown-menu" style="background-color: #fafafa; border: solid 1px #aaaaaa; box-shadow: 1px 1px 1px 1px #aaaaaa;">
                        <li><a style="text-decoration: none; color: black; margin-left: 30px;" href="{% url 'contents:post_update' feed.id %}">수정</a></li>
                        <li><a style="text-decoration: none; color: red; margin-left: 30px;" href="{% url 'contents:post_delete' feed.id %}">삭제</a></li>
                    </ul> -->
                </div>
                </div>
            
                    <div style="width: 300px; min-width: 300px; height: 280px; min-height: 280px;">
                        <img onclick="location.href='/articles/detail.html?id=${feed.pk}'" style="cursor: pointer; width: 300px; min-width: 300px; height: 280px; min-height: 280px; object-fit: cover;" src="${feed.transfer_image}"></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;"><div style="font-size: 12pt; font-weight: bold; margin: 5px 0 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px;">${feed.title}</div>
                    <form action='' method='post'>
                        <div style="display: flex; flex-direction: row;">
                            <div style="margin: 10px 5px 0 0; font-size: 10pt;">${feed.like_count}개
                            </div>
                            <button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike(${feed.pk})" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="/static/icon/heart.png" /></button>
                        </div>
                    </form>
                </div>
                    <div style="font-size: 10pt; font-weight: normal; margin: 0 0 0 10px; color: #aaaaaa;">${feed.category}</div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; flex-direction: row; margin: 3px 0 0 8px;">
                        <span style="height: 18px; background-color: #aaaaaa; color: #fafafa; border-radius: 5px; font-size: 10pt; margin-left: 3px; padding-left: 3px; padding-right: 3px;">
                            #태그
                        </span>
                        </a>
                            <br>
                        </div>
                        <div style="text-align: right; margin-right: 10px; font-size: 10pt; color: #aaaaaa;">${timeForToday(feed.updated_at)}</div>
                    </div>
                </div>
            </div>`
            }
        }

        
            
        });
    

    }
    



        // nav 부분
        // nav 상단 유저 박스 부분
        var nav_nickname = document.getElementsByClassName('NavUserInfoBoxNickname')[0];
        var nav_name = document.getElementsByClassName('NavUserInfoBoxName')[0];
        var nav_name2 = document.getElementsByName('NavUserInfoBoxName2')[0];
        var nav_email = document.getElementsByClassName('NavUserInfoBoxEmail')[0];
        var nav_follow = document.getElementsByClassName('NavUserInfoBoxFollow')[0];
        var nav_login = document.getElementsByClassName('NavUserInfoBoxLogin')[0];
        last_login_time = timeForToday(nav_user_info.last_login)
        var nav_profile_image = document.getElementsByClassName('NavUserInfoBoxProfileImage')[0];
        var nav_feed_count = document.getElementsByClassName('NavUserInfoBoxFeedCount')[0];
        // var nav_profile_link = document.getElementsByClassName('NavUserInfoBoxProfileLink')[0];

        nav_nickname.innerText = `${nav_user_info.nickname}`
        nav_name.innerText = `${nav_user_info.name}`
        nav_name2.innerText = `${nav_user_info.name}님 반갑습니다!`
        nav_email.innerText = `${nav_user_info.email}`
        nav_follow.innerText = `팔로잉 ${nav_user_info.follow_count} 명  |  팔로워 ${nav_user_info.followee_count} 명`
        nav_login.innerText = `현재 접속 시간 : ${last_login_time}`
        // nav_profile_link.setAttribute("onclick", `${frontEndBaseUrl}/users/profile.html?id=${nav_user_info.id}`)
        nav_profile_image.setAttribute("src", `${backEndBaseUrl}${nav_user_info.profile_image}`)
        nav_feed_count.innerText = `작성한 글 : ${nav_user_info.feed_set_count} 개`
        
        // nav 하단 카테고리 부분
        var nav_category = document.getElementsByClassName('NavCategory')[0];
        


        nav_category_box.forEach(category => {
            nav_category.innerHTML += `<div onclick="location.href='${frontEndBaseUrl}/articles/category.html?id=${category.category}'" class="category"><a style="color: #cacaca; text-decoration: none;">${category.category} <b style="font-weight: normal; color: #cacaca;">(${category.count})</b></a></div>`
        });
    }
}