// 初始化云开发
wx.cloud.init({
  env: 'friday-4g84qq5vab762cd2'  // 替换为你的云开发环境 ID
});

const db = wx.cloud.database();  // 获取云数据库实例
const contactsCollection = db.collection('contacts');  // 指向 'contacts' 集合

Page({
  data: {
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#",  // 字母表，包括 # 符号
    contact: [],  // 用于存储原始联系人姓名
    filteredContacts: [],  // 用于存储筛选后的联系人
    loc: "",
    screenHeight: 0,
    searchTerm: ""  // 存储搜索框中的内容
  },

  // 从云数据库中获取联系人姓名
  loadContactsFromDatabase() {
    let self = this;
    contactsCollection.field({
      name: true,  // 只获取姓名字段
      _id: true    // 需要传递联系人 _id 用于跳转
    }).get({
      success: res => {
        let contacts = res.data;  // 获取到的联系人数组
        self.arrangeContact(contacts);  // 调用联系人分组方法
      },
      fail: err => {
        console.error('从数据库获取联系人失败：', err);
      }
    });
  },

  // 整理通讯录，中文姓名归类到 #，英文姓名按首字母分组
  arrangeContact(contacts) {
    var self = this;
    var contact = [];

    // 遍历字母表，对联系人进行分组
    for (var i = 0; i < self.data.letters.length; i++) {
      var letter = self.data.letters[i];
      var group = [];

      // 遍历联系人，按规则进行分组
      for (var j = 0; j < contacts.length; j++) {
        let contactItem = contacts[j];
        let contactName = contactItem.name;

        // 如果是中文，将其归类到 #
        let contactLetter = /^[\u4e00-\u9fa5]+$/.test(contactName[0]) 
          ? "#"  // 中文姓名归类到 #
          : contactName[0].toUpperCase();  // 英文名直接取首字母

        // 如果首字母匹配当前字母，加入该分组
        if (contactLetter === letter) {
          group.push(contactItem);  // 只保存联系人姓名
        }
      }

      // 将分组添加到联系人列表
      contact.push({
        letter: letter,
        group: group
      });
    }

    self.setData({
      contact: contact,
      filteredContacts: contact  // 初始时展示所有联系人
    });
  },

  // 监听搜索框输入事件，实时筛选联系人
  onSearchInput: function (e) {
    const searchTerm = e.detail.value.toLowerCase();  // 获取搜索框中的值
    this.setData({
      searchTerm: searchTerm
    });

    // 调用筛选方法
    this.filterContacts();
  },

  // 根据搜索框内容筛选联系人
  filterContacts: function () {
    const self = this;
    const searchTerm = self.data.searchTerm;

    if (!searchTerm) {
      // 如果搜索框为空，显示全部联系人
      self.setData({
        filteredContacts: self.data.contact
      });
      return;
    }

    // 筛选联系人
    const filteredContacts = self.data.contact.map(group => {
      const filteredGroup = group.group.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm)
      );
      return {
        letter: group.letter,
        group: filteredGroup
      };
    }).filter(group => group.group.length > 0);  // 过滤掉没有匹配联系人的组

    // 更新页面的显示内容
    self.setData({
      filteredContacts: filteredContacts
    });
  },

  onLoad: function () {
    this.loadContactsFromDatabase();  // 加载联系人姓名数据
    var screenHeight = wx.getSystemInfoSync().screenHeight;
    this.setData({
      screenHeight: screenHeight * 2,
    });
  },

  onTapScroll: function (e) {
    var loc = e.currentTarget.dataset.loc;  // 获取点击的字母
    this.setData({
      loc: loc  // 将该字母设置为 scroll-into-view 的目标
    });
  },

  onAddContact() {
    wx.navigateTo({
      url: '/pages/add/add'  // 跳转到添加联系人页面
    });
  }
});
