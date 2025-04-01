// dashboard_script.js

// 再次使用你部署的 Google Apps Script Web App URL
const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

const prizePoolElement = document.getElementById('prizePool');
const totalEntriesElement = document.getElementById('totalEntries');
const nameListElement = document.getElementById('nameList');
const refreshButton = document.getElementById('refreshButton');
const lastUpdatedElement = document.getElementById('lastUpdated');

function fetchData() {
    console.log("Fetching data...");
    // 显示加载状态
    prizePoolElement.textContent = '加载中...';
    totalEntriesElement.textContent = '加载中...';
    nameListElement.innerHTML = '<li class="loading">姓名列表加载中...</li>';
    prizePoolElement.classList.add('loading');
    totalEntriesElement.classList.add('loading');
    lastUpdatedElement.textContent = ''; // 清空上次更新时间
    refreshButton.disabled = true; // 禁用刷新按钮
    refreshButton.style.opacity = '0.7';


    // 使用 fetch API 发送 GET 请求到 Google Apps Script
    fetch(SCRIPT_URL, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
         redirect: 'follow' // 重要
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`网络响应错误: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received:", data);
        if (data.result === "success") {
            // 更新奖池总额
            prizePoolElement.textContent = data.prizePool;
            prizePoolElement.classList.remove('loading');

            // 更新参与人数
            totalEntriesElement.textContent = data.totalEntries;
             totalEntriesElement.classList.remove('loading');

            // 更新姓名列表
            nameListElement.innerHTML = ''; // 清空旧列表
            if (data.names && data.names.length > 0) {
                data.names.forEach(name => {
                    const li = document.createElement('li');
                    li.textContent = name;
                    nameListElement.appendChild(li);
                });
            } else {
                nameListElement.innerHTML = '<li>暂无参与者</li>';
            }

             // 更新时间戳
             const now = new Date();
             lastUpdatedElement.textContent = `数据更新于: ${now.toLocaleTimeString()}`;

        } else {
             throw new Error(data.message || '获取数据失败，服务器返回错误。');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // 显示错误信息
        prizePoolElement.textContent = '错误';
        totalEntriesElement.textContent = '错误';
        nameListElement.innerHTML = `<li class="error">加载数据失败: ${error.message}</li>`;
         prizePoolElement.classList.remove('loading');
         totalEntriesElement.classList.remove('loading');
    })
    .finally(() => {
         // 恢复刷新按钮
        refreshButton.disabled = false;
        refreshButton.style.opacity = '1';
    });
}

// 页面加载时首次获取数据
fetchData();

// 给刷新按钮添加点击事件
refreshButton.addEventListener('click', fetchData);

// (可选) 设置定时自动刷新，例如每 5 分钟 (300000 毫秒)
// setInterval(fetchData, 300000);