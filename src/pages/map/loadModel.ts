import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import DB from '@/utils/indexDb';
import equipment from '@/models/equiment';
import { Local, Session } from '@/utils/session';
import { ab2str } from '@/utils/utils';

import {
  DB_MODELES_NAME,
  TAG_GROUP,
  CHANGECOLOR,
  GROUP_NAMES,
  MODAL_OPT,
  MY_DB,
  FILELoader,
  ObjectLoader,
  onProgress,
} from './modelsOpt';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const k = screenWidth / screenHeight; // 窗口宽高比
const map = new Map();

/**
 * 初始变量
 */
let db: any;
let controls: any;
let skyCamera: any;
let skyScene: any;
let MapEl: any;
let camera: any;
let scene: any;
let renderer: any;
let geometry;
let material;
let mesh: any;

/**
 * 初始数据接收变量
 */
let modelsList: any[] = [];

// 楼层是否隐藏，用来区分是否点击烟感设备
let allFloorTransparent = false;

// websocket心跳检测
let heartBeatTimer;

/**
 * 设备图标
 */
const ICONS = getIcons();
/**
 * 模型统一路径
 */
const MODEL_PATH = '/';

/**
 * 模型列表收录文件路径
 */
const MODEL_FILE_PATH = `${MODEL_PATH}models.json`;

/**
 * 模型统一组合
 */
const ALL_GROUP = new THREE.Group();

/**
 * 加载模型
 * @param el 承载模型容器
 */
