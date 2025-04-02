const { mcp_playwright_browser_navigate, mcp_playwright_browser_click_text, mcp_playwright_browser_evaluate } = require('./mcp');
const { mcp_github_create_or_update_file } = require('./mcp');

async function autoLogin() {
    // 1. 访问B站登录页面
    await mcp_playwright_browser_navigate({ url: 'https://passport.bilibili.com/login' });
    
    // 2. 点击QQ登录按钮
    await mcp_playwright_browser_click_text({ text: 'QQ登录' });
    
    // 3. 等待页面加载并获取用户信息
    const userInfo = await mcp_playwright_browser_evaluate({
        script: `(() => {
            const username = document.querySelector('.user-name')?.textContent;
            const stats = Array.from(document.querySelectorAll('.n-statistics .n-data')).map(el => ({
                title: el.getAttribute('title'),
                value: el.textContent.trim()
            }));
            return { username, stats };
        })()`
    });
    
    // 4. 保存用户信息到GitHub
    await mcp_github_create_or_update_file({
        owner: 'yizhiakuya',
        repo: 'bilibili-auto-login',
        path: 'user_info.json',
        content: JSON.stringify(userInfo, null, 2),
        message: '更新用户信息',
        branch: 'master'
    });
    
    return userInfo;
}