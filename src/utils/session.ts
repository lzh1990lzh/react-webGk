const ls:any = window.localStorage;
const ss:any = window.sessionStorage;

export const Cookie = {
    get(key: string) {
        let arr = document.cookie.split('; ')
        for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].trim().split('=')
            if (arr2[0] == key) {
                return arr2[1]
            }
        }
        return ''
    },
    set(key: string, value: string | number, day: number) {
        let setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (let i in setting) {
                let oDate: any = new Date()
                oDate.setDate(oDate.getDate() + day)
                oDate = oDate.toUTCString()
                document.cookie = i + '=' + setting[i] + ';expires=' + oDate + ';path=/'
            }
        } else {
            let oDate: any = new Date()
            oDate.setDate(oDate.getDate() + day)
            oDate = oDate.toUTCString()
            document.cookie = key + '=' + value + ';expires=' + oDate + ';path=/'
        }
    },
    setMinsCookie(key: string, value: string, mins: number) {
        let setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (let i in setting) {
                let oDate: any = new Date()
                oDate.setMinutes(oDate.getMinutes() + mins)
                oDate = oDate.toUTCString()
                document.cookie = i + '=' + setting[i] + ';expires=' + oDate + ';path=/'
            }
        } else {
            let oDate: any = new Date()
            oDate.setMinutes(oDate.getMinutes() + mins)
            oDate = oDate.toUTCString()
            document.cookie = key + '=' + value + ';expires=' + oDate + ';path=/'
        }
    },
    remove(key: string) {
        let setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Array') {
            setting.forEach((key: string) => {
                this.set(key, 1, -1)
            })
        } else {
            this.set(key, 1, -1)
        }
    }
};


export const Local = {
    get(key: string) {
        if (key) return JSON.parse(ls.getItem(key))
        return null
    },
    set(key: string, val: string) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (const i in setting) {
                ls.setItem(i, JSON.stringify(setting[i]))
            }
        } else {
            ls.setItem(key, JSON.stringify(val))
        }
    },
    remove(key: string) {
        ls.removeItem(key)
    },
    clear() {
        ls.clear()
    }
};


export const Session = {
    get(key: string) {
        if (key) return JSON.parse(ss.getItem(key))
        return null
    },
    set(key: string, val: string) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (const i in setting) {
                ss.setItem(i, JSON.stringify(setting[i]))
            }
        } else {
            ss.setItem(key, JSON.stringify(val))
        }
    },
    remove(key: string) {
        ss.removeItem(key)
    },
    clear() {
        ss.clear()
    }
}
