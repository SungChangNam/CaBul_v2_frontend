const frontEndBaseUrl = "http://127.0.0.1:5500"
const backEndBaseUrl = "http://127.0.0.1:8000"

// 게시글 상세 조회
async function getIndexFeedDetail(id){
    const response = await fetch(`${backEndBaseUrl}/articles/${id}/`,{
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    })

    response_json = await response.json()
    return response_json
}

// 댓글 작성
async function handleComment(id){
    comment = document.getElementById("comment").value;
    console.log(comment)

    const response = await fetch(`${backEndBaseUrl}/articles/${id}/comment/`,{
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'POST',
        body: JSON.stringify({
            "comment": comment,
        })
    })
    if (response.status ==200){
        window.location.reload();
}
}
//  댓글 수정
async function handleCommentUpdate(comment_id) {
    const feed_id = location.search.replace("?id=", "")
    const update_comment = document.getElementById("comment").value
    
    console.log(feed_id)
    const response = await fetch(`${backEndBaseUrl}/articles/${feed_id}/comment/${comment_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method: 'PUT',
        body: JSON.stringify({
            "comment": update_comment,
        })
    })
    const response_json = await response.json()
    if (response.status ==200){
        alert(response_json["message"])
        window.location.replace(`${frontEndBaseUrl}/articles/detail.html?id=${feed_id}`);
    }
}


// 댓글 삭제
async function handleCommentDelete(comment_id) {
    const feed_id = location.search.replace("?id=", "")

    const response = await fetch(`${backEndBaseUrl}/articles/${feed_id}/comment/${comment_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method: 'DELETE',

    })
    if (response.status ==204){
        alert("리뷰가 삭제되었습니다!")
        window.location.replace(`${frontEndBaseUrl}/articles/detail.html?id=${feed_id}`);
    }
}





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

//좋아요 정보 가져오기
async function getLike(){
    feed_id = location.search.replace("?id=","")
    const response = await fetch(`${backEndBaseUrl}/articles/${feed_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    const response_json = await response.json()
    return response_json
}

async function handleLike(){
    console.log("좋아요했습니다")

    feed_id = location.search.replace("?id=","")


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

window.onload = async function getIndexDetail_API(){
    let User_payload = JSON.parse(localStorage.getItem('payload'))
    if (User_payload === undefined ||  User_payload === null){
        location.href=`${frontend_base_url}/users/login.html`;
        
        
    } else {
        const id = location.search.replace("?id=", "")
        feed = await getIndexFeedDetail(id)
        comments = feed.comments
        created_at = timeForToday(feed.created_at)
        like_List = await getLike()

        // var wrap = document.getElementsByClassName('FeedDetailBox')[0];
        var like_wrap = document.getElementsByClassName('like_box')[0];
        var like_count = document.getElementById('like_count')
        var comment_wrap = document.getElementsByClassName('CommentDetailList')[0];
        var feed_nickname = document.getElementsByClassName('FeedDetailUserNickname')[0];
        var feed_transfer_image = document.getElementsByClassName('FeedDetailTransferImage')[0];
        var feed_title = document.getElementsByClassName('FeedDetailFeedTitle')[0];
        var feed_content = document.getElementsByClassName('FeedDetailFeedContent')[0];
        var feed_category = document.getElementsByClassName('FeedDetailFeedCategory')[0];
        var feed_created_at = document.getElementsByClassName('FeedDetailFeedCreated')[0];
        var feed_profile_image = document.getElementsByClassName('FeedDetailFeedProfileImage')[0];
        var feed_update = document.getElementsByClassName('FeedDetailFeedupdate')[0];
        feed_update.setAttribute("href",`${frontEndBaseUrl}/articles/update.html?id=${feed.pk}`)

        if(like_List.like.length == 0){
            // console.log("좋아요 한 유저가 없을때")
            like_wrap.innerHTML +=`<button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike()" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="../static/icon/heart.png" /></button>`
            }
            else{
                // console.log("좋아요 한 유저가 있을때")
                counts = 0
            // 게시물 좋아요 유무를 체크하는 조건문 부분
                like_List.like.forEach(liker => {
    
                    if(liker==User_payload.user_id){
                    // console.log(`${liker}유저가 이 게시물을 좋아요 중입니다`)
                    counts = +1
                }
                    else{
                    // console.log(`${liker}유저가 이 게시물을 좋아요 중이 아닙니다`)
                    }
                })
            // 체크한 부분을 토대로 출력해주는 부분
                if(counts==1){
                    // console.log(`${like_List.pk}번 게시물을 이 유저가 좋아요 중입니다`)
                    like_wrap.innerHTML +=`<button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike()" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="../static/icon/heart_bk.png" /></button>`
                }
                else{
                    // console.log(`${like_List.pk}번 게시물을 이 유저가 좋아요 중이 아닙니다`)
                    like_wrap.innerHTML +=`<button style="border: none; background: none; margin-top: 3px;"><img onclick="handleLike()" style="width: 20px; height: 20px; margin: 5px 10px 0 0;" src="../static/icon/heart.png" /></button>`
                }
            }
            like_count.innerText = `좋아요${like_List.like_count}개`

        // wrap.innerHTML = ``

       // wrap.innerHTML = ``
       comments.forEach(cmt => {            
        comment_wrap.innerHTML += `<div style="display: flex; flex-direction: row; justify-content: space-between ;">
                                    <div style="display: flex; flex-direction: row;">
                                        <div style="margin-left: 5px; font-weight: bold;">${cmt.user}</div>
                                        <div style="margin-left: 5px;">${cmt.comment}</div>
                                    </div>
                                    <!-- 댓글 수정, 삭제 부분 -->                                        
                                        <input type="submit" value='수정' onclick="handleCommentUpdate(${cmt.id})" style="background-color: transparent; border: none; margin-right: 10px; color: red;">
                                        <input type="submit" value='X' onclick="handleCommentDelete(${cmt.id})" style="background-color: transparent; border: none; margin-right: 10px; color: red;">                                        
                                </div>`            
    });

        feed_nickname.innerText = `${feed.user}`
        feed_transfer_image.innerHTML = `<img style="cursor: pointer; width: 1000px; min-width: 1000px; height: 600px; min-height: 600px; object-fit: contain; background-color: black;" src="${backEndBaseUrl}${feed.transfer_image}">`
        feed_title.innerText = `${feed.title}`
        feed_content.innerText = `${feed.content}`
        feed_category.innerText = `${feed.category}`
        feed_created_at.innerText = `${created_at}`
        feed_profile_image.setAttribute("src", `${backEndBaseUrl}/${feed.profile_image}` )
    }

    // 좌측 메뉴바 API 연결
    nav_user_info = await getNavUserInfo(User_payload.user_id)
    nav_user_info = nav_user_info.users
    console.log(nav_user_info)
    nav_category_box = await getNavCategoryBox()

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
    // var nav_profile_link = document.getElementsByClassName('NavUserInfoBoxProfileLink')[0];
    var nav_feed_count = document.getElementsByClassName('NavUserInfoBoxFeedCount')[0];

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

// 게시글 삭제
    async function deleteFeed() {

        feed_id =location.search.replace("?id=","")
        const response = await fetch(`${backEndBaseUrl}/articles/${feed_id}/`, {
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
            },
            method: "DELETE",
        });

        if(response.status == 204){
            alert("게시글삭제완료!")
            window.location.replace(`${frontEndBaseUrl}/`); // 삭제가 되고나면 인덱스로 다시 이동하게함
        }
        else {
            alert(response.status);
        }
    }

