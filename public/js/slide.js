const slide = document.querySelector(".lines");
let times = 0;
const body = document.querySelector("body");
const main = document.querySelector("main");

slide.addEventListener("click", () => {
  times++;
  const element = document.querySelector(".slide_bar");

  //Opening of slide bar

  if (times % 2 != 0) {
    element.style.animation = "flip 0.2s linear 0s 1";
    setTimeout(() => {
      element.style.transform = "translateX(0px)";
      body.style.overflow = "hidden";
      main.style.pointerEvents = "none";
    }, 200);
  }

  //Closing of slide bar
  else {
    element.style.animation = "flip_back 0.2s linear 0s 1";
    setTimeout(() => {
      element.style.transform = "translateX(1000px)";
      body.style.overflow = "auto";
      main.style.pointerEvents = "all";
    }, 200);
  }
});
