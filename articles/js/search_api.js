const frontEndBaseUrl = "http://127.0.0.1:5500"
const backEndBaseUrl = "http://127.0.0.1:8000"

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


async function getNavUserInfo(user_id){
    const response = await fetch(`${backEndBaseUrl}/users/${user_id}/`,{
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    })

    response_json = await response.json()
    console.log(response_json)
    return response_json
}







async function getSearch(search){
    const response = await fetch(`${backEndBaseUrl}/articles/search/?search=${search}`,{
        headers: {
            'content-type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    })

    response_json = await response.json()
    console.log(response_json)
    return response_json
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


window.onload = async function getSearch_api(){
    let User_payload = JSON.parse(localStorage.getItem('payload'))
    if (User_payload === undefined ||  User_payload === null){
        location.href=`${frontEndBaseUrl}/users/login.html`;
        
        
    } else {
        const id = location.search.replace("?search=", "")
        searchs = await getSearch(id)
        
        // 좌측 메뉴바 API 연결
        nav_user_info = await getNavUserInfo(User_payload.user_id)
        nav_user_info = nav_user_info.users
        // console.log(nav_user_info)
        nav_category_box = await getNavCategoryBox()

        
        var nav_nickname = document.getElementsByClassName('NavUserInfoBoxNickname')[0];
        var nav_name = document.getElementsByClassName('NavUserInfoBoxName')[0];
        var nav_name2 = document.getElementsByName('NavUserInfoBoxName2')[0];
        var nav_email = document.getElementsByClassName('NavUserInfoBoxEmail')[0];
        var nav_follow = document.getElementsByClassName('NavUserInfoBoxFollow')[0];
        var nav_login = document.getElementsByClassName('NavUserInfoBoxLogin')[0];
        last_login_time = timeForToday(nav_user_info.last_login)
        var nav_profile_image = document.getElementsByClassName('NavUserInfoBoxProfileImage')[0];
        var nav_feed_count = document.getElementsByClassName('NavUserInfoBoxFeedCount')[0];
        

        
        nav_nickname.innerText = `${nav_user_info.nickname}`
        nav_name.innerText = `${nav_user_info.name}`
        nav_name2.innerText = `${nav_user_info.name}님 반갑습니다!`
        nav_email.innerText = `${nav_user_info.email}`
        nav_follow.innerText = `팔로잉 ${nav_user_info.follow_count} 명  |  팔로워 ${nav_user_info.followee_count} 명`
        nav_login.innerText = `현재 접속 시간 : ${last_login_time}`
        nav_profile_image.setAttribute("src", `${backEndBaseUrl}${nav_user_info.profile_image}`)
        nav_feed_count.innerText = `작성한 글 : ${nav_user_info.feed_set_count} 개`
        
        // nav 하단 카테고리 부분
        var nav_category = document.getElementsByClassName('NavCategory')[0];
        

        nav_category_box.forEach(category => {
            nav_category.innerHTML += `<div onclick="location.href='${frontEndBaseUrl}/articles/category.html?id=${category.category}'" class="category"><a style="color: #cacaca; text-decoration: none;">${category.category} <b style="font-weight: normal; color: #cacaca;">(${category.count})</b></a></div>`
        });
        
        var search_title = document.getElementsByClassName("SearchList")[0];
        searchs.forEach(search => {
            search_title.innerHTML += ` <div style="display: flex; flex-direction: row; width: 60vw; height: 50px; background-color: white; margin: 0 auto 0 40px; text-align: center; border-bottom: solid 1px #c8c4c4;">
                                            <div style="width: 5vw; min-width: 50px; margin: auto;">${search.id}</div>
                                            <div style="width: 5vw; min-width: 50px; margin: auto;">${search.category}</div>
                                            <div style="width: 25vw; min-width: 250px; margin: auto auto auto auto; padding-left: 30px; text-align: left;"><a href="${frontEndBaseUrl}/articles/detail.html?id=${search.id}" style="color: black; text-decoration: none;"><b>${search.title}</b></a></div>
                                            <div style="width: 10vw; min-width: 100px; margin: auto;">${search.user}</div>
                                            <div style="width: 15vw; min-width: 150px; margin: auto;">${timeForToday(search.created_at)}</div>
                                        </div>`
        });

    }
}
