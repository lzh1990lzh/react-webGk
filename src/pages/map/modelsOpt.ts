import * as THREE from 'three';

/**
 * 前端数据库名称
 */
export const DB_MODELES_NAME = 'wsd_models_list';

/**
 * 楼层点击变色配置
 */

export const CHANGECOLOR = {
  warn: new THREE.Color('rgb(201, 15, 33)'),
  normal: new THREE.Color('rgb(169, 149, 149)'),
};

/**
 * 标签类型
 */
export const TAG_GROUP = {
  floor: 'floor', // 整栋楼 tag
  cell: 'cell', // 一层tag
  yangan: 'yangan', // 烟感
  dianti: 'dianti',
  anfang: 'anfang',
  renlian: 'renlian',
  guanxian: 'guanxian',
  caolu: 'caolu',
  map: 'map',
  qita: 'qita',
  equip: 'equipment',
  left: 'left',
  right: 'right',
};

/**
 * 分组名称
 */
export const GROUP_NAMES = {
  tree: 'tree',
  yangan: 'yangan', // 烟感
  dianti: 'dianti',
  anfang: 'anfang',
  renlian: 'renlian',
  guanxian: 'guanxian',
};

/**
 * 模型展示配置
 */
export const MODAL_OPT = {
  scalX: 52,
  scalY: 52,
  scalZ: 52,
  eqscalX: 20,
  eqscalY: 20,
  eqscalZ: 20,
  scenPY: 0,
  scenPX: 0,
  scenPZ: -200,
  // scenPX: 1600,
  // scenPZ: 20,
  rotateY: 0,
};

/**
 * INDEX DB配置
 */
export const MY_DB = {
  name: 'model',
  version: 1,
  db: null,
  ojstore: {
    name: 'objconverJson', // 存储空间表的名字
    keypath: 'nid', // 主键 name混合生成
  },
};

/**
 * 加载进度条
 * @param xhr 加载返回值
 */
export const onProgress = function(xhr: any) {
  if (xhr.lengthComputable) {
    var percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(`${Math.round(percentComplete).toFixed(2)}% downloaded`);
  }
};

/**
 * loader加载器
 */
export const FILELoader = new THREE.FileLoader();
export const ObjectLoader = new THREE.ObjectLoader()
export const BufferGeometryLoader = new THREE.BufferGeometryLoader()
