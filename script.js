const sectionCommentsField = document.querySelector(".creat-comment");
const sectionPosts = document.querySelector(".posts-btns-pass");
const userContainer = document.querySelector(".container-user");
const BtnAddPost = document.querySelector(".btn-add-post");
const btnBarsNav = document.querySelector(".btn-bars");
const loginBtn = document.querySelector(".btn-loggin");
const btnLogin = document.querySelector(".btn-login");
const btnClose = document.querySelector(".btn-close");
const register = document.querySelector(".register");
const baseUrl = "https://tarmeezacademy.com/api/v1";
const loading = document.querySelector(".loading");
const Alert = document.querySelector(".alert");
const posts = document.querySelector(".posts");
let isClickedInPost = false;
let isInHome = true;
let currentPage = 1;
let isCompleted;
const removeSmothly = (obj1, obj2) => {
  obj1.classList.add("show-smothly");
  setTimeout(() => {
    obj1.classList.add("disabled");
    if (obj2.classList.contains("show-smothly"))
      obj2.classList.remove("show-smothly");
    obj2.classList.remove("disabled");
  }, 700);
};
/*  ---------------- Section Get Posts ---------------- */
async function getPosts() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  posts.innerHTML = "";
  document.querySelector(".btns-pass").classList.add("show-smothly");
  try {
    const response = await fetch(
      `${baseUrl}/posts?limit=5&page=${currentPage}`
    );
    if (!response.ok) throw new Error(`i have a problem in request`);
    const json = await response.json();
    setTimeout(() => {
      removeSmothly(loading, posts);
    }, 1000);
    json.data.forEach((elm) => {
      posts.innerHTML += `
            <div class="post" >
                  <div class="container">
                      <div class="user-info">
                        <img src="${
                          elm.author.profile_image
                        }" class="user-img" alt="img" onclick = "profileUser(${elm.id})"/>
                        <div class="user-name">@${elm.author.username}</div>
                      </div>
                      ${
                        currentUser != null && currentUser.id == elm.author.id
                          ? ` <div class="container-edit-delate">
                          <div class="edit-btn center" style="--clr:#4070f4;" onclick="EditBtnClikced('${encodeURIComponent(
                            JSON.stringify(elm)
                          )}')">Edit</div>
                                <div class="delate-post center" style="--clr:tomato;" onclick="delatePost('${
                                  elm.id
                                }')">Delate</div>
                              </div>`
                          : ""
                      }
                  </div>
                  <img src="${elm.image}" class="post-img" alt="" />
                  <div class="time-post">${elm.created_at}</div>
                  <div class="title">${elm.title}</div>
                  <div class="body">${elm.body}</div>
                  <hr />
                  <div class="comments">
                    <div class="icon-comments" onclick = "postClikced(${
                      elm.id
                    })"><i class="fa-solid fa-comment"></i></div>
                    <div class="num-of-comments">(${
                      elm.comments_count
                    })comments</div>
                    <div class = "tags">${elm.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")} </div>
                  </div>
                </div>`;
    });
    setTimeout(() => {
      document.querySelector(".btns-pass").classList.remove("show-smothly");
    }, 1500);
    return json;
  } catch (err) {
    return "i have a problem in request";
  }
}
getPosts();
for (let i = 0; i < 3; i++)
  setTimeout(() => {
    loading.innerHTML += ".";
  }, 500 * i);
