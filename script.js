/* =========================================================
   交互：点击项目卡片 → 展开 / 收起 项目详细描述
   说明：本脚本不修改原 HTML 结构与 CSS 样式，
   仅在运行时用 JS 动态插入“详细描述”元素，并切换它的显示状态。
   ========================================================= */

/* ---------- 1. 可编辑数据：每个项目的详细描述 ----------
   顺序与 index.html 中“三个项目”卡片一一对应（索引 0、1、2）。
   直接改下面的文字即可，不需要动 HTML。 */
const projectDetails = [
  "详细描述：博客系统计划先用纯静态页面实现，后续再接入标签页与分类检索，作为日常学习笔记的沉淀地。",
  "详细描述：校园活动小程序希望解决社团活动信息分散的问题，提供统一的活动查询与在线报名入口。",
  "详细描述：数据可视化看板用于把课程作业中的数据集通过图表呈现，重点练习前端图表与交互能力。"
];

/* ---------- 2. 页面加载完成后执行（此时 DOM 已就绪）---------- */
document.addEventListener("DOMContentLoaded", function () {

  // 选中“三个项目”板块里的所有卡片（仅 .cards 下的 .card）
  const cards = document.querySelectorAll(".cards .card");

  // 遍历每张卡片，依次创建元素并绑定点击交互
  cards.forEach(function (card, index) {

    /* 2.1 创建“详细描述”元素，并设置初始为隐藏 */
    const detail = document.createElement("p");
    detail.textContent = projectDetails[index] || "暂无详细描述。";
    // 用内联样式控制外观，避免改动 style.css
    detail.style.display = "none";        // 初始收起（刷新后也默认收起）
    detail.style.marginTop = "10px";
    detail.style.paddingTop = "10px";
    detail.style.borderTop = "1px dashed #e5e7eb";
    detail.style.color = "#4b5563";
    detail.style.fontSize = "14px";

    /* 2.2 创建“点击提示”文字，提示用户这里可点 */
    const hint = document.createElement("p");
    hint.textContent = "▸ 点击查看详情";
    hint.style.marginTop = "10px";
    hint.style.color = "#1A56DB";
    hint.style.fontSize = "13px";
    hint.style.cursor = "pointer";

    /* 2.3 把详情和提示插入卡片末尾；整卡设为可点击手势 */
    card.appendChild(detail);
    card.appendChild(hint);
    card.style.cursor = "pointer";

    /* 2.4 点击卡片 → 切换展开 / 收起 */
    card.addEventListener("click", function () {
      const isHidden = detail.style.display === "none";
      if (isHidden) {
        detail.style.display = "block";   // 展开
        hint.textContent = "▾ 收起详情";   // 提示文字同步变化
      } else {
        detail.style.display = "none";    // 收起
        hint.textContent = "▸ 点击查看详情";
      }
    });
  });
});

/* =========================================================
   交互：头像上传（仅作用于顶部 .avatar 区域）
   初始显示默认头像 avatar.jpg；
   点击圆圈 → 选择图片 → 显示并保存，刷新后保留；可多次更换。
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {

  // 获取头像区域的元素
  const box   = document.getElementById("avatarBox");    // 圆圈容器
  const input = document.getElementById("avatarInput");  // 隐藏的文件选择器
  const img   = document.getElementById("avatarImg");    // 头像图片

  // 0) 恢复上次的头像：img 默认 src 是 avatar.jpg（默认头像）；
  //    若本地保存过上传的头像，则覆盖为保存的那张（刷新后仍在）
  try {
    const saved = localStorage.getItem("avatarData");
    if (saved) img.src = saved;
  } catch (err) {}

  // 1) 点击圆圈 → 打开文件选择框
  box.addEventListener("click", function () {
    input.click();
  });

  // 2) 选中图片后读取并显示（可多次更换，每次都会覆盖保存）
  input.addEventListener("change", function () {
    const file = input.files && input.files[0];
    if (!file) return;                       // 没选文件就退出
    const reader = new FileReader();          // 浏览器自带的读文件工具
    reader.onload = function (e) {
      img.src = e.target.result;             // 图片内容（base64 格式）
      // 覆盖保存，刷新后保留（file:// 下可能禁用，用 try 防止报错）
      try { localStorage.setItem("avatarData", e.target.result); } catch (err) {}
    };
    reader.readAsDataURL(file);               // 把图片读成可显示的地址
  });
});

/* =========================================================
   交互：深 / 浅 主题切换（新增）
   点击右上角按钮在深色与浅色之间切换，可多次使用；
   偏好存 localStorage，刷新后保持（file:// 下禁用则用 try 防止报错）。
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const btn  = document.getElementById("themeToggle");
  const root = document.documentElement;       // <html> 元素

  // 0) 恢复上次选择：若存的是 dark 就加上 dark 类
  try { if (localStorage.getItem("theme") === "dark") root.classList.add("dark"); } catch (err) {}

  // 1) 点击按钮 → 切换 dark 类，并保存选择
  btn.addEventListener("click", function () {
    root.classList.toggle("dark");             // 有则去掉，无则加上
    try {
      localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
    } catch (err) {}
  });
});

/* =========================================================
   交互：作品区筛选（新增，仅作用于作品区）
   点击分类按钮只显示该分类作品；"全部"显示所有；可反复切换。
   说明：未用 localStorage，刷新后默认回到“全部”（即初始状态）。
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".filter-btn");   // 所有筛选按钮
  const works   = document.querySelectorAll(".works .work");  // 所有作品

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.getAttribute("data-filter");

      // 1) 切换高亮：点到谁，谁亮，其余取消
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      // 2) 遍历作品：filter 为 all 全显示，否则只显示分类匹配的
      works.forEach(function (work) {
        const match = (filter === "all") || (work.getAttribute("data-category") === filter);
        work.style.display = match ? "" : "none";
      });
    });
  });
});
