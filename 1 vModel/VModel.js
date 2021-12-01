/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-01 08:54:16
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-01 15:22:25
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

    this.init();
  }
  init() {
    this.initData();
    this.initDom(this.el)
  }
  initDom(el) {
    this.bindInput(el);
  }
  bindInput(el){
    const _this = this;
    const _allInput = el.querySelectorAll('input')
    _allInput.forEach(item => {   //获取所有v-model的data属性
      const _VModel = item.getAttribute('v-model');
      if(_VModel){
        item.addEventListener("keyup",()=>{
          this.data[_VModel] = item.value;
          console.log(this);
        },false);
      }
    })
  }
  //将数据转化为响应式数据
  initData() {
    const _this = this;
    this.data = {};
    for (let key in this._data) {
      // this.data;
      console.log("this.data ", this.data);
      Object.defineProperty(this.data, key, {
        get() {
          console.log("获取数据",key,_this._data[key]);
          return _this._data[key];
        },
        set(newVal) {
          console.log("设置数据",key,newVal);
          _this._data[key] = newVal;
        },
      });
    }
    // console.log(this.data['age']);
    // this.data['age'] = 18;
  }
}
