// 初始化云开发
wx.cloud.init({
  env: 'friday-4g84qq5vab762cd2'  // 替换为你的云开发环境 ID
});

const db = wx.cloud.database();  // 获取云数据库实例
const contactsCollection = db.collection('contacts');  // 指向 'contacts' 集合

Page({
  data: {
    avatarUrl: '', // 上传头像
    contact: {},  // 用于存储从数据库中获取的联系人数据
    contactId: "",  // 存储联系人的 _id
    isEditing: false  // 是否处于编辑模式
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    const self = this;

    // 从 options 获取传递过来的联系人 _id
    const contactId = options.id;
    self.setData({ contactId: contactId });

    // 从数据库中根据 id 获取联系人信息
    contactsCollection.doc(contactId).get({
      success: function (res) {
        console.log("数据库返回的数据:", res.data);  // 打印返回的数据

        // 设置页面的联系人数据和头像 URL
        self.setData({
          contact: res.data,  // 设置联系人数据
          avatarUrl: res.data.avatarUrl || '' // 设置头像 URL
        });
      },
      fail: function (err) {
        console.error("数据库读取失败: ", err);
        wx.showToast({
          title: '获取联系人失败',
          icon: 'none'
        });
      }
    });
  },

  // 上传存储头像
  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count: 1, // 默认选择一张图片
      sizeType: ['original', 'compressed'], // 可以选择原图或压缩图
      sourceType: ['album', 'camera'], // 可以选择来源于相册或相机
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          avatarUrl: tempFilePaths[0]
        });

        // 将选择的头像路径存储到本地
        wx.setStorageSync('userAvatar', tempFilePaths[0]); // 存储到本地
      },
      fail: function (err) {
        if (err.errMsg === "chooseImage:fail cancel") {
          console.log("用户取消选择图片");
          wx.showToast({
            title: '图片选择已取消',
            icon: 'none',
            duration: 2000
          });
        } else {
          console.error("图片选择失败: ", err);
          wx.showToast({
            title: '图片选择失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  onEditContact: function () {
    this.setData({
      isEditing: true // 切换到编辑模式
    });
  },
  
  // 保存联系人修改
  onSaveContact: function () {
    const self = this;
    const updatedContact = self.data.contact;

    // 检查必填字段
    if (!updatedContact.name || !updatedContact.phone) {
      wx.showToast({
        title: '姓名和电话不能为空',
        icon: 'none'
      });
      return;
    }

    // 更新联系人信息到数据库
    contactsCollection.doc(self.data.contactId).update({
      data: {
        name: updatedContact.name,
        phone: updatedContact.phone,
        email: updatedContact.email,
        address: updatedContact.address,
        avatarUrl: self.data.avatarUrl // 更新头像 URL
      },
      success: function () {
        wx.showToast({
          title: '联系人已更新',
          icon: 'success'
        });

        // 保存成功后退出编辑模式
        self.setData({
          isEditing: false
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
        console.error("更新联系人失败: ", err);
      }
    });
  },

  // 处理输入框内容变化
  onNameInput: function (e) {
    this.setData({
      'contact.name': e.detail.value
    });
  },

  onPhoneInput: function (e) {
    this.setData({
      'contact.phone': e.detail.value
    });
  },

  onEmailInput: function (e) {
    this.setData({
      'contact.email': e.detail.value
    });
  },

  onAddressInput: function (e) {
    this.setData({
      'contact.address': e.detail.value
    });
  },

  // 删除联系人
  onDeleteContact: function () {
    const self = this;
    wx.showModal({
      title: '删除确认',
      content: '你确定要删除这个联系人吗？',
      success: function (res) {
        if (res.confirm) {
          // 如果用户点击确认，删除联系人
          contactsCollection.doc(self.data.contactId).remove({
            success: function () {
              wx.showToast({
                title: '联系人已删除',
                icon: 'success'
              });

              // 使用 wx.redirectTo 返回到主页面 index，并刷新联系人列表
              wx.redirectTo({
                url: '/pages/index/index',  // 跳转到 index 页面
              });
            },
            fail: function (err) {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
              console.error("删除联系人失败: ", err);
            }
          });
        }
      }
    });
  }
});