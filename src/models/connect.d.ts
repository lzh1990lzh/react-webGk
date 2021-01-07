import { GlobalModelState } from './global';
import { BaseModelState } from './base';
import { MenuModelState } from './menu';
import { EQRoomModelState } from './equimentroom';
import { EquipmentModelState } from './equiment';
import { CrpaModelState } from './crpa';
import { CofpModelState } from './cofp';
import { CmpModelState } from './cmp';
import { HtaModelState } from './hta';
import { PotModelState } from './pot';
import { ActModelState } from './act';
import { AccModelState } from './acc';
import { RtmModelState } from './rtm';

export interface Loading {
  effects: { [key: string]: boolean | undefined };
  models: {
    crpa?: boolean;
    cofp?: boolean;
    cmp?: boolean;
    hta?: boolean;
    pot?: boolean;
    act?: boolean;
    acc?: boolean;
    rtm?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  base: BaseModelState;
  menu: MenuModelState;
  eqroom: EQRoomModelState;
  equipment: EquipmentModelState;
  crpa: CrpaModelState;
  cofp: CofpModelState;
  cmp: CmpModelState;
  hta: HtaModelState;
  pot: PotModelState;
  act: ActModelState;
  acc: AccModelState;
  rtm: RtmModelState;
}
