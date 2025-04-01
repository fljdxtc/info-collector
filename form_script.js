// form_script.js

// 把这里替换成你之前部署 Google Apps Script 时复制的 Web App URL
const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

const form = document.getElementById('infoForm');
const submitButton = document.getElementById('submitButton');
const messageElement = document.getElementById('message');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止表单默认的提交行为

    // 显示加载状态，禁用按钮
    messageElement.textContent = '正在提交...';
    messageElement.className = 'message'; // 清除之前的 success/error class
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7'; // 给用户视觉反馈

    // 从表单获取数据
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // 使用 fetch API 发送 POST 请求到 Google Apps Script
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', // 需要允许跨域请求
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        // 重定向处理：follow 表示跟随重定向，这对于 Apps Script 的 Web App 很重要
        redirect: 'follow',
        // 将 JS 对象转换为 JSON 字符串发送
        body: JSON.stringify(data)
    })
    .then(response => {
         // 检查响应是否OK (status 200-299)
         // Apps Script 重定向后，可能直接返回 HTML 或 JSON，我们需要解析它
         if (!response.ok) {
            // 如果服务器返回错误状态码 (比如 500 Internal Server Error)
            throw new Error(`服务器错误: ${response.status} ${response.statusText}`);
         }
         return response.json(); // 解析 JSON 响应
    })
    .then(result => {
        console.log('Success:', result);
        if (result.result === "success") {
            messageElement.textContent = result.message || '提交成功！';
            messageElement.className = 'message success';
            form.reset(); // 清空表单
        } else {
            // 如果 Apps Script 内部逻辑出错，它会返回 result: "error"
            throw new Error(result.message || '提交失败，未知错误。');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.textContent = `提交失败: ${error.message}. 请稍后再试或联系管理员。`;
        messageElement.className = 'message error';
    })
    .finally(() => {
        // 无论成功或失败，都恢复按钮状态
        submitButton.disabled = false;
         submitButton.style.opacity = '1';
    });
});