/*  ---------------- When I Clicked In Any Post ---------------- */
async function postClikced(Id) {
  const token = localStorage.getItem("token");
  const sectionUiquePost = document.querySelector(".unique-post-with-comment");
  const sectionBody = document.querySelector(".posts-btns-pass");
  const resp = await fetch(`${baseUrl}/posts/${Id}`);
  const json = await resp.json();
  const data = json.data;
  localStorage.setItem("id", Id);
  sectionUiquePost.innerHTML = `
                  <div class="post">
                    <div class="btn-close" onclick="btnCloseComment()">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                  <div class="user-info">
                  <img src="${
                    data.author.profile_image
                  }" class="user-img" alt="img" />
                    <div class="user-name">@${data.author.username}</div>
                    </div>
                    <img src="${data.image}" class="post-img" alt="" />
                    <div class="time-post">${data.created_at}</div>
                  <div class="title">${data.title}</div>
                  <div class="body">${data.body}</div>
                  <hr />
                  <div class="comments">
                    <div class="icon-comments"><i class="fa-solid fa-comment"></i></div>
                    <div class="num-of-comments">(${
                      data.comments_count
                    })comments</div>
                    <div class = "tags">${data.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")} </div>
                  </div>
                </div>
                
              <div class = "comments-post">
              ${data.comments
                .map((elm) => {
                  return `<div class="comment-post">  
                   <div class="user-info">
                       <img class="user-img" src="${elm.author.profile_image}" alt="" />
                        <div class="user-name">@${elm.author.username}</div>
                   </div>
                    <div class="comments-text">${elm.body}</div>
                </div>`;
                })
                .join("")}
              <div class="creat-comment ${token ? "clicked" : ""}">
              <input class="write-comment" type="text" placeholder="Creat a comment">
              <button class="send-comment" onclick = "addComment(${Id})">Send</button>
              </div>
              </div>
              `;
  isClickedInPost = true;
  removeSmothly(sectionBody, sectionUiquePost);
}
/*  ---------------- Loop wiating Request ---------------- */
async function loop(btn) {
  let i = 1;
  isCompleted = true;
  while (isCompleted) {
    btn.innerHTML += ".";
    i++;
    if (i > 4) {
      i = 1;
      btn.innerHTML = btn.innerHTML.slice(0, -4);
      console.log(i);
      console.log(isCompleted);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
/*  ---------------- Nav Bar Vertical ---------------- */
btnBarsNav.addEventListener("click", function () {
  document.querySelector(".nav-bar-vertical").classList.toggle("clicked");
});
/*  ---------------- Alert ---------------- */
const alertCloseBtn = document.querySelector(".icon-remove");
let timeAlert;
const showAlert = (string, color) => {
  Alert.classList.add("clicked");
  timeAlert = setTimeout(() => {
    Alert.classList.remove("clicked");
  }, 3000);
  Alert.style.setProperty("--clr", color);
  document.querySelector(".alert .text").textContent = string;
};
alertCloseBtn.addEventListener("click", () => {
  clearInterval(timeAlert);
  Alert.classList.remove("clicked");
});
/*  ---------------- Login ---------------- */
const allInputLogin = document.querySelectorAll(".container-login > input");
const sectionNavbar = document.querySelector("section.nav-bar");
const logout = document.querySelector(".btn-logout");
const login = document.querySelector(".login");
let isLogin = false;
/*  ------------ Login request ------------- */
async function loginAccount(username, password) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  };
  try {
    const resp = await fetch(`${baseUrl}/login`, options);
    if (!resp.ok) throw new Error(`Error: ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    return { data: data, isCorrect: true };
  } catch (err) {
    console.error(err);
    return {
      data: "The provided credentials are incorrect.",
      isCorrect: false,
    };
  }
}
/*  ------------ function show and hide smothly ------------- */
const hideSmothly = (obj) => {
  obj.classList.remove("clicked");
  setTimeout(() => {
    obj.classList.add("disabled");
  }, 800);
};
const showSmothlyUser = () => {
  userContainer.classList.remove("disabled");
  setTimeout(() => {
    userContainer.classList.add("clicked");
  }, 800);
  const user = JSON.parse(localStorage.getItem("user"));
  document.querySelectorAll(".container-user").forEach((userContent) => {
    userContent.innerHTML = `
            <img class="icon-user" src="${user.profile_image}" alt="">
            <div class="username-user">@${user.username}</div>
    `;
  });
};
/*  ------------ hide smothly ------------- */
const addClass = (obj, arrInput) => {
  arrInput.forEach((elm) => {
    elm.value = "";
    elm.classList.remove("not-valid");
  });
  obj.classList.remove("clicked");
  setTimeout(() => {
    obj.classList.add("disabled");
  }, 500);
  sectionNavbar.classList.remove("clicked");
};
/*  ------------ Events ------------- */
loginBtn.addEventListener("click", () => {
  login.classList.remove("disabled");
  setTimeout(() => {
    login.classList.add("clicked");
  }, 200);
  sectionNavbar.classList.add("clicked");
});
btnClose.addEventListener("click", () => {
  if (isCompleted) return;
  addClass(login, allInputLogin);
});
btnLogin.addEventListener("click", () => {
  const username = document.querySelector(".username-input").value;
  const password = document.querySelector(".password-input").value;
  allInputLogin.forEach((elm) => {
    if (elm.value == "") elm.classList.add("not-valid");
    elm.addEventListener("blur", () => {
      if (elm.value != "") elm.classList.remove("not-valid");
    });
  });
  loop(btnLogin);
  loginAccount(username, password).then((data) => {
    btnLogin.innerHTML = "login";
    isCompleted = false;
    if (data.isCorrect) {
      addClass(login, allInputLogin);
      removeSmothly(loginBtn.parentElement, logout);
      removeSmothly(login, Alert);
      showAlert("YOU logged successfully", "#8fd14f");
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", data.data.token);
      BtnAddPost.classList.add("clicked");
      showSmothlyUser();
      getPosts();
    } else {
      console.log(data.data);
      Alert.classList.remove("disabled");
      showAlert("this User are not found", "tomato");
    }
  });
});
/*  ---------------- Register ---------------- */
const allinputRegister = document.querySelectorAll(
  ".container-register > input"
);
const registerCloseBtn = document.querySelector(".btn-close-register");
const registerCardBtn = document.querySelector(".btn-registered");
const registerBtnNav = document.querySelector(".btn-register");
const registerCard = document.querySelector(".register");
let isClickedRegister = false;
/*  ------------ Register request ------------- */
async function registerAccount(username, name, password, img) {
  const Body = new FormData();
  Body.append("name", name);
  Body.append("username", username);
  Body.append("password", password);
  Body.append("image", img);
  const options = {
    method: "POST",
    body: Body,
  };
  try {
    const resp = await fetch(`${baseUrl}/register`, options);
    if (!resp.ok) throw new Error(`Error ${resp.status}: ${errorData.message}`);
    const data = await resp.json();
    console.log(data);
    return { data: data, isRegistred: true };
  } catch (err) {
    console.error(err);
    return {
      data: "The username has already been taken.",
      isRegistred: false,
    };
  }
}
registerCardBtn.addEventListener("click", () => {
  if (isClickedRegister) return;
  const username = document.querySelector(".username-register").value;
  const password = document.querySelector(".password-register").value;
  const email = document.querySelector(".email-register").value;
  const img = document.querySelector(".image-register").files[0];
  allinputRegister.forEach((elm) => {
    if (elm.value == "") elm.classList.add("not-valid");
    elm.addEventListener("blur", () => {
      if (elm.value != "") elm.classList.remove("not-valid");
    });
  });
  loop(registerCardBtn);
  isClickedRegister = true;
  registerAccount(username, email, password, img).then((data) => {
    isClickedRegister = false;
    isCompleted = false;
    console.log(data);
    registerCardBtn.innerHTML = "register";
    if (data.isRegistred) {
      addClass(registerCard, allinputRegister);
      removeSmothly(loginBtn.parentElement, logout);
      removeSmothly(registerCard, Alert);
      showAlert("New User Registered successfully", "#8fd14f");
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", data.data.token);
      BtnAddPost.classList.add("clicked");
      showSmothlyUser();
      getPosts();
    } else {
      Alert.classList.remove("disabled");
      showAlert(data.data, "tomato");
      console.log(data.data);
    }
  });
});
registerBtnNav.addEventListener("click", () => {
  registerCard.classList.remove("disabled");
  setTimeout(() => {
    registerCard.classList.add("clicked");
  }, 200);
  sectionNavbar.classList.add("clicked");
});
registerCloseBtn.addEventListener("click", () => {
  if (isClickedRegister) return;
  addClass(registerCard, allinputRegister);
});
/*  ---------------- refrech The page ----------------  */
const refrech = () => {
  const token = localStorage.getItem("token");
  if (token != null) {
    removeSmothly(loginBtn.parentElement, logout);
    BtnAddPost.classList.add("clicked");
    showSmothlyUser();
  } else {
    removeSmothly(logout, loginBtn.parentElement);
    BtnAddPost.classList.remove("clicked");
    hideSmothly(userContainer);
  }
};
refrech();
/*  ---------------- add a post ----------------  */
const addPostCard = document.querySelector(".add-post");
const closePostCard = document.querySelector(".btn-close-post");
const postedCardBtn = document.querySelector(".btn-post");
const textarea = document.querySelector(".container-post textarea");
const AllInputPost = document.querySelectorAll(".container-post input");
let isWaited = false;
/*  ---------------- Request add a post using methode 'POST' ----------------  */
async function CreatPost(title, text, urlImage) {
  let Body = new FormData();
  Body.append("body", text);
  Body.append("title", title);
  Body.append("image", urlImage);
  const options = {
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      // "Content-Type":"multipart/form-data"
    },
    body: Body,
  };
  try {
    const resp = await fetch(`${baseUrl}/posts`, options);
    if (!resp.ok) {
      throw new Error(`Error ${resp.status}: ${errorData.message}`);
    }
    const json = await resp.json();
    return { data: json, isPosted: true };
  } catch (err) {
    console.error("Fetch Error : ", err);
    return { data: err, isPosted: false };
  }
}
postedCardBtn.addEventListener("click", () => {
  if (isWaited) return;
  console.log("is clicked creat post");
  isWaited = true;
  const title = document.querySelector(".title-post").value;
  const body = document.querySelector(".body-post").value;
  const image = document.querySelector(".post-image").files[0];
  loop(postedCardBtn);
  CreatPost(title, body, image).then((resp) => {
    isWaited = false;
    isCompleted = false;
    if (resp.isPosted) {
      postedCardBtn.innerHTML = "post";
      showAlert("New Post Has Been Created", "#8fd14f");
      addClass(addPostCard, [...AllInputPost, textarea]);
      getPosts();
    }
  });
});
const showSmothly = (obj) => {
  obj.classList.remove("disabled");
  setTimeout(() => {
    obj.classList.add("clicked");
  }, 200);
  sectionNavbar.classList.add("clicked");
};
BtnAddPost.addEventListener("click", () => {
  showSmothly(addPostCard);
});
closePostCard.addEventListener("click", () => {
  if (isCompleted) return;
  postedCardBtn.innerHTML = "post";
  addClass(addPostCard, [...AllInputPost, textarea]);
});
/*  ---------------- Pass To The Next Page ----------------  */
const next = document.querySelector(".btn-next");
const prv = document.querySelector(".btn-prv");
const sectionParentPosts = document.querySelector(".posts-btns-pass");
getPosts().then(() => {
  setTimeout(() => {
    next.parentElement.classList.remove("disabled");
  }, 2200);
});
next.addEventListener("click", () => {
  currentPage++;
  removeSmothly(sectionParentPosts, loading);
  prv.classList.remove("end-page");
  loading.innerHTML = "loeding";
  loop(loading);
  setTimeout(() => {
    getPosts().then(() => {
      removeSmothly(loading, sectionParentPosts);
      isCompleted = false;
    });
  }, 2000);
});
prv.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  if (currentPage == 1) prv.classList.add("end-page");
  removeSmothly(sectionParentPosts, loading);
  loading.innerHTML = "loeding";
  loop(loading);
  setTimeout(() => {
    getPosts().then(() => {
      removeSmothly(loading, sectionParentPosts);
      isCompleted = false;
    });
  }, 2000);
});
/*  ---------------- Creat A Comment----------------  */
async function addComment(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    showAlert("You are not Login", "tomato");
    console.log("send");
    return;
  }
  const writeCommentInput = document.querySelector(".write-comment").value;
  if (writeCommentInput == "") {
    showAlert("The comment Are required", "tomato");
    return;
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body: writeCommentInput }),
  };
  try {
    const resp = await fetch(`${baseUrl}/posts/${id}/comments`, options);
    if (!resp.ok) {
      throw new Error(`${resp.ok} : ${resp.message}`);
    }
    const json = await resp.json();
    console.log(json);
    showAlert("Comment Are Created Successefully", "#8fd14f");
    postClikced(id);
  } catch (err) {
    console.error(err);
  }
}
function btnCloseComment() {
  const commentCard = document.querySelector(".unique-post-with-comment");
  const sectionBody = document.querySelector(".posts-btns-pass");
  removeSmothly(commentCard, sectionBody);
}
/*  ---------------- Edit A Post ----------------  */
let idPostEdit;
function EditBtnClikced(obj) {
  const EditCard = document.querySelector(".edit-post");
  const ObjPost = JSON.parse(decodeURIComponent(obj));
  document.querySelector(".edit-title-post").value = ObjPost.title;
  document.querySelector(".edit-body-post").value = ObjPost.body;
  document.querySelector(".edit-post-image").src = ObjPost.author.profile_image;
  idPostEdit = ObjPost.id;
  showSmothly(EditCard);
}
function closeEditPost() {
  const EditCard = document.querySelector(".edit-post");
  const inputsEdit = document.querySelectorAll(".edit-inp-write");
  addClass(EditCard, inputsEdit);
}
async function editPost() {
  const formData = new FormData();
  const title = document.querySelector(".edit-title-post").value;
  const EditCard = document.querySelector(".edit-post");
  const text = document.querySelector(".edit-body-post").value;
  const urlImage = document.querySelector(".edit-post-image").files[0];
  formData.append("title", title);
  formData.append("body", text);
  formData.append("image", urlImage);
  // formData.append('_method','put')
  const options = {
    method: "PUT",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  };
  try {
    const resp = await fetch(`${baseUrl}/posts/${idPostEdit}`, options);
    if (!resp.ok) {
      throw new Error(`failed request ${resp.ok} hhh`);
    }
    const json = await resp.json();
    getPosts();
    addClass(EditCard, []);
    showAlert("The Post Are Updated Successefully", "#8fd14f");
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}
/*  ---------------- Edit A Post ----------------  */
const sureCard = document.querySelector(".container-post-delated");
let idPostDelate;
function delatePost(id) {
  showSmothly(sureCard);
  idPostDelate = id;
}
function btnNO() {
  addClass(document.querySelector(".container-post-delated"), []);
}
async function btnOk() {
  const options = {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    const resp = await fetch(`${baseUrl}/posts/${idPostDelate}`, options);
    if (!resp.ok) {
      throw new Error(`fetch failed ${resp.ok} ${resp.message} hhh`);
    }
    const json = await resp.json();
    getPosts();
    addClass(sureCard, []);
    showAlert("The Post Has Been Deleted Successefully", "#8fd14f");
  } catch (err) {
    console.error(err);
  }
}
/*  ---------------- Custumize the Profile Section ----------------  */
const sectionProfile = document.querySelector("section.profile");
const homeBtn = document.querySelector(".item.home");
const user = JSON.parse(localStorage.getItem("user"));
async function profileSectionBtn(id = user.id) {
  console.log(id)
  if (!user) {
    showAlert("please login to make a profile", "tomato");
    return;
  }
  isInHome = false;
  const resp = await fetch(`${baseUrl}/users/${id}`);
  const json = await resp.json();
  const data = json.data;
  console.log(data)
  sectionProfile.innerHTML = `
  <div class="profile-user">
        <div class="container-user-profile">
            <div class="user">
              <img src="${data.profile_image}" alt="">
              <div class="username-user">${data.username}</div>
            </div>
            <div class="number-of">
                <div class="posts-number">
                  <span>${data.posts_count}</span>
                  <div class="text-profile">Posts</div>
                </div>
                <div class="comments-number">
                  <span>${data.comments_count}</span>
                  <div class="text-profile">Comments</div>
                </div>
            </div>
        </div>
  </div>
  <div class="posts-profile">
  </div>
  `;
  const postsProfile = document.querySelector(".posts-profile");
  try {
    const response = await fetch(`${baseUrl}/users/${id}/posts`);
    if (!response.ok) throw new Error(`i have a problem in request`);
    const json = await response.json();
    json.data.forEach((post) => {
      postsProfile.innerHTML += `
      <div class="post" >
                  <div class="container">
                      <div class="user-info">
                        <img src="${
                          post.author.profile_image
                        }" class="user-img" alt="img" />
                        <div class="user-name">@${post.author.username}</div>
                      </div>
                      <div class="container-edit-delate">
                          <div class="edit-btn center" style="--clr:#4070f4;" onclick="EditBtnClikced('${encodeURIComponent(
                            JSON.stringify(post)
                          )}')">Edit</div>
                                <div class="delate-post center" style="--clr:tomato;" onclick="delatePost('${
                                  post.id
                                }')">Delate</div>
                      </div>
                  </div>
                  <img src="${post.image}" class="post-img" alt="" />
                  <div class="time-post">${post.created_at}</div>
                  <div class="title">${post.title}</div>
                  <div class="body">${post.body}</div>
                  <hr />
                  <div class="comments">
                    <div class="icon-comments" onclick = "postClikced(${
                      post.id
                    })"><i class="fa-solid fa-comment"></i></div>
                    <div class="num-of-comments">(${
                      post.comments_count
                    })comments</div>
                    <div class = "tags">${post.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")} </div>
                  </div>
        </div>
      `;
    });

    setTimeout(() => {
      removeSmothly(sectionPosts, sectionProfile);
    }, 200);
  } catch (err) {
    console.error(err);
  }
}
homeBtn.addEventListener("click", () => {
  removeSmothly(sectionProfile, sectionPosts);
  getPosts();
  isInHome = true;
});
async function profileUser(id) {
  // profileSectionBtn(id);
  try{
    const resp = await fetch(`${baseUrl}/users/${id}`);
    if (!resp.ok) throw new Error(`i have a problem in request ${id}`);
    const data = await resp.json();
    console.log(data)
  }catch(err){
    console.log(err);
  }
}
/*  ----------- Logout -----------  */
logout.addEventListener("click", () => {
  localStorage.clear();
  removeSmothly(logout, loginBtn.parentElement);
  Alert.classList.remove(".disabled");
  BtnAddPost.classList.remove("clicked");
  hideSmothly(userContainer);
  showAlert("Logged Out Successfully", "#8fd14f");
  getPosts();
  if (!isInHome) removeSmothly(sectionProfile, sectionPosts);
});