export function init(el: any) {
  if (el) {
    MapEl = el;
    Local.remove('warnList');
    Session.clear();

    initDb();

    // 区分支持不支持 indexDb
    if (db) {
      dbCheck()
        .then(() => {
          modelsInit();
        })
        .catch(err => {
          console.log(err);
          loadModelsList()
            .then(() => {
              modelsInit();
            })
            .catch(err => {
              console.log(err);
            });
        });
    } else {
      loadModelsList()
        .then(() => {
          modelsInit();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

/**
 * 获取设备图标
 */
function getIcons() {
  const { state } = equipment;
  const { eqIcons } = state;
  return eqIcons;
}

/**
 * 加载DB
 */
function initDb() {
  db = new DB(MY_DB);
  let dbVerLocal = Local.get('bhDbVer');
  if (!dbVerLocal || dbVerLocal != MY_DB.version) {
    db.deletdatabase(MY_DB.name)
      .then(() => {
        Local.set('bhDbVer', `${MY_DB.version}`);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  db.open();
  db.transaction();
}

/**
 * 载入模型列表文件
 */
function loadModelsList() {
  return new Promise((reslove, reject) => {
    FILELoader.load(
      MODEL_FILE_PATH,
      response => {
        let res: { ver: number; list: [] } = JSON.parse(response);

        if (!db) {
          modelsList = [...res.list];
          reslove();
        } else {
          db.add([
            {
              id: DB_MODELES_NAME,
              content: DB_MODELES_NAME + JSON.stringify(res.list),
            },
          ])
            .then(() => {
              console.log([...res.list], '[...res.list]');
              modelsList = [...res.list];
              reslove();
            })
            .catch(() => {
              reject('数据存储失败， db add');
            });
        }
      },
      undefined,
      () => {
        reject('models.json load error');
      },
    );
  });
}

/**
 * 检查本地是否有缓存，并赋值modelsList
 */
function dbCheck() {
  return new Promise((reslove, reject) => {
    db.readId(DB_MODELES_NAME)
      .then((req: { id: string; content: string } | undefined) => {
        if (req) {
          modelsList = calcMsgData(DB_MODELES_NAME, req.content)
            ? calcMsgData(DB_MODELES_NAME, req.content)
            : [];
          reslove();
        }
        if (!modelsList.length) {
          reject('modelsList为空, dbcheck success');
        }
      })
      .catch(() => {
        reject('modelsList获取失败, dbcheck error');
      });
  });
}

/**
 * 检查数据缓存是否有漏掉的模型
 */

function modelsCheck() {
  if (!modelsList.length) {
    console.log('模型文件列表数据为空');
    return;
  }

  let dataList: any[] = [];

  modelsList.forEach(item => {
    if (item.children) {
      item.children.forEach((citem: any) => {
        dataList.push(
          Object.assign(citem, {
            dbName: item.name + citem.name,
          }),
        );
      });
    } else {
      dataList.push(
        Object.assign(item, {
          dbName: item.name,
        }),
      );
    }
  });

  let prs: any[] = [];
  dataList.forEach((item, index) => {
    var pr = new Promise((resolve, reject) => {
      db.readNameIndex(item.dbName)
        .then((res: { type: string; result: any }) => {
          resolve(res);
        })
        .catch(() => {
          reject(`第${index}条数据查询失败`);
        });
    });
    prs.push(pr);
  });

  Promise.all(prs).then(
    e => {
      console.log('ok');
    },
    e => {
      console.log(e);
      console.log('数据查询失败');
    },
  );
}

/**
 *
 * @param type 类型
 * @param data 需要转换的数据源
 */
function calcMsgData(type: string, data: string) {
  if (!type || !data) return;
  let info = data.split(type) ? data.split(type) : [];

  let res;
  if (info.length > 0) {
    res = JSON.parse(info[1]);
  }

  return res;
}

/**
 * 模型文件列表格式化
 */
function modelsListFromat() {
  if (!modelsList.length) return;
  let formatList: any[] = [];
  modelsList.forEach((item, index) => {
    if (item.children) {
      item.children.forEach((citem: any) => {
        let obj = Object.assign(citem, {
          dbName: `${item.name}${citem.name}`,
          path: `${item.path}${citem.path}`,
          parent: item.name,
        });

        formatList.push(obj);
      });
    } else {
      formatList.push(
        Object.assign(item, {
          dbName: item.name,
        }),
      );
    }
  });
  return formatList;
}

/**
 * 模型加载
 */
function modelsInit() {
  initSky();
  initScene();
  initControls();
  loaderJson();
  animate();
  modelsCheck();
}

/**
 * 加载天空场景
 */
function initSky() {
  skyScene = new THREE.Scene();
  skyScene.background = new THREE.CubeTextureLoader()
    .setPath(`${MODEL_PATH}sky_back/`)
    .load([
      'right.png',
      'left.png',
      'top.png',
      'down.png',
      'back.png',
      'front.png',
    ]);
  skyCamera = new THREE.PerspectiveCamera(60, k, 0.1, 1000);
  skyCamera.position.set(10, 0, 10);
}

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, k, 1, 10000);
  camera.position.set(0, 520, 800);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const d = 1000;
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
  dirLight.position.set(-1, 180, 30);
  dirLight.position.multiplyScalar(30);
  dirLight.target = ALL_GROUP;
  dirLight.castShadow = false;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.near = 20;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  dirLight.shadow.bias = -0.0001;

  scene.add(dirLight);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.autoClear = false;
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // document.body.appendChild(renderer.domElement);
  MapEl.appendChild(renderer.domElement);
}

/**
 * 加载控制器
 */
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.enableKeys = false;

  // controls.maxZoom = 10;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI * (90 / 190);
}

/**
 * 加载事件，调用html5 api requestAnimationFrame 进行无缝刷新
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(skyScene, skyCamera);
  renderer.render(scene, camera);
}

/**
 * 加载单个模型
 */
function loaderJson() {
  let models = modelsListFromat() || [];

  if (!models.length) return;
  models.forEach((item, index) => {
    let isEnd = index === models.length - 1 ? true : false;
    let floorEnd: boolean = isFLoorEnded(item, models[index + 1]);
    // loadServer(isEnd, floorEnd, item, 'add');
    db.readNameIndex(item.dbName)
      .then(res => {
        console.log(res);
        // if (!res || !res.result || !res.result.content) {
        //   loadServer(isEnd, floorEnd, item, 'add');
        // } else {
        //   // 加载本地缓存模型
        //   loadLocal(isEnd, floorEnd, item, res.result);
        // }
      })
      .catch(() => {
        console.log('数据库模型查找失败');
        // 加载服务器模型
        loadServer(isEnd, floorEnd, item, 'add');
      });
  });
}

/**
 * 判断是否为最后一层
 * @param val 当前数据
 * @param nextVal 下一条数据
 */
function isFLoorEnded(val: any, nextVal: any) {
  if (!nextVal) return true;
  if (!val.parent) return false;
  if (!nextVal.parent) return true;
  if (nextVal.parent && val.parent !== nextVal.parent) return true;
  return false;
}

/**
 *
 * @param isEnd 是否加载完成
 * @param floorEnd 是否最后一层
 * @param data 数据源
 * @param dabtype 数据库操作类型 add | put
 */
function loadServer(
  isEnd: boolean,
  floorEnd: boolean,
  data: any,
  dabtype: 'add' | 'put',
) {
  if (data.type === TAG_GROUP.floor) return;
  let { dbName } = data;
  let fileUrl = `${data.path}`;
  ObjectLoader.load(
    fileUrl,
    object => {
      loadObject(object);
    },
    onProgress,
  );
}

/**
 * 加载模型
 */
function loadObject(obj: any) {
  if (!obj) return;
  console.log(obj, 'obj')
  obj.position.set(MODAL_OPT.scenPX, MODAL_OPT.scenPY, MODAL_OPT.scenPZ);
  obj.scale.set(MODAL_OPT.scalX, MODAL_OPT.scalY, MODAL_OPT.scalZ);
  obj.rotateY(MODAL_OPT.rotateY);
  scene.add(obj);
}
