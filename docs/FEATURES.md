# AEOall Theme 功能使用文档

## 目录
1. [主题配置](#主题配置)
2. [页面模块](#页面模块)
3. [产品页组件](#产品页组件)
4. [营销功能](#营销功能)
5. [自定义开发](#自定义开发)
6. [技术文档](./TECHNICAL.md)

---

## 主题配置

### 色彩系统
在 Shopify 后台 → 在线商店 → 主题 → 自定义 → 主题设置 → 色彩系统 中配置：

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| 正文文本 | 页面主要内容颜色 | #1d1d1f |
| 页面背景 | 整体背景色 | #ffffff |
| 线条边框 | 边框和分隔线颜色 | #e5e7eb |
| 按钮背景 | 主按钮背景色 | #000000 |
| 按钮文本 | 主按钮文字颜色 | #ffffff |
| 强调色 | 选中状态/链接颜色 | #2563eb |
| 强调色浅背景 | 强调色背景区域 | #eff6ff |
| 紧迫感颜色 | 库存警告/促销标签 | #db2777 |
| 成功颜色 | 折扣/省钱提示 | #059669 |

### 排版系统
- **标题字体** - 可选择 Shopify 字体库中的字体
- **标题缩放比例** - 80% - 150% 调整标题大小
- **正文字体** - 可选择 Shopify 字体库中的字体

### 营销设置
- **启用退出意图弹窗** - 开启/关闭离站弹窗
- **弹窗折扣码** - 弹窗中显示的折扣代码
- **社交媒体链接** - Facebook、Instagram 地址

---

## 页面模块

### 1. Header (头部)
**文件**: `sections/header.liquid`

功能：
- 公告栏（可自定义文字）
- Logo 上传
- 主导航菜单
- 预测性搜索
- 购物车图标
- 移动端菜单

配置项：
- Logo 图片
- 导航菜单选择
- 公告文字

### 2. Footer (底部)
**文件**: `sections/footer.liquid`

功能：
- 多列内容
- 社交媒体图标
- 支付方式图标

### 3. Featured Collection (特色产品)
**文件**: `sections/featured-collection.liquid`

功能：
- 展示指定-collection的产品
- 响应式网格布局
- "View All" 按钮

配置项：
- 标题文字
- 选择产品-collection
- 显示产品数量（2-12个）
- 是否显示"查看全部"按钮
- 上下间距调整

### 4. Product Page (产品页)
**文件**: `sections/main-product.liquid`

功能：
- 产品图片画廊
- 模块化组件系统
- 粘性信息（移动端）

---

## 产品页组件

产品页使用模块化 blocks，可在 `templates/product.json` 中调整顺序：

### 可用组件列表

| 组件 | 说明 |
|------|------|
| `product-title` | 产品标题 |
| `product-price` | 产品价格（支持促销价显示） |
| `variant-picker` | 变体选择器（颜色、尺寸等） |
| `buy-buttons` | 加入购物车按钮 |
| `product-description` | 产品描述 |
| `product-rating` | 产品评分（需安装 Shopify Product Reviews） |
| `product-vendor` | 供应商/品牌 |
| `product-sku` | SKU 编号 |
| `inventory-status` | 库存状态（库存不足警告） |
| `comparison-table` | 产品对比表 |
| `product-share` | 社交分享按钮 |
| `button` | 自定义按钮 |
| `heading` | 自定义标题 |
| `text` | 自定义文本 |
| `spacer` | 间距块 |

### 自定义产品页布局
编辑 `templates/product.json` 文件中的 `block_order` 数组即可调整组件顺序。

---

## 营销功能

### 退出意图弹窗
**文件**: `snippets/exit-intent.liquid`

功能：
- 检测用户鼠标离开浏览器窗口
- 显示折扣弹窗
- 可自定义折扣码

配置：
- 在主题设置中启用
- 设置弹窗显示的折扣码

### 社交分享
支持：
- Facebook
- Pinterest
- Twitter

---

## 自定义开发

### 添加自定义 CSS
在 `assets/` 目录添加 CSS 文件，然后在对应 section 中引入：

```liquid
{{ 'your-custom.css' | asset_url | stylesheet_tag }}
```

### 添加自定义 JavaScript
在 `assets/` 目录添加 JS 文件：

```liquid
{{ 'your-custom.js' | asset_url | script_tag }}
```

### 创建新的 Section
1. 在 `sections/` 目录创建 `.liquid` 文件
2. 添加 `{% schema %}` 定义配置选项
3. 在主题编辑器中使用

### 创建新的 Block
1. 在 `blocks/` 目录创建 `.liquid` 文件
2. 在产品页模板中添加 block 引用

---

## 常见问题

### Q: 如何修改产品页显示的组件？
A: 编辑 `templates/product.json` 文件，调整 `block_order` 数组中的顺序。

### Q: 如何添加新的产品图片？
A: 在 Shopify 后台产品页面管理中上传图片。

### Q: 如何更改公告栏内容？
A: 在主题编辑器中选择 Header 部分，修改 Announcement text 设置。

### Q: 预测搜索不工作？
A: 确保 `sections/predictive-search.liquid` 和相关 assets 文件已正确部署。

---

## 更新日志

### v1.2.0
- 新增产品页模块化组件系统
- 新增预测性搜索
- 优化移动端体验
- 新增退出意图弹窗

### v1.1.0
- 新增产品对比表组件
- 新增库存状态显示
- 优化产品画廊

### v1.0.0
- 初始版本发布
