import React, { useRef } from 'react';
import { message } from 'antd';

import styles from './index.less';

interface AvatarProps {
  customCss?: string;
  onOk: (file: File, url: string) => void;
}

const Avatar: React.FC<AvatarProps> = props => {
  const { onOk, children, customCss } = props;
  const fileRef = useRef();

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('仅支持 jpg/png 格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  function checkFile() {
    if (!fileRef) return;
    const { current } = fileRef;
    if (!current) return;
    current.click();
  }

  function fileChange(e: any) {
    const file = e.target.files[0];
    if (!beforeUpload(file)) return;

    getBase64(file, (url: string) => {
      onOk(file, url);
    });
  }

  return (
    <div className={`${styles.avatar} ${customCss || ''}`} onClick={checkFile}>
      <div className={styles.avatarupload}>{children}</div>
      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={fileChange}
      />
    </div>
  );
};

export default Avatar;
