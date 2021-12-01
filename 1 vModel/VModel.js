/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-01 08:54:16
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-01 17:02:32
 * @Description: 
 */
/**
 * 第一步 将数据转化为响应式数据  通过 Object.defineProperty() or Proxy
 * 第二步 input -> input/keyup -> 时间处理函数的绑定 -> 改变数据
 * 第三部 相关 dom 绑定数据，操作数据的某个属性 -> 数据改变后，对应DOM就改变
 */
class VModel {
  constructor({ el, data }) {
    this.el = document.querySelector(el);
    this._data = data; //_data 临时保存
    this.dynNode = {}; //保存动态节点

    this.init();
  }
  init() {
    this.initData();
    this.initDom(this.el);
  }
  initDom(el) {
    this.bindDom(el);
    this.bindInput(el);
  }
  //遍历所有的dom，如果有{{}}，则添加为动态节点，方便后面替换为数据
  bindDom(el) {
    const childNodes = el.childNodes;
    childNodes.forEach((item) => {
      if (item.nodeType === 3) {
        //节点类型为3，即文本节点
        this.bindText(item);
      }
      item.childNodes && this.bindDom(item); //如果有子节点就递归遍历
    });
  }
  //动态节点的添加
  bindText(el) {
    const _this = this;
    const _text = el.textContent;
    const reg = /\{\{(.*)\}\}/;
    if (reg.test(_text)) {
      const key = _text.match(reg)[1];
      this.dynNode[key] = el.parentNode;
      el.parentNode.innerHTML = this.data[key]||undefined;
    }
  }
  //找到所有input，如果是有v-model的，绑定事件
  bindInput(el) {
    const _this = this;
    const _allInput = el.querySelectorAll("input");
    _allInput.forEach((item) => {
      //获取所有v-model的data属性
      const _VModel = item.getAttribute("v-model");
      if (_VModel) {
        item.addEventListener("keyup", () => {
          this.data[_VModel] = item.value;
        });
      }
    });
  }
  //将数据转化为响应式数据
  initData() {
    const _this = this;
    this.data = {};
    for (let key in this._data) {
      // this.data;
      // console.log("this.data ", this.data);
      Object.defineProperty(this.data, key, {
        get() {
          // _this.this.bindDom(el);
          console.log("获取数据", key, _this._data[key]);
          return _this._data[key];
        },
        set(newVal) {
          console.log("设置数据", key, newVal);
          _this.dynNode[key].innerHTML = newVal;
          _this._data[key] = newVal;
        },
      });
    }
    // console.log(this.data['age']);
    // this.data['age'] = 18;
  }
}
