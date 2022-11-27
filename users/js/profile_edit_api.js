const frontEndBaseUrl = "http://127.0.0.1:5500"
const backEndBaseUrl = "http://127.0.0.1:8000"


async function getProfileFeedList(user_id){
    const response = await fetch(`${backEndBaseUrl}/users/${user_id}/`,{
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    })

    response_json = await response.json()
    return response_json
}

function range(start, end) {
    if(start === end) return [start];
    return [start,...range(start + 1, end)];
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

async function updateNickname(){
    
    let User_payload = JSON.parse(localStorage.getItem('payload'))
    
    const user_name = document.getElementById("username").value
    const nickname = document.getElementById("nickname").value
    const response = await fetch(`${backEndBaseUrl}/users/${User_payload.user_id}/`, {
        headers: {
        'content-type': 'application/json',
        "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method: 'PUT',
        body: JSON.stringify({
            "name":user_name,
            "nickname":nickname,
        
    
        })

    })
    const response_json = await response.json()
    if (response.status == 200){
        alert(response_json["message"])
            window.location.replace(`${frontEndBaseUrl}/`);
    }else {
        alert(response_json["detail"])
        
    }
    

        
        return response_json
        }
        

        window.onload = async function getProfile_API(){
            console.log("프로필 페이지 접속")
            let User_payload = JSON.parse(localStorage.getItem('payload'))
            
            if(location.search != ""){
                user_id = location.search.replace("?id=", "")
            }
            else{
                user_id = User_payload.user_id
            }
            console.log(user_id)
            
            // 좌측 메뉴바 API 연결
            nav_user_info = await getNavUserInfo(user_id)
            nav_category_box = await getNavCategoryBox()
        
            // 게시글 정보 조회 API
            feed_list = await getProfileFeedList(user_id)
            console.log(feed_list.feed_set)
        
        
            // nav 부분
            // nav 상단 유저 박스 부분
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