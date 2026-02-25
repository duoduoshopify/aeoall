# AEOall Theme 技术文档

## 目录
1. [项目概述](#项目概述)
2. [目录结构](#目录结构)
3. [核心组件](#核心组件)
4. [购物车系统](#购物车系统)
5. [产品页组件](#产品页组件)
6. [问题修复记录](#问题修复记录)
7. [API 接口](#api-接口)

---

## 项目概述

AEOall 是一个基于 Shopify 2.0 的高性能电商主题，采用模块化架构设计，支持：

- AJAX 异步购物车（无需刷新页面）
- 产品页模块化组件系统
- 响应式设计
- 退出意图弹窗
- 预测性搜索

---

## 目录结构

```
AEOall/
├── assets/                    # CSS、JavaScript、图片资源
│   ├── global.js              # 全局 JavaScript（含 ProductForm 组件）
│   ├── product-form.js        # 产品表单组件（AJAX 加购）
│   ├── cart-drawer.js         # 购物车抽屉组件
│   ├── variant-selects.js     # 变体选择器组件
│   ├── section-main-product.css # 产品页样式
│   ├── component-cart-drawer.css # 购物车抽屉样式
│   ├── base.css               # 基础样式
│   └── ...
├── blocks/                    # 可复用主题块
│   ├── buy-buttons.liquid     # 购买按钮
│   ├── variant-picker.liquid  # 变体选择器
│   └── ...
├── sections/                 # 主题区块
│   ├── main-product.liquid    # 产品页主区块
│   ├── cart-drawer.liquid     # 购物车抽屉
│   ├── header.liquid          # 头部
│   └── ...
├── snippets/                  # 代码片段
│   ├── mobile-sticky-cta.liquid # 移动端粘性购买按钮
│   └── ...
├── templates/                 # 页面模板
│   ├── product.json            # 产品页模板
│   ├── collection.json        # 集合页模板
│   └── ...
└── docs/                      # 文档
```

---

## 核心组件

### 1. ProductForm 组件

**文件**: `assets/global.js` / `assets/product-form.js`

负责处理产品页的 AJAX 提交，将传统的表单提交转换为异步请求。

```javascript
customElements.define('product-form', class ProductForm extends HTMLElement {
  onSubmitHandler(evt) {
    evt.preventDefault();
    // 发送 AJAX 请求到 /cart/add
  }
});
```

**功能**:
- 拦截表单提交
- 显示加载动画
- 处理错误信息
- 触发购物车抽屉更新

### 2. CartDrawer 组件

**文件**: `assets/cart-drawer.js`

管理购物车抽屉的显示和交互。

```javascript
customElements.define('cart-drawer', class CartDrawer extends HTMLElement {
  open() { /* 打开抽屉 */ }
  close() { /* 关闭抽屉 */ }
  renderContents(parsedState) { /* 渲染购物车内容 */ }
  updateQuantity(line, quantity) { /* 更新数量 */ }
});
```

### 3. VariantSelects 组件

**文件**: `assets/variant-selects.js`

处理产品变体的选择和价格更新。

```javascript
customElements.define('variant-selects', class VariantSelects extends HTMLElement {
  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.renderProductInfo(); // 局部刷新变体信息
  }
});
```

---

## 购物车系统

### 工作流程

1. 用户点击 Add to Cart
2. ProductForm 拦截提交，发送 AJAX 请求到 `/cart/add`
3. 请求时附加 `sections=cart-drawer` 参数，获取购物车 HTML
4. CartDrawer 使用返回的 HTML 渲染内容并打开抽屉
5. 购物车图标数量同步更新

### 优化说明

- **减少网络请求**: 加购时一次性获取购物车 HTML，避免重复请求
- **乐观 UI**: 按钮立即显示加载状态，提升感知速度
- **错误处理**: 支持库存不足等错误提示

---

## 产品页组件

### Buy Buttons 组件

**文件**: `blocks/buy-buttons.liquid`

产品页的购买按钮组，包含 Add to Cart 和 Buy Now 按钮。

```liquid
<product-form>
  {% form 'product', product, id: 'product-form-main' %}
    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
    <button type="submit" name="add" id="ProductSubmitButton-{{ section.id }}" class="atc-btn">
      <span class="atc-text">{{ 'products.product.add_to_cart' | t }}</span>
      <div class="atc-slider"></div>
    </button>
  {% endform %}
</product-form>
```

**重要**: 按钮必须包含 `id="ProductSubmitButton-{{ section.id }}"` 属性，以便变体选择器更新按钮状态。

### 样式效果

- **滑块动画**: 鼠标悬停时黑色滑块从左向右滑动
- **加载状态**: 加购时显示旋转加载动画
- ****: 缺禁用状态货时按钮变灰且不可点击

---

## 问题修复记录

### 1. Add to Cart 按钮点击不灵敏

**问题**: 按钮偶尔点击无效，选中缺货变体后按钮状态不更新

**原因**: 
- 按钮缺少 `id` 属性，导致 `variant-selects.js` 无法正确更新 disabled 状态
- 按钮 padding 不足，点击区域过小

**修复** (`blocks/buy-buttons.liquid`):
```liquid
<button
  type="submit"
  name="add"
  id="ProductSubmitButton-{{ section.id }}"  <!-- 新增 ID -->
  class="atc-btn atc-slider-effect"
>
```

**修复** (`assets/section-main-product.css`):
```css
.atc-btn.atc-slider-effect {
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 2. 购物车弹窗弹出慢

**问题**: 加购后弹窗延迟明显

**原因**: 
- `cart-drawer.js` 的 `renderContents` 方法没有使用 product-form 已获取的购物车数据
- 而是重新发起请求获取购物车 HTML
- 造成重复网络请求

**修复** (`assets/cart-drawer.js`):
```javascript
renderContents(parsedState) {
  // 优先使用 product-form 已经获取的 HTML
  if (parsedState && parsedState.sections && parsedState.sections['cart-drawer']) {
    const html = new DOMParser().parseFromString(
      parsedState.sections['cart-drawer'], 'text/html'
    );
    this.innerHTML = html.querySelector('cart-drawer').innerHTML;
    this.updateCartCount();
    this.open();
  } else {
    // 后备：发起新请求
    fetch(`${window.routes.cart_url}?section_id=cart-drawer`)...
  }
}
```

### 3. API 响应格式问题

**问题**: 请求返回格式不正确，导致购物车更新失败

**原因**: `Accept` 头设置为 `application/javascript`，应该使用 `application/json`

**修复** (`assets/product-form.js`, `assets/global.js`):
```javascript
headers: {
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': 'application/json'  // 修正为 application/json
}
```

---

## API 接口

### 加购接口

```
POST /cart/add
Content-Type: application/x-www-form-urlencoded

id={variant_id}&quantity=1&sections=cart-drawer&sections_url=/products/{handle}
```

响应:
```json
{
  "sections": {
    "cart-drawer": "<cart-drawer>...</cart-drawer>"
  }
}
```

### 购物车更新接口

```
POST /cart/change
Content-Type: application/json

{"line": 1, "quantity": 2, "sections": "cart-drawer"}
```

---

## 维护指南

### 添加新功能

1. 在对应的 `assets/` 目录添加 JS/CSS 文件
2. 在 `layout/theme.liquid` 中引入资源
3. 使用 `defer` 属性延迟加载非关键脚本

### 调试技巧

1. 打开浏览器开发者工具 → Network 标签
2. 观察 `/cart/add` 请求是否成功
3. 检查 Console 是否有错误信息

### 性能优化

- 图片使用 `loading="lazy"` 延迟加载
- CSS/JS 资源使用 Shopify CDN 自动优化
- 避免在循环中使用过多的 Liquid 标签

---

## 更新日志

### v1.2.1
- 修复 Add to Cart 按钮点击不灵敏问题
- 优化购物车弹窗弹出速度
- 修复 API 响应格式问题

### v1.2.0
- 新增模块化产品页
- 新增预测性搜索
- 新增退出意图弹窗

### v1.1.0
- 新增产品对比表
- 新增库存状态显示
