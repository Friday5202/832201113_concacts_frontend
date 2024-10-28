// 初始化云开发
wx.cloud.init({
  env: 'friday-4g84qq5vab762cd2'  // 你的云开发环境 ID
});

const db = wx.cloud.database();  // 获取云数据库实例
const contactsCollection = db.collection('contacts');  // 指向 'contacts' 集合

Page({
  data: {
    name: '',
    phone: '',
    email: '',
    address: '',
    avatarUrl: ''  // 新增字段用于存储头像 URL
  },

  // 输入框事件处理
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  onEmailInput(e) {
    this.setData({
      email: e.detail.value
    });
  },

  onAddressInput(e) {
    this.setData({
      address: e.detail.value
    });
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAvatar(tempFilePath);
      }
    });
  },

  // 上传头像到云存储
  uploadAvatar(filePath) {
    const cloudPath = `avatars/${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;  // 生成唯一文件名
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        this.setData({
          avatarUrl: res.fileID  // 保存文件 ID
        });
        wx.showToast({
          title: '头像上传成功',
        });
      },
      fail: err => {
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        });
        console.error('头像上传失败：', err);
      }
    });
  },

  // 保存联系人
  saveContact() {
    const { name, phone, email, address, avatarUrl } = this.data;

    // 检查姓名和电话是否填写
    if (!name || !phone) {
      wx.showToast({
        title: '请填写必要的联系人信息',
        icon: 'none'
      });
      return;
    }

    // 将联系人信息保存到云数据库
    contactsCollection.add({
      data: {
        name: name,
        phone: phone,
        email: email,
        address: address,
        avatarUrl: avatarUrl  // 保存头像 URL
      },
      success: res => {
        wx.showToast({
          title: '联系人已保存',
        });

        // 保存成功后跳转到新的 index 页面
        wx.redirectTo({
          url: '/pages/index/index',  // 跳转到新的 index 页面
        });
      },
      fail: err => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
        console.error('数据库添加失败：', err);
      }
    });
  }
});