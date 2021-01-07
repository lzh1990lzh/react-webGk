/**
 * @param { dbObject } 数据库所需属性
 */
export default class DB {
  constructor(dbObject) {
    this.name = dbObject.name;
    this.version = dbObject.version;
    this.objstore = dbObject.ojstore;
    this.indexDB = window.indexedDB || window.webkitindexedDB;
  }

  // 其实就是对应indexDB的对象来封装一些这个里面使用的对象

  // 打开数据库，其实这个可以做到上面的constructor里面，或者下面db()函数里面
  async open() {
    return new Promise((resolve, reject) => {
      const request = this.indexDB.open(this.name, this.version);

      request.onerror = e => {
        console.log('打开数据库失败');
        reject({
          type: 'error',
        });
      };

      request.onsuccess = e => {
        console.log('打开成功');
        // console.log(request)
        resolve({
          type: 'success',
          obj: e.target.result,
        });
      };
      request.onupgradeneeded = e => {
        let objStore;
        if (!e.target.result.objectStoreNames.contains(this.objstore.name)) {
          objStore = e.target.result.createObjectStore(this.objstore.name, {
            keyPath: 'id',
          });
          // get其实是这个keyPath的值
          objStore.createIndex('id', 'id', {
            unique: false,
          });
          // objStore.createIndex('email', 'email', {
          //     unique: true
          // })
        }
        console.log('升级数据库');
        resolve(e);
      };
    });
  }

  // 返回当前数据库的实体，之后的函数使用这个
  async db() {
    return new Promise((resolve, reject) => {
      let request = this.indexDB.open(this.name, this.version);
      request.onerror = e => {
        reject({
          type: 'error',
        });
      };
      request.onsuccess = e => {
        // 我在第一次open的
        resolve(e.target.result);
      };
    });
  }

  async transaction(writeable = false) {
    let mode = writeable ? 'readwrite' : 'readonly';
    return new Promise((resolve, reject) => {
      this.db().then(
        e => {
          const transaction = e
            .transaction([this.objstore.name], mode)
            .objectStore(this.objstore.name);
          resolve(transaction);
        },
        e => {
          reject('transaction 失败');
        },
      );
    });
  }
  // 关掉数据库
  async close() {
    return this.db().then(e => {
      e.close().then(e => {
        console.log('1');
      });
      return {
        type: 'success',
      };
    });
  }
  async add(value) {
    return new Promise((resolve, reject) => {
      this.transaction('readwrite').then(e => {
        let re = [];
        for (let i = 0; i < value.length; i++) {
          let pr = new Promise((resolve, reject) => {
            const request = e.add(value[i]);
            request.onsuccess = e => {
              resolve('添加成功');
            };
            request.onerror = e => {
              reject(`第${i}条数据添加失败`);
            };
          });
          re.push(pr);
        }
        Promise.all(re).then(
          e => {
            resolve('ok');
          },
          e => {
            reject('数据添加失败');
          },
        );
      });
    });
  }
  readId(index) {
    return new Promise((resolve, reject) => {
      this.db().then(e => {
        const transaction = e
          .transaction([this.objstore.name])
          .objectStore(this.objstore.name);
        let re = transaction.get(index);
        re.onsuccess = e => {
          resolve(e.target.result);
        };
        re.onerror = e => {
          console.log(e);
        };
      });
    });
  }

  async readAll() {
    return new Promise((resolve, reject) => {
      this.transaction().then(e => {
        let re = [];
        console.log(e);
        e.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            re.push(cursor.value);
            cursor.continue();
          } else {
            resolve({
              typpe: 'success',
              result: re,
            });
          }
        };
        e.openCursor().onerror = e => {
          reject({
            type: 'error',
          });
        };
      });
    });
  }

  async readNameIndex(name) {
    return new Promise((resolve, reject) => {
      this.transaction().then(e => {
        const re = e.index('id').get(name);
        re.onsuccess = e => {
          let result = e.target.result;

          if (result) {
            resolve({
              type: 'success',
              result: result,
            });
          } else {
            reject({
              type: 'error',
            });
          }
        };
        re.onerror = e => {
          reject({
            type: 'error',
          });
        };
      });
    });
  }

  async put(value) {
    return new Promise((resolve, reject) => {
      // 根据上面定义的东西要先检查一下数据的格式是否规范，可以执行put方法
      this.transaction('readwrite').then(e => {
        const re = e.put(value);

        re.onerror = e => {
          reject({
            type: 'error',
            msg: '数据更新失败',
          });
        };

        re.onsuccess = e => {
          this.readId(value.id).then(e => {
            resolve({
              type: 'ok',
              msg: '数据更新成功',
              result: e,
            });
          });
        };
      });
    });
  }

  async deleteIndex(index) {
    // 首先要确认数据库里面有这个数据
    return new Promise((resolve, reject) => {
      this.transaction('readwrite').then(e => {
        const re = e.delete(index);
        re.onsuccess = () => {
          resolve({
            type: 'success',
          });
        };

        re.onerror = () => {
          reject({
            type: 'error',
          });
        };
      });
    });
  }

  async deletdatabase(name) {
    return new Promise((resolve, reject) => {
      let deletdatabase = this.indexDB.deleteDatabase(name);

      deletdatabase.onerror = function(event) {
        reject({
          type: 'error',
          msg: `数据库${name}删除失败`,
          event: event,
        });
      };

      deletdatabase.onsuccess = function(event) {
        resolve({
          type: 'success',
          msg: `数据库${name}删除成功`,
          event: event,
        });
      };
    });
  }
}
