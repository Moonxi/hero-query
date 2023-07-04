;(async () => {
  /**
   * 从网络获取当前的英雄数据
   * @returns Promise
   */
  async function getHeroes() {
    return fetch('https://study.duyiedu.com/api/herolist')
      .then(resp => resp.json())
      .then(resp => resp.data.reverse())
  }
  const data = await getHeroes()
  // 检查最多有几个英雄类型
  // console.log(
  //   data.map(item => {
  //     let count = 0
  //     const typeList = []
  //     for (const k in item) {
  //       if (item.hasOwnProperty(k)) {
  //         if (k.includes('hero_type')) {
  //           count++
  //           typeList.push(k)
  //         }
  //       }
  //     }
  //     return { count, typeList }
  //   })
  // )
  // 定义分类
  const typeMap = {
    3: '坦克',
    1: '战士',
    2: '法师',
    4: '刺客',
    5: '射手',
    6: '辅助',
    10: '周免',
    11: '新手'
  }
  // 根据分类处理英雄数组
  const herosMap = {}
  for (const k in typeMap) {
    if (typeMap.hasOwnProperty(k)) {
      herosMap[k] = data.filter(hero => hero.hero_type === +k || hero.hero_type2 === +k || hero.pay_type === +k)
    }
  }
  // 获取需要操作的dom元素
  const doms = {
    queryHeros: document.querySelector('.query-heros'),
    queryNavBodyItems: document.querySelectorAll('.query-nav-body-item'),
    querySearch: document.querySelector('#querySearch')
  }
  // 定义事件处理函数
  const eventHandlers = {
    // 导航项点击事件处理函数
    clickNav(e) {
      doms.queryNavBodyItems.forEach(item => item.classList.remove('active'))
      this.classList.add('active')
      const type = this.dataset.type
      if (type === 'all') {
        return showHeros(data)
      }
      showHeros(herosMap[type])
    },
    // 根据名字搜索英雄事件
    searchHeros(e) {
      // 先显示全部英雄
      showHeros(data)
      doms.queryNavBodyItems.forEach(item => item.classList.remove('active'))
      Array.from(doms.queryNavBodyItems)
        .find(item => item.dataset.type === 'all')
        .classList.add('active')
      showHeros(getHeroesByName(this.value))
    }
  }

  // 定义初始化函数
  function init() {
    // 初始化配置导航栏
    initNav()
    // 初始化事件
    initEvents()
    // 默认显示全部英雄
    showHeros(data)
    doms.queryNavBodyItems.forEach(item => item.classList.remove('active'))
    Array.from(doms.queryNavBodyItems)
      .find(item => item.dataset.type === 'all')
      .classList.add('active')
  }
  // 定义初始化事件函数
  function initEvents() {
    // 为所有导航绑定点击事件
    doms.queryNavBodyItems.forEach(item => item.addEventListener('click', eventHandlers.clickNav))
    doms.querySearch.addEventListener('input', eventHandlers.searchHeros)
  }
  // 定义配置导航栏对应英雄类型的函数
  function initNav() {
    doms.queryNavBodyItems.forEach(item => {
      let dataType
      for (const k in typeMap) {
        if (item.innerText.includes(typeMap[k])) {
          dataType = k
          break
        }
      }
      dataType = dataType || 'all'
      item.setAttribute('data-type', dataType)
    })
  }
  // 定义根据所给英雄数组显示英雄函数
  function showHeros(heros) {
    doms.queryHeros.innerHTML = ''
    if (heros === [] || !heros) {
      return
    }
    const html = heros
      .map(
        hero => `<a href="https://pvp.qq.com/web201605/herodetail/${hero.ename}.shtml" target="_blank" class="query-heros-item">
    <div class="query-heros-avatar" style="background-image: url('https://game.gtimg.cn/images/yxzj/img201606/heroimg/${hero.ename}/${hero.ename}.jpg');"></div>
    <div class="query-heros-name">${hero.cname}</div>
  </a>`
      )
      .join('')
    doms.queryHeros.innerHTML = html
  }
  // 定义根据输入名字获取相应英雄数组函数
  function getHeroesByName(name) {
    return data.filter(hero => hero.cname.includes(name))
  }
  init()
})